import React from 'react';
import { HeartPulse, LayoutDashboard, Plus, Home, Sparkles } from 'lucide-react';

interface Props {
  currentView: 'landing' | 'dashboard' | 'upload' | 'loading' | 'results' | 'error';
  onNavigate: (view: 'landing' | 'dashboard' | 'upload') => void;
  onLoadSample: (index: number) => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  onLoadSample,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-sky-700 to-teal-600 bg-clip-text text-transparent">
                ReportSaathi
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hidden sm:inline-block">
                Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Lab Reports in Plain English
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              currentView === 'landing'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onLoadSample(0)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Sample CBC</span>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
};
