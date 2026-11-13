# ReportSaathi FastAPI Backend

A secure, educational FastAPI service for extracting and structuring clinical parameters from medical laboratory reports (PDFs, JPGs, and PNGs) using digital PDF parsers and Tesseract OCR.

---

## 🚀 Key Endpoints

### 1. `POST /api/reports/analyze`
Upload a medical laboratory report file for validation, text extraction, and parameter parsing.
- **Accepted Formats**: `.pdf`, `.jpg`, `.jpeg`, `.png`
- **Maximum File Size**: 10 MB
- **Safety**: Safe temporary file handling (`tempfile.NamedTemporaryFile` with guaranteed `finally` cleanup)
- **Extraction**:
  - Digital PDF text via `pdfplumber`
  - Scanned PDF pages & Image scans via `Pillow` image pre-processing + `Tesseract OCR`
  - Patient personal data (PII) masking (emails, phone numbers, MRN/IDs)
  - **Strict Clinical Integrity**: Never invents missing values or reference ranges.
- **Example Response (HTTP 200)**:
  ```json
  {
    "processing_status": "success",
    "filename": "cbc_report.pdf",
    "file_type": "application/pdf",
    "file_size_bytes": 142800,
    "extraction_method": "pdf_digital_text",
    "pages_processed": 1,
    "character_count": 840,
    "extracted_text": "...",
    "extracted_parameters": [
      {
        "name": "Hemoglobin (Hb)",
        "value": "11.2",
        "unit": "g/dL",
        "reference_range": "12.0 - 16.0",
        "status": "low",
        "simple_explanation": "Oxygen-carrying protein in red blood cells..."
      }
    ],
    "summary": "Successfully processed 1 page(s) using Pdf Digital Text.",
    "warnings": [],
    "disclaimer": "EDUCATIONAL NOTICE: ReportSaathi provides educational text extraction and information only. It is NOT a clinical diagnosis or medical prescription."
  }
  ```
- **Error Responses**:
  - `HTTP 400`: Unsupported file extension (e.g. `.exe`, `.txt`), file size > 10MB, or empty file.
  - `HTTP 422`: Unreadable/blurry scan where OCR produces 0 characters.

### 2. `GET /health` & `GET /api/health`
Health check endpoint reporting OCR availability, version, and supported limits:
```json
{
  "status": "healthy",
  "service": "ReportSaathi API",
  "version": "1.0.0",
  "ocr_engine": "Tesseract OCR",
  "ocr_available": true,
  "supported_formats": ["PDF", "JPG", "PNG", "JPEG"],
  "max_upload_size_mb": 10
}
```

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.10+ (tested with Python 3.15)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed and added to system `PATH`.
  - On Windows: verify via `tesseract --version`.

### 2. Installation
Open a terminal in the `backend/` directory:
```powershell
# 1. Create a virtual environment
python -m venv venv

# 2. Activate virtual environment
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

### 3. Run Development Server
```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The interactive Swagger API documentation will be available at:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**
