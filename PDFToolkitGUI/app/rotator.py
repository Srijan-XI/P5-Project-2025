from PyPDF2 import PdfReader, PdfWriter

def rotate_pdf(input_path, output_path, angle=90):
    reader = PdfReader(input_path)
    writer = PdfWriter()
    for page in reader.pages:
        page.rotate(angle)
        writer.add_page(page)
    with open(output_path, "wb") as f:
        writer.write(f)
