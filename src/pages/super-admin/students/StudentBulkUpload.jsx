// src/pages/admin/studentSetup/StudentBulkUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  ChevronRight,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  CloudUpload,
  SlidersHorizontal,
  FileX,
  Eye,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Shared helpers ──────────────────────────────────────────────────────── */
const SHIFTS = ['Day', 'Morning', 'Evening'];
const MEDIUMS = ['Bangla', 'English'];
const EDU_LEVELS = ['Higher Secondary', 'Secondary'];
const DEPARTMENTS = ['Science', 'Humanities', 'Business'];
const CLASSES = ['HSC-Science', 'HSC-Humanities', 'HSC-Business'];

const TEMPLATE_COLUMNS = [
  'Student Name',
  'Roll No',
  'Student Code',
  'Gender',
  'Religion',
  'Father Name',
  'Mother Name',
  'Contact No',
  'Shift',
  'Medium',
  'Edu Level',
  'Department',
  'Class',
];

const inp = `w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600
  bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30`;
const inpErr = `w-full px-3 py-2.5 text-sm rounded-xl border border-red-400
  bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-semibold'
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

const StepBadge = ({ num, label, active, done }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
    ${active ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' : done ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'}`}
  >
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
      ${active ? 'bg-blue-600 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}
    >
      {done ? <Check size={12} /> : num}
    </div>
    <span
      className={`text-sm font-medium ${active ? 'text-blue-700 dark:text-blue-400' : done ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
    >
      {label}
    </span>
  </div>
);

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function StudentBulkUpload() {
  const [filters, setFilters] = useState({
    shift: '',
    medium: '',
    eduLevel: '',
    department: '',
    className: '',
  });
  const [filterErrors, setFilterErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // parsed rows
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const allFiltersSelected = Object.values(filters).every(Boolean);
  const step = !allFiltersSelected ? 1 : !file ? 2 : 3;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
    setFilterErrors((p) => ({ ...p, [name]: undefined }));
  };

  /* Excel download */
  const handleDownload = () => {
    const errs = {};
    Object.keys(filters).forEach((k) => {
      if (!filters[k]) errs[k] = true;
    });
    if (Object.keys(errs).length) {
      setFilterErrors(errs);
      return;
    }

    const rows = Array.from({ length: 10 }, () => ({
      'Student Name': '',
      'Roll No': '',
      'Student Code': '',
      Gender: '',
      Religion: '',
      'Father Name': '',
      'Mother Name': '',
      'Contact No': '',
      Shift: filters.shift,
      Medium: filters.medium,
      'Edu Level': filters.eduLevel,
      Department: filters.department,
      Class: filters.className,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = TEMPLATE_COLUMNS.map((h) => ({
      wch: Math.max(h.length + 4, 18),
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(
      wb,
      `StudentTemplate_${filters.className}_${filters.eduLevel}.xlsx`
    );
  };

  /* File selection */
  const processFile = useCallback((f) => {
    if (!f) return;
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      setUploadError('Please upload a valid .xlsx or .xls file.');
      return;
    }
    setFile(f);
    setUploadError('');
    setUploadDone(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(new Uint8Array(evt.target.result), {
          type: 'array',
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setPreview(rows.slice(0, 5)); // show first 5 rows as preview
      } catch {
        setUploadError('Could not parse Excel file.');
        setFile(null);
      }
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  /* Upload submit */
  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file first.');
      return;
    }
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setUploading(false);
    setUploadDone(true);
    setFile(null);
    setPreview(null);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadError('');
    setUploadDone(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Bulk Upload']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Student Bulk Upload
            </h1>
          </div>
        </div>

        {/* Step indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StepBadge
            num={1}
            label="Select Filters & Download Template"
            active={step === 1}
            done={step > 1}
          />
          <StepBadge
            num={2}
            label="Fill Template & Choose File"
            active={step === 2}
            done={step > 2}
          />
          <StepBadge
            num={3}
            label="Preview & Upload"
            active={step === 3}
            done={uploadDone}
          />
        </div>

        {/* ── Step 1: Filters + Download ───────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <SlidersHorizontal
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Step 1 — Generate Excel Template
            </span>
            {allFiltersSelected && (
              <Check size={14} className="ml-auto text-green-500" />
            )}
          </div>
          <div className="p-5 space-y-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select all filters to generate a pre-filled Excel template for
              bulk student data entry.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Shift', name: 'shift', opts: SHIFTS },
                { label: 'Medium', name: 'medium', opts: MEDIUMS },
                { label: 'Edu. Level', name: 'eduLevel', opts: EDU_LEVELS },
                { label: 'Department', name: 'department', opts: DEPARTMENTS },
                { label: 'Class', name: 'className', opts: CLASSES },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {f.label}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    name={f.name}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    className={filterErrors[f.name] ? inpErr : inp}
                  >
                    <option value="">Select</option>
                    {f.opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {filterErrors[f.name] && (
                    <p className="text-xs text-red-500 flex items-center gap-0.5">
                      <AlertCircle size={10} />
                      Required
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              <Download size={14} /> Download Excel Template
            </button>
          </div>
        </div>

        {/* ── Step 2 + 3: Upload ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CloudUpload
                size={14}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Step 2 & 3 — Upload Filled Excel
            </span>
          </div>
          <div className="p-5 space-y-4">
            {/* Drop zone */}
            {!file && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <FileSpreadsheet size={28} className="text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Drag & drop your Excel file here
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    or click to browse — .xlsx, .xls only
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* File selected state */}
            {file && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · {preview?.length || 0}{' '}
                    data rows detected
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-500 text-gray-500 flex items-center justify-center transition-all flex-shrink-0"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Error */}
            {uploadError && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  {uploadError}
                </p>
              </div>
            )}

            {/* Success */}
            {uploadDone && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                <Check size={16} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Upload successful!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                    Students have been queued for processing.
                  </p>
                </div>
              </div>
            )}

            {/* Preview table */}
            {preview && preview.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  <Eye size={13} className="text-blue-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Preview (first {preview.length} rows)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        {Object.keys(preview[0])
                          .slice(0, 8)
                          .map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        {Object.keys(preview[0]).length > 8 && (
                          <th className="px-3 py-2 text-gray-400">
                            +{Object.keys(preview[0]).length - 8} more
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {preview.map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/20"
                        >
                          {Object.values(row)
                            .slice(0, 8)
                            .map((v, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                              >
                                {String(v) || (
                                  <span className="text-gray-300 dark:text-gray-600 italic">
                                    —
                                  </span>
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload button */}
            {file && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                  ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Upload & Process
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {preview
                    ? `${preview.length} rows will be imported`
                    : 'Preparing preview…'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
            📋 Instructions
          </p>
          <ul className="text-xs text-amber-700 dark:text-amber-500 space-y-1">
            <li>
              1. Select all 5 filters above, then download the Excel template.
            </li>
            <li>
              2. Fill in student data in the downloaded template — do not change
              column headers or pre-filled metadata columns.
            </li>
            <li>
              3. Upload the completed file above. A preview will appear before
              you confirm.
            </li>
            <li>
              4. Only .xlsx and .xls formats are supported. Maximum 500 students
              per file.
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
