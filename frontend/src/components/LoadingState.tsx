import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, FileText, Search, Brain, Shield } from 'lucide-react';

interface Props {
  fileName?: string;
  onCancel?: () => void;
}

export const LoadingState: React.FC<Props> = ({ fileName, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Verifying File & Privacy Sanitization', desc: 'Validating format and scrubbing patient personal data', icon: Shield },
    { title: 'Document Parsing & OCR', desc: 'Reading laboratory values and units from digital/scanned pages', icon: Search },
    { title: 'Matching Reference Intervals', desc: 'Comparing results against clinical normal ranges', icon: FileText },
    { title: 'Translating into Plain Language', desc: 'Generating everyday educational explanations & doctor checklist', icon: Brain },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 700);
    const timer2 = setTimeout(() => setCurrentStep(2), 1600);
    const timer3 = setTimeout(() => setCurrentStep(3), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-6 border border-sky-100">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Processing Your Lab Report
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-sm mx-auto">
        {fileName ? `Analyzing "${fileName}"` : 'Analyzing document parameters for educational breakdown...'}
      </p>

      {/* Steps List */}
      <div className="space-y-4 text-left max-w-md mx-auto mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                isCurrent
                  ? 'bg-sky-50 border-sky-300 shadow-sm'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                  : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-sky-900' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel Processing
        </button>
      )}
    </div>
  );
};
