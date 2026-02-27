// src/pages/settings/PaymentCollectionConfig.jsx
import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, ToggleRight, ToggleLeft,
  ChevronLeft, ChevronRight, Search, Filter, X,
  Wallet, CreditCard, Calendar, Hash, Tag,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ── static options ─────────────────────────────────────────────────────────────
const CATEGORIES    = ['All', 'Tuition Fee', 'Exam Fee', 'Admission Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Lab Fee', 'Miscellaneous'];
const EDU_LEVELS    = ['All', 'Pre-Primary', 'Primary', 'Six-Eight', 'Nine-Ten', 'Higher Secondary'];
const FREQUENCIES   = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'];
const DUE_DAY_OPTS  = Array.from({ length: 28 }, (_, i) => String(i + 1));
const CLASS_LIST    = ['All Classes', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];

// ── seed data ──────────────────────────────────────────────────────────────────
const INITIAL_CONFIGS = [
  { id: 1,  code: 'FEE-001', name: 'Monthly Tuition Fee (Primary)',      category: 'Tuition Fee',    eduLevel: 'Primary',     applicableClass: 'All Classes',    amount: 800,   frequency: 'Monthly',    dueDay: '10', lateFine: 50,  isOptional: false, status: 'Active'   },
  { id: 2,  code: 'FEE-002', name: 'Monthly Tuition Fee (Six-Eight)',    category: 'Tuition Fee',    eduLevel: 'Six-Eight',   applicableClass: 'All Classes',    amount: 1200,  frequency: 'Monthly',    dueDay: '10', lateFine: 100, isOptional: false, status: 'Active'   },
  { id: 3,  code: 'FEE-003', name: 'Monthly Tuition Fee (Nine-Ten)',     category: 'Tuition Fee',    eduLevel: 'Nine-Ten',    applicableClass: 'All Classes',    amount: 1500,  frequency: 'Monthly',    dueDay: '10', lateFine: 150, isOptional: false, status: 'Active'   },
  { id: 4,  code: 'FEE-004', name: 'Annual Admission Fee',               category: 'Admission Fee',  eduLevel: 'All',         applicableClass: 'All Classes',    amount: 3000,  frequency: 'One-Time',   dueDay: '—',  lateFine: 0,   isOptional: false, status: 'Active'   },
  { id: 5,  code: 'FEE-005', name: 'Half-Yearly Exam Fee (Primary)',     category: 'Exam Fee',       eduLevel: 'Primary',     applicableClass: 'All Classes',    amount: 500,   frequency: 'Half-Yearly',dueDay: '15', lateFine: 100, isOptional: false, status: 'Active'   },
  { id: 6,  code: 'FEE-006', name: 'Annual Exam Fee (Nine-Ten)',         category: 'Exam Fee',       eduLevel: 'Nine-Ten',    applicableClass: 'All Classes',    amount: 1200,  frequency: 'Yearly',     dueDay: '15', lateFine: 200, isOptional: false, status: 'Active'   },
  { id: 7,  code: 'FEE-007', name: 'Library Membership Fee',             category: 'Library Fee',    eduLevel: 'All',         applicableClass: 'All Classes',    amount: 300,   frequency: 'Yearly',     dueDay: '20', lateFine: 0,   isOptional: true,  status: 'Active'   },
  { id: 8,  code: 'FEE-008', name: 'Science Lab Fee',                    category: 'Lab Fee',        eduLevel: 'Nine-Ten',    applicableClass: 'Nine (Science)', amount: 600,   frequency: 'Yearly',     dueDay: '20', lateFine: 50,  isOptional: false, status: 'Active'   },
  { id: 9,  code: 'FEE-009', name: 'Sports & Cultural Fee',              category: 'Sports Fee',     eduLevel: 'All',         applicableClass: 'All Classes',    amount: 400,   frequency: 'Yearly',     dueDay: '25', lateFine: 0,   isOptional: true,  status: 'Inactive' },
  { id: 10, code: 'FEE-010', name: 'School Bus Transport Fee',           category: 'Transport Fee',  eduLevel: 'All',         applicableClass: 'All Classes',    amount: 1000,  frequency: 'Monthly',    dueDay: '05', lateFine: 100, isOptional: true,  status: 'Active'   },
  { id: 11, code: 'FEE-011', name: 'Miscellaneous / Development Fee',    category: 'Miscellaneous',  eduLevel: 'All',         applicableClass: 'All Classes',    amount: 500,   frequency: 'Yearly',     dueDay: '15', lateFine: 0,   isOptional: false, status: 'Active'   },
  { id: 12, code: 'FEE-012', name: 'KG Tuition Fee',                     category: 'Tuition Fee',    eduLevel: 'Pre-Primary', applicableClass: 'KG',             amount: 600,   frequency: 'Monthly',    dueDay: '10', lateFine: 50,  isOptional: false, status: 'Active'   },
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

const catColors = {
  'Tuition Fee':    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  'Exam Fee':       'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  'Admission Fee':  'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  'Library Fee':    'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
  'Sports Fee':     'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  'Transport Fee':  'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  'Lab Fee':        'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400',
  'Miscellaneous':  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

const EMPTY_FORM = {
  code: '', name: '', category: 'Tuition Fee', eduLevel: 'Primary',
  applicableClass: 'All Classes', amount: '', frequency: 'Monthly',
  dueDay: '10', lateFine: '', isOptional: false, status: 'Active',
};

export default function PaymentCollectionConfig() {
  const [configs, setConfigs]           = useState(INITIAL_CONFIGS);
  const [search, setSearch]             = useState('');
  const [catFilter, setCatFilter]       = useState('All');
  const [levelFilter, setLevelFilter]   = useState('All');
  const [perPage, setPerPage]           = useState(10);
  const [page, setPage]                 = useState(1);
  const [formModal, setFormModal]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});

  const filtered = useMemo(() =>
    configs.filter(c =>
      (catFilter   === 'All' || c.category === catFilter) &&
      (levelFilter === 'All' || c.eduLevel === levelFilter || c.eduLevel === 'All') &&
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
    ), [configs, catFilter, levelFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const openAdd = () => {
    const nextNum = String(Math.max(...configs.map(c => parseInt(c.code.replace('FEE-', '')))) + 1).padStart(3, '0');
    setForm({ ...EMPTY_FORM, code: `FEE-${nextNum}` });
    setFormErrors({});
    setFormModal({ mode: 'add' });
  };

  const openEdit = (c) => {
    setForm({ code: c.code, name: c.name, category: c.category, eduLevel: c.eduLevel, applicableClass: c.applicableClass, amount: c.amount, frequency: c.frequency, dueDay: c.dueDay, lateFine: c.lateFine, isOptional: c.isOptional, status: c.status });
    setFormErrors({});
    setFormModal({ mode: 'edit', id: c.id });
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim())   e.code   = 'Code is required';
    if (!form.name.trim())   e.name   = 'Fee name is required';
    if (!form.amount)        e.amount = 'Amount is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...configs.map(c => c.id)) + 1;
      setConfigs(p => [...p, { id: newId, ...form, amount: +form.amount, lateFine: +form.lateFine || 0 }]);
    } else {
      setConfigs(p => p.map(c => c.id === formModal.id ? { ...c, ...form, amount: +form.amount, lateFine: +form.lateFine || 0 } : c));
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

  const totalRevenue = configs.filter(c => c.status === 'Active' && c.frequency === 'Monthly').reduce((s, c) => s + c.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Settings', 'Payment Collection Config']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Wallet size={22} className="text-blue-500" /> Payment Collection Config
            </h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Fee Head
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Fee Heads',    value: configs.length,                                             cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',        val: 'text-blue-700 dark:text-blue-400'    },
            { label: 'Active',             value: configs.filter(c => c.status === 'Active').length,           cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',    val: 'text-green-700 dark:text-green-400'  },
            { label: 'Optional Fees',      value: configs.filter(c => c.isOptional).length,                   cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',    val: 'text-amber-700 dark:text-amber-400'  },
            { label: 'Monthly Total (৳)',  value: `৳${totalRevenue.toLocaleString()}`,                        cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400'},
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}>
              <div className={`text-xl font-bold ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Fee Heads</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
              <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} className={inp}>
                {CATEGORIES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
              <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }} className={inp}>
                {EDU_LEVELS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Name or code…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Fee Head Records</span>
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
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Code', 'Fee Head Name', 'Category', 'Level', 'Applicable Class', 'Amount (৳)', 'Frequency', 'Due Day', 'Late Fine', 'Optional', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={13} className="px-5 py-14 text-center">
                    <Wallet size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No fee heads match your filters</p>
                  </td></tr>
                ) : paged.map((cfg, i) => (
                  <tr key={cfg.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${cfg.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{cfg.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap max-w-[180px] truncate" title={cfg.name}>{cfg.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap ${catColors[cfg.category] || catColors['Miscellaneous']}`}>{cfg.category}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{cfg.eduLevel}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{cfg.applicableClass}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">৳{cfg.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{cfg.frequency}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                      {cfg.dueDay === '—' ? <span className="text-gray-400">—</span> : <span className="flex items-center gap-1"><Calendar size={11} className="text-gray-400" />Day {cfg.dueDay}</span>}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                      {cfg.lateFine > 0 ? <span className="text-red-500 font-medium">৳{cfg.lateFine}</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cfg.isOptional ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {cfg.isOptional ? 'Optional' : 'Mandatory'}
                      </span>
                    </td>
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
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Wallet size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Add Fee Head' : 'Edit Fee Head'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
                {/* Code / Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fee Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={`${inp} font-mono ${formErrors.code ? 'border-red-400' : ''}`} placeholder="FEE-001" />
                    {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inp}><option>Active</option><option>Inactive</option></select>
                  </div>
                </div>
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fee Head Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={`${inp} ${formErrors.name ? 'border-red-400' : ''}`} placeholder="e.g. Monthly Tuition Fee (Primary)" />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                {/* Category / Level / Class */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1">Applicability</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
                      {CATEGORIES.filter(c => c !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
                    <select value={form.eduLevel} onChange={e => setForm(f => ({ ...f, eduLevel: e.target.value }))} className={inp}>
                      <option>All</option>
                      {EDU_LEVELS.filter(l => l !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Applicable Class</label>
                    <select value={form.applicableClass} onChange={e => setForm(f => ({ ...f, applicableClass: e.target.value }))} className={inp}>
                      {CLASS_LIST.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                {/* Amount / Frequency / Due Day */}
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-1 pt-1">Payment Details</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount (৳) *</label>
                    <input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={`${inp} ${formErrors.amount ? 'border-red-400' : ''}`} placeholder="1000" />
                    {formErrors.amount && <p className="text-xs text-red-500">{formErrors.amount}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Frequency</label>
                    <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} className={inp}>
                      {FREQUENCIES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Due Day</label>
                    <select value={form.dueDay} onChange={e => setForm(f => ({ ...f, dueDay: e.target.value }))} className={inp}>
                      <option value="—">N/A</option>
                      {DUE_DAY_OPTS.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Late Fine (৳)</label>
                    <input type="number" min="0" value={form.lateFine} onChange={e => setForm(f => ({ ...f, lateFine: e.target.value }))} className={inp} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fee Type</label>
                    <div className="flex items-center gap-3 h-[42px] px-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked={form.isOptional} onChange={e => setForm(f => ({ ...f, isOptional: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
                        Optional Fee
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <Wallet size={13} /> {formModal.mode === 'add' ? 'Add Fee Head' : 'Save Changes'}
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
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Fee Head?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.name}"</span> will be permanently removed.
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