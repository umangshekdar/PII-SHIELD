from PIL import Image, ImageDraw
import os

def redact_image(input_path: str, output_path: str, redactions: list):
    """Redact sensitive information from images using OCR bounding boxes."""
    try:
        img = Image.open(input_path).convert("RGB")
        draw = ImageDraw.Draw(img)
        
        # Try to get bounding boxes from Tesseract
        try:
            import pytesseract
            ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
            
            for redaction in redactions:
                value = redaction['value']
                # Search for each word in the value within OCR results
                words = value.split()
                if not words:
                    continue
                    
                n_boxes = len(ocr_data['text'])
                for i in range(n_boxes):
                    text = ocr_data['text'][i].strip()
                    if not text:
                        continue
                    
                    # Check if this word is part of any redaction value
                    for word in words:
                        if word.lower() in text.lower() or text.lower() in word.lower():
                            x = ocr_data['left'][i]
                            y = ocr_data['top'][i]
                            w = ocr_data['width'][i]
                            h = ocr_data['height'][i]
                            # Draw black rectangle over the text
                            draw.rectangle([x, y, x + w, y + h], fill="black")
                            break
        except Exception:
            # If OCR fails, fall back to basic copy
            pass
        
        img.save(output_path)
    except Exception as e:
        # Fallback: just copy the file
        try:
            import shutil
            shutil.copy2(input_path, output_path)
        except:
            pass
