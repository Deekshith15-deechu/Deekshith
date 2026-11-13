import React, { useState } from 'react';
import { ReportAnalysis } from '../types/report';
import { MetricCard } from './MetricCard';
import { DoctorQuestions } from './DoctorQuestions';
import { DisclaimerBanner } from './DisclaimerBanner';
import { CheckCircle2, AlertTriangle, AlertCircle, Printer, ArrowLeft, Lightbulb, FileText, Activity } from 'lucide-react';

interface Props {
  analysis: ReportAnalysis;
  onBack: () => void;
}

export const AnalysisView: React.FC<Props> = ({ analysis, onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'values' | 'explanations'>('all');

  const handlePrint = () => {
    window.print();
  };

  const getStatusDisplay = (status: ReportAnalysis['overall_status']) => {
    switch (status) {
      case 'all_clear':
        return {
          title: 'All Standard Reference Ranges Met',
          desc: 'All tested markers fall within standard laboratory reference intervals.',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
      case 'follow_up_recommended':
        return {
          title: 'Doctor Follow-Up Recommended',
          desc: 'One or more values suggest routine follow-up with your physician.',
          badge: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
        };
      default:
        return {
          title: 'Selected Markers Outside Baseline Ranges',
          desc: 'A few indicators differ slightly from reference intervals.',
          badge: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
    }
  };

  const statusInfo = getStatusDisplay(analysis.overall_status);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Interactive Results Demo
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Educational Report Breakdown
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                Verified Clinical Dataset
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {analysis.report_title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Analyzed on {new Date(analysis.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${statusInfo.badge}`}>
            {statusInfo.icon}
            <div>
              <div className="font-bold text-xs sm:text-sm">{statusInfo.title}</div>
              <div className="text-[11px] opacity-90">{statusInfo.desc}</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Plain-Language Summary */}
        <section className="my-8 p-6 bg-gradient-to-br from-sky-50/80 via-white to-teal-50/50 rounded-2xl border border-sky-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-sky-600" />
            Plain-Language Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {analysis.patient_summary}
          </p>

          {analysis.key_takeaways.length > 0 && (
            <div className="mt-5 pt-4 border-t border-sky-100/80">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Key Highlights:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                {analysis.key_takeaways.map((takeaway, idx) => (
                  <li key={idx} className="bg-white/80 p-2.5 rounded-lg border border-sky-100 flex items-start gap-2">
                    <span className="text-sky-600 font-bold">&bull;</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* SECTION 2: Extracted Values & Clinical Measurements */}
        <section className="space-y-8 my-8">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                Extracted Values &amp; Reference Ranges
              </h2>
              <p className="text-xs text-slate-500">
                All values extracted from the report, compared against laboratory reference intervals.
              </p>
            </div>
          </div>

          {analysis.panels.map((panel, panelIdx) => (
            <div key={panelIdx} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-600"></div>
                <h3 className="font-bold text-base text-slate-800">
                  {panel.panel_name}
                </h3>
                <span className="text-xs text-slate-400">
                  ({panel.metrics.length} tests)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {panel.metrics.map((metric, metricIdx) => (
                  <MetricCard key={metricIdx} metric={metric} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 3: Questions for Your Doctor */}
        <section className="my-8">
          <DoctorQuestions
            questions={analysis.questions_for_doctor}
            lifestyleTips={analysis.lifestyle_diet_tips}
          />
        </section>

        {/* Raw Text Preview Collapsible */}
        {analysis.extracted_text_preview && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <details className="text-xs text-slate-500 cursor-pointer">
              <summary className="font-semibold text-slate-600 hover:text-sky-600">
                View Extracted OCR Text Preview
              </summary>
              <pre className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto text-slate-700 whitespace-pre-wrap">
                {analysis.extracted_text_preview}
              </pre>
            </details>
          </div>
        )}

        {/* SECTION 4: Clear Bottom Disclaimer */}
        <div className="mt-10">
          <DisclaimerBanner />
        </div>
      </div>
    </div>
  );
};
