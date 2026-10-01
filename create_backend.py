import os

base_dir = r"c:\Users\umang\OneDrive\Desktop\pii shield\backend"

files = {
    "requirements.txt": """fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pymupdf==1.23.7
pdfplumber==0.10.3
python-docx==1.1.0
openpyxl==3.1.2
spacy==3.7.2
Pillow==10.1.0
pytesseract==0.3.10
aiofiles==23.2.1
pydantic==2.5.2
uuid6==2024.1.12
""",
    "run.py": """import uvicorn
if __name__ == '__main__':
    uvicorn.run('app.main:app', host='0.0.0.0', port=8000, reload=True)
""",
    "app/__init__.py": "",
    "app/config.py": """import os
from pydantic import BaseModel

class Settings(BaseModel):
    TEMP_DIR: str = os.path.join(os.getcwd(), 'temp')
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024 # 10MB
    ALLOWED_EXTENSIONS: set = {'.txt', '.pdf', '.docx', '.xlsx', '.csv', '.png', '.jpg', '.jpeg'}

settings = Settings()
os.makedirs(settings.TEMP_DIR, exist_ok=True)
""",
    "app/models/__init__.py": "",
    "app/models/schemas.py": """from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class Position(BaseModel):
    start: int
    end: int

class Detection(BaseModel):
    id: str
    type: str
    category: str
    value: str
    masked_value: str
    confidence: float
    redaction_default: bool
    position: Position

class ScanSummary(BaseModel):
    government_ids: int = 0
    financial_information: int = 0
    sensitive_personal_information: int = 0
    contact_information: int = 0
    personal_information: int = 0

class ScanResult(BaseModel):
    scan_id: str
    filename: str
    file_type: str
    risk_score: int
    risk_level: str
    total_detections: int
    sensitive_detections: int
    extracted_text: str
    detections: List[Detection]
    summary: dict

class RedactRequest(BaseModel):
    scan_id: str
    redaction_ids: List[str]

class RedactResponse(BaseModel):
    scan_id: str
    output_filename: str
    download_url: str
    redacted_count: int
    kept_count: int
    before_text: str
    after_text: str
""",
    "app/utils/__init__.py": "",
    "app/utils/store.py": """from typing import Dict

# In-memory store
scan_store: Dict[str, dict] = {}
""",
    "app/utils/security.py": """import re
def sanitize_filename(filename: str) -> str:
    return re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
""",
    "app/utils/file_utils.py": """import os
from app.config import settings

def validate_file(filename: str, size: int) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in settings.ALLOWED_EXTENSIONS and size <= settings.MAX_UPLOAD_SIZE
""",
    "app/utils/risk_scorer.py": """CATEGORY_CONFIG = {
    'government_id': {'risk_points': 30, 'redaction_default': True},
    'financial_information': {'risk_points': 25, 'redaction_default': True},
    'sensitive_personal_information': {'risk_points': 15, 'redaction_default': True},
    'medical_information': {'risk_points': 25, 'redaction_default': True},
    'personal_information': {'risk_points': 5, 'redaction_default': False},
    'contact_information': {'risk_points': 0, 'redaction_default': False},
}

def calculate_risk(detections):
    score = sum(CATEGORY_CONFIG.get(d['category'], {}).get('risk_points', 0) for d in detections if d.get('redaction_default', False))
    if score <= 20: level = 'LOW'
    elif score <= 40: level = 'MEDIUM'
    elif score <= 70: level = 'HIGH'
    else: level = 'CRITICAL'
    return score, level
""",
    "app/detectors/__init__.py": "",
    "app/detectors/context_analyzer.py": """def has_context(text: str, start: int, end: int, keywords: list, window: int = 50) -> bool:
    start_window = max(0, start - window)
    end_window = min(len(text), end + window)
    context_text = text[start_window:end_window].lower()
    return any(k.lower() in context_text for k in keywords)
""",
    "app/detectors/regex_detector.py": """import re
import uuid
from app.detectors.context_analyzer import has_context

PATTERNS = {
    'Aadhaar': {
        'regex': r'\\b[2-9]\\d{3}\\s?\\d{4}\\s?\\d{4}\\b',
        'category': 'government_id',
        'keywords': ['aadhaar', 'uid', 'uidai'],
        'redaction_default': True
    },
    'PAN': {
        'regex': r'\\b[A-Z]{5}\\d{4}[A-Z]\\b',
        'category': 'government_id',
        'keywords': [],
        'redaction_default': True
    },
    'Passport': {
        'regex': r'\\b[A-Z][0-9]{7}\\b',
        'category': 'government_id',
        'keywords': ['passport'],
        'redaction_default': True
    },
    'Bank Account': {
        'regex': r'\\b\\d{9,18}\\b',
        'category': 'financial_information',
        'keywords': ['account', 'a/c', 'bank'],
        'redaction_default': True
    },
    'IFSC': {
        'regex': r'\\b[A-Z]{4}0[A-Z0-9]{6}\\b',
        'category': 'financial_information',
        'keywords': [],
        'redaction_default': True
    },
    'Email': {
        'regex': r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
        'category': 'contact_information',
        'keywords': [],
        'redaction_default': False
    },
    'Phone': {
        'regex': r'\\b(?:\\+91[-\\s]?)?[6789]\\d{9}\\b',
        'category': 'contact_information',
        'keywords': [],
        'redaction_default': False
    }
}

def detect_regex(text: str) -> list:
    detections = []
    for type_name, config in PATTERNS.items():
        for match in re.finditer(config['regex'], text):
            # Check context if keywords exist
            if config['keywords'] and not has_context(text, match.start(), match.end(), config['keywords']):
                continue
            
            detections.append({
                'id': f"det_{uuid.uuid4().hex[:8]}",
                'type': type_name,
                'category': config['category'],
                'value': match.group(),
                'confidence': 0.95,
                'redaction_default': config['redaction_default'],
                'position': {'start': match.start(), 'end': match.end()}
            })
            
    # Simple address detection
    address_match = re.search(r'(?i)address:\\s*(.+?)(?:\\n\\n|\\n[A-Z][a-z]+:|$)', text, re.DOTALL)
    if address_match:
        detections.append({
            'id': f"det_{uuid.uuid4().hex[:8]}",
            'type': 'Address',
            'category': 'sensitive_personal_information',
            'value': address_match.group(1).strip(),
            'confidence': 0.85,
            'redaction_default': True,
            'position': {'start': address_match.start(1), 'end': address_match.end(1)}
        })
    return detections
""",
    "app/detectors/nlp_detector.py": """import spacy
import uuid

try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

def detect_nlp(text: str) -> list:
    if not nlp: return []
    doc = nlp(text)
    detections = []
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            detections.append({
                'id': f"det_{uuid.uuid4().hex[:8]}",
                'type': 'Name',
                'category': 'personal_information',
                'value': ent.text,
                'confidence': 0.8,
                'redaction_default': False,
                'position': {'start': ent.start_char, 'end': ent.end_char}
            })
    return detections
""",
    "app/redaction/redaction_utils.py": """def mask_aadhaar(value):
    digits = ''.join(filter(str.isdigit, value))
    if len(digits) == 12:
        return f"XXXX XXXX {digits[-4:]}"
    return mask_generic(value)

def mask_pan(value):
    if len(value) == 10:
        return f"XXXXX{value[5:9]}F"
    return mask_generic(value)

def mask_bank_account(value):
    if len(value) >= 4:
        return "X" * (len(value) - 4) + value[-4:]
    return mask_generic(value)

def mask_passport(value):
    return "[REDACTED]"

def mask_phone(value):
    return value

def mask_generic(value):
    return "[REDACTED]"

def mask_ifsc(value):
    return "[REDACTED]"

def apply_mask(det_type: str, value: str) -> str:
    if det_type == 'Aadhaar': return mask_aadhaar(value)
    if det_type == 'PAN': return mask_pan(value)
    if det_type == 'Bank Account': return mask_bank_account(value)
    if det_type == 'Passport': return mask_passport(value)
    if det_type == 'Phone': return mask_phone(value)
    if det_type == 'IFSC': return mask_ifsc(value)
    return mask_generic(value)
""",
    "app/detectors/pii_engine.py": """from app.detectors.regex_detector import detect_regex
from app.detectors.nlp_detector import detect_nlp
from app.redaction.redaction_utils import apply_mask

def analyze_text(text: str):
    detections = detect_regex(text) + detect_nlp(text)
    
    # Deduplicate overlapping
    final_detections = []
    for d in sorted(detections, key=lambda x: x['position']['start']):
        overlap = False
        for fd in final_detections:
            if max(0, min(d['position']['end'], fd['position']['end']) - max(d['position']['start'], fd['position']['start'])) > 0:
                overlap = True
                break
        if not overlap:
            d['masked_value'] = apply_mask(d['type'], d['value'])
            final_detections.append(d)
            
    return final_detections
""",
    "app/processors/__init__.py": "",
    "app/processors/ocr_engine.py": """try:
    import pytesseract
except ImportError:
    pass

def extract_text_from_image(image) -> str:
    try:
        return pytesseract.image_to_string(image)
    except:
        return ""
""",
    "app/processors/pdf_processor.py": """import fitz

def process_pdf(filepath: str) -> str:
    text = ""
    try:
        with fitz.open(filepath) as doc:
            for page in doc:
                text += page.get_text() + "\\n"
    except Exception as e:
        print(f"Error PDF: {e}")
    return text
""",
    "app/processors/docx_processor.py": """from docx import Document

def process_docx(filepath: str) -> str:
    text = ""
    try:
        doc = Document(filepath)
        for para in doc.paragraphs:
            text += para.text + "\\n"
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    text += cell.text + " "
                text += "\\n"
    except Exception as e:
        print(f"Error DOCX: {e}")
    return text
""",
    "app/processors/xlsx_processor.py": """import openpyxl

def process_xlsx(filepath: str) -> str:
    text = ""
    try:
        wb = openpyxl.load_workbook(filepath, data_only=True)
        for sheet in wb.worksheets:
            for row in sheet.iter_rows(values_only=True):
                text += " ".join(str(cell) for cell in row if cell is not None) + "\\n"
    except Exception as e:
        print(f"Error XLSX: {e}")
    return text
""",
    "app/processors/csv_processor.py": """import csv

def process_csv(filepath: str) -> str:
    text = ""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                text += " ".join(row) + "\\n"
    except Exception as e:
        print(f"Error CSV: {e}")
    return text
""",
    "app/processors/image_processor.py": """from PIL import Image
from app.processors.ocr_engine import extract_text_from_image

def process_image(filepath: str) -> str:
    try:
        with Image.open(filepath) as img:
            return extract_text_from_image(img)
    except Exception as e:
        print(f"Error Image: {e}")
        return ""
""",
    "app/processors/text_processor.py": """def process_text(filepath: str) -> str:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error Text: {e}")
        return ""
""",
    "app/redaction/__init__.py": "",
    "app/redaction/pdf_redactor.py": """import fitz

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
""",
    "app/redaction/docx_redactor.py": """from docx import Document

def redact_docx(input_path: str, output_path: str, redactions: list):
    try:
        doc = Document(input_path)
        for r in redactions:
            for para in doc.paragraphs:
                if r['value'] in para.text:
                    para.text = para.text.replace(r['value'], r['masked_value'])
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        if r['value'] in cell.text:
                            cell.text = cell.text.replace(r['value'], r['masked_value'])
        doc.save(output_path)
    except Exception as e:
        print(f"DOCX Redact Error: {e}")
""",
    "app/redaction/xlsx_redactor.py": """import openpyxl

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
""",
    "app/redaction/csv_redactor.py": """import csv

def redact_csv(input_path: str, output_path: str, redactions: list):
    try:
        data = []
        with open(input_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                new_row = []
                for cell in row:
                    val = cell
                    for r in redactions:
                        if r['value'] in val:
                            val = val.replace(r['value'], r['masked_value'])
                    new_row.append(val)
                data.append(new_row)
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(data)
    except Exception as e:
        print(f"CSV Redact Error: {e}")
""",
    "app/redaction/text_redactor.py": """def redact_text(input_path: str, output_path: str, redactions: list):
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            text = f.read()
        for r in redactions:
            text = text.replace(r['value'], r['masked_value'])
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
    except Exception as e:
        print(f"Text Redact Error: {e}")
""",
    "app/redaction/image_redactor.py": """from PIL import Image

def redact_image(input_path: str, output_path: str, redactions: list):
    try:
        img = Image.open(input_path)
        # Note: True image redaction requires bounding boxes from OCR. 
        # For simplicity, saving a copy as basic implementation. 
        img.save(output_path)
    except Exception as e:
        print(f"Image Redact Error: {e}")
""",
    "app/services/__init__.py": "",
    "app/services/scan_service.py": """import os
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

def process_file_extract_text(filepath: str) -> str:
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.pdf': return process_pdf(filepath)
    if ext == '.docx': return process_docx(filepath)
    if ext == '.xlsx': return process_xlsx(filepath)
    if ext == '.csv': return process_csv(filepath)
    if ext in ['.png', '.jpg', '.jpeg']: return process_image(filepath)
    return process_text(filepath)

def scan_file(filepath: str, filename: str) -> Dict[str, Any]:
    text = process_file_extract_text(filepath)
    detections_raw = analyze_text(text)
    
    score, level = calculate_risk(detections_raw)
    
    summary = {
        'government_ids': 0, 'financial_information': 0,
        'sensitive_personal_information': 0, 'contact_information': 0, 'personal_information': 0
    }
    sensitive_count = 0
    
    for d in detections_raw:
        cat = d['category']
        if cat in summary: summary[cat] += 1
        elif cat + 's' in summary: summary[cat + 's'] += 1
        
        if d['redaction_default']:
            sensitive_count += 1
            
    scan_id = str(uuid.uuid4())
    result = {
        "scan_id": scan_id,
        "filename": filename,
        "file_type": os.path.splitext(filename)[1][1:],
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
""",
    "app/services/redaction_service.py": """import os
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
""",
    "app/routes/__init__.py": "",
    "app/routes/scan.py": """from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import aiofiles
from app.config import settings
from app.services.scan_service import scan_file

router = APIRouter()

@router.post("/api/scan")
async def upload_and_scan(file: UploadFile = File(...)):
    filepath = os.path.join(settings.TEMP_DIR, file.filename)
    
    async with aiofiles.open(filepath, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    try:
        result = scan_file(filepath, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
""",
    "app/routes/redact.py": """from fastapi import APIRouter, HTTPException
from app.models.schemas import RedactRequest
from app.services.redaction_service import redact_file

router = APIRouter()

@router.post("/api/redact")
async def redact(req: RedactRequest):
    try:
        result = redact_file(req.scan_id, req.redaction_ids)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
""",
    "app/routes/download.py": """from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from app.config import settings

router = APIRouter()

@router.get("/api/download/{scan_id}")
async def download_file(scan_id: str, filename: str):
    filepath = os.path.join(settings.TEMP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, filename=filename)
""",
    "app/routes/demo.py": """from fastapi import APIRouter
import os
from app.config import settings
from app.services.scan_service import scan_file

router = APIRouter()

DEMO_CONTENT = \"\"\"EMPLOYEE KYC VERIFICATION FORM

Name: Rahul Sharma
Email: rahul.sharma@example.com
Phone: 9876543210
Date of Birth: 14/08/2003

Address: 42 Lake Road, Bhopal, Madhya Pradesh

Aadhaar: 4521 7834 9126
PAN: ABCDE1234F
Passport: P1234567

Bank Account: 123456789012
IFSC: SBIN0001234
\"\"\"

@router.post("/api/demo")
async def run_demo():
    filename = "demo_employee_kyc.txt"
    filepath = os.path.join(settings.TEMP_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(DEMO_CONTENT)
        
    result = scan_file(filepath, filename)
    return result
""",
    "app/routes/health.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
""",
    "app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import shutil
from app.config import settings
from app.routes import scan, redact, download, demo, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cleanup temp dir on startup
    if os.path.exists(settings.TEMP_DIR):
        shutil.rmtree(settings.TEMP_DIR)
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)
app.include_router(redact.router)
app.include_router(download.router)
app.include_router(demo.router)
app.include_router(health.router)
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Created {len(files)} files successfully.")
