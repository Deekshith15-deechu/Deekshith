import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, AlertCircle, Sparkles, Loader2, CheckCircle2, X } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  onSampleClick: () => void;
  onCancel?: () => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export const FileUpload: React.FC<Props> = ({
  onFileSelect,
  onSampleClick,
  onCancel,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setValidationError(null);

    // 1. File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
      );
      return false;
    }

    // 2. File type check
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(extension);
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isAllowedExt && !isAllowedMime) {
      setValidationError(
        `Unsupported file type "${extension}". Please upload a PDF, JPG, or PNG document.`
      );
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleProceed = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Upload Medical Laboratory Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supported formats: <strong className="text-slate-700">PDF, JPG, PNG</strong> (up to 10 MB)
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Validation Error: </span>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        {/* Drag and drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-sky-400 bg-slate-50/40 hover:bg-sky-50/20'
          } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleChange}
            disabled={isLoading}
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-100 to-teal-50 flex items-center justify-center text-sky-600 border border-sky-200 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Drag and drop your report file here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-4 max-w-sm mx-auto">
            Drag your digital PDF report or smartphone photo (JPG, PNG) or click to browse.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            Browse Files
          </button>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="mt-5 p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg text-sky-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.type || 'Document'}
                </div>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Analyze Report</span>
            </button>
          </div>
        )}

        {/* Demo Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Frontend Educational Simulation</span>
          </div>
          <button
            type="button"
            onClick={onSampleClick}
            disabled={isLoading}
            className="text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1.5 hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            No report on hand? Load Sample Report
          </button>
        </div>
      </div>
    </div>
  );
};
