# ReportSaathi (रिपोर्ट साथी)
### Educational Medical Laboratory Report Explanation Engine

ReportSaathi is a full-stack web application designed to help patients understand complex laboratory reports in compassionate, plain English (at an 8th-grade reading level). It bridges the communication gap between diagnostic data and patients by deciphering tests, providing reference-range context, and preparing patients with actionable questions for their doctor.

---

## ⚕️ Important Medical & Safety Disclaimer
> **FOR EDUCATIONAL PURPOSES ONLY**: ReportSaathi is strictly an educational tool and does **NOT** provide medical advice, diagnosis, or treatment. It does not replace the clinical judgment of a licensed healthcare professional. Always consult your doctor or primary care physician regarding any lab findings.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic v2
- **Extraction Pipeline**: Dual PDF extractor (`pdfplumber` / `pypdf`) & Tesseract OCR (`pytesseract`, `Pillow`)
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`) with structured JSON schema + Offline Rule-Based Fallback
- **Data Persistence**: Supabase (optional user accounts & report history) + LocalStorage offline fallback

---

## 📂 Project Structure

```
deekshith/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py          # App settings & environment loading
│   │   ├── schemas/
│   │   │   └── report.py          # Pydantic schemas for lab parameters & responses
│   │   ├── services/
│   │   │   ├── extractor.py       # PDF parser & Tesseract OCR engine with PII masking
│   │   │   ├── gemini_service.py  # Gemini API prompt pipeline & rule-based analyzer
│   │   │   └── supabase_service.py# Supabase report persistence & session fallback
│   │   ├── routers/
│   │   │   ├── analyze.py         # /api/analyze endpoints (upload, raw text, sample)
│   │   │   └── reports.py         # /api/reports endpoints (history)
│   │   └── main.py                # FastAPI entry point & CORS configuration
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Header, brand, quick sample and history links
│   │   │   ├── DisclaimerBanner.tsx # Medical educational disclaimer
│   │   │   ├── FileUpload.tsx     # Drag & drop upload (PDF, JPG, PNG) & raw text tab
│   │   │   ├── AnalysisView.tsx   # Structured breakdown dashboard & PDF print
│   │   │   ├── MetricCard.tsx     # Parameter gauge cards with range indicators
│   │   │   ├── DoctorQuestions.tsx# Interactive checklist of questions for the doctor
│   │   │   ├── HistoryDrawer.tsx  # Drawer showing past reports
│   │   │   └── AuthModal.tsx      # Optional Supabase user authentication modal
│   │   ├── lib/
│   │   │   ├── api.ts             # Backend API client
│   │   │   └── supabase.ts        # Supabase client initializer
│   │   ├── types/
│   │   │   └── report.ts          # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## 🛠️ Local Setup & Running Instructions

### 1. Prerequisites
- **Python 3.10+** (tested with 3.15)
- **Node.js 18+** & npm
- **Tesseract OCR** (installed and in your system PATH)

### 2. Backend Setup
1. Open a terminal in the root directory:
   ```powershell
   cd backend
   .\venv\Scripts\activate
   # Or create new venv: python -m venv venv
   pip install -r requirements.txt
   ```
2. Configure `.env` (optional):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DEMO_MODE=true
   SUPABASE_URL=
   SUPABASE_KEY=
   ```
3. Run the FastAPI development server:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
   API Docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
1. In a separate terminal:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 🌟 Key Features
- **Intelligent Dual Extraction**: Extracts native digital text from PDF reports, or applies image contrast enhancement and Tesseract OCR for camera scans and paper photos.
- **Privacy First (PII Scrubbing)**: Automatically masks emails, phone numbers, and patient IDs before LLM processing.
- **Offline / Demo Capable**: Comes with a built-in educational engine that operates even without a Gemini API key or internet connection.
- **Doctor Discussion Checklist**: Generates prioritized, patient-friendly questions to take to the doctor.
- **Export & Print**: Clean, printable layout ready for taking directly to the physician's office.
