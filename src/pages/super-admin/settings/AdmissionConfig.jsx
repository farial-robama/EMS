// src/pages/settings/AdmissionConfig.jsx
import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, ToggleRight, ToggleLeft,
  ChevronLeft, ChevronRight, Search, Filter, X,
  ClipboardList, GraduationCap, Calendar, Hash,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ── static options ─────────────────────────────────────────────────────────────
const EDU_LEVELS   = ['All', 'Pre-Primary', 'Primary', 'Six-Eight', 'Nine-Ten', 'Higher Secondary'];
const SHIFTS       = ['All', 'Morning', 'Day', 'Evening'];
const MEDIUMS      = ['All', 'Bangla', 'English'];
const SESSIONS     = ['All', '2024', '2025', '2025-2026', '2026'];
const CLASS_LIST   = ['KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];
const GENDER_OPTS  = ['Both', 'Male Only', 'Female Only'];

// ── seed data ──────────────────────────────────────────────────────────────────
const INITIAL_CONFIGS = [
  { id: 1,  code: 'ADM-001', session: '2025', shift: 'Day',     medium: 'Bangla',  eduLevel: 'Pre-Primary', className: 'KG',              totalSeats: 40,  availableSeats: 15, gender: 'Both',        minAge: 4,  maxAge: 5,  admissionFee: 2000,  startDate: '2025-01-01', endDate: '2025-03-31', status: 'Active'   },
  { id: 2,  code: 'ADM-002', session: '2025', shift: 'Day',     medium: 'Bangla',  eduLevel: 'Primary',     className: 'One',             totalSeats: 50,  availableSeats: 22, gender: 'Both',        minAge: 5,  maxAge: 7,  admissionFee: 2500,  startDate: '2025-01-01', endDate: '2025-03-31', status: 'Active'   },
  { id: 3,  code: 'ADM-003', session: '2025', shift: 'Day',     medium: 'Bangla',  eduLevel: 'Primary',     className: 'Two',             totalSeats: 50,  availableSeats: 30, gender: 'Both',        minAge: 6,  maxAge: 8,  admissionFee: 2500,  startDate: '2025-01-01', endDate: '2025-03-31', status: 'Active'   },
  { id: 4,  code: 'ADM-004', session: '2025', shift: 'Day',     medium: 'Bangla',  eduLevel: 'Primary',     className: 'Three',           totalSeats: 50,  availableSeats: 18, gender: 'Both',        minAge: 7,  maxAge: 9,  admissionFee: 2500,  startDate: '2025-01-01', endDate: '2025-03-31', status: 'Active'   },
  { id: 5,  code: 'ADM-005', session: '2025', shift: 'Day',     medium: 'Bangla',  eduLevel: 'Six-Eight',   className: 'Six',             totalSeats: 60,  availableSeats: 0,  gender: 'Both',        minAge: 10, maxAge: 13, admissionFee: 3000,  startDate: '2025-01-01', endDate: '2025-02-28', status: 'Inactive' },
  { id: 6,  code: 'ADM-006', session: '2025', shift: 'Morning', medium: 'English', eduLevel: 'Six-Eight',   className: 'Seven',           totalSeats: 45,  availableSeats: 10, gender: 'Male Only',   minAge: 11, maxAge: 14, admissionFee: 3500,  startDate: '2025-02-01', endDate: '2025-04-30', status: 'Active'   },
  { id: 7,  code: 'ADM-007', session: '2025-2026', shift: 'Day', medium: 'Bangla', eduLevel: 'Nine-Ten',   className: 'Nine (Science)',   totalSeats: 55,  availableSeats: 20, gender: 'Both',        minAge: 13, maxAge: 16, admissionFee: 4000,  startDate: '2025-03-01', endDate: '2025-05-31', status: 'Active'   },
  { id: 8,  code: 'ADM-008', session: '2025-2026', shift: 'Day', medium: 'Bangla', eduLevel: 'Nine-Ten',   className: 'Nine (Arts)',      totalSeats: 45,  availableSeats: 25, gender: 'Female Only', minAge: 13, maxAge: 16, admissionFee: 4000,  startDate: '2025-03-01', endDate: '2025-05-31', status: 'Active'   },
  { id: 9,  code: 'ADM-009', session: '2025-2026', shift: 'Day', medium: 'Bangla', eduLevel: 'Nine-Ten',   className: 'Ten (Science)',    totalSeats: 50,  availableSeats: 8,  gender: 'Both',        minAge: 14, maxAge: 17, admissionFee: 4500,  startDate: '2025-02-01', endDate: '2025-04-30', status: 'Active'   },
  { id: 10, code: 'ADM-010', session: '2025',     shift: 'Evening', medium: 'Bangla', eduLevel: 'Primary', className: 'Four',            totalSeats: 40,  availableSeats: 40, gender: 'Both',        minAge: 8,  maxAge: 11, admissionFee: 2500,  startDate: '2025-04-01', endDate: '2025-06-30', status: 'Active'   },
];

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

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

const EMPTY_FORM = {
  code: '', session: '2025', shift: 'Day', medium: 'Bangla', eduLevel: 'Primary',
  className: 'One', totalSeats: '', availableSeats: '', gender: 'Both',
  minAge: '', maxAge: '', admissionFee: '', startDate: '', endDate: '', status: 'Active',
};

// ── component ──────────────────────────────────────────────────────────────────
export default function AdmissionConfig() {
  const [configs, setConfigs]           = useState(INITIAL_CONFIGS);
  const [search, setSearch]             = useState('');
  const [levelFilter, setLevelFilter]   = useState('All');
  const [shiftFilter, setShiftFilter]   = useState('All');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [perPage, setPerPage]           = useState(10);
  const [page, setPage]                 = useState(1);
  const [formModal, setFormModal]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});

  const filtered = useMemo(() =>
    configs.filter(c =>
      (levelFilter   === 'All' || c.eduLevel === levelFilter) &&
      (shiftFilter   === 'All' || c.shift    === shiftFilter) &&
      (sessionFilter === 'All' || c.session  === sessionFilter) &&
      (!search || c.className.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()))
    ), [configs, levelFilter, shiftFilter, sessionFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const openAdd = () => {
    const nextNum = String(Math.max(...configs.map(c => parseInt(c.code.replace('ADM-', '')))) + 1).padStart(3, '0');
    setForm({ ...EMPTY_FORM, code: `ADM-${nextNum}` });
    setFormErrors({});
    setFormModal({ mode: 'add' });
  };

  const openEdit = (c) => {
    setForm({ code: c.code, session: c.session, shift: c.shift, medium: c.medium, eduLevel: c.eduLevel, className: c.className, totalSeats: c.totalSeats, availableSeats: c.availableSeats, gender: c.gender, minAge: c.minAge, maxAge: c.maxAge, admissionFee: c.admissionFee, startDate: c.startDate, endDate: c.endDate, status: c.status });
    setFormErrors({});
    setFormModal({ mode: 'edit', id: c.id });
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim())        e.code        = 'Code is required';
    if (!form.className.trim())   e.className   = 'Class is required';
    if (!form.totalSeats)         e.totalSeats  = 'Total seats required';
    if (!form.admissionFee)       e.admissionFee= 'Admission fee required';
    if (!form.startDate)          e.startDate   = 'Start date required';
    if (!form.endDate)            e.endDate     = 'End date required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...configs.map(c => c.id)) + 1;
      setConfigs(p => [...p, { id: newId, ...form, totalSeats: +form.totalSeats, availableSeats: +form.availableSeats || +form.totalSeats, admissionFee: +form.admissionFee, minAge: +form.minAge || 0, maxAge: +form.maxAge || 0 }]);
    } else {
      setConfigs(p => p.map(c => c.id === formModal.id ? { ...c, ...form, totalSeats: +form.totalSeats, availableSeats: +form.availableSeats, admissionFee: +form.admissionFee, minAge: +form.minAge, maxAge: +form.maxAge } : c));
    }
    setFormModal(null);
  };

  const toggleStatus = (id) =>
    setConfigs(p => p.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));

  const handleDelete = () => { setConfigs(p => p.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null); };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  const seatBadge = (avail, total) => {
    if (avail === 0)               return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    if (avail / total < 0.3)       return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Settings', 'Admission Config']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ClipboardList size={22} className="text-blue-500" /> Admission Config
            </h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Config
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Configs',   value: configs.length,                                            cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',        val: 'text-blue-700 dark:text-blue-400'    },
            { label: 'Active',          value: configs.filter(c => c.status === 'Active').length,          cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',    val: 'text-green-700 dark:text-green-400'  },
            { label: 'Total Seats',     value: configs.reduce((s, c) => s + c.totalSeats, 0),              cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400'},
            { label: 'Available Seats', value: configs.reduce((s, c) => s + c.availableSeats, 0),          cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',    val: 'text-amber-700 dark:text-amber-400'  },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Configs</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: 'Education Level', value: levelFilter,   setter: setLevelFilter,   opts: EDU_LEVELS },
              { label: 'Shift',           value: shiftFilter,   setter: setShiftFilter,   opts: SHIFTS     },
              { label: 'Session',         value: sessionFilter, setter: setSessionFilter, opts: SESSIONS   },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                <select value={f.value} onChange={e => { f.setter(e.target.value); setPage(1); }} className={inp}>
                  {f.opts.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Class, code…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Config Records</span>
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
            <table className="w-full" style={{ minWidth: '1100px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Code', 'Session', 'Shift', 'Medium', 'Level', 'Class', 'Seats', 'Gender', 'Age', 'Fee (৳)', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={14} className="px-5 py-14 text-center">
                    <ClipboardList size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No configs match your filters</p>
                  </td></tr>
                ) : paged.map((cfg, i) => (
                  <tr key={cfg.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${cfg.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{cfg.code}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cfg.session}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cfg.shift}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cfg.medium}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{cfg.eduLevel}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{cfg.className}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${seatBadge(cfg.availableSeats, cfg.totalSeats)}`}>
                        {cfg.availableSeats}/{cfg.totalSeats}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{cfg.gender}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{cfg.minAge}–{cfg.maxAge} yrs</td>
                    <td className="px-4 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">৳{cfg.admissionFee.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{cfg.startDate} → {cfg.endDate}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cfg.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>{cfg.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cfg)} title="Edit" className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button onClick={() => toggleStatus(cfg.id)} title="Toggle Status" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${cfg.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}>
                          {cfg.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => setDeleteTarget(cfg)} title="Delete" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
              {paginationPages().map((p, i) => typeof p === 'string'
                ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>{p}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">»</button>
            </div>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {formModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><ClipboardList size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Add Admission Config' : 'Edit Admission Config'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
                {/* Code / Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Config Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={`${inp} font-mono ${formErrors.code ? 'border-red-400' : ''}`} placeholder="ADM-001" />
                    {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inp}><option>Active</option><option>Inactive</option></select>
                  </div>
                </div>
                {/* Session / Shift / Medium */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1">Academic Details</p>
                <div className="grid grid-cols-3 gap-3">
                  {[['Session', 'session', SESSIONS.filter(s => s !== 'All')], ['Shift', 'shift', SHIFTS.filter(s => s !== 'All')], ['Medium', 'medium', MEDIUMS.filter(s => s !== 'All')]].map(([label, key, opts]) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                      <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inp}>
                        {opts.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                {/* Level / Class */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
                    <select value={form.eduLevel} onChange={e => setForm(f => ({ ...f, eduLevel: e.target.value }))} className={inp}>
                      {EDU_LEVELS.filter(l => l !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class *</label>
                    <select value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} className={`${inp} ${formErrors.className ? 'border-red-400' : ''}`}>
                      {CLASS_LIST.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                {/* Seats / Gender */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1 pt-1">Seat & Eligibility</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Seats *</label>
                    <input type="number" min="1" value={form.totalSeats} onChange={e => setForm(f => ({ ...f, totalSeats: e.target.value }))} className={`${inp} ${formErrors.totalSeats ? 'border-red-400' : ''}`} placeholder="50" />
                    {formErrors.totalSeats && <p className="text-xs text-red-500">{formErrors.totalSeats}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available Seats</label>
                    <input type="number" min="0" value={form.availableSeats} onChange={e => setForm(f => ({ ...f, availableSeats: e.target.value }))} className={inp} placeholder="50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gender</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className={inp}>
                      {GENDER_OPTS.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Min Age</label>
                    <input type="number" min="0" value={form.minAge} onChange={e => setForm(f => ({ ...f, minAge: e.target.value }))} className={inp} placeholder="5" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Max Age</label>
                    <input type="number" min="0" value={form.maxAge} onChange={e => setForm(f => ({ ...f, maxAge: e.target.value }))} className={inp} placeholder="12" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Admission Fee *</label>
                    <input type="number" min="0" value={form.admissionFee} onChange={e => setForm(f => ({ ...f, admissionFee: e.target.value }))} className={`${inp} ${formErrors.admissionFee ? 'border-red-400' : ''}`} placeholder="2500" />
                    {formErrors.admissionFee && <p className="text-xs text-red-500">{formErrors.admissionFee}</p>}
                  </div>
                </div>
                {/* Dates */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1 pt-1">Admission Period</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date *</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={`${inp} ${formErrors.startDate ? 'border-red-400' : ''}`} />
                    {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date *</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={`${inp} ${formErrors.endDate ? 'border-red-400' : ''}`} />
                    {formErrors.endDate && <p className="text-xs text-red-500">{formErrors.endDate}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <ClipboardList size={13} /> {formModal.mode === 'add' ? 'Add Config' : 'Save Changes'}
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
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Config?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Config <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.code}"</span> for <span className="font-semibold text-gray-700 dark:text-gray-200">{deleteTarget.className}</span> will be permanently removed.</p>
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