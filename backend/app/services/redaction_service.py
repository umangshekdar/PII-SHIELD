import os
from app.utils.store import scan_store
from app.redaction.pdf_redactor import redact_pdf
from app.redaction.docx_redactor import redact_docx
from app.redaction.xlsx_redactor import redact_xlsx
from app.redaction.csv_redactor import redact_csv
from app.redaction.text_redactor import redact_text
from app.redaction.image_redactor import redact_image
from app.config import settings

def redact_file(scan_id: str, redaction_ids: list) -> dict:
    if scan_id not in scan_store:
        raise ValueError("Scan ID not found")
        
    store_data = scan_store[scan_id]
    original_filepath = store_data['filepath']
    result_data = store_data['result']
    
    # Filter detections to only those requested
    redactions_to_apply = [d for d in result_data['detections'] if d['id'] in redaction_ids]
    
    filename = os.path.basename(original_filepath)
    name, ext = os.path.splitext(filename)
    output_filename = f"{name}_PIISafe{ext}"
    output_filepath = os.path.join(settings.TEMP_DIR, output_filename)
    
    if ext.lower() == '.pdf': redact_pdf(original_filepath, output_filepath, redactions_to_apply)
    elif ext.lower() == '.docx': redact_docx(original_filepath, output_filepath, redactions_to_apply)
    elif ext.lower() == '.xlsx': redact_xlsx(original_filepath, output_filepath, redactions_to_apply)
    elif ext.lower() == '.csv': redact_csv(original_filepath, output_filepath, redactions_to_apply)
    elif ext.lower() in ['.png', '.jpg', '.jpeg']: redact_image(original_filepath, output_filepath, redactions_to_apply)
    else: redact_text(original_filepath, output_filepath, redactions_to_apply)
    
    before_text = result_data['extracted_text']
    after_text = before_text
    for r in redactions_to_apply:
        after_text = after_text.replace(r['value'], r['masked_value'])
        
    return {
        "scan_id": scan_id,
        "output_filename": output_filename,
        "download_url": f"/api/download/{scan_id}?filename={output_filename}",
        "redacted_count": len(redactions_to_apply),
        "kept_count": len(result_data['detections']) - len(redactions_to_apply),
        "before_text": before_text,
        "after_text": after_text
    }
