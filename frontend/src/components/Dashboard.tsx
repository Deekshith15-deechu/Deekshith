import React from 'react';
import { ReportAnalysis } from '../types/report';
import { DisclaimerBanner } from './DisclaimerBanner';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Heart,
  Droplet,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface Props {
  reports: ReportAnalysis[];
  onUploadClick: () => void;
  onSelectReport: (report: ReportAnalysis) => void;
  onLoadSample: (index: number) => void;
  onTriggerSimulatedError: () => void;
}

export const Dashboard: React.FC<Props> = ({
  reports,
  onUploadClick,
  onSelectReport,
  onLoadSample,
  onTriggerSimulatedError,
}) => {
  const needsAttentionCount = reports.filter((r) => r.overall_status !== 'all_clear').length;
  const allClearCount = reports.filter((r) => r.overall_status === 'all_clear').length;

  return (
    <div className="space-y-8 pb-12">
      <DisclaimerBanner compact />

      {/* Hero Welcome & Quick Action Card */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-navy-950/10 relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-400/30">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Health Literacy Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome to Your Lab Explanation Portal
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Have a new blood test or diagnostic report from your clinic? Upload your PDF or camera scan to see visual reference intervals and compassionate explanations in plain English.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                <span>Upload New Report</span>
              </button>

              <button
                onClick={() => onLoadSample(0)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Explore CBC Demo</span>
              </button>
            </div>
          </div>

          {/* Healthcare Illustration Graphic */}
          <div className="flex-shrink-0 w-full sm:w-64 md:w-72">
            <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-2xl shadow-teal-900/40 group hover:scale-[1.02] transition-transform">
              <img
                src="/healthcare-illustration.jpg"
                alt="ReportSaathi Healthcare Illustration"
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  Patient-First Diagnostics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Analyzed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-navy-950">{reports.length}</span>
            <span className="text-xs text-slate-500 font-medium">lab reports</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Stored in session memory</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Standard Baseline</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-teal-700">{allClearCount}</span>
            <span className="text-xs text-slate-500 font-medium">all clear</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Within expected clinical ranges
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Doctor Follow-Up Topics</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-700">{needsAttentionCount}</span>
            <span className="text-xs text-slate-500 font-medium">flagged items</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Discussion topics prepared</span>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <h2 className="text-base sm:text-lg font-bold text-navy-950">
              Recent Laboratory Reports
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {reports.length} Reports Ready
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-navy-900 text-base mb-1">No reports in this session</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Upload a test report or load our verified clinical sample to start.
            </p>
            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
            >
              Upload Report
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.slice(0, 5).map((report) => {
              const isNormal = report.overall_status === 'all_clear';
              const paramCount = report.panels.reduce((sum, p) => sum + p.metrics.length, 0);

              return (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-navy-950 group-hover:text-teal-700 transition-colors">
                        {report.report_title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        isNormal
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {isNormal ? 'All Normal' : 'Discussion Topic'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {report.patient_summary}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <span>&bull;</span>
                      <span>{paramCount} Parameters Extracted</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform self-end sm:self-center">
                    <span>View Analysis</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UI State Review Footer */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-navy-900">Prototype Testing:</span>
          <span>Review how errors and scan blurriness are communicated to patients</span>
        </div>
        <button
          onClick={onTriggerSimulatedError}
          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl font-semibold transition-colors"
        >
          Simulate Unreadable Scan Error
        </button>
      </div>
    </div>
  );
};
