import React from 'react';
import { TestMetric, MetricStatus } from '../types/report';
import { Check, ArrowDown, ArrowUp, AlertCircle, Info, Activity } from 'lucide-react';

interface Props {
  metric: TestMetric;
}

// Helper to parse reference range strings like "12.0 - 16.0 g/dL" or "< 200 mg/dL" or "> 40"
function parseRange(rangeStr: string = '', valStr: string = '') {
  let low = 0;
  let high = 100;
  let val = parseFloat(valStr.replace(/,/g, ''));

  const rangeMatch = rangeStr.match(/([\d,.]+)\s*-\s*([\d,.]+)/);
  const lessMatch = rangeStr.match(/<\s*([\d,.]+)/);
  const greaterMatch = rangeStr.match(/>\s*([\d,.]+)/);

  if (rangeMatch) {
    low = parseFloat(rangeMatch[1].replace(/,/g, ''));
    high = parseFloat(rangeMatch[2].replace(/,/g, ''));
  } else if (lessMatch) {
    high = parseFloat(lessMatch[1].replace(/,/g, ''));
    low = high * 0.4;
  } else if (greaterMatch) {
    low = parseFloat(greaterMatch[1].replace(/,/g, ''));
    high = low * 2.2;
  }

  if (isNaN(val)) val = (low + high) / 2;

  // Calculate percentage within an extended window [minBound, maxBound]
  const span = high - low;
  const minBound = Math.max(0, low - span * 0.5);
  const maxBound = high + span * 0.5;
  const clampedVal = Math.min(Math.max(val, minBound), maxBound);
  const percentage = Math.round(((clampedVal - minBound) / (maxBound - minBound)) * 100);

  // Normal zone start and end in percent
  const normalStartPct = Math.round(((low - minBound) / (maxBound - minBound)) * 100);
  const normalEndPct = Math.round(((high - minBound) / (maxBound - minBound)) * 100);

  return {
    val,
    low,
    high,
    percentage: Math.min(Math.max(percentage, 5), 95),
    normalStartPct,
    normalEndPct,
  };
}

export const MetricCard: React.FC<Props> = ({ metric }) => {
  const statusUpper = metric.status.toUpperCase();
  const rangeData = parseRange(metric.reference_range, metric.value);

  // Status Styling Configuration
  const isLow = metric.status === 'low';
  const isNormal = metric.status === 'normal';
  const isHigh = metric.status === 'high' || metric.status === 'abnormal';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header & Status Label */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              isNormal 
                ? 'bg-teal-50 text-teal-700' 
                : isLow 
                ? 'bg-sky-50 text-sky-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 text-sm sm:text-base leading-snug">
                {metric.name}
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Standard Biomarker</span>
            </div>
          </div>

          {/* Clear LOW, NORMAL, HIGH status labels */}
          <div>
            {isNormal && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-teal-50 text-teal-800 border border-teal-200 shadow-sm">
                <Check className="w-3.5 h-3.5 text-teal-700 stroke-[2.5]" />
                <span>NORMAL</span>
              </span>
            )}
            {isLow && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-sky-50 text-sky-800 border border-sky-300 shadow-sm">
                <ArrowDown className="w-3.5 h-3.5 text-sky-700 stroke-[2.5]" />
                <span>LOW</span>
              </span>
            )}
            {isHigh && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
                <ArrowUp className="w-3.5 h-3.5 text-amber-800 stroke-[2.5]" />
                <span>HIGH</span>
              </span>
            )}
            {!isNormal && !isLow && !isHigh && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Info className="w-3 h-3 text-slate-500" />
                <span>REVIEW</span>
              </span>
            )}
          </div>
        </div>

        {/* Value and Units Display */}
        <div className="flex items-baseline justify-between bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="ml-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {metric.unit}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Reference Interval
            </span>
            <span className="text-xs font-semibold text-navy-800">
              {metric.reference_range || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Visual Reference-Range Indicator Gauge */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
            <span>Low</span>
            <span className="text-teal-700 font-bold">Standard Target</span>
            <span>High</span>
          </div>

          {/* Range Track with Low, Normal, High zones */}
          <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
            {/* Low Zone */}
            <div 
              style={{ width: `${rangeData.normalStartPct}%` }} 
              className="bg-sky-200 h-full border-r border-white/60"
              title="Below standard reference"
            />
            {/* Normal Zone */}
            <div 
              style={{ width: `${rangeData.normalEndPct - rangeData.normalStartPct}%` }} 
              className="bg-teal-400 h-full"
              title="Normal reference interval"
            />
            {/* High Zone */}
            <div 
              style={{ width: `${100 - rangeData.normalEndPct}%` }} 
              className="bg-amber-200 h-full border-l border-white/60"
              title="Above standard reference"
            />
          </div>

          {/* Marker Needle */}
          <div className="relative h-4 mt-0.5">
            <div 
              style={{ left: `${rangeData.percentage}%` }}
              className="absolute -translate-x-1/2 flex flex-col items-center"
            >
              <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] ${
                isNormal ? 'border-b-teal-700' : isLow ? 'border-b-sky-700' : 'border-b-amber-700'
              }`} />
              <span className={`text-[9px] font-extrabold px-1 py-0.2 rounded shadow-xs text-white ${
                isNormal ? 'bg-teal-700' : isLow ? 'bg-sky-700' : 'bg-amber-700'
              }`}>
                {metric.value}
              </span>
            </div>
          </div>
        </div>

        {/* Plain-Language Explanation */}
        <div className="bg-navy-50/60 rounded-xl p-3 border border-navy-100 text-xs text-navy-950 leading-relaxed">
          <div className="font-semibold text-navy-900 mb-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>In Everyday Words:</span>
          </div>
          <p className="text-slate-600">
            {metric.simple_explanation}
          </p>
        </div>
      </div>

      {/* Clinical Context / Why It Matters Footer */}
      {metric.clinical_context && (
        <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
          <span className="font-bold text-navy-800 flex-shrink-0">Why it matters:</span>
          <span className="leading-normal">{metric.clinical_context}</span>
        </div>
      )}
    </div>
  );
};
