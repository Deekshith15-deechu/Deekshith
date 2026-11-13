import logging
import pytesseract
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import analyze, reports

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("reportsaathi")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ReportSaathi Backend - Educational Medical Laboratory Report Extraction and Explanation Engine"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(analyze.router, prefix=settings.API_V1_STR)

def check_tesseract_status() -> bool:
    try:
        ver = pytesseract.get_tesseract_version()
        return bool(ver)
    except Exception:
        return False

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Service health check endpoint verifying runtime and OCR status.
    """
    tesseract_ok = check_tesseract_status()
    return {
        "status": "healthy" if tesseract_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ocr_engine": "Tesseract OCR",
        "ocr_available": tesseract_ok,
        "supported_formats": ["PDF", "JPG", "PNG", "JPEG"],
        "max_upload_size_mb": 10,
        "disclaimer": "Educational use only. Not for clinical diagnosis."
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to ReportSaathi API - Educational Medical Laboratory Report Engine",
        "endpoints": {
            "analyze_report": "POST /api/reports/analyze",
            "health_check": "GET /health or /api/health",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
