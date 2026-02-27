import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Upload,
  Download,
  ChevronRight,
  AlertCircle,
  Check,
  SlidersHorizontal,
  CheckCircle2,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const EDU_LEVELS = ['Primary', 'Secondary', 'Higher Secondary'];
const DEPARTMENTS = ['Science', 'Arts', 'Commerce', 'Default'];
const CLASSES = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine (Science)',
  'Ten (Science)',
  'HSC Science',
  'HSC Arts',
];
const SECTIONS = [
  'A',
  'B',
  'C',
  'Archimedes',
  'Bulbuli',
  'Doyel',
  '1st Year',
  '2nd Year',
];
const SESSIONS = ['2023-2024', '2024-2025', '2025-2026'];
const EXAMS = [
  'Half Yearly',
  'Annual',
  'Pre-test',
  'Monthly Test',
  'Term Final',
];
const SUBJECTS = [
  'Bangla',
  'English',
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'ICT',
];

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const inpErr = 'border-red-400 dark:border-red-500';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer'
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

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

/* Sample mark sheet columns for Excel download */
const SAMPLE_EXCEL_DATA = [
  {
    Roll: '101',
    'Student Name': 'SAKIB HASAN',
    CQ: '',
    MCQ: '',
    Practical: '',
    Total: '',
  },
  {
    Roll: '102',
    'Student Name': 'NUSRAT JAHAN',
    CQ: '',
    MCQ: '',
    Practical: '',
    Total: '',
  },
  {
    Roll: '103',
    'Student Name': 'FARUK AHMED',
    CQ: '',
    MCQ: '',
    Practical: '',
    Total: '',
  },
  {
    Roll: '104',
    'Student Name': 'RIMA AKTER',
    CQ: '',
    MCQ: '',
    Practical: '',
    Total: '',
  },
  {
    Roll: '105',
    'Student Name': 'KAMAL HOSSAIN',
    CQ: '',
    MCQ: '',
    Practical: '',
    Total: '',
  },
];

export default function MarkEntryFormat() {
  const [form, setForm] = useState({
    eduLevel: 'Primary',
    department: '',
    className: '',
    section: '',
    session: '',
    exam: '',
    subject: '',
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const fileInputRef = useRef();

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.exam) e.exam = 'Required';
    if (!form.subject) e.subject = 'Required';
    return e;
  };

  const handleDownloadExcel = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setDownloadingExcel(true);
    await new Promise((r) => setTimeout(r, 600));
    const ws = XLSX.utils.json_to_sheet(SAMPLE_EXCEL_DATA);
    ws['!cols'] = [
      { wch: 8 },
      { wch: 24 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mark Entry');
    XLSX.writeFile(
      wb,
      `MarkSheet_${form.exam || 'Format'}_${form.subject || ''}.xlsx`
    );
    setDownloadingExcel(false);
  };

  const handleDownloadPDF = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setDownloadingPDF(true);
    await new Promise((r) => setTimeout(r, 600));
    // In real app: use jsPDF here
    alert(`PDF format downloaded for ${form.exam} — ${form.subject}`);
    setDownloadingPDF(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadSuccess(false);

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(evt.target.result, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws);
          setUploadPreview(data.slice(0, 5));
        } catch {
          setUploadPreview(null);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmitUpload = async () => {
    if (!uploadedFile) return;
    await new Promise((r) => setTimeout(r, 800));
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Exam & Result', 'Mark Entry Format']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileSpreadsheet size={22} className="text-green-500" /> Mark Sheet
            Format
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Download the Excel or PDF mark sheet template, fill it in, then
            re-upload
          </p>
        </div>

        {/* Filter Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30">
            <SlidersHorizontal size={14} className="text-green-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Select Parameters
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <F label="Education Level">
                <select
                  value={form.eduLevel}
                  onChange={(e) => set('eduLevel', e.target.value)}
                  className={inp}
                >
                  {EDU_LEVELS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Department">
                <select
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                  className={inp}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Class">
                <select
                  value={form.className}
                  onChange={(e) => set('className', e.target.value)}
                  className={inp}
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Section">
                <select
                  value={form.section}
                  onChange={(e) => set('section', e.target.value)}
                  className={inp}
                >
                  <option value="">Select Section</option>
                  {SECTIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Session">
                <select
                  value={form.session}
                  onChange={(e) => set('session', e.target.value)}
                  className={inp}
                >
                  <option value="">Select Session</option>
                  {SESSIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Exam" required error={errors.exam}>
                <select
                  value={form.exam}
                  onChange={(e) => set('exam', e.target.value)}
                  className={errors.exam ? `${inp} ${inpErr}` : inp}
                >
                  <option value="">Select Exam</option>
                  {EXAMS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <F label="Subject" required error={errors.subject}>
                <select
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  className={errors.subject ? `${inp} ${inpErr}` : inp}
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-2xl transition-colors shadow-sm shadow-green-200 font-semibold text-sm"
          >
            {downloadingExcel ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet size={18} />
            )}
            Download Excel Format
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-2xl transition-colors shadow-sm shadow-red-200 font-semibold text-sm"
          >
            {downloadingPDF ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            Download PDF Format
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Upload size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Upload Filled Mark Sheet
            </span>
          </div>
          <div className="p-5 space-y-4">
            {/* Drop zone */}
            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700/30 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileSpreadsheet size={22} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Click to upload mark sheet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Accepts .xlsx and .xls files
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet
                    size={18}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Preview Table */}
            {uploadPreview && uploadPreview.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 uppercase tracking-wide">
                  Preview (first 5 rows)
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {Object.keys(uploadPreview[0]).map((k) => (
                        <th
                          key={k}
                          className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap"
                        >
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {uploadPreview.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20"
                      >
                        {Object.values(row).map((v, j) => (
                          <td
                            key={j}
                            className="px-3 py-2.5 text-gray-700 dark:text-gray-300"
                          >
                            {String(v ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {uploadedFile && (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitUpload}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm
                    ${uploadSuccess ? 'bg-green-600 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                >
                  {uploadSuccess ? (
                    <>
                      <CheckCircle2 size={15} />
                      Uploaded Successfully!
                    </>
                  ) : (
                    <>
                      <Upload size={15} />
                      Submit Mark Sheet
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
