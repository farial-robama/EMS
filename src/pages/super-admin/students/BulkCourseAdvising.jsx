// src/pages/admin/studentSetup/BulkCourseAdvising.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ChevronRight, BookOpen, Download, Upload, Check, AlertCircle, SlidersHorizontal, User } from 'lucide-react';
import * as XLSX from 'xlsx';

/* ── Static Data ─────────────────────────────────────────────────────────── */
const FILTER_OPTIONS = {
  eduLevel:   ['Higher Secondary','Secondary'],
  department: ['Science','Arts','Commerce'],
  className:  ['HSC-Science','HSC-Arts','SSC-Science'],
  section:    ['1st Year','2nd Year','A','B'],
  session:    ['2024-2025','2025-2026','2026-2027'],
};

const STUDENTS_DB = [
  { roll:'1202526033046', id:'2210607239', name:'SAIFUL ISLAM',           className:'HSC-Science', section:'1st Year', session:'2025-2026' },
  { roll:'1202526033047', id:'2210662472', name:'MD. NASIMUL ISLAM RADOAN',className:'HSC-Science', section:'1st Year', session:'2025-2026' },
  { roll:'1202526033048', id:'2210600001', name:'FATIMA BEGUM',           className:'HSC-Science', section:'1st Year', session:'2025-2026' },
];

const SUBJECT_GROUPS = {
  'HSC-Science': {
    main:        ['Bangla','English','Physics','Chemistry','Biology'],
    choosable:   ['Biology','Higher Mathematics','ICT'],
    additional:  ['Biology','Higher Mathematics','Statistics'],
  },
  'HSC-Arts': {
    main:        ['Bangla','English','History','Islamic History','Civics'],
    choosable:   ['Economics','Geography','Social Work'],
    additional:  ['Economics','Geography','Psychology'],
  },
  default: {
    main:        ['Bangla','English','Mathematics','Science','ICT'],
    choosable:   ['Biology','Higher Mathematics'],
    additional:  ['Biology','Higher Mathematics'],
  },
};

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

export default function BulkCourseAdvising() {
  const [filters, setFilters] = useState({ eduLevel:'', department:'', className:'', section:'', session:'', student:'' });
  const [filterErrors, setFilterErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState('');

  /* Subject selections per student stored by roll */
  const [advising, setAdvising] = useState({});

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(p => ({ ...p, [name]: value }));
    setFilterErrors(p => ({ ...p, [name]: undefined }));
    if (name === 'className') setFilters(p => ({ ...p, [name]: value, student: '' }));
  };

  /* Available students based on className + section + session */
  const availableStudents = useMemo(() =>
    STUDENTS_DB.filter(s =>
      (!filters.className || s.className === filters.className) &&
      (!filters.section   || s.section   === filters.section) &&
      (!filters.session   || s.session   === filters.session)
    ), [filters.className, filters.section, filters.session]);

  const selectedStudent = STUDENTS_DB.find(s => s.roll === filters.student) || null;
  const subjectGroups   = SUBJECT_GROUPS[filters.className] || SUBJECT_GROUPS.default;

  const currentAdvising = (selectedStudent ? advising[selectedStudent.roll] : null) || {
    choosable: subjectGroups.choosable[0] || '',
    additional: subjectGroups.additional[0] || '',
  };

  const updateAdvising = (key, value) => {
    if (!selectedStudent) return;
    setAdvising(p => ({ ...p, [selectedStudent.roll]: { ...currentAdvising, [key]: value } }));
  };

  const validateFilter = () => {
    const errs = {};
    ['eduLevel','department','className','section','session'].forEach(k => { if (!filters[k]) errs[k] = true; });
    return errs;
  };

  const handleSave = () => {
    if (!selectedStudent) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* Excel export */
  const handleExcelDownload = () => {
    const errs = validateFilter();
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }
    const rows = availableStudents.map(s => {
      const adv = advising[s.roll] || {};
      return {
        'Roll No':     s.roll,
        'Student ID':  s.id,
        'Student Name':s.name,
        'Class':       s.className,
        'Section':     s.section,
        'Session':     s.session,
        'Main Subjects': subjectGroups.main.join(', '),
        'Choosable Subject': adv.choosable || '',
        'Additional Subject': adv.additional || '',
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CourseAdvising');
    XLSX.writeFile(wb, `CourseAdvising_${filters.className}_${filters.session}.xlsx`);
  };

  /* Excel import */
  const handleExcelUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        const updated = { ...advising };
        rows.forEach(row => {
          const roll = String(row['Roll No'] || '');
          if (roll) {
            updated[roll] = {
              choosable:  row['Choosable Subject']  || '',
              additional: row['Additional Subject'] || '',
            };
          }
        });
        setAdvising(updated);
        e.target.value = '';
      } catch {
        setUploadError('Failed to read Excel file. Please use the correct template.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Student Setup', 'Bulk Course Advising']}/>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <SlidersHorizontal size={15} className="text-blue-500"/>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter & Select Student</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  {filterErrors[f.name] && <p className="text-xs text-red-500"><AlertCircle size={10} className="inline mr-1"/>Req.</p>}
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student</label>
                <select name="student" value={filters.student} onChange={handleFilterChange}
                  disabled={!filters.className} className={`${inp} ${!filters.className ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <option value="">All Students</option>
                  {availableStudents.map(s => (
                    <option key={s.roll} value={s.roll}>[{s.roll}] {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excel actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button onClick={handleExcelDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200">
                <Download size={14}/> Download Excel Template
              </button>
              <label className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                <Upload size={14}/> Import Excel
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden"/>
              </label>
              {uploadError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{uploadError}</p>}
            </div>
          </div>
        </div>

        {/* Bulk table - all students in filter */}
        {filters.className && availableStudents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <BookOpen size={16} className="text-blue-500"/> Bulk Course Advising
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {availableStudents.length} students
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['#','Roll','Name','Main Subjects (Fixed)','Choosable Subject','Additional Subject'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {availableStudents.map((s, i) => {
                    const adv = advising[s.roll] || { choosable: subjectGroups.choosable[0], additional: subjectGroups.additional[0] };
                    return (
                      <tr key={s.roll} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${filters.student === s.roll ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{i+1}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{s.roll}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100">{s.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {subjectGroups.main.map(sub => (
                              <span key={sub} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{sub}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select value={adv.choosable}
                            onChange={e => setAdvising(p => ({ ...p, [s.roll]: { ...adv, choosable: e.target.value } }))}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                            {subjectGroups.choosable.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select value={adv.additional}
                            onChange={e => setAdvising(p => ({ ...p, [s.roll]: { ...adv, additional: e.target.value } }))}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                            {subjectGroups.additional.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Single student detail panel */}
        {selectedStudent && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
              <User size={15} className="text-blue-500"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {selectedStudent.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">— Roll: {selectedStudent.roll} · ID: {selectedStudent.id}</span>
            </div>
            <div className="p-5">
              {/* Main subjects (read-only) */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> Main Subjects
                  <span className="font-normal text-gray-400">(all are compulsory)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {subjectGroups.main.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                      <Check size={12}/>{s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Choosable */}
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20 space-y-3">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"/> Main Choosable
                    <span className="font-normal text-gray-400">(choose one)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjectGroups.choosable.map(s => (
                      <button key={s} type="button" onClick={() => updateAdvising('choosable', s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                          ${currentAdvising.choosable === s
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400 hover:text-purple-600'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional */}
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20 space-y-3">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> Additional (4th Subject)
                    <span className="font-normal text-gray-400">(choose one)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjectGroups.additional.map(s => (
                      <button key={s} type="button" onClick={() => updateAdvising('additional', s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                          ${currentAdvising.additional === s
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:text-amber-600'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                  <Check size={14}/> Save Course Advising
                </button>
                {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium"><Check size={14}/>Saved successfully!</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}