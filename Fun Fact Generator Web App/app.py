from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# List of fun facts
fun_facts = [
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "Bananas are berries, but strawberries aren't.",
    "A group of flamingos is called a 'flamboyance'.",
    "Octopuses have three hearts and blue blood.",
    "Wombat poop is cube-shaped."
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/random-fact')
def random_fact():
    return jsonify({"fact": random.choice(fun_facts)})

if __name__ == '__main__':
    app.run(debug=True)
