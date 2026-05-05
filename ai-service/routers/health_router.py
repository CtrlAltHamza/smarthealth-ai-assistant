from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "OK", "service": "SmartHealth AI Service", "version": "1.0.0"}
