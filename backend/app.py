import os
import requests
from datetime import datetime as dt

from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.security import generate_password_hash

from models import db, User, Flight, Tracker, Price, Airline, Airport
from config import Config

from dotenv import load_dotenv
load_dotenv('.env', override=True)

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

FLIGHT_API_KEY = os.getenv('FLIGHT_API_KEY')
FLIGHT_API_AIRLINE_ENDPOINT = os.getenv('FLIGHT_API_AIRLINE_ENDPOINT')
FLIGHT_API_FLIGHT_ENDPOINT = os.getenv('FLIGHT_API_FLIGHT_ENDPOINT')


def update_flight_prices():
    with app.app_context():
        active_flights = db.session.query(Flight).join(Tracker).distinct().all()
        
        print(f"Checking prices for active flight trackers")
        for flight in active_flights:
            response = requests.get(
                FLIGHT_API_FLIGHT_ENDPOINT,
                params={
                    "flight_number": flight.flight_number,
                    "api_key": FLIGHT_API_KEY
                }
            )

            if response.status_code == 200:
                flight_data = response.json()
                new_price = flight_data.get("price")

                if new_price and new_price != flight.price:
                    price_entry = Price(flight_id=flight.id, price=new_price)
                    db.session.add(price_entry)

                    flight.price = new_price
                    db.session.commit()
                    print(f"Updated price for flight {flight.flight_number} to {new_price}")
            else:
                print(f"Failed to fetch data for flight {flight.flight_number}: {response.text}")

scheduler = BackgroundScheduler()
scheduler.add_job(update_flight_prices, 'cron', minute=0)
scheduler.start()


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid email or password"}), 401


@app.route('/flights', methods=['GET'])
def search_flights():

    filters = ['flight_number', 'airline_id', 'origin', 'destination', 'departure_time']
    query = Flight.query

    for filter_name in filters:
        if filter_name in request.args:
            query = query.filter(getattr(Flight, filter_name) == request.args.get(filter_name))

    flights = query.all()

    result = [
        {
            "id": flight.id,
            "flight_number": flight.flight_number,
            "origin": flight.origin,
            "destination": flight.destination,
            "departure_time": flight.departure_time
        }
        for flight in flights
    ]
    
    return jsonify(result), 200


@app.route('/trackers', methods=['POST', 'GET'])
def tracker_tab():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        flight_id = data.get('flight_id')

        user = User.query.get(user_id)
        flight = Flight.query.get(flight_id)

        if not user or not flight:
            return jsonify({"error": "User or Flight not found"}), 404

        tracker = Tracker(user_id=user_id, flight_id=flight_id)
        db.session.add(tracker)
        db.session.commit()

        return jsonify({"message": "Tracker created successfully"}), 201

    elif request.method == 'GET':
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        trackers = Tracker.query.filter_by(user_id=user_id).all()
        flight_ids = [tracker.flight_id for tracker in trackers]

        price_history = Price.query.filter(Price.flight_id.in_(flight_ids)).order_by(Price.timestamp.desc()).all()

        result = [{
            "flight_id": history.flight_id,
            "price": history.price,
            "timestamp": history.timestamp
        } for history in price_history]

        return jsonify(result), 200


@app.route('/db', methods=['POST', 'PUT'])
def add_local_data():

    if request.method == 'POST':

        if request.args.get('flight') == 'true':
            data = request.get_json()
            for record in data["flights"]:
                flight = Flight(
                    flight_number=record.get('flight_number'),
                    airline_id=record.get('airline_id'),
                    origin=record.get('origin'),
                    destination=record.get('destination'),
                    departure_time=dt.fromtimestamp(record.get('departure_time'))
                )
                db.session.add(flight)
            db.session.commit()
            return jsonify({"message": data}), 201
    
        if request.args.get('price') == 'true':
            data = request.get_json()
            for price in data:
                price = Price(
                    flight_id=price.get('flight_id'),
                    price=price.get('price'),
                    timestamp=dt.fromtimestamp(price.get('timestamp'))
                )
                db.session.add(price)
            db.session.commit()
            return jsonify({"message": "Data added successfully"}), 201
        
        if request.args.get('airport') == 'true':
            data = request.get_json()
            for record in data["airports"]:
                airport = Airport(
                    skyId=record.get('skyId'),
                    airline_id_iata=record.get('airline_id_iata'),
                    airport_id_icao=record.get('airport_id_icao'),
                    name=record.get('name'),
                    timezone=record.get('timezone')
                )
                db.session.add(airport)
            db.session.commit()
            return jsonify({"message": data}), 201
    
    if request.method == 'PUT':

        if request.args.get('flight') == 'true':
            data = request.get_json()
            for record in data["flights"]:
                flight = Flight.query.filter_by(flight_number=record.get('flight_number')).first()
                if flight:
                    flight.airline_id = record.get('airline_id')
                    flight.origin = record.get('origin')
                    flight.destination = record.get('destination')
                    flight.departure_time = dt.fromtimestamp(record.get('departure_time'))
                    db.session.commit()
                 
            return jsonify({"message": "Data updated successfully"}), 201

        if request.args.get('price') == 'true':
            data = request.get_json()
            for price in data["prices"]:
                flight = Flight.query.filter_by(flight_number=price.get('flight_number')).first()
                if flight:
                    price_entry = Price(flight_id=flight.id, price=price.get('price'))
                    db.session.add(price_entry)
                    db.session.commit()
            return jsonify({"message": "Data added successfully"}), 201
    
    return jsonify({"error": "Invalid request"}), 400




@app.route('/refresh', methods=['POST'])
def refresh_data():
    airlines = db.session.query(Airline).all()

    for airline in airlines:
        response = requests.get(
            FLIGHT_API_AIRLINE_ENDPOINT,
            params={
                "airlineIata": airline.airline_id_iata,
                "access_key": FLIGHT_API_KEY,
                "limit": 50
            }
        )
    
        if response.status_code == 200:
            data = response.json()
            for record in data["flights"]:
                flight_number = record.get('flight_number')
                origin = record.get('origin_airport_iata')
                destination = record.get('destination_airport_iata')
                departure_time_unix = record.get('time')
                departure_time = dt.fromtimestamp(departure_time_unix) if departure_time_unix else None
                
                flight = Flight.query.filter_by(
                    flight_number=flight_number,
                    origin=origin,
                    destination=destination,
                    departure_time=departure_time
                ).first()

                price_res = requests.get(
                    FLIGHT_API_FLIGHT_ENDPOINT,
                    params={
                        "flight_number": flight.flight_number,
                        "access_key": FLIGHT_API_KEY
                    }
                )
                if flight:
                    
                    db.session.commit()
                else:
                    flight = Flight(
                        flight_number=record.get('flight_number'),
                        airline_id=record.get('airline_iata'),
                        origin=record.get('origin_airport_iata'),
                        destination=record.get('destination_airport_iata'),
                        departure_time=dt.fromtimestamp(record.get('time'))
                    )
                    db.session.add(flight)
            db.session.commit()
        else:
            return jsonify({"error": "Failed to fetch data"}), 500
    
    for flight in Flight.query.all():
        pass

        # if response.status_code == 200:
        #     data = response.json()
        #     for record in data["data"]:
        #         # date = dt.strptime(record.get('DATE'), "%d %b %Y")
        #         # time = dt.strptime(record.get('STD'), "%-I:%M %p", "")
        #         # if record.get('price'):

        #     new_price = flight_data.get("price")

        #     if new_price and new_price != flight.price:
        #         price_entry = Price(flight_id=flight.id, price=new_price)
        #         db.session.add(price_entry)

        #         flight.price = new_price
        #         db.session.commit()
        #         print(f"Updated price for flight {flight.flight_number} to {new_price}")
        # else:
        #     print(f"Failed to fetch data for flight {flight.flight_number}: {response.text}")


    
    if request.method == 'PUT':

        if request.args.get('flight') == 'true':
            data = request.get_json()
            for record in data["flights"]:
                flight = Flight.query.filter_by(flight_number=record.get('flight_number')).first()
                if flight:
                    flight.airline_id = record.get('airline_id')
                    flight.origin = record.get('origin')
                    flight.destination = record.get('destination')
                    flight.departure_time = dt.fromtimestamp(record.get('departure_time'))
                    db.session.commit()
                 
            return jsonify({"message": "Data updated successfully"}), 201

        if request.args.get('price') == 'true':
            data = request.get_json()
            for price in data["prices"]:
                flight = Flight.query.filter_by(flight_number=price.get('flight_number')).first()
                if flight:
                    price_entry = Price(flight_id=flight.id, price=price.get('price'))
                    db.session.add(price_entry)
                    db.session.commit()
            return jsonify({"message": "Data added successfully"}), 201
    
    return jsonify({"error": "Invalid request"}), 400


if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
