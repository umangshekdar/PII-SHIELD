from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from app.config import settings

router = APIRouter()

@router.get("/api/download/{scan_id}")
async def download_file(scan_id: str, filename: str):
    filepath = os.path.join(settings.TEMP_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, filename=filename)
