import os
from app.config import settings

def validate_file(filename: str, size: int) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in settings.ALLOWED_EXTENSIONS and size <= settings.MAX_UPLOAD_SIZE
