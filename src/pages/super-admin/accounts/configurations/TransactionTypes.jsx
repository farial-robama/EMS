import React, { useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Tag,
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

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed';
const selCls = inp;

const INITIAL_TYPES = [
  { id: 1, title: 'Income', status: 'Active' },
  { id: 2, title: 'Expense', status: 'Active' },
  { id: 3, title: 'Assets', status: 'Active' },
  { id: 4, title: 'Liabilities', status: 'Active' },
];

const EMPTY = { id: null, title: '', status: 'Active' };

export default function TransactionTypes() {
  const [types, setTypes] = useState(INITIAL_TYPES);
  const [form, setForm] = useState(EMPTY);
  const [mode, setMode] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setMode('add');
    setForm(EMPTY);
    setErrors({});
    setShowForm(true);
  };
  const openView = (t) => {
    setMode('view');
    setForm(t);
    setErrors({});
    setShowForm(true);
  };
  const openEdit = (t) => {
    setMode('edit');
    setForm(t);
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTypes((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
    showToast('Transaction type deleted.');
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (mode === 'add') {
      setTypes((prev) => [...prev, { ...form, id: Date.now() }]);
      showToast('Transaction type added.');
    } else {
      setTypes((prev) => prev.map((t) => (t.id === form.id ? form : t)));
      showToast('Transaction type updated.');
    }
    setShowForm(false);
  };

  const toggleStatus = (id) =>
    setTypes((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' }
          : t
      )
    );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Types']} />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Transaction Type
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ {toast}
          </div>
        )}

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Total Types',
              val: types.length,
              color:
                'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
              vc: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Active',
              val: types.filter((t) => t.status === 'Active').length,
              color:
                'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
              vc: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Inactive',
              val: types.filter((t) => t.status === 'Inactive').length,
              color:
                'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600',
              vc: 'text-gray-600 dark:text-gray-400',
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

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300">
              <Tag size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Transaction Types
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium ml-auto">
              {types.length} types
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Transaction Type Title', 'Status', 'Action'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {types.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      No transaction types found
                    </td>
                  </tr>
                ) : (
                  types.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {t.title[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {t.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleStatus(t.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer
                          ${
                            t.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {t.status === 'Active' ? (
                            <ToggleRight size={14} />
                          ) : (
                            <ToggleLeft size={14} />
                          )}
                          {t.status}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openView(t)}
                            className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(t)}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteId(t.id)}
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

        {/* ── Add/Edit/View Modal ─────────────────────────────────────────── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View'}{' '}
                  Transaction Type
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Transaction Type Title{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    disabled={mode === 'view'}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className={inp}
                    placeholder="e.g. Income"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={form.status}
                    disabled={mode === 'view'}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className={selCls}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X size={14} /> {mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {mode !== 'view' && (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Save size={14} /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm Modal ────────────────────────────────────────── */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">
                Delete Transaction Type?
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {types.find((t) => t.id === deleteId)?.title}
                </span>
                " will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
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
