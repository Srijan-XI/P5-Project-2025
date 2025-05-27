import tkinter as tk
from tkinter import filedialog, messagebox
from app import merger, splitter, compressor, rotator, text_extractor, encryptor

class PDFToolkitGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("PDF Toolkit GUI")
        self.geometry("400x300")
        # Add widgets/buttons for each tool, e.g.:
        tk.Button(self, text="Merge PDFs", command=self.merge_pdfs).pack(pady=5)
        # Add more buttons for other tools

    def merge_pdfs(self):
        files = filedialog.askopenfilenames(filetypes=[("PDF files", "*.pdf")])
        if not files:
            return
        output = filedialog.asksaveasfilename(defaultextension=".pdf")
        if output:
            merger.merge_pdfs(files, output)
            messagebox.showinfo("Success", "PDFs merged successfully!")

# Add similar methods for other tools
