import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Educational Reference Only:</strong> ReportSaathi is an educational aid and does not provide clinical diagnosis or medical prescriptions. Consult your doctor for medical advice.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs md:text-sm text-amber-900 leading-relaxed">
          <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
            <span>Educational Use Only &bull; Not Medical Advice</span>
          </h4>
          <p className="text-amber-800">
            ReportSaathi translates medical jargon into plain language so you can have more informed conversations with your healthcare provider. It cannot diagnose illnesses, suggest drug dosages, or replace professional clinical judgment. Always consult a licensed doctor or qualified medical practitioner regarding any health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};
