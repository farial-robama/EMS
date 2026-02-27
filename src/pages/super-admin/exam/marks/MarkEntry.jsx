import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  ChevronRight,
  Eye,
  BarChart2,
  SlidersHorizontal,
  RefreshCw,
  BookOpen,
  Filter,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const MARK_ROWS = [
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Primary',
    dept: 'Default',
    className: 'Four',
    exam: 'Annual Examination - 2025',
    session: '2025',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Pre-Primary',
    dept: 'Default',
    className: 'KG',
    exam: 'Yearly Exam-2025',
    session: '2025',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Primary',
    dept: 'Default',
    className: 'One',
    exam: 'Yearly Exam-2025',
    session: '2025',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Primary',
    dept: 'Default',
    className: 'Two',
    exam: 'Yearly Examination (2025)',
    session: '2025',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Nine-Ten',
    dept: 'Science',
    className: 'Nine (Science)',
    exam: 'Annual Examination - 2025',
    session: '2025-2026',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Six-Eight',
    dept: 'Default',
    className: 'Six',
    exam: 'Half-Yearly Examination',
    session: '2025',
  },
  {
    shift: 'Day',
    medium: 'Bangla',
    edu: 'Higher Secondary',
    dept: 'Science',
    className: 'HSC Science',
    exam: 'Pre-Test Examination 2025',
    session: '2025-2026',
  },
];

const EDU_LEVELS = [
  'Pre-Primary',
  'Primary',
  'Six-Eight',
  'Nine-Ten',
  'Higher Secondary',
];
const DEPARTMENTS = [
  'Default',
  'Science',
  'Business Studies Group',
  'Humanities Group',
];
const CLASSES = [
  'KG',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine (Science)',
  'Ten (Science)',
  'Nine (Business Studies)',
  'HSC Science',
];

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

export default function MarkEntry() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ edu: '', dept: '', className: '' });
  const [showExams, setShowExams] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key, val) => {
    setFilters((p) => ({ ...p, [key]: val }));
    setShowExams(false);
  };

  const loadExam = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setShowExams(true);
  };

  const filteredRows = useMemo(
    () =>
      MARK_ROWS.filter(
        (row) =>
          (!filters.edu || row.edu === filters.edu) &&
          (!filters.dept || row.dept === filters.dept) &&
          (!filters.className || row.className === filters.className)
      ),
    [filters]
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Exam & Result', 'Mark Entry', 'Marks List']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ClipboardList size={22} className="text-blue-500" /> Marks Section
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Filter Exams
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <F label="Education Level">
              <select
                value={filters.edu}
                onChange={(e) => handleFilterChange('edu', e.target.value)}
                className={inp}
              >
                <option value="">Select Edu. Level</option>
                {EDU_LEVELS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Department">
              <select
                value={filters.dept}
                onChange={(e) => handleFilterChange('dept', e.target.value)}
                className={inp}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
            <F label="Class">
              <select
                value={filters.className}
                onChange={(e) =>
                  handleFilterChange('className', e.target.value)
                }
                className={inp}
              >
                <option value="">Select Class</option>
                {CLASSES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </F>
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={loadExam}
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
                  Load Exam
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        {showExams && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-blue-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Exam Records
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {filteredRows.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '880px' }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {[
                      '#',
                      'Shift',
                      'Medium',
                      'Edu. Level',
                      'Department',
                      'Class',
                      'Exam Name',
                      'Session',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center">
                        <ClipboardList
                          size={32}
                          className="mx-auto text-gray-200 dark:text-gray-600 mb-2"
                        />
                        <p className="text-sm text-gray-400">
                          No exams match your filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-400">
                          {i + 1}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {row.shift}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {row.medium}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {row.edu}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {row.dept}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg">
                            {row.className}
                          </span>
                        </td>
                        <td
                          className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[220px] truncate"
                          title={row.exam}
                        >
                          {row.exam}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {row.session}
                        </td>
                        <td className="px-4 py-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                navigate('/markEntry/markEntryDetail', {
                                  state: { row },
                                })
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap">
                              <BarChart2 size={12} /> Result %
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
