# User Data Storage in Finance Tracker

## 📍 Storage Location

User credentials (ID, email, and password) are stored in a **SQLite database** file located at:

```
P:\CODE-XI\P5-Project-2025\Finance_Tracker\instance\finance_tracker.db
```

## 🗄️ Database Structure

### User Table Schema

The `User` model (defined in `app/models.py`) stores the following information:

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key, auto-incremented |
| `username` | String(80) | Unique username |
| `email` | String(120) | Unique email address |
| `password_hash` | String(120) | **Hashed password** (NOT plain text) |
| `created_at` | DateTime | Account creation timestamp |

### Important Security Features

#### 🔒 Password Security
Passwords are **NEVER** stored in plain text. Instead:

1. **Hashing**: When a user registers or changes their password, it's hashed using `Werkzeug`'s `generate_password_hash()` function
   ```python
   def set_password(self, password):
       self.password_hash = generate_password_hash(password)
   ```

2. **Verification**: When logging in, the password is verified using `check_password_hash()`
   ```python
   def check_password(self, password):
       return check_password_hash(self.password_hash, password)
   ```

This means even if someone accesses the database file, they **cannot** retrieve the original passwords.

## 📊 Database Configuration

The database is configured in `app/__init__.py`:

```python
# Default: SQLite database
database_url = os.getenv('DATABASE_URL', 'sqlite:///finance_tracker.db')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
```

### Database Location Explained

- **Default**: `sqlite:///finance_tracker.db`
- **Actual Path**: `instance/finance_tracker.db`
- Flask automatically creates the `instance` folder for instance-specific files like databases

## 🔍 Viewing User Data

### Option 1: Using Python Shell

```python
# Start Python in the project directory
python

# Import necessary modules
from app import create_app, db
from app.models import User

# Create app context
app = create_app()
with app.app_context():
    # Get all users
    users = User.query.all()
    
    # Display user information
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Password Hash: {user.password_hash}")
        print(f"Created: {user.created_at}")
        print("---")
```

### Option 2: Using SQLite Browser

1. Download **DB Browser for SQLite** (free tool)
2. Open the file: `P:\CODE-XI\P5-Project-2025\Finance_Tracker\instance\finance_tracker.db`
3. Navigate to the `user` table
4. View all user records

### Option 3: Using SQLite Command Line

```bash
# Navigate to instance folder
cd P:\CODE-XI\P5-Project-2025\Finance_Tracker\instance

# Open database
sqlite3 finance_tracker.db

# View all users
SELECT * FROM user;

# View specific user
SELECT id, username, email FROM user WHERE username = 'your_username';
```

## 🗂️ Complete Database Schema

The database contains three main tables:

### 1. **user** table
- Stores user credentials and profile information
- Each user has a unique ID, username, and email

### 2. **category** table
- Stores transaction categories (Food, Transport, Salary, etc.)
- Each category has an ID, name, and color code

### 3. **transaction** table
- Stores all financial transactions
- Links to `user` (via `user_id`) and `category` (via `category_id`)
- Contains: title, amount, description, date, type (income/expense)

## 🔐 Security Best Practices

### Current Implementation ✅
- ✅ Passwords are hashed using Werkzeug
- ✅ Database uses SQLAlchemy ORM (prevents SQL injection)
- ✅ CSRF protection with Flask-WTF
- ✅ Session management with Flask-Login
- ✅ User data isolation (users can only see their own data)

### Additional Recommendations 🔒
- 🔒 Keep the database file secure (don't commit to Git)
- 🔒 Use strong SECRET_KEY in production
- 🔒 Enable HTTPS in production
- 🔒 Regular database backups
- 🔒 Consider adding 2FA for extra security

## 📝 Environment Variables

Database location can be changed via `.env` file:

```env
# .env file
DATABASE_URL=sqlite:///finance_tracker.db

# For PostgreSQL (production)
# DATABASE_URL=postgresql://user:password@localhost/finance_tracker

# For MySQL
# DATABASE_URL=mysql://user:password@localhost/finance_tracker
```

## 🚀 Switching Database Types

The application supports multiple database types:

### SQLite (Default - Development)
```python
DATABASE_URL=sqlite:///finance_tracker.db
```

### PostgreSQL (Production)
```python
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### MySQL
```python
DATABASE_URL=mysql://username:password@host:port/database_name
```

## 📋 Summary

**Where user data is stored:**
- **File**: `instance/finance_tracker.db`
- **Full Path**: `P:\CODE-XI\P5-Project-2025\Finance_Tracker\instance\finance_tracker.db`
- **Format**: SQLite database
- **Table**: `user`
- **Password Storage**: Hashed (secure, not plain text)

**What's stored:**
- User ID (auto-generated)
- Username (unique)
- Email (unique)
- Password Hash (encrypted)
- Creation timestamp

**Security Level:** 🔒🔒🔒 High (passwords are hashed, not reversible)

---

**Note**: The database file is created automatically when you first run the application and register a user. If it doesn't exist, run `python init_db.py` to initialize it.
