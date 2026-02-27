import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  Menu,
  LayoutList,
  GitBranch,
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
  ${err ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;
const selCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';

let nextId = 5;

const INITIAL_MENUS = [
  {
    id: 1,
    name: 'Dashboard',
    controller: 'Dashboard',
    method: 'index',
    parent: '',
    children: 0,
    status: 'Active',
    icon: 'LayoutDashboard',
  },
  {
    id: 2,
    name: 'System Management',
    controller: 'System',
    method: 'index',
    parent: '',
    children: 2,
    status: 'Active',
    icon: 'Settings',
  },
  {
    id: 3,
    name: 'User Management',
    controller: 'UserGroups',
    method: 'index',
    parent: 'System Management',
    children: 4,
    status: 'Inactive',
    icon: 'Users',
  },
  {
    id: 4,
    name: 'Logout',
    controller: 'Dashboard',
    method: 'logout',
    parent: '',
    children: 0,
    status: 'Active',
    icon: 'LogOut',
  },
];

const ICON_OPTIONS = [
  'LayoutDashboard',
  'Settings',
  'Users',
  'FileText',
  'BookOpen',
  'Bell',
  'LogOut',
  'Home',
  'Shield',
  'Database',
  'BarChart',
  'Mail',
  'Calendar',
  'CreditCard',
  'Layers',
];
const EMPTY_FORM = {
  name: '',
  controller: '',
  method: '',
  parent: '',
  icon: 'FileText',
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

export default function MenuBuilder() {
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.controller.trim()) e.controller = 'Required';
    if (!form.method.trim()) e.method = 'Required';
    return e;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setModal('add');
  };

  const openEdit = (menu) => {
    setSelected(menu);
    setForm({
      name: menu.name,
      controller: menu.controller,
      method: menu.method,
      parent: menu.parent || '',
      icon: menu.icon || 'FileText',
      status: menu.status,
    });
    setErrors({});
    setModal('edit');
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (modal === 'add') {
      setMenus((prev) => [...prev, { ...form, id: nextId++, children: 0 }]);
      showToast('Menu item added successfully.');
    } else {
      setMenus((prev) =>
        prev.map((m) => (m.id === selected.id ? { ...m, ...form } : m))
      );
      showToast('Menu item updated successfully.');
    }
    setModal(null);
  };

  const handleDelete = () => {
    setMenus((prev) => prev.filter((m) => m.id !== selected.id));
    setModal(null);
    showToast('Menu item deleted.');
  };

  const MenuForm = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <F label="Menu Name" required error={errors.name}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Dashboard"
          className={inp(errors.name)}
        />
      </F>
      <F label="Controller" required error={errors.controller}>
        <input
          name="controller"
          value={form.controller}
          onChange={handleChange}
          placeholder="e.g. Dashboard"
          className={inp(errors.controller)}
        />
      </F>
      <F label="Method / Route" required error={errors.method}>
        <input
          name="method"
          value={form.method}
          onChange={handleChange}
          placeholder="e.g. index"
          className={inp(errors.method)}
        />
      </F>
      <F label="Parent Menu">
        <select
          name="parent"
          value={form.parent}
          onChange={handleChange}
          className={selCls}
        >
          <option value="">— None (Top Level) —</option>
          {menus
            .filter((m) => m.id !== selected?.id)
            .map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
        </select>
      </F>
      <F label="Icon">
        <select
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className={selCls}
        >
          {ICON_OPTIONS.map((ic) => (
            <option key={ic} value={ic}>
              {ic}
            </option>
          ))}
        </select>
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
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb
            items={['Dashboard', 'System Management', 'Menu Builder']}
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Menu
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Total Menus',
              val: menus.length,
              color:
                'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
              vc: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Active',
              val: menus.filter((m) => m.status === 'Active').length,
              color:
                'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
              vc: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'With Children',
              val: menus.filter((m) => m.children > 0).length,
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

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 flex items-center gap-2.5">
          <GitBranch size={15} className="text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Build and manage your menu structure with parent-child
            relationships. Set controllers and methods to link menus to routes.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Menu size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Menu Hierarchy
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium ml-auto">
              {menus.length} items
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Menu Name',
                    'Controller',
                    'Method',
                    'Parent',
                    'Children',
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
                {menus.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  menus.map((menu, i) => (
                    <tr
                      key={menu.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${menu.parent ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 ml-4' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}
                          >
                            <LayoutList size={13} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              {menu.name}
                            </p>
                            {menu.parent && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                ↳ {menu.parent}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-500 dark:text-gray-400">
                        {menu.controller}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-500 dark:text-gray-400">
                        {menu.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {menu.parent || (
                          <span className="text-gray-300 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {menu.children > 0 ? (
                          <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                            {menu.children}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">
                            0
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${menu.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                        >
                          {menu.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelected(menu);
                              setModal('view');
                            }}
                            className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(menu)}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setSelected(menu);
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
        </div>

        {/* Add/Edit Modal */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${modal === 'add' ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' : 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300'}`}
                  >
                    {modal === 'add' ? <Plus size={14} /> : <Edit2 size={14} />}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {modal === 'add'
                      ? 'Add Menu Item'
                      : `Edit — ${selected?.name}`}
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
                <MenuForm />
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
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
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Menu Details
                </h3>
                <button
                  onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { label: 'Name', val: selected.name },
                  { label: 'Controller', val: selected.controller },
                  { label: 'Method', val: selected.method },
                  { label: 'Parent', val: selected.parent || '— None —' },
                  { label: 'Children', val: selected.children },
                  { label: 'Icon', val: selected.icon },
                  { label: 'Status', val: selected.status },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
                  >
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-24 flex-shrink-0">
                      {r.label}
                    </span>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-200">
                      {r.val}
                    </span>
                  </div>
                ))}
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
                  Edit
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
                Delete Menu Item?
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {selected.name}
                </span>
                " will be permanently removed. Any child menus may be affected.
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
