import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  ChevronRight,
  ChevronLeft,
  Printer,
  FileSpreadsheet,
  Filter,
  Search,
  Users,
  BookOpen,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Breadcrumb ───────────────────────────────────────────────────────────── */
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
          <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
        )}
      </React.Fragment>
    ))}
  </nav>
);

/* ── SelectField ─────────────────────────────────────────────────────────── */
const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px]">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

/* ── Avatar ──────────────────────────────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-11 h-11 rounded-xl ${color} font-bold text-sm flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
};

/* ── Seed Data ────────────────────────────────────────────────────────────── */
const STUDENTS = [
  {
    id: 1, name: 'Saiful Islam',
    father: 'Md. Nuru Molla', mother: 'Maksuda Akter',
    admissionDate: '09-09-2025', roll: '1202526033046',
    sscReg: '2210607239', sscYear: '2023-2024', sscBoard: 'Dhaka Board',
    subjects: 'Bangla (101,102), English (107,108), Physics (174,175), Chemistry (176,177), Biology (178), ICT (275), Higher Math (265,266)',
    department: 'Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary',
  },
  {
    id: 2, name: 'Md. Nasimul Islam Radoan',
    father: 'Md. Zakir Hosen', mother: 'Nasima Akter',
    admissionDate: '09-09-2025', roll: '1202526033047',
    sscReg: '2210662472', sscYear: '2023-2024', sscBoard: 'Dhaka Board',
    subjects: 'Bangla (101,102), English (107,108), Physics (174,175), Chemistry (176,177), Higher Math (265,266), ICT (275), Biology (178)',
    department: 'Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary',
  },
  {
    id: 3, name: 'Fatema Begum',
    father: 'Karim Uddin', mother: 'Sufia Khatun',
    admissionDate: '10-09-2025', roll: '1202526033048',
    sscReg: '2210607240', sscYear: '2023-2024', sscBoard: 'Dhaka Board',
    subjects: 'Bangla (101,102), English (107,108), Physics (174,175), Chemistry (176,177), Biology (178), ICT (275)',
    department: 'Science', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary',
  },
  {
    id: 4, name: 'Rahim Miah',
    father: 'Jalal Uddin', mother: 'Rashida Khatun',
    admissionDate: '10-09-2025', roll: '1202526033049',
    sscReg: '2210607241', sscYear: '2023-2024', sscBoard: 'Dhaka Board',
    subjects: 'Bangla (101,102), English (107,108), Accounting (253,254), Business Math (292), Economics (109,110)',
    department: 'Business', section: '2nd Year', session: '2024-2025', eduLevel: 'Higher Secondary',
  },
  {
    id: 5, name: 'Nusrat Jahan',
    father: 'Abul Kashem', mother: 'Dilruba Khatun',
    admissionDate: '11-09-2025', roll: '1202526033050',
    sscReg: '2210607242', sscYear: '2022-2023', sscBoard: 'Chittagong Board',
    subjects: 'Bangla (101,102), English (107,108), History (304,305), Civics (269,270), Economics (109,110)',
    department: 'Humanities', section: '1st Year', session: '2025-2026', eduLevel: 'Higher Secondary',
  },
  {
    id: 6, name: 'Arif Hossain',
    father: 'Shamsul Haque', mother: 'Amena Begum',
    admissionDate: '11-09-2025', roll: '1202526033051',
    sscReg: '2210607243', sscYear: '2023-2024', sscBoard: 'Dhaka Board',
    subjects: 'Bangla (101,102), English (107,108), Physics (174,175), Chemistry (176,177), Higher Math (265,266), ICT (275)',
    department: 'Science', section: '2nd Year', session: '2024-2025', eduLevel: 'Higher Secondary',
  },
];

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function StudentToughtList() {
  const [filters, setFilters] = useState({
    eduLevel: 'Higher Secondary',
    department: 'Science',
    className: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
  });
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() =>
    STUDENTS.filter((s) => {
      const matchFilters =
        (!filters.eduLevel || s.eduLevel === filters.eduLevel) &&
        (!filters.department || s.department === filters.department) &&
        (!filters.section || s.section === filters.section) &&
        (!filters.session || s.session === filters.session);
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.includes(search) ||
        s.sscReg.includes(search);
      return matchFilters && matchSearch;
    }),
  [filters, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handlePrint = () => window.print();

  const handleDownloadExcel = () => {
    const exportData = filtered.map((s, i) => ({
      'Sl.': i + 1,
      'Student Name': s.name,
      "Father's Name": s.father,
      "Mother's Name": s.mother,
      'Admission Date': s.admissionDate,
      'Class Roll': s.roll,
      'SSC Reg. No.': s.sscReg,
      'SSC Year': s.sscYear,
      Board: s.sscBoard,
      Subjects: s.subjects,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StudentList');
    XLSX.writeFile(wb, 'StudentTaughtList.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Student Taught List']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Student Taught List</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 print:hidden">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200"
            >
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          {[
            { label: 'Total Students', value: STUDENTS.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
            { label: 'Filtered Results', value: filtered.length, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: GraduationCap },
            { label: 'Total Subjects', value: filtered.reduce((s, st) => s + st.subjects.split(',').length, 0), bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: BookOpen },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}>
                <s.Icon size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Filter size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</span>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField label="Edu. Level" value={filters.eduLevel} onChange={(v) => { setFilters((p) => ({ ...p, eduLevel: v })); setPage(1); }}
              options={[{ value: 'Higher Secondary', label: 'Higher Secondary' }, { value: 'Secondary', label: 'Secondary' }]} />
            <SelectField label="Department" value={filters.department} onChange={(v) => { setFilters((p) => ({ ...p, department: v })); setPage(1); }}
              options={[{ value: 'Science', label: 'Science' }, { value: 'Humanities', label: 'Humanities' }, { value: 'Business', label: 'Business' }]} />
            <SelectField label="Class" value={filters.className} onChange={(v) => { setFilters((p) => ({ ...p, className: v })); setPage(1); }}
              options={[{ value: 'HSC-Science', label: 'HSC-Science' }, { value: 'HSC-Humanities', label: 'HSC-Humanities' }, { value: 'HSC-Business', label: 'HSC-Business' }]} />
            <SelectField label="Section" value={filters.section} onChange={(v) => { setFilters((p) => ({ ...p, section: v })); setPage(1); }}
              options={[{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }]} />
            <SelectField label="Session" value={filters.session} onChange={(v) => { setFilters((p) => ({ ...p, session: v })); setPage(1); }}
              options={[{ value: '2025-2026', label: '2025-2026' }, { value: '2024-2025', label: '2024-2025' }]} />
          </div>
        </div>

        {/* College Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-900 px-5 py-3">
          <div className="text-center print:block hidden">
            <h2 className="text-xl font-bold">Mohammadpur Kendriya College</h2>
            <p className="text-sm">EIIN: 108254 | Department: {filters.department} | Session: {filters.session}</p>
            <h3 className="font-semibold mt-1">Student Taught List</h3>
          </div>
          <div className="print:hidden flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">College:</span> Mohammadpur Kendriya College</span>
            <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">EIIN:</span> 108254</span>
            <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Department:</span> {filters.department}</span>
            <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Section:</span> {filters.section}</span>
            <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Session:</span> {filters.session}</span>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
              >
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">entries</span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, roll, reg…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-52 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['Sl.', 'Student', 'Admission Date & Class Roll', 'SSC Reg. No. & Session', 'SSC Board', 'Subjects Studied'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <GraduationCap size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students match current filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors align-top">
                      <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <Avatar name={s.name} />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <span className="font-medium">Father:</span> {s.father}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-medium">Mother:</span> {s.mother}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600 dark:text-gray-300">{s.admissionDate}</p>
                        <p className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {s.roll}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs text-gray-700 dark:text-gray-300">{s.sscReg}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.sscYear}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                          {s.sscBoard}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {s.subjects.split(',').map((sub, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                              {sub.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 print:hidden">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === 'string' ? (
                    <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all
                      ${safePage === p ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}