// src/pages/admin/studentSetup/StudentIDCard.jsx
import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronRight, Eye, Printer, User, AlertCircle,
  SlidersHorizontal, CreditCard, School,
} from 'lucide-react';

/* ── Shared helpers ──────────────────────────────────────────────────────── */
const inp = `w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600
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

const DUMMY_STUDENTS = [
  { roll: '001', name: 'Md. Hossain',    fatherName: 'Abdul Hossain', motherName: 'Rahela Begum', className: 'HSC-Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary', department: 'Science', address: 'House 12, Mohammadpur, Dhaka-1207', subjectCode: '101,102,103', bloodGroup: 'B+', dob: '2007-03-15', studentId: 'STU240001' },
  { roll: '002', name: 'Yeasin Arafat',  fatherName: 'Md. Shaikh',   motherName: 'Sumaiya Khatun', className: 'HSC-Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary', department: 'Science', address: 'Road 5, Block B, Mirpur-1, Dhaka', subjectCode: '101,102,104', bloodGroup: 'A+', dob: '2007-07-22', studentId: 'STU240002' },
  { roll: '003', name: 'Fatima Begum',   fatherName: 'Abdul Karim',  motherName: 'Nasrin Akter', className: 'HSC-Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary', department: 'Science', address: 'Flat 4C, Banani, Dhaka-1213', subjectCode: '101,102,105', bloodGroup: 'O+', dob: '2006-11-08', studentId: 'STU240003' },
  { roll: '004', name: 'Nafis Ahmed',    fatherName: 'Mizanur Rahman', motherName: 'Shirin Begum', className: 'HSC-Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary', department: 'Science', address: 'Sector 7, Uttara, Dhaka', subjectCode: '101,102,106', bloodGroup: 'AB+', dob: '2007-01-30', studentId: 'STU240004' },
];

/* ── Single ID Card (front + back) ──────────────────────────────────────── */
function IDCard({ student, showBack, showSubjectCode, showAddress }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Front */}
      <div className="w-full sm:w-72 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl overflow-hidden shadow-lg text-white flex-shrink-0" style={{ minHeight: '186px' }}>
        {/* Card header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-2 border-b border-blue-600/50">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
            <School size={13} />
          </div>
          <div>
            <p className="text-xs font-bold leading-none">ACADEMIC INSTITUTION</p>
            <p className="text-[9px] text-blue-300 leading-tight mt-0.5">Student Identity Card</p>
          </div>
          <div className="ml-auto">
            <p className="text-[9px] text-blue-300 text-right">Valid</p>
            <p className="text-xs font-bold">{student.session}</p>
          </div>
        </div>

        {/* Card body */}
        <div className="px-4 py-3 flex gap-3">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <User size={26} className="text-white/60" />
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight truncate">{student.name}</p>
            <p className="text-[10px] text-blue-300 mt-0.5">{student.className} · {student.section}</p>
            <div className="grid grid-cols-2 gap-x-2 mt-2">
              <div>
                <p className="text-[8px] text-blue-400 uppercase tracking-wide">Roll</p>
                <p className="text-xs font-bold">{student.roll}</p>
              </div>
              <div>
                <p className="text-[8px] text-blue-400 uppercase tracking-wide">ID</p>
                <p className="text-[10px] font-semibold truncate">{student.studentId}</p>
              </div>
              <div className="mt-1">
                <p className="text-[8px] text-blue-400 uppercase tracking-wide">Blood</p>
                <p className="text-xs font-bold text-red-300">{student.bloodGroup}</p>
              </div>
              <div className="mt-1">
                <p className="text-[8px] text-blue-400 uppercase tracking-wide">DOB</p>
                <p className="text-[10px] font-semibold">{student.dob}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-4 py-2 border-t border-blue-600/50 bg-blue-900/50">
          <p className="text-[9px] text-blue-300">Father: <span className="text-white">{student.fatherName}</span></p>
        </div>
      </div>

      {/* Back */}
      {showBack && (
        <div className="w-full sm:w-72 bg-white dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm flex-shrink-0 flex flex-col" style={{ minHeight: '186px' }}>
          <div className="px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-600">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Additional Information</p>
          </div>
          <div className="px-4 py-3 flex-1 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Mother's Name</p>
              <p className="font-medium">{student.motherName}</p>
            </div>
            {showAddress && (
              <div>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Address</p>
                <p className="leading-tight">{student.address}</p>
              </div>
            )}
            {showSubjectCode && (
              <div>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Subject Codes</p>
                <p className="font-mono font-medium">{student.subjectCode}</p>
              </div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30">
            <p className="text-[9px] text-gray-400 text-center">This card is the property of the institution</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function StudentIDCard() {
  const [filters, setFilters] = useState({
    eduLevel: '', department: '', className: '', section: '', session: '',
    studentName: '', rollFrom: '', rollTo: '',
    backPartType: 'No', subjectCodeType: 'No', addressType: 'No',
  });
  const [filterErrors, setFilterErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const cardRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(p => ({ ...p, [name]: value }));
    setFilterErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    ['eduLevel','department','className','section','session'].forEach(k => {
      if (!filters[k]) errs[k] = true;
    });
    return errs;
  };

  const handleShow = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }

    const result = DUMMY_STUDENTS.filter(s =>
      (!filters.studentName || s.name.toLowerCase().includes(filters.studentName.toLowerCase())) &&
      (!filters.rollFrom || parseInt(s.roll) >= parseInt(filters.rollFrom)) &&
      (!filters.rollTo   || parseInt(s.roll) <= parseInt(filters.rollTo))
    );
    setStudents(result);
    setShowCards(true);
  };

  const handlePrint = () => {
    const content = cardRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>ID Cards</title><style>
      body { margin: 0; padding: 20px; font-family: sans-serif; }
      @media print { body { padding: 0; } }
    </style></head><body>${content}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  const FILTER_FIELDS = [
    { label: 'Edu. Level', name: 'eduLevel',   opts: ['Higher Secondary','Secondary'] },
    { label: 'Department', name: 'department', opts: ['Science','Arts','Commerce'] },
    { label: 'Class',      name: 'className',  opts: ['HSC-Science','HSC-Arts'] },
    { label: 'Section',    name: 'section',    opts: ['1st Year','2nd Year','A','B'] },
    { label: 'Session',    name: 'session',    opts: ['2024-2025','2025-2026'] },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Student Setup', 'Student ID Card']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Student ID Card</h1>
        </div>
        {showCards && students.length > 0 && (
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl transition-colors shadow-sm flex-shrink-0">
            <Printer size={14} /> Print All
          </button>
        )}
      </div>

      {/* Filter Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Students</span>
        </div>
        <div className="p-5 space-y-4">
          {/* Required dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {FILTER_FIELDS.map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {f.label}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select name={f.name} value={filters[f.name]} onChange={handleChange}
                  className={filterErrors[f.name] ? `${inp} border-red-400` : inp}>
                  <option value="">Select</option>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {filterErrors[f.name] && <p className="text-xs text-red-500 flex items-center gap-0.5"><AlertCircle size={10} />Req.</p>}
              </div>
            ))}
          </div>

          {/* Optional filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Name</label>
              <input name="studentName" value={filters.studentName} onChange={handleChange} placeholder="Search name…" className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll From</label>
              <input type="number" name="rollFrom" value={filters.rollFrom} onChange={handleChange} placeholder="e.g. 001" className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll To</label>
              <input type="number" name="rollTo" value={filters.rollTo} onChange={handleChange} placeholder="e.g. 050" className={inp} />
            </div>
            {[
              { label: 'Back Side',     name: 'backPartType' },
              { label: 'Subject Code',  name: 'subjectCodeType' },
              { label: 'Address',       name: 'addressType' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                <div className="flex gap-1.5">
                  {['No','Yes'].map(v => (
                    <button key={v} type="button" onClick={() => setFilters(p => ({ ...p, [f.name]: v }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${filters[f.name] === v
                          ? v === 'Yes' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-700 text-white border-gray-700 dark:bg-gray-500 dark:border-gray-500'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleShow}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
              <Eye size={14} /> Show ID Cards
            </button>
            <button onClick={() => { setShowCards(false); setStudents([]); }}
              className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {showCards && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Generated Cards</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                {students.length} student{students.length !== 1 ? 's' : ''}
              </span>
            </div>
            {students.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {filters.backPartType === 'Yes' && <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800">Back side</span>}
                {filters.subjectCodeType === 'Yes' && <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-100 dark:border-purple-800">Subject codes</span>}
                {filters.addressType === 'Yes' && <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-800">Address</span>}
              </div>
            )}
          </div>

          {students.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-14 text-center">
              <CreditCard size={40} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students match your filters</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting the search criteria above.</p>
            </div>
          ) : (
            <div ref={cardRef} className="space-y-5">
              {students.map(s => (
                <div key={s.roll} className="bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <IDCard
                    student={s}
                    showBack={filters.backPartType === 'Yes'}
                    showSubjectCode={filters.subjectCodeType === 'Yes'}
                    showAddress={filters.addressType === 'Yes'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}