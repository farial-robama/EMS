// src/pages/super-admin/globalConfigurations/instituteSetup/SubjectSetup.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, BookOpen, Pencil, Plus, Search, X, Check, AlertCircle } from 'lucide-react';

const INITIAL_SUBJECTS = [
  { id: 1, name: 'Mathematics', parent_id: null, parent_name: 'None', status: 'Active' },
  { id: 2, name: 'Science',     parent_id: null, parent_name: 'None', status: 'Active' },
  { id: 3, name: 'Physics',     parent_id: 2,    parent_name: 'Science', status: 'Active' },
  { id: 4, name: 'Chemistry',   parent_id: 2,    parent_name: 'Science', status: 'Active' },
  { id: 5, name: 'Bangla',      parent_id: null, parent_name: 'None', status: 'Inactive' },
];
const EMPTY_FORM = { name: '', parent_id: '', status: 'Active' };

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

export default function SubjectSetup() {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [errors, setErrors]     = useState({});
  const [search, setSearch]     = useState('');
  const [entries, setEntries]   = useState(10);

  // Only root subjects can be parents (parent_id === null)
  const parentOptions = subjects.filter(s => s.parent_id === null && s.id !== editId);

  const filtered = useMemo(() =>
    subjects.filter(s =>
      `${s.name} ${s.parent_name}`.toLowerCase().includes(search.toLowerCase())
    ).slice(0, entries),
    [subjects, search, entries]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Subject name is required';
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

    const parentId   = form.parent_id ? +form.parent_id : null;
    const parentName = parentId ? (subjects.find(s => s.id === parentId)?.name || 'None') : 'None';

    const entry = { name: form.name.trim(), parent_id: parentId, parent_name: parentName, status: form.status };

    if (editId) {
      // If this subject was a parent and is now being given a parent, update children's parent_name
      setSubjects(p => p.map(s => {
        if (s.id === editId) return { ...entry, id: editId };
        // Update parent_name if this subject's name changed
        if (s.parent_id === editId) return { ...s, parent_name: entry.name };
        return s;
      }));
    } else {
      setSubjects(p => [...p, { ...entry, id: Date.now() }]);
    }
    setForm(EMPTY_FORM); setErrors({}); setEditId(null);
  };

  const handleEdit = s => {
    setForm({ name: s.name, parent_id: s.parent_id ? String(s.parent_id) : '', status: s.status });
    setEditId(s.id); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setEditId(null); };

  const rootCount  = subjects.filter(s => s.parent_id === null).length;
  const childCount = subjects.filter(s => s.parent_id !== null).length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Subject Setup']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Subjects', value: subjects.length,                                     bg: 'bg-blue-50 dark:bg-blue-900/20',    icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
            { label: 'Root Subjects',  value: rootCount,                                           bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' },
            { label: 'Sub-Subjects',   value: childCount,                                          bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' },
            { label: 'Active',         value: subjects.filter(s => s.status === 'Active').length,   bg: 'bg-green-50 dark:bg-green-900/20',  icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}><BookOpen size={18} /></div>
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
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{editId ? 'Edit Subject' : 'Add New Subject'}</span>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Subject Title" required error={errors.name}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Mathematics" className={inp(errors.name)} />
              </Field>
              <Field label="Parent Subject">
                <select name="parent_id" value={form.parent_id} onChange={handleChange} className={inp(false)}>
                  <option value="">None (Root Subject)</option>
                  {parentOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={inp(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>

            {/* Live preview of hierarchy */}
            {form.name.trim() && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <BookOpen size={12} />
                Preview: {form.parent_id ? `${subjects.find(s => s.id === +form.parent_id)?.name} → ` : ''}<strong>{form.name}</strong>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Check size={15} /> {editId ? 'Update Subject' : 'Save Subject'}
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
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><BookOpen size={16} className="text-blue-500" /> Subject List</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                Show
                <select value={entries} onChange={e => setEntries(+e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-xs outline-none">
                  <option>10</option><option>25</option><option>50</option>
                </select>
                entries
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-44 transition-all" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Subject Title', 'Parent Subject', 'Type', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">{search ? 'No subjects match your search.' : 'No subjects added yet.'}</td></tr>
                  : filtered.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {s.parent_id && <span className="text-gray-300 dark:text-gray-600 text-xs">└</span>}
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">
                        {s.parent_name === 'None'
                          ? <span className="text-xs text-gray-400 dark:text-gray-500 italic">Root subject</span>
                          : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-medium">{s.parent_name}</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.parent_id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                          {s.parent_id ? 'Sub-Subject' : 'Root'}
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
            Showing {filtered.length} of {subjects.length} entries
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}