// src/pages/admin/studentSetup/StudentCategories.jsx
import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Search,
  Tag,
  Check,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = `w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30`;
const inpErr = `w-full px-3 py-2.5 text-sm rounded-xl border border-red-400
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:ring-2 focus:ring-red-100`;

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
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${
      status === 'Active'
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`}
    />
    {status}
  </span>
);

const SEED = [
  { id: 1, title: 'New Student', categoryCode: 'NS-001', status: 'Active' },
  { id: 2, title: 'Old Student', categoryCode: 'OS-002', status: 'Active' },
  {
    id: 3,
    title: 'Transfer Student',
    categoryCode: 'TS-003',
    status: 'Inactive',
  },
];

const BLANK = { title: '', categoryCode: '', status: 'Active' };

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function StudentCategories() {
  const [categories, setCategories] = useState(SEED);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | category obj
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  /* Derived */
  const filtered = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.categoryCode.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const openAdd = () => {
    setForm(BLANK);
    setErrors({});
    setModal('add');
  };
  const openEdit = (c) => {
    setForm({ ...c });
    setErrors({});
    setModal(c);
  };
  const closeModal = () => {
    setModal(null);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.categoryCode.trim()) e.categoryCode = 'Category code is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);

    if (modal === 'add') {
      setCategories((p) => [...p, { id: Date.now(), ...form }]);
    } else {
      setCategories((p) =>
        p.map((c) => (c.id === modal.id ? { ...c, ...form } : c))
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setCategories((p) => p.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb
              items={['Dashboard', 'Student Setup', 'Student Categories']}
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Student Categories
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total',
              value: categories.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Active',
              value: categories.filter((c) => c.status === 'Active').length,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
            {
              label: 'Inactive',
              value: categories.filter((c) => c.status !== 'Active').length,
              bg: 'bg-red-50 dark:bg-red-900/20',
              ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <Tag size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label} Categories
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
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
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                entries
              </span>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search title or code…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-52 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Title', 'Category Code', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : ''}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <Tag
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        No categories found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Try a different search or add a new category.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((cat, i) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {cat.title}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                          {cat.categoryCode}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={cat.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(cat)}
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cat)}
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                          >
                            <Trash2 size={13} />
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
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
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all
                      ${
                        safePage === p
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
        {modal !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700
              ${modal === 'add' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/10'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center
                  ${modal === 'add' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'}`}
                  >
                    {modal === 'add' ? (
                      <Plus size={14} />
                    ) : (
                      <Pencil size={13} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {modal === 'add' ? 'Add New Category' : 'Edit Category'}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Title<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. New Student"
                    className={errors.title ? inpErr : inp}
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={11} />
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Category Code<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    name="categoryCode"
                    value={form.categoryCode}
                    onChange={handleFormChange}
                    placeholder="e.g. NS-001"
                    className={errors.categoryCode ? inpErr : inp}
                  />
                  {errors.categoryCode && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={11} />
                      {errors.categoryCode}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="flex gap-3">
                    {['Active', 'Inactive'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, status: s }))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                        ${
                          form.status === s
                            ? s === 'Active'
                              ? 'bg-green-600 text-white border-green-600 shadow-sm'
                              : 'bg-red-500 text-white border-red-500 shadow-sm'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                  ${saving ? 'bg-blue-400 cursor-not-allowed' : modal === 'add' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      {modal === 'add' ? 'Save Category' : 'Update Category'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm Modal ──────────────────────────────────────────── */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
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
                Delete Category?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  "{deleteConfirm.title}"
                </span>{' '}
                will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
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
