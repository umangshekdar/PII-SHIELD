from fastapi import APIRouter
import os
from app.config import settings
from app.services.scan_service import scan_file

router = APIRouter()

DEMO_CONTENT = """EMPLOYEE KYC VERIFICATION FORM

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
"""

@router.post("/api/demo")
async def run_demo():
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    filename = "demo_employee_kyc.txt"
    filepath = os.path.join(settings.TEMP_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(DEMO_CONTENT)
        
    result = scan_file(filepath, filename)
    return result
