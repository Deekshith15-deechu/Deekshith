export type MetricStatus = 'normal' | 'low' | 'high' | 'abnormal' | 'borderline' | 'unknown';

export interface TestMetric {
  name: string;
  value: string;
  unit?: string;
  reference_range?: string;
  status: MetricStatus;
  simple_explanation: string;
  clinical_context?: string;
}

export interface TestPanel {
  panel_name: string;
  metrics: TestMetric[];
}

export interface ReportAnalysis {
  id: string;
  report_title: string;
  patient_summary: string;
  overall_status: 'all_clear' | 'needs_attention' | 'follow_up_recommended';
  panels: TestPanel[];
  key_takeaways: string[];
  questions_for_doctor: string[];
  lifestyle_diet_tips: string[];
  extracted_text_preview?: string;
  disclaimer: string;
  created_at: string;
}

export interface AnalyzeReportResponse {
  processing_status: 'success' | 'partial' | 'error' | 'empty_text';
  filename: string;
  file_type: string;
  file_size_bytes: number;
  extraction_method: 'pdf_digital_text' | 'scanned_pdf_ocr' | 'tesseract_ocr' | 'plain_text';
  pages_processed: number;
  character_count: number;
  extracted_text: string;
  extracted_parameters: TestMetric[];
  summary?: string;
  warnings?: string[];
  disclaimer: string;
  timestamp: string;
}
