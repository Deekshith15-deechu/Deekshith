import React from 'react';
import { HeartPulse, ArrowRight, ShieldCheck, Sparkles, BookOpen, HelpCircle, Activity, FileText } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

interface Props {
  onGoToDashboard: () => void;
  onOpenUpload: () => void;
  onSelectSample: (index: number) => void;
}

export const LandingPage: React.FC<Props> = ({
  onGoToDashboard,
  onOpenUpload,
  onSelectSample,
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Disclaimer at top */}
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 sm:pt-8 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-4 border border-sky-200">
          <HeartPulse className="w-4 h-4 text-sky-600" />
          <span>Educational Health Literacy Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Demystifying Medical Lab Reports in{' '}
          <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            Plain, Simple Language
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          ReportSaathi translates confusing clinical lab sheets (PDFs and smartphone photos) into plain-English explanations, visual normal ranges, and tailored questions for your doctor.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <FileText className="w-5 h-5" />
            <span>Upload Your Lab Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 shadow-sm transition-all"
          >
            <span>View Dashboard &amp; History</span>
          </button>
        </div>

        {/* Demo banner indicator */}
        <div className="mt-4 text-xs text-slate-600 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Interactive Frontend Demo • Realistic Sample Clinical Data Ready</span>
        </div>

        {/* Featured Healthcare Graphic */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="rounded-3xl overflow-hidden border-2 border-teal-500/30 shadow-xl shadow-teal-900/10 hover:shadow-2xl transition-shadow bg-navy-900">
            <img
              src="/healthcare-illustration.jpg"
              alt="ReportSaathi Healthcare Banner"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            Simple 3-Step Process
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How ReportSaathi Helps You
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Upload Report Scan
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload your digital PDF or snap a clear smartphone photo of your printed lab test from any clinic (CBC, Lipid, Metabolic panel).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Decipher Parameters
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The engine matches each numeric parameter against standard clinical reference ranges to show you what is normal, low, or high.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Actionable Doctor Checklist
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive a plain-language summary plus practical, personalized questions to ask your physician at your next consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sample Reports Section */}
      <section className="bg-gradient-to-br from-sky-50/80 via-white to-teal-50/60 rounded-3xl border border-sky-100 p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try It Right Away</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Explore Realistic Sample Lab Reports
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Click any clinical sample below to experience the full breakdown and results screen:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectSample(0)}
            className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                Hematology
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Mild Anemia Pattern
              </span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-sky-700 text-sm mb-1">
              Complete Blood Count (CBC)
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              Low hemoglobin and hematocrit indicators with healthy immune and platelet parameters.
            </p>
            <div className="mt-3 text-xs font-semibold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectSample(1)}
            className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                Lipids &amp; Heart
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Elevated LDL
              </span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-sky-700 text-sm mb-1">
              Fasting Lipid Profile
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              Elevated Total &amp; LDL cholesterol alongside protective HDL and balanced triglycerides.
            </p>
            <div className="mt-3 text-xs font-semibold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectSample(2)}
            className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Biochemistry
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Normal
              </span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-sky-700 text-sm mb-1">
              Metabolic &amp; Renal Screening
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              Optimal fasting glucose (92 mg/dL), normal HbA1c, and healthy kidney filtration indices.
            </p>
            <div className="mt-3 text-xs font-semibold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* Educational Purpose Card */}
      <section className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-bold text-lg sm:text-xl text-white">
              Our Safety &amp; Educational Commitment
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ReportSaathi was designed with health literacy as its guiding pillar. Medical laboratory reports frequently trigger unnecessary anxiety when patients search raw clinical terms online. ReportSaathi places test numbers into proper educational context and prepares you to have productive, calm dialogues with your physician.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Zero diagnostic prescriptions or medical assertions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Contextual reference range comparisons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Respects patient privacy &amp; redacts PII</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Doctor conversation checklist included</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
