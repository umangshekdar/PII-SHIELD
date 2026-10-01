import spacy
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
