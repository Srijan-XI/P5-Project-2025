from flask import Flask, render_template, request
import subprocess
import os
import psutil

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html', output='')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        result = subprocess.run(['g++', 'backend/file_processor.cpp', '-o', 'file_processor'], capture_output=True)
        output = subprocess.run(['./file_processor', filepath], capture_output=True, text=True)
        return render_template('index.html', output=output.stdout)

@app.route('/encrypt', methods=['POST'])
def encrypt():
    text = request.form['text']
    result = subprocess.run(['g++', 'backend/encryptor.cpp', '-o', 'encryptor'], capture_output=True)
    output = subprocess.run(['./encryptor'], input=text, capture_output=True, text=True)
    return render_template('index.html', output=output.stdout)

@app.route('/sysinfo', methods=['GET'])
def sysinfo():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    output = f"CPU Usage: {cpu}%\nMemory Usage: {memory}%"
    return render_template('index.html', output=output)

if __name__ == '__main__':
    app.run(debug=True)
