from flask import Blueprint, render_template, request, redirect, url_for
from .models import Transaction
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/dashboard')
def dashboard():
    transactions = Transaction.query.order_by(Transaction.date.desc()).all()
    return render_template('dashboard.html', transactions=transactions)

@main.route('/add', methods=['POST'])
def add_transaction():
    title = request.form['title']
    amount = float(request.form['amount'])
    category = request.form['category']
    t_type = request.form['type']

    new_tx = Transaction(title=title, amount=amount, category=category, type=t_type)
    db.session.add(new_tx)
    db.session.commit()

    return redirect(url_for('main.dashboard'))
