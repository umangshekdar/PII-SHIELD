from app.detectors.regex_detector import detect_regex
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
