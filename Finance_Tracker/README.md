# 💰 Finance Tracker

A modern, feature-rich web application for tracking personal finances built with Flask. Monitor income, expenses, generate reports, and gain insights into your spending habits with an intuitive, responsive interface.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.2-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login system
- Password hashing with Werkzeug security
- Session management with Flask-Login
- User-specific data isolation

### 💸 Transaction Management
- **Add, Edit, Delete** transactions with ease
- Categorize income and expenses
- Custom categories with color coding
- Date/time tracking for all transactions
- Search and filter functionality
- Pagination for large transaction lists

### 📊 Interactive Dashboard
- **Real-time financial overview** with animated cards
- Total income, expenses, and balance at a glance
- Recent transactions feed
- Category-wise expense breakdown
- Monthly statistics and trends
- Visual charts powered by Chart.js

### 📈 Reports & Analytics
- Filter reports by date range and category
- **Export to PDF** with professional formatting
- **Export to Excel** with summary sheets
- Category distribution charts
- Transaction history analysis
- Monthly/yearly comparisons

### 🎨 Modern UI/UX
- Responsive design with Bootstrap 5
- Gradient backgrounds and smooth animations
- Hover effects and interactive elements
- Font Awesome icons throughout
- Mobile-friendly interface
- Glass morphism effects
- Dark mode compatible

### 🏷️ Category Management
- Create custom categories for transactions
- Color-coded category system
- Category usage statistics
- Delete protection for categories in use
- Pre-populated default categories

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git (optional)

### Installation

#### Windows (Using PowerShell):
```powershell
# Clone or download the repository
cd E:\Finance_Tracker

# Run automated setup
.\setup.bat

# Access the application
# Open browser to http://127.0.0.1:5000
```

#### Manual Setup (All Platforms):

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**
```bash
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt)
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Initialize database:**
```bash
python init_db.py
```

5. **Run the application:**
```bash
python run.py
```

6. **Access the application:**
- Open your browser to `http://127.0.0.1:5000`
- Register a new account
- Start tracking your finances!

## 📖 Usage Guide

### Getting Started
1. **Register** - Create your account with username, email, and password
2. **Login** - Access your personal dashboard
3. **Add Categories** - Create categories like Food, Transport, Salary, etc.
4. **Add Transactions** - Start logging your income and expenses
5. **View Dashboard** - Monitor your financial health
6. **Generate Reports** - Export data for analysis

### Dashboard Overview
- **Summary Cards**: Total income, expenses, balance, and monthly stats
- **Quick Actions**: Add transaction, view all transactions, generate reports
- **Recent Activity**: Latest 10 transactions with quick edit/delete
- **Category Breakdown**: Visual representation of spending by category
- **Monthly Trends**: Track your financial patterns over time

### Transaction Management
- **Add Transaction**: Click "Add Transaction" from any page
- **Edit/Delete**: Use action buttons on transaction list
- **Filter**: Search by category, type (income/expense), or date
- **Pagination**: Navigate through transaction history

### Reports
- **Date Range**: Select custom date ranges for reports
- **Category Filter**: View specific category transactions
- **PDF Export**: Professional formatted reports with charts
- **Excel Export**: Detailed spreadsheets with summary data

## 🏗️ Project Structure

```
Finance_Tracker/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── models.py                # Database models (User, Transaction, Category)
│   ├── forms.py                 # WTForms for validation
│   ├── auth.py                  # Authentication blueprint
│   ├── main.py                  # Main/Dashboard blueprint
│   ├── transactions.py          # Transaction management blueprint
│   ├── reports.py               # Reports & export blueprint
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css        # Modern custom styling
│   │   └── js/
│   │       └── app.js           # Interactive JavaScript features
│   └── templates/
│       ├── base.html            # Base template with navbar
│       ├── index.html           # Landing page with hero section
│       ├── dashboard.html       # Main dashboard
│       ├── auth/
│       │   ├── login.html       # Login form
│       │   └── register.html    # Registration form
│       ├── transactions/
│       │   ├── list.html        # Transaction list with filters
│       │   ├── add.html         # Add transaction form
│       │   ├── edit.html        # Edit transaction form
│       │   ├── categories.html  # Category management
│       │   └── add_category.html # Add category form
│       └── reports/
│           └── dashboard.html   # Reports and export page
├── instance/
│   └── finance_tracker.db       # SQLite database (auto-created)
├── requirements.txt             # Python dependencies
├── run.py                       # Application entry point
├── init_db.py                   # Database initialization script
├── setup.bat                    # Windows automated setup
├── setup.sh                     # Linux/Mac automated setup
└── README.md                    # This file
```

## 🛠️ Tech Stack

### Backend
- **Flask 3.1.2** - Web framework
- **Flask-SQLAlchemy 3.1.1** - ORM for database management
- **Flask-Login 0.6.3** - User session management
- **Flask-WTF 1.2.2** - Form handling and validation
- **Werkzeug 3.1.0** - Security and password hashing

### Database
- **SQLite** - Default database (easily switchable to PostgreSQL/MySQL)

### Frontend
- **Bootstrap 5** - Responsive CSS framework
- **Font Awesome 6** - Icon library
- **Chart.js** - Interactive charts and graphs
- **Custom CSS** - Modern animations and effects

### Export & Reporting
- **fpdf2 2.8.4** - PDF generation
- **openpyxl 3.1.5** - Excel file creation

### Additional
- **python-dotenv 1.1.0** - Environment variable management
- **WTForms 3.2.1** - Form validation
- **email-validator 2.2.0** - Email validation

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///finance_tracker.db
DEBUG=True
```

### Database Configuration
The application uses SQLite by default. To switch to PostgreSQL or MySQL:

```python
# In app/__init__.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'
# or
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/dbname'
```

## 🎨 Modern UI Features

- **Gradient Hero Section** - Eye-catching landing page
- **Animated Cards** - Smooth fade-in and slide-up animations
- **Hover Effects** - Interactive lift effects on cards and buttons
- **Ripple Effect** - Material design button clicks
- **Progress Bars** - Animated shimmer effects
- **Glass Morphism** - Modern blur effects
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Custom Scrollbar** - Styled scrollbar with gradient
- **Loading States** - Spinner animations for form submissions
- **Smooth Transitions** - All interactions are smooth and fluid

## 🔒 Security Features

- ✅ Password hashing with Werkzeug
- ✅ CSRF protection with Flask-WTF
- ✅ SQL injection prevention via SQLAlchemy ORM
- ✅ Session management with Flask-Login
- ✅ User data isolation
- ✅ Form validation and sanitization
- ✅ Secure cookie handling

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Future Enhancements

- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Email notifications
- [ ] REST API for mobile apps
- [ ] Advanced analytics dashboard
- [ ] CSV import/export
- [ ] Two-factor authentication
- [ ] Dark mode toggle
- [ ] Scheduled reports via email

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ using Flask and modern web technologies.

## 🐛 Known Issues

None at the moment! If you find any bugs, please create an issue.

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Check existing documentation
- Review the code comments for implementation details

## 🙏 Acknowledgments

- Flask team for the amazing framework
- Bootstrap for the responsive CSS framework
- Font Awesome for beautiful icons
- Chart.js for interactive charts
- Open source community for inspiration

---

**⭐ Star this repository if you find it helpful!**

Made with Python 🐍 and Flask 🌶️