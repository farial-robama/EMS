// src/pages/super-admin/globalConfigurations/instituteSetup/SessionSetup.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, CalendarDays, Pencil, Plus, Search, X, Check, AlertCircle } from 'lucide-react';

const INITIAL_DATA = [
  { id: 1, name: '2025-2026', roll: '001', type: 'Single Year', status: 'Active' },
  { id: 2, name: '2024-2025', roll: '002', type: 'Mixed Year',  status: 'Inactive' },
];
const EMPTY_FORM = { name: '', roll: '', type: '', status: 'Active' };

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-0.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

const inp = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all ${err
    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
    {status}
  </span>
);

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

export default function SessionSetup() {
  const [sessions, setSessions] = useState(INITIAL_DATA);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [errors, setErrors]     = useState({});
  const [search, setSearch]     = useState('');

  const filtered = useMemo(() =>
    sessions.filter(s =>
      `${s.name} ${s.roll} ${s.type} ${s.status}`.toLowerCase().includes(search.toLowerCase())
    ), [sessions, search]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Session name is required';
    if (!form.roll.trim()) e.roll = 'Roll identifier is required';
    if (!form.type)        e.type = 'Session type is required';
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
    if (editId) {
      setSessions(p => p.map(s => s.id === editId ? { ...form, id: editId } : s));
    } else {
      setSessions(p => [...p, { ...form, id: Date.now() }]);
    }
    setForm(EMPTY_FORM); setErrors({}); setEditId(null);
  };

  const handleEdit = s => { setForm({ ...s }); setEditId(s.id); setErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setEditId(null); };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Session Setup']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: sessions.length,                                     bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
            { label: 'Active',         value: sessions.filter(s => s.status === 'Active').length,   bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
            { label: 'Inactive',       value: sessions.filter(s => s.status === 'Inactive').length, bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}><CalendarDays size={18} /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className={`flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 ${editId ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
            {editId ? <Pencil size={15} className="text-amber-500" /> : <Plus size={15} className="text-blue-500" />}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{editId ? 'Edit Session' : 'Add New Session'}</span>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Session Name" required error={errors.name}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. 2025-2026" className={inp(errors.name)} />
              </Field>
              <Field label="Roll Identifier" required error={errors.roll}>
                <input name="roll" value={form.roll} onChange={handleChange} placeholder="e.g. 001" className={inp(errors.roll)} />
              </Field>
              <Field label="Session Type" required error={errors.type}>
                <select name="type" value={form.type} onChange={handleChange} className={inp(errors.type)}>
                  <option value="">Select Type</option>
                  <option value="Single Year">Single Year</option>
                  <option value="Mixed Year">Mixed Year</option>
                </select>
              </Field>
              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={inp(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Check size={15} /> {editId ? 'Update Session' : 'Save Session'}
              </button>
              {editId && (
                <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <X size={15} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><CalendarDays size={16} className="text-blue-500" /> Session List</div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search sessions..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-48 transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Session Name', 'Roll Identifier', 'Session Type', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">{search ? 'No sessions match your search.' : 'No sessions added yet.'}</td></tr>
                  : filtered.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</td>
                      <td className="px-5 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md">{s.roll}</span></td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.type === 'Single Year' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleEdit(s)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {sessions.length} entries
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}