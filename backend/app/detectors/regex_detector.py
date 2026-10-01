import re
import uuid
from app.detectors.context_analyzer import has_context

PATTERNS = {
    'Aadhaar': {
        'regex': r'\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b',
        'category': 'government_id',
        'keywords': ['aadhaar', 'uid', 'uidai'],
        'redaction_default': True
    },
    'PAN': {
        'regex': r'\b[A-Z]{5}\d{4}[A-Z]\b',
        'category': 'government_id',
        'keywords': [],
        'redaction_default': True
    },
    'Passport': {
        'regex': r'\b[A-Z][0-9]{7}\b',
        'category': 'government_id',
        'keywords': ['passport'],
        'redaction_default': True
    },
    'Bank Account': {
        'regex': r'\b\d{9,18}\b',
        'category': 'financial_information',
        'keywords': ['account', 'a/c', 'bank'],
        'redaction_default': True
    },
    'IFSC': {
        'regex': r'\b[A-Z]{4}0[A-Z0-9]{6}\b',
        'category': 'financial_information',
        'keywords': [],
        'redaction_default': True
    },
    'Email': {
        'regex': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'category': 'contact_information',
        'keywords': [],
        'redaction_default': False
    },
    'Phone': {
        'regex': r'\b(?:\+91[-\s]?)?[6789]\d{9}\b',
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
    address_match = re.search(r'(?i)address:\s*(.+?)(?:\n\n|\n[A-Z][a-z]+:|$)', text, re.DOTALL)
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
