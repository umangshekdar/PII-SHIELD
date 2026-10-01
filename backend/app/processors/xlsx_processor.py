import openpyxl

def process_xlsx(filepath: str) -> str:
    text = ""
    try:
        wb = openpyxl.load_workbook(filepath, data_only=True)
        for sheet in wb.worksheets:
            for row in sheet.iter_rows(values_only=True):
                text += " ".join(str(cell) for cell in row if cell is not None) + "\n"
    except Exception as e:
        print(f"Error XLSX: {e}")
    return text
