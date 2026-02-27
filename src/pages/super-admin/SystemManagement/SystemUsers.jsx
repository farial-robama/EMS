import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight as CRight,
  Users,
} from 'lucide-react';

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

const inp = (
  err
) => `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;
const selCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';

const USER_GROUPS = ['Admin', 'Teacher', 'Student', 'Accountant', 'Guest'];
const PER_PAGES = [5, 10, 25, 50];

const GROUP_STYLE = {
  Admin:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Teacher: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Student:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Accountant:
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Guest: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
};

let nextId = 7;

const INITIAL_USERS = [
  {
    id: 1,
    group: 'Admin',
    username: 'superman',
    name: 'Super Admin',
    email: 'super@demo.com',
    mobile: '01700000001',
    status: 'Active',
  },
  {
    id: 2,
    group: 'Admin',
    username: 'admin',
    name: 'Admin',
    email: 'admin@email.com',
    mobile: '01700000002',
    status: 'Active',
  },
  {
    id: 3,
    group: 'Teacher',
    username: 'admission_admin',
    name: 'Admission Admin',
    email: 'info@admission.com',
    mobile: '01700000003',
    status: 'Active',
  },
  {
    id: 4,
    group: 'Teacher',
    username: 'teacher_jahan',
    name: 'Jahan Ara',
    email: 'jahan@school.com',
    mobile: '01711223344',
    status: 'Active',
  },
  {
    id: 5,
    group: 'Student',
    username: 'stu_sojib',
    name: 'Md. Sojibul',
    email: 'sojib@mail.com',
    mobile: '01812345678',
    status: 'Inactive',
  },
  {
    id: 6,
    group: 'Guest',
    username: 'guest_user',
    name: 'Guest User',
    email: '',
    mobile: '',
    status: 'Inactive',
  },
];

const EMPTY_FORM = {
  group: '',
  username: '',
  name: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: 'Active',
};

const F = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

export default function UserList() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const filtered = users.filter(
    (u) =>
      (filterGroup === '' || u.group === filterGroup) &&
      (u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const current = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  };

  const validate = (isEdit = false) => {
    const e = {};
    if (!form.group) e.group = 'Required';
    if (!form.username) e.username = 'Required';
    if (!form.name) e.name = 'Required';
    if (!isEdit) {
      if (!form.password) e.password = 'Required';
      if (form.password !== form.confirmPassword)
        e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setModal('add');
  };

  const handleAdd = () => {
    const errs = validate(false);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setUsers((prev) => [...prev, { ...form, id: nextId++ }]);
    setModal(null);
    showToast('User added successfully.');
  };

  const openEdit = (user) => {
    setSelected(user);
    setForm({ ...user, password: '', confirmPassword: '' });
    setErrors({});
    setModal('edit');
  };

  const handleEdit = () => {
    const errs = validate(true);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === selected.id ? { ...form, id: selected.id } : u))
    );
    setModal(null);
    showToast('User updated successfully.');
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selected.id));
    setModal(null);
    showToast('User deleted.');
  };

  const initials = (name) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const UserForm = ({ isEdit }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <F label="User Group" required error={errors.group}>
        <select
          name="group"
          value={form.group}
          onChange={handleChange}
          className={selCls}
        >
          <option value="">Select Group</option>
          {USER_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </F>
      <F label="Username" required error={errors.username}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="e.g. john_doe"
          className={inp(errors.username)}
        />
      </F>
      <F label="Full Name" required error={errors.name}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Display name"
          className={inp(errors.name)}
        />
      </F>
      <F label="Mobile">
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="01XXXXXXXXX"
          className={inp(false)}
        />
      </F>
      <F label="Email">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="user@email.com"
          className={inp(false)}
        />
      </F>
      <F label="Status">
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={selCls}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </F>
      {!isEdit && (
        <>
          <F label="Password" required error={errors.password}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className={inp(errors.password)}
            />
          </F>
          <F label="Confirm Password" required error={errors.confirmPassword}>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className={inp(errors.confirmPassword)}
            />
          </F>
        </>
      )}
    </div>
  );

  const Modal = ({ children, maxW = 'max-w-2xl' }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full ${maxW} max-h-[90vh] overflow-auto`}
      >
        {children}
      </div>
    </div>
  );

  const ModalHeader = ({ icon: Icon, iconColor, title, onClose }) => (
    <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <Icon size={14} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb
            items={['Dashboard', 'System Management', 'User Lists']}
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> New User
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Users',
              val: users.length,
              color:
                'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
              vc: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Active',
              val: users.filter((u) => u.status === 'Active').length,
              color:
                'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
              vc: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Inactive',
              val: users.filter((u) => u.status === 'Inactive').length,
              color:
                'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
              vc: 'text-amber-700 dark:text-amber-400',
            },
            {
              label: 'Admins',
              val: users.filter((u) => u.group === 'Admin').length,
              color:
                'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
              vc: 'text-purple-700 dark:text-purple-400',
            },
          ].map((s) => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <Users size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                User Lists
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterGroup}
                onChange={(e) => {
                  setFilterGroup(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
              >
                <option value="">All Groups</option>
                {USER_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                Show
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                >
                  {PER_PAGES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search users…"
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-44"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'User',
                    'Group',
                    'Email',
                    'Mobile',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  current.map((user, i) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${GROUP_STYLE[user.group] || 'bg-gray-100 text-gray-500'}`}
                        >
                          {user.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {user.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {user.mobile || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelected(user);
                              setModal('view');
                            }}
                            className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setSelected(user);
                              setModal('delete');
                            }}
                            className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
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

          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}
              –{Math.min(safePage * perPage, filtered.length)} of{' '}
              {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '…' ? (
                    <span
                      key={`e${idx}`}
                      className="w-8 flex items-center justify-center text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === safePage ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CRight size={15} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                »
              </button>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {modal === 'add' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                    <Plus size={14} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Add New User
                  </h3>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-5">
                <UserForm isEdit={false} />
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {modal === 'edit' && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300">
                    <Edit2 size={14} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Edit — {selected.name}
                  </h3>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-5">
                <UserForm isEdit={true} />
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {modal === 'view' && selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                    <Eye size={14} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    User Details
                  </h3>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {initials(selected.name)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {selected.name}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      @{selected.username}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${GROUP_STYLE[selected.group] || ''}`}
                    >
                      {selected.group}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Email', val: selected.email || '—' },
                    { label: 'Mobile', val: selected.mobile || '—' },
                    { label: 'Status', val: selected.status },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
                    >
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-20 flex-shrink-0">
                        {r.label}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {r.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => openEdit(selected)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">
                Delete User?
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {selected.name}
                </span>{' '}
                (@{selected.username}) will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
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
