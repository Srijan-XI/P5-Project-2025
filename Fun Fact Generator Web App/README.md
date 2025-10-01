# 🎉 Fun Fact Generator Web App

A beautiful and interactive web application that generates random fun facts from a collection of 190+ fascinating facts across various categories including science, history, animals, technology, and more!

## ✨ Features

- **190+ Fun Facts**: Extensive collection covering diverse topics
- **Beautiful UI**: Modern design with smooth animations and gradients
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Transitions**: Fade-in/fade-out animations for fact changes
- **RESTful API**: JSON API endpoint for random facts
- **Easy to Extend**: Add more facts by simply editing the JSON file

## 🛠️ Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Data Storage**: JSON file
- **Styling**: Custom CSS with animations

## 🚀 Quick Start

### Prerequisites

- Python 3.6 or higher
- Flask (will be installed via requirements.txt)

### Installation

1. **Clone or download** the project files

2. **Navigate to the project directory**:
   ```bash
   cd "Fun Fact Generator Web App"
   ```

3. **Install dependencies** (if requirements.txt exists):
   ```bash
   pip install flask
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Open your browser** and visit:
   ```
   http://127.0.0.1:5000
   ```

## 📁 Project Structure

```
Fun Fact Generator Web App/
├── app.py                 # Flask backend with 190 fun facts
├── fun-fact.json         # JSON file with all fun facts
├── static/               # Static files folder
│   ├── index.css         # Stylesheet with animations
│   └── app.js           # JavaScript for API calls
├── templates/           # Templates folder
│   └── index.html       # Main HTML page
└── README.md           # Project documentation
```

## 🔌 API Endpoints

### GET `/`
Returns the main web page with the fun fact generator interface.

### GET `/random-fact`
Returns a random fun fact in JSON format.

**Response Format:**
```json
{
  "fact": "Bananas are berries, but strawberries aren't."
}
```

## 🎨 Categories of Fun Facts

The app includes facts from these categories:
- 🌍 General & Random Facts
- 🦁 Animals
- 🧠 Human Body
- 🚀 Space
- 🏛️ History
- 💻 Technology
- 🍕 Food
- 🎭 Culture & Lifestyle
- 🎶 Music
- 🌊 Nature & Environment
- 🏀 Sports
- 🎮 Games & Entertainment
- 🧪 Science & Inventions
- 💡 Everyday Oddities
- 🏙️ World Facts
- 🕰️ Time & Numbers
- ✈️ Travel & Transport
- 😂 Funny & Strange
- 🎓 Knowledge & Learning

## 🛠️ Customization

### Adding More Facts

To add more fun facts, simply edit the `fun-fact.json` file:

```json
{
  "fun_facts": [
    "Your existing facts...",
    "New fun fact here!"
  ]
}
```

### Modifying Styling

Edit `static/index.css` to customize the appearance, colors, and animations.

### Changing Functionality

Modify `app.py` for backend changes or `static/app.js` for frontend behavior.

## 🤝 Contributing

Feel free to contribute by:
- Adding more fun facts
- Improving the UI/UX
- Adding new features
- Fixing bugs

## 📄 License

This project is created for educational purposes. Feel free to use and modify as needed.

## 👨‍💻 Author

Created with ❤️ by Srijan

---

**Enjoy discovering amazing facts! 🌟**