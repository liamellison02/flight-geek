from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Flight(db.Model):
    __tablename__ = 'flights'

    id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(20), unique=True, nullable=False)
    airline_id = db.Column(db.String(10), nullable=True)
    origin = db.Column(db.String(10), nullable=True)
    destination = db.Column(db.String(10), nullable=True)
    departure_time = db.Column(db.DateTime, nullable=False)

    @property
    def lowest_price(self):
        if not self.price_history:
            return None
        return min([price.price for price in self.price_history])

    @property
    def current_price(self):
        if not self.price_history:
            return None
        return self.price_history[-1].price


class Tracker(db.Model):
    __tablename__ = 'trackers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey('flights.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('trackers', cascade="all, delete-orphan", lazy=True))
    flight = db.relationship('Flight', backref=db.backref('trackers', cascade="all, delete-orphan", lazy=True))



class Airline(db.Model):
    __tablename__ = 'airlines'

    id = db.Column(db.Integer, primary_key=True)
    airline_id_iata = db.Column(db.String(10), nullable=False)
    airline_id_icao = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(100), nullable=False)


class Airport(db.Model):
    __tablename__ = 'airports'

    id = db.Column(db.Integer, primary_key=True)
    skyId = db.Column(db.String(10), nullable=False)
    airport_id_iata = db.Column(db.String(10), nullable=False)
    airport_id_icao = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    timezone = db.Column(db.String(100), nullable=False)


class Price(db.Model):
    __tablename__ = 'prices' 

    id = db.Column(db.Integer, primary_key=True)
    flight_id = db.Column(db.Integer, db.ForeignKey('flights.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    flight = db.relationship('Flight', backref=db.backref('price_history', cascade="all, delete-orphan", lazy=True))
