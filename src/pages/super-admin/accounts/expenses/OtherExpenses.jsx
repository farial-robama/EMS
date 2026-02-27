import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const initialExpenses = [
  {
    id: 1,
    invoiceNo: 'EXP-001',
    partner: 'Stationery Supplier',
    purpose: 'Stationery Purchase',
    accountant: 'Md. Hossain',
    date: '2025-12-01',
    amount: 5000,
  },
  {
    id: 2,
    invoiceNo: 'EXP-002',
    partner: 'Electricity Board',
    purpose: 'Monthly Bill',
    accountant: 'Md. Hossain',
    date: '2025-12-05',
    amount: 12000,
  },
  {
    id: 3,
    invoiceNo: 'EXP-003',
    partner: 'Water Authority',
    purpose: 'Water Bill',
    accountant: 'Md. Karim',
    date: '2025-12-08',
    amount: 3500,
  },
  {
    id: 4,
    invoiceNo: 'EXP-004',
    partner: 'Cleaning Services',
    purpose: 'Monthly Cleaning',
    accountant: 'Md. Hossain',
    date: '2025-12-10',
    amount: 8000,
  },
  {
    id: 5,
    invoiceNo: 'EXP-005',
    partner: 'IT Vendor',
    purpose: 'Software License',
    accountant: 'Md. Karim',
    date: '2025-12-12',
    amount: 15000,
  },
  {
    id: 6,
    invoiceNo: 'EXP-006',
    partner: 'Transport Co.',
    purpose: 'Vehicle Fuel',
    accountant: 'Md. Hossain',
    date: '2025-12-15',
    amount: 6500,
  },
  {
    id: 7,
    invoiceNo: 'EXP-007',
    partner: 'Print House',
    purpose: 'Printing Materials',
    accountant: 'Md. Karim',
    date: '2025-12-18',
    amount: 4200,
  },
  {
    id: 8,
    invoiceNo: 'EXP-008',
    partner: 'Furniture Store',
    purpose: 'Office Furniture',
    accountant: 'Md. Hossain',
    date: '2025-12-20',
    amount: 22000,
  },
];

const nextId = (arr) =>
  arr.length ? Math.max(...arr.map((e) => e.id)) + 1 : 1;
const BLANK = {
  invoiceNo: '',
  partner: '',
  purpose: '',
  accountant: '',
  date: '',
  amount: '',
};

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer'
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
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function OtherExpenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modal, setModal] = useState(null); // null | 'add' | expense obj
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      expenses.filter(
        (e) =>
          e.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          e.partner.toLowerCase().includes(search.toLowerCase()) ||
          e.purpose.toLowerCase().includes(search.toLowerCase())
      ),
    [expenses, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);

  const openAdd = () => {
    setForm(BLANK);
    setErrors({});
    setModal('add');
  };
  const openEdit = (e) => {
    setForm({ ...e });
    setErrors({});
    setModal(e);
  };
  const closeModal = () => {
    setModal(null);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.invoiceNo.trim()) e.invoiceNo = 'Required';
    if (!form.partner.trim()) e.partner = 'Required';
    if (!form.purpose.trim()) e.purpose = 'Required';
    if (!form.accountant.trim()) e.accountant = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.amount) e.amount = 'Required';
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
      setExpenses((p) => [
        ...p,
        { id: nextId(p), ...form, amount: parseFloat(form.amount) },
      ]);
    } else {
      setExpenses((p) =>
        p.map((e) =>
          e.id === modal.id
            ? { ...form, id: modal.id, amount: parseFloat(form.amount) }
            : e
        )
      );
    }
    closeModal();
  };

  const executeDelete = () => {
    setExpenses((p) => p.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Accounts', 'Other Expenses']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Receipt size={22} className="text-orange-500" /> Other Expense
              List
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Expense
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Expenses',
              value: expenses.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Filtered',
              value: filtered.length,
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
            },
            {
              label: 'Total Amount',
              value: `৳${totalAmount.toLocaleString()}`,
              bg: 'bg-orange-50 dark:bg-orange-900/20',
              ic: 'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <DollarSign size={18} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
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
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
              >
                {[10, 25, 50].map((n) => (
                  <option key={n}>{n}</option>
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
                placeholder="Search invoice, partner, purpose…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-60 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Invoice No',
                    'Transaction Partner',
                    'Transaction Purpose',
                    'Accountant',
                    'Invoice Date',
                    'Amount (৳)',
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
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <Receipt
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No expenses found
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((e, i) => (
                    <tr
                      key={e.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-lg">
                          {e.invoiceNo}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {e.partner}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {e.purpose}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {e.accountant}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {e.date}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-800 dark:text-gray-100">
                        ৳{e.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(e)}
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(e)}
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {paged.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                    <td
                      colSpan={6}
                      className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase"
                    >
                      Page Total
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                      ৳
                      {paged.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
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
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
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
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ADD / EDIT Modal */}
        {modal !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between px-5 py-4 border-b ${modal === 'add' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${modal === 'add' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'}`}
                  >
                    {modal === 'add' ? (
                      <Plus size={14} />
                    ) : (
                      <Pencil size={13} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {modal === 'add' ? 'Add New Expense' : 'Edit Expense'}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Invoice No" required error={errors.invoiceNo}>
                  <input
                    value={form.invoiceNo}
                    onChange={(e) => handleChange('invoiceNo', e.target.value)}
                    placeholder="EXP-001"
                    className={errors.invoiceNo ? inpErr : inp}
                  />
                </F>
                <F label="Invoice Date" required error={errors.date}>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={errors.date ? inpErr : inp}
                  />
                </F>
                <F label="Transaction Partner" required error={errors.partner}>
                  <input
                    value={form.partner}
                    onChange={(e) => handleChange('partner', e.target.value)}
                    placeholder="Partner name"
                    className={errors.partner ? inpErr : inp}
                  />
                </F>
                <F label="Transaction Purpose" required error={errors.purpose}>
                  <input
                    value={form.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    placeholder="Purpose"
                    className={errors.purpose ? inpErr : inp}
                  />
                </F>
                <F label="Accountant" required error={errors.accountant}>
                  <input
                    value={form.accountant}
                    onChange={(e) => handleChange('accountant', e.target.value)}
                    placeholder="Accountant name"
                    className={errors.accountant ? inpErr : inp}
                  />
                </F>
                <F label="Amount (৳)" required error={errors.amount}>
                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    className={errors.amount ? inpErr : inp}
                  />
                </F>
              </div>
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
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${saving ? 'bg-blue-400 cursor-not-allowed' : modal === 'add' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      {modal === 'add' ? 'Save Expense' : 'Update Expense'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
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
                Delete Expense?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  "{deleteTarget.invoiceNo}"
                </span>{' '}
                will be permanently removed.
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
