import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw, Sparkles, FileText } from 'lucide-react';

interface Props {
  errorMessage: string;
  onRetry: () => void;
  onBackToDashboard: () => void;
  onLoadSample: () => void;
}

export const ErrorState: React.FC<Props> = ({
  errorMessage,
  onRetry,
  onBackToDashboard,
  onLoadSample,
}) => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl shadow-rose-100/50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 border border-rose-200">
        <AlertCircle className="w-8 h-8 text-rose-600" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
        Processing Issue Detected
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Unable to Complete Report Analysis
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        {errorMessage || 'We encountered an unexpected issue while reading the uploaded document. This usually happens if the scan is skewed, blurry, or formatted in an unreadable resolution.'}
      </p>

      {/* Recommended Tips Box */}
      <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 text-left text-xs text-rose-950 mb-8 max-w-md mx-auto space-y-1.5">
        <div className="font-semibold text-rose-900 mb-1">Helpful Tips for Lab Scans:</div>
        <div className="flex items-start gap-2">
          <span>&bull;</span>
          <span>Ensure good room lighting without heavy flash glares or finger shadows.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>&bull;</span>
          <span>Only use supported formats: <strong>PDF, JPG, PNG</strong> up to 10MB.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>&bull;</span>
          <span>Check that test names and numbers are visibly in focus.</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload Another File</span>
        </button>

        <button
          onClick={onLoadSample}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Use Sample Data Instead</span>
        </button>

        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};
