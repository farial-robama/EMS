// src/pages/admin/studentSetup/BulkStudentUpdate.jsx
import React, { useState, useMemo, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ChevronRight, Users, Download, Upload, Check, AlertCircle, FileSpreadsheet, SlidersHorizontal, X } from 'lucide-react';
import * as XLSX from 'xlsx';

/* ── Static Data ─────────────────────────────────────────────────────────── */
const FILTER_OPTIONS = {
  eduLevel:   ['HSC','SSC','JSC'],
  department: ['Science','Arts','Commerce'],
  className:  ['HSC-Science','HSC-Arts','SSC-Science','SSC-Arts'],
  section:    ['1st Year','2nd Year','A','B','C'],
  session:    ['2024-2025','2025-2026','2026-2027'],
};

const ALL_STUDENTS = [
  { studentId:'STU001', fullName:'John Doe',          className:'HSC-Science', section:'1st Year', session:'2025-2026', gender:'Male',   bloodGroup:'B+', roll:'1001' },
  { studentId:'STU002', fullName:'Jane Smith',         className:'HSC-Science', section:'1st Year', session:'2025-2026', gender:'Female', bloodGroup:'A+', roll:'1002' },
  { studentId:'STU003', fullName:'Md. Rafiq Ahmed',   className:'HSC-Science', section:'1st Year', session:'2024-2025', gender:'Male',   bloodGroup:'O+', roll:'1003' },
  { studentId:'STU004', fullName:'Fatima Begum',       className:'HSC-Arts',   section:'2nd Year', session:'2025-2026', gender:'Female', bloodGroup:'AB+',roll:'1004' },
];

const COLUMNS = ['studentId','fullName','className','section','session','gender','bloodGroup','roll'];
const COL_LABELS = { studentId:'Student ID', fullName:'Full Name', className:'Class', section:'Section', session:'Session', gender:'Gender', bloodGroup:'Blood Group', roll:'Roll No' };

const inp = `px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-full`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600"/>}
      </React.Fragment>
    ))}
  </nav>
);

export default function BulkStudentUpdate() {
  const [filters, setFilters]         = useState({ eduLevel:'', department:'', className:'', section:'', session:'' });
  const [filterErrors, setFilterErrors] = useState({});
  const [searched, setSearched]       = useState(false);
  const [uploadedData, setUploadedData] = useState(null); // rows from Excel
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading]     = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(p => ({ ...p, [name]: value }));
    setFilterErrors(p => ({ ...p, [name]: undefined }));
    setSearched(false);
    setUploadedData(null);
  };

  const validate = () => {
    const errs = {};
    Object.keys(filters).forEach(k => { if (!filters[k]) errs[k] = true; });
    return errs;
  };

  const handleSearch = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }
    setSearched(true); setUploadedData(null); setUploadError('');
  };

  const handleReset = () => {
    setFilters({ eduLevel:'', department:'', className:'', section:'', session:'' });
    setFilterErrors({}); setSearched(false); setUploadedData(null); setUploadError(''); setUploadSuccess(false);
  };

  const filteredStudents = useMemo(() =>
    ALL_STUDENTS.filter(s =>
      (!filters.className || s.className === filters.className) &&
      (!filters.section   || s.section   === filters.section) &&
      (!filters.session   || s.session   === filters.session)
    ), [filters]);

  /* Export */
  const handleDownloadExcel = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }

    const rows = filteredStudents.map(s => ({
      'Student ID':   s.studentId,
      'Full Name':    s.fullName,
      'Class':        s.className,
      'Section':      s.section,
      'Session':      s.session,
      'Gender':       s.gender,
      'Blood Group':  s.bloodGroup,
      'Roll No':      s.roll,
    }));

    if (rows.length === 0) {
      setUploadError('No students found for the selected filters.'); return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    // Column widths
    ws['!cols'] = [{ wch:12 },{ wch:28 },{ wch:18 },{ wch:14 },{ wch:14 },{ wch:10 },{ wch:14 },{ wch:10 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `Students_${filters.className}_${filters.session}.xlsx`);
  };

  /* Import */
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(''); setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data     = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const rows     = XLSX.utils.sheet_to_json(sheet);
        if (rows.length === 0) { setUploadError('The uploaded file is empty.'); return; }
        setUploadedData(rows);
      } catch {
        setUploadError('Failed to read file. Please upload a valid .xlsx or .xls file.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!uploadedData) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API
    setUploading(false);
    setUploadSuccess(true);
    setUploadedData(null);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const displayRows = uploadedData
    ? uploadedData.map(r => ({
        studentId:  r['Student ID']  || '',
        fullName:   r['Full Name']   || '',
        className:  r['Class']       || '',
        section:    r['Section']     || '',
        session:    r['Session']     || '',
        gender:     r['Gender']      || '',
        bloodGroup: r['Blood Group'] || '',
        roll:       r['Roll No']     || '',
      }))
    : filteredStudents;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Student Setup', 'Bulk Student Update']}/>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Total Students', value: ALL_STUDENTS.length,                        bg:'bg-blue-50 dark:bg-blue-900/20',   icon:'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
            { label:'Filtered',       value: searched ? filteredStudents.length : '—',   bg:'bg-purple-50 dark:bg-purple-900/20', icon:'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' },
            { label:'Uploaded Rows',  value: uploadedData ? uploadedData.length : '—',   bg:'bg-green-50 dark:bg-green-900/20', icon:'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}><Users size={18}/></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <SlidersHorizontal size={15} className="text-blue-500"/>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Students</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label:'Edu. Level', name:'eduLevel' },
                { label:'Department', name:'department' },
                { label:'Class',      name:'className' },
                { label:'Section',    name:'section' },
                { label:'Session',    name:'session' },
              ].map(f => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {f.label}<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select name={f.name} value={filters[f.name]} onChange={handleFilterChange}
                    className={`${inp} ${filterErrors[f.name] ? 'border-red-400' : ''}`}>
                    <option value="">Select</option>
                    {(FILTER_OPTIONS[f.name] || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {filterErrors[f.name] && <p className="text-xs text-red-500 flex items-center gap-0.5"><AlertCircle size={10}/>Req.</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Users size={14}/> Load Students
              </button>
              <button onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200">
                <Download size={14}/> Download Excel
              </button>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                  <FileSpreadsheet size={14}/> Choose Excel File
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden"/>
                </label>
              </div>
              <button onClick={handleReset}
                className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Reset
              </button>
            </div>

            {/* Upload preview bar */}
            {uploadedData && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={18} className="text-green-600 dark:text-green-400"/>
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">{uploadedData.length} rows loaded from Excel</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Review the preview below, then click Upload to apply changes.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleUploadSubmit} disabled={uploading}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors
                      ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {uploading
                      ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Uploading…</>
                      : <><Upload size={13}/> Upload & Update</>}
                  </button>
                  <button onClick={() => setUploadedData(null)} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-500 text-gray-500 flex items-center justify-center transition-all">
                    <X size={13}/>
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0"/>
                <p className="text-sm text-red-700 dark:text-red-400">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                <Check size={16} className="text-green-600 flex-shrink-0"/>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Students updated successfully!</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        {(searched || uploadedData) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Users size={16} className={uploadedData ? 'text-green-500' : 'text-blue-500'}/>
                {uploadedData ? 'Excel Preview (Before Upload)' : 'Student List'}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uploadedData ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                  {displayRows.length} row{displayRows.length !== 1 ? 's' : ''}
                </span>
              </div>
              {uploadedData && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle size={12}/> Preview only — not yet saved
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">#</th>
                    {COLUMNS.map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {COL_LABELS[col]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {displayRows.length === 0 ? (
                    <tr><td colSpan={COLUMNS.length + 1} className="px-5 py-12 text-center">
                      <Users size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3"/>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found for the selected filters.</p>
                    </td></tr>
                  ) : displayRows.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i+1}</td>
                      {COLUMNS.map(col => (
                        <td key={col} className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {col === 'studentId'
                            ? <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{s[col]}</span>
                            : col === 'fullName'
                              ? <span className="font-semibold text-gray-800 dark:text-gray-100">{s[col]}</span>
                              : s[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
              {uploadedData ? `${displayRows.length} rows from uploaded Excel` : `${displayRows.length} students in selection`}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}