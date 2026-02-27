// src/pages/super-admin/UserRoleGroupManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  ShieldCheck,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Users,
  Lock,
  UserCog,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { showSuccess, showError } from '../../../utils/toast';

// ─── seed data ─────────────────────────────────────────────────────────────
const seedRoles = [
  {
    id: 1,
    role: 'Student',
    permissions: ['View Result', 'Access Library', 'Submit Assignment'],
    createdBy: 'Admin',
    createdAt: '2025-01-15 10:30 AM',
    editedBy: 'Admin',
    updatedAt: '2025-02-01 02:15 PM',
  },
  {
    id: 2,
    role: 'Teacher',
    permissions: [
      'View Result',
      'Manage Students',
      'Grade Assignments',
      'Access Library',
    ],
    createdBy: 'Admin',
    createdAt: '2025-01-15 10:32 AM',
    editedBy: 'Admin',
    updatedAt: '2025-01-20 09:45 AM',
  },
  {
    id: 3,
    role: 'Admin',
    permissions: [
      'Manage Users',
      'Payment',
      'View Result',
      'System Settings',
      'Access Library',
    ],
    createdBy: 'System',
    createdAt: '2025-01-10 08:00 AM',
    editedBy: 'System',
    updatedAt: '2025-01-10 08:00 AM',
  },
];

const PREDEFINED_ROLES = [
  {
    value: 'Student',
    icon: Users,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    value: 'Teacher',
    icon: UserCog,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    value: 'Admin',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    value: 'Staff',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    value: 'Guest',
    icon: Lock,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-700',
  },
];

const PERMISSIONS = [
  { id: 'view_result', label: 'View Result', category: 'Academic' },
  { id: 'submit_assignment', label: 'Submit Assignment', category: 'Academic' },
  { id: 'grade_assignments', label: 'Grade Assignments', category: 'Academic' },
  {
    id: 'manage_students',
    label: 'Manage Students',
    category: 'User Management',
  },
  {
    id: 'manage_teachers',
    label: 'Manage Teachers',
    category: 'User Management',
  },
  { id: 'manage_users', label: 'Manage Users', category: 'User Management' },
  { id: 'payment', label: 'Payment', category: 'Financial' },
  { id: 'view_reports', label: 'View Reports', category: 'Financial' },
  { id: 'access_library', label: 'Access Library', category: 'Resources' },
  { id: 'manage_library', label: 'Manage Library', category: 'Resources' },
  { id: 'system_settings', label: 'System Settings', category: 'System' },
  { id: 'backup_restore', label: 'Backup & Restore', category: 'System' },
];

const nextId = (arr) =>
  arr.length ? Math.max(...arr.map((r) => r.id)) + 1 : 1;
const emptyRole = () => ({ role: '', permissions: [] });
const formatDate = () =>
  new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) +
  ' ' +
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

// ─── Shared helpers ────────────────────────────────────────────────────────
const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

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

// ─── Permission Checkbox Grid ──────────────────────────────────────────────
function PermissionGrid({ permissions, onChange }) {
  const grouped = useMemo(() => {
    const g = {};
    PERMISSIONS.forEach((p) => {
      if (!g[p.category]) g[p.category] = [];
      g[p.category].push(p);
    });
    return g;
  }, []);

  return (
    <div className="max-h-72 overflow-y-auto pr-1 space-y-4">
      {Object.entries(grouped).map(([category, perms]) => (
        <div key={category}>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
            {category}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {perms.map((perm) => {
              const checked = permissions.includes(perm.label);
              return (
                <label
                  key={perm.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium
                    ${
                      checked
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(perm.label)}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-500'}`}
                  >
                    {checked && (
                      <Check size={10} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  {perm.label}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function UserRoleGroupManagement() {
  const [roles, setRoles] = useState(seedRoles);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyRole());
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const PAGE_SIZE = 6;

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modal]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.role.toLowerCase().includes(q) ||
        r.permissions.some((p) => p.toLowerCase().includes(q)) ||
        r.createdBy.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const openAdd = () => {
    setForm(emptyRole());
    setFormErrors({});
    setModal('add');
  };
  const openView = (r) => {
    setSelected(r);
    setModal('view');
  };
  const openEdit = (r) => {
    setSelected(r);
    setForm({ ...r });
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
    if (!f.role.trim()) e.role = 'Role name is required.';
    if (f.permissions.length === 0)
      e.permissions = 'At least one permission is required.';
    return e;
  };

  const handleSaveNew = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    if (roles.some((r) => r.role.toLowerCase() === form.role.toLowerCase())) {
      showError('A role with this name already exists.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    const now = formatDate();
    setRoles((prev) => [
      ...prev,
      {
        id: nextId(prev),
        ...form,
        createdBy: 'Admin',
        createdAt: now,
        editedBy: 'Admin',
        updatedAt: now,
      },
    ]);
    showSuccess('Role created successfully!');
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
    setRoles((prev) =>
      prev.map((r) =>
        r.id === form.id
          ? { ...form, editedBy: 'Admin', updatedAt: formatDate() }
          : r
      )
    );
    showSuccess('Role updated successfully!');
    closeModal();
  };

  const executeDelete = () => {
    setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setPage((p) => Math.min(p, Math.ceil((roles.length - 1) / PAGE_SIZE) || 1));
    showSuccess(`"${deleteTarget.role}" role deleted.`);
    setDeleteTarget(null);
  };

  const togglePermission = (label) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(label)
        ? f.permissions.filter((p) => p !== label)
        : [...f.permissions, label],
    }));
  };

  // ── Modal template ─────────────────────────────────────────────────────
  function RoleModal({ titleText, headerClass, iconEl, footerBtn, children }) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div
            className={`flex items-center justify-between px-5 py-4 border-b ${headerClass}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                {iconEl}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {titleText}
              </span>
            </div>
            <button
              onClick={closeModal}
              className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
            >
              <X size={14} />
            </button>
          </div>
          {/* scrollable body */}
          <div className="p-5 overflow-y-auto flex-1">{children}</div>
          {/* footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            {footerBtn}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Users', 'Role Management']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ShieldCheck size={22} className="text-indigo-500" /> Role
              Management
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Role
          </button>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Roles',
              value: roles.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Total Permissions',
              value: PERMISSIONS.length,
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
            },
            {
              label: 'Avg. Permissions',
              value: roles.length
                ? Math.round(
                    roles.reduce((a, r) => a + r.permissions.length, 0) /
                      roles.length
                  )
                : 0,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table Card ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <ShieldCheck size={16} className="text-indigo-500" />
              Roles
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                {filtered.length} roles
              </span>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search roles or permissions…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-56 transition-all"
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
                    'Role',
                    'Permissions',
                    'Created By',
                    'Last Updated',
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
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <ShieldCheck
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        No roles match your search
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((role, i) => {
                    const rc = PREDEFINED_ROLES.find(
                      (r) => r.value === role.role
                    );
                    const RoleIcon = rc?.icon || ShieldCheck;
                    return (
                      <tr
                        key={role.id}
                        className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                          {(safePage - 1) * PAGE_SIZE + i + 1}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${rc?.bg || 'bg-gray-100 dark:bg-gray-700'}`}
                            >
                              <RoleIcon
                                size={15}
                                className={rc?.color || 'text-gray-500'}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {role.role}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {role.permissions.length} permission
                                {role.permissions.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm}
                                className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap"
                              >
                                {perm}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {role.createdBy}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400 dark:text-gray-500">
                          {role.updatedAt}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openView(role)}
                              title="View"
                              className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => openEdit(role)}
                              title="Edit"
                              className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(role)}
                              title="Delete"
                              className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
          <RoleModal
            titleText="Add New Role"
            headerClass="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
            iconEl={
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plus size={14} />
              </div>
            }
            footerBtn={
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
                    Create Role
                  </>
                )}
              </button>
            }
          >
            <F label="Role Name" required error={formErrors.role}>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={formErrors.role ? inpErr : inp}
              >
                <option value="">Select a role</option>
                {PREDEFINED_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.value}
                  </option>
                ))}
              </select>
            </F>
            <F label="Permissions" required error={formErrors.permissions}>
              <PermissionGrid
                permissions={form.permissions}
                onChange={togglePermission}
              />
            </F>
          </RoleModal>
        )}

        {/* ── VIEW Modal ─────────────────────────────────────────────────── */}
        {modal === 'view' && selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Eye size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Role Details
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
                <div className="divide-y divide-gray-100 dark:divide-gray-700 mb-4">
                  {[
                    ['Role Name', selected.role],
                    ['Created By', selected.createdBy],
                    ['Created At', selected.createdAt],
                    ['Last Edited By', selected.editedBy],
                    ['Last Updated', selected.updatedAt],
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
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Permissions ({selected.permissions.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
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
          <RoleModal
            titleText="Edit Role"
            headerClass="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
            iconEl={
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Pencil size={13} />
              </div>
            }
            footerBtn={
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
                    Save Changes
                  </>
                )}
              </button>
            }
          >
            <F label="Role Name">
              <input
                value={form.role}
                disabled
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 cursor-not-allowed outline-none"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Role name cannot be changed
              </p>
            </F>
            <F label="Permissions" required error={formErrors.permissions}>
              <PermissionGrid
                permissions={form.permissions}
                onChange={togglePermission}
              />
            </F>
          </RoleModal>
        )}

        {/* ── DELETE Confirm ─────────────────────────────────────────────── */}
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
                Delete Role?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  "{deleteTarget.role}"
                </span>{' '}
                and all its permissions will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
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
