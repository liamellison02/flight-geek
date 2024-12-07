from dotenv import load_dotenv
load_dotenv('.env', override=True)

import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://lellison:Dirtybird21!@localhost:5432/flight_geek_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')