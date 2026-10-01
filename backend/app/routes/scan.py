from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import aiofiles
from app.config import settings
from app.services.scan_service import scan_file
from app.utils.security import sanitize_filename

router = APIRouter()

ALLOWED_MIME_TYPES = {
    'application/pdf', 'text/plain', 'text/csv',
    'image/png', 'image/jpeg', 'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',  # fallback for some systems
}

@router.post("/api/scan")
async def upload_and_scan(file: UploadFile = File(...)):
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not supported. Supported: {', '.join(settings.ALLOWED_EXTENSIONS)}")
    
    # Read content
    content = await file.read()
    
    # Validate size
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="Maximum file size is 10 MB.")
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file appears to be empty.")
    
    # Sanitize filename and create unique temp path
    safe_name = sanitize_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex[:8]}_{safe_name}"
    filepath = os.path.join(settings.TEMP_DIR, unique_name)
    
    # Save to temp
    async with aiofiles.open(filepath, 'wb') as out_file:
        await out_file.write(content)
        
    try:
        result = scan_file(filepath, file.filename)
        return result
    except Exception as e:
        # Clean up on error
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail="We could not process this document. Please try another file.")
