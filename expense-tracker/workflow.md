# 🔷 PHASE 1: 📐 Planning & Setup

### 1. Define Scope
   - Track expenses with user login.
   - Monthly reporting with category-wise filtering.
   - Export reports as PDF and Excel.

   ### 2. Tools Required
   ```
   | Tool            | Usage                                        |
| --------------- | -------------------------------------------- |
| XAMPP/WAMP/LAMP | Web server & MySQL                           |
| Composer        | Manage PHP libraries (TCPDF, PhpSpreadsheet) |
| MySQL Workbench | Optional – Database management GUI           |
| Git             | Version control                              |

```

# 🔷 PHASE 2: 🛠 Project Structure & Environment

### 1. Create Directory
```
mkdir expense-tracker && cd expense-tracker
```
### 2. Create Folder Structure
```
expense-tracker/
├── sql/                 ← MySQL schema
├── includes/            ← PHP classes/functions
├── templates/           ← Reusable layout parts
├── pages/               ← App features
├── assets/              ← CSS, JS, images
├── vendor/              ← Composer dependencies
├── index.php            ← Homepage/login redirect
├── register.php         ← User signup
├── login.php            ← User login
├── logout.php           ← Session destroy

```
### 3. Install Dependencies via Composer

```
composer require tecnickcom/tcpdf
composer require phpoffice/phpspreadsheet 
```
# 🔷 PHASE 3: 🧱 Database Configuration

### 1. Create MySQL Database
```
CREATE DATABASE expense_db;
```
### 2. Import Schema
Place the schema in ```sql/database.sql```:

```
-- sql/database.sql

USE expense_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  expense_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
Use phpMyAdmin or MySQL CLI to import it.

# 🔷 PHASE 4: 🧑‍💻 Coding the Application

### 1. User Authentication
```register.php```: handles signup and password hashing

```login.php```: handles session login

```logout.php```: destroys session

### 2. OOP Backend Logic
```includes/db.php```: Database connection class

```includes/session.php```: Initializes session

```includes/functions.php```: Common functions (sanitize, login check, etc.)

### 3. UI Components
```templates/header.php and footer.php```: Layout files with Bootstrap

```assets/css/style.css```: Custom styles

### 4. Expense Management
```pages/add_expense.php```: Form to add expenses

```pages/view_expenses.php```: Table with filters

```dashboard.php```: Overview, links to other features

### 5. Export Features
```pages/report_pdf.php```: Uses TCPDF to generate a PDF

```pages/report_excel.php```: Uses PhpSpreadsheet to export Excel

# 🔷 PHASE 5: 🧪 Testing & Debugging
## ✅ Functional Testing

```
| Module        | Test Case                         |
| ------------- | --------------------------------- |
| Login         | Invalid credentials check         |
| Add Expense   | Required fields + value formats   |
| View Expenses | Filtering, pagination             |
| PDF Export    | Valid formatting and layout       |
| Excel Export  | Column correctness, file download |

```
### ✅ Security Testing
- Input sanitization using ```htmlspecialchars()``` and ```trim()```

- SQL injection protection using ```PDO prepared statements```

- Session validation for all sensitive pages

# 🔷 PHASE 6: 🚀 Deployment
### 1. Move to Production Server
* Apache + PHP 8.x + MySQL

* Upload project to ```/var/www/html/expense-tracker (or equivalent)```

### 2. Secure Configuration
- Set file permissions (644 files, 755 folders)

- Configure ```.htaccess``` for routing and access control

- Enable HTTPS (via Let’s Encrypt or hosting panel)

### 3. Create ```.env``` File (Optional)
For environment-based config:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=secret
DB_NAME=expense_db
 ```

# 🔷 PHASE 7: 📈 Optimization & Scaling 
### 🔒 Security Enhancements
- CSRF Tokens on forms

- 2FA for login

- Rate limiting login attempts

### 📊 Add Visual Analytics
- Use Chart.js to show:

- Category-wise expense distribution

- Monthly trends

### 📅 Recurring Expenses & Budget Limits
- Add logic to handle scheduled expenses

- Set monthly spending limits with alerts

### 📤 Email Report Feature
- Use PHPMailer to auto-send PDF reports monthly