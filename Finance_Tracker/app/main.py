from flask import Blueprint, render_template, request
from flask_login import login_required, current_user
from app.models import Transaction, Category, db
from sqlalchemy import func, desc
from datetime import datetime, timedelta

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/dashboard')
@login_required
def dashboard():
    # Get recent transactions
    recent_transactions = Transaction.query.filter_by(user_id=current_user.id)\
                                         .order_by(desc(Transaction.date))\
                                         .limit(10).all()
    
    # Calculate totals
    total_income = db.session.query(func.sum(Transaction.amount))\
                            .filter_by(user_id=current_user.id, type='income')\
                            .scalar() or 0
    
    total_expenses = db.session.query(func.sum(Transaction.amount))\
                              .filter_by(user_id=current_user.id, type='expense')\
                              .scalar() or 0
    
    balance = total_income - total_expenses
    
    # Get monthly data (current month)
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    next_month = (current_month.replace(day=28) + timedelta(days=4)).replace(day=1)
    
    monthly_income = db.session.query(func.sum(Transaction.amount))\
                              .filter(Transaction.user_id == current_user.id,
                                     Transaction.type == 'income',
                                     Transaction.date >= current_month,
                                     Transaction.date < next_month)\
                              .scalar() or 0
    
    monthly_expenses = db.session.query(func.sum(Transaction.amount))\
                                .filter(Transaction.user_id == current_user.id,
                                       Transaction.type == 'expense',
                                       Transaction.date >= current_month,
                                       Transaction.date < next_month)\
                                .scalar() or 0
    
    # Category wise expenses for current month
    category_expenses = db.session.query(Category.name, func.sum(Transaction.amount).label('total'))\
                                 .join(Transaction)\
                                 .filter(Transaction.user_id == current_user.id,
                                        Transaction.type == 'expense',
                                        Transaction.date >= current_month,
                                        Transaction.date < next_month)\
                                 .group_by(Category.name)\
                                 .order_by(desc('total'))\
                                 .limit(5).all()
    
    # Prepare display data
    balance_class = 'bg-primary' if balance >= 0 else 'bg-warning'
    
    # Enrich transactions with display logic
    for t in recent_transactions:
        t.text_class = 'text-success' if t.type == 'income' else 'text-danger'
        t.badge_class = 'bg-success' if t.type == 'income' else 'bg-danger'
        t.display_type = t.type.capitalize()
    
    return render_template('dashboard.html',
                         recent_transactions=recent_transactions,
                         total_income=total_income,
                         total_expenses=total_expenses,
                         balance=balance,
                         balance_class=balance_class,
                         monthly_income=monthly_income,
                         monthly_expenses=monthly_expenses,
                         category_expenses=category_expenses)