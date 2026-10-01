from PIL import Image
from app.processors.ocr_engine import extract_text_from_image

def process_image(filepath: str) -> str:
    try:
        with Image.open(filepath) as img:
            return extract_text_from_image(img)
    except Exception as e:
        print(f"Error Image: {e}")
        return ""
