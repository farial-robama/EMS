// src/pages/super-admin/globalConfigurations/instituteSetup/SectionSetup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, LayoutGrid, Pencil, Plus, Search, X, Check, AlertCircle } from 'lucide-react';

// ── Static Data ───────────────────────────────────────────────────────────────
const SHIFTS      = [{ id: 1, shift_name: 'Morning' }, { id: 2, shift_name: 'Evening' }];
const ALL_MEDIUMS = [{ id: 1, shift_id: 1, name: 'Bangla' }, { id: 2, shift_id: 1, name: 'English' }, { id: 3, shift_id: 2, name: 'English' }];
const ALL_LEVELS  = [{ id: 1, shift_id: 1, medium_id: 1, title: 'Primary' }, { id: 2, shift_id: 1, medium_id: 2, title: 'Secondary' }];
const ALL_DEPTS   = [{ id: 1, shift_id: 1, medium_id: 1, edu_level_id: 1, title: 'Science' }, { id: 2, shift_id: 1, medium_id: 2, edu_level_id: 2, title: 'Math' }];
const ALL_CLASSES = [{ id: 1, shift: 1, medium: 1, edu_level: 1, department: 1, class_name: 'Class 1' }, { id: 2, shift: 1, medium: 2, edu_level: 2, department: 2, class_name: 'Class 2' }];

const INITIAL_SECTIONS = [
  { id: 1, shift_id: 1, shift_name: 'Morning', medium_id: 1, medium_name: 'Bangla', edu_level_id: 1, edu_level_name: 'Primary', department_id: 1, department_name: 'Science', class_id: 1, class_name: 'Class 1', title: 'Section A', order: 1, status: 'Active' },
];

const EMPTY_FORM = { shift: '', medium: '', eduLevel: '', department: '', classId: '', title: '', order: '', status: 'Active' };

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

export default function SectionSetup() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [errors, setErrors]     = useState({});
  const [search, setSearch]     = useState('');

  // Cascading options
  const mediums     = ALL_MEDIUMS.filter(m => m.shift_id === +form.shift);
  const eduLevels   = ALL_LEVELS.filter(l => l.shift_id === +form.shift && l.medium_id === +form.medium);
  const departments = ALL_DEPTS.filter(d => d.shift_id === +form.shift && d.medium_id === +form.medium && d.edu_level_id === +form.eduLevel);
  const classes     = ALL_CLASSES.filter(c => c.shift === +form.shift && c.medium === +form.medium && c.edu_level === +form.eduLevel && c.department === +form.department);

  // Reset downstream when upstream changes
  useEffect(() => { setForm(p => ({ ...p, medium: '', eduLevel: '', department: '', classId: '' })); }, [form.shift]);
  useEffect(() => { setForm(p => ({ ...p, eduLevel: '', department: '', classId: '' })); }, [form.medium]);
  useEffect(() => { setForm(p => ({ ...p, department: '', classId: '' })); }, [form.eduLevel]);
  useEffect(() => { setForm(p => ({ ...p, classId: '' })); }, [form.department]);

  const filtered = useMemo(() =>
    sections.filter(s => `${s.title} ${s.shift_name} ${s.class_name} ${s.department_name}`.toLowerCase().includes(search.toLowerCase())),
    [sections, search]);

  const validate = () => {
    const e = {};
    if (!form.shift)       e.shift      = 'Required';
    if (!form.medium)      e.medium     = 'Required';
    if (!form.eduLevel)    e.eduLevel   = 'Required';
    if (!form.department)  e.department = 'Required';
    if (!form.classId)     e.classId    = 'Required';
    if (!form.title.trim())e.title      = 'Section name is required';
    if (!form.order)       e.order      = 'Order is required';
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

    const shift      = SHIFTS.find(s => s.id === +form.shift);
    const medium     = ALL_MEDIUMS.find(m => m.id === +form.medium);
    const eduLevel   = ALL_LEVELS.find(l => l.id === +form.eduLevel);
    const department = ALL_DEPTS.find(d => d.id === +form.department);
    const cls        = ALL_CLASSES.find(c => c.id === +form.classId);

    const entry = {
      shift_id: +form.shift, shift_name: shift?.shift_name || '',
      medium_id: +form.medium, medium_name: medium?.name || '',
      edu_level_id: +form.eduLevel, edu_level_name: eduLevel?.title || '',
      department_id: +form.department, department_name: department?.title || '',
      class_id: +form.classId, class_name: cls?.class_name || '',
      title: form.title, order: +form.order, status: form.status,
    };

    if (editId) {
      setSections(p => p.map(s => s.id === editId ? { ...entry, id: editId } : s));
    } else {
      setSections(p => [...p, { ...entry, id: Date.now() }]);
    }
    setForm(EMPTY_FORM); setErrors({}); setEditId(null);
  };

  const handleEdit = sec => {
    setForm({
      shift: String(sec.shift_id), medium: String(sec.medium_id),
      eduLevel: String(sec.edu_level_id), department: String(sec.department_id),
      classId: String(sec.class_id), title: sec.title,
      order: String(sec.order), status: sec.status,
    });
    setEditId(sec.id); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setEditId(null); };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Section Setup']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Sections', value: sections.length,                                     bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
            { label: 'Active',         value: sections.filter(s => s.status === 'Active').length,   bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
            { label: 'Inactive',       value: sections.filter(s => s.status === 'Inactive').length, bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}><LayoutGrid size={18} /></div>
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
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{editId ? 'Edit Section' : 'Add New Section'}</span>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Row 1: Cascading dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Shift Name" required error={errors.shift}>
                <select name="shift" value={form.shift} onChange={handleChange} className={inp(errors.shift)}>
                  <option value="">Select Shift</option>
                  {SHIFTS.map(s => <option key={s.id} value={s.id}>{s.shift_name}</option>)}
                </select>
              </Field>
              <Field label="Medium Name" required error={errors.medium}>
                <select name="medium" value={form.medium} onChange={handleChange} disabled={!form.shift} className={inp(errors.medium)}>
                  <option value="">Select Medium</option>
                  {mediums.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Education Level" required error={errors.eduLevel}>
                <select name="eduLevel" value={form.eduLevel} onChange={handleChange} disabled={!form.medium} className={inp(errors.eduLevel)}>
                  <option value="">Select Level</option>
                  {eduLevels.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </Field>
              <Field label="Department" required error={errors.department}>
                <select name="department" value={form.department} onChange={handleChange} disabled={!form.eduLevel} className={inp(errors.department)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </Field>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Class Name" required error={errors.classId}>
                <select name="classId" value={form.classId} onChange={handleChange} disabled={!form.department} className={inp(errors.classId)}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                </select>
              </Field>
              <Field label="Section Name" required error={errors.title}>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Section A" className={inp(errors.title)} />
              </Field>
              <Field label="Section Order" required error={errors.order}>
                <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="e.g. 1" min={1} className={inp(errors.order)} />
              </Field>
              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={inp(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Check size={15} /> {editId ? 'Update Section' : 'Save Section'}
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
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><LayoutGrid size={16} className="text-blue-500" /> Section List</div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-48 transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#','Shift','Medium','Edu Level','Department','Class','Section','Order','Status','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0
                  ? <tr><td colSpan={10} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">{search ? 'No sections match your search.' : 'No sections added yet.'}</td></tr>
                  : filtered.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{s.shift_name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{s.medium_name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{s.edu_level_name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{s.department_name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{s.class_name}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">{s.title}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300">{s.order}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3.5">
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
            Showing {filtered.length} of {sections.length} entries
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}