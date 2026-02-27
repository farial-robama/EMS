import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  BookOpen,
  BookMarked,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';


// ── data ──────────────────────────────────────────────────────────────────────
const CLASSES = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Arts)', 'Ten (Commerce)'];
const SESSIONS = ['All', '2023', '2024', '2025', '2025-2026'];
const RETURN_STATUSES = ['All', 'Returned', 'Pending', 'Overdue'];

const INITIAL_ALLOCATIONS = [
  { id: 1, rollNo: '101', studentName: 'Arif Hossain', className: 'Nine (Science)', session: '2025', bookTitle: 'Higher Mathematics', bookCode: 'BK-2201', category: 'Mathematics', allocatedDate: '2025-01-10', dueDate: '2025-12-31', returnStatus: 'Pending' },
  { id: 2, rollNo: '102', studentName: 'Sumaiya Khanam', className: 'Nine (Science)', session: '2025', bookTitle: 'Physics for Class 9-10', bookCode: 'BK-2202', category: 'Science', allocatedDate: '2025-01-10', dueDate: '2025-12-31', returnStatus: 'Pending' },
  { id: 3, rollNo: '201', studentName: 'Rahim Uddin', className: 'Four', session: '2025', bookTitle: 'Bangla Grammar & Composition', bookCode: 'BK-1101', category: 'Bengali Literature', allocatedDate: '2025-01-15', dueDate: '2025-06-30', returnStatus: 'Returned' },
  { id: 4, rollNo: '301', studentName: 'Fatema Begum', className: 'Eight', session: '2025', bookTitle: 'English for Today (Class 8)', bookCode: 'BK-1803', category: 'English Grammar', allocatedDate: '2025-01-12', dueDate: '2025-06-30', returnStatus: 'Overdue' },
  { id: 5, rollNo: '103', studentName: 'Mehedi Hassan', className: 'Nine (Science)', session: '2025', bookTitle: 'Chemistry Textbook', bookCode: 'BK-2203', category: 'Science', allocatedDate: '2025-01-10', dueDate: '2025-12-31', returnStatus: 'Pending' },
  { id: 6, rollNo: '401', studentName: 'Nusrat Jahan', className: 'Ten (Arts)', session: '2025-2026', bookTitle: 'Civic & Citizenship', bookCode: 'BK-2401', category: 'Social Science', allocatedDate: '2025-02-01', dueDate: '2025-12-31', returnStatus: 'Pending' },
  { id: 7, rollNo: '501', studentName: 'Karim Mia', className: 'Six', session: '2025', bookTitle: 'ICT for Class 6', bookCode: 'BK-0601', category: 'ICT', allocatedDate: '2025-01-20', dueDate: '2025-06-30', returnStatus: 'Returned' },
  { id: 8, rollNo: '202', studentName: 'Sharmin Akter', className: 'Four', session: '2025', bookTitle: 'Primary Mathematics', bookCode: 'BK-1102', category: 'Mathematics', allocatedDate: '2025-01-15', dueDate: '2025-06-30', returnStatus: 'Overdue' },
  { id: 9, rollNo: '601', studentName: 'Rubel Islam', className: 'Two', session: '2025', bookTitle: 'Amaar Bangla Boi', bookCode: 'BK-0201', category: 'Bengali Literature', allocatedDate: '2025-01-18', dueDate: '2025-06-30', returnStatus: 'Returned' },
  { id: 10, rollNo: '701', studentName: 'Tahmina Parvin', className: 'KG', session: '2025', bookTitle: 'My First English Book', bookCode: 'BK-0101', category: 'English Grammar', allocatedDate: '2025-01-22', dueDate: '2025-06-30', returnStatus: 'Pending' },
  { id: 11, rollNo: '104', studentName: 'Jahangir Alam', className: 'Nine (Science)', session: '2025', bookTitle: 'Biology Textbook', bookCode: 'BK-2204', category: 'Science', allocatedDate: '2025-01-10', dueDate: '2025-12-31', returnStatus: 'Overdue' },
  { id: 12, rollNo: '402', studentName: 'Ritu Rani', className: 'Ten (Arts)', session: '2025-2026', bookTitle: 'Bangladesh & World Identity', bookCode: 'BK-2402', category: 'Social Science', allocatedDate: '2025-02-01', dueDate: '2025-12-31', returnStatus: 'Returned' },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const statusConfig = {
  Returned:  { cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',  icon: <CheckCircle size={11} /> },
  Pending:   { cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',   icon: <Clock size={11} /> },
  Overdue:   { cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',            icon: <AlertCircle size={11} /> },
};

const EMPTY_FORM = {
  rollNo: '', studentName: '', className: 'KG', session: '2025',
  bookTitle: '', bookCode: '', category: '', allocatedDate: '', dueDate: '', returnStatus: 'Pending',
};

// ── component ─────────────────────────────────────────────────────────────────
export default function BookAllocation() {
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [returnFilter, setReturnFilter] = useState('All');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    allocations.filter(a =>
      (classFilter === 'All' || a.className === classFilter) &&
      (sessionFilter === 'All' || a.session === sessionFilter) &&
      (returnFilter === 'All' || a.returnStatus === returnFilter) &&
      (!search || a.studentName.toLowerCase().includes(search.toLowerCase()) ||
        a.rollNo.includes(search) || a.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        a.bookCode.toLowerCase().includes(search.toLowerCase()))
    ), [allocations, classFilter, sessionFilter, returnFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // ── handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => { setForm({ ...EMPTY_FORM }); setFormErrors({}); setFormModal({ mode: 'add' }); };
  const openEdit = (a) => { setForm({ rollNo: a.rollNo, studentName: a.studentName, className: a.className, session: a.session, bookTitle: a.bookTitle, bookCode: a.bookCode, category: a.category, allocatedDate: a.allocatedDate, dueDate: a.dueDate, returnStatus: a.returnStatus }); setFormErrors({}); setFormModal({ mode: 'edit', id: a.id }); };

  const validate = () => {
    const errs = {};
    if (!form.rollNo.trim()) errs.rollNo = 'Roll No is required';
    if (!form.studentName.trim()) errs.studentName = 'Student name is required';
    if (!form.bookTitle.trim()) errs.bookTitle = 'Book title is required';
    if (!form.bookCode.trim()) errs.bookCode = 'Book code is required';
    if (!form.allocatedDate) errs.allocatedDate = 'Allocation date is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...allocations.map(a => a.id)) + 1;
      setAllocations(p => [...p, { id: newId, ...form }]);
    } else {
      setAllocations(p => p.map(a => a.id === formModal.id ? { ...a, ...form } : a));
    }
    setFormModal(null);
  };

  const markReturned = (id) =>
    setAllocations(p => p.map(a => a.id === id ? { ...a, returnStatus: 'Returned' } : a));

  const handleDelete = () => {
    setAllocations(p => p.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Library', 'Book Allocation']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookMarked size={22} className="text-blue-500" /> Book Allocation
            </h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Allocate Book
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Allocated', value: allocations.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Returned', value: allocations.filter(a => a.returnStatus === 'Returned').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30', val: 'text-green-700 dark:text-green-400' },
            { label: 'Pending', value: allocations.filter(a => a.returnStatus === 'Pending').length, cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30', val: 'text-amber-700 dark:text-amber-400' },
            { label: 'Overdue', value: allocations.filter(a => a.returnStatus === 'Overdue').length, cls: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30', val: 'text-red-700 dark:text-red-400' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Allocations</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1); }} className={inp}>
                {CLASSES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={sessionFilter} onChange={e => { setSessionFilter(e.target.value); setPage(1); }} className={inp}>
                {SESSIONS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Return Status</label>
              <select value={returnFilter} onChange={e => { setReturnFilter(e.target.value); setPage(1); }} className={inp}>
                {RETURN_STATUSES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Student, book, roll…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Allocation Records</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1050px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Roll No', 'Student Name', 'Class', 'Session', 'Book Title', 'Book Code', 'Allocated', 'Due Date', 'Return Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-14 text-center">
                      <BookOpen size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400">No allocations match your filters</p>
                    </td>
                  </tr>
                ) : paged.map((a, i) => {
                  const sc = statusConfig[a.returnStatus] || statusConfig.Pending;
                  return (
                    <tr key={a.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20">
                      <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{a.rollNo}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                            <User size={12} />
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{a.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{a.className}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{a.session}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[180px] truncate" title={a.bookTitle}>{a.bookTitle}</td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{a.bookCode}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          <Calendar size={11} /> {a.allocatedDate}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap ${a.returnStatus === 'Overdue' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          <Calendar size={11} /> {a.dueDate}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${sc.cls}`}>
                          {sc.icon} {a.returnStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          {a.returnStatus !== 'Returned' && (
                            <button onClick={() => markReturned(a.id)} title="Mark as Returned"
                              className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 flex items-center justify-center transition-all border border-green-100 dark:border-green-900">
                              <RotateCcw size={12} />
                            </button>
                          )}
                          <button onClick={() => openEdit(a)} title="Edit Allocation"
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeleteTarget(a)} title="Delete Allocation"
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
              {paginationPages().map((p, i) => typeof p === 'string' ? (
                <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">»</button>
            </div>
          </div>
        </div>

        {/* Action Guide */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Action Guide</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100', 'Mark as Returned'],
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Allocation'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Allocation'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add / Edit Modal */}
        {formModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><BookMarked size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Allocate New Book' : 'Edit Allocation'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Student Info */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1">Student Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll No *</label>
                    <input value={form.rollNo} onChange={e => setForm(f => ({ ...f, rollNo: e.target.value }))} className={`${inp} ${formErrors.rollNo ? 'border-red-400' : ''}`} placeholder="e.g. 101" />
                    {formErrors.rollNo && <p className="text-xs text-red-500">{formErrors.rollNo}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Name *</label>
                    <input value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} className={`${inp} ${formErrors.studentName ? 'border-red-400' : ''}`} placeholder="Full name" />
                    {formErrors.studentName && <p className="text-xs text-red-500">{formErrors.studentName}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
                    <select value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} className={inp}>
                      {CLASSES.filter(c => c !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
                    <select value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))} className={inp}>
                      {SESSIONS.filter(s => s !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* Book Info */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1 pt-1">Book Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Book Title *</label>
                    <input value={form.bookTitle} onChange={e => setForm(f => ({ ...f, bookTitle: e.target.value }))} className={`${inp} ${formErrors.bookTitle ? 'border-red-400' : ''}`} placeholder="e.g. Higher Mathematics" />
                    {formErrors.bookTitle && <p className="text-xs text-red-500">{formErrors.bookTitle}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Book Code *</label>
                    <input value={form.bookCode} onChange={e => setForm(f => ({ ...f, bookCode: e.target.value }))} className={`${inp} font-mono ${formErrors.bookCode ? 'border-red-400' : ''}`} placeholder="BK-0001" />
                    {formErrors.bookCode && <p className="text-xs text-red-500">{formErrors.bookCode}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                    <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp} placeholder="e.g. Mathematics" />
                  </div>
                </div>

                {/* Dates & Status */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1 pt-1">Allocation Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Allocated Date *</label>
                    <input type="date" value={form.allocatedDate} onChange={e => setForm(f => ({ ...f, allocatedDate: e.target.value }))} className={`${inp} ${formErrors.allocatedDate ? 'border-red-400' : ''}`} />
                    {formErrors.allocatedDate && <p className="text-xs text-red-500">{formErrors.allocatedDate}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Due Date *</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={`${inp} ${formErrors.dueDate ? 'border-red-400' : ''}`} />
                    {formErrors.dueDate && <p className="text-xs text-red-500">{formErrors.dueDate}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Return Status</label>
                    <select value={form.returnStatus} onChange={e => setForm(f => ({ ...f, returnStatus: e.target.value }))} className={inp}>
                      <option>Pending</option><option>Returned</option><option>Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <BookMarked size={13} /> {formModal.mode === 'add' ? 'Allocate Book' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Allocation?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Book <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.bookTitle}"</span> allocation for <span className="font-semibold text-gray-700 dark:text-gray-200">{deleteTarget.studentName}</span> will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}