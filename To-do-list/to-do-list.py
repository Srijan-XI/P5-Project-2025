# To-Do List Application in Python with Tkinter
import tkinter as tk
from tkinter import messagebox
from datetime import datetime

# Create the main application window
app = tk.Tk()
app.title("To-Do List Application")
app.geometry("400x500")
app.configure(bg="#f0f0f0")
app.resizable(False, False)
# app.iconbitmap("todo_icon.ico")  # Ensure you have an icon file named 'todo_icon.ico'
app.attributes('-topmost', True)
app.eval('tk::PlaceWindow . center')
app.update()
app.lift()
app.attributes('-topmost', False)
app.focus_force()
app.attributes('-topmost', True)
app.update()
app.lift()

# Task list storage
tasks = []

# Function to add task
def add_task():
    task = task_entry.get()
    if task:
        tasks.append({"task": task, "done": False})
        update_listbox()
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Warning", "Please enter a task.")

# Function to remove task
def remove_task():
    selected = task_listbox.curselection()
    if selected:
        index = selected[0]
        del tasks[index]
        update_listbox()
    else:
        messagebox.showwarning("Warning", "Please select a task to remove.")

# Function to mark done
def mark_done():
    selected = task_listbox.curselection()
    if selected:
        index = selected[0]
        tasks[index]["done"] = True
        update_listbox()
    else:
        messagebox.showwarning("Warning", "Please select a task to mark as done.")

# Function to update listbox
def update_listbox():
    task_listbox.delete(0, tk.END)
    for task in tasks:
        status = "[Done]" if task["done"] else "[Pending]"
        task_listbox.insert(tk.END, f"{status} {task['task']}")

# Widgets
task_entry = tk.Entry(app, width=40)
task_entry.pack(pady=10)

add_button = tk.Button(app, text="Add Task", command=add_task)
add_button.pack()

task_listbox = tk.Listbox(app, width=50, height=15)
task_listbox.pack(pady=10)

remove_button = tk.Button(app, text="Remove Task", command=remove_task)
remove_button.pack(side=tk.LEFT, padx=10)

done_button = tk.Button(app, text="Mark Done", command=mark_done)
done_button.pack(side=tk.RIGHT, padx=10)

# Start the application
app.mainloop()