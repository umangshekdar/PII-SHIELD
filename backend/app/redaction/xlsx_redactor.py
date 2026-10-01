import openpyxl

def redact_xlsx(input_path: str, output_path: str, redactions: list):
    try:
        wb = openpyxl.load_workbook(input_path)
        for sheet in wb.worksheets:
            for row in sheet.iter_rows():
                for cell in row:
                    if cell.value and isinstance(cell.value, str):
                        val = cell.value
                        for r in redactions:
                            if r['value'] in val:
                                val = val.replace(r['value'], r['masked_value'])
                        cell.value = val
        wb.save(output_path)
    except Exception as e:
        print(f"XLSX Redact Error: {e}")
