# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Secret key for session management
    app.config['SECRET_KEY'] = 'super_secret_key'

    # Absolute path to the database
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, '..', 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

    # Initialize DB with app
    db.init_app(app)

    # Import and register blueprint
    from .routes import main
    app.register_blueprint(main)

    return app
