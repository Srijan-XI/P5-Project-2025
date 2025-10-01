from flask import Flask, render_template, jsonify
import random
import json

app = Flask(__name__)

# Load fun facts from JSON file
def load_fun_facts():
    with open('fun-fact.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
        # Combine all facts from the 5 parts into one list
        all_facts = []
        for part in ['fact_1', 'fact_2', 'fact_3', 'fact_4', 'fact_5']:
            all_facts.extend(data['fun_facts'][part])
        return all_facts

fun_facts = load_fun_facts()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/random-fact')
def random_fact():
    return jsonify({"fact": random.choice(fun_facts)})

if __name__ == '__main__':
    app.run(debug=True)
