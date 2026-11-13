import React, { useState } from 'react';
import { ReportAnalysis } from '../types/report';
import { DisclaimerBanner } from './DisclaimerBanner';
import { 
  History, 
  Search, 
  Calendar, 
  ChevronRight, 
  Printer, 
  Trash2, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface Props {
  reports: ReportAnalysis[];
  onSelectReport: (report: ReportAnalysis) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<Props> = ({
  reports,
  onSelectReport,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'attention'>('all');

  const filtered = reports.filter((r) => {
    const matchesSearch = r.report_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient_summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'normal') return r.overall_status === 'all_clear';
    if (filterStatus === 'attention') return r.overall_status !== 'all_clear';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold uppercase tracking-wider mb-2 border border-navy-100">
            <History className="w-3.5 h-3.5 text-teal-700" />
            <span>Archived Analyses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Reports History &amp; Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and retrieve previous laboratory breakdowns analyzed on your device.
          </p>
        </div>

        {reports.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3.5 py-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local History</span>
          </button>
        )}
      </div>

      {/* Controls: Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test name or summary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-navy-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus('attention')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'attention'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Needs Discussion
          </button>
          <button
            onClick={() => setFilterStatus('normal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'normal'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Normal
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-navy-900 text-base mb-1">No matching reports found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search keyword.' : 'Upload a lab scan to generate your first breakdown.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((report) => {
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
                      <h3 className="font-bold text-base text-navy-950 group-hover:text-teal-700 transition-colors">
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
                    <span>Open Results</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
