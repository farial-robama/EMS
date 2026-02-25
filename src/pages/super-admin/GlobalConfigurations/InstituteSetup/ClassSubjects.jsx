// src/pages/super-admin/globalConfigurations/instituteSetup/ClassSubjects.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, BookOpen, Plus, X, Check, AlertCircle, Eye } from 'lucide-react';

// ── Static Data ───────────────────────────────────────────────────────────────
const EDU_LEVELS   = [{ id: 1, title: 'School' }, { id: 2, title: 'College' }];
const SHIFTS       = [{ id: 1, title: 'Morning' }, { id: 2, title: 'Day' }, { id: 3, title: 'Evening' }];
const MEDIUMS      = [{ id: 1, title: 'Bangla' }, { id: 2, title: 'English' }, { id: 3, title: 'Bilingual' }];
const DEPARTMENTS  = [
  { id: 1, edu_level_id: 1, title: 'Science' },
  { id: 2, edu_level_id: 1, title: 'Arts' },
  { id: 3, edu_level_id: 2, title: 'Commerce' },
];
const CLASSES      = [
  { id: 1, edu_level: 1, department: 1, class_name: 'Six' },
  { id: 2, edu_level: 1, department: 1, class_name: 'Seven' },
  { id: 3, edu_level: 1, department: 2, class_name: 'Six' },
];
const SESSIONS     = [{ id: 1, name: '2025' }, { id: 2, name: '2026' }];
const ALL_SUBJECTS = [
  { id: 1, name: 'Bangla' }, { id: 2, name: 'English' },
  { id: 3, name: 'Mathematics' }, { id: 4, name: 'Science' },
  { id: 5, name: 'History' }, { id: 6, name: 'Geography' },
];
const SUBJECT_TYPES = [
  { code: 'main', title: 'Main' },
  { code: 'additional', title: 'Additional' },
  { code: 'special', title: 'Special' },
  { code: 'main_choosable', title: 'Main Choosable' },
];

const EMPTY_FILTERS = { shift: '', medium: '', eduLevel: '', department: '', className: '', session: '' };

// ── Reusable Select ───────────────────────────────────────────────────────────
function Select({ label, name, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name} value={value} onChange={onChange}
        className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
      >
        <option value="">Select</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ClassSubjects() {
  const [filters, setFilters]       = useState(EMPTY_FILTERS);
  const [available, setAvailable]   = useState([]);
  const [selected, setSelected]     = useState([]);
  const [savedMap, setSavedMap]     = useState({});
  const [showed, setShowed]         = useState(false);
  const [filterErr, setFilterErr]   = useState('');

  const filteredDepts = DEPARTMENTS.filter(d => !filters.eduLevel || d.edu_level_id === +filters.eduLevel);
  const filteredClasses = CLASSES.filter(c =>
    (!filters.eduLevel || c.edu_level === +filters.eduLevel) &&
    (!filters.department || c.department === +filters.department)
  );

  const filterKey = `${filters.shift}-${filters.medium}-${filters.eduLevel}-${filters.department}-${filters.className}-${filters.session}`;
  const savedSubjects = savedMap[filterKey] || [];
  const allSelected = [...savedSubjects, ...selected];

  const handleFilter = e => setFilters(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleShow = () => {
    const missing = Object.values(filters).some(v => !v);
    if (missing) { setFilterErr('Please select all filters.'); return; }
    setFilterErr('');
    const usedIds = [...selected, ...savedSubjects].map(s => s.subject_id);
    setAvailable(ALL_SUBJECTS.filter(s => !usedIds.includes(s.id)));
    setShowed(true);
  };

  const addSubject = (sub) => {
    setSelected(p => [...p, {
      id: sub.id, subject_id: sub.id, subject_name: sub.name,
      subject_code: '', subject_type: [], subject_order: allSelected.length + 1,
    }]);
    setAvailable(p => p.filter(x => x.id !== sub.id));
  };

  const removeSubject = (row) => {
    setSelected(p => p.filter(s => s.subject_id !== row.subject_id));
    setAvailable(p => [...p, { id: row.subject_id, name: row.subject_name }]);
  };

  const updateField = (id, field, value) => {
    setSelected(p => p.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleType = (id, code) => {
    setSelected(p => p.map(s => {
      if (s.id !== id) return s;
      const has = s.subject_type.includes(code);
      return { ...s, subject_type: has ? s.subject_type.filter(t => t !== code) : [...s.subject_type, code] };
    }));
  };

  const handleSubmit = () => {
    if (selected.length === 0) { alert('Select at least one subject!'); return; }
    for (const s of selected) {
      if (!s.subject_code || s.subject_type.length === 0 || !s.subject_order) {
        alert('All fields (code, type, order) are required for each subject!'); return;
      }
    }
    setSavedMap(p => ({ ...p, [filterKey]: [...(p[filterKey] || []), ...selected] }));
    setSelected([]);
    setAvailable([]);
    setShowed(false);
    alert('Subjects saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          {['Dashboard', 'Global Configurations', 'Institute Setup', 'Class Subjects'].map((item, i, arr) => (
            <React.Fragment key={item}>
              <span className={i === arr.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
                {item}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </nav>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <BookOpen size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Subjects</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <Select label="Shift" name="shift" value={filters.shift} onChange={handleFilter} required
                options={SHIFTS.map(s => ({ value: s.id, label: s.title }))} />
              <Select label="Medium" name="medium" value={filters.medium} onChange={handleFilter} required
                options={MEDIUMS.map(m => ({ value: m.id, label: m.title }))} />
              <Select label="Education Level" name="eduLevel" value={filters.eduLevel} onChange={handleFilter} required
                options={EDU_LEVELS.map(e => ({ value: e.id, label: e.title }))} />
              <Select label="Department" name="department" value={filters.department} onChange={handleFilter} required
                options={filteredDepts.map(d => ({ value: d.id, label: d.title }))} />
              <Select label="Class" name="className" value={filters.className} onChange={handleFilter} required
                options={filteredClasses.map(c => ({ value: c.class_name, label: c.class_name }))} />
              <Select label="Session" name="session" value={filters.session} onChange={handleFilter} required
                options={SESSIONS.map(s => ({ value: s.name, label: s.name }))} />
            </div>
            {filterErr && (
              <p className="mt-3 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {filterErr}</p>
            )}
            <div className="mt-4">
              <button onClick={handleShow}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                <Eye size={15} /> Show Subjects
              </button>
            </div>
          </div>
        </div>

        {/* Dual Table — only show after clicking Show */}
        {showed && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Available Subjects */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-green-50 dark:bg-green-900/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Available Subjects</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  {available.length} subjects
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {['#', 'Subject Name', 'Add'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {available.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">All subjects added</td></tr>
                    ) : available.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => addSubject(s)}
                            className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors border border-blue-100 dark:border-blue-800">
                            <Plus size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Subjects */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Selected Subjects</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {allSelected.length} subjects
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {['#', 'Subject', 'Code *', 'Type *', 'Order *', ''].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {allSelected.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No subjects selected yet</td></tr>
                    ) : allSelected.map((s, i) => {
                      const isSaved = savedSubjects.find(x => x.subject_id === s.subject_id);
                      return (
                        <tr key={s.id} className={`transition-colors ${isSaved ? 'bg-green-50/50 dark:bg-green-900/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                          <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.subject_name}</td>
                          <td className="px-3 py-2.5">
                            {isSaved ? (
                              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{s.subject_code}</span>
                            ) : (
                              <input type="text" value={s.subject_code}
                                onChange={e => updateField(s.id, 'subject_code', e.target.value)}
                                placeholder="Code"
                                className="w-20 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            {isSaved ? (
                              <div className="flex flex-wrap gap-1">
                                {s.subject_type.map(t => (
                                  <span key={t} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">{t}</span>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                {SUBJECT_TYPES.map(t => (
                                  <label key={t.code} className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" checked={s.subject_type.includes(t.code)}
                                      onChange={() => toggleType(s.id, t.code)}
                                      className="accent-blue-600 w-3 h-3" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{t.title}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            {isSaved ? (
                              <span className="text-xs text-gray-600 dark:text-gray-300">{s.subject_order}</span>
                            ) : (
                              <input type="number" value={s.subject_order}
                                onChange={e => updateField(s.id, 'subject_order', +e.target.value)}
                                className="w-14 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            {!isSaved && (
                              <button onClick={() => removeSubject(s)}
                                className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100 dark:border-red-900">
                                <X size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {selected.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex justify-end">
                  <button onClick={handleSubmit}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">
                    <Check size={15} /> Save Subjects
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}