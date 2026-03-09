from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# File to store tasks
TASKS_FILE = 'tasks.json'
BIN_FILE = 'bin.json'

def load_tasks():
    """Load tasks from JSON file"""
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    """Save tasks to JSON file"""
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

def load_bin():
    """Load deleted tasks from bin"""
    if os.path.exists(BIN_FILE):
        with open(BIN_FILE, 'r') as f:
            return json.load(f)
    return []

def save_bin(bin_tasks):
    """Save deleted tasks to bin"""
    with open(BIN_FILE, 'w') as f:
        json.dump(bin_tasks, f, indent=2)

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    tasks = load_tasks()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    data = request.json
    task_text = data.get('task', '').strip()
    
    if not task_text:
        return jsonify({'error': 'Task cannot be empty'}), 400
    
    tasks = load_tasks()
    new_task = {
        'id': len(tasks) + 1,
        'task': task_text,
        'done': False,
        'created_at': datetime.now().isoformat(),
        'priority': data.get('priority', 'medium'),
        'category': data.get('category', 'general')
    }
    tasks.append(new_task)
    save_tasks(tasks)
    
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    data = request.json
    tasks = load_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            if 'done' in data:
                task['done'] = data['done']
            if 'task' in data:
                task['task'] = data['task']
            if 'priority' in data:
                task['priority'] = data['priority']
            if 'category' in data:
                task['category'] = data['category']
            
            save_tasks(tasks)
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task (move to bin)"""
    tasks = load_tasks()
    bin_tasks = load_bin()
    
    task_to_delete = None
    for task in tasks:
        if task['id'] == task_id:
            task_to_delete = task
            break
    
    if task_to_delete:
        # Add deletion timestamp
        task_to_delete['deleted_at'] = datetime.now().isoformat()
        
        # Move to bin
        bin_tasks.append(task_to_delete)
        save_bin(bin_tasks)
        
        # Remove from tasks
        tasks = [task for task in tasks if task['id'] != task_id]
        save_tasks(tasks)
        
        return jsonify({'message': 'Task moved to bin'}), 200
    
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/clear-completed', methods=['DELETE'])
def clear_completed():
    """Clear all completed tasks"""
    tasks = load_tasks()
    tasks = [task for task in tasks if not task['done']]
    save_tasks(tasks)
    
    return jsonify({'message': 'Completed tasks cleared'}), 200

@app.route('/api/bin', methods=['GET'])
def get_bin():
    """Get all tasks in bin"""
    bin_tasks = load_bin()
    return jsonify(bin_tasks)

@app.route('/api/bin/<int:task_id>/restore', methods=['POST'])
def restore_task(task_id):
    """Restore a task from bin"""
    tasks = load_tasks()
    bin_tasks = load_bin()
    
    task_to_restore = None
    for task in bin_tasks:
        if task['id'] == task_id:
            task_to_restore = task
            break
    
    if task_to_restore:
        # Remove deletion timestamp
        if 'deleted_at' in task_to_restore:
            del task_to_restore['deleted_at']
        
        # Restore to tasks
        tasks.append(task_to_restore)
        save_tasks(tasks)
        
        # Remove from bin
        bin_tasks = [task for task in bin_tasks if task['id'] != task_id]
        save_bin(bin_tasks)
        
        return jsonify({'message': 'Task restored', 'task': task_to_restore}), 200
    
    return jsonify({'error': 'Task not found in bin'}), 404

@app.route('/api/bin/<int:task_id>', methods=['DELETE'])
def permanent_delete(task_id):
    """Permanently delete a task from bin"""
    bin_tasks = load_bin()
    bin_tasks = [task for task in bin_tasks if task['id'] != task_id]
    save_bin(bin_tasks)
    
    return jsonify({'message': 'Task permanently deleted'}), 200

@app.route('/api/bin/empty', methods=['DELETE'])
def empty_bin():
    """Empty the entire bin"""
    save_bin([])
    return jsonify({'message': 'Bin emptied'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
