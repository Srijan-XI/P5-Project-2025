# Note: True PDF compression is limited in Python; this is a basic placeholder.
from PyPDF2 import PdfReader, PdfWriter

def compress_pdf(input_path, output_path):
    reader = PdfReader(input_path)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    # PyPDF2 does not compress images, but you can optimize structure
    with open(output_path, "wb") as f:
        writer.write(f)
