from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, User, Flight, Tracker
from config import Config
from werkzeug.security import generate_password_hash

from dotenv import load_dotenv
load_dotenv('.env', override=True)

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)


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
    flight_number = request.args.get('flight_number')
    flights = Flight.query.filter(Flight.flight_number.ilike(f'%{flight_number}%')).all()
    result = [{
        "id": flight.id,
        "flight_number": flight.flight_number,
        "origin": flight.origin,
        "destination": flight.destination,
        "departure_time": flight.departure_time
    } for flight in flights]

    return jsonify(result), 200


@app.route('/trackers', methods=['POST'])
def create_tracker():
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
