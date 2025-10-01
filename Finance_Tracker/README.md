# 🎉 Finance Tracker - Unified Application

A comprehensive web-based finance tracking application built with Flask, combining the best features from multiple expense tracking implementations.

## ✅ Successfully Combined Three Projects

This unified project successfully analyzed and combined three finance tracking applications into one working solution:

### Original Projects Analyzed:
1. **fintrack** - Flask/Python with SQLite
2. **expense-tracker** - PHP with MySQL  
3. **Expense Tracker** - React frontend

## ✨ Key Features

### 🔐 **User Authentication**
- Secure user registration and login
- Session management with Flask-Login
- Password hashing with Werkzeug

### 💰 **Transaction Management**
- Add, edit, and delete income/expense transactions
- Categorize transactions with color-coded categories
- Date and time tracking
- Search and filter functionality

### 📊 **Dashboard & Analytics**
- Visual summary cards (Income, Expenses, Balance)
- Recent transactions list
- Category-wise expense breakdown
- Monthly statistics
- Interactive charts and graphs

### 📈 **Reports & Export**
- Filter by date range and category
- Export to PDF with professional formatting
- Export to Excel with summary sheets
- Visual category breakdown charts

### 🎨 **Modern UI/UX**
- Responsive Bootstrap 5 design
- Font Awesome icons
- Custom CSS animations
- Mobile-friendly interface

## 🛠 **Technologies Used**

- **Backend**: Flask, SQLAlchemy, Flask-Login, Flask-WTF
- **Database**: SQLite (easily changeable to PostgreSQL/MySQL)
- **Frontend**: Bootstrap 5, Font Awesome, Chart.js
- **Export**: fpdf2 (PDF), openpyxl (Excel)
- **Security**: Werkzeug password hashing
- **Forms**: WTForms with validation

## 🚀 **How to Run the Application**

### Quick Start (Windows):
```bash
cd "p:\CODE-XI\P5-Project-2025\Finance Tracker"
.\setup.bat
```

### Manual Setup:

1. **Navigate to project directory**:
   ```bash
   cd "p:\CODE-XI\P5-Project-2025\Finance Tracker"
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows Command Prompt
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize database**:
   ```bash
   python init_db.py
   ```

6. **Run the application**:
   ```bash
   python run.py
   ```

### 🌐 **Access the Application:**
- Open your browser to: **http://127.0.0.1:5000**
- Register a new account or login
- Start tracking your finances!

## Usage

### Getting Started
1. Register a new account or login with existing credentials
2. Create categories for your transactions (Food, Transportation, Salary, etc.)
3. Start adding your income and expense transactions
4. View your financial overview on the dashboard
5. Generate reports and export data as needed

### Key Features

#### Dashboard
- Visual summary of total income, expenses, and balance
- Recent transactions list
- Category-wise expense breakdown
- Quick action buttons

#### Transaction Management
- Add new transactions with title, amount, category, and description
- Edit or delete existing transactions
- Filter and search through transaction history
- Categorize transactions for better organization

#### Reports
- Filter transactions by date range and category
- Export detailed reports to PDF or Excel
- Category-wise expense analysis
- Visual charts and graphs

#### Categories
- Create custom categories with color coding
- Manage and organize transaction categories
- Category-wise expense tracking

## 📁 **Project Structure**

```
Finance_Tracker/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── models.py            # Database models (User, Transaction, Category)
│   ├── forms.py             # WTForms for validation
│   ├── auth.py              # Authentication routes
│   ├── main.py              # Dashboard routes
│   ├── transactions.py      # Transaction management
│   ├── reports.py           # Report generation & export
│   ├── static/
│   │   ├── css/style.css    # Custom styling
│   │   └── js/app.js        # Interactive features
│   └── templates/           # HTML templates
│       ├── base.html        # Base template
│       ├── index.html       # Landing page
│       ├── dashboard.html   # Main dashboard
│       ├── auth/            # Authentication templates
│       │   ├── login.html
│       │   └── register.html
│       ├── transactions/    # Transaction templates
│       │   └── add.html
│       └── reports/         # Report templates
│           └── dashboard.html
├── instance/
│   └── finance_tracker.db  # SQLite database
├── requirements.txt         # Python dependencies
├── run.py                   # Application entry point
├── init_db.py              # Database setup script
├── setup.bat               # Windows setup script
├── setup.sh                # Linux/Mac setup script
├── PROJECT_SUMMARY.md       # Project documentation
└── README.md               # This file
```

## Configuration

The application uses environment variables for configuration:

- `SECRET_KEY`: Flask secret key for sessions
- `DATABASE_URL`: Database connection string
- `DEBUG`: Enable/disable debug mode

## API Structure

### Models
- **User**: User accounts with authentication
- **Category**: Transaction categories with color coding
- **Transaction**: Income/expense records with relationships

### Routes
- `/`: Landing page
- `/auth/login`: User login
- `/auth/register`: User registration
- `/dashboard`: Main dashboard
- `/transactions/`: Transaction management
- `/reports/`: Report generation and export

## ✨ **Key Improvements Made**

### From Original Projects:
- ✅ **Unified Architecture**: Single Flask application
- ✅ **Enhanced Security**: Proper authentication and validation
- ✅ **Modern UI**: Bootstrap 5 with custom styling
- ✅ **Better UX**: Responsive design and animations
- ✅ **Export Features**: Professional PDF and Excel reports
- ✅ **Category System**: Color-coded transaction categories
- ✅ **Dashboard Analytics**: Visual summaries and charts
- ✅ **Error Handling**: Proper form validation and error messages

### Fixed Issues:
- ✅ **Jinja2 Template Error**: Removed undefined `moment()` function
- ✅ **Missing Dependencies**: Complete requirements.txt
- ✅ **Database Setup**: Automated initialization with default categories
- ✅ **Authentication Flow**: Complete login/register system
- ✅ **Responsive Design**: Mobile-friendly interface

## 🎯 **Ready to Use Features**

1. **User Registration & Login** ✅
2. **Add/Edit/Delete Transactions** ✅
3. **Category Management** ✅
4. **Financial Dashboard** ✅
5. **Detailed Reports** ✅
6. **PDF Export** ✅
7. **Excel Export** ✅
8. **Responsive Design** ✅
9. **Search & Filter** ✅
10. **Visual Analytics** ✅

## 🔮 **Future Enhancements Possible**

- Budget management and alerts
- Recurring transactions
- Multi-currency support
- Email notifications
- API integration
- Mobile app
- Advanced analytics and insights
- Data import/export in multiple formats

## 🧹 **Project Cleanup Completed**

✅ **Clean Project Structure:**
- Removed old project directories (fintrack/, expense-tracker/, Expense Tracker/)
- Cleaned up Python cache files (`__pycache__/`)
- Added comprehensive `.gitignore` file
- Unified all features into single working application

## Contributing

This project combines features from three different finance tracking implementations:
1. **fintrack**: Flask-based application with SQLite
2. **expense-tracker**: PHP application with MySQL
3. **Expense Tracker**: React frontend application

The unified version takes the best features from each and creates a comprehensive solution.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please create an issue in the project repository.

---

**🎉 Your unified Finance Tracker is ready to use!**

The application successfully combines the best features from all three original projects into a modern, secure, and feature-rich finance tracking solution.