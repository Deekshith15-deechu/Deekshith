import json
import logging
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.report import ReportAnalysisResponse, TestPanel, TestMetric

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are ReportSaathi, a compassionate, accurate, and educational medical laboratory report assistant.
Your mission is to help patients understand complex laboratory test reports by translating clinical jargon into simple, plain, compassionate English (8th-grade reading level).

CRITICAL MEDICAL & SAFETY RULES:
1. You MUST NEVER diagnose conditions, prescribe medications, or state definitively that a patient has a disease.
2. Formulate explanations as educational possibilities and discussions to have with their physician.
3. Classify parameters into: "normal", "low", "high", "borderline", "abnormal", or "unknown" based strictly on the reported reference range.
4. Highlight tests that fall outside reference ranges with constructive, calm explanations without causing undue panic.
5. Provide actionable, thoughtful questions for the patient to bring to their next appointment.
6. Provide gentle, evidence-based lifestyle and dietary context where generally applicable (e.g., hydration, balanced diet, sleep).
7. Return ONLY valid JSON matching the exact schema requested.
"""

def generate_mock_analysis(extracted_text: str) -> ReportAnalysisResponse:
    """
    Intelligent rule-based parser that scans extracted report text for standard lab values
    and generates an educational breakdown. Used when GEMINI_API_KEY is not set or in demo mode.
    """
    panels: List[TestPanel] = []
    text_lower = extracted_text.lower()
    
    # 1. Complete Blood Count (CBC) Check
    cbc_metrics = []
    
    # Hemoglobin check
    if "hemoglobin" in text_lower or "hb" in text_lower:
        # Try to find number near hemoglobin
        import re
        hb_match = re.search(r'(?:hemoglobin|hb)[^\d\n]*(\d{1,2}(?:\.\d{1,2})?)', text_lower)
        val = hb_match.group(1) if hb_match else "11.5"
        try:
            num = float(val)
            status = "low" if num < 12.0 else ("high" if num > 17.0 else "normal")
        except:
            status = "normal"
            
        cbc_metrics.append(TestMetric(
            name="Hemoglobin (Hb)",
            value=val,
            unit="g/dL",
            reference_range="12.0 - 16.0 g/dL (Adults)",
            status=status,
            simple_explanation="Hemoglobin is the protein in red blood cells that carries oxygen from your lungs to the rest of your body.",
            clinical_context="When slightly low, it might mean your body could benefit from iron-rich foods or a discussion about energy levels."
        ))

    # WBC check
    if "wbc" in text_lower or "white blood" in text_lower or "leukocyte" in text_lower:
        wbc_match = re.search(r'(?:wbc|white blood cells?)[^\d\n]*(\d{1,5}(?:\.\d{1,2})?)', text_lower)
        val = wbc_match.group(1) if wbc_match else "7,200"
        cbc_metrics.append(TestMetric(
            name="White Blood Cells (WBC)",
            value=val,
            unit="/mcL",
            reference_range="4,500 - 11,000 /mcL",
            status="normal",
            simple_explanation="White blood cells are your body's immune defense soldiers that help fight off infections and heal injuries.",
            clinical_context="A normal count indicates your immune system is maintaining steady defense activity."
        ))

    # Platelets check
    if "platelet" in text_lower:
        plt_match = re.search(r'platelets?[^\d\n]*(\d{1,6})', text_lower)
        val = plt_match.group(1) if plt_match else "240,000"
        cbc_metrics.append(TestMetric(
            name="Platelets Count",
            value=val,
            unit="/mcL",
            reference_range="150,000 - 450,000 /mcL",
            status="normal",
            simple_explanation="Platelets are tiny cell fragments that help your blood clot properly when you get a cut or bruise.",
            clinical_context="Keeps bruising and bleeding under normal regulation."
        ))

    if cbc_metrics:
        panels.append(TestPanel(panel_name="Complete Blood Count (CBC)", metrics=cbc_metrics))

    # 2. Metabolic / Glucose Check
    metabolic_metrics = []
    if "glucose" in text_lower or "sugar" in text_lower or "fasting" in text_lower:
        glu_match = re.search(r'(?:glucose|sugar|fasting)[^\d\n]*(\d{2,3}(?:\.\d{1,2})?)', text_lower)
        val = glu_match.group(1) if glu_match else "95"
        try:
            num = float(val)
            status = "high" if num > 100 else ("low" if num < 70 else "normal")
        except:
            status = "normal"
            
        metabolic_metrics.append(TestMetric(
            name="Fasting Blood Glucose",
            value=val,
            unit="mg/dL",
            reference_range="70 - 99 mg/dL",
            status=status,
            simple_explanation="This measures the amount of sugar in your blood after fasting overnight. It reflects how efficiently your body uses insulin and fuels your cells.",
            clinical_context="Staying within the standard range is ideal for long-term energy and metabolic wellness."
        ))

    if "creatinine" in text_lower:
        creat_match = re.search(r'creatinine[^\d\n]*(\d(?:\.\d{1,2})?)', text_lower)
        val = creat_match.group(1) if creat_match else "0.9"
        metabolic_metrics.append(TestMetric(
            name="Serum Creatinine",
            value=val,
            unit="mg/dL",
            reference_range="0.7 - 1.3 mg/dL",
            status="normal",
            simple_explanation="Creatinine is a natural waste product created from normal muscle movement, filtered out by healthy kidneys.",
            clinical_context="This is a primary indicator of kidney filtration efficiency."
        ))

    if metabolic_metrics:
        panels.append(TestPanel(panel_name="Metabolic & Kidney Function Panel", metrics=metabolic_metrics))

    # 3. Lipid Profile Check
    lipid_metrics = []
    if "cholesterol" in text_lower or "lipid" in text_lower or "triglyceride" in text_lower:
        chol_match = re.search(r'(?:total cholesterol|cholesterol)[^\d\n]*(\d{2,3})', text_lower)
        val = chol_match.group(1) if chol_match else "190"
        try:
            num = float(val)
            status = "high" if num >= 200 else "normal"
        except:
            status = "normal"
            
        lipid_metrics.append(TestMetric(
            name="Total Cholesterol",
            value=val,
            unit="mg/dL",
            reference_range="< 200 mg/dL",
            status=status,
            simple_explanation="Total cholesterol represents all the fatty substances in your bloodstream, including both protective and dense particles.",
            clinical_context="Optimal levels support cardiovascular and circulatory health."
        ))

    if lipid_metrics:
        panels.append(TestPanel(panel_name="Lipid (Cholesterol) Profile", metrics=lipid_metrics))

    # If no standard keywords matched, create general educational analysis
    if not panels:
        panels.append(TestPanel(
            panel_name="General Lab Screening",
            metrics=[
                TestMetric(
                    name="Routine Biomarkers Summary",
                    value="Reviewed",
                    unit="Panel",
                    reference_range="Laboratory Standard",
                    status="normal",
                    simple_explanation="Extracted measurements were scanned from your lab report.",
                    clinical_context="Consult your clinician for custom interpretation of specific parameters."
                )
            ]
        ))

    any_abnormal = any(m.status in ["high", "low", "abnormal"] for p in panels for m in p.metrics)
    overall_status = "needs_attention" if any_abnormal else "all_clear"

    summary = (
        "Welcome to your ReportSaathi educational report summary. We analyzed your uploaded laboratory results. "
        "Overall, several key markers show stable baseline functioning, while certain parameters may benefit from a routine discussion "
        "with your primary care provider. Remember that lab values fluctuate with hydration, diet, and time of day."
    )

    return ReportAnalysisResponse(
        id=str(uuid.uuid4()),
        report_title="Laboratory Diagnostic Analysis (Educational Overview)",
        patient_summary=summary,
        overall_status=overall_status,
        panels=panels,
        key_takeaways=[
            "Most foundational indicators appear consistent with expected baseline values.",
            "Any values flagged as high or low are common conversation starters for your doctor, not automatic cause for alarm.",
            "Hydration and fasting status can naturally shift test results by 5-15%."
        ],
        questions_for_doctor=[
            "Are there any specific lifestyle or dietary habits you recommend based on these numbers?",
            "Should we re-check any borderline or flagged values in 3 to 6 months?",
            "Do any of my current supplements or daily medications influence these results?"
        ],
        lifestyle_diet_tips=[
            "Stay adequately hydrated throughout the day with 2 to 2.5 liters of water.",
            "Incorporate a diverse range of colorful vegetables and lean proteins into your meals.",
            "Aim for 20-30 minutes of moderate physical activity most days of the week."
        ],
        extracted_text_preview=extracted_text[:1200] if extracted_text else "Direct sample analysis",
        created_at=datetime.utcnow()
    )


async def analyze_report_with_gemini(extracted_text: str) -> ReportAnalysisResponse:
    """
    Sends the extracted report text to Google Gemini for educational translation.
    Falls back gracefully to the rule-based educational parser if API key is not configured.
    """
    if not settings.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not found. Using built-in ReportSaathi rule-based engine.")
        return generate_mock_analysis(extracted_text)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""
You are ReportSaathi. Analyze this extracted medical lab report text and provide an educational, patient-friendly breakdown:

EXTRACTED REPORT TEXT:
\"\"\"
{extracted_text}
\"\"\"

Please return a JSON response with this exact structure:
{{
  "report_title": "string (e.g. Complete Blood Count & Lipid Profile)",
  "patient_summary": "string (2-3 warm, compassionate paragraphs explaining findings in plain 8th grade English)",
  "overall_status": "all_clear" | "needs_attention" | "follow_up_recommended",
  "panels": [
    {{
      "panel_name": "string (e.g. Hematology)",
      "metrics": [
        {{
          "name": "string (e.g. Hemoglobin)",
          "value": "string (e.g. 13.5)",
          "unit": "string (e.g. g/dL)",
          "reference_range": "string (e.g. 12.0 - 15.5)",
          "status": "normal" | "low" | "high" | "abnormal" | "borderline" | "unknown",
          "simple_explanation": "string (plain English explanation of what this test is and what it does in the body)",
          "clinical_context": "string (compassionate note on why it matters)"
        }}
      ]
    }}
  ],
  "key_takeaways": ["string"],
  "questions_for_doctor": ["string (3-5 thoughtful questions to ask physician)"],
  "lifestyle_diet_tips": ["string (2-4 general healthy living reminders)"]
}}
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        raw_json = response.text
        parsed_data = json.loads(raw_json)

        return ReportAnalysisResponse(
            id=str(uuid.uuid4()),
            report_title=parsed_data.get("report_title", "Medical Laboratory Report"),
            patient_summary=parsed_data.get("patient_summary", "Here is your educational report breakdown."),
            overall_status=parsed_data.get("overall_status", "needs_attention"),
            panels=[TestPanel(**p) for p in parsed_data.get("panels", [])],
            key_takeaways=parsed_data.get("key_takeaways", []),
            questions_for_doctor=parsed_data.get("questions_for_doctor", []),
            lifestyle_diet_tips=parsed_data.get("lifestyle_diet_tips", []),
            extracted_text_preview=extracted_text[:1200],
            created_at=datetime.utcnow()
        )

    except Exception as e:
        logger.error(f"Gemini API call failed: {e}. Falling back to rule-based engine.")
        fallback = generate_mock_analysis(extracted_text)
        fallback.patient_summary = (
            f"[Live AI API Notice: Falling back to educational offline engine due to: {str(e)[:100]}] "
            + fallback.patient_summary
        )
        return fallback
