from PyPDF2 import PdfReader

def extract_text(input_path):
    reader = PdfReader(input_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
