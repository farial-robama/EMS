// src/pages/super-admin/globalConfigurations/instituteSetup/SubjectSubType.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight, Tags, Plus, Search, Pencil, Trash2, X, Check,
  AlertCircle, Eye, SlidersHorizontal,
} from 'lucide-react';

/* ── Static Reference Data ───────────────────────────────────────────────── */
const SHIFTS      = [{ id: 1, shift_name: 'Morning' }, { id: 2, shift_name: 'Evening' }];
const MEDIUMS     = [{ id: 1, name: 'English' }, { id: 2, name: 'Bangla' }];
const EDU_LEVELS  = [{ id: 1, title: 'School' }, { id: 2, title: 'College' }];
const DEPARTMENTS = [{ id: 1, title: 'Science' }, { id: 2, title: 'Arts' }];
const ALL_CLASSES = [
  { id: 1, edu_level: 1, department: 1, class_name: 'Class 9' },
  { id: 2, edu_level: 1, department: 1, class_name: 'Class 10' },
  { id: 3, edu_level: 2, department: 2, class_name: 'Class 11' },
];
const SESSIONS = [{ id: 1, name: '2024-2025' }, { id: 2, name: '2025-2026' }];

const CODE_OPTIONS     = ['main', 'additional', 'special', 'main_choosable'];
const CATEGORY_OPTIONS = ['main', 'additional', 'special'];

const INITIAL_DATA = [
  {
    id: 1, edu_level: 1, department: 1, class_name: 'Class 9',
    session: '2024-2025', shift: 1, medium: 1,
    title: 'Main Subject', code: 'main', category: 'main',
    num_subjects: 5, sort_order: 1, status: 'Active',
  },
];

const EMPTY_FILTER = { shift: '', medium: '', edu_level: '', department: '', class_name: '', session: '' };
const EMPTY_MODAL  = { title: '', code: '', category: '', num_subjects: 1, sort_order: 1, status: 'Active' };

/* ── Helpers ─────────────────────────────────────────────────────────────── */
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
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5"><AlertCircle size={11} />{error}</p>}
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
        <span className={i === items.length - 1
          ? 'text-gray-700 dark:text-gray-200 font-medium'
          : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

/* ── Modal ───────────────────────────────────────────────────────────────── */
function SubTypeModal({ mode, data, errors, onChange, onSave, onClose }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700
          ${isView ? 'bg-gray-50 dark:bg-gray-700/30'
            : isEdit ? 'bg-amber-50 dark:bg-amber-900/10'
            : 'bg-blue-50 dark:bg-blue-900/10'}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {isView ? <Eye size={15} className="text-gray-500" />
              : isEdit ? <Pencil size={15} className="text-amber-500" />
              : <Plus size={15} className="text-blue-500" />}
            {isView ? 'View' : isEdit ? 'Edit' : 'Add'} Subject Sub Type
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex items-center justify-center transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isView ? (
            <dl className="space-y-0 divide-y divide-gray-50 dark:divide-gray-700">
              {[
                ['Subject Type Title', data.title],
                ['Sub Type Code', data.code],
                ['Category', data.category],
                ['No. of Subjects to Choose', data.num_subjects],
                ['Sort Order', data.sort_order],
                ['Status', data.status],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</dt>
                  <dd className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {label === 'Status' ? <StatusBadge status={value} /> : value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Subject Type Title" required error={errors.title}>
                  <input name="title" value={data.title} onChange={onChange}
                    placeholder="e.g. Main Subject" className={inp(errors.title)} />
                </Field>
              </div>
              <Field label="Sub Type Code" required error={errors.code}>
                <select name="code" value={data.code} onChange={onChange} className={inp(errors.code)}>
                  <option value="">Select Code</option>
                  {CODE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Category" required error={errors.category}>
                <select name="category" value={data.category} onChange={onChange} className={inp(errors.category)}>
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Subjects to Choose" required error={errors.num_subjects}>
                <input type="number" name="num_subjects" value={data.num_subjects}
                  onChange={onChange} min={1} className={inp(errors.num_subjects)} />
              </Field>
              <Field label="Sort Order" required error={errors.sort_order}>
                <input type="number" name="sort_order" value={data.sort_order}
                  onChange={onChange} min={1} className={inp(errors.sort_order)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Status">
                  <select name="status" value={data.status} onChange={onChange} className={inp(false)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700
              border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              <Check size={14} /> {isEdit ? 'Update' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function SubjectSubType() {
  const [data, setData]         = useState(INITIAL_DATA);
  const [filter, setFilter]     = useState(EMPTY_FILTER);
  const [filterErrors, setFilterErrors] = useState({});
  const [searched, setSearched] = useState(false);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null); // { mode, data }
  const [modalErrors, setModalErrors] = useState({});

  /* cascading class list */
  const filteredClasses = useMemo(() =>
    ALL_CLASSES.filter(c =>
      (!filter.edu_level || c.edu_level === +filter.edu_level) &&
      (!filter.department || c.department === +filter.department)
    ), [filter.edu_level, filter.department]);

  /* reset class_name when upstream changes */
  useEffect(() => {
    setFilter(p => ({ ...p, class_name: '' }));
  }, [filter.edu_level, filter.department]);

  /* results matching current filter */
  const results = useMemo(() => {
    if (!searched) return [];
    return data.filter(d =>
      String(d.edu_level) === filter.edu_level &&
      String(d.department) === filter.department &&
      d.class_name === filter.class_name &&
      d.session === filter.session &&
      String(d.shift) === filter.shift &&
      String(d.medium) === filter.medium &&
      (!search || `${d.title} ${d.code} ${d.category}`.toLowerCase().includes(search.toLowerCase()))
    );
  }, [data, filter, searched, search]);

  /* filter change */
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilter(p => ({ ...p, [name]: value }));
    setFilterErrors(p => ({ ...p, [name]: undefined }));
    setSearched(false);
  };

  /* search button */
  const handleSearch = () => {
    const errs = {};
    Object.entries(filter).forEach(([k, v]) => { if (!v) errs[k] = 'Required'; });
    if (Object.keys(errs).length) { setFilterErrors(errs); return; }
    setFilterErrors({});
    setSearched(true);
  };

  /* modal helpers */
  const openAdd = () => {
    setModalErrors({});
    setModal({ mode: 'add', data: { ...EMPTY_MODAL } });
  };
  const openEdit = item => { setModalErrors({}); setModal({ mode: 'edit', data: { ...item } }); };
  const openView = item => setModal({ mode: 'view', data: { ...item } });
  const closeModal = () => setModal(null);

  const handleModalChange = e => {
    const { name, value } = e.target;
    setModal(p => ({ ...p, data: { ...p.data, [name]: value } }));
    if (modalErrors[name]) setModalErrors(p => ({ ...p, [name]: undefined }));
  };

  const validateModal = d => {
    const e = {};
    if (!d.title?.trim())   e.title        = 'Title is required';
    if (!d.code)            e.code         = 'Code is required';
    if (!d.category)        e.category     = 'Category is required';
    if (!d.num_subjects)    e.num_subjects = 'Required';
    if (!d.sort_order)      e.sort_order   = 'Required';
    return e;
  };

  const handleSave = () => {
    const errs = validateModal(modal.data);
    if (Object.keys(errs).length) { setModalErrors(errs); return; }
    const entry = {
      ...modal.data,
      num_subjects: +modal.data.num_subjects,
      sort_order:   +modal.data.sort_order,
      edu_level:  +filter.edu_level,
      department: +filter.department,
      class_name:  filter.class_name,
      session:     filter.session,
      shift:      +filter.shift,
      medium:     +filter.medium,
    };
    if (modal.mode === 'edit') {
      setData(p => p.map(d => d.id === modal.data.id ? entry : d));
    } else {
      setData(p => [...p, { ...entry, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    setData(p => p.filter(d => d.id !== id));
  };

  /* filter field config */
  const filterFields = [
    { label: 'Shift',           name: 'shift',      options: SHIFTS.map(s => ({ value: s.id, label: s.shift_name })) },
    { label: 'Medium',          name: 'medium',     options: MEDIUMS.map(m => ({ value: m.id, label: m.name })) },
    { label: 'Education Level', name: 'edu_level',  options: EDU_LEVELS.map(e => ({ value: e.id, label: e.title })) },
    { label: 'Department',      name: 'department', options: DEPARTMENTS.map(d => ({ value: d.id, label: d.title })) },
    { label: 'Class',           name: 'class_name', options: filteredClasses.map(c => ({ value: c.class_name, label: c.class_name })) },
    { label: 'Session',         name: 'session',    options: SESSIONS.map(s => ({ value: s.name, label: s.name })) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Subject Sub Type']} />

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Criteria</span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">All fields are required to search</span>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {filterFields.map(f => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {f.label}<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    name={f.name}
                    value={filter[f.name]}
                    onChange={handleFilterChange}
                    className={inp(filterErrors[f.name])}
                  >
                    <option value="">Select</option>
                    {f.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {filterErrors[f.name] && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={10} /> Required
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Search size={14} /> Search Records
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Tags size={16} className="text-blue-500" />
                Subject Sub Type List
                <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {results.length} record{results.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600
                      bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500
                      focus:ring-2 focus:ring-blue-100 w-40 transition-all" />
                </div>
                <button onClick={openAdd}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white
                    bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                  <Plus size={14} /> Add New
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['#', 'Class', 'Session', 'Title', 'Code', '# Subjects', 'Order', 'Category', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-14 text-center">
                        <Tags size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No records found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Click <strong>Add New</strong> to create a sub type for this filter.
                        </p>
                      </td>
                    </tr>
                  ) : results.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{item.class_name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{item.session}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300 text-center">{item.num_subjects}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300 text-center">{item.sort_order}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openView(item)} title="View"
                            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                              hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400
                              flex items-center justify-center transition-all">
                            <Eye size={12} />
                          </button>
                          <button onClick={() => openEdit(item)} title="Edit"
                            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                              hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600
                              text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} title="Delete"
                            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                              hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 hover:text-red-500
                              text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
              Showing {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

      </div>

      {modal && (
        <SubTypeModal
          mode={modal.mode}
          data={modal.data}
          errors={modalErrors}
          onChange={handleModalChange}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </DashboardLayout>
  );
}