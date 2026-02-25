// src/pages/super-admin/globalConfigurations/instituteSetup/DepartmentSetup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, Layers, Pencil, Plus, Search, X, Check, AlertCircle } from 'lucide-react';

// ── Static Data ───────────────────────────────────────────────────────────────
const SHIFTS = [
  { id: 1, shift_name: 'Morning', status: 'Active' },
  { id: 2, shift_name: 'Evening', status: 'Active' },
];
const ALL_MEDIUMS = [
  { id: 1, shift_id: 1, name: 'Bangla',   status: 'Active' },
  { id: 2, shift_id: 1, name: 'English',  status: 'Active' },
  { id: 3, shift_id: 2, name: 'English',  status: 'Active' },
];
const ALL_EDU_LEVELS = [
  { id: 1, shift_id: 1, medium_id: 1, title: 'Primary',   status: 'Active' },
  { id: 2, shift_id: 1, medium_id: 2, title: 'Secondary', status: 'Active' },
];
const INITIAL_DEPTS = [
  { id: 1, shift_id: 1, shift_name: 'Morning', medium_id: 1, medium_name: 'Bangla',
    education_level_id: 1, education_level_title: 'Primary',
    code: 'SCI', title: 'Science', banglaTitle: 'বিজ্ঞান', roll: 1, status: 'Active' },
];

const EMPTY_FORM = {
  id: null, shift_id: '', shift_name: '', medium_id: '', medium_name: '',
  education_level_id: '', education_level_title: '', code: '', title: '',
  banglaTitle: '', roll: '', status: 'Active',
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

export default function DepartmentSetup() {
  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [isEditing, setIsEditing]     = useState(false);
  const [errors, setErrors]           = useState({});
  const [search, setSearch]           = useState('');

  const mediums      = ALL_MEDIUMS.filter(m => m.shift_id === +form.shift_id && m.status === 'Active');
  const eduLevels    = ALL_EDU_LEVELS.filter(e => e.shift_id === +form.shift_id && e.medium_id === +form.medium_id);

  // Reset dependent dropdowns when shift changes
  useEffect(() => {
    if (!isEditing) setForm(p => ({ ...p, medium_id: '', medium_name: '', education_level_id: '', education_level_title: '' }));
  }, [form.shift_id]);
  useEffect(() => {
    if (!isEditing) setForm(p => ({ ...p, education_level_id: '', education_level_title: '' }));
  }, [form.medium_id]);

  const filtered = useMemo(() =>
    departments.filter(d =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.shift_name.toLowerCase().includes(search.toLowerCase())
    ), [departments, search]
  );

  const validate = () => {
    const e = {};
    if (!form.shift_id)          e.shift_id          = 'Required';
    if (!form.medium_id)         e.medium_id         = 'Required';
    if (!form.education_level_id)e.education_level_id= 'Required';
    if (!form.code.trim())       e.code              = 'Required';
    if (!form.title.trim())      e.title             = 'Required';
    if (!form.banglaTitle.trim())e.banglaTitle        = 'Required';
    if (!form.roll)              e.roll              = 'Required';
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

    const shift     = SHIFTS.find(s => s.id === +form.shift_id);
    const medium    = ALL_MEDIUMS.find(m => m.id === +form.medium_id);
    const eduLevel  = ALL_EDU_LEVELS.find(el => el.id === +form.education_level_id);
    const entry = {
      ...form,
      shift_name: shift?.shift_name || '',
      medium_name: medium?.name || '',
      education_level_title: eduLevel?.title || '',
      roll: +form.roll,
    };

    if (isEditing) {
      setDepartments(p => p.map(d => d.id === form.id ? entry : d));
    } else {
      setDepartments(p => [...p, { ...entry, id: Date.now() }]);
    }
    setForm(EMPTY_FORM);
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = dept => {
    setForm({ ...dept, roll: String(dept.roll) });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setIsEditing(false); };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          {['Dashboard', 'Global Configurations', 'Institute Setup', 'Department Setup'].map((item, i, arr) => (
            <React.Fragment key={item}>
              <span className={i === arr.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
                {item}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </nav>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            {isEditing ? <Pencil size={15} className="text-amber-500" /> : <Plus size={15} className="text-blue-500" />}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {isEditing ? 'Edit Department' : 'Add Department'}
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

              {/* Education Level */}
              <Field label="Education Level" required error={errors.education_level_id}>
                <select name="education_level_id" value={form.education_level_id} onChange={handleChange}
                  disabled={!form.medium_id} className={inputCls(errors.education_level_id)}>
                  <option value="">Select Level</option>
                  {eduLevels.map(el => <option key={el.id} value={el.id}>{el.title}</option>)}
                </select>
              </Field>

              {/* Code */}
              <Field label="Department Code" required error={errors.code}>
                <input name="code" value={form.code} onChange={handleChange}
                  placeholder="e.g. SCI" className={inputCls(errors.code)} />
              </Field>

              {/* Title */}
              <Field label="Department Name" required error={errors.title}>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Science" className={inputCls(errors.title)} />
              </Field>

              {/* Bangla Title */}
              <Field label="Bangla Name" required error={errors.banglaTitle}>
                <input name="banglaTitle" value={form.banglaTitle} onChange={handleChange}
                  placeholder="বিজ্ঞান" className={inputCls(errors.banglaTitle)} />
              </Field>

              {/* Roll */}
              <Field label="Roll Identifier" required error={errors.roll}>
                <input name="roll" type="number" value={form.roll} onChange={handleChange}
                  placeholder="e.g. 1" className={inputCls(errors.roll)} />
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
                <Check size={15} /> {isEditing ? 'Update Department' : 'Save Department'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
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
              <Layers size={16} className="text-blue-500" /> Departments List
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-48 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#','Shift','Medium','Edu Level','Code','Dept Name','Bangla Name','Roll','Status','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                    {search ? 'No departments match your search.' : 'No departments added yet.'}
                  </td></tr>
                ) : filtered.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{d.shift_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{d.medium_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{d.education_level_title}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{d.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{d.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{d.banglaTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{d.roll}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${d.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(d)}
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
            <span>Showing {filtered.length} of {departments.length} departments</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}