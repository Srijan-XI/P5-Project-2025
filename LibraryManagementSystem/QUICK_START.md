# Library Management System - Quick Start Guide

## 🎯 Overview

Welcome to the Library Management System! This guide will help you get up and running in just a few minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- ✅ **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **pip** (comes with Python)

### Verify Installation

Open a terminal and run:

```bash
node --version
python --version
npm --version
pip --version
```

## 🚀 Quick Start (Automated)

### Option 1: One-Click Setup and Launch

1. Run the setup script:
   ```bash
   setup.bat
   ```

2. Once setup is complete, launch the application:
   ```bash
   start.bat
   ```

3. The application will automatically:
   - Start the API server (port 5000)
   - Start the web server (port 3000)
   - Open your browser to http://localhost:3000

That's it! You're ready to use the Library Management System! 🎉

## 📝 Manual Setup (Step-by-Step)

If you prefer manual setup or the automated scripts don't work:

### Step 1: Install Dependencies

#### Install Node.js Dependencies
```bash
npm install
```

This will install:
- express
- cors
- compression
- node-fetch

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask
- Flask-CORS
- Werkzeug

### Step 2: Start the Servers

#### Terminal 1 - Start the API Server
```bash
python api/app.py
```

You should see:
```
✅ Database initialized successfully!
🚀 Starting Library Management System API...
📚 API running on http://localhost:5000
```

#### Terminal 2 - Start the Web Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║   Library Management System - Node.js Server   ║
╚════════════════════════════════════════════════╝

🚀 Server is running on http://localhost:3000
📡 API proxy configured for http://localhost:5000
```

### Step 3: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## 🎨 Features Overview

### Dashboard
- Real-time statistics
- Recent activity feed
- Quick action buttons
- Beautiful animated counters

### Books Management
- Add new books
- Search and filter books
- View book details
- Track availability

### Members Management
- Add library members
- View member directory
- Track borrowed books
- Member status management

### Transactions
- Issue books to members
- Return books
- Track due dates
- Overdue notifications

### Analytics
- Book circulation trends
- Category distribution
- Visual charts and graphs

## 🔧 Troubleshooting

### Port Already in Use

If you get an error that port 3000 or 5000 is already in use:

**For Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the actual Process ID)
taskkill /PID <PID> /F
```

### Python Module Not Found

If you get "ModuleNotFoundError":
```bash
pip install --upgrade -r requirements.txt
```

### Node Modules Missing

If you get module errors:
```bash
rm -rf node_modules
npm install
```

### Database Issues

If you encounter database errors, delete the existing database:
```bash
# Delete the database file
rm data/library.db

# Restart the API server - it will create a fresh database
python api/app.py
```

## 📊 API Endpoints Reference

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/books/:id` - Get specific book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member

### Transactions
- `POST /api/transactions/issue` - Issue a book
- `POST /api/transactions/return` - Return a book

### Activities & Stats
- `GET /api/activities` - Recent activities
- `GET /api/stats` - Library statistics
- `GET /api/health` - Health check

## 🎯 Usage Examples

### Adding a Book

1. Click "Add New Book" button
2. Fill in the form:
   - Title: "The Great Gatsby"
   - Author: "F. Scott Fitzgerald"
   - ISBN: "978-0-7432-7356-5"
   - Category: "Fiction"
   - Description: "A classic novel..."
3. Click "Add Book"

### Searching for Books

Use the search bar to find books by:
- Title
- Author
- ISBN

Apply filters:
- Category (Fiction, Science, Technology, etc.)
- Status (Available, Issued)

## 🌟 Tips & Best Practices

1. **Keep Both Servers Running**: The application needs both the API server and web server to function properly.

2. **Mock Data Available**: If the API server is not running, the frontend will use mock data for demonstration.

3. **Database Auto-Creation**: The SQLite database is created automatically when you first start the API server.

4. **Development Mode**: Use `npm run dev` for auto-reload during development.

5. **Browser Compatibility**: Works best on modern browsers (Chrome, Firefox, Edge, Safari).

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ Internet Explorer (not supported)

## 🔒 Security Notes

This is a development version. For production use:
- Add authentication
- Implement authorization
- Use environment variables for configuration
- Enable HTTPS
- Add input validation
- Implement rate limiting

## 📞 Support

If you encounter any issues:
1. Check the logs in the terminal
2. Review the troubleshooting section
3. Check browser console for errors (F12)
4. Ensure all dependencies are installed

## 🎓 Learning Resources

- **Node.js**: https://nodejs.org/docs/
- **Python Flask**: https://flask.palletsprojects.com/
- **Express**: https://expressjs.com/
- **SQLite**: https://www.sqlite.org/docs.html

---

**Enjoy using the Library Management System!** 📚✨
