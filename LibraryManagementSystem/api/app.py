from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import subprocess
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'library.db')

# ===========================
# DATABASE INITIALIZATION
# ===========================
def init_db():
    """Initialize the database with required tables"""
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Books Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Members Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS members (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Transactions Table (for tracking book issues and returns)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            member_id TEXT NOT NULL,
            transaction_type TEXT NOT NULL,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            due_date TIMESTAMP,
            return_date TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books(id),
            FOREIGN KEY (member_id) REFERENCES members(id)
        )
    ''')
    
    # Activities Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

# ===========================
# SECURITY HELPER
# ===========================
def verify_admin_password(password):
    """Verify admin password using C++ Security Module"""
    try:
        cpp_exe_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'library_mgmt.exe')
        
        # Check if executable exists
        if not os.path.exists(cpp_exe_path):
            print(f"WARNING: C++ Security Module not found at {cpp_exe_path}")
            # Fallback for development if not built
            return password == "admin123"
            
        # Call C++ executable: library_mgmt.exe auth <password>
        result = subprocess.run(
            [cpp_exe_path, "auth", password], 
            capture_output=True, 
            text=True
        )
        
        # Check output for SUCCESS
        return "SUCCESS" in result.stdout
    except Exception as e:
        print(f"Security Check Error: {e}")
        return False

# ===========================
# DATABASE HELPER FUNCTIONS
# ===========================
def get_db_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def dict_from_row(row):
    """Convert sqlite3.Row to dictionary"""
    return dict(zip(row.keys(), row))

# ===========================
# BOOKS API ENDPOINTS
# ===========================
@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books with optional filtering"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get query parameters for filtering
        category = request.args.get('category')
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = 'SELECT * FROM books WHERE 1=1'
        params = []
        
        if category:
            query += ' AND category = ?'
            params.append(category)
        
        if status:
            query += ' AND status = ?'
            params.append(status)
        
        if search:
            query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)'
            search_term = f'%{search}%'
            params.extend([search_term, search_term, search_term])
        
        cursor.execute(query, params)
        books = [dict_from_row(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(books), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
        book = cursor.fetchone()
        conn.close()
        
        if book:
            return jsonify(dict_from_row(book)), 200
        else:
            return jsonify({'error': 'Book not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books', methods=['POST'])
def add_book():
    """Add a new book (Protected Action)"""
    try:
        data = request.get_json()
        
        # Verify Admin Password if provided in headers
        admin_password = request.headers.get('X-Admin-Password')
        if not admin_password:
            # For this demo, we'll allow it but log a warning, or you could enforce it:
            # return jsonify({'error': 'Admin password required'}), 401
            pass
        elif not verify_admin_password(admin_password):
             return jsonify({'error': 'Invalid admin password'}), 403

        # Validate required fields
        required_fields = ['title', 'author', 'isbn', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO books (title, author, isbn, category, description, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['title'],
            data['author'],
            data['isbn'],
            data['category'],
            data.get('description', ''),
            data.get('status', 'available')
        ))
        
        book_id = cursor.lastrowid
        
        # Log activity
        cursor.execute('''
            INSERT INTO activities (type, title, description)
            VALUES (?, ?, ?)
        ''', (
            'add',
            'New Book Added',
            f'"{data["title"]}" by {data["author"]} added to library'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'id': book_id, 'message': 'Book added successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Book with this ISBN already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update a book"""
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if book exists
        cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Book not found'}), 404
        
        # Update book
        update_fields = []
        params = []
        
        for field in ['title', 'author', 'isbn', 'category', 'description', 'status']:
            if field in data:
                update_fields.append(f'{field} = ?')
                params.append(data[field])
        
        params.append(book_id)
        
        cursor.execute(f'''
            UPDATE books SET {', '.join(update_fields)}
            WHERE id = ?
        ''', params)
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Book updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if book exists
        cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
        book = cursor.fetchone()
        
        if not book:
            conn.close()
            return jsonify({'error': 'Book not found'}), 404
        
        cursor.execute('DELETE FROM books WHERE id = ?', (book_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Book deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# MEMBERS API ENDPOINTS
# ===========================
@app.route('/api/members', methods=['GET'])
def get_members():
    """Get all members"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT m.*, 
                   COUNT(CASE WHEN t.transaction_type = 'issue' AND t.return_date IS NULL THEN 1 END) as books_issued
            FROM members m
            LEFT JOIN transactions t ON m.id = t.member_id
            GROUP BY m.id
        ''')
        
        members = [dict_from_row(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(members), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/members', methods=['POST'])
def add_member():
    """Add a new member"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['id', 'name', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO members (id, name, email, phone, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['id'],
            data['name'],
            data['email'],
            data.get('phone', ''),
            data.get('status', 'active')
        ))
        
        # Log activity
        cursor.execute('''
            INSERT INTO activities (type, title, description)
            VALUES (?, ?, ?)
        ''', (
            'add',
            'New Member Added',
            f'{data["name"]} joined the library'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Member added successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Member with this ID or email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# TRANSACTIONS API ENDPOINTS
# ===========================
@app.route('/api/transactions/issue', methods=['POST'])
def issue_book():
    """Issue a book to a member"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'book_id' not in data or 'member_id' not in data:
            return jsonify({'error': 'Missing book_id or member_id'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if book is available
        cursor.execute('SELECT * FROM books WHERE id = ? AND status = ?', 
                      (data['book_id'], 'available'))
        book = cursor.fetchone()
        
        if not book:
            conn.close()
            return jsonify({'error': 'Book not available'}), 400
        
        # Check if member exists
        cursor.execute('SELECT * FROM members WHERE id = ?', (data['member_id'],))
        member = cursor.fetchone()
        
        if not member:
            conn.close()
            return jsonify({'error': 'Member not found'}), 404
        
        # Create transaction
        due_date = data.get('due_date')  # Should be provided by frontend
        
        cursor.execute('''
            INSERT INTO transactions (book_id, member_id, transaction_type, due_date)
            VALUES (?, ?, ?, ?)
        ''', (data['book_id'], data['member_id'], 'issue', due_date))
        
        # Update book status
        cursor.execute('UPDATE books SET status = ? WHERE id = ?', 
                      ('issued', data['book_id']))
        
        # Log activity
        cursor.execute('''
            INSERT INTO activities (type, title, description)
            VALUES (?, ?, ?)
        ''', (
            'issue',
            'Book Issued',
            f'{dict_from_row(member)["name"]} borrowed "{dict_from_row(book)["title"]}"'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Book issued successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions/return', methods=['POST'])
def return_book():
    """Return a book"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'book_id' not in data or 'member_id' not in data:
            return jsonify({'error': 'Missing book_id or member_id'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Find the transaction
        cursor.execute('''
            SELECT * FROM transactions 
            WHERE book_id = ? AND member_id = ? AND transaction_type = 'issue' AND return_date IS NULL
            ORDER BY transaction_date DESC LIMIT 1
        ''', (data['book_id'], data['member_id']))
        
        transaction = cursor.fetchone()
        
        if not transaction:
            conn.close()
            return jsonify({'error': 'No active transaction found'}), 404
        
        # Update transaction
        cursor.execute('''
            UPDATE transactions 
            SET return_date = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (transaction['id'],))
        
        # Update book status
        cursor.execute('UPDATE books SET status = ? WHERE id = ?', 
                      ('available', data['book_id']))
        
        # Get book and member info for activity log
        cursor.execute('SELECT * FROM books WHERE id = ?', (data['book_id'],))
        book = dict_from_row(cursor.fetchone())
        
        cursor.execute('SELECT * FROM members WHERE id = ?', (data['member_id'],))
        member = dict_from_row(cursor.fetchone())
        
        # Log activity
        cursor.execute('''
            INSERT INTO activities (type, title, description)
            VALUES (?, ?, ?)
        ''', (
            'return',
            'Book Returned',
            f'{member["name"]} returned "{book["title"]}"'
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Book returned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# ACTIVITIES API ENDPOINTS
# ===========================
@app.route('/api/activities', methods=['GET'])
def get_activities():
    """Get recent activities"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        limit = request.args.get('limit', 10)
        
        cursor.execute('''
            SELECT * FROM activities 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (limit,))
        
        activities = []
        for row in cursor.fetchall():
            activity = dict_from_row(row)
            # Calculate time ago
            created_at = datetime.fromisoformat(activity['created_at'])
            time_diff = datetime.now() - created_at
            
            if time_diff.seconds < 60:
                activity['time'] = 'Just now'
            elif time_diff.seconds < 3600:
                activity['time'] = f'{time_diff.seconds // 60} minutes ago'
            elif time_diff.seconds < 86400:
                activity['time'] = f'{time_diff.seconds // 3600} hours ago'
            else:
                activity['time'] = f'{time_diff.days} days ago'
            
            activities.append(activity)
        
        conn.close()
        
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# STATISTICS API ENDPOINTS
# ===========================
@app.route('/api/stats', methods=['GET'])
def get_statistics():
    """Get library statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # Total books
        cursor.execute('SELECT COUNT(*) as count FROM books')
        stats['total_books'] = cursor.fetchone()['count']
        
        # Books issued
        cursor.execute('SELECT COUNT(*) as count FROM books WHERE status = "issued"')
        stats['books_issued'] = cursor.fetchone()['count']
        
        # Books available
        cursor.execute('SELECT COUNT(*) as count FROM books WHERE status = "available"')
        stats['books_available'] = cursor.fetchone()['count']
        
        # Total members
        cursor.execute('SELECT COUNT(*) as count FROM members')
        stats['total_members'] = cursor.fetchone()['count']
        
        # Active members
        cursor.execute('SELECT COUNT(*) as count FROM members WHERE status = "active"')
        stats['active_members'] = cursor.fetchone()['count']
        
        # Overdue books
        cursor.execute('''
            SELECT COUNT(*) as count FROM transactions 
            WHERE transaction_type = "issue" 
            AND return_date IS NULL 
            AND due_date < CURRENT_TIMESTAMP
        ''')
        stats['overdue_books'] = cursor.fetchone()['count']
        
        conn.close()
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# ADMIN AUTH ENDPOINT
# ===========================
@app.route('/api/admin/auth', methods=['POST'])
def admin_auth():
    """Verify admin password"""
    try:
        data = request.get_json()
        password = data.get('password')
        
        if not password:
            return jsonify({'error': 'Password required'}), 400
            
        if verify_admin_password(password):
            return jsonify({'message': 'Authentication successful', 'valid': True}), 200
        else:
            return jsonify({'error': 'Invalid password', 'valid': False}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# HEALTH CHECK
# ===========================
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Library Management System API is running',
        'timestamp': datetime.now().isoformat()
    }), 200

# ===========================
# ERROR HANDLERS
# ===========================
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ===========================
# MAIN
# ===========================
if __name__ == '__main__':
    init_db()
    print("🚀 Starting Library Management System API...")
    print("📚 API running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
