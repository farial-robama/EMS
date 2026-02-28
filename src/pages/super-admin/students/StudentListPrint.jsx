import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ChevronRight,
  ChevronLeft,
  Printer,
  Download,
  Filter,
  Search,
  Users,
  RefreshCw,
  FileSpreadsheet,
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
const SelectField = ({ label, name, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

/* ── Seed Data ────────────────────────────────────────────────────────────── */
const SHIFTS = ['Day', 'Morning', 'Evening'];
const MEDIUMS = ['Bangla', 'English'];
const EDU_LEVELS = ['Higher Secondary'];
const DEPARTMENTS = ['Science', 'Humanities', 'Business'];
const CLASSES = ['HSC-Science', 'HSC-Humanities', 'HSC-Business'];
const SECTIONS = ['1st Year', '2nd Year'];
const SESSIONS = ['2025-2026', '2024-2025'];
const GENDERS = ['Male', 'Female'];
const RELIGIONS = ['Islam', 'Hinduism', 'Christianity', 'Buddhism'];

const STUDENT_DATA = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  shift: SHIFTS[i % 3],
  medium: MEDIUMS[i % 2],
  studentCode: `25140100300${String(i + 6).padStart(2, '0')}`,
  name: `Student ${i + 1}`,
  gender: GENDERS[i % 2],
  religion: RELIGIONS[i % 4],
  roll: 1000 + i,
  admRoll: 2000 + i,
  category: 'General',
  regNo: `221000000${i}`,
  gpa: (4 + (i % 5) * 0.06).toFixed(2),
  fatherName: `Father Name ${i + 1}`,
  fatherIncome: ((i + 1) * 5000).toLocaleString(),
  motherName: `Mother Name ${i + 1}`,
  guardianContact: `01710000${String(i).padStart(3, '0')}`,
  studentContact: `01820000${String(i).padStart(3, '0')}`,
  eduLevel: EDU_LEVELS[0],
  department: DEPARTMENTS[i % 3],
  className: CLASSES[i % 3],
  section: SECTIONS[i % 2],
  session: SESSIONS[i % 2],
}));

/* ── TABLE COLUMNS ──────────────────────────────────────────────────────────*/
const COLUMNS = [
  { key: 'sl', label: 'SL' },
  { key: 'shift', label: 'Shift' },
  { key: 'medium', label: 'Medium' },
  { key: 'studentCode', label: 'Std. Code' },
  { key: 'name', label: 'Student Name' },
  { key: 'gender', label: 'Gender' },
  { key: 'religion', label: 'Religion' },
  { key: 'roll', label: 'Roll' },
  { key: 'admRoll', label: 'Adm. Roll' },
  { key: 'category', label: 'Category' },
  { key: 'regNo', label: 'Reg. No.' },
  { key: 'gpa', label: 'GPA' },
  { key: 'fatherName', label: 'Father Name' },
  { key: 'fatherIncome', label: 'Father Income' },
  { key: 'motherName', label: 'Mother Name' },
  { key: 'guardianContact', label: 'Guardian Contact' },
  { key: 'studentContact', label: 'Std. Contact' },
];

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function StudentListPrint() {
  const [filters, setFilters] = useState({
    shift: '', medium: '', eduLevel: '', department: '',
    className: '', section: '', session: '', gender: '', religion: '',
  });
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    return STUDENT_DATA.filter((s) => {
      const matchFilters =
        (!filters.shift || s.shift === filters.shift) &&
        (!filters.medium || s.medium === filters.medium) &&
        (!filters.eduLevel || s.eduLevel === filters.eduLevel) &&
        (!filters.department || s.department === filters.department) &&
        (!filters.className || s.className === filters.className) &&
        (!filters.section || s.section === filters.section) &&
        (!filters.session || s.session === filters.session) &&
        (!filters.gender || s.gender === filters.gender) &&
        (!filters.religion || s.religion === filters.religion);
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentCode.includes(search) ||
        String(s.roll).includes(search);
      return matchFilters && matchSearch;
    });
  }, [filters, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleReset = () => {
    setFilters({ shift: '', medium: '', eduLevel: '', department: '', className: '', section: '', session: '', gender: '', religion: '' });
    setSearch('');
    setPage(1);
  };

  const handlePrint = () => window.print();

  const handleDownloadExcel = () => {
    const exportData = filtered.map((s, i) => ({
      SL: i + 1, Shift: s.shift, Medium: s.medium,
      'Student Code': s.studentCode, Name: s.name,
      Gender: s.gender, Religion: s.religion,
      Roll: s.roll, 'Adm Roll': s.admRoll, Category: s.category,
      'Registration No.': s.regNo, 'GPA/Class': s.gpa,
      'Father Name': s.fatherName, 'Father Income': s.fatherIncome,
      'Mother Name': s.motherName, 'Guardian Contact': s.guardianContact,
      'Student Contact': s.studentContact,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const buf = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'StudentList.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Student List Print']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Student List Print</h1>
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
            { label: 'Total Students', value: STUDENT_DATA.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
            { label: 'Filtered Results', value: filtered.length, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: Filter },
            { label: 'Active Filters', value: activeFilterCount, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: GraduationCap },
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Filter size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">{activeFilterCount}</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                <RefreshCw size={11} /> Reset Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <SelectField label="Shift" name="shift" value={filters.shift} onChange={handleChange} options={SHIFTS} placeholder="All Shifts" />
            <SelectField label="Medium" name="medium" value={filters.medium} onChange={handleChange} options={MEDIUMS} placeholder="All Mediums" />
            <SelectField label="Edu. Level" name="eduLevel" value={filters.eduLevel} onChange={handleChange} options={EDU_LEVELS} placeholder="All Levels" />
            <SelectField label="Department" name="department" value={filters.department} onChange={handleChange} options={DEPARTMENTS} placeholder="All Depts." />
            <SelectField label="Class" name="className" value={filters.className} onChange={handleChange} options={CLASSES} placeholder="All Classes" />
            <SelectField label="Section" name="section" value={filters.section} onChange={handleChange} options={SECTIONS} placeholder="All Sections" />
            <SelectField label="Session" name="session" value={filters.session} onChange={handleChange} options={SESSIONS} placeholder="All Sessions" />
            <SelectField label="Gender" name="gender" value={filters.gender} onChange={handleChange} options={GENDERS} placeholder="All Genders" />
            <SelectField label="Religion" name="religion" value={filters.religion} onChange={handleChange} options={RELIGIONS} placeholder="All Religions" />
          </div>
        </div>

        {/* Print Header (only visible in print) */}
        <div className="hidden print:block text-center mb-4">
          <h2 className="text-xl font-bold">Mohammadpur Kendriya College</h2>
          <p className="text-sm text-gray-600">
            Shift: {filters.shift || 'All'} | Medium: {filters.medium || 'All'} |
            Class: {filters.className || 'All'} | Section: {filters.section || 'All'} |
            Session: {filters.session || 'All'}
          </p>
          <h3 className="text-base font-semibold mt-1">Student List</h3>
        </div>

        {/* College Info Banner (screen only) */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-900 px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs print:hidden">
          <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">College:</span> Mohammadpur Kendriya College</span>
          <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Class:</span> {filters.className || 'All'}</span>
          <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Section:</span> {filters.section || 'All'}</span>
          <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Session:</span> {filters.session || 'All'}</span>
          <span className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Showing:</span> {filtered.length} students</span>
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
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">entries</span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, code, roll…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-56 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-5 py-14 text-center">
                      <Users size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students match your filters</p>
                      <button onClick={handleReset} className="mt-2 text-xs text-blue-500 hover:underline">Reset filters</button>
                    </td>
                  </tr>
                ) : (
                  paged.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-3 text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{s.shift}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{s.medium}</td>
                      <td className="px-3 py-3">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">{s.studentCode}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.name}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${s.gender === 'Male' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'}`}>
                          {s.gender}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{s.religion}</td>
                      <td className="px-3 py-3 font-mono text-gray-700 dark:text-gray-300">{s.roll}</td>
                      <td className="px-3 py-3 font-mono text-gray-700 dark:text-gray-300">{s.admRoll}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{s.category}</td>
                      <td className="px-3 py-3 font-mono text-gray-600 dark:text-gray-300">{s.regNo}</td>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{s.gpa}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{s.fatherName}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{s.fatherIncome}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{s.motherName}</td>
                      <td className="px-3 py-3 font-mono text-gray-600 dark:text-gray-300">{s.guardianContact}</td>
                      <td className="px-3 py-3 font-mono text-gray-600 dark:text-gray-300">{s.studentContact}</td>
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