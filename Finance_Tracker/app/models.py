from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with transactions
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    color = db.Column(db.String(7), default='#007bff')  # Hex color code
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with transactions
    transactions = db.relationship('Transaction', backref='category', lazy=True)
    
    def __repr__(self):
        return f'<Category {self.name}>'

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(10), nullable=False)  # 'income' or 'expense'
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    
    def __repr__(self):
        return f'<Transaction {self.title}: {self.amount}>'
    
    @property
    def formatted_amount(self):
        return f"₹{self.amount:,.2f}"
    
    @property
    def formatted_date(self):
        return self.date.strftime('%Y-%m-%d %H:%M')