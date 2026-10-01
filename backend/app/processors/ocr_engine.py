try:
    import pytesseract
except ImportError:
    pass

def extract_text_from_image(image) -> str:
    try:
        return pytesseract.image_to_string(image)
    except:
        return ""
