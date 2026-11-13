import React from 'react';
import { ReportAnalysis } from '../types/report';
import { MOCK_REPORTS } from '../data/mockReports';
import { DisclaimerBanner } from './DisclaimerBanner';
import { FileSpreadsheet, ArrowRight, Activity, Heart, Droplet, ShieldCheck } from 'lucide-react';

interface Props {
  onSelectReport: (report: ReportAnalysis) => void;
}

export const SampleReportsView: React.FC<Props> = ({ onSelectReport }) => {
  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            <span>Clinical Sample Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Explore Realistic Sample Lab Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            These verified clinical datasets demonstrate how ReportSaathi translates diverse diagnostic test panels into visual reference ranges and plain-English summaries.
          </p>
        </div>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_REPORTS.map((report, idx) => {
          const isCBC = report.id.includes('cbc');
          const isLipid = report.id.includes('lipid');
          const isNormal = report.overall_status === 'all_clear';

          const Icon = isCBC ? Droplet : isLipid ? Heart : Activity;

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400 p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-2xl ${
                    isCBC 
                      ? 'bg-sky-50 text-sky-700' 
                      : isLipid 
                      ? 'bg-rose-50 text-rose-700' 
                      : 'bg-teal-50 text-teal-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isNormal 
                      ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    {isNormal ? 'All Normal' : 'Discussion Topic'}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-navy-950 group-hover:text-teal-700 transition-colors mb-2">
                  {report.report_title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {report.patient_summary}
                </p>

                {/* Key Biomarkers Preview */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Sample Biomarkers Included:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.panels.flatMap(p => p.metrics).slice(0, 4).map((m, mIdx) => (
                      <span key={mIdx} className="text-[11px] font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-navy-900">
                        {m.name}: <strong className="text-navy-950">{m.value}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                <span>Open Full Clinical Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
