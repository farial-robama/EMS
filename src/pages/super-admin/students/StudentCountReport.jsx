import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Printer,
  BarChart3,
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  RefreshCw,
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

/* ── Select Component ─────────────────────────────────────────────────────── */
const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 min-w-[160px]">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

/* ── Data ─────────────────────────────────────────────────────────────────── */
const ALL_DATA = {
  'HSC-Science': {
    detailed: [
      { shift: 'Day', version: 'Bangla', class: 'HSC-Science', group: 'Science', section: '1st Year', boys: 36, girls: 29, total: 65 },
      { shift: 'Day', version: 'Bangla', class: 'HSC-Science', group: 'Science', section: '1st Year (A)', boys: 45, girls: 0, total: 45 },
      { shift: 'Day', version: 'English', class: 'HSC-Science', group: 'Science', section: '2nd Year', boys: 30, girls: 22, total: 52 },
      { shift: 'Evening', version: 'Bangla', class: 'HSC-Science', group: 'Science', section: '1st Year', boys: 28, girls: 17, total: 45 },
    ],
    summary: [
      { shiftVersion: 'Day-Bangla', boys: 81, girls: 29, total: 110 },
      { shiftVersion: 'Day-English', boys: 30, girls: 22, total: 52 },
      { shiftVersion: 'Evening-Bangla', boys: 28, girls: 17, total: 45 },
    ],
  },
  'HSC-Arts': {
    detailed: [
      { shift: 'Day', version: 'Bangla', class: 'HSC-Arts', group: 'Arts', section: '1st Year', boys: 20, girls: 40, total: 60 },
      { shift: 'Day', version: 'Bangla', class: 'HSC-Arts', group: 'Arts', section: '2nd Year', boys: 18, girls: 35, total: 53 },
    ],
    summary: [
      { shiftVersion: 'Day-Bangla', boys: 38, girls: 75, total: 113 },
    ],
  },
};

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function StudentCountReport() {
  const [filters, setFilters] = useState({ session: '2025-2026', className: 'HSC-Science' });
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = ALL_DATA[filters.className] || ALL_DATA['HSC-Science'];

  const totals = useMemo(() => ({
    boys: data.detailed.reduce((s, r) => s + r.boys, 0),
    girls: data.detailed.reduce((s, r) => s + r.girls, 0),
    total: data.detailed.reduce((s, r) => s + r.total, 0),
  }), [data]);

  const handleShow = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setShowReport(true);
  };

  const handlePrint = () => window.print();

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Student Count Report']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Student Count Report
            </h1>
          </div>
          {showReport && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0 print:hidden"
            >
              <Printer size={15} /> Print Report
            </button>
          )}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Filter size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</span>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField
              label="Session"
              value={filters.session}
              onChange={(v) => { setFilters((p) => ({ ...p, session: v })); setShowReport(false); }}
              options={[
                { value: '2025-2026', label: '2025-2026' },
                { value: '2026-2027', label: '2026-2027' },
                { value: '2024-2025', label: '2024-2025' },
              ]}
            />
            <SelectField
              label="Class"
              value={filters.className}
              onChange={(v) => { setFilters((p) => ({ ...p, className: v })); setShowReport(false); }}
              options={[
                { value: 'HSC-Science', label: 'HSC-Science' },
                { value: 'HSC-Arts', label: 'HSC-Arts' },
              ]}
            />
            <button
              onClick={handleShow}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {loading ? 'Loading…' : 'Show Report'}
            </button>
          </div>
        </div>

        {/* Stats — shown when report is loaded */}
        {showReport && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Students', value: totals.total, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
                { label: 'Total Boys', value: totals.boys, bg: 'bg-indigo-50 dark:bg-indigo-900/20', ic: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300', Icon: UserCheck },
                { label: 'Total Girls', value: totals.girls, bg: 'bg-pink-50 dark:bg-pink-900/20', ic: 'bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-300', Icon: UserX },
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

            {/* Institute Header (print-visible) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex flex-col items-center py-5 px-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Student Count Report — {filters.className} — Session: {filters.session}
                </h3>
              </div>

              {/* Detailed Table */}
              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    Detailed Summary — {filters.className}
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-600">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          {['Shift', 'Version', 'Class', 'Group', 'Section', 'Boys', 'Girls', 'Total'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {data.detailed.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.shift}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.version}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.class}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.group}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{row.section}</td>
                            <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{row.boys}</td>
                            <td className="px-4 py-3 text-pink-600 dark:text-pink-400 font-semibold">{row.girls}</td>
                            <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-bold">{row.total}</td>
                          </tr>
                        ))}
                        <tr className="bg-amber-50 dark:bg-amber-900/20 font-semibold">
                          <td colSpan={5} className="px-4 py-3 text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wide">
                            Total for ({data.detailed[0]?.shift}-{data.detailed[0]?.version})
                          </td>
                          <td className="px-4 py-3 text-indigo-700 dark:text-indigo-300">{totals.boys}</td>
                          <td className="px-4 py-3 text-pink-700 dark:text-pink-300">{totals.girls}</td>
                          <td className="px-4 py-3 text-blue-700 dark:text-blue-300">{totals.total}</td>
                        </tr>
                        <tr className="bg-blue-600 text-white font-bold">
                          <td colSpan={5} className="px-4 py-3 text-xs uppercase tracking-wide">Grand Total</td>
                          <td className="px-4 py-3">{totals.boys}</td>
                          <td className="px-4 py-3">{totals.girls}</td>
                          <td className="px-4 py-3">{totals.total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Table */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                    Shift & Version Summary — {filters.className}
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-600">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          {['Shift & Version', 'Boys', 'Girls', 'Total'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {data.summary.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                                {row.shiftVersion}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{row.boys}</td>
                            <td className="px-4 py-3 text-pink-600 dark:text-pink-400 font-semibold">{row.girls}</td>
                            <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-bold">{row.total}</td>
                          </tr>
                        ))}
                        <tr className="bg-blue-600 text-white font-bold">
                          <td className="px-4 py-3 text-xs uppercase tracking-wide">Total</td>
                          <td className="px-4 py-3">{totals.boys}</td>
                          <td className="px-4 py-3">{totals.girls}</td>
                          <td className="px-4 py-3">{totals.total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty state before Show is clicked */}
        {!showReport && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm py-16 text-center">
            <BarChart3 size={40} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Select filters and click <strong>Show Report</strong> to view data.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}