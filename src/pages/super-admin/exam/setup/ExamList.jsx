import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Copy,
  Pencil,
  Trash2,
  ToggleRight,
  ClipboardList,
  Eraser,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Filter,
  AlertCircle,
  Check,
  X,
  ToggleLeft,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const EXAM_DATA = [
  {
    id: 1,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Primary',
    department: 'Default',
    className: 'Four',
    session: '2025',
    title: 'Annual Examination - 2025',
    status: 'Active',
  },
  {
    id: 2,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Pre-Primary',
    department: 'Default',
    className: 'KG',
    session: '2025',
    title: 'Yearly Exam-2025',
    status: 'Active',
  },
  {
    id: 3,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Primary',
    department: 'Default',
    className: 'One',
    session: '2025',
    title: 'Yearly Exam-2025',
    status: 'Active',
  },
  {
    id: 4,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Primary',
    department: 'Default',
    className: 'Two',
    session: '2025',
    title: 'Yearly Examination (2025)',
    status: 'Active',
  },
  {
    id: 5,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Nine-Ten',
    department: 'Science',
    className: 'Nine (Science)',
    session: '2025-2026',
    title: 'Annual Examination - 2025',
    status: 'Active',
  },
  {
    id: 6,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Nine-Ten',
    department: 'Arts',
    className: 'Ten (Arts)',
    session: '2025-2026',
    title: 'Half-Yearly Examination 2025',
    status: 'Inactive',
  },
  {
    id: 7,
    shift: 'Day',
    medium: 'English',
    eduLevel: 'Six-Eight',
    department: 'Default',
    className: 'Eight',
    session: '2025',
    title: 'Terminal Exam 2025',
    status: 'Active',
  },
  {
    id: 8,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Primary',
    department: 'Default',
    className: 'Three',
    session: '2025',
    title: 'Monthly Test - December',
    status: 'Active',
  },
];

const EDU_LEVELS = [
  'All',
  'Pre-Primary',
  'Primary',
  'Six-Eight',
  'Nine-Ten',
  'Higher Secondary',
];
const DEPARTMENTS = ['All', 'Default', 'Science', 'Arts', 'Commerce'];
const CLASSES = [
  'All',
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
  'Nine (Arts)',
  'Ten (Arts)',
  'Ten (Commerce)',
];

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

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function ExamList() {
  const navigate = useNavigate();

  const [eduLevel, setEduLevel] = useState('All');
  const [dept, setDept] = useState('All');
  const [cls, setCls] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [exams, setExams] = useState(EXAM_DATA);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copyTarget, setCopyTarget] = useState(null);
  const [copyTitle, setCopyTitle] = useState('');

  const filtered = useMemo(
    () =>
      exams.filter(
        (e) =>
          (eduLevel === 'All' || e.eduLevel === eduLevel) &&
          (dept === 'All' || e.department === dept) &&
          (cls === 'All' || e.className === cls) &&
          (!search ||
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.className.toLowerCase().includes(search.toLowerCase()))
      ),
    [exams, eduLevel, dept, cls, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleStatus = (id) =>
    setExams((p) =>
      p.map((e) =>
        e.id === id
          ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' }
          : e
      )
    );
  const deleteExam = () => {
    setExams((p) => p.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleCopy = () => {
    const src = exams.find((e) => e.id === copyTarget.id);
    const newId = Math.max(...exams.map((e) => e.id)) + 1;
    setExams((p) => [
      ...p,
      { ...src, id: newId, title: copyTitle || `${src.title} (Copy)` },
    ]);
    setCopyTarget(null);
    setCopyTitle('');
  };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1)
        arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Exam & Result', 'Exam List']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen size={22} className="text-blue-500" /> Exam List
            </h1>
          </div>
          <button
            onClick={() => navigate('/examList/addNewExam')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add New Exam
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Exams',
              value: exams.length,
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              val: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Active',
              value: exams.filter((e) => e.status === 'Active').length,
              cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
              val: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Inactive',
              value: exams.filter((e) => e.status === 'Inactive').length,
              cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600',
              val: 'text-gray-600 dark:text-gray-400',
            },
            {
              label: 'Filtered',
              value: filtered.length,
              cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30',
              val: 'text-indigo-700 dark:text-indigo-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}
            >
              <div className={`text-2xl font-bold ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Filter Exams
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Education Level
              </label>
              <select
                value={eduLevel}
                onChange={(e) => {
                  setEduLevel(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {EDU_LEVELS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Department
              </label>
              <select
                value={dept}
                onChange={(e) => {
                  setDept(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {DEPARTMENTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class
              </label>
              <select
                value={cls}
                onChange={(e) => {
                  setCls(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {CLASSES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Exam Records
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Show
                </span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  placeholder="Search exams…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '960px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Shift',
                    'Medium',
                    'Education Level',
                    'Department',
                    'Class',
                    'Session',
                    'Exam Title',
                    'Status',
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
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-14 text-center">
                      <BookOpen
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400">
                        No exams match your filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((exam, i) => (
                    <tr
                      key={exam.id}
                      className={`transition-colors ${exam.status === 'Inactive' ? 'opacity-60' : ''} hover:bg-gray-50/70 dark:hover:bg-gray-700/20`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {exam.shift}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {exam.medium}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {exam.eduLevel}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {exam.department}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">
                          {exam.className}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {exam.session}
                      </td>
                      <td
                        className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[200px] truncate"
                        title={exam.title}
                      >
                        {exam.title}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${exam.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          {/* Copy */}
                          <button
                            onClick={() => {
                              setCopyTarget(exam);
                              setCopyTitle(`${exam.title} (Copy)`);
                            }}
                            title="Copy Exam"
                            className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 hover:bg-purple-100 flex items-center justify-center transition-all border border-purple-100 dark:border-purple-900"
                          >
                            <Copy size={12} />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() =>
                              navigate(`/examList/edit/${exam.id}`)
                            }
                            title="Edit Exam"
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                          >
                            <Pencil size={12} />
                          </button>
                          {/* Toggle Status */}
                          <button
                            onClick={() => toggleStatus(exam.id)}
                            title="Toggle Status"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${exam.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}
                          >
                            {exam.status === 'Active' ? (
                              <ToggleRight size={14} />
                            ) : (
                              <ToggleLeft size={14} />
                            )}
                          </button>
                          {/* Mark Entry Config */}
                          <button
                            title="Mark Entry Config"
                            className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                          >
                            <ClipboardList size={12} />
                          </button>
                          {/* Delete Highest Marks */}
                          <button
                            title="Delete Highest Marks"
                            className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 flex items-center justify-center transition-all border border-orange-100 dark:border-orange-900"
                          >
                            <Eraser size={12} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(exam)}
                            title="Delete Exam"
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                          >
                            <Trash2 size={12} />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}
              –{Math.min(safePage * perPage, filtered.length)} of{' '}
              {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft size={14} />
              </button>
              {paginationPages().map((p, i) =>
                typeof p === 'string' ? (
                  <span
                    key={i}
                    className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                  >
                    …
                  </span>
                ) : (
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
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold"
              >
                »
              </button>
            </div>
          </div>
        </div>

        {/* Action key / Legend */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Action Guide
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              [
                'bg-purple-50 dark:bg-purple-900/20 text-purple-500 border-purple-100',
                'Copy Exam',
              ],
              [
                'bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100',
                'Edit Exam',
              ],
              [
                'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100',
                'Toggle Active/Inactive',
              ],
              [
                'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-100',
                'Mark Entry Config',
              ],
              [
                'bg-orange-50 dark:bg-orange-900/20 text-orange-500 border-orange-100',
                'Delete Highest Marks',
              ],
              [
                'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100',
                'Delete Exam',
              ],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}
                >
                  <span className="text-[8px]">●</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Modal */}
        {copyTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setCopyTarget(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Copy size={13} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Copy Exam
                  </span>
                </div>
                <button
                  onClick={() => setCopyTarget(null)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copying{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    "{copyTarget.title}"
                  </span>
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    New Exam Title
                  </label>
                  <input
                    value={copyTitle}
                    onChange={(e) => setCopyTitle(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => setCopyTarget(null)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-sm"
                >
                  <Copy size={13} /> Copy Exam
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                Delete Exam?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  "{deleteTarget.title}"
                </span>{' '}
                will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteExam}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
