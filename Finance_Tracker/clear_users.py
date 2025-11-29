"""
Simple script to clear user data using SQLite directly (no Flask dependencies)
"""

import sqlite3
import os

def clear_all_users():
    """Clear all users and transactions from the database."""
    
    db_path = os.path.join('instance', 'finance_tracker.db')
    
    if not os.path.exists(db_path):
        print(f"\n❌ Database file not found at: {db_path}")
        print("   The database may not have been created yet.")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get current counts
        cursor.execute("SELECT COUNT(*) FROM user")
        user_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM "transaction"')
        transaction_count = cursor.fetchone()[0]
        
        print("\n" + "=" * 60)
        print("  Finance Tracker - User Data Cleanup Tool")
        print("=" * 60)
        
        print(f"\n📊 Current Database Status:")
        print(f"   Users: {user_count}")
        print(f"   Transactions: {transaction_count}")
        
        if user_count == 0:
            print("\n✅ Database is already clean - no users found!")
            conn.close()
            return
        
        # Display users
        print(f"\n👥 Users to be deleted:")
        cursor.execute("SELECT id, username, email, created_at FROM user")
        users = cursor.fetchall()
        
        for user in users:
            print(f"   - ID: {user[0]}, Username: {user[1]}, Email: {user[2]}")
        
        # Confirm deletion
        print(f"\n⚠️  WARNING: This will delete {user_count} user(s) and {transaction_count} transaction(s)!")
        confirm = input("   Type 'YES' to confirm deletion: ")
        
        if confirm != 'YES':
            print("\n❌ Deletion cancelled.")
            conn.close()
            return
        
        # Delete data
        print("\n🗑️  Deleting transactions...")
        cursor.execute('DELETE FROM "transaction"')
        
        print("🗑️  Deleting users...")
        cursor.execute("DELETE FROM user")
        
        # Commit changes
        conn.commit()
        
        print("\n✅ Successfully deleted all users and transactions!")
        print("   Database is now clean and ready for new users.")
        
        # Verify deletion
        cursor.execute("SELECT COUNT(*) FROM user")
        remaining_users = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM "transaction"')
        remaining_transactions = cursor.fetchone()[0]
        
        print(f"\n📊 Final Database Status:")
        print(f"   Users: {remaining_users}")
        print(f"   Transactions: {remaining_transactions}")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"\n❌ Database error: {str(e)}")
    except Exception as e:
        print(f"\n❌ Error occurred: {str(e)}")

def show_users():
    """Display all users in the database."""
    
    db_path = os.path.join('instance', 'finance_tracker.db')
    
    if not os.path.exists(db_path):
        print(f"\n❌ Database file not found at: {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM user")
        user_count = cursor.fetchone()[0]
        
        print("\n" + "=" * 60)
        print(f"  Total Users: {user_count}")
        print("=" * 60)
        
        if user_count == 0:
            print("\n  No users found in database.")
        else:
            cursor.execute("SELECT id, username, email, created_at FROM user")
            users = cursor.fetchall()
            
            print("\n👥 Users:")
            for user in users:
                print(f"\n   ID: {user[0]}")
                print(f"   Username: {user[1]}")
                print(f"   Email: {user[2]}")
                print(f"   Created: {user[3]}")
                print("   " + "-" * 50)
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"\n❌ Database error: {str(e)}")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--show':
        show_users()
    else:
        clear_all_users()
    
    print("\n" + "=" * 60)
