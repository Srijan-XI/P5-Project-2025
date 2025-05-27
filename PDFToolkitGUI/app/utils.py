import os

def ensure_output_dir(path="output"):
    if not os.path.exists(path):
        os.makedirs(path)
