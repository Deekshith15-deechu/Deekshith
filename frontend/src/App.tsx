import React, { useState } from 'react';
import { ReportAnalysis } from './types/report';
import { MOCK_REPORTS } from './data/mockReports';
import { Sidebar, NavigationItem } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { CBCReportView } from './components/CBCReportView';
import { SampleReportsView } from './components/SampleReportsView';
import { HistoryView } from './components/HistoryView';
import { LandingPage } from './components/LandingPage';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { 
  Menu, 
  UploadCloud, 
  HeartPulse, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { uploadAndAnalyzeFile } from './lib/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationItem>('dashboard');
  const [reports, setReports] = useState<ReportAnalysis[]>(MOCK_REPORTS);
  const [activeReport, setActiveReport] = useState<ReportAnalysis>(MOCK_REPORTS[0]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // File Upload handler connected to backend POST /api/reports/analyze
  const handleFileSelect = async (file: File) => {
    setCurrentFileName(file.name);
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await uploadAndAnalyzeFile(file);

      // Determine overall status based on extracted parameters
      const hasAbnormal = response.extracted_parameters.some(
        (p) => p.status === 'low' || p.status === 'high' || p.status === 'abnormal'
      );

      // Map strictly extracted parameters into test panels (never hallucinating missing values)
      const metricsList = response.extracted_parameters.length > 0
        ? response.extracted_parameters
        : [
            {
              name: 'Extracted Document Content',
              value: `${response.character_count} chars`,
              unit: 'text',
              reference_range: 'Clinical Document Layer',
              status: 'normal' as const,
              simple_explanation: 'Text was extracted via ' + response.extraction_method.replace(/_/g, ' ') + '. Review the raw text preview below.',
              clinical_context: `Processed ${response.pages_processed} page(s).`
            }
          ];

      const newReport: ReportAnalysis = {
        id: `rep-uploaded-${Date.now()}`,
        report_title: file.name.replace(/\.[^/.]+$/, "") + ` (${response.extraction_method.replace(/_/g, ' ').toUpperCase()})`,
        patient_summary: response.summary || `Extracted ${response.character_count} characters from ${file.name} using ${response.extraction_method.replace(/_/g, ' ')}.`,
        overall_status: hasAbnormal ? 'needs_attention' : 'all_clear',
        panels: [
          {
            panel_name: 'Extracted Diagnostic Panel',
            metrics: metricsList,
          }
        ],
        key_takeaways: [
          `Document processed via ${response.extraction_method.replace(/_/g, ' ').toUpperCase()}`,
          `Total characters extracted: ${response.character_count}`,
          response.extracted_parameters.length > 0 
            ? `Identified ${response.extracted_parameters.length} clinical biomarker(s) directly from text.`
            : 'No automated CBC markers recognized; raw extracted text available for review.'
        ],
        questions_for_doctor: [
          'Can you review these specific laboratory findings with me?',
          'Are there any follow-up tests recommended based on these values?',
          'Do my daily medications or diet influence any of these results?'
        ],
        lifestyle_diet_tips: [
          'Stay adequately hydrated with 2 to 2.5 liters of clean water daily.',
          'Bring your original laboratory printout to your appointment for complete verification.',
          'Maintain balanced nutrition and adequate sleep prior to follow-up testing.'
        ],
        extracted_text_preview: response.extracted_text,
        disclaimer: response.disclaimer,
        created_at: new Date().toISOString(),
      };

      setReports((prev) => [newReport, ...prev]);
      setActiveReport(newReport);
      setActiveTab('cbc');

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err: any) {
      console.error('API upload error:', err);
      setErrorMessage(err.message || 'Failed to process and extract document text.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReport = (report: ReportAnalysis) => {
    setActiveReport(report);
    setActiveTab('cbc');
  };

  const handleLoadSample = (index: number) => {
    const selected = MOCK_REPORTS[index] || MOCK_REPORTS[0];
    setActiveReport(selected);
    setActiveTab('cbc');
  };

  const handleTriggerSimulatedError = () => {
    setErrorMessage('Optical Character Recognition was unable to extract clear numeric values from the test document. The file resolution may be too low (under 150 DPI) or text is partially obscured.');
    setIsError(true);
  };

  const handleClearHistory = () => {
    setReports([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsError(false);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on large screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-navy-950 rounded-xl hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-navy-950 capitalize">
                  {activeTab === 'cbc' 
                    ? 'Complete Blood Count (CBC) Analysis' 
                    : activeTab === 'upload' 
                    ? 'Upload Laboratory Report'
                    : activeTab === 'samples'
                    ? 'Sample Reports Library'
                    : activeTab === 'history'
                    ? 'Archived Reports History'
                    : activeTab === 'guide'
                    ? 'Educational Literacy Guide'
                    : 'Healthcare Portal Dashboard'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hidden sm:inline-block">
                  Educational
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                ReportSaathi &bull; Plain-Language Diagnostic Translation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLoadSample(0)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-100 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Sample CBC</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upload');
                setIsError(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>Upload</span>
            </button>
          </div>
        </header>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-20 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-teal-200" />
            <span>Document successfully extracted and translated!</span>
          </div>
        )}

        {/* Main Body Routed by Active Tab */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {isLoading ? (
            <LoadingState
              fileName={currentFileName}
              onCancel={() => setIsLoading(false)}
            />
          ) : isError ? (
            <ErrorState
              errorMessage={errorMessage}
              onRetry={() => {
                setIsError(false);
                setActiveTab('upload');
              }}
              onBackToDashboard={() => {
                setIsError(false);
                setActiveTab('dashboard');
              }}
              onLoadSample={() => {
                setIsError(false);
                handleLoadSample(0);
              }}
            />
          ) : activeTab === 'dashboard' ? (
            <Dashboard
              reports={reports}
              onUploadClick={() => setActiveTab('upload')}
              onSelectReport={handleSelectReport}
              onLoadSample={handleLoadSample}
              onTriggerSimulatedError={handleTriggerSimulatedError}
            />
          ) : activeTab === 'upload' ? (
            <div className="py-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                onSampleClick={() => handleLoadSample(0)}
                onCancel={() => setActiveTab('dashboard')}
                isLoading={false}
              />
            </div>
          ) : activeTab === 'cbc' ? (
            <CBCReportView
              report={activeReport}
              onBack={() => setActiveTab('dashboard')}
              onUploadNew={() => setActiveTab('upload')}
            />
          ) : activeTab === 'samples' ? (
            <SampleReportsView
              onSelectReport={handleSelectReport}
            />
          ) : activeTab === 'history' ? (
            <HistoryView
              reports={reports}
              onSelectReport={handleSelectReport}
              onClearHistory={handleClearHistory}
            />
          ) : (
            <LandingPage
              onGoToDashboard={() => setActiveTab('dashboard')}
              onOpenUpload={() => setActiveTab('upload')}
              onSelectSample={handleLoadSample}
            />
          )}
        </main>

        {/* Global Professional Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-400 no-print">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy-950">ReportSaathi</span>
              <span>&bull;</span>
              <span>Healthcare Literacy &amp; Lab Report Companion</span>
            </div>
            <div className="text-slate-400 text-center sm:text-right">
              White, Navy &amp; Teal Theme &bull; WCAG Accessible Design &bull; Educational Use Only
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
