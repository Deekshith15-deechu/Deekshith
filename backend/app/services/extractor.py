import io
import os
import re
import tempfile
import logging
from typing import Tuple, List, Dict, Any, Optional
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import pdfplumber
from app.core.config import settings
from app.schemas.report import TestMetric

logger = logging.getLogger(__name__)

# Configure tesseract executable if path is explicitly set in .env
if settings.TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
ALLOWED_MIME_TYPES = {'application/pdf', 'image/jpeg', 'image/png', 'image/jpg'}

class FileValidationError(Exception):
    """Raised when file type or size is invalid."""
    pass

class EmptyExtractionError(Exception):
    """Raised when OCR or document reading produces no text."""
    pass

def validate_upload(filename: str, file_size: int, content_type: Optional[str] = None):
    """
    Strict validation of file size and file extension / MIME type.
    """
    if file_size <= 0:
        raise FileValidationError("Uploaded file is empty (0 bytes). Please upload a valid laboratory report.")

    if file_size > MAX_FILE_SIZE_BYTES:
        mb = round(file_size / (1024 * 1024), 2)
        raise FileValidationError(f"File size ({mb} MB) exceeds maximum allowed limit of 10 MB.")

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise FileValidationError(
            f"Unsupported file extension '{ext}'. Only PDF, JPG, and PNG files are accepted."
        )

    if content_type and content_type not in ALLOWED_MIME_TYPES and content_type != 'application/octet-stream':
        raise FileValidationError(
            f"Unsupported MIME type '{content_type}'. Please upload a standard PDF or image file."
        )

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Enhance contrast, convert to grayscale, and sharpen for optimal OCR character recognition.
    """
    try:
        gray = image.convert('L')
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened
    except Exception as e:
        logger.warning(f"Image preprocessing warning: {e}. Falling back to original image.")
        return image

def extract_from_image_file(file_path: str) -> str:
    """
    Extract text from an image file on disk using Pillow and Tesseract OCR.
    """
    try:
        with Image.open(file_path) as img:
            processed = preprocess_image(img)
            # PSM 4: Assume variable sizes of text with column/table structures
            text = pytesseract.image_to_string(processed, config='--psm 4')
            if not text.strip():
                text = pytesseract.image_to_string(processed)
            return text.strip()
    except Exception as e:
        logger.error(f"Tesseract OCR failed on image '{file_path}': {e}")
        raise RuntimeError(f"OCR processing error: {str(e)}")

def extract_from_pdf_file(file_path: str) -> Tuple[str, str, int]:
    """
    Extract text from a PDF file.
    First extracts native digital text layer via pdfplumber.
    If a page has no digital text (scanned PDF), renders the page to an image and runs Tesseract OCR.
    Returns (extracted_text, method_used, total_pages).
    """
    extracted_pages = []
    total_pages = 0
    scanned_pages_count = 0

    try:
        with pdfplumber.open(file_path) as pdf:
            total_pages = len(pdf.pages)
            if total_pages == 0:
                raise EmptyExtractionError("The uploaded PDF has 0 pages.")

            for idx, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text() or ""
                
                # If page has digital text layer of reasonable length
                if len(page_text.strip()) >= 30:
                    extracted_pages.append(f"--- Page {idx} ---\n" + page_text.strip())
                else:
                    # Scanned PDF page fallback to Tesseract OCR
                    scanned_pages_count += 1
                    try:
                        pil_img = page.to_image(resolution=200).original
                        processed = preprocess_image(pil_img)
                        ocr_text = pytesseract.image_to_string(processed)
                        if ocr_text.strip():
                            extracted_pages.append(f"--- Page {idx} (OCR Scan) ---\n" + ocr_text.strip())
                    except Exception as ocr_err:
                        logger.warning(f"OCR fallback on PDF page {idx} failed: {ocr_err}")

    except EmptyExtractionError:
        raise
    except Exception as e:
        logger.error(f"PDF extraction error on '{file_path}': {e}")
        raise RuntimeError(f"PDF extraction error: {str(e)}")

    full_text = "\n\n".join(extracted_pages).strip()
    
    if scanned_pages_count == total_pages:
        method = "scanned_pdf_ocr"
    elif scanned_pages_count > 0:
        method = "pdf_digital_text"
    else:
        method = "pdf_digital_text"

    return full_text, method, total_pages

def sanitize_pii(text: str) -> str:
    """
    Mask common personal identifiers (email addresses, phone numbers, explicit patient ID numbers)
    to maintain patient privacy.
    """
    # Redact email addresses
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[REDACTED_EMAIL]', text)
    # Redact phone numbers (international or standard)
    text = re.sub(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', '[REDACTED_PHONE]', text)
    # Redact Patient MRN / ID numbers
    text = re.sub(r'(?i)(patient\s*id|mrn|uhid|ref\s*no|sample\s*id)[\s:]+([A-Za-z0-9\-]+)', r'\1: [REDACTED_ID]', text)
    return text

def parse_strictly_present_parameters(text: str) -> List[TestMetric]:
    """
    Extracts ONLY biomarkers and reference ranges that are ACTUALLY present in the extracted text.
    NEVER invents missing parameters or missing reference ranges.
    """
    metrics: List[TestMetric] = []
    lines = text.split('\n')

    # Defined patterns for common biomarkers to search for in lines
    # (regex_name, display_name, default_unit, simple_explanation)
    known_biomarkers = [
        (r'\b(?:hemoglobin|hb)\b', 'Hemoglobin (Hb)', 'g/dL', 'Oxygen-carrying protein in red blood cells that delivers oxygen from lungs to body tissues.'),
        (r'\b(?:rbc count|red blood cell count|rbc)\b', 'RBC Count', 'million/mcL', 'The count of oxygen-carrying red blood cells in your blood.'),
        (r'\b(?:hematocrit|pcv)\b', 'Hematocrit (PCV)', '%', 'The percentage of whole blood volume occupied by red blood cells.'),
        (r'\b(?:mcv|mean corpuscular volume)\b', 'MCV', 'fL', 'The average physical size of your individual red blood cells.'),
        (r'\b(?:wbc count|white blood cell count|wbc|total leucocyte count|tlc)\b', 'Total Leucocytes (WBC)', '/mcL', 'Frontline immune defense cells that protect against bacteria, viruses, and infections.'),
        (r'\b(?:platelet count|platelets?)\b', 'Platelet Count', '/mcL', 'Cell fragments essential for normal blood clotting and bruise prevention.'),
        (r'\b(?:fasting blood glucose|fasting glucose|glucose fasting|blood sugar fasting)\b', 'Fasting Blood Glucose', 'mg/dL', 'Measures circulating blood sugar after an overnight fast.'),
        (r'\b(?:hba1c|glycated hemoglobin)\b', 'HbA1c', '%', 'Estimated 3-month average blood glucose control.'),
        (r'\b(?:serum creatinine|creatinine)\b', 'Serum Creatinine', 'mg/dL', 'Metabolic muscle waste product filtered out by healthy kidneys.'),
        (r'\b(?:total cholesterol|cholesterol total)\b', 'Total Cholesterol', 'mg/dL', 'Overall cholesterol level circulating in your bloodstream.'),
        (r'\b(?:ldl cholesterol|ldl)\b', 'LDL Cholesterol', 'mg/dL', 'Low-density lipoprotein that transports cholesterol to tissues.'),
        (r'\b(?:hdl cholesterol|hdl)\b', 'HDL Cholesterol', 'mg/dL', 'High-density lipoprotein that helps remove excess cholesterol.'),
        (r'\b(?:triglycerides?)\b', 'Triglycerides', 'mg/dL', 'Stored form of fats derived from excess caloric intake.'),
    ]

    seen_names = set()

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue

        for pattern, display_name, default_unit, explanation in known_biomarkers:
            if display_name in seen_names:
                continue

            match = re.search(pattern, line_clean, re.IGNORECASE)
            if match:
                # Attempt to extract number following parameter name
                after_match = line_clean[match.end():]
                # Match numbers like 11.2, 245,000, 6,800, 92, etc.
                val_match = re.search(r'[:=\s]+([\d,]+(?:\.\d+)?)', after_match)
                if val_match:
                    val_str = val_match.group(1).replace(',', '')
                    
                    # Search for reference range on the same line (e.g. 12.0 - 16.0 or < 200 or 70-99)
                    ref_range = "Not specified"
                    status = "normal"

                    ref_match = re.search(r'([\d,.]+)\s*-\s*([\d,.]+)', line_clean)
                    less_match = re.search(r'<\s*([\d,.]+)', line_clean)
                    greater_match = re.search(r'>\s*([\d,.]+)', line_clean)

                    try:
                        numeric_val = float(val_str)
                        if ref_match:
                            low_bound = float(ref_match.group(1).replace(',', ''))
                            high_bound = float(ref_match.group(2).replace(',', ''))
                            ref_range = f"{low_bound} - {high_bound}"
                            if numeric_val < low_bound:
                                status = "low"
                            elif numeric_val > high_bound:
                                status = "high"
                            else:
                                status = "normal"
                        elif less_match:
                            high_bound = float(less_match.group(1).replace(',', ''))
                            ref_range = f"< {high_bound}"
                            status = "high" if numeric_val >= high_bound else "normal"
                        elif greater_match:
                            low_bound = float(greater_match.group(1).replace(',', ''))
                            ref_range = f"> {low_bound}"
                            status = "low" if numeric_val < low_bound else "normal"
                    except ValueError:
                        pass

                    # Extract unit if present on line (e.g. g/dL, mg/dL, /mcL, %)
                    unit_match = re.search(r'\b(g/dL|mg/dL|/mcL|/uL|million/mcL|%|fL|pg|mmol/L)\b', line_clean, re.IGNORECASE)
                    detected_unit = unit_match.group(1) if unit_match else default_unit

                    metrics.append(TestMetric(
                        name=display_name,
                        value=val_str,
                        unit=detected_unit,
                        reference_range=ref_range,
                        status=status,
                        simple_explanation=explanation,
                        clinical_context=f"Observed value: {val_str} {detected_unit}."
                    ))
                    seen_names.add(display_name)

    return metrics

def process_uploaded_document_file(
    filename: str, 
    file_bytes: bytes,
    content_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Main pipeline to safely process uploaded report file:
    1. Validates file size and format.
    2. Writes to a safe temporary file using tempfile.NamedTemporaryFile.
    3. Extracts text via pdfplumber or Tesseract OCR.
    4. Guarantees safe removal of the temporary file in a finally block.
    5. Sanitizes PII.
    6. Extracts only actual biomarkers present without hallucinating missing values.
    """
    validate_upload(filename, len(file_bytes), content_type)

    ext = os.path.splitext(filename)[1].lower()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_path = temp_file.name

    try:
        # Write bytes safely to temporary file
        temp_file.write(file_bytes)
        temp_file.flush()
        temp_file.close()

        pages_count = 1

        if ext == '.pdf':
            extracted_text, method, pages_count = extract_from_pdf_file(temp_path)
        else:
            extracted_text = extract_from_image_file(temp_path)
            method = "tesseract_ocr"

        # Check if text extraction resulted in empty output
        if not extracted_text or not extracted_text.strip():
            raise EmptyExtractionError(
                "No readable text could be extracted from this document. "
                "The image or scan may be too blurry, underexposed, or blank. "
                "Please upload a clearer scan."
            )

        # Sanitize personal data
        sanitized_text = sanitize_pii(extracted_text)

        # Extract strictly present biomarkers (never invent missing values)
        extracted_params = parse_strictly_present_parameters(sanitized_text)

        warnings = []
        if len(extracted_params) == 0:
            warnings.append(
                "No standard CBC or lipid biomarker patterns were automatically recognized in the extracted text. "
                "The full extracted text is provided below for review."
            )

        summary = (
            f"Successfully processed {pages_count} page(s) using {method.replace('_', ' ').title()}. "
            f"Extracted {len(sanitized_text)} characters."
        )

        return {
            "processing_status": "success",
            "filename": filename,
            "file_type": content_type or f"application/{ext.lstrip('.')}",
            "file_size_bytes": len(file_bytes),
            "extraction_method": method,
            "pages_processed": pages_count,
            "character_count": len(sanitized_text),
            "extracted_text": sanitized_text,
            "extracted_parameters": extracted_params,
            "summary": summary,
            "warnings": warnings,
            "disclaimer": (
                "EDUCATIONAL NOTICE: ReportSaathi provides educational text extraction and information only. "
                "It is NOT a clinical diagnosis or medical prescription. "
                "Always consult a licensed healthcare professional with your original lab report."
            )
        }

    finally:
        # Ensure temporary file is safely cleaned up on disk
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as cleanup_err:
                logger.warning(f"Failed to remove temporary file '{temp_path}': {cleanup_err}")

def extract_document_text(filename: str, content: bytes) -> Tuple[str, str]:
    """
    Convenience wrapper for raw text extraction and method identification.
    """
    res = process_uploaded_document_file(filename, content)
    return res["extracted_text"], res["extraction_method"]
