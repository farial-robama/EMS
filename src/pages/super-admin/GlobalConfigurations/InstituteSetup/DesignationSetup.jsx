// src/pages/super-admin/globalConfigurations/instituteSetup/DesignationSetup.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight, Briefcase, Plus, Search, Pencil, Trash2, Eye, X, Check, AlertCircle,
} from 'lucide-react';

/* ── Static Data ─────────────────────────────────────────────────────────── */
const INITIAL = [
  { id: 1,  titleEng: 'Principal',            titleBng: 'প্রিন্সিপাল' },
  { id: 2,  titleEng: 'Assistant Headmaster', titleBng: 'সহকারী প্রধান শিক্ষক' },
  { id: 3,  titleEng: 'Assistant Teacher',    titleBng: 'সহকারী শিক্ষক' },
  { id: 4,  titleEng: 'Senior Teacher',       titleBng: 'সিনিয়র শিক্ষক' },
  { id: 5,  titleEng: 'Jr. Teacher',          titleBng: 'জুনিয়র শিক্ষক' },
  { id: 6,  titleEng: 'Pion',                 titleBng: 'পিওন' },
  { id: 7,  titleEng: 'Clerk',                titleBng: 'কেরানি' },
  { id: 8,  titleEng: 'Aya',                  titleBng: 'আয়া' },
  { id: 9,  titleEng: 'Guard',                titleBng: 'গার্ড' },
  { id: 10, titleEng: 'Asst. Clerk',          titleBng: 'অ্যাসিস্ট্যান্ট ক্লার্ক' },
];
const EMPTY_FORM = { titleEng: '', titleBng: '' };

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
function DesignationModal({ mode, data, errors, onChange, onSave, onClose }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700
          ${isView ? 'bg-gray-50 dark:bg-gray-700/30'
            : isEdit ? 'bg-amber-50 dark:bg-amber-900/10'
            : 'bg-blue-50 dark:bg-blue-900/10'}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {isView ? <Eye size={15} className="text-gray-500" />
              : isEdit ? <Pencil size={15} className="text-amber-500" />
              : <Plus size={15} className="text-blue-500" />}
            {isView ? 'View' : isEdit ? 'Edit' : 'Add New'} Designation
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex items-center justify-center transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {isView ? (
            <dl className="divide-y divide-gray-50 dark:divide-gray-700">
              {[['Title (English)', data.titleEng], ['Title (Bangla)', data.titleBng]].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3.5">
                  <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</dt>
                  <dd className="text-sm font-medium text-gray-800 dark:text-gray-100">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <>
              <Field label="Title in English" required error={errors.titleEng}>
                <input name="titleEng" value={data.titleEng} onChange={onChange}
                  placeholder="e.g. Principal" autoFocus className={inp(errors.titleEng)} />
              </Field>
              <Field label="Title in Bangla" required error={errors.titleBng}>
                <input name="titleBng" value={data.titleBng} onChange={onChange}
                  placeholder="প্রিন্সিপাল" className={inp(errors.titleBng)} />
              </Field>
            </>
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600
                hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Check size={14} /> {isEdit ? 'Save Changes' : 'Add Designation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function DesignationSetup() {
  const [designations, setDesignations] = useState(INITIAL);
  const [search, setSearch]             = useState('');
  const [modal, setModal]               = useState(null); // { mode, data }
  const [modalErrors, setModalErrors]   = useState({});

  const filtered = useMemo(() =>
    designations.filter(d =>
      d.titleEng.toLowerCase().includes(search.toLowerCase()) ||
      d.titleBng.toLowerCase().includes(search.toLowerCase())
    ), [designations, search]);

  /* modal handlers */
  const openAdd  = () => { setModalErrors({}); setModal({ mode: 'add',  data: { ...EMPTY_FORM } }); };
  const openEdit = d  => { setModalErrors({}); setModal({ mode: 'edit', data: { ...d } }); };
  const openView = d  => setModal({ mode: 'view', data: { ...d } });
  const closeModal = () => setModal(null);

  const handleModalChange = e => {
    const { name, value } = e.target;
    setModal(p => ({ ...p, data: { ...p.data, [name]: value } }));
    if (modalErrors[name]) setModalErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = d => {
    const e = {};
    if (!d.titleEng.trim()) e.titleEng = 'English title is required';
    if (!d.titleBng.trim()) e.titleBng = 'Bangla title is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate(modal.data);
    if (Object.keys(errs).length) { setModalErrors(errs); return; }
    if (modal.mode === 'edit') {
      setDesignations(p => p.map(d => d.id === modal.data.id ? modal.data : d));
    } else {
      setDesignations(p => [...p, { ...modal.data, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this designation? This cannot be undone.')) return;
    setDesignations(p => p.filter(d => d.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Designation Setup']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Total Designations', value: designations.length, bg: 'bg-blue-50 dark:bg-blue-900/20',    icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
            { label: 'Search Results',     value: filtered.length,     bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                <Briefcase size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Briefcase size={16} className="text-blue-500" /> Designation List
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search designations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500
                    focus:ring-2 focus:ring-blue-100 w-52 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                  bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Plus size={14} /> Add Designation
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Title (English)', 'Title (Bangla)', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <Briefcase size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {search ? 'No designations match your search.' : 'No designations added yet.'}
                      </p>
                      {!search && (
                        <button onClick={openAdd}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <Plus size={13} /> Add your first designation
                        </button>
                      )}
                    </td>
                  </tr>
                ) : filtered.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400 w-12">{i + 1}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100">{d.titleEng}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">{d.titleBng}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openView(d)} title="View"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                            hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400
                            flex items-center justify-center transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(d)} title="Edit"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                            hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600
                            text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(d.id)} title="Delete"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                            hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 hover:text-red-500
                            text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            <span>Showing {filtered.length} of {designations.length} entries</span>
            {search && (
              <button onClick={() => setSearch('')} className="text-blue-500 hover:underline flex items-center gap-1">
                <X size={11} /> Clear search
              </button>
            )}
          </div>
        </div>

      </div>

      {modal && (
        <DesignationModal
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