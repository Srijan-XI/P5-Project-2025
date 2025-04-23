from flask import Flask, render_template, request, jsonify
import ast
import math

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    try:
        # Safer evaluation using ast
        tree = ast.parse(data['expression'], mode='eval')
        result = eval(compile(tree, filename='', mode='eval'), {'__builtins__': None}, {'math': math})
        return jsonify({'result': str(result)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
