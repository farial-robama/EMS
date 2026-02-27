// ═══════════════════════════════════════════════════════
// MonthlyFeeReport.jsx  (Manual Payment List)
// ═══════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileText,
  Download,
  Printer,
  SlidersHorizontal,
  Search,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Users,
  Calendar,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const ALL_PAYMENTS = [
  {
    paymentDate: 'August, 2025',
    amount: 100,
    name: 'MD. TANJIM KHAN',
    studentId: '2414030040167',
    roll: '1202425011175',
    className: 'HSC-Humanities',
    section: '2nd Year',
    session: '2024-2025',
  },
  {
    paymentDate: 'August, 2025',
    amount: 100,
    name: 'Mahbubur Rahman',
    studentId: '2314030040001',
    roll: '1202324011281',
    className: 'HSC-Humanities',
    section: '2nd Year',
    session: '2023-2024',
  },
  {
    paymentDate: 'August, 2025',
    amount: 100,
    name: 'Sahadat Hossain Adnan',
    studentId: '2314010030001',
    roll: '1202324033006',
    className: 'HSC-Science',
    section: '2nd Year',
    session: '2023-2024',
  },
  {
    paymentDate: 'August, 2025',
    amount: 19950,
    name: 'FOZLE RABBY PRANTO',
    studentId: '192199990610052',
    roll: '7201920020053',
    className: 'CSE',
    section: '4th Year',
    session: '2019-2020',
  },
  {
    paymentDate: 'September, 2025',
    amount: 12000,
    name: 'SADIA AKTER',
    studentId: '2414020030088',
    roll: '1202425022088',
    className: 'HSC-Science',
    section: '1st Year',
    session: '2024-2025',
  },
  {
    paymentDate: 'September, 2025',
    amount: 8500,
    name: 'RAFIQ HOSSAIN',
    studentId: '2314010030055',
    roll: '1202324033055',
    className: 'HSC-Arts',
    section: '2nd Year',
    session: '2023-2024',
  },
  {
    paymentDate: 'October, 2025',
    amount: 15000,
    name: 'JANNAT UL FERDOUS',
    studentId: '2514050030100',
    roll: '1202526055100',
    className: 'Honours',
    section: '1st Year',
    session: '2025-2026',
  },
  {
    paymentDate: 'October, 2025',
    amount: 22000,
    name: 'ABDUR RAHMAN SARKER',
    studentId: '2214090030012',
    roll: '7202223090012',
    className: 'CSE',
    section: '3rd Year',
    session: '2022-2023',
  },
];

const MONTHS_LIST = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const YEARS_LIST = ['2025', '2024', '2023'];

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

export function MonthlyFeeReport() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('August');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(
    () =>
      ALL_PAYMENTS.filter(
        (p) =>
          p.paymentDate.includes(month) &&
          p.paymentDate.includes(year) &&
          (!search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.studentId.includes(search))
      ),
    [month, year, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p, i) => ({
        '#': i + 1,
        'Payment Date': p.paymentDate,
        'Paid Amount': p.amount,
        'Student Name': p.name,
        'Student ID': p.studentId,
        Roll: p.roll,
        Class: p.className,
        Section: p.section,
        Session: p.session,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Payments');
    XLSX.writeFile(wb, `Manual_Payment_${month}_${year}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Monthly Fee Report']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar size={22} className="text-blue-500" /> Monthly Fee Report
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Period Selection
            </span>
          </div>
          <div className="p-5 flex flex-wrap items-end gap-4">
            <div className="w-40">
              <F label="Select Year">
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  className={inp}
                >
                  {YEARS_LIST.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </F>
            </div>
            <div className="w-48">
              <F label="Select Month">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setPage(1);
                  }}
                  className={inp}
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </F>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Payments',
              value: filtered.length,
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              val: 'text-blue-700 dark:text-blue-400',
              ic: 'bg-blue-100 dark:bg-blue-900 text-blue-600',
            },
            {
              label: 'Total Amount',
              value: `৳${totalAmount.toLocaleString()}`,
              cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
              val: 'text-green-700 dark:text-green-400',
              ic: 'bg-green-100 dark:bg-green-900 text-green-600',
            },
            {
              label: 'Period',
              value: `${month}, ${year}`,
              cls: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30',
              val: 'text-purple-700 dark:text-purple-400',
              ic: 'bg-purple-100 dark:bg-purple-900 text-purple-600',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <DollarSign size={16} />
              </div>
              <div>
                <div className={`text-xl font-bold leading-none ${s.val}`}>
                  {s.value}
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
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Payment Records — {month} {year}
            </span>
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
                  placeholder="Search name or ID…"
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
                    'Payment Date',
                    'Paid Amount',
                    'Student Name',
                    'Student ID',
                    'Student Roll',
                    'Class',
                    'Section',
                    'Session',
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Paid Amount' ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center">
                      <Calendar
                        size={32}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400">
                        No payments found for {month}, {year}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400">
                        {(safePage - 1) * PER_PAGE + i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-medium">
                          {p.paymentDate}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                        ৳{p.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {p.name}
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {p.studentId}
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {p.roll}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">
                          {p.className}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {p.section}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {p.session}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {paged.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                    <td
                      colSpan={2}
                      className="px-5 py-3 text-xs font-bold text-gray-500 uppercase"
                    >
                      Total ({filtered.length})
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                      ৳{totalAmount.toLocaleString()}
                    </td>
                    <td colSpan={6} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
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
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════
// MonthlyBalanceSheet.jsx
// ═══════════════════════════════════════════════════════
const BALANCE_DATA = [
  {
    group: 'SESSION FEE',
    items: [
      {
        head: 'Electricity, Water & Gas',
        previous: 0,
        income: 44050,
        expenditure: 0,
      },
      { head: 'Library Charges', previous: 875, income: 0, expenditure: 0 },
      {
        head: 'Education Benevolent/Poor Fund',
        previous: 875,
        income: 0,
        expenditure: 0,
      },
    ],
  },
  {
    group: 'SEMESTER FEE',
    items: [
      { head: 'Semester Fee-1', previous: 0, income: 99500, expenditure: 0 },
      { head: 'Semester Fee-2', previous: 0, income: 0, expenditure: 0 },
      { head: 'Semester Fee-3', previous: 0, income: 45000, expenditure: 0 },
    ],
  },
  {
    group: 'TUITION FEE',
    items: [
      {
        head: 'Monthly Tuition',
        previous: 12000,
        income: 240000,
        expenditure: 0,
      },
      { head: 'Admission Fee', previous: 0, income: 85000, expenditure: 0 },
      {
        head: 'Re-admission Fee',
        previous: 2000,
        income: 15000,
        expenditure: 0,
      },
    ],
  },
  {
    group: 'EXAM FEE',
    items: [
      { head: 'Examination Fee', previous: 0, income: 120000, expenditure: 0 },
      { head: 'Practical Fee', previous: 0, income: 35000, expenditure: 0 },
      { head: 'Exam Center Fee', previous: 0, income: 22000, expenditure: 0 },
    ],
  },
];

const MONTHS_OPT = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const YEARS_OPT = ['2025', '2024', '2023'];

export function MonthlyBalanceSheet() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('December');
  const [expanded, setExpanded] = useState({});
  const [shown, setShown] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleShow = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setShown(true);
    setLoading(false);
  };

  const handleExcel = () => {
    const data = BALANCE_DATA.flatMap((g) =>
      g.items.map((r) => ({
        Group: g.group,
        'Transaction Head': r.head,
        'Previous Balance': r.previous,
        Income: r.income,
        Balance: r.previous + r.income,
        Expenditure: r.expenditure,
        'Net Balance': r.previous + r.income - r.expenditure,
      }))
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');
    XLSX.writeFile(wb, `Monthly_Balance_Sheet_${month}_${year}.xlsx`);
  };

  const grandTotals = BALANCE_DATA.flatMap((g) => g.items).reduce(
    (acc, r) => ({
      previous: acc.previous + r.previous,
      income: acc.income + r.income,
      balance: acc.balance + r.previous + r.income,
      expenditure: acc.expenditure + r.expenditure,
      net: acc.net + r.previous + r.income - r.expenditure,
    }),
    { previous: 0, income: 0, balance: 0, expenditure: 0, net: 0 }
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Monthly Balance Sheet']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-teal-500" /> Monthly Balance
            Sheet
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-teal-50 dark:bg-teal-900/10 border-b border-teal-100 dark:border-teal-900/30">
            <SlidersHorizontal size={15} className="text-teal-500" />
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
              Period Selection
            </span>
          </div>
          <div className="p-5 flex flex-wrap items-end gap-4">
            <div className="w-40">
              <F label="Year *">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inp}
                >
                  {YEARS_OPT.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </F>
            </div>
            <div className="w-48">
              <F label="Month">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className={inp}
                >
                  {MONTHS_OPT.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </F>
            </div>
            <button
              onClick={handleShow}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                'Show Balance'
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {shown && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  label: 'Previous Balance',
                  value: grandTotals.previous,
                  cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600',
                  val: 'text-gray-700 dark:text-gray-300',
                },
                {
                  label: 'Total Income',
                  value: grandTotals.income,
                  cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
                  val: 'text-blue-700 dark:text-blue-400',
                },
                {
                  label: 'Balance',
                  value: grandTotals.balance,
                  cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30',
                  val: 'text-indigo-700 dark:text-indigo-400',
                },
                {
                  label: 'Expenditure',
                  value: grandTotals.expenditure,
                  cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
                  val: 'text-amber-600 dark:text-amber-400',
                },
                {
                  label: 'Net Balance',
                  value: grandTotals.net,
                  cls: 'bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900/30',
                  val: 'text-teal-700 dark:text-teal-400',
                },
              ].map((s) => (
                <div key={s.label} className={`p-4 rounded-xl border ${s.cls}`}>
                  <div className={`text-lg font-bold leading-none ${s.val}`}>
                    ৳{s.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Balance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Balance Sheet — {month}, {year}
                </p>
                <div className="flex gap-2">
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
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {[
                        'Transaction Head',
                        'Previous Balance',
                        'Income',
                        'Balance',
                        'Expenditure',
                        'Net Balance',
                      ].map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${i === 0 ? 'text-left' : 'text-right'} whitespace-nowrap`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BALANCE_DATA.map((group) => {
                      const gt = group.items.reduce(
                        (a, r) => ({
                          previous: a.previous + r.previous,
                          income: a.income + r.income,
                          balance: a.balance + r.previous + r.income,
                          expenditure: a.expenditure + r.expenditure,
                          net: a.net + r.previous + r.income - r.expenditure,
                        }),
                        {
                          previous: 0,
                          income: 0,
                          balance: 0,
                          expenditure: 0,
                          net: 0,
                        }
                      );
                      const isOpen = !expanded[group.group];
                      return (
                        <React.Fragment key={group.group}>
                          {/* Group header row */}
                          <tr
                            className="bg-teal-50/50 dark:bg-teal-900/10 border-b border-teal-100 dark:border-teal-900/20 cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                            onClick={() =>
                              setExpanded((p) => ({
                                ...p,
                                [group.group]: !p[group.group],
                              }))
                            }
                          >
                            <td className="px-5 py-3.5 text-sm font-bold text-teal-700 dark:text-teal-400">
                              <span className="flex items-center gap-2">
                                <span
                                  className={`transition-transform duration-200 text-teal-500 ${isOpen ? 'rotate-90' : ''}`}
                                >
                                  ▶
                                </span>
                                {group.group}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                              {gt.previous.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                              {gt.income.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 text-right">
                              {gt.balance.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-amber-600 dark:text-amber-400 text-right">
                              {gt.expenditure.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-bold text-teal-700 dark:text-teal-400 text-right">
                              {gt.net.toLocaleString()}
                            </td>
                          </tr>
                          {/* Child rows */}
                          {isOpen &&
                            group.items.map((item, j) => (
                              <tr
                                key={j}
                                className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors border-b border-gray-50 dark:border-gray-700/50"
                              >
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 pl-10 before:content-['└'] before:mr-2 before:text-gray-300 dark:before:text-gray-600">
                                  {item.head}
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {item.previous.toLocaleString()}
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {item.income.toLocaleString()}
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {(
                                    item.previous + item.income
                                  ).toLocaleString()}
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {item.expenditure.toLocaleString()}
                                </td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                                  {(
                                    item.previous +
                                    item.income -
                                    item.expenditure
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-teal-50 dark:bg-teal-900/20 border-t-2 border-teal-200 dark:border-teal-900/50">
                      <td className="px-5 py-4 text-sm font-bold text-teal-700 dark:text-teal-400">
                        Grand Total
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">
                        {grandTotals.previous.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-blue-700 dark:text-blue-400 text-right">
                        {grandTotals.income.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-indigo-700 dark:text-indigo-400 text-right">
                        {grandTotals.balance.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-amber-600 dark:text-amber-400 text-right">
                        {grandTotals.expenditure.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-teal-700 dark:text-teal-400 text-right">
                        {grandTotals.net.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MonthlyFeeReport;
