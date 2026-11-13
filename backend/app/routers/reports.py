import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.report import ExtractedReportResponse
from app.services.extractor import (
    process_uploaded_document_file,
    FileValidationError,
    EmptyExtractionError
)
from app.services.supabase_service import fetch_user_reports, fetch_report_by_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Reports Analysis & History"])

@router.post(
    "/analyze", 
    response_model=ExtractedReportResponse,
    summary="Analyze uploaded laboratory report document",
    description="Accepts PDF, JPG or PNG. Validates file size (max 10MB) and format, uses safe temporary file handling, extracts text via digital PDF parsing or Tesseract OCR, and extracts present clinical parameters without hallucinating missing values."
)
async def analyze_report_upload(
    file: UploadFile = File(...)
):
    """
    POST /api/reports/analyze
    Validates and extracts laboratory text from uploaded PDF or image file.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload."
        )

    try:
        content = await file.read()
        logger.info(f"Received file for analysis: '{file.filename}', size: {len(content)} bytes, content_type: '{file.content_type}'")

        # Process through secure extractor pipeline
        result = process_uploaded_document_file(
            filename=file.filename,
            file_bytes=content,
            content_type=file.content_type
        )

        return result

    except FileValidationError as fve:
        logger.warning(f"File validation rejected for '{file.filename}': {fve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(fve)
        )
    except EmptyExtractionError as eee:
        logger.warning(f"Empty extraction for '{file.filename}': {eee}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(eee)
        )
    except Exception as e:
        logger.error(f"Unexpected error processing '{file.filename}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the document: {str(e)}"
        )

@router.get("", response_model=List[Dict[str, Any]])
async def get_reports(user_id: Optional[str] = None):
    """
    Returns list of reports for the current user or guest session.
    """
    reports = await fetch_user_reports(user_id=user_id)
    return reports

@router.get("/{report_id}")
async def get_report_detail(report_id: str):
    """
    Retrieve single report analysis by ID.
    """
    report = await fetch_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return report
