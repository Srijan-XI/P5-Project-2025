# Professional Responsive Calculator

A professional, responsive calculator built with HTML, CSS, JavaScript, and Python (Flask backend). This project combines a modern user interface with secure and extensible backend logic, suitable for both simple and advanced calculations.

---

## 📄 Description

This calculator app provides a seamless user experience for performing arithmetic operations. The frontend is crafted using HTML, CSS (with a neumorphic design and black-outlined buttons), and JavaScript for instant calculations and UI interactivity. For advanced or secure computations, the app connects to a Python backend via Flask, allowing for robust and extensible logic. The project is ideal for learning full-stack integration and for use as a practical desktop or web calculator.

---

## 🛠 Requirements

### Frontend:
- Modern web browser (Chrome, Firefox, Edge, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Backend (optional, for Python integration):
- Python 3.x
- Flask (`pip install flask`)
- (Optional) Pyodide for client-side Python execution

### Project Structure:
- `index.html` – Main HTML file
- `static/css/style.css` – Stylesheet
- `static/js/main.js` – JavaScript logic
- `app.py` – Flask backend (for server-side Python calculations)
- `static/py/calculations.py` – Python calculation logic

---

## ⚙️ Working Process

1. **User Interaction**  
   Users interact with calculator buttons on the web interface. The display updates in real-time as users input numbers and operators.

2. **Frontend Calculation**  
   Basic operations (+, -, *, /, %) are handled instantly in JavaScript for speed and responsiveness.

3. **Backend Integration (Advanced/Optional)**  
   For complex or secure calculations, the frontend sends the expression to the Flask backend. The backend uses Python’s AST and math libraries to safely evaluate the expression and returns the result as JSON.

4. **Displaying Results**  
   Results (or error messages) are shown in the calculator’s display area. The UI includes keyboard support and error highlighting for invalid expressions.

5. **Styling**  
   All calculator buttons have a distinct black outline for clarity and accessibility. The design is modern, clean, and responsive for all device sizes.
