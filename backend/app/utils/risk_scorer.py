CATEGORY_CONFIG = {
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
