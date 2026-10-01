from fastapi import APIRouter, HTTPException
from app.models.schemas import RedactRequest
from app.services.redaction_service import redact_file

router = APIRouter()

@router.post("/api/redact")
async def redact(req: RedactRequest):
    try:
        result = redact_file(req.scan_id, req.redaction_ids)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
