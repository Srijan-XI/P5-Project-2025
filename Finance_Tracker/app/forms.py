from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, FloatField, SelectField, TextAreaField, DateTimeField
from wtforms.validators import DataRequired, Email, Length, NumberRange, EqualTo
from datetime import datetime

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirm Password', 
                             validators=[DataRequired(), EqualTo('password', message='Passwords must match')])

class TransactionForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=1, max=100)])
    amount = FloatField('Amount', validators=[DataRequired(), NumberRange(min=0.01)])
    description = TextAreaField('Description', validators=[Length(max=500)])
    type = SelectField('Type', choices=[('income', 'Income'), ('expense', 'Expense')], validators=[DataRequired()])
    category_id = SelectField('Category', coerce=int, validators=[DataRequired()])
    date = DateTimeField('Date', default=datetime.now, format='%Y-%m-%d %H:%M')

class CategoryForm(FlaskForm):
    name = StringField('Category Name', validators=[DataRequired(), Length(min=1, max=50)])
    color = StringField('Color', validators=[DataRequired()], default='#007bff')