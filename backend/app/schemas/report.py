from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class TestMetric(BaseModel):
    name: str = Field(..., description="Name of the test parameter (e.g., Hemoglobin, Fasting Glucose)")
    value: str = Field(..., description="Observed value from the report")
    unit: str = Field(default="", description="Unit of measurement (e.g., mg/dL, g/dL, %)")
    reference_range: str = Field(default="Not specified", description="Standard reference / normal range")
    status: Literal["normal", "low", "high", "abnormal", "borderline", "unknown"] = Field(
        default="unknown", description="Classification against reference range"
    )
    simple_explanation: str = Field(
        default="", description="Educational explanation in simple, compassionate plain English"
    )
    clinical_context: Optional[str] = Field(
        default="", description="Why this test matters in plain words"
    )

class TestPanel(BaseModel):
    panel_name: str = Field(..., description="Group name (e.g., Complete Blood Count, Lipid Profile, Renal Function)")
    metrics: List[TestMetric] = Field(default_factory=list)

class ReportAnalysisResponse(BaseModel):
    id: str
    report_title: str
    patient_summary: str = Field(
        ..., description="A friendly, easy-to-understand 2-3 paragraph explanation of the overall results"
    )
    overall_status: Literal["all_clear", "needs_attention", "follow_up_recommended"] = Field(
        default="needs_attention"
    )
    panels: List[TestPanel] = Field(default_factory=list)
    key_takeaways: List[str] = Field(default_factory=list)
    questions_for_doctor: List[str] = Field(
        default_factory=list, description="Actionable questions the patient can ask their physician"
    )
    lifestyle_diet_tips: List[str] = Field(
        default_factory=list, description="General evidence-backed educational wellness tips"
    )
    extracted_text_preview: str = Field(default="")
    disclaimer: str = Field(
        default="EDUCATIONAL DISCLAIMER: ReportSaathi is an educational aid and does NOT provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional with any questions regarding your medical condition or lab results."
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExtractedReportResponse(BaseModel):
    processing_status: Literal["success", "partial", "error", "empty_text"] = Field(
        default="success", description="Status of the extraction pipeline"
    )
    filename: str
    file_type: str
    file_size_bytes: int
    extraction_method: Literal["pdf_digital_text", "scanned_pdf_ocr", "tesseract_ocr", "plain_text"]
    pages_processed: int = 1
    character_count: int = 0
    extracted_text: str = Field(..., description="Full text extracted from the document")
    extracted_parameters: List[TestMetric] = Field(
        default_factory=list, description="Strictly extracted biomarkers found in the text (never invented)"
    )
    summary: Optional[str] = Field(default="", description="Plain-language educational summary")
    warnings: List[str] = Field(default_factory=list)
    disclaimer: str = Field(
        default="EDUCATIONAL NOTICE: ReportSaathi provides educational text extraction and information only. It is NOT a clinical diagnosis or medical prescription. Always consult a licensed healthcare professional with your original lab report."
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TextAnalysisRequest(BaseModel):
    text: str
    patient_notes: Optional[str] = None
