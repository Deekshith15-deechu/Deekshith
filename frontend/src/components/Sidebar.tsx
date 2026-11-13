import React from 'react';
import { 
  HeartPulse, 
  LayoutDashboard, 
  UploadCloud, 
  Activity, 
  FileSpreadsheet, 
  History, 
  BookOpen, 
  X, 
  ShieldAlert, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type NavigationItem = 'dashboard' | 'upload' | 'cbc' | 'samples' | 'history' | 'guide';

interface Props {
  activeTab: NavigationItem;
  onNavigate: (tab: NavigationItem) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationItem, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'upload' as NavigationItem, label: 'Upload Lab Report', icon: UploadCloud, badge: 'New' },
    { id: 'cbc' as NavigationItem, label: 'CBC Analysis', icon: Activity, badge: 'Active' },
    { id: 'samples' as NavigationItem, label: 'Sample Reports', icon: FileSpreadsheet, badge: '3' },
    { id: 'history' as NavigationItem, label: 'Reports History', icon: History, badge: null },
    { id: 'guide' as NavigationItem, label: 'Educational Guide', icon: BookOpen, badge: null },
  ];

  const handleSelect = (id: NavigationItem) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-navy-800 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-16 px-5 border-b border-navy-800/80 flex items-center justify-between">
            <div 
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  ReportSaathi
                </span>
                <span className="text-[10px] text-teal-300 font-semibold uppercase tracking-wider block">
                  Health Literacy
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-5 space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Healthcare Portal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600/90 text-white shadow-sm shadow-teal-700/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-teal-800 text-teal-100' 
                        : 'bg-navy-800 text-teal-300 border border-navy-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="mx-3 p-3.5 rounded-2xl bg-gradient-to-br from-navy-800/80 to-navy-950/80 border border-navy-700 text-xs">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Educational Mode</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Explore how common tests like CBC, Lipids, and Metabolic markers are interpreted in plain language.
            </p>
            <button
              onClick={() => handleSelect('cbc')}
              className="w-full py-1.5 bg-navy-700 hover:bg-navy-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span>View CBC Results</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer & Medical Disclaimer Status */}
        <div className="p-4 border-t border-navy-800/80 text-[11px] text-slate-400">
          <div className="flex items-start gap-2 mb-2 p-2 rounded-xl bg-navy-950/60 border border-navy-800">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-slate-300 leading-tight">
              <strong>Non-Diagnostic:</strong> Educational companion tool. Always consult your doctor.
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400">
            <span>v1.2 &bull; Prototype</span>
            <span className="flex items-center gap-1 text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Live Demo
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
