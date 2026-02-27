import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileText,
  Search,
  Download,
  Printer,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

/* ─── Column Definitions ─── */
const COLUMNS = [
  { key: 'sl', label: '#', sticky: true },
  { key: 'studentName', label: 'Student Name', sticky: true },
  { key: 'roll', label: 'Roll' },
  { key: 'examFee', label: 'Exam Fee' },
  { key: 'thesisFee', label: 'Thesis & Oral Exam Fee' },
  { key: 'tempCertFee', label: 'Temp. Certificate & Transcript' },
  { key: 'examCenterFee', label: 'Exam Center Fee' },
  { key: 'practicalFee', label: 'Practical Fee' },
  { key: 'serviceCharge', label: 'Service Charge' },
  { key: 'semesterFee', label: 'Semester Fee' },
  { key: 'protyononPotro', label: 'প্রত্যয়ন পত্র' },
  { key: 'testimonial', label: 'Testimonial' },
  { key: 'idCard', label: 'ID Card' },
  { key: 'mobileFine', label: 'Mobile Fine' },
  { key: 'tuitionFee', label: 'Tuition Fee' },
  { key: 'reAdmissionFee', label: 'Re-admission Fee' },
  { key: 'absentFine', label: 'Absent Fine' },
  { key: 'ictFee', label: 'ICT Fee' },
  { key: 'collegePractical', label: 'College Practical (Yearly)' },
  { key: 'miscIncome', label: 'Misc. Income' },
  { key: 'labFee', label: 'Lab Fee' },
  { key: 'centerFee', label: 'Center Fee' },
  { key: 'electricity', label: 'Electricity/Water/Gas' },
  { key: 'library', label: 'Library Charges' },
  { key: 'benevolent', label: 'Benevolent/Poor Fund' },
  { key: 'sessionFee', label: 'Session Fee' },
  { key: 'semesterFee1', label: 'Semester Fee-1' },
  { key: 'semesterFee2', label: 'Semester Fee-2' },
  { key: 'semesterFee3', label: 'Semester Fee-3' },
  { key: 'extraDues', label: 'Extra Dues' },
  {
    key: 'totalCollectible',
    label: 'Total Collectible',
    highlight: 'collectible',
  },
  { key: 'totalDiscount', label: 'Total Discount', highlight: 'discount' },
  { key: 'totalCollected', label: 'Total Collected', highlight: 'collected' },
  { key: 'totalDue', label: 'Total Dues', highlight: 'due' },
];

const SAMPLE_ROWS = [
  {
    id: 1,
    studentName: 'SAIFUL ISLAM',
    roll: '1202526033046',
    examFee: 0,
    thesisFee: 0,
    tempCertFee: 0,
    examCenterFee: 0,
    practicalFee: 0,
    serviceCharge: 0,
    semesterFee: 0,
    protyononPotro: 0,
    testimonial: 0,
    idCard: 0,
    mobileFine: 0,
    tuitionFee: 12000,
    reAdmissionFee: 0,
    absentFine: 0,
    ictFee: 0,
    collegePractical: 0,
    miscIncome: 0,
    labFee: 0,
    centerFee: 0,
    electricity: 100,
    library: 125,
    benevolent: 125,
    sessionFee: 1200,
    semesterFee1: 0,
    semesterFee2: 0,
    semesterFee3: 0,
    extraDues: 0,
    totalCollectible: 19500,
    totalDiscount: 0,
    totalCollected: 12500,
    totalDue: 7000,
  },
  {
    id: 2,
    studentName: 'RAKIB HASAN',
    roll: '1202526033047',
    examFee: 500,
    thesisFee: 0,
    tempCertFee: 0,
    examCenterFee: 200,
    practicalFee: 300,
    serviceCharge: 100,
    semesterFee: 0,
    protyononPotro: 0,
    testimonial: 0,
    idCard: 200,
    mobileFine: 0,
    tuitionFee: 12000,
    reAdmissionFee: 0,
    absentFine: 200,
    ictFee: 0,
    collegePractical: 0,
    miscIncome: 0,
    labFee: 0,
    centerFee: 0,
    electricity: 100,
    library: 125,
    benevolent: 125,
    sessionFee: 1200,
    semesterFee1: 0,
    semesterFee2: 0,
    semesterFee3: 0,
    extraDues: 0,
    totalCollectible: 21050,
    totalDiscount: 500,
    totalCollected: 21050,
    totalDue: 0,
  },
  {
    id: 3,
    studentName: 'NASIMA KHATUN',
    roll: '1202526033048',
    examFee: 500,
    thesisFee: 0,
    tempCertFee: 0,
    examCenterFee: 200,
    practicalFee: 0,
    serviceCharge: 100,
    semesterFee: 0,
    protyononPotro: 0,
    testimonial: 0,
    idCard: 200,
    mobileFine: 0,
    tuitionFee: 12000,
    reAdmissionFee: 0,
    absentFine: 0,
    ictFee: 0,
    collegePractical: 0,
    miscIncome: 0,
    labFee: 0,
    centerFee: 0,
    electricity: 100,
    library: 125,
    benevolent: 125,
    sessionFee: 1200,
    semesterFee1: 0,
    semesterFee2: 0,
    semesterFee3: 0,
    extraDues: 0,
    totalCollectible: 20050,
    totalDiscount: 0,
    totalCollected: 15000,
    totalDue: 5050,
  },
  {
    id: 4,
    studentName: 'MD. JAHANGIR',
    roll: '1202526033049',
    examFee: 500,
    thesisFee: 0,
    tempCertFee: 300,
    examCenterFee: 200,
    practicalFee: 300,
    serviceCharge: 100,
    semesterFee: 0,
    protyononPotro: 0,
    testimonial: 200,
    idCard: 200,
    mobileFine: 500,
    tuitionFee: 12000,
    reAdmissionFee: 0,
    absentFine: 300,
    ictFee: 0,
    collegePractical: 0,
    miscIncome: 0,
    labFee: 0,
    centerFee: 0,
    electricity: 100,
    library: 125,
    benevolent: 125,
    sessionFee: 1200,
    semesterFee1: 0,
    semesterFee2: 0,
    semesterFee3: 0,
    extraDues: 0,
    totalCollectible: 22950,
    totalDiscount: 0,
    totalCollected: 22950,
    totalDue: 0,
  },
  {
    id: 5,
    studentName: 'SUMAIA AKTER',
    roll: '1202526033050',
    examFee: 500,
    thesisFee: 0,
    tempCertFee: 0,
    examCenterFee: 200,
    practicalFee: 0,
    serviceCharge: 100,
    semesterFee: 0,
    protyononPotro: 0,
    testimonial: 0,
    idCard: 200,
    mobileFine: 0,
    tuitionFee: 12000,
    reAdmissionFee: 0,
    absentFine: 0,
    ictFee: 0,
    collegePractical: 0,
    miscIncome: 0,
    labFee: 0,
    centerFee: 0,
    electricity: 100,
    library: 125,
    benevolent: 125,
    sessionFee: 1200,
    semesterFee1: 0,
    semesterFee2: 0,
    semesterFee3: 0,
    extraDues: 0,
    totalCollectible: 19550,
    totalDiscount: 200,
    totalCollected: 10000,
    totalDue: 9350,
  },
];

const EDU_LEVELS = [
  'Higher Secondary',
  'Secondary',
  'Degree',
  'Honours',
  'Masters',
];
const DEPARTMENTS = [
  'Science',
  'Arts',
  'Commerce',
  'Geography',
  'Management',
  'English',
];
const CLASSES = [
  'HSC-Science',
  'HSC-Arts',
  'HSC-Commerce',
  'B.A. (Hons)',
  'B.Sc. (Hons)',
];
const SECTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SESSIONS = ['2025-2026', '2024-2025', '2023-2024'];

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

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

function F({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function StudentBalanceSheet() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    eduLevel: 'Higher Secondary',
    dept: 'Science',
    class: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
  });
  const PER_PAGE = 10;

  const handleLoad = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setRows(SAMPLE_ROWS);
    setLoaded(true);
    setLoading(false);
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !search ||
          r.studentName.toLowerCase().includes(search.toLowerCase()) ||
          r.roll.includes(search)
      ),
    [rows, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const totals = useMemo(() => {
    const t = {};
    COLUMNS.forEach((col) => {
      t[col.key] = filtered.reduce((s, r) => s + (r[col.key] || 0), 0);
    });
    return t;
  }, [filtered]);

  const handleExcel = () => {
    const data = filtered.map((r, i) => {
      const obj = { '#': i + 1 };
      COLUMNS.slice(1).forEach((col) => {
        obj[col.label] = r[col.key] ?? 0;
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');
    XLSX.writeFile(wb, 'Student_Balance_Sheet.xlsx');
  };

  const highlightCls = (h) =>
    ({
      collectible:
        'bg-blue-50 dark:bg-blue-900/10 font-bold text-blue-700 dark:text-blue-400',
      discount:
        'bg-amber-50 dark:bg-amber-900/10 font-bold text-amber-600 dark:text-amber-400',
      collected:
        'bg-green-50 dark:bg-green-900/10 font-bold text-green-700 dark:text-green-400',
      due: 'bg-red-50 dark:bg-red-900/10 font-bold text-red-600 dark:text-red-400',
    })[h] || 'text-gray-600 dark:text-gray-400';

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Student Balance Sheet']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-blue-500" /> Student Balance
            Sheet
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Filter Options
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <F label="Education Level">
              <select
                value={filters.eduLevel}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, eduLevel: e.target.value }))
                }
                className={inp}
              >
                {EDU_LEVELS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Department">
              <select
                value={filters.dept}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, dept: e.target.value }))
                }
                className={inp}
              >
                {DEPARTMENTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Class">
              <select
                value={filters.class}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, class: e.target.value }))
                }
                className={inp}
              >
                {CLASSES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Section">
              <select
                value={filters.section}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, section: e.target.value }))
                }
                className={inp}
              >
                {SECTIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Session">
              <select
                value={filters.session}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, session: e.target.value }))
                }
                className={inp}
              >
                {SESSIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={handleLoad}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Load Balance Sheet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {loaded && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Collectible',
                  value: totals.totalCollectible,
                  cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
                  val: 'text-blue-700 dark:text-blue-400',
                  ic: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
                },
                {
                  label: 'Total Discount',
                  value: totals.totalDiscount,
                  cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
                  val: 'text-amber-600 dark:text-amber-400',
                  ic: 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300',
                },
                {
                  label: 'Total Collected',
                  value: totals.totalCollected,
                  cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
                  val: 'text-green-700 dark:text-green-400',
                  ic: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
                },
                {
                  label: 'Total Dues',
                  value: totals.totalDue,
                  cls: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30',
                  val: 'text-red-600 dark:text-red-400',
                  ic: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
                  >
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className={`text-xl font-bold leading-none ${s.val}`}>
                      ৳{s.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Balance Sheet
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {filtered.length} students
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExcel}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Download size={13} /> Excel
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Printer size={13} /> Print
                  </button>
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      placeholder="Search name or roll…"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ minWidth: '2800px' }}
                >
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {COLUMNS.map((col) => (
                        <th
                          key={col.key}
                          className={`px-3 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap border-r border-gray-100 dark:border-gray-700 last:border-r-0 
                          ${col.highlight === 'collectible' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}
                          ${col.highlight === 'discount' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : ''}
                          ${col.highlight === 'collected' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : ''}
                          ${col.highlight === 'due' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : ''}`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {paged.map((row, ri) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${row.totalDue > 0 ? 'bg-red-50/20 dark:bg-red-900/5' : ''}`}
                      >
                        {COLUMNS.map((col) => (
                          <td
                            key={col.key}
                            className={`px-3 py-3.5 text-sm border-r border-gray-50 dark:border-gray-700/50 last:border-r-0 whitespace-nowrap
                            ${col.key === 'studentName' ? 'font-semibold text-gray-800 dark:text-gray-100' : ''}
                            ${col.key === 'roll' ? 'font-mono text-xs text-gray-500 dark:text-gray-400' : ''}
                            ${col.key === 'sl' ? 'text-gray-400 dark:text-gray-500' : ''}
                            ${col.highlight ? highlightCls(col.highlight) : 'text-gray-600 dark:text-gray-400'}`}
                          >
                            {col.key === 'sl' ? (
                              (safePage - 1) * PER_PAGE + ri + 1
                            ) : (row[col.key] ?? 0) === 0 &&
                              !['sl', 'studentName', 'roll'].includes(
                                col.key
                              ) ? (
                              <span className="text-gray-300 dark:text-gray-600">
                                —
                              </span>
                            ) : (
                              (row[col.key] ?? 0)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-700/50 border-t-2 border-gray-200 dark:border-gray-600">
                      {COLUMNS.map((col, i) => (
                        <td
                          key={col.key}
                          className={`px-3 py-3.5 text-xs font-bold border-r border-gray-200 dark:border-gray-600 last:border-r-0 whitespace-nowrap
                          ${col.highlight ? highlightCls(col.highlight) : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {i === 0
                            ? 'Total'
                            : i <= 2
                              ? ''
                              : totals[col.key] > 0
                                ? totals[col.key].toLocaleString()
                                : ''}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                  {Math.min(safePage * PER_PAGE, filtered.length)} of{' '}
                  {filtered.length} students
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
