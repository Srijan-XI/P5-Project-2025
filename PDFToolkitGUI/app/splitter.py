from PyPDF2 import PdfReader, PdfWriter

def split_pdf(input_path, page_ranges, output_dir):
    reader = PdfReader(input_path)
    for idx, (start, end) in enumerate(page_ranges):
        writer = PdfWriter()
        for page_num in range(start, end+1):
            writer.add_page(reader.pages[page_num])
        output_path = f"{output_dir}/split_{idx+1}.pdf"
        with open(output_path, "wb") as f:
            writer.write(f)
