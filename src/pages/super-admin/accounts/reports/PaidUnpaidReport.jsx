import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Search,
  Download,
  Printer,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const SAMPLE = [
  {
    id: 1,
    name: 'Sharif Tahzeeb Al Adiat',
    roll: '1202425033001',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Unpaid',
    paid: 11210,
    due: 12000,
  },
  {
    id: 2,
    name: 'Tahsin Ahmed',
    roll: '1202425033032',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 24620,
    due: 0,
  },
  {
    id: 3,
    name: 'Yaminur Hossain Sajjad',
    roll: '1202425033186',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 23620,
    due: 0,
  },
  {
    id: 4,
    name: 'Rahim Sarker',
    roll: '1202425033015',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Partial',
    paid: 15000,
    due: 8000,
  },
  {
    id: 5,
    name: 'Nasima Khatun',
    roll: '1202425033022',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 24620,
    due: 0,
  },
  {
    id: 6,
    name: 'Karim Uddin Ahmed',
    roll: '1202425033044',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Unpaid',
    paid: 0,
    due: 24620,
  },
  {
    id: 7,
    name: 'Sadia Islam',
    roll: '1202425033058',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Partial',
    paid: 12000,
    due: 12620,
  },
  {
    id: 8,
    name: 'Farhan Hossain',
    roll: '1202425033071',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 24620,
    due: 0,
  },
  {
    id: 9,
    name: 'Jannatul Ferdous',
    roll: '1202425033083',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Unpaid',
    paid: 5000,
    due: 19620,
  },
  {
    id: 10,
    name: 'Abdullah Al Mamun',
    roll: '1202425033095',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 24620,
    due: 0,
  },
  {
    id: 11,
    name: 'Roksana Begum',
    roll: '1202425033108',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Partial',
    paid: 18000,
    due: 6620,
  },
  {
    id: 12,
    name: 'Suman Chandra Das',
    roll: '1202425033120',
    class: 'HSC-Science (Bangla)',
    section: '2nd year',
    session: '2024-2025',
    status: 'Paid',
    paid: 24620,
    due: 0,
  },
];

const EDU_LEVELS = ['Higher Secondary', 'Secondary', 'Degree', 'Honours'];
const DEPARTMENTS = ['Science', 'Arts', 'Commerce', 'Geography', 'Management'];
const CLASSES = ['HSC-Science', 'HSC-Arts', 'HSC-Commerce'];
const SECTIONS = ['1st year', '2nd year'];
const SESSIONS = ['2024-2025', '2025-2026', '2023-2024'];
const STATUS_OPTS = ['All', 'Paid', 'Unpaid', 'Partial'];

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

const StatusBadge = ({ status }) => {
  const map = {
    Paid: {
      cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      icon: <CheckCircle2 size={11} />,
    },
    Unpaid: {
      cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      icon: <XCircle size={11} />,
    },
    Partial: {
      cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      icon: <AlertCircle size={11} />,
    },
  };
  const { cls, icon } = map[status] || map.Unpaid;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cls}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function PaidUnpaidReport() {
  const [filters, setFilters] = useState({
    eduLevel: 'Higher Secondary',
    dept: 'Science',
    className: 'HSC-Science',
    section: '2nd year',
    session: '2024-2025',
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 10;

  const handleShow = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setShown(true);
    setLoading(false);
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      SAMPLE.filter(
        (s) =>
          (statusFilter === 'All' || s.status === statusFilter) &&
          (!search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.roll.includes(search))
      ),
    [statusFilter, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const stats = useMemo(
    () => ({
      total: SAMPLE.length,
      paid: SAMPLE.filter((s) => s.status === 'Paid').length,
      unpaid: SAMPLE.filter((s) => s.status === 'Unpaid').length,
      partial: SAMPLE.filter((s) => s.status === 'Partial').length,
      totalPaid: SAMPLE.reduce((s, r) => s + r.paid, 0),
      totalDue: SAMPLE.reduce((s, r) => s + r.due, 0),
    }),
    []
  );

  const handleExcel = () => {
    const data = filtered.map((s, i) => ({
      '#': i + 1,
      'Student Name': s.name,
      Roll: s.roll,
      Class: s.class,
      Section: s.section,
      Session: s.session,
      Status: s.status,
      'Paid Amount': s.paid,
      'Due Amount': s.due,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paid-Unpaid Report');
    XLSX.writeFile(wb, 'Paid_Unpaid_Report.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Paid / Unpaid Report']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CheckCircle2 size={22} className="text-green-500" /> Paid / Unpaid
            List
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30">
            <SlidersHorizontal size={15} className="text-green-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Filter Options
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <F label="Edu. Level">
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
                value={filters.className}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, className: e.target.value }))
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
              onClick={handleShow}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Show Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats + Table */}
        {shown && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  label: 'Total Students',
                  value: stats.total,
                  cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600',
                  val: 'text-gray-800 dark:text-gray-100',
                },
                {
                  label: 'Fully Paid',
                  value: stats.paid,
                  cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
                  val: 'text-green-700 dark:text-green-400',
                },
                {
                  label: 'Unpaid',
                  value: stats.unpaid,
                  cls: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30',
                  val: 'text-red-600 dark:text-red-400',
                },
                {
                  label: 'Partial',
                  value: stats.partial,
                  cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
                  val: 'text-amber-600 dark:text-amber-400',
                },
                {
                  label: 'Total Collected',
                  value: `৳${stats.totalPaid.toLocaleString()}`,
                  cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
                  val: 'text-blue-700 dark:text-blue-400',
                },
                {
                  label: 'Total Due',
                  value: `৳${stats.totalDue.toLocaleString()}`,
                  cls: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30',
                  val: 'text-rose-600 dark:text-rose-400',
                },
              ].map((s) => (
                <div key={s.label} className={`p-4 rounded-xl border ${s.cls}`}>
                  <div className={`text-xl font-bold leading-none ${s.val}`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Payment Status Overview
                </p>
                <span className="text-xs text-gray-500">
                  {Math.round((stats.paid / stats.total) * 100)}% fully paid
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(stats.paid / stats.total) * 100}%` }}
                  title={`Paid: ${stats.paid}`}
                />
                <div
                  className="bg-amber-400 transition-all"
                  style={{ width: `${(stats.partial / stats.total) * 100}%` }}
                  title={`Partial: ${stats.partial}`}
                />
                <div
                  className="bg-red-400 transition-all"
                  style={{ width: `${(stats.unpaid / stats.total) * 100}%` }}
                  title={`Unpaid: ${stats.unpaid}`}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                {[
                  ['bg-green-500', 'Paid', stats.paid],
                  ['bg-amber-400', 'Partial', stats.partial],
                  ['bg-red-400', 'Unpaid', stats.unpaid],
                ].map(([color, label, count]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {label} ({count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Student List
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                    {filtered.length} shown
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {STATUS_OPTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setPage(1);
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statusFilter === s ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
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
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {[
                        '#',
                        'Student Name',
                        'Roll',
                        'Class',
                        'Section',
                        'Session',
                        'Status',
                        'Paid Amount',
                        'Due Amount',
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Paid Amount' || h === 'Due Amount' ? 'text-right' : ''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {paged.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-5 py-12 text-center text-sm text-gray-400"
                        >
                          No students found
                        </td>
                      </tr>
                    ) : (
                      paged.map((s, i) => (
                        <tr
                          key={s.id}
                          className={`transition-colors ${s.status === 'Unpaid' ? 'bg-red-50/30 dark:bg-red-900/5' : s.status === 'Partial' ? 'bg-amber-50/30 dark:bg-amber-900/5' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                        >
                          <td className="px-5 py-4 text-sm text-gray-400">
                            {(safePage - 1) * PER_PAGE + i + 1}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {s.name}
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                            {s.roll}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
                            {s.class}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
                            {s.section}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
                            {s.session}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={s.status} />
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                            ৳{s.paid.toLocaleString()}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span
                              className={`text-sm font-bold ${s.due > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-300 dark:text-gray-600'}`}
                            >
                              {s.due > 0 ? `৳${s.due.toLocaleString()}` : '—'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                      <td
                        colSpan={7}
                        className="px-5 py-3 text-xs font-bold text-gray-500 uppercase"
                      >
                        Total ({filtered.length} students)
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                        ৳
                        {filtered
                          .reduce((s, r) => s + r.paid, 0)
                          .toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 text-right">
                        ৳
                        {filtered
                          .reduce((s, r) => s + r.due, 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                  {Math.min(safePage * PER_PAGE, filtered.length)} of{' '}
                  {filtered.length}
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
