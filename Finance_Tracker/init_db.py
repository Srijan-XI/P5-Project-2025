#!/usr/bin/env python3
"""
Database initialization script for Finance Tracker
Creates the database tables and adds default categories
"""

from app import create_app, db
from app.models import Category

def init_database():
    """Initialize the database with tables and default data"""
    app = create_app()
    
    with app.app_context():
        print("Creating database tables...")
        
        # Create all tables
        db.create_all()
        
        # Check if categories already exist
        if Category.query.count() == 0:
            print("Adding default categories...")
            
            # Default categories with colors
            default_categories = [
                {'name': 'Food & Dining', 'color': '#ff6b6b'},
                {'name': 'Transportation', 'color': '#4ecdc4'},
                {'name': 'Shopping', 'color': '#45b7d1'},
                {'name': 'Entertainment', 'color': '#f9ca24'},
                {'name': 'Bills & Utilities', 'color': '#f0932b'},
                {'name': 'Healthcare', 'color': '#eb4d4b'},
                {'name': 'Education', 'color': '#6c5ce7'},
                {'name': 'Travel', 'color': '#a29bfe'},
                {'name': 'Salary', 'color': '#00b894'},
                {'name': 'Business', 'color': '#fdcb6e'},
                {'name': 'Investment', 'color': '#e17055'},
                {'name': 'Other', 'color': '#636e72'}
            ]
            
            for cat_data in default_categories:
                category = Category(name=cat_data['name'], color=cat_data['color'])
                db.session.add(category)
            
            db.session.commit()
            print(f"Added {len(default_categories)} default categories")
        else:
            print("Categories already exist, skipping...")
        
        print("Database initialization completed successfully!")

if __name__ == '__main__':
    init_database()