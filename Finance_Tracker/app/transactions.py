from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app.models import Transaction, Category, db
from app.forms import TransactionForm, CategoryForm
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/')
@login_required
def list_transactions():
    page = request.args.get('page', 1, type=int)
    category_filter = request.args.get('category', type=int)
    type_filter = request.args.get('type')
    
    query = Transaction.query.filter_by(user_id=current_user.id)
    
    if category_filter:
        query = query.filter_by(category_id=category_filter)
    
    if type_filter:
        query = query.filter_by(type=type_filter)
    
    transactions = query.order_by(Transaction.date.desc())\
                       .paginate(page=page, per_page=20, error_out=False)
    
    categories = Category.query.all()
    
    return render_template('transactions/list.html', 
                         transactions=transactions, 
                         categories=categories,
                         selected_category=category_filter,
                         selected_type=type_filter)

@transactions_bp.route('/add', methods=['GET', 'POST'])
@login_required
def add_transaction():
    form = TransactionForm()
    
    # Populate category choices
    categories = Category.query.all()
    form.category_id.choices = [(c.id, c.name) for c in categories]
    
    if form.validate_on_submit():
        transaction = Transaction(
            title=form.title.data,
            amount=form.amount.data,
            description=form.description.data,
            type=form.type.data,
            category_id=form.category_id.data,
            date=form.date.data,
            user_id=current_user.id
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        flash(f'Transaction "{transaction.title}" added successfully!', 'success')
        return redirect(url_for('transactions.list_transactions'))
    
    return render_template('transactions/add.html', form=form)

@transactions_bp.route('/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_transaction(id):
    transaction = Transaction.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    form = TransactionForm(obj=transaction)
    
    # Populate category choices
    categories = Category.query.all()
    form.category_id.choices = [(c.id, c.name) for c in categories]
    
    if form.validate_on_submit():
        transaction.title = form.title.data
        transaction.amount = form.amount.data
        transaction.description = form.description.data
        transaction.type = form.type.data
        transaction.category_id = form.category_id.data
        transaction.date = form.date.data
        
        db.session.commit()
        
        flash(f'Transaction "{transaction.title}" updated successfully!', 'success')
        return redirect(url_for('transactions.list_transactions'))
    
    return render_template('transactions/edit.html', form=form, transaction=transaction)

@transactions_bp.route('/delete/<int:id>')
@login_required
def delete_transaction(id):
    transaction = Transaction.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    
    db.session.delete(transaction)
    db.session.commit()
    
    flash(f'Transaction "{transaction.title}" deleted successfully!', 'success')
    return redirect(url_for('transactions.list_transactions'))

@transactions_bp.route('/categories')
@login_required
def manage_categories():
    categories = Category.query.all()
    return render_template('transactions/categories.html', categories=categories)

@transactions_bp.route('/categories/add', methods=['GET', 'POST'])
@login_required
def add_category():
    form = CategoryForm()
    
    if form.validate_on_submit():
        # Check if category already exists
        existing = Category.query.filter_by(name=form.name.data).first()
        if existing:
            flash('Category already exists!', 'danger')
        else:
            category = Category(name=form.name.data, color=form.color.data)
            db.session.add(category)
            db.session.commit()
            flash(f'Category "{category.name}" added successfully!', 'success')
            return redirect(url_for('transactions.manage_categories'))
    
    return render_template('transactions/add_category.html', form=form)