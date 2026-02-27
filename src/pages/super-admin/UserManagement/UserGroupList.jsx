// src/pages/super-admin/UserGroupList.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { showSuccess, showError } from '../../../utils/toast';

// ─── seed data ─────────────────────────────────────────────────────────────
const seedGroups = [
  {
    id: 1,
    name: 'Admin',
    users: 3,
    ordering: 1,
    status: 'Active',
    createdBy: 'System',
    editedBy: 'Admin',
    description: 'Full system administration access',
  },
  {
    id: 2,
    name: 'Teacher',
    users: 18,
    ordering: 2,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'Teacher panel with class management',
  },
  {
    id: 3,
    name: 'Student',
    users: 320,
    ordering: 3,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'Student panel for results & library',
  },
  {
    id: 4,
    name: 'Guest',
    users: 12,
    ordering: 4,
    status: 'Inactive',
    createdBy: 'Teacher',
    editedBy: 'Admin',
    description: 'Limited read-only guest access',
  },
  {
    id: 5,
    name: 'Staff',
    users: 7,
    ordering: 5,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'General staff operations',
  },
];

const nextId = (arr) =>
  arr.length ? Math.max(...arr.map((g) => g.id)) + 1 : 1;
const emptyGroup = (ordering) => ({
  name: '',
  users: 0,
  ordering,
  status: 'Active',
  description: '',
  createdBy: 'Admin',
  editedBy: 'Admin',
});

// ─── Shared field wrapper ──────────────────────────────────────────────────
function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:ring-2 focus:ring-red-100';

// ─── Status Badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      ${isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-amber-400'}`}
      />
      {status}
    </span>
  );
};

// ─── Breadcrumb ────────────────────────────────────────────────────────────
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

// ─── Delete Confirm Modal ──────────────────────────────────────────────────
function DeleteConfirm({ group, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
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
          Delete Group?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            "{group.name}"
          </span>{' '}
          will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function UserGroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(seedGroups);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | 'add' | 'view' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyGroup(1));
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // ── derived list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups
      .filter((g) => statusFilter === 'All' || g.status === statusFilter)
      .filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      )
      .sort((a, b) => a.ordering - b.ordering);
  }, [groups, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // ── actions ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyGroup(groups.length + 1));
    setFormErrors({});
    setModal('add');
  };
  const openView = (g) => {
    setSelected(g);
    setModal('view');
  };
  const openEdit = (g) => {
    setSelected(g);
    setForm({ ...g });
    setFormErrors({});
    setModal('edit');
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setFormErrors({});
  };

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = 'Group name is required.';
    if (!f.description.trim()) e.description = 'Description is required.';
    if (!f.ordering || f.ordering < 1) e.ordering = 'Must be ≥ 1.';
    return e;
  };

  const handleSaveNew = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setGroups((prev) => [...prev, { ...form, id: nextId(prev), users: 0 }]);
    showSuccess('Group created successfully!');
    closeModal();
  };

  const handleSaveEdit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setGroups((prev) =>
      prev.map((g) => (g.id === form.id ? { ...form, editedBy: 'Admin' } : g))
    );
    showSuccess('Group updated successfully!');
    closeModal();
  };

  const executeDelete = () => {
    setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    showSuccess(`"${deleteTarget.name}" group deleted.`);
    setDeleteTarget(null);
  };

  // ── Modal shared body ──────────────────────────────────────────────────
  const FormBody = () => (
    <>
      <F label="Group Name" required error={formErrors.name}>
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Librarian"
          className={formErrors.name ? inpErr : inp}
        />
      </F>
      <F label="Description" required error={formErrors.description}>
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief description of this group"
          className={`${formErrors.description ? inpErr : inp} resize-none min-h-[72px]`}
        />
      </F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Ordering" required error={formErrors.ordering}>
          <input
            type="number"
            min={1}
            value={form.ordering}
            onChange={(e) =>
              setForm({ ...form, ordering: parseInt(e.target.value) || 0 })
            }
            className={formErrors.ordering ? inpErr : inp}
          />
        </F>
        <F label="Status">
          <div className="flex gap-2">
            {['Active', 'Inactive'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, status: s })}
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
        </F>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Users', 'User Groups']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Layers size={22} className="text-indigo-500" /> User Groups
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Group
          </button>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total',
              value: groups.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Active',
              value: groups.filter((g) => g.status === 'Active').length,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
            {
              label: 'Inactive',
              value: groups.filter((g) => g.status !== 'Active').length,
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
                <Layers size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label} Groups
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table Card ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            {/* Status pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Active', 'Inactive'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${
                      statusFilter === s
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:border-blue-300 bg-white dark:bg-gray-700'
                    }`}
                >
                  {s}
                </button>
              ))}
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                {filtered.length} group{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search groups…"
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
                  {[
                    '#',
                    'Group Name',
                    'Users',
                    'Order',
                    'Status',
                    'Created By',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <Layers
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        No groups found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Try a different filter or add a new group.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((g, i) => (
                    <tr
                      key={g.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {g.name}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {g.description}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {g.users}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {g.ordering}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {g.createdBy}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openView(g)}
                            title="View"
                            className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(g)}
                            title="Edit"
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(g)}
                            title="Delete"
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
              Showing{' '}
              {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{' '}
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
                        ${safePage === p ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
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

        {/* ── ADD Modal ──────────────────────────────────────────────────── */}
        {modal === 'add' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Add New Group
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5">
                <FormBody />
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Create Group
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW Modal ─────────────────────────────────────────────────── */}
        {modal === 'view' && selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Eye size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Group Details
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ['Group Name', selected.name],
                  ['Description', selected.description],
                  ['Total Users', selected.users],
                  ['Ordering', selected.ordering],
                  ['Created By', selected.createdBy],
                  ['Edited By', selected.editedBy],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {val}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    setTimeout(() => openEdit(selected), 60);
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors shadow-sm shadow-amber-200"
                >
                  <Pencil size={13} /> Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT Modal ─────────────────────────────────────────────────── */}
        {modal === 'edit' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Pencil size={13} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Edit Group
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5">
                <FormBody />
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${saving ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Update Group
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE Confirm ─────────────────────────────────────────────── */}
        {deleteTarget && (
          <DeleteConfirm
            group={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={executeDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
