from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# list of fun facts
fun_facts = [
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "Bananas are berries, but strawberries aren't.",
    "A group of flamingos is called a 'flamboyance'.",
    "Octopuses have three hearts and blue blood.",
    "Wombat poop is cube-shaped.",
    "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the metal.",
    "An ostrich's eye is bigger than its brain.",
    "Butterflies can taste with their feet.",
    "Sloths can hold their breath longer than dolphins can.",
    "A day on Venus is longer than a year on Venus.",
    "Sharks existed before trees did.",
    "There are more stars in the universe than grains of sand on all the Earth's beaches.",
    "Cows have best friends and can become stressed when separated.",
    "The heart of a blue whale is so large a human can swim through its arteries."
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/random-fact')
def random_fact():
    return jsonify({"fact": random.choice(fun_facts)})

if __name__ == '__main__':
    app.run(debug=True)
