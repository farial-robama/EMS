import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  BarChart2,
  ChevronRight,
  ChevronLeft,
  Download,
  Printer,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Search,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

/* ─── Sample Data ─── */
const MONTHLY_STATS = [
  { month: 'Jan', manual: 3200000, online: 420000, target: 4000000 },
  { month: 'Feb', manual: 2800000, online: 380000, target: 4000000 },
  { month: 'Mar', manual: 3600000, online: 510000, target: 4000000 },
  { month: 'Apr', manual: 4100000, online: 620000, target: 4500000 },
  { month: 'May', manual: 3900000, online: 590000, target: 4500000 },
  { month: 'Jun', manual: 2100000, online: 280000, target: 3500000 },
  { month: 'Jul', manual: 1800000, online: 210000, target: 3500000 },
  { month: 'Aug', manual: 42006075, online: 0, target: 45000000 },
  { month: 'Sep', manual: 43851885, online: 0, target: 45000000 },
  { month: 'Oct', manual: 13361210, online: 0, target: 20000000 },
  { month: 'Nov', manual: 18436835, online: 0, target: 20000000 },
  { month: 'Dec', manual: 9861550, online: 0, target: 15000000 },
];

const PURPOSE_BREAKDOWN = [
  { purpose: 'Tuition Fee', amount: 68400000, color: 'bg-blue-500', pct: 48 },
  { purpose: 'Session Fee', amount: 24500000, color: 'bg-indigo-500', pct: 17 },
  { purpose: 'Exam Fee', amount: 18200000, color: 'bg-violet-500', pct: 13 },
  {
    purpose: 'Semester Fee',
    amount: 14300000,
    color: 'bg-purple-500',
    pct: 10,
  },
  { purpose: 'Library Charges', amount: 7100000, color: 'bg-pink-500', pct: 5 },
  { purpose: 'Other Fees', amount: 9600000, color: 'bg-rose-400', pct: 7 },
];

const RECENT_TRANSACTIONS = [
  {
    id: 'INC-13045',
    student: 'Abu Rayhan',
    class: 'Geography (Hons) 1st Yr',
    amount: 17350,
    date: '26-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
  {
    id: 'INC-13044',
    student: 'Sijan Ahmed',
    class: 'Management (Hons) 2nd Yr',
    amount: 11300,
    date: '26-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
  {
    id: 'INC-13043',
    student: 'Rafi Uddin',
    class: 'English (Hons) 3rd Yr',
    amount: 2000,
    date: '25-12-2025',
    method: 'Online',
    status: 'Pending',
  },
  {
    id: 'INC-13042',
    student: 'Fatema Khatun',
    class: 'History (Hons) 1st Yr',
    amount: 500,
    date: '25-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
  {
    id: 'INC-13041',
    student: 'Karim Uddin',
    class: 'HSC-Science 2nd Yr',
    amount: 7500,
    date: '24-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
  {
    id: 'INC-13040',
    student: 'Nasim Hossain',
    class: 'HSC-Arts 1st Yr',
    amount: 5200,
    date: '24-12-2025',
    method: 'Online',
    status: 'Failed',
  },
  {
    id: 'INC-13039',
    student: 'Salma Begum',
    class: 'BBA 3rd Yr',
    amount: 12000,
    date: '23-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
  {
    id: 'INC-13038',
    student: 'Rahim Sarker',
    class: 'CSE 2nd Yr',
    amount: 19950,
    date: '23-12-2025',
    method: 'Manual',
    status: 'Paid',
  },
];

const DEPT_BREAKDOWN = [
  {
    dept: 'Higher Secondary',
    students: 3240,
    collected: 54200000,
    due: 8100000,
  },
  { dept: 'Degree (Pass)', students: 1820, collected: 28400000, due: 4200000 },
  { dept: 'Honours', students: 2410, collected: 38600000, due: 5800000 },
  { dept: 'Masters', students: 480, collected: 9800000, due: 1200000 },
];

const YEARS = ['2025', '2024', '2023'];
const MONTHS = [
  'All',
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

const fmt = (n) =>
  '৳' +
  (n >= 10000000
    ? (n / 10000000).toFixed(2) + ' Cr'
    : n >= 100000
      ? (n / 100000).toFixed(1) + 'L'
      : n.toLocaleString());
const fmtFull = (n) => '৳' + n.toLocaleString();

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

/* Mini Bar Chart */
function MiniBarChart({ data, maxVal }) {
  return (
    <div className="flex items-end gap-0.5 h-14">
      {data.map((d, i) => {
        const h = Math.round((d.manual / maxVal) * 100);
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 group relative"
          >
            <div
              className="w-full rounded-sm bg-blue-500 dark:bg-blue-400 opacity-80 hover:opacity-100 transition-all"
              style={{ height: `${h}%`, minHeight: 2 }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* Status badge */
const StatusBadge = ({ status }) => {
  const map = {
    Paid: {
      cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      icon: <CheckCircle2 size={11} />,
    },
    Pending: {
      cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      icon: <Clock size={11} />,
    },
    Failed: {
      cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      icon: <XCircle size={11} />,
    },
  };
  const { cls, icon } = map[status] || map.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cls}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function TotalCollection() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filteredMonths = useMemo(
    () =>
      month === 'All'
        ? MONTHLY_STATS
        : MONTHLY_STATS.filter((_, i) => MONTHS.indexOf(month) - 1 === i),
    [month]
  );

  const totalManual = MONTHLY_STATS.reduce((s, r) => s + r.manual, 0);
  const totalOnline = MONTHLY_STATS.reduce((s, r) => s + r.online, 0);
  const totalAll = totalManual + totalOnline;
  const totalStudents = DEPT_BREAKDOWN.reduce((s, d) => s + d.students, 0);
  const totalDue = DEPT_BREAKDOWN.reduce((s, d) => s + d.due, 0);
  const maxMonthly = Math.max(...MONTHLY_STATS.map((r) => r.manual));

  const filteredTxn = RECENT_TRANSACTIONS.filter(
    (t) =>
      !search ||
      t.student.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredTxn.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedTxn = filteredTxn.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const handleExcel = () => {
    const data = MONTHLY_STATS.map((r) => ({
      Month: r.month,
      Manual: r.manual,
      Online: r.online,
      Total: r.manual + r.online,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Total Collection');
    XLSX.writeFile(wb, `Total_Collection_${year}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Accounts', 'Total Collection']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart2 size={22} className="text-blue-500" /> Total Collection
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Mohammadpur Kendriya College — Financial Year {year}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
            >
              {YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={handleExcel}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-xl transition-colors"
            >
              <Download size={14} /> Excel
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Collected',
              value: fmt(totalAll),
              sub: `Full Year ${year}`,
              icon: <DollarSign size={18} />,
              trend: '+12.4%',
              up: true,
              grad: 'from-blue-500 to-blue-600',
              light: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Manual Payments',
              value: fmt(totalManual),
              sub: `${((totalManual / totalAll) * 100).toFixed(1)}% of total`,
              icon: <CreditCard size={18} />,
              trend: '+8.1%',
              up: true,
              grad: 'from-indigo-500 to-indigo-600',
              light: 'bg-indigo-50 dark:bg-indigo-900/20',
              ic: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300',
            },
            {
              label: 'Total Students',
              value: totalStudents.toLocaleString(),
              sub: 'Enrolled this year',
              icon: <Users size={18} />,
              trend: '+3.2%',
              up: true,
              grad: 'from-violet-500 to-violet-600',
              light: 'bg-violet-50 dark:bg-violet-900/20',
              ic: 'bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300',
            },
            {
              label: 'Outstanding Dues',
              value: fmt(totalDue),
              sub: 'Pending collection',
              icon: <AlertCircle size={18} />,
              trend: '-5.6%',
              up: false,
              grad: 'from-rose-500 to-rose-600',
              light: 'bg-rose-50 dark:bg-rose-900/20',
              ic: 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300',
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden p-5 rounded-2xl border border-gray-100 dark:border-gray-700 ${card.light} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.ic}`}
                >
                  {card.icon}
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-lg ${card.up ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
                >
                  {card.up ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none mb-1">
                {card.value}
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Chart + Purpose Breakdown ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Monthly Collection
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Year {year} — Manual payments
                </p>
              </div>
              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-medium">
                {fmt(totalAll)} total
              </span>
            </div>
            {/* Bar chart */}
            <div className="relative">
              <div className="flex items-end gap-1 h-36">
                {MONTHLY_STATS.map((d, i) => {
                  const h = Math.max(
                    4,
                    Math.round((d.manual / maxMonthly) * 100)
                  );
                  const isSelected = MONTHS.indexOf(month) - 1 === i;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                      onClick={() => setMonth(MONTHS[i + 1])}
                    >
                      <div className="relative w-full">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center z-10">
                          <div className="bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-xl">
                            {d.month}: {fmt(d.manual)}
                          </div>
                          <div className="w-1.5 h-1.5 bg-gray-800 dark:bg-gray-900 rotate-45 -mt-0.5" />
                        </div>
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 ${isSelected ? 'bg-blue-600' : 'bg-blue-400/70 dark:bg-blue-500/60 hover:bg-blue-500'}`}
                          style={{
                            height: `${h}%`,
                            minHeight: 4,
                            maxHeight: 144,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 h-36 flex flex-col justify-between pointer-events-none pr-1">
                {[maxMonthly, maxMonthly * 0.5, 0].map((v) => (
                  <span
                    key={v}
                    className="text-[9px] text-gray-300 dark:text-gray-600"
                  >
                    {fmt(v)}
                  </span>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Manual
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Purpose Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Collection by Purpose
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Category breakdown
              </p>
            </div>
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
              {PURPOSE_BREAKDOWN.map((p) => (
                <div
                  key={p.purpose}
                  className={`${p.color} transition-all`}
                  style={{ width: `${p.pct}%` }}
                  title={`${p.purpose}: ${p.pct}%`}
                />
              ))}
            </div>
            <div className="space-y-3">
              {PURPOSE_BREAKDOWN.map((p) => (
                <div
                  key={p.purpose}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${p.color}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {p.purpose}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                      {fmt(p.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Department Breakdown ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Users size={15} className="text-violet-500" /> Department-wise
              Summary
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    'Department',
                    'Enrolled Students',
                    'Total Collected',
                    'Outstanding Due',
                    'Collection Rate',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {DEPT_BREAKDOWN.map((d) => {
                  const rate = Math.round(
                    (d.collected / (d.collected + d.due)) * 100
                  );
                  return (
                    <tr
                      key={d.dept}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {d.dept}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {d.students.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400">
                        {fmtFull(d.collected)}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-red-500 dark:text-red-400">
                        {fmtFull(d.due)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-9">
                            {rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${rate >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : rate >= 75 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
                        >
                          {rate >= 90 ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <AlertCircle size={11} />
                          )}
                          {rate >= 90
                            ? 'Excellent'
                            : rate >= 75
                              ? 'On Track'
                              : 'Behind'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                  <td className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">
                    Grand Total
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totalStudents.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                    {fmtFull(
                      DEPT_BREAKDOWN.reduce((s, d) => s + d.collected, 0)
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-red-500 dark:text-red-400">
                    {fmtFull(totalDue)}
                  </td>
                  <td className="px-5 py-3" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ─── Monthly Collection Table ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Calendar size={15} className="text-blue-500" /> Monthly Breakdown
              — {year}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-r border-gray-100 dark:border-gray-700">
                    Month
                  </th>
                  <th
                    colSpan={2}
                    className="px-5 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-r border-gray-100 dark:border-gray-700 border-b border-gray-100 dark:border-gray-700"
                  >
                    Quantity
                  </th>
                  <th
                    colSpan={3}
                    className="px-5 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Amount (৳)
                  </th>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-5 py-2.5 border-r border-gray-100 dark:border-gray-700" />
                  {['Manual', 'Online', 'Manual', 'Online', 'Total'].map(
                    (h, i) => (
                      <th
                        key={i}
                        className={`px-5 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 ${i === 1 ? 'border-r border-gray-100 dark:border-gray-700' : ''}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {MONTHLY_STATS.map((row, i) => {
                  const isSelected = MONTHS.indexOf(month) - 1 === i;
                  return (
                    <tr
                      key={i}
                      className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                      onClick={() => setMonth(MONTHS[i + 1])}
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 border-r border-gray-100 dark:border-gray-700">
                        {row.month}
                        {isSelected && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(row.manual / 5000).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700">
                        {Math.round(row.online / 5000)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.manual.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.online.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400">
                        {(row.manual + row.online).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                  <td className="px-5 py-3 text-xs font-bold text-gray-500 uppercase border-r border-gray-100 dark:border-gray-700">
                    Grand Total
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {MONTHLY_STATS.reduce(
                      (s, r) => s + Math.round(r.manual / 5000),
                      0
                    ).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700">
                    {MONTHLY_STATS.reduce(
                      (s, r) => s + Math.round(r.online / 5000),
                      0
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totalManual.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totalOnline.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                    {totalAll.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ─── Recent Transactions ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FileText size={15} className="text-indigo-500" /> Recent
              Transactions
            </p>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                placeholder="Search student or invoice…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-52 transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    'Invoice No',
                    'Student',
                    'Class',
                    'Amount',
                    'Date',
                    'Method',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {pagedTxn.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">
                        {t.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {t.student}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                      {t.class}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-100">
                      {fmtFull(t.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                      {t.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${t.method === 'Online' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                      >
                        {t.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing{' '}
              {filteredTxn.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
              {Math.min(safePage * PER_PAGE, filteredTxn.length)} of{' '}
              {filteredTxn.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all"
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
