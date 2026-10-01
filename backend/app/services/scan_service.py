import os
import uuid
from app.processors.pdf_processor import process_pdf
from app.processors.docx_processor import process_docx
from app.processors.xlsx_processor import process_xlsx
from app.processors.csv_processor import process_csv
from app.processors.image_processor import process_image
from app.processors.text_processor import process_text
from app.detectors.pii_engine import analyze_text
from app.utils.risk_scorer import calculate_risk
from app.utils.store import scan_store
from typing import Dict, Any

PROCESSOR_MAP = {
    '.pdf': process_pdf,
    '.docx': process_docx,
    '.xlsx': process_xlsx,
    '.csv': process_csv,
    '.png': process_image,
    '.jpg': process_image,
    '.jpeg': process_image,
    '.txt': process_text,
}

def process_file_extract_text(filepath: str) -> str:
    ext = os.path.splitext(filepath)[1].lower()
    processor = PROCESSOR_MAP.get(ext, process_text)
    text = processor(filepath)
    if not text or not text.strip():
        raise ValueError("Could not extract text from the document. The file may be empty or unreadable.")
    return text

def scan_file(filepath: str, filename: str) -> Dict[str, Any]:
    text = process_file_extract_text(filepath)
    detections_raw = analyze_text(text)
    
    score, level = calculate_risk(detections_raw)
    
    # Build summary by category
    CATEGORY_MAP = {
        'government_id': 'government_ids',
        'financial_information': 'financial_information',
        'sensitive_personal_information': 'sensitive_personal_information',
        'contact_information': 'contact_information',
        'personal_information': 'personal_information',
        'medical_information': 'sensitive_personal_information',
    }
    
    summary = {
        'government_ids': 0,
        'financial_information': 0,
        'sensitive_personal_information': 0,
        'contact_information': 0,
        'personal_information': 0
    }
    
    sensitive_count = 0
    for d in detections_raw:
        cat = d['category']
        summary_key = CATEGORY_MAP.get(cat, 'sensitive_personal_information')
        summary[summary_key] = summary.get(summary_key, 0) + 1
        
        if d['redaction_default']:
            sensitive_count += 1
            
    scan_id = str(uuid.uuid4())
    result = {
        "scan_id": scan_id,
        "filename": filename,
        "file_type": os.path.splitext(filename)[1][1:].lower(),
        "risk_score": score,
        "risk_level": level,
        "total_detections": len(detections_raw),
        "sensitive_detections": sensitive_count,
        "extracted_text": text,
        "detections": detections_raw,
        "summary": summary
    }
    
    scan_store[scan_id] = {
        'result': result,
        'filepath': filepath
    }
    
    return result
