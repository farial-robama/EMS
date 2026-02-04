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
    description: 'Full system administration access'
  },
  {
    id: 2,
    name: 'Teacher',
    users: 18,
    ordering: 2,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'Teacher panel with class management'
  },
  {
    id: 3,
    name: 'Student',
    users: 320,
    ordering: 3,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'Student panel for results & library'
  },
  {
    id: 4,
    name: 'Guest',
    users: 12,
    ordering: 4,
    status: 'Inactive',
    createdBy: 'Teacher',
    editedBy: 'Admin',
    description: 'Limited read-only guest access'
  },
  {
    id: 5,
    name: 'Staff',
    users: 7,
    ordering: 5,
    status: 'Active',
    createdBy: 'Admin',
    editedBy: 'Admin',
    description: 'General staff operations'
  },
];

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

// ─── tiny helpers ──────────────────────────────────────────────────────────
const nextId = (arr) => (arr.length ? Math.max(...arr.map((g) => g.id)) + 1 : 1);
const emptyGroup = (ordering) => ({
  name: '',
  users: 0,
  ordering,
  status: 'Active',
  description: '',
  createdBy: 'Admin',
  editedBy: 'Admin',
});

// ─── Confirm-delete overlay ───────────────────────────────────────────────
const DeleteConfirm = ({ group, onCancel, onConfirm, theme }) => (
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
      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: theme.text, textAlign: 'center' }}>
        Delete "{group.name}"?
      </h3>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: theme.textMid, textAlign: 'center' }}>
        This action cannot be undone.
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.surfaceAlt;
            e.currentTarget.style.borderColor = theme.textLo;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.surfaceHi;
            e.currentTarget.style.borderColor = theme.borderSubtle;
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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 5px 18px ${theme.danger}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 3px 12px ${theme.danger}40`;
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────
export default function UserGroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(seedGroups);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Detect theme - adjust this based on your theme context/provider
  const [isDark, setIsDark] = useState(true); // Toggle this or use context
  const T = getTheme(isDark);

  // modal states
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyGroup(1));
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // pagination
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // ── derived / filtered list ───────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups
      .filter((g) => statusFilter === 'All' || g.status === statusFilter)
      .filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
      .sort((a, b) => a.ordering - b.ordering);
  }, [groups, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── actions ────────────────────────────────────────────────────────────
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
    const errs = {};
    if (!f.name.trim()) errs.name = 'Group name is required.';
    if (!f.description.trim()) errs.description = 'Description is required.';
    if (!f.ordering || f.ordering < 1) errs.ordering = 'Must be ≥ 1.';
    return errs;
  };

  const handleSaveNew = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setGroups((prev) => [...prev, { ...form, id: nextId(prev), users: 0 }]);
    showSuccess('Group created successfully!');
    closeModal();
  };

  const handleSaveEdit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setGroups((prev) => prev.map((g) => (g.id === form.id ? { ...form, editedBy: 'Admin' } : g)));
    showSuccess('Group updated successfully!');
    closeModal();
  };

  const confirmDelete = (g) => setDeleteTarget(g);
  
  const executeDelete = () => {
    setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    showSuccess(`"${deleteTarget.name}" group deleted.`);
    setDeleteTarget(null);
  };

  // ── render helpers ─────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 20,
          background: isActive ? T.successLo : T.warnLo,
          border: `1px solid ${isActive ? T.success : T.warn}33`,
          fontSize: 12,
          fontWeight: 600,
          color: isActive ? T.success : T.warn,
        }}
      >
        {isActive ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
        {status}
      </div>
    );
  };

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

  // ── form field shared ───────────────────────────────────────────────────
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

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div style={{ padding: '28px 32px', background: T.bg, minHeight: '100vh' }}>
        {/* ── page header ────────────────────────────────────────────────── */}
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
                <Layers size={22} color={T.accent} />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: T.text }}>User Groups</h1>
            </div>

            {/* breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.textLo }}>
              <Link to="/dashboard" style={{ color: T.textLo, textDecoration: 'none' }}>
                Dashboard
              </Link>
              <span>›</span>
              <Link to="/users" style={{ color: T.textLo, textDecoration: 'none' }}>
                Users
              </Link>
              <span>›</span>
              <span style={{ color: T.accent, fontWeight: 600 }}>User Groups</span>
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
            Add Group
          </button>
        </div>

        {/* ── toolbar: search + filter ──────────────────────────────────── */}
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
          {/* search box */}
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
              placeholder="Search groups…"
              style={{
                ...inputStyle,
                paddingLeft: 36,
                height: 40,
              }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
            />
          </div>

          {/* status pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {['All', 'Active', 'Inactive'].map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: `1px solid ${active ? T.accent : T.borderSubtle}`,
                    background: active ? T.accentLo : T.surface,
                    color: active ? T.accentHi : T.textMid,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all .18s',
                    boxShadow: active ? `0 2px 8px ${T.accent}20` : 'none',
                  }}
                >
                  {s}
                </button>
              );
            })}

            {/* summary badge */}
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
              {filtered.length} group{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ── table ─────────────────────────────────────────────────────── */}
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
                {['#', 'Group Name', 'Users', 'Order', 'Status', 'Created By', 'Actions'].map((h) => (
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
                    colSpan={7}
                    style={{
                      padding: 60,
                      textAlign: 'center',
                      color: T.textLo,
                      fontSize: 14,
                    }}
                  >
                    <Layers size={40} color={T.textLo} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <div>No groups match your filter.</div>
                  </td>
                </tr>
              ) : (
                paginated.map((g, i) => (
                  <tr
                    key={g.id}
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
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 3 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: T.textLo }}>{g.description}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: T.textMid, fontWeight: 600 }}>
                      {g.users}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: T.textMid, fontWeight: 600 }}>
                      {g.ordering}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={g.status} />
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: T.textMid }}>{g.createdBy}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn icon={Eye} color={T.accent} title="View" onClick={() => openView(g)} />
                        <ActionBtn icon={Pencil} color={T.warn} title="Edit" onClick={() => openEdit(g)} />
                        <ActionBtn icon={Trash2} color={T.danger} title="Delete" onClick={() => confirmDelete(g)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── pagination ────────────────────────────────────────────── */}
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

        {/* ── ADD modal ─────────────────────────────────────────────────── */}
        {modal === 'add' && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div style={getStyles(T, isDark).modal} onClick={(e) => e.stopPropagation()}>
              <ModalHeader
                title="Add New Group"
                icon={<Plus size={20} color={T.accentHi} />}
                onClose={closeModal}
                theme={T}
              />

              <FormField label="Group Name" error={formErrors.name}>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Librarian"
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                />
              </FormField>

              <FormField label="Description" error={formErrors.description}>
                <textarea
                  style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of this group"
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                />
              </FormField>

              <div style={{ display: 'flex', gap: 16 }}>
                <FormField label="Ordering" error={formErrors.ordering} style={{ flex: 1 }}>
                  <input
                    type="number"
                    min={1}
                    style={inputStyle}
                    value={form.ordering}
                    onChange={(e) => setForm({ ...form, ordering: parseInt(e.target.value) || 0 })}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    style={{ ...inputStyle, appearance: 'auto' }}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormField>
              </div>

              <ModalFooter theme={T} isDark={isDark}>
                <button style={getStyles(T, isDark).btnGhost} onClick={closeModal}>
                  Cancel
                </button>
                <button style={getStyles(T, isDark).btnAccent} onClick={handleSaveNew}>
                  Create Group
                </button>
              </ModalFooter>
            </div>
          </div>
        )}

        {/* ── VIEW modal ────────────────────────────────────────────────── */}
        {modal === 'view' && selected && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div style={getStyles(T, isDark).modal} onClick={(e) => e.stopPropagation()}>
              <ModalHeader
                title="Group Details"
                icon={<Eye size={20} color={T.accentHi} />}
                onClose={closeModal}
                theme={T}
              />

              {[
                ['Group Name', selected.name],
                ['Description', selected.description],
                ['Total Users', selected.users],
                ['Ordering', selected.ordering],
                ['Status', selected.status],
                ['Created By', selected.createdBy],
                ['Edited By', selected.editedBy],
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
                  <span style={{ color: T.text, fontSize: 13, fontWeight: label === 'Status' ? 400 : 500 }}>
                    {label === 'Status' ? <StatusBadge status={val} /> : val}
                  </span>
                </div>
              ))}

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

        {/* ── EDIT modal ────────────────────────────────────────────────── */}
        {modal === 'edit' && (
          <div style={getStyles(T, isDark).overlay} onClick={closeModal}>
            <div style={getStyles(T, isDark).modal} onClick={(e) => e.stopPropagation()}>
              <ModalHeader title="Edit Group" icon={<Pencil size={20} color={T.warn} />} onClose={closeModal} theme={T} />

              <FormField label="Group Name" error={formErrors.name}>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                />
              </FormField>

              <FormField label="Description" error={formErrors.description}>
                <textarea
                  style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                />
              </FormField>

              <div style={{ display: 'flex', gap: 16 }}>
                <FormField label="Ordering" error={formErrors.ordering}>
                  <input
                    type="number"
                    min={1}
                    style={inputStyle}
                    value={form.ordering}
                    onChange={(e) => setForm({ ...form, ordering: parseInt(e.target.value) || 0 })}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.borderSubtle)}
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    style={{ ...inputStyle, appearance: 'auto' }}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormField>
              </div>

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

        {/* ── DELETE confirm ────────────────────────────────────────────── */}
        {deleteTarget && (
          <DeleteConfirm
            group={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={executeDelete}
            theme={T}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── tiny shared modal sub-components ──────────────────────────────────────
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

// ─── static styles function ────────────────────────────────────────────────
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