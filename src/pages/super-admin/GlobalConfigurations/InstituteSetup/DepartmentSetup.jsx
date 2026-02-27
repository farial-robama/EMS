// src/pages/super-admin/globalConfigurations/instituteSetup/DepartmentsSetup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  Layers,
  Plus,
  Search,
  Pencil,
  X,
  Check,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const dummyShifts = [
  { id: 1, shift_name: 'Morning', status: 'Active' },
  { id: 2, shift_name: 'Evening', status: 'Active' },
  { id: 3, shift_name: 'Day', status: 'Active' },
];

const dummyMediums = [
  { id: 1, shift_id: 1, name: 'Bangla', status: 'Active' },
  { id: 2, shift_id: 1, name: 'English', status: 'Active' },
  { id: 3, shift_id: 2, name: 'English', status: 'Active' },
  { id: 4, shift_id: 2, name: 'Bangla', status: 'Active' },
  { id: 5, shift_id: 3, name: 'English', status: 'Active' },
];

const dummyEducationLevels = [
  { id: 1, shift_id: 1, medium_id: 1, title: 'Primary', status: 'Active' },
  { id: 2, shift_id: 1, medium_id: 2, title: 'Secondary', status: 'Active' },
  {
    id: 3,
    shift_id: 2,
    medium_id: 3,
    title: 'Higher Secondary',
    status: 'Active',
  },
  { id: 4, shift_id: 2, medium_id: 4, title: 'Primary', status: 'Active' },
  { id: 5, shift_id: 3, medium_id: 5, title: 'Secondary', status: 'Active' },
];

const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    shift_id: 1,
    shift_name: 'Morning',
    medium_id: 1,
    medium_name: 'Bangla',
    education_level_id: 1,
    education_level_title: 'Primary',
    code: 'SCI',
    title: 'Science',
    bangla_title: 'বিজ্ঞান',
    roll: 1,
    status: 'Active',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  shift_id: '',
  shift_name: '',
  medium_id: '',
  medium_name: '',
  education_level_id: '',
  education_level_title: '',
  code: '',
  title: '',
  bangla_title: '',
  roll: '',
  status: 'Active',
};

// ─── Shared field components ──────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800/40'
      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
  }`;

const ErrMsg = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={11} /> {msg}
    </p>
  ) : null;

// ─── Modal ────────────────────────────────────────────────────────────────────
function DeptModal({
  mode,
  data,
  errors,
  onChange,
  cascaded,
  onSave,
  onClose,
}) {
  const isEdit = mode === 'edit';
  const { mediums, eduLevels } = cascaded;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
            {isEdit ? <Pencil size={15} /> : <Plus size={15} />}
            {isEdit ? 'Edit Department' : 'Add New Department'}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Shift + Medium */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Shift</FieldLabel>
              <select
                value={data.shift_id}
                onChange={(e) => {
                  const s = dummyShifts.find(
                    (x) => x.id === Number(e.target.value)
                  );
                  onChange('shift', e.target.value, s?.shift_name || '');
                }}
                className={inputCls(errors.shift_id)}
              >
                <option value="">Select Shift</option>
                {dummyShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shift_name}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.shift_id} />
            </div>
            <div>
              <FieldLabel required>Medium</FieldLabel>
              <select
                value={data.medium_id}
                onChange={(e) => {
                  const m = mediums.find(
                    (x) => x.id === Number(e.target.value)
                  );
                  onChange('medium', e.target.value, m?.name || '');
                }}
                disabled={!data.shift_id}
                className={inputCls(errors.medium_id)}
              >
                <option value="">Select Medium</option>
                {mediums.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.medium_id} />
            </div>
          </div>

          {/* Education Level */}
          <div>
            <FieldLabel required>Education Level</FieldLabel>
            <select
              value={data.education_level_id}
              onChange={(e) => {
                const el = eduLevels.find(
                  (x) => x.id === Number(e.target.value)
                );
                onChange('edu_level', e.target.value, el?.title || '');
              }}
              disabled={!data.medium_id}
              className={inputCls(errors.education_level_id)}
            >
              <option value="">Select Education Level</option>
              {eduLevels.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.title}
                </option>
              ))}
            </select>
            <ErrMsg msg={errors.education_level_id} />
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Department Code + Roll */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Department Code</FieldLabel>
              <input
                type="text"
                value={data.code}
                onChange={(e) => onChange('code', e.target.value)}
                placeholder="e.g. SCI"
                className={inputCls(errors.code)}
              />
              <ErrMsg msg={errors.code} />
            </div>
            <div>
              <FieldLabel required>Roll / Order</FieldLabel>
              <input
                type="number"
                min="1"
                value={data.roll}
                onChange={(e) => onChange('roll', e.target.value)}
                placeholder="e.g. 1"
                className={inputCls(errors.roll)}
              />
              <ErrMsg msg={errors.roll} />
            </div>
          </div>

          {/* Department Name */}
          <div>
            <FieldLabel required>Department Name (English)</FieldLabel>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g. Science"
              className={inputCls(errors.title)}
            />
            <ErrMsg msg={errors.title} />
          </div>

          {/* Department Bangla Name */}
          <div>
            <FieldLabel required>Department Name (Bangla)</FieldLabel>
            <input
              type="text"
              value={data.bangla_title}
              onChange={(e) => onChange('bangla_title', e.target.value)}
              placeholder="e.g. বিজ্ঞান"
              className={inputCls(errors.bangla_title)}
            />
            <ErrMsg msg={errors.bangla_title} />
          </div>

          {/* Status */}
          <div>
            <FieldLabel>Status</FieldLabel>
            <select
              value={data.status}
              onChange={(e) => onChange('status', e.target.value)}
              className={inputCls(false)}
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
            {isEdit ? 'Update Department' : 'Add Department'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DepartmentsSetup() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [errors, setErrors] = useState({});

  // Cascaded options
  const [mediums, setMediums] = useState([]);
  const [eduLevels, setEduLevels] = useState([]);

  // Rebuild cascade when modal data changes
  useEffect(() => {
    if (!modal) return;
    const sid = modal.data.shift_id;
    if (!sid) {
      setMediums([]);
      setEduLevels([]);
      return;
    }
    setMediums(
      dummyMediums.filter(
        (m) => m.shift_id === Number(sid) && m.status === 'Active'
      )
    );
  }, [modal?.data?.shift_id]);

  useEffect(() => {
    if (!modal) return;
    const { shift_id, medium_id } = modal.data;
    if (!medium_id) {
      setEduLevels([]);
      return;
    }
    setEduLevels(
      dummyEducationLevels.filter(
        (e) =>
          e.shift_id === Number(shift_id) && e.medium_id === Number(medium_id)
      )
    );
  }, [modal?.data?.medium_id]);

  // Stats
  const totalCount = departments.length;
  const activeCount = departments.filter((d) => d.status === 'Active').length;
  const inactiveCount = departments.filter(
    (d) => d.status === 'Inactive'
  ).length;

  const filtered = useMemo(
    () =>
      departments.filter(
        (d) =>
          !search.trim() ||
          d.title?.toLowerCase().includes(search.toLowerCase()) ||
          d.code?.toLowerCase().includes(search.toLowerCase()) ||
          d.shift_name?.toLowerCase().includes(search.toLowerCase()) ||
          d.bangla_title?.includes(search)
      ),
    [departments, search]
  );

  // Validation
  const validate = (d) => {
    const e = {};
    if (!d.shift_id) e.shift_id = 'Shift is required.';
    if (!d.medium_id) e.medium_id = 'Medium is required.';
    if (!d.education_level_id)
      e.education_level_id = 'Education level is required.';
    if (!d.code?.trim()) e.code = 'Department code is required.';
    if (!d.title?.trim()) e.title = 'Department name is required.';
    else if (d.title.trim().length < 2) e.title = 'Minimum 2 characters.';
    if (!d.bangla_title?.trim()) e.bangla_title = 'Bangla name is required.';
    if (!d.roll) e.roll = 'Roll / order is required.';
    return e;
  };

  // Open modal
  const openAdd = () => {
    setErrors({});
    setMediums([]);
    setEduLevels([]);
    setModal({ mode: 'add', data: { ...EMPTY_FORM } });
  };

  const openEdit = (dept) => {
    setErrors({});
    setMediums(
      dummyMediums.filter(
        (m) => m.shift_id === Number(dept.shift_id) && m.status === 'Active'
      )
    );
    setEduLevels(
      dummyEducationLevels.filter(
        (e) =>
          e.shift_id === Number(dept.shift_id) &&
          e.medium_id === Number(dept.medium_id)
      )
    );
    setModal({ mode: 'edit', data: { ...dept } });
  };

  const close = () => setModal(null);

  // Field change handler (handles both simple and cascade fields)
  const handleChange = (field, value, label = '') => {
    setModal((p) => {
      const updated = { ...p.data };
      if (field === 'shift') {
        updated.shift_id = value;
        updated.shift_name = label;
        updated.medium_id = '';
        updated.medium_name = '';
        updated.education_level_id = '';
        updated.education_level_title = '';
      } else if (field === 'medium') {
        updated.medium_id = value;
        updated.medium_name = label;
        updated.education_level_id = '';
        updated.education_level_title = '';
      } else if (field === 'edu_level') {
        updated.education_level_id = value;
        updated.education_level_title = label;
      } else {
        updated[field] = value;
      }
      return { ...p, data: updated };
    });
    const errKey =
      field === 'shift'
        ? 'shift_id'
        : field === 'medium'
          ? 'medium_id'
          : field === 'edu_level'
            ? 'education_level_id'
            : field;
    if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: undefined }));
  };

  const handleSave = () => {
    const e = validate(modal.data);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (modal.mode === 'add') {
      setDepartments((p) => [...p, { ...modal.data, id: Date.now() }]);
    } else {
      setDepartments((p) =>
        p.map((d) => (d.id === modal.data.id ? { ...modal.data } : d))
      );
    }
    close();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          {[
            'Dashboard',
            'Global Configurations',
            'Institute Setup',
            'Departments Setup',
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
              label: 'Total Departments',
              value: totalCount,
              color: 'bg-blue-50 dark:bg-blue-900/20',
              icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
              Icon: LayoutGrid,
            },
            {
              label: 'Active',
              value: activeCount,
              color: 'bg-green-50 dark:bg-green-900/20',
              icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
              Icon: CheckCircle2,
            },
            {
              label: 'Inactive',
              value: inactiveCount,
              color: 'bg-red-50 dark:bg-red-900/20',
              icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
              Icon: XCircle,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.color}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}
              >
                <s.Icon size={18} />
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
              <Layers size={16} className="text-blue-500" />
              Departments List
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 w-48 transition-all"
                />
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                <Plus size={14} /> Add Department
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
                    'Shift',
                    'Medium',
                    'Education Level',
                    'Code',
                    'Department Name',
                    'Bangla Name',
                    'Roll',
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
                    <td colSpan={10} className="px-5 py-16 text-center">
                      <Layers
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {search
                          ? 'No departments match your search.'
                          : 'No departments added yet. Click "Add Department" to get started.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((d, i) => (
                    <tr
                      key={d.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {d.shift_name}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {d.medium_name}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {d.education_level_title}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
                          {d.code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {d.title}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">
                        {d.bangla_title}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {d.roll}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            d.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${d.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`}
                          />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openEdit(d)}
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
            <span>{totalCount} total departments</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <DeptModal
          mode={modal.mode}
          data={modal.data}
          errors={errors}
          onChange={handleChange}
          cascaded={{ mediums, eduLevels }}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </DashboardLayout>
  );
}
