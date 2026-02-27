// src/pages/super-admin/globalConfigurations/instituteSetup/EducationLevelSetup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, GraduationCap, Pencil, Plus, Search, X, Check, AlertCircle } from 'lucide-react';

// ── Static Data ───────────────────────────────────────────────────────────────
const EDUCATION_CODES = [
  'pre_primary','primary','six_eight','nine_ten','higher_secondary',
  'pass_degree','under_graduate','post_graduate','private_degree',
  'preliminary_post_graduate','private_post_graduate',
  'preliminary_private_post_graduate','professional_masters',
];
const SHIFTS = [
  { id: 1, shift_name: 'Morning', status: 'Active' },
  { id: 2, shift_name: 'Evening', status: 'Active' },
];
const ALL_MEDIUMS = [
  { id: 1, shift_id: 1, name: 'Bangla',  status: 'Active' },
  { id: 2, shift_id: 1, name: 'English', status: 'Active' },
  { id: 3, shift_id: 2, name: 'English', status: 'Active' },
];
const INITIAL_LEVELS = [
  { id: 1, shift_id: 1, shift_name: 'Morning', medium_id: 1, medium_name: 'Bangla',
    title: 'Primary Level', code: 'primary', roll: 1, type: 'single_year', number: 30, status: 'Active' },
  { id: 2, shift_id: 1, shift_name: 'Morning', medium_id: 2, medium_name: 'English',
    title: 'Secondary Level', code: 'six_eight', roll: 2, type: 'mixed_year', number: 25, status: 'Inactive' },
];
const EMPTY_FORM = {
  id: null, shift_id: '', shift_name: '', medium_id: '', medium_name: '',
  title: '', code: EDUCATION_CODES[0], roll: '', type: 'single_year', number: '', status: 'Inactive',
};

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

export default function EducationLevelSetup() {
  const [levels, setLevels]       = useState(INITIAL_LEVELS);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors]       = useState({});
  const [search, setSearch]       = useState('');
  const [entries, setEntries]     = useState(20);

  const mediums = ALL_MEDIUMS.filter(m => m.shift_id === +form.shift_id && m.status === 'Active');

  // Reset medium when shift changes
  useEffect(() => {
    if (!editingId) setForm(p => ({ ...p, medium_id: '', medium_name: '' }));
  }, [form.shift_id]);

  const filtered = useMemo(() =>
    levels.filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.shift_name.toLowerCase().includes(search.toLowerCase()) ||
      l.medium_name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, entries),
    [levels, search, entries]
  );

  const usedCodes = levels.filter(l => !editingId || l.id !== editingId).map(l => l.code);

  const validate = () => {
    const e = {};
    if (!form.shift_id)    e.shift_id  = 'Required';
    if (!form.medium_id)   e.medium_id = 'Required';
    if (!form.title.trim())e.title     = 'Required';
    if (!form.roll)        e.roll      = 'Required';
    if (!form.number)      e.number    = 'Required';
    if (!editingId && usedCodes.includes(form.code)) e.code = `Code "${form.code}" already used`;
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

    const shift  = SHIFTS.find(s => s.id === +form.shift_id);
    const medium = ALL_MEDIUMS.find(m => m.id === +form.medium_id);
    const entry = {
      ...form, roll: +form.roll, number: +form.number,
      shift_name: shift?.shift_name || '',
      medium_name: medium?.name || '',
    };

    if (editingId) {
      setLevels(p => p.map(l => l.id === editingId ? { ...entry, id: editingId } : l));
    } else {
      setLevels(p => [...p, { ...entry, id: Date.now() }]);
    }
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  };

  const handleEdit = level => {
    setForm({ ...level, roll: String(level.roll), number: String(level.number) });
    setEditingId(level.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setEditingId(null); };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          {['Dashboard', 'Global Configurations', 'Institute Setup', 'Education Level Setup'].map((item, i, arr) => (
            <React.Fragment key={`${item}-${i}`}>
              <span className={i === arr.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
                {item}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </nav>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Levels',    value: levels.length,                                    color: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600' },
            { label: 'Active',          value: levels.filter(l => l.status === 'Active').length,  color: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-100 dark:bg-green-800 text-green-600' },
            { label: 'Codes Available', value: EDUCATION_CODES.length - levels.length,            color: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-800 text-purple-600' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.color}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                <GraduationCap size={18} />
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
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            {editingId ? <Pencil size={15} className="text-amber-500" /> : <Plus size={15} className="text-blue-500" />}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {editingId ? 'Edit Education Level' : 'Add Education Level'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Shift */}
              <Field label="Shift Name" required error={errors.shift_id}>
                <select name="shift_id" value={form.shift_id} onChange={handleChange} className={inputCls(errors.shift_id)}>
                  <option value="">Select Shift</option>
                  {SHIFTS.map(s => <option key={s.id} value={s.id}>{s.shift_name}</option>)}
                </select>
              </Field>

              {/* Medium */}
              <Field label="Medium Name" required error={errors.medium_id}>
                <select name="medium_id" value={form.medium_id} onChange={handleChange}
                  disabled={!form.shift_id} className={inputCls(errors.medium_id)}>
                  <option value="">Select Medium</option>
                  {mediums.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>

              {/* Title */}
              <Field label="Education Level Name" required error={errors.title}>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Primary Level" className={inputCls(errors.title)} />
              </Field>

              {/* Code */}
              <Field label="Education Level Code" required error={errors.code}>
                <select name="code" value={form.code} onChange={handleChange} className={inputCls(errors.code)}>
                  {EDUCATION_CODES.map(code => (
                    <option key={code} value={code} disabled={!editingId && usedCodes.includes(code)}>
                      {code} {!editingId && usedCodes.includes(code) ? '(used)' : ''}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Roll */}
              <Field label="Roll Identifier" required error={errors.roll}>
                <input name="roll" type="number" value={form.roll} onChange={handleChange}
                  placeholder="e.g. 1" className={inputCls(errors.roll)} />
              </Field>

              {/* Session Type */}
              <Field label="Session Type">
                <select name="type" value={form.type} onChange={handleChange} className={inputCls(false)}>
                  <option value="single_year">Single Year</option>
                  <option value="mixed_year">Mixed Year</option>
                </select>
              </Field>

              {/* Number */}
              <Field label="Level Number" required error={errors.number}>
                <input name="number" type="number" value={form.number} onChange={handleChange}
                  placeholder="e.g. 30" className={inputCls(errors.number)} />
              </Field>

              {/* Status */}
              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={inputCls(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                <Check size={15} /> {editingId ? 'Update Level' : 'Add Level'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
              <GraduationCap size={16} className="text-blue-500" /> Education Levels List
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                Show
                <select value={entries} onChange={e => setEntries(+e.target.value)}
                  className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-xs outline-none">
                  <option>20</option><option>50</option><option>100</option>
                </select>
                entries
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-44 transition-all" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#','Shift','Medium','Level Name','Code','Roll','Session','Number','Status','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                    {search ? 'No records match your search.' : 'No education levels added yet.'}
                  </td></tr>
                ) : filtered.map((l, i) => (
                  <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{l.shift_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{l.medium_name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{l.title}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{l.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{l.roll}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {l.type === 'single_year' ? 'Single Year' : 'Mixed Year'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{l.number}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${l.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${l.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(l)}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            <span>Showing {filtered.length} of {levels.length} entries</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}