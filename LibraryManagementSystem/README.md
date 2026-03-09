# Library Management System

A modern, feature-rich library management system with a beautiful glassmorphic UI, built with a full-stack architecture.

## 🎨 Features

- **Modern UI/UX**: Premium glassmorphism design with smooth animations
- **Dashboard**: Real-time statistics and activity tracking
- **Book Management**: Add, edit, delete, and search books
- **Member Management**: Track library members and their borrowing history
- **Transaction System**: Issue and return books with due date tracking
- **Analytics**: Visual charts showing library performance metrics
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with glassmorphism effects
- **JavaScript (ES6+)** - Interactive functionality
- **Bootstrap 5** - Responsive framework
- **TailwindCSS** - Utility-first CSS
- **Chart.js** - Data visualization
- **Google Fonts (Inter & Outfit)** - Premium typography

### Backend
- **Python/Flask** - REST API server
- **SQLite** - Database
- **Node.js/Express** - Static file server and API proxy

### C++ Integration
- Existing C++ library system (Book.cpp, Library.cpp)
- Database: library.dat

## 📁 Project Structure

```
LibraryManagementSystem/
├── web/                    # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles/
│   │   └── main.css       # Complete CSS styling
│   └── js/
│       └── app.js         # Application logic
├── api/                   # Python Flask API
│   └── app.py            # API endpoints
├── server/               # Node.js server
│   └── server.js        # Express server
├── data/                # Database files
│   └── library.db       # SQLite database (auto-created)
├── include/             # C++ headers
│   ├── Book.hpp
│   └── Library.hpp
├── src/                 # C++ source
│   ├── Book.cpp
│   ├── Library.cpp
│   └── main.cpp
├── package.json         # Node.js dependencies
└── requirements.txt     # Python dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip

### Quick Start (Recommended)

**Option 1: Automated Setup & Launch**

```bash
# Install all dependencies
setup.bat

# Launch everything (C++ system + API + Web server)
run.bat
```

This will:
- ✅ Start the C++ library system (if built)
- ✅ Start the Python API server on port 5000
- ✅ Start the Node.js web server on port 3000
- ✅ Automatically open your browser to http://localhost:3000

**Option 2: Individual Launchers**

```bash
start.bat           # Launch API + Web server only
start-api.bat       # Launch API server only
start-server.bat    # Launch web server only
```

### Manual Setup (Step-by-Step)

### Step 1: Install Node.js Dependencies

```bash
npm install
```

### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Start the API Server (Terminal 1)

```bash
python api/app.py
```

The API will run on `http://localhost:5000`

### Step 4: Start the Node.js Server (Terminal 2)

```bash
npm start
```

The web server will run on `http://localhost:3000`

### Step 5: Open in Browser

Navigate to `http://localhost:3000` in your web browser.

## 📡 API Endpoints

### Books
- `GET /api/books` - Get all books (with optional filters)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add a new member

### Transactions
- `POST /api/transactions/issue` - Issue a book
- `POST /api/transactions/return` - Return a book

### Activities
- `GET /api/activities` - Get recent activities

### Statistics
- `GET /api/stats` - Get library statistics

## 🎯 Usage

### Adding a Book
1. Click the "Add New Book" button
2. Fill in the book details (title, author, ISBN, category, description)
3. Click "Add Book"

### Issuing a Book
1. Go to the Books section
2. Click on a book card
3. Click "Issue Book"
4. Select member and due date
5. Confirm

### Searching Books
Use the search bar to find books by:
- Title
- Author
- ISBN

Apply filters for:
- Category
- Availability status

## 🎨 Design Features

### Color Palette
- Primary: Purple/Indigo gradients (#667eea → #764ba2)
- Secondary: Blue gradients (#4facfe → #00f2fe)
- Success: Green gradients (#43e97b → #38f9d7)
- Warning: Orange/Pink gradients (#fa709a → #fee140)

### Effects
- Glassmorphism cards
- Smooth hover animations
- Micro-interactions
- Dynamic stat counters
- Shimmer effects on book covers
- Gradient borders and backgrounds

## 🔧 Development

### For Development Mode (with auto-reload):

```bash
npm run dev
```

### Running Only the API:

```bash
npm run api
```

## 📊 Database Schema

The SQLite database contains the following tables:

- **books**: Book information and availability
- **members**: Library member details
- **transactions**: Book issue/return records
- **activities**: Activity log for dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Library Management Team

## 🙏 Acknowledgments

- Bootstrap team for the responsive framework
- TailwindCSS for utility classes
- Chart.js for data visualization
- Google Fonts for beautiful typography

---

**Note**: Make sure both the Python API server and Node.js server are running for full functionality. The system will work with mock data if the API is unavailable, but features like persistence will be limited.
