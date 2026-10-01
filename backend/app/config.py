import os
import tempfile

class Settings:
    # Use system temp directory — avoids OneDrive / cloud-sync permission issues
    TEMP_DIR: str = os.path.join(tempfile.gettempdir(), 'pii_shield')
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.docx', '.xlsx', '.csv', '.png', '.jpg', '.jpeg'}
    ALLOWED_MIME_TYPES = {
        'application/pdf', 'text/plain', 'text/csv',
        'image/png', 'image/jpeg', 'image/jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream',
    }

settings = Settings()
# Directory is created by the lifespan handler in main.py, not here.
