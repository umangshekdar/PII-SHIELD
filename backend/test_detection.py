"""Quick test of the PII detection engine with the demo document."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.detectors.pii_engine import analyze_text

DEMO_TEXT = """EMPLOYEE KYC VERIFICATION FORM

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

print("=" * 60)
print("PII SHIELD - Detection Engine Test")
print("=" * 60)

detections = analyze_text(DEMO_TEXT)

print(f"\nTotal detections: {len(detections)}\n")

for d in detections:
    action = "REDACT" if d['redaction_default'] else "KEEP"
    print(f"  {d['type']:20s} | {d['category']:35s} | {d['value'][:30]:30s} | {action}")
    print(f"  {'':20s} | Masked: {d.get('masked_value', 'N/A')}")
    print()

# Verify acceptance criteria
print("=" * 60)
print("ACCEPTANCE TEST")
print("=" * 60)

types_found = {d['type'] for d in detections}
expected_keep = {'Name', 'Email', 'Phone'}
expected_redact = {'Aadhaar', 'PAN', 'Passport', 'Bank Account', 'IFSC', 'Address'}

for t in expected_keep:
    det = next((d for d in detections if d['type'] == t), None)
    status = "PASS" if det and not det['redaction_default'] else "FAIL"
    found = "Found" if det else "NOT FOUND"
    print(f"  {t:20s} -> {found:10s} -> KEEP -> {status}")

for t in expected_redact:
    det = next((d for d in detections if d['type'] == t), None)
    status = "PASS" if det and det['redaction_default'] else "FAIL"
    found = "Found" if det else "NOT FOUND"
    print(f"  {t:20s} -> {found:10s} -> REDACT -> {status}")

print()
