// src/pages/admin/studentSetup/SubjectWiseStudents.jsx
import React, { useState, useMemo } from 'react';
import {
  ChevronRight, BookOpen, Search, Download, Printer,
  Eye, SlidersHorizontal, AlertCircle, Users, X,
} from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const sel = `w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1
          ? 'text-gray-700 dark:text-gray-200 font-semibold'
          : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const GenderBadge = ({ gender }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
    ${gender === 'Male'
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      : gender === 'Female'
        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
    {gender}
  </span>
);

const STUDENTS_DB = [
  { sl:1,  name:'YEASIN ARAFAT SHAIKH',     father:'Md. Lutfar Rahman Shaikh',    roll:'1202526033081', className:'HSC-Science', section:'1st Year', session:'2025-2026', subject:'Bangla',   contact:'01681426125', gender:'Male'   },
  { sl:2,  name:'SANJIDA AKTER',             father:'SAIFUL ISLAM',                 roll:'1202526033528', className:'HSC-Science', section:'1st Year', session:'2025-2026', subject:'Bangla',   contact:'01799436725', gender:'Female' },
  { sl:3,  name:'MD. RAFIQUL ISLAM',         father:'Md. Karim',                    roll:'1202526033210', className:'HSC-Science', section:'1st Year', session:'2025-2026', subject:'Bangla',   contact:'01712345678', gender:'Male'   },
  { sl:4,  name:'FATIMA BEGUM',              father:'Abdul Karim',                  roll:'1202526033332', className:'HSC-Science', section:'2nd Year', session:'2025-2026', subject:'Physics',  contact:'01823456789', gender:'Female' },
  { sl:5,  name:'NASIR UDDIN',               father:'Md. Siddique',                 roll:'1202526033445', className:'HSC-Science', section:'2nd Year', session:'2025-2026', subject:'Physics',  contact:'01934567890', gender:'Male'   },
  { sl:6,  name:'SUMAIYA KHATUN',            father:'Habibur Rahman',               roll:'1202526033567', className:'HSC-Arts',   section:'1st Year', session:'2025-2026', subject:'History',  contact:'01645678901', gender:'Female' },
  { sl:7,  name:'ROBIUL ISLAM',              father:'Hafizur Rahman',               roll:'1202526033678', className:'HSC-Arts',   section:'1st Year', session:'2025-2026', subject:'History',  contact:'01756789012', gender:'Male'   },
  { sl:8,  name:'SHARMIN AKTER',             father:'Mohammad Ali',                 roll:'1202526033789', className:'HSC-Science', section:'1st Year', session:'2024-2025', subject:'Chemistry',contact:'01867890123', gender:'Female' },
  { sl:9,  name:'IMTIAZ AHMED',              father:'Abul Kashem',                  roll:'1202526033890', className:'HSC-Science', section:'1st Year', session:'2024-2025', subject:'Bangla',   contact:'01978901234', gender:'Male'   },
  { sl:10, name:'NUSRAT JAHAN',              father:'Nurul Islam',                  roll:'1202526033901', className:'HSC-Science', section:'2nd Year', session:'2025-2026', subject:'Physics',  contact:'01689012345', gender:'Female' },
];

const FILTER_OPTIONS = {
  eduLevel:  ['Higher Secondary','Secondary'],
  department:['Science','Arts','Commerce'],
  className: ['HSC-Science','HSC-Arts'],
  section:   ['1st Year','2nd Year','A','B'],
  session:   ['2024-2025','2025-2026'],
  subject:   ['Bangla','English','Physics','Chemistry','Biology','History','Mathematics','ICT'],
};

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function SubjectWiseStudents() {
  const [filters, setFilters]   = useState({ eduLevel:'', department:'', className:'', section:'', session:'', subject:'' });
  const [filterErrors, setFilterErrors] = useState({});
  const [searched, setSearched] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(p => ({ ...p, [name]: value }));
    setFilterErrors(p => ({ ...p, [name]: undefined }));
    setSearched(false);
  };

  const handleSearch = () => {
    const errs = {};
    Object.keys(filters).forEach(k => { if (!filters[k]) errs[k] = 'Required'; });
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }
    setFilterErrors({});
    setSearched(true);
  };

  const handleReset = () => {
    setFilters({ eduLevel:'', department:'', className:'', section:'', session:'', subject:'' });
    setFilterErrors({});
    setSearched(false);
    setTableSearch('');
  };

  const results = useMemo(() => {
    if (!searched) return [];
    return STUDENTS_DB.filter(s =>
      (!filters.className || s.className === filters.className) &&
      (!filters.section   || s.section   === filters.section)   &&
      (!filters.session   || s.session   === filters.session)   &&
      (!filters.subject   || s.subject   === filters.subject)   &&
      (!tableSearch || `${s.name} ${s.father} ${s.roll} ${s.contact}`.toLowerCase().includes(tableSearch.toLowerCase()))
    );
  }, [filters, searched, tableSearch]);

  const maleCount   = results.filter(s => s.gender === 'Male').length;
  const femaleCount = results.filter(s => s.gender === 'Female').length;

  /* CSV Export */
  const handleExport = () => {
    const rows = [
      ['SL','Student Name','Father Name','Roll','Class','Section','Session','Subject','Contact','Gender'],
      ...results.map((s, i) => [i+1, s.name, s.father, s.roll, s.className, s.section, s.session, s.subject, s.contact, s.gender]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
      download: `SubjectWise_${filters.subject}_${filters.session}.csv`,
    });
    a.click();
  };

  /* Print */
  const handlePrint = () => {
    const rows = results.map((s, i) => `
      <tr>
        <td>${i+1}</td><td>${s.name}</td><td>${s.father}</td><td>${s.roll}</td>
        <td>${s.className}</td><td>${s.section}</td><td>${s.session}</td>
        <td>${s.contact}</td><td>${s.gender}</td>
      </tr>`).join('');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Subject Wise Students</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}
      th{background:#f3f4f6}h2{font-size:16px}p{font-size:13px}
      @media print{body{padding:0}}</style></head>
      <body><h2>Mohammadpur Kendriya College</h2>
      <p><strong>Subject:</strong> ${filters.subject} &nbsp;|&nbsp; <strong>Class:</strong> ${filters.className} &nbsp;|&nbsp; <strong>Section:</strong> ${filters.section} &nbsp;|&nbsp; <strong>Session:</strong> ${filters.session}</p>
      <table><thead><tr><th>#</th><th>Name</th><th>Father</th><th>Roll</th><th>Class</th><th>Section</th><th>Session</th><th>Contact</th><th>Gender</th></tr></thead>
      <tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <Breadcrumb items={['Dashboard', 'Student Setup', 'Subject Wise Students']} />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <BookOpen size={22} className="text-blue-500" /> Subject Wise Students
        </h1>
      </div>

      {/* Filter Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
          <SlidersHorizontal size={15} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Criteria</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label:'Edu. Level', name:'eduLevel' },
              { label:'Department', name:'department' },
              { label:'Class',      name:'className' },
              { label:'Section',    name:'section' },
              { label:'Session',    name:'session' },
              { label:'Subject',    name:'subject' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {f.label}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select name={f.name} value={filters[f.name]} onChange={handleFilterChange}
                  className={filterErrors[f.name] ? `${sel} border-red-400` : sel}>
                  <option value="">Select</option>
                  {(FILTER_OPTIONS[f.name]||[]).map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                {filterErrors[f.name] && (
                  <p className="text-xs text-red-500 flex items-center gap-0.5"><AlertCircle size={10}/>Req.</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
              <Eye size={14} /> Show Students
            </button>
            <button onClick={handleReset}
              className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          {/* Institution header + stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 text-center">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Subject: <span className="font-semibold text-blue-600 dark:text-blue-400">{filters.subject}</span>
                &nbsp;·&nbsp;{filters.className} &nbsp;·&nbsp; {filters.section} &nbsp;·&nbsp; {filters.session}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
              {[
                { label:'Total Students', value: results.length,  color:'text-blue-600 dark:text-blue-400' },
                { label:'Male',           value: maleCount,        color:'text-blue-500 dark:text-blue-400' },
                { label:'Female',         value: femaleCount,      color:'text-pink-500 dark:text-pink-400' },
                { label:'Subject',        value: filters.subject,  color:'text-purple-600 dark:text-purple-400' },
              ].map(s => (
                <div key={s.label} className="p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Users size={16} className="text-blue-500" />
                Student List
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {results.length} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Search name, roll…" value={tableSearch} onChange={e=>setTableSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-44 transition-all"/>
                  {tableSearch && <button onClick={()=>setTableSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={12}/></button>}
                </div>
                {results.length > 0 && <>
                  <button onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 rounded-xl transition-colors">
                    <Download size={13}/> CSV
                  </button>
                  <button onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <Printer size={13}/> Print
                  </button>
                </>}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['#','Student Name','Father Name','Roll No','Class','Section','Session','Contact','Gender'].map(h=>(
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {results.length === 0 ? (
                    <tr><td colSpan={9} className="px-5 py-12 text-center">
                      <BookOpen size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3"/>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found for the selected subject and filters.</p>
                    </td></tr>
                  ) : results.map((s, i) => (
                    <tr key={s.roll} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-400 dark:text-gray-500">{i+1}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{s.father}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">{s.roll}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">{s.className}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{s.section}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{s.session}</td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">{s.contact}</td>
                      <td className="px-4 py-3.5"><GenderBadge gender={s.gender}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
              {results.length} student{results.length !== 1 ? 's' : ''} enrolled in <span className="font-semibold text-gray-600 dark:text-gray-300 mx-1">{filters.subject}</span>
              ({maleCount} male, {femaleCount} female)
            </div>
          </div>
        </>
      )}
    </div>
  );
}