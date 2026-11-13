import React from 'react';
import { ReportAnalysis } from '../types/report';
import { X, Calendar, Clock, ChevronRight, FileSpreadsheet, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportAnalysis[];
  onSelectReport: (report: ReportAnalysis) => void;
  onClearHistory?: () => void;
}

export const HistoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Report History
              </h2>
              <p className="text-xs text-slate-500">
                {reports.length} {reports.length === 1 ? 'saved report' : 'saved reports'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">No saved reports yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a report or run the sample demo to see your breakdown history here.
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => {
                    onSelectReport(report);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 bg-white hover:bg-sky-50/40 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-slate-800 group-hover:text-sky-700 truncate pr-2">
                      {report.report_title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {report.patient_summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {report.overall_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {reports.length > 0 && onClearHistory && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local History</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
