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

// ─── theme tokens function ─────────────────────────────────────────────────
const getTheme = (isDark) => {
  if (isDark) {
    return {
      bg: '#0f172a',
      surface: '#1e293b',
      surfaceHi: '#334155',
      surfaceAlt: '#1a2332',
      border: 'rgba(99,102,241,0.18)',
      borderHover: 'rgba(99,102,241,0.45)',
      borderSubtle: 'rgba(148,163,184,0.15)',
      accent: '#6366f1',
      accentHi: '#818cf8',
      accentLo: 'rgba(99,102,241,0.12)',
      text: '#f1f5f9',
      textMid: '#94a3b8',
      textLo: '#64748b',
      danger: '#ef4444',
      dangerLo: 'rgba(239,68,68,0.12)',
      success: '#10b981',
      successLo: 'rgba(16,185,129,0.12)',
      warn: '#f59e0b',
      warnLo: 'rgba(245,158,11,0.12)',
      overlayBg: 'rgba(0,0,0,0.55)',
      shadow: '0 28px 60px rgba(0,0,0,0.4)',
      shadowMd: '0 10px 35px rgba(0,0,0,0.25)',
      shadowSm: '0 3px 14px rgba(99,102,241,0.35)',
    };
  }

  // Light theme
  return {
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceHi: '#f1f5f9',
    surfaceAlt: '#f9fafb',
    border: 'rgba(99,102,241,0.2)',
    borderHover: 'rgba(99,102,241,0.5)',
    borderSubtle: 'rgba(148,163,184,0.25)',
    accent: '#6366f1',
    accentHi: '#4f46e5',
    accentLo: 'rgba(99,102,241,0.08)',
    text: '#0f172a',
    textMid: '#475569',
    textLo: '#64748b',
    danger: '#dc2626',
    dangerLo: 'rgba(220,38,38,0.08)',
    success: '#059669',
    successLo: 'rgba(5,150,105,0.08)',
    warn: '#d97706',
    warnLo: 'rgba(217,119,6,0.08)',
    overlayBg: 'rgba(0,0,0,0.4)',
    shadow: '0 28px 60px rgba(0,0,0,0.15)',
    shadowMd: '0 10px 35px rgba(0,0,0,0.1)',
    shadowSm: '0 3px 14px rgba(99,102,241,0.25)',
  };
};

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
    permissions: ['View Result', 'Manage Students', 'Grade Assignments', 'Access Library'],
    createdBy: 'Admin',
    createdAt: '2025-01-15 10:32 AM',
    editedBy: 'Admin',
    updatedAt: '2025-01-20 09:45 AM',
  },
  {
    id: 3,
    role: 'Admin',
    permissions: ['Manage Users', 'Payment', 'View Result', 'System Settings', 'Access Library'],
    createdBy: 'System',
    createdAt: '2025-01-10 08:00 AM',
    editedBy: 'System',
    updatedAt: '2025-01-10 08:00 AM',
  },
];

const PREDEFINED_ROLES = [
  { value: 'Student', icon: Users, color: '#10b981' },
  { value: 'Teacher', icon: UserCog, color: '#f59e0b' },
  { value: 'Admin', icon: Shield, color: '#ef4444' },
  { value: 'Staff', icon: Users, color: '#6366f1' },
  { value: 'Guest', icon: Lock, color: '#64748b' },
];

const PERMISSIONS = [
  { id: 'view_result', label: 'View Result', category: 'Academic' },
  { id: 'submit_assignment', label: 'Submit Assignment', category: 'Academic' },
  { id: 'grade_assignments', label: 'Grade Assignments', category: 'Academic' },
  { id: 'manage_students', label: 'Manage Students', category: 'User Management' },
  { id: 'manage_teachers', label: 'Manage Teachers', category: 'User Management' },
  { id: 'manage_users', label: 'Manage Users', category: 'User Management' },
  { id: 'payment', label: 'Payment', category: 'Financial' },
  { id: 'view_reports', label: 'View Reports', category: 'Financial' },
  { id: 'access_library', label: 'Access Library', category: 'Resources' },
  { id: 'manage_library', label: 'Manage Library', category: 'Resources' },
  { id: 'system_settings', label: 'System Settings', category: 'System' },
  { id: 'backup_restore', label: 'Backup & Restore', category: 'System' },
];

// ─── helpers ───────────────────────────────────────────────────────────────
const nextId = (arr) => (arr.length ? Math.max(...arr.map((r) => r.id)) + 1 : 1);

const emptyRole = () => ({
  role: '',
  permissions: [],
});

const formatDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────
const DeleteConfirm = ({ role, onCancel, onConfirm, theme }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: theme.overlayBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(3px)',
    }}
    onClick={onCancel}
  >
    <div
      style={{
        background: theme.surface,
        borderRadius: 18,
        border: `1px solid ${theme.border}`,
        padding: '28px 26px',
        width: '90%',
        maxWidth: 420,
        boxShadow: theme.shadow,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: theme.dangerLo,
          border: `1px solid ${theme.danger}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <AlertTriangle size={24} color={theme.danger} />
      </div>
      <h3
        style={{
          margin: '0 0 8px',
          fontSize: 18,
          fontWeight: 700,
          color: theme.text,
          textAlign: 'center',
        }}
      >
        Delete "{role.role}" Role?
      </h3>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: theme.textMid, textAlign: 'center' }}>
        This will remove all permissions associated with this role. This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: 10,
            border: `1px solid ${theme.borderSubtle}`,
            background: theme.surfaceHi,
            color: theme.textMid,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all .15s',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: theme.danger,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 3px 12px ${theme.danger}40`,
            transition: 'all .15s',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
export default function UserRoleGroupManagement() {
  // Theme state - adjust based on your theme provider
  const [isDark, setIsDark] = useState(true);
  const T = getTheme(isDark);

  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem('roles');
    return stored ? JSON.parse(stored) : seedRoles;
  });

  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyRole());
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  // Persist roles to localStorage
  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [modal]);

  // ── Filtered & Paginated Data ──────────────────────────────────────────
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
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Actions ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyRole());
    setFormErrors({});
    setModal('add');
  };

  const openView = (role) => {
    setSelected(role);
    setModal('view');
  };

  const openEdit = (role) => {
    setSelected(role);
    setForm({ ...role });
    setFormErrors({});
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setFormErrors({});
  };

  const validate = (f) => {
    const errs = {};
    if (!f.role.trim()) errs.role = 'Role name is required.';
    if (f.permissions.length === 0) errs.permissions = 'At least one permission is required.';
    return errs;
  };

  const handleSaveNew = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    // Check for duplicate role
    if (roles.some((r) => r.role.toLowerCase() === form.role.toLowerCase())) {
      showError('A role with this name already exists.');
      return;
    }

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

  const handleSaveEdit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    setRoles((prev) =>
      prev.map((r) =>
        r.id === form.id
          ? {
              ...form,
              editedBy: 'Admin',
              updatedAt: formatDate(),
            }
          : r
      )
    );
    showSuccess('Role updated successfully!');
    closeModal();
  };

  const confirmDelete = (role) => setDeleteTarget(role);

  const executeDelete = () => {
    const newRoles = roles.filter((r) => r.id !== deleteTarget.id);
    setRoles(newRoles);
    setPage((p) => Math.min(p, Math.ceil(newRoles.length / PAGE_SIZE) || 1));
    showSuccess(`"${deleteTarget.role}" role deleted.`);
    setDeleteTarget(null);
  };

  const togglePermission = (permLabel) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(permLabel)
        ? f.permissions.filter((p) => p !== permLabel)
        : [...f.permissions, permLabel],
    }));
  };

  // ── Render Helpers ─────────────────────────────────────────────────────
  const ActionBtn = ({ icon: Icon, color, title, onClick }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: `1px solid ${T.surfaceHi}`,
        background: T.surface,
        color,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.surfaceHi;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 2px 8px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = T.surface;
        e.currentTarget.style.borderColor = T.surfaceHi;
        e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      <Icon size={16} />
    </button>
  );

  const FormField = ({ label, children, error, style }) => (
    <div style={{ marginBottom: 18, ...style }}>
      <label style={{ display: 'block', marginBottom: 7, fontSize: 13, fontWeight: 600, color: T.text }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: T.danger, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertTriangle size={13} />
          {error}
        </div>
      )}
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '10px 13px',
    borderRadius: 10,
    border: `1px solid ${T.borderSubtle}`,
    background: T.surfaceAlt,
    color: T.text,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all .15s',
  };

  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    const grouped = {};
    PERMISSIONS.forEach((perm) => {
      if (!grouped[perm.category]) grouped[perm.category] = [];
      grouped[perm.category].push(perm);
    });
    return grouped;
  }, []);

  // ─── RENDER ────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div style={{ padding: '28px 32px', background: T.bg, minHeight: '100vh' }}>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: T.accentLo,
                  border: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={22} color={T.accent} />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: T.text }}>Role Management</h1>
            </div>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.textLo }}>
              <Link to="/dashboard" style={{ color: T.textLo, textDecoration: 'none' }}>
                Dashboard
              </Link>
              <span>›</span>
              <Link to="/users" style={{ color: T.textLo, textDecoration: 'none' }}>
                Users
              </Link>
              <span>›</span>
              <span style={{ color: T.accent, fontWeight: 600 }}>Role Management</span>
            </div>
          </div>

          <button
            onClick={openAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 11,
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: T.shadowSm,
              transition: 'all .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadowSm)}
          >
            <Plus size={18} />
            Add Role
          </button>
        </div>

        {/* ── Toolbar: Search ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: T.textLo,
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search roles or permissions…"
              style={{
                ...inputStyle,
                paddingLeft: 36,
                height: 40,
              }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
            />
          </div>

          {/* Summary Badge */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: T.surfaceHi,
              border: `1px solid ${T.borderSubtle}`,
              fontSize: 13,
              fontWeight: 600,
              color: T.textMid,
            }}
          >
            {filtered.length} role{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: T.surface,
            borderRadius: 16,
            border: `1px solid ${T.borderSubtle}`,
            overflow: 'hidden',
            boxShadow: isDark ? T.shadowMd : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: T.surfaceHi, borderBottom: `1px solid ${T.borderSubtle}` }}>
                {['#', 'Role', 'Permissions', 'Created By', 'Last Updated', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.textLo,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: 60,
                      textAlign: 'center',
                      color: T.textLo,
                      fontSize: 14,
                    }}
                  >
                    <ShieldCheck size={40} color={T.textLo} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <div>No roles match your search.</div>
                  </td>
                </tr>
              ) : (
                paginated.map((role, i) => {
                  const roleConfig = PREDEFINED_ROLES.find((r) => r.value === role.role);
                  const RoleIcon = roleConfig?.icon || ShieldCheck;
                  const roleColor = roleConfig?.color || T.accent;

                  return (
                    <tr
                      key={role.id}
                      style={{
                        borderBottom: `1px solid ${T.borderSubtle}`,
                        transition: 'background .12s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHi)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 13, color: T.textLo, fontWeight: 600 }}>
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `${roleColor}15`,
                              border: `1px solid ${roleColor}30`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <RoleIcon size={18} color={roleColor} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{role.role}</div>
                            <div style={{ fontSize: 12, color: T.textLo }}>
                              {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 300 }}>
                          {role.permissions.slice(0, 3).map((perm) => (
                            <span
                              key={perm}
                              style={{
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: T.accentLo,
                                border: `1px solid ${T.accent}30`,
                                fontSize: 11,
                                fontWeight: 600,
                                color: T.accent,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: T.surfaceHi,
                                border: `1px solid ${T.borderSubtle}`,
                                fontSize: 11,
                                fontWeight: 600,
                                color: T.textLo,
                              }}
                            >
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: T.textMid }}>{role.createdBy}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: T.textLo }}>{role.updatedAt}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ActionBtn icon={Eye} color={T.accent} title="View" onClick={() => openView(role)} />
                          <ActionBtn icon={Pencil} color={T.warn} title="Edit" onClick={() => openEdit(role)} />
                          <ActionBtn
                            icon={Trash2}
                            color={T.danger}
                            title="Delete"
                            onClick={() => confirmDelete(role)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* ── Pagination ────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '16px 20px',
                borderTop: `1px solid ${T.borderSubtle}`,
                background: T.surfaceHi,
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  ...getStyles(T, isDark).pgBtn,
                  opacity: page === 1 ? 0.35 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    ...getStyles(T, isDark).pgBtn,
                    background: n === page ? T.accent : T.surface,
                    color: n === page ? '#fff' : T.textMid,
                    borderColor: n === page ? T.accent : T.borderSubtle,
                    fontWeight: n === page ? 700 : 500,
                    boxShadow: n === page ? `0 2px 8px ${T.accent}40` : 'none',
                  }}
                >
                  {n}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  ...getStyles(T, isDark).pgBtn,
                  opacity: page === totalPages ? 0.35 : 1,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── ADD Modal ─────────────────────────────────────────────────── */}
        {modal === 'add' && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div
              style={{ ...getStyles(T, isDark).modal, maxWidth: 620 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader title="Add New Role" icon={<Plus size={20} color={T.accentHi} />} onClose={closeModal} theme={T} />

              <FormField label="Role Name" error={formErrors.role}>
                <select
                  style={inputStyle}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                >
                  <option value="">Select a role</option>
                  {PREDEFINED_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.value}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Permissions" error={formErrors.permissions}>
                <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 4 }}>
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: T.textLo,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 8,
                        }}
                      >
                        {category}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                        {perms.map((perm) => {
                          const isChecked = form.permissions.includes(perm.label);
                          return (
                            <label
                              key={perm.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: `1px solid ${isChecked ? T.accent : T.borderSubtle}`,
                                background: isChecked ? T.accentLo : T.surfaceAlt,
                                cursor: 'pointer',
                                transition: 'all .15s',
                                fontSize: 13,
                                fontWeight: 500,
                                color: isChecked ? T.accent : T.text,
                              }}
                              onMouseEnter={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.background = T.surfaceHi;
                                  e.currentTarget.style.borderColor = T.textLo;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.background = T.surfaceAlt;
                                  e.currentTarget.style.borderColor = T.borderSubtle;
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(perm.label)}
                                style={{ display: 'none' }}
                              />
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 4,
                                  border: `2px solid ${isChecked ? T.accent : T.borderSubtle}`,
                                  background: isChecked ? T.accent : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all .15s',
                                }}
                              >
                                {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                              </div>
                              {perm.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </FormField>

              <ModalFooter theme={T} isDark={isDark}>
                <button style={getStyles(T, isDark).btnGhost} onClick={closeModal}>
                  Cancel
                </button>
                <button style={getStyles(T, isDark).btnAccent} onClick={handleSaveNew}>
                  Create Role
                </button>
              </ModalFooter>
            </div>
          </div>
        )}

        {/* ── VIEW Modal ────────────────────────────────────────────────── */}
        {modal === 'view' && selected && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div style={{ ...getStyles(T, isDark).modal, maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
              <ModalHeader title="Role Details" icon={<Eye size={20} color={T.accentHi} />} onClose={closeModal} theme={T} />

              {/* Role Info */}
              <div style={{ marginBottom: 20 }}>
                {[
                  ['Role Name', selected.role],
                  ['Created By', selected.createdBy],
                  ['Created At', selected.createdAt],
                  ['Last Edited By', selected.editedBy],
                  ['Last Updated', selected.updatedAt],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '11px 0',
                      borderBottom: `1px solid ${T.borderSubtle}`,
                    }}
                  >
                    <span style={{ color: T.textLo, fontSize: 13, fontWeight: 600 }}>{label}</span>
                    <span style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>
                  Permissions ({selected.permissions.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.permissions.map((perm) => (
                    <span
                      key={perm}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: T.accentLo,
                        border: `1px solid ${T.accent}30`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.accent,
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <ModalFooter theme={T} isDark={isDark}>
                <button style={getStyles(T, isDark).btnGhost} onClick={closeModal}>
                  Close
                </button>
                <button
                  style={getStyles(T, isDark).btnAccent}
                  onClick={() => {
                    closeModal();
                    setTimeout(() => openEdit(selected), 60);
                  }}
                >
                  Edit
                </button>
              </ModalFooter>
            </div>
          </div>
        )}

        {/* ── EDIT Modal ────────────────────────────────────────────────── */}
        {modal === 'edit' && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div
              style={{ ...getStyles(T, isDark).modal, maxWidth: 620 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader title="Edit Role" icon={<Pencil size={20} color={T.warn} />} onClose={closeModal} theme={T} />

              <FormField label="Role Name">
                <input
                  style={{ ...inputStyle, background: T.surfaceHi, cursor: 'not-allowed' }}
                  value={form.role}
                  disabled
                />
                <div style={{ marginTop: 4, fontSize: 11, color: T.textLo }}>Role name cannot be changed</div>
              </FormField>

              <FormField label="Permissions" error={formErrors.permissions}>
                <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 4 }}>
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: T.textLo,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 8,
                        }}
                      >
                        {category}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                        {perms.map((perm) => {
                          const isChecked = form.permissions.includes(perm.label);
                          return (
                            <label
                              key={perm.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: `1px solid ${isChecked ? T.accent : T.borderSubtle}`,
                                background: isChecked ? T.accentLo : T.surfaceAlt,
                                cursor: 'pointer',
                                transition: 'all .15s',
                                fontSize: 13,
                                fontWeight: 500,
                                color: isChecked ? T.accent : T.text,
                              }}
                              onMouseEnter={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.background = T.surfaceHi;
                                  e.currentTarget.style.borderColor = T.textLo;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.background = T.surfaceAlt;
                                  e.currentTarget.style.borderColor = T.borderSubtle;
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(perm.label)}
                                style={{ display: 'none' }}
                              />
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 4,
                                  border: `2px solid ${isChecked ? T.accent : T.borderSubtle}`,
                                  background: isChecked ? T.accent : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all .15s',
                                }}
                              >
                                {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                              </div>
                              {perm.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </FormField>

              <ModalFooter theme={T} isDark={isDark}>
                <button style={getStyles(T, isDark).btnGhost} onClick={closeModal}>
                  Cancel
                </button>
                <button style={getStyles(T, isDark).btnAccent} onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </ModalFooter>
            </div>
          </div>
        )}

        {/* ── DELETE Confirm ────────────────────────────────────────────── */}
        {deleteTarget && (
          <DeleteConfirm
            role={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={executeDelete}
            theme={T}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Modal Sub-Components ──────────────────────────────────────────────────
function ModalHeader({ title, icon, onClose, theme }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: theme.accentLo,
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.text }}>{title}</h2>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: theme.textLo,
          padding: 4,
          borderRadius: 6,
          transition: 'all .15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.surfaceHi;
          e.currentTarget.style.color = theme.text;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = theme.textLo;
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
}

function ModalFooter({ children, theme, isDark }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 24,
        paddingTop: 20,
        borderTop: `1px solid ${theme.borderSubtle}`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Styles Function ───────────────────────────────────────────────────────
const getStyles = (T, isDark) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    background: T.overlayBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    background: T.surface,
    borderRadius: 20,
    border: `1px solid ${T.border}`,
    padding: '32px 30px',
    width: '90%',
    maxWidth: 480,
    boxShadow: T.shadow,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  btnAccent: {
    padding: '9px 22px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: T.shadowSm,
    transition: 'box-shadow .2s',
  },
  btnGhost: {
    padding: '9px 22px',
    borderRadius: 10,
    border: `1px solid ${T.borderSubtle}`,
    background: T.surfaceHi,
    color: T.textMid,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all .15s',
  },
  pgBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: `1px solid ${T.borderSubtle}`,
    background: T.surface,
    color: T.textMid,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
    boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
  },
});