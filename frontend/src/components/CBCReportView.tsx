import React, { useState } from 'react';
import { ReportAnalysis } from '../types/report';
import { MetricCard } from './MetricCard';
import { DoctorQuestions } from './DoctorQuestions';
import { DisclaimerBanner } from './DisclaimerBanner';
import { 
  Printer, 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Share2, 
  Download,
  Lightbulb,
  Building2,
  Stethoscope
} from 'lucide-react';

interface Props {
  report: ReportAnalysis;
  onBack: () => void;
  onUploadNew: () => void;
}

export const CBCReportView: React.FC<Props> = ({
  report,
  onBack,
  onUploadNew,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'all-values' | 'doctor-questions'>('overview');

  const handlePrint = () => {
    window.print();
  };

  // Find CBC metrics
  const allMetrics = report.panels.flatMap((p) => p.metrics);
  const hemoglobin = allMetrics.find((m) => m.name.toLowerCase().includes('hemoglobin'));
  const rbc = allMetrics.find((m) => m.name.toLowerCase().includes('rbc'));
  const hematocrit = allMetrics.find((m) => m.name.toLowerCase().includes('hematocrit') || m.name.toLowerCase().includes('pcv'));
  const mcv = allMetrics.find((m) => m.name.toLowerCase().includes('mcv'));
  const wbc = allMetrics.find((m) => m.name.toLowerCase().includes('wbc') || m.name.toLowerCase().includes('leucocyte'));
  const platelets = allMetrics.find((m) => m.name.toLowerCase().includes('platelet'));

  const primaryCBCMetrics = [hemoglobin, rbc, hematocrit, mcv, wbc, platelets].filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Educational Banner */}
      <div className="no-print">
        <DisclaimerBanner compact />
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-950 px-3.5 py-2 rounded-xl hover:bg-slate-200/60 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onUploadNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Upload Another Scan</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical Summary</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          PRINT-ONLY CLINICAL HEADER (Visible only when printing)
         ======================================================== */}
      <div className="hidden print-only mb-6 border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              REPORT SAATHI &bull; EDUCATIONAL LABORATORY SUMMARY
            </h1>
            <p className="text-xs text-slate-600">
              Diagnostic Health Literacy Translation &bull; Non-Clinical Document
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="font-bold text-slate-900">Report Ref: #RS-CBC-2026</p>
            <p>Printed: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 p-3 bg-slate-100 rounded text-xs border border-slate-300">
          <div><span className="font-bold">Patient:</span> Demo Patient</div>
          <div><span className="font-bold">Age/Gender:</span> 34 / Female</div>
          <div><span className="font-bold">Test:</span> Complete Blood Count (CBC)</div>
          <div><span className="font-bold">Specimen:</span> Whole Blood EDTA</div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Clinical Document Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Hematology Panel
                </span>
                <span className="text-xs text-slate-400">
                  Verified Reference Standard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {report.report_title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Comprehensive evaluation of red blood cells, white blood cells, and platelets.
              </p>
            </div>

            {/* Overall Status Badge */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Doctor Discussion Topic
                </div>
                <div className="text-xs text-slate-200">
                  Low Hemoglobin &amp; RBC indices detected
                </div>
              </div>
            </div>
          </div>

          {/* Patient Demographic & Test Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-navy-700/80 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Patient Name</span>
                <span className="font-semibold text-slate-200">Demo Patient (34 F)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Analysis Date</span>
                <span className="font-semibold text-slate-200">
                  {new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Laboratory Source</span>
                <span className="font-semibold text-slate-200">Metropolis Healthcare</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Referring Scope</span>
                <span className="font-semibold text-slate-200">Routine Wellness Screen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Report Summary & Key Highlights Section */}
        <div className="p-6 sm:p-8 bg-slate-50/60 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-3 text-navy-900">
            <div className="p-2 bg-teal-100 rounded-xl text-teal-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-navy-950">
              Executive Plain-Language Summary
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
            {report.patient_summary}
          </p>

          {/* Key Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
            <div className="p-4 bg-white rounded-2xl border border-sky-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  Oxygen Transport
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  LOW
                </span>
              </div>
              <div className="text-lg font-black text-navy-950">
                11.2 <span className="text-xs font-semibold text-slate-500">g/dL</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Hemoglobin is slightly below 12.0 target; consistent with mild iron deficiency.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-teal-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Immune Defense
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  NORMAL
                </span>
              </div>
              <div className="text-lg font-black text-navy-950">
                6,800 <span className="text-xs font-semibold text-slate-500">/mcL</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Total White Blood Cells are healthy; no markers of active bacterial infection.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-teal-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Clotting Capacity
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  NORMAL
                </span>
              </div>
              <div className="text-lg font-black text-navy-950">
                245,000 <span className="text-xs font-semibold text-slate-500">/mcL</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Platelets are in the optimal zone (150,000 - 450,000) for normal wound healing.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            INDIVIDUAL BIOMARKER CARDS: 
            Hemoglobin, RBC, Hematocrit, MCV, WBC, Platelets
           ======================================================== */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy-950 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                CBC Biomarkers &amp; Visual Range Indicators
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each card shows the observed measurement, target reference interval, and plain-English explanation.
              </p>
            </div>
          </div>

          {/* 6 Individual Biomarker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {primaryCBCMetrics.map((metric, idx) => (
              <MetricCard key={idx} metric={metric} />
            ))}
          </div>

          {/* Interactive Doctor Checklist Questions */}
          <DoctorQuestions
            questions={report.questions_for_doctor}
            lifestyleTips={report.lifestyle_diet_tips}
          />

          {/* ========================================================
              PRINT-ONLY OFFICIAL SIGNATURE & CLINICAL DISCLAIMER
             ======================================================== */}
          <div className="hidden print-only mt-10 pt-8 border-t-2 border-slate-300 text-xs">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="font-bold text-slate-900 mb-1">PATIENT ACKNOWLEDGEMENT</p>
                <p className="text-slate-600 mb-4">
                  I understand that ReportSaathi provides educational translation and not clinical diagnosis.
                </p>
                <div className="border-b border-slate-400 h-8"></div>
                <p className="text-[10px] text-slate-500 mt-1">Patient / Guardian Signature &amp; Date</p>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-1">PHYSICIAN CONSULTATION NOTES</p>
                <p className="text-slate-600 mb-4">
                  Clinical assessment and follow-up plan:
                </p>
                <div className="border-b border-slate-400 h-8"></div>
                <p className="text-[10px] text-slate-500 mt-1">Physician Stamp / Signature</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center italic">
              ReportSaathi &bull; Educational Health Literacy System &bull; Not a clinical diagnostic report.
            </p>
          </div>

          {/* Bottom Persistent Educational Disclaimer */}
          <div className="mt-10 no-print">
            <DisclaimerBanner />
          </div>
        </div>
      </div>
    </div>
  );
};
