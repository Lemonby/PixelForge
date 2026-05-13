from pypdf import PdfReader

reader = PdfReader('Spesifikasi Projek Mata Kuliah (1).pdf')
text = ''.join(page.extract_text() for page in reader.pages)

with open('Spesifikasi_Projek_Mata_Kuliah.md', 'w', encoding='utf-8') as f:
    f.write(text)
