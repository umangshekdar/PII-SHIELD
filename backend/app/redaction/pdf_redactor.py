import fitz

def redact_pdf(input_path: str, output_path: str, redactions: list):
    try:
        doc = fitz.open(input_path)
        for page in doc:
            for r in redactions:
                areas = page.search_for(r['value'])
                for area in areas:
                    page.add_redact_annot(area, text=r['masked_value'])
            page.apply_redactions()
        doc.save(output_path)
    except Exception as e:
        print(f"PDF Redact Error: {e}")
