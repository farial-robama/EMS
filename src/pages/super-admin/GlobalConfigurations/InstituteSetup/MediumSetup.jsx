// src/pages/super-admin/globalConfigurations/instituteSetup/MediumSetup.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight, Globe, Pencil, Plus, Search, X, Check, AlertCircle,
} from 'lucide-react';

/* ── Static Data ─────────────────────────────────────────────────────────── */
const ALL_SHIFTS = [
  { id: 1, shift_name: 'Morning', status: 'Active' },
  { id: 2, shift_name: 'Evening', status: 'Active' },
  { id: 3, shift_name: 'Night',   status: 'Inactive' },
];
const ACTIVE_SHIFTS = ALL_SHIFTS.filter(s => s.status === 'Active');

const INITIAL_MEDIUMS = [
  { id: 1, shift_id: 1, shift_name: 'Morning', name: 'Bangla',  identifier: 'B', status: 'Active' },
  { id: 2, shift_id: 1, shift_name: 'Morning', name: 'English', identifier: 'E', status: 'Active' },
  { id: 3, shift_id: 2, shift_name: 'Evening', name: 'English', identifier: 'E', status: 'Inactive' },
];
const EMPTY = { shift_id: '', name: '', identifier: '', status: 'Active' };

/* ── Tiny helpers ────────────────────────────────────────────────────────── */
const inp = err =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err
    ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${status === 'Active'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
    {status}
  </span>
);

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={
          i === items.length - 1
            ? 'text-gray-700 dark:text-gray-200 font-medium'
            : 'hover:text-blue-500 cursor-pointer transition-colors'
        }>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

/* ── Search-Autocomplete ─────────────────────────────────────────────────── */
function SearchBox({ value, onChange, suggestions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = item => { onChange(item.name); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search mediums..."
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50
          dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2
          focus:ring-blue-100 w-56 transition-all"
      />
      {open && value && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200
          dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map(s => (
            <li key={s.id}
              onClick={() => handleSelect(s)}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20
                cursor-pointer text-sm transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0">
              <span className="font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{s.shift_name} · {s.identifier}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function MediumSetup() {
  const [mediums, setMediums] = useState(INITIAL_MEDIUMS);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [errors, setErrors]   = useState({});
  const [search, setSearch]   = useState('');

  const filtered = useMemo(() =>
    mediums.filter(m =>
      `${m.name} ${m.shift_name} ${m.identifier}`.toLowerCase().includes(search.toLowerCase())
    ), [mediums, search]);

  /* validation */
  const validate = () => {
    const e = {};
    if (!form.shift_id)          e.shift_id   = 'Shift is required';
    if (!form.name.trim())       e.name       = 'Medium name is required';
    if (!form.identifier.trim()) e.identifier = 'Identifier is required';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const shift = ACTIVE_SHIFTS.find(s => s.id === +form.shift_id);
    const entry = { ...form, shift_id: +form.shift_id, shift_name: shift?.shift_name || '' };
    if (editId) {
      setMediums(p => p.map(m => m.id === editId ? { ...entry, id: editId } : m));
    } else {
      setMediums(p => [...p, { ...entry, id: Date.now() }]);
    }
    setForm(EMPTY); setErrors({}); setEditId(null);
  };

  const handleEdit = m => {
    setForm({ shift_id: String(m.shift_id), name: m.name, identifier: m.identifier, status: m.status });
    setEditId(m.id); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => { setForm(EMPTY); setErrors({}); setEditId(null); };

  /* stats */
  const stats = [
    { label: 'Total Mediums', value: mediums.length,
      bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
    { label: 'Active',   value: mediums.filter(m => m.status === 'Active').length,
      bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
    { label: 'Inactive', value: mediums.filter(m => m.status === 'Inactive').length,
      bg: 'bg-red-50 dark:bg-red-900/20', icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Medium Setup']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                <Globe size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className={`flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700
            ${editId ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
            {editId
              ? <Pencil size={15} className="text-amber-500" />
              : <Plus size={15} className="text-blue-500" />}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {editId ? 'Edit Medium' : 'Add New Medium'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Shift Name" required error={errors.shift_id}>
                <select name="shift_id" value={form.shift_id} onChange={handleChange} className={inp(errors.shift_id)}>
                  <option value="">Select Shift</option>
                  {ACTIVE_SHIFTS.map(s => (
                    <option key={s.id} value={s.id}>{s.shift_name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Medium Name" required error={errors.name}>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. English" className={inp(errors.name)} />
              </Field>

              <Field label="Roll Identifier" required error={errors.identifier}>
                <input name="identifier" value={form.identifier} onChange={handleChange}
                  placeholder="e.g. E" maxLength={5} className={inp(errors.identifier)} />
              </Field>

              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={inp(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600
                  hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Check size={15} /> {editId ? 'Update Medium' : 'Save Medium'}
              </button>
              {editId && (
                <button type="button" onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300
                    bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                    hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <X size={15} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Globe size={16} className="text-blue-500" /> Medium List
            </div>
            <SearchBox value={search} onChange={setSearch} suggestions={filtered} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Shift Name', 'Medium Name', 'Identifier', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Globe size={32} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {search ? 'No mediums match your search.' : 'No mediums added yet.'}
                      </p>
                    </td>
                  </tr>
                ) : filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">{m.shift_name}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">{m.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md">
                        {m.identifier}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={m.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleEdit(m)}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                          hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600
                          text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all"
                        title="Edit">
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700
            bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {mediums.length} entries
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}