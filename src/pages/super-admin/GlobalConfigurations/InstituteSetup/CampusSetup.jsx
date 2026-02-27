// src/pages/super-admin/globalConfigurations/instituteSetup/CampusSetup.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  Building2,
  Plus,
  Search,
  Pencil,
  X,
  Check,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

const INITIAL = [
  {
    id: 1,
    name: 'Magura Collectorate Collegiate School',
    code: 'magura-collectorate-collegiate-school',
    status: 'Active',
    reportDate: '2025-01-10',
  },
  {
    id: 2,
    name: 'Dhaka Model College',
    code: 'dhaka-model-college',
    status: 'Active',
    reportDate: '2025-02-01',
  },
  {
    id: 3,
    name: 'Chittagong City Campus',
    code: 'chittagong-city-campus',
    status: 'Inactive',
    reportDate: '2025-03-15',
  },
];

const EMPTY = {
  name: '',
  status: 'Active',
  reportDate: new Date().toISOString().slice(0, 10),
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ mode, data, errors, onChange, onSave, onClose }) {
  const isEdit = mode === 'edit';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
            {isEdit ? <Pencil size={15} /> : <Plus size={15} />}
            {isEdit ? 'Edit Campus' : 'Add New Campus'}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Campus Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Campus Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Dhaka Main Campus"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
                ${
                  errors.name
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
                }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.name}
              </p>
            )}
          </div>

          {/* Auto code preview */}
          {data.name.trim() && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Campus Code (auto-generated)
              </label>
              <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 font-mono text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                {slugify(data.name)}
              </div>
            </div>
          )}

          {/* Report Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Report Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.reportDate}
              onChange={(e) => onChange('reportDate', e.target.value)}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
                ${
                  errors.reportDate
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
                }`}
            />
            {errors.reportDate && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.reportDate}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <select
              value={data.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            <Check size={14} />
            {isEdit ? 'Update Campus' : 'Add Campus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CampusSetup() {
  const [campuses, setCampuses] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { mode, data }
  const [errors, setErrors] = useState({});

  const totalCount = campuses.length;
  const activeCount = campuses.filter((c) => c.status === 'Active').length;
  const inactiveCount = campuses.filter((c) => c.status === 'Inactive').length;

  const filtered = useMemo(
    () =>
      campuses.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [campuses, search]
  );

  const validate = (d) => {
    const e = {};
    if (!d.name.trim()) e.name = 'Campus name is required.';
    else if (d.name.trim().length < 3) e.name = 'Minimum 3 characters.';
    if (!d.reportDate) e.reportDate = 'Report date is required.';
    return e;
  };

  const openAdd = () => {
    setErrors({});
    setModal({ mode: 'add', data: { ...EMPTY } });
  };
  const openEdit = (c) => {
    setErrors({});
    setModal({ mode: 'edit', data: { ...c } });
  };
  const close = () => setModal(null);

  const handleChange = (field, value) => {
    setModal((p) => ({ ...p, data: { ...p.data, [field]: value } }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSave = () => {
    const e = validate(modal.data);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (
      !window.confirm(
        modal.mode === 'add' ? 'Add this campus?' : 'Update this campus?'
      )
    )
      return;

    if (modal.mode === 'add') {
      setCampuses((p) => [
        ...p,
        { ...modal.data, id: Date.now(), code: slugify(modal.data.name) },
      ]);
    } else {
      setCampuses((p) =>
        p.map((c) =>
          c.id === modal.data.id
            ? { ...modal.data, code: slugify(modal.data.name) }
            : c
        )
      );
    }
    close();
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          {[
            'Dashboard',
            'Global Configurations',
            'Institute Setup',
            'Campus Setup',
          ].map((item, i, arr) => (
            <React.Fragment key={`${item}-${i}`}>
              <span
                className={
                  i === arr.length - 1
                    ? 'text-gray-700 dark:text-gray-200 font-medium'
                    : 'hover:text-blue-500 cursor-pointer transition-colors'
                }
              >
                {item}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight
                  size={12}
                  className="text-gray-300 dark:text-gray-600"
                />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Campuses',
              value: totalCount,
              color: 'bg-blue-50 dark:bg-blue-900/20',
              icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Active',
              value: activeCount,
              color: 'bg-green-50 dark:bg-green-900/20',
              icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
            {
              label: 'Inactive',
              value: inactiveCount,
              color: 'bg-red-50 dark:bg-red-900/20',
              icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.color}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}
              >
                <Building2 size={18} />
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

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Building2 size={16} className="text-blue-500" />
              Campus List
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search campus..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 w-48 transition-all"
                />
              </div>
              {/* Add button */}
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                <Plus size={14} /> Add Campus
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Campus Name',
                    'Campus Code',
                    'Report Date',
                    'Status',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Building2
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {search
                          ? 'No campuses match your search.'
                          : 'No campuses added yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {c.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {fmtDate(c.reportDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                          ${
                            c.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`}
                          />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openEdit(c)}
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Showing {filtered.length} of {totalCount} entries
            </span>
            <span>{totalCount} total campuses</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          mode={modal.mode}
          data={modal.data}
          errors={errors}
          onChange={handleChange}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </DashboardLayout>
  );
}
