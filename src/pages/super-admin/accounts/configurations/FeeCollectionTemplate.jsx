import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Plus,
  Search,
  FileText,
  Layout,
  Settings,
  ChevronLeft,
  ChevronRight as CRight,
} from 'lucide-react';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
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

const SESSIONS = ['2025-2026', '2026-2027', '2027-2028'];
const PER_PAGES = [10, 25, 50, 100];

const INITIAL_TEMPLATES = [
  {
    id: 1,
    campus: 'Mohammadpur Kendriya College',
    shift: 'Day',
    medium: 'Bangla',
    className: 'HSC-Science',
    eduLevel: 'Higher Secondary',
    department: 'Science',
    session: '2025-2026',
  },
  {
    id: 2,
    campus: 'Mohammadpur Kendriya College',
    shift: 'Day',
    medium: 'Bangla',
    className: 'HSC-Humanities',
    eduLevel: 'Higher Secondary',
    department: 'Humanities',
    session: '2025-2026',
  },
  {
    id: 3,
    campus: 'Mohammadpur Kendriya College',
    shift: 'Day',
    medium: 'Bangla',
    className: 'HSC-Business',
    eduLevel: 'Higher Secondary',
    department: 'Business',
    session: '2025-2026',
  },
  {
    id: 4,
    campus: 'Mohammadpur Kendriya College',
    shift: 'Day',
    medium: 'English',
    className: 'HSC-Science',
    eduLevel: 'Higher Secondary',
    department: 'Science',
    session: '2025-2026',
  },
  {
    id: 5,
    campus: 'Mohammadpur Kendriya College',
    shift: 'Evening',
    medium: 'Bangla',
    className: 'HSC-Arts',
    eduLevel: 'Higher Secondary',
    department: 'Arts',
    session: '2024-2025',
  },
];

export default function FeeCollectionTemplate() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const handleSessionChange = (id, value) =>
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, session: value } : t))
    );

  const filtered = templates.filter(
    (t) =>
      t.campus.toLowerCase().includes(search.toLowerCase()) ||
      t.className.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.shift.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const deptColor = (dept) => {
    const m = {
      Science:
        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      Arts: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      Humanities:
        'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
      Business:
        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      Commerce:
        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    };
    return (
      m[dept] || 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Fee Collection Templates']}
          />
          <button
            onClick={() => navigate('/feeCollectionTemplate/create')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Create New
          </button>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Total Templates',
              val: templates.length,
              color:
                'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
              vc: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Active Sessions',
              val: [...new Set(templates.map((t) => t.session))].length,
              color:
                'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
              vc: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Departments',
              val: [...new Set(templates.map((t) => t.department))].length,
              color:
                'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
              vc: 'text-purple-700 dark:text-purple-400',
            },
          ].map((s) => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Table card ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                <FileText size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Fee Collection Template List
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                Show
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                >
                  {PER_PAGES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                entries
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search class, dept, shift…"
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-52"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {[
                    'SL',
                    'Campus',
                    'Shift',
                    'Medium',
                    'Class',
                    'Edu. Level',
                    'Department',
                    'Session',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      No templates found
                    </td>
                  </tr>
                ) : (
                  current.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td
                        className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 max-w-[140px] truncate"
                        title={t.campus}
                      >
                        {t.campus}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${t.shift === 'Day' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'}`}
                        >
                          {t.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {t.medium}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {t.className}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {t.eduLevel}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColor(t.department)}`}
                        >
                          {t.department}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={t.session}
                          onChange={(e) =>
                            handleSessionChange(t.id, e.target.value)
                          }
                          className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                        >
                          {SESSIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              navigate('/feeCollectionTemplate/template')
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Layout size={12} /> Templates
                          </button>
                          <button
                            onClick={() =>
                              navigate('/feeCollectionTemplate/allocations')
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <Settings size={12} /> Allocations
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}{' '}
              entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '…' ? (
                    <span
                      key={`e${idx}`}
                      className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                      ${p === page ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
