import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleRight,
  ToggleLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Tag,
  BookMarked,
  Hash,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';


// ── data ──────────────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  { id: 1, code: 'CAT-001', name: 'Mathematics', description: 'All mathematics related books', totalBooks: 42, status: 'Active' },
  { id: 2, code: 'CAT-002', name: 'Science', description: 'Physics, Chemistry, Biology textbooks', totalBooks: 67, status: 'Active' },
  { id: 3, code: 'CAT-003', name: 'Bengali Literature', description: 'Bangla prose, poetry and novels', totalBooks: 38, status: 'Active' },
  { id: 4, code: 'CAT-004', name: 'English Grammar', description: 'Grammar and composition books', totalBooks: 24, status: 'Active' },
  { id: 5, code: 'CAT-005', name: 'Social Science', description: 'History, Geography, Civics', totalBooks: 31, status: 'Active' },
  { id: 6, code: 'CAT-006', name: 'Religious Studies', description: 'Islam, Hindu, Christian studies', totalBooks: 18, status: 'Inactive' },
  { id: 7, code: 'CAT-007', name: 'ICT', description: 'Information & Communication Technology', totalBooks: 15, status: 'Active' },
  { id: 8, code: 'CAT-008', name: 'Arts & Crafts', description: 'Drawing, painting and craft books', totalBooks: 9, status: 'Inactive' },
  { id: 9, code: 'CAT-009', name: 'Physical Education', description: 'Sports and health education', totalBooks: 7, status: 'Active' },
  { id: 10, code: 'CAT-010', name: 'Home Science', description: 'Home economics and life skills', totalBooks: 11, status: 'Active' },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const EMPTY_FORM = { code: '', name: '', description: '', status: 'Active' };

// ── component ─────────────────────────────────────────────────────────────────
export default function BookCategory() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // modal states
  const [formModal, setFormModal] = useState(null); // null | { mode:'add'|'edit', data }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    categories.filter(c =>
      (statusFilter === 'All' || c.status === statusFilter) &&
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
    ), [categories, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // ── handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    const nextNum = String(Math.max(...categories.map(c => parseInt(c.code.replace('CAT-', '')))) + 1).padStart(3, '0');
    setForm({ ...EMPTY_FORM, code: `CAT-${nextNum}` });
    setFormErrors({});
    setFormModal({ mode: 'add' });
  };

  const openEdit = (cat) => {
    setForm({ code: cat.code, name: cat.name, description: cat.description, status: cat.status });
    setFormErrors({});
    setFormModal({ mode: 'edit', id: cat.id });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Category name is required';
    if (!form.code.trim()) errs.code = 'Category code is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories(p => [...p, { id: newId, ...form, totalBooks: 0 }]);
    } else {
      setCategories(p => p.map(c => c.id === formModal.id ? { ...c, ...form } : c));
    }
    setFormModal(null);
  };

  const toggleStatus = (id) =>
    setCategories(p => p.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));

  const handleDelete = () => {
    setCategories(p => p.filter(c => c.id !== deleteTarget.id));
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
            <Breadcrumb items={['Dashboard', 'Library', 'Book Category']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Tag size={22} className="text-blue-500" /> Book Category
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Category
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Categories', value: categories.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Active', value: categories.filter(c => c.status === 'Active').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30', val: 'text-green-700 dark:text-green-400' },
            { label: 'Inactive', value: categories.filter(c => c.status === 'Inactive').length, cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600', val: 'text-gray-600 dark:text-gray-400' },
            { label: 'Total Books', value: categories.reduce((s, c) => s + c.totalBooks, 0), cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Categories</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className={inp}>
                {['All', 'Active', 'Inactive'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  placeholder="Search by name or code…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className={`${inp} pl-8`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Category Records</span>
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
            <table className="w-full" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Code', 'Category Name', 'Description', 'Total Books', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <Tag size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400">No categories match your filters</p>
                    </td>
                  </tr>
                ) : paged.map((cat, i) => (
                  <tr key={cat.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${cat.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{cat.code}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{cat.name}</td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-[220px] truncate" title={cat.description}>{cat.description}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <BookMarked size={11} /> {cat.totalBooks}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cat.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} title="Edit Category"
                          className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => toggleStatus(cat.id)} title="Toggle Status"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${cat.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}>
                          {cat.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => setDeleteTarget(cat)} title="Delete Category"
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

        {/* Add / Edit Modal */}
        {formModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Tag size={13} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Add New Category' : 'Edit Category'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                      className={`${inp} font-mono ${formErrors.code ? 'border-red-400' : ''}`} placeholder="CAT-001" />
                    {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inp}>
                      <option>Active</option><option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={`${inp} ${formErrors.name ? 'border-red-400' : ''}`} placeholder="e.g. Mathematics" />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className={`${inp} resize-none`} placeholder="Brief description of this category…" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <Tag size={13} /> {formModal.mode === 'add' ? 'Add Category' : 'Save Changes'}
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
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Category?</h3>
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