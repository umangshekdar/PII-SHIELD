from pydantic import BaseModel
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
