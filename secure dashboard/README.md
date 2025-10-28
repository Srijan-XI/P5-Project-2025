# Secure Dashboard - Node.js Version

A modern, secure multi-tool dashboard built with Node.js, Express, and EJS. Features file processing, text encryption, system monitoring, password generation, and data visualization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## 📋 Features

### 🔐 Cryptographic Utility
- **File Processing**: Upload files for SHA-256 hash analysis
- **Text Encryption**: Encrypt text using backend encryption tools
- **System Information**: Real-time CPU and memory usage monitoring

### 🔑 Password Generator
- Customizable length (8-64 characters)
- Character type selection (uppercase, lowercase, numbers, symbols)
- One-click generation and clipboard copy

### 📊 Data Analytics
- Interactive D3.js visualizations
- Security event severity charts
- System load trend analysis
- Responsive chart rendering

### 📋 System Status Log
- Real-time system event monitoring
- Color-coded severity levels
- Searchable and filterable logs

## 🛠 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **EJS** - Template engine
- **Multer** - File upload handling
- **systeminformation** - System monitoring
- **Helmet** - Security middleware
- **C++** - Backend encryption and file processing tools

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **D3.js** - Data visualization library
- **Lucide Icons** - Clean, customizable icons
- **Inter Font** - Modern typography

### Security Features
- Content Security Policy (CSP)
- File type validation
- File size limits (10MB)
- Input sanitization
- CORS protection

## Migration from Flask Complete ✅

This Node.js version successfully replaces the original Flask application with:
- **Enhanced Performance**: Faster AJAX operations
- **Better UX**: Real-time updates without page reloads  
- **Modern Architecture**: Express.js with EJS templating
- **Full Compatibility**: All original features preserved
