import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Receipt,
  BarChart3,
  CheckCircle2,
  XCircle,
  BookOpen,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const admissionEvents = [
  {
    sl: 1,
    id: 101,
    title: 'Degree Admission | Session 2024–2025 (BA • BSS • BBS)',
    educationLevel: 'Degree (Pass)',
    session: '2024-2025',
    status: 'Active',
  },
  {
    sl: 2,
    id: 102,
    title: 'Professional Programs Admission | Session 2024–2025 (BBA • CSE • THM)',
    educationLevel: 'Professional',
    session: '2024-2025',
    status: 'Active',
  },
  {
    sl: 3,
    id: 103,
    title: 'Masters- Preliminary (Private)- 2022-2023',
    educationLevel: 'Preliminary Masters (Private)',
    session: '2022-2023',
    status: 'Active',
  },
  {
    sl: 4,
    id: 104,
    title: "Master's Preliminary 2022-2023",
    educationLevel: 'Preliminary Masters',
    session: '2022-2023',
    status: 'Inactive',
  },
];

const PAGE_SIZES = [10, 25, 50];

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
          <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
        )}
      </React.Fragment>
    ))}
  </nav>
);

const AdmissionPaymentReport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      admissionEvents.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.educationLevel.toLowerCase().includes(search.toLowerCase()) ||
          item.session.includes(search)
      ),
    [search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const activeCount = admissionEvents.filter((e) => e.status === 'Active').length;
  const inactiveCount = admissionEvents.filter((e) => e.status === 'Inactive').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Reports', 'Admission Payment Report']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Receipt size={22} className="text-indigo-500" /> Admission Payment Report
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Events',
              value: admissionEvents.length,
              bg: 'bg-indigo-50 dark:bg-indigo-900/20',
              ic: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300',
              Icon: BookOpen,
            },
            {
              label: 'Active Events',
              value: activeCount,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
              Icon: CheckCircle2,
            },
            {
              label: 'Inactive Events',
              value: inactiveCount,
              bg: 'bg-red-50 dark:bg-red-900/20',
              ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
              Icon: XCircle,
            },
            {
              label: 'Sessions',
              value: [...new Set(admissionEvents.map((e) => e.session))].length,
              bg: 'bg-amber-50 dark:bg-amber-900/20',
              ic: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300',
              Icon: BarChart3,
            },
          ].map(({ label, value, bg, ic, Icon }) => (
            <div
              key={label}
              className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${bg}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}>
                <Icon size={16} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white leading-none">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 px-5 py-4 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            <SlidersHorizontal size={15} className="text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              Event List
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Show
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
              entries
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search events..."
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['SL', 'Title', 'Education Level', 'Session', 'Status', 'Action'].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Action' ? 'text-center' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Event was not found!</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500">{item.sl}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-800 dark:text-gray-200 max-w-xs">
                        <span className="line-clamp-2">{item.title}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg whitespace-nowrap">
                          {item.educationLevel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg">
                          {item.session}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            item.status === 'Active'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admissionPaymentReport/paymentSummary/${item.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <BarChart3 size={12} /> Payment Summary
                          </button>
                          <button
                            onClick={() => navigate(`/admissionPaymentReport/transactionHead/${item.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 hover:bg-purple-100 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <FileText size={12} /> Transaction Head
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    page === p
                      ? 'bg-indigo-600 text-white border border-indigo-600'
                      : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdmissionPaymentReport;