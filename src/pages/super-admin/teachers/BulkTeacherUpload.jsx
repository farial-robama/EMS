import React, { useState, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Upload,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Download,
  X,
} from 'lucide-react';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
          }
        >
          {item}
        </span>
        {i < items.length - 1 && (
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

const formatSize = (b) =>
  b > 1048576
    ? `${(b / 1048576).toFixed(1)} MB`
    : `${(b / 1024).toFixed(0)} KB`;

export default function BulkTeacherUpload() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!['.xls', '.xlsx'].includes(ext)) {
      alert('Please upload only .xls or .xlsx files.');
      return;
    }
    setFile(f);
    setSuccess(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setSuccess(true);
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/sample_teacher_template.xlsx';
    a.download = 'teacher_upload_template.xlsx';
    a.click();
  };

  const reset = () => {
    setFile(null);
    setSuccess(false);
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb items={['Dashboard', 'Teacher Setup', 'Bulk Upload']} />
        </div>

        {/* ── Info / Instructions card ──────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Upload size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Bulk Teacher Upload
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              Excel
            </span>
          </div>
          <div className="p-5">
            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  num: '1',
                  title: 'Download Template',
                  desc: 'Get the Excel template with the correct column structure.',
                },
                {
                  num: '2',
                  title: 'Fill in Data',
                  desc: 'Enter teacher details into the template without changing headers.',
                },
                {
                  num: '3',
                  title: 'Upload File',
                  desc: 'Upload the completed file to import all teachers at once.',
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.num}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-0.5">
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download template button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors mb-6"
            >
              <Download size={15} className="text-blue-500" />
              Download Upload Template (.xlsx)
            </button>

            {/* Dropzone */}
            {!success ? (
              <>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${
                      dragOver
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                        : file
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/20 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !file && inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                  />

                  {file ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                        <FileSpreadsheet
                          size={24}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatSize(file.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                        <Upload size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                        Drop your Excel file here
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        or click to browse — .xls, .xlsx only
                      </p>
                    </>
                  )}
                </div>

                {file && (
                  <div className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
                      <Check size={13} /> {file.name} selected
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Uploading…
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                  <AlertCircle
                    size={14}
                    className="text-amber-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    <strong>Do not modify column headers</strong> in the
                    template. Ensure all required fields are filled before
                    uploading.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    type="button"
                    onClick={reset}
                    disabled={!file}
                    className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                      ${!file || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    {uploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={15} /> Upload Teachers
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check
                    size={32}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Upload Successful!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {file?.name}
                  </span>{' '}
                  has been imported and is being processed.
                </p>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
