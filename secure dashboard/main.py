from flask import Flask, render_template, request
import subprocess
import os
import psutil
import sys
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Limit uploads to 10 MB by default
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Base paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Simple allowlist for text-like files. Adjust as needed.
ALLOWED_EXTENSIONS = {'txt', 'md', 'csv', 'log'}

def allowed_file(filename: str) -> bool:
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

# Platform-aware executable locations (precompiled)
if sys.platform.startswith('win') or os.name == 'nt':
    FILE_PROCESSOR_EXE = os.path.join(BASE_DIR, 'backend', 'file_processor.exe')
    ENCRYPTOR_EXE = os.path.join(BASE_DIR, 'backend', 'encryptor.exe')
else:
    FILE_PROCESSOR_EXE = os.path.join(BASE_DIR, 'backend', 'file_processor')
    ENCRYPTOR_EXE = os.path.join(BASE_DIR, 'backend', 'encryptor')

@app.route('/')
def index():
    return render_template('index.html', output='')


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files.get('file')
    if not file:
        return render_template('index.html', output='No file uploaded.')

    raw_filename = file.filename or ''
    filename = secure_filename(raw_filename)
    if not filename or not allowed_file(filename):
        return render_template('index.html', output='File type not allowed. Allowed: ' + ','.join(sorted(ALLOWED_EXTENSIONS)))

    # Add a random prefix to avoid collisions
    safe_name = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(UPLOAD_FOLDER, safe_name)
    file.save(filepath)

    if not os.path.exists(FILE_PROCESSOR_EXE):
        return render_template('index.html', output='Server error: file processor executable not found.')

    try:
        proc = subprocess.run([FILE_PROCESSOR_EXE, filepath], capture_output=True, text=True, timeout=15)
    except Exception as e:
        return render_template('index.html', output=f'Error running file processor: {e}')

    if proc.returncode != 0:
        # Include stderr for debugging but keep message concise
        err = (proc.stderr or '').strip()
        return render_template('index.html', output=f'File processor failed: {err}')

    return render_template('index.html', output=proc.stdout)


@app.route('/encrypt', methods=['POST'])
def encrypt():
    text = request.form.get('text', '')
    if text == '':
        return render_template('index.html', output='No text provided to encrypt.')

    if not os.path.exists(ENCRYPTOR_EXE):
        return render_template('index.html', output='Server error: encryptor executable not found.')

    try:
        proc = subprocess.run([ENCRYPTOR_EXE], input=text, capture_output=True, text=True, timeout=10)
    except Exception as e:
        return render_template('index.html', output=f'Error running encryptor: {e}')

    if proc.returncode != 0:
        err = (proc.stderr or '').strip()
        return render_template('index.html', output=f'Encryptor failed: {err}')

    return render_template('index.html', output=proc.stdout)


@app.route('/sysinfo', methods=['GET'])
def sysinfo():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    output = f"CPU Usage: {cpu}%\nMemory Usage: {memory}%"
    return render_template('index.html', output=output)


if __name__ == '__main__':
    # Do not run Flask debug server in production; debug=False is safer by default
    app.run(debug=False)
