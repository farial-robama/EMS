// src/pages/super-admin/globalConfigurations/instituteSetup/ClassSetup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  GraduationCap,
  Plus,
  Search,
  Pencil,
  X,
  Check,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Users,
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

const dummyDepartments = [
  { id: 1, shift_id: 1, medium_id: 1, education_level_id: 1, title: 'Science' },
  { id: 2, shift_id: 1, medium_id: 2, education_level_id: 2, title: 'Arts' },
  {
    id: 3,
    shift_id: 1,
    medium_id: 2,
    education_level_id: 2,
    title: 'Commerce',
  },
  { id: 4, shift_id: 2, medium_id: 3, education_level_id: 3, title: 'Science' },
  { id: 5, shift_id: 2, medium_id: 4, education_level_id: 4, title: 'General' },
  {
    id: 6,
    shift_id: 3,
    medium_id: 5,
    education_level_id: 5,
    title: 'Business Studies',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getName = (arr, id, key) =>
  arr.find((x) => x.id === Number(id))?.[key] || '—';

const EMPTY_FORM = {
  shift: '',
  medium: '',
  edu_level: '',
  department: '',
  class_name: '',
  class_code: '',
  ordering: '',
  roll_identifier: '',
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
function ClassModal({
  mode,
  data,
  errors,
  onChange,
  cascaded,
  onSave,
  onClose,
}) {
  const isEdit = mode === 'edit';
  const { mediums, eduLevels, departments } = cascaded;

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
            {isEdit ? 'Edit Class' : 'Add New Class'}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Shift + Medium */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Shift</FieldLabel>
              <select
                value={data.shift}
                onChange={(e) => onChange('shift', e.target.value)}
                className={inputCls(errors.shift)}
              >
                <option value="">Select Shift</option>
                {dummyShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shift_name}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.shift} />
            </div>
            <div>
              <FieldLabel required>Medium</FieldLabel>
              <select
                value={data.medium}
                onChange={(e) => onChange('medium', e.target.value)}
                disabled={!data.shift}
                className={inputCls(errors.medium)}
              >
                <option value="">Select Medium</option>
                {mediums.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.medium} />
            </div>
          </div>

          {/* Education Level + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Education Level</FieldLabel>
              <select
                value={data.edu_level}
                onChange={(e) => onChange('edu_level', e.target.value)}
                disabled={!data.medium}
                className={inputCls(errors.edu_level)}
              >
                <option value="">Select Level</option>
                {eduLevels.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.edu_level} />
            </div>
            <div>
              <FieldLabel required>Department</FieldLabel>
              <select
                value={data.department}
                onChange={(e) => onChange('department', e.target.value)}
                disabled={!data.edu_level}
                className={inputCls(errors.department)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              <ErrMsg msg={errors.department} />
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Class Name */}
          <div>
            <FieldLabel required>Class Name</FieldLabel>
            <input
              type="text"
              value={data.class_name}
              onChange={(e) => onChange('class_name', e.target.value)}
              placeholder="e.g. Class Six"
              className={inputCls(errors.class_name)}
            />
            <ErrMsg msg={errors.class_name} />
          </div>

          {/* Class Code + Roll Identifier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Class Code (auto)</FieldLabel>
              <input
                type="text"
                value={data.class_code || ''}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 font-mono outline-none cursor-default"
              />
            </div>
            <div>
              <FieldLabel required>Roll Identifier</FieldLabel>
              <input
                type="text"
                value={data.roll_identifier}
                onChange={(e) => onChange('roll_identifier', e.target.value)}
                placeholder="e.g. ROL-001"
                className={inputCls(errors.roll_identifier)}
              />
              <ErrMsg msg={errors.roll_identifier} />
            </div>
          </div>

          {/* Ordering + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Display Order</FieldLabel>
              <input
                type="number"
                min="1"
                value={data.ordering}
                onChange={(e) => onChange('ordering', e.target.value)}
                placeholder="e.g. 1"
                className={inputCls(false)}
              />
            </div>
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
            {isEdit ? 'Update Class' : 'Add Class'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClassSetup() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [errors, setErrors] = useState({});
  const [codeCounter, setCodeCounter] = useState(1);

  // Cascaded dropdown options driven by modal selections
  const [mediums, setMediums] = useState([]);
  const [eduLevels, setEduLevels] = useState([]);
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    if (!modal) return;
    const shift = modal.data.shift;
    if (!shift) {
      setMediums([]);
      setEduLevels([]);
      setDepts([]);
      return;
    }
    setMediums(
      dummyMediums.filter(
        (m) => m.shift_id === Number(shift) && m.status === 'Active'
      )
    );
  }, [modal?.data?.shift]);

  useEffect(() => {
    if (!modal) return;
    const { shift, medium } = modal.data;
    if (!medium) {
      setEduLevels([]);
      setDepts([]);
      return;
    }
    setEduLevels(
      dummyEducationLevels.filter(
        (e) => e.shift_id === Number(shift) && e.medium_id === Number(medium)
      )
    );
  }, [modal?.data?.medium]);

  useEffect(() => {
    if (!modal) return;
    const { shift, medium, edu_level } = modal.data;
    if (!edu_level) {
      setDepts([]);
      return;
    }
    setDepts(
      dummyDepartments.filter(
        (d) =>
          d.shift_id === Number(shift) &&
          d.medium_id === Number(medium) &&
          d.education_level_id === Number(edu_level)
      )
    );
  }, [modal?.data?.edu_level]);

  // Stats
  const totalCount = classes.length;
  const activeCount = classes.filter((c) => c.status === 'Active').length;
  const inactiveCount = classes.filter((c) => c.status === 'Inactive').length;

  const filtered = useMemo(
    () =>
      classes.filter(
        (c) =>
          !search.trim() ||
          c.class_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.class_code?.toLowerCase().includes(search.toLowerCase()) ||
          getName(dummyShifts, c.shift, 'shift_name')
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [classes, search]
  );

  const validate = (d) => {
    const e = {};
    if (!d.shift) e.shift = 'Shift is required.';
    if (!d.medium) e.medium = 'Medium is required.';
    if (!d.edu_level) e.edu_level = 'Education level is required.';
    if (!d.department) e.department = 'Department is required.';
    if (!d.class_name?.trim()) e.class_name = 'Class name is required.';
    else if (d.class_name.trim().length < 2)
      e.class_name = 'Minimum 2 characters.';
    if (!d.roll_identifier?.trim())
      e.roll_identifier = 'Roll identifier is required.';
    return e;
  };

  const openAdd = () => {
    const code = `CLS-${String(codeCounter).padStart(4, '0')}`;
    setErrors({});
    setMediums([]);
    setEduLevels([]);
    setDepts([]);
    setModal({ mode: 'add', data: { ...EMPTY_FORM, class_code: code } });
  };

  const openEdit = (cls) => {
    setErrors({});
    setMediums(
      dummyMediums.filter(
        (m) => m.shift_id === Number(cls.shift) && m.status === 'Active'
      )
    );
    setEduLevels(
      dummyEducationLevels.filter(
        (e) =>
          e.shift_id === Number(cls.shift) && e.medium_id === Number(cls.medium)
      )
    );
    setDepts(
      dummyDepartments.filter(
        (d) =>
          d.shift_id === Number(cls.shift) &&
          d.medium_id === Number(cls.medium) &&
          d.education_level_id === Number(cls.edu_level)
      )
    );
    setModal({ mode: 'edit', data: { ...cls } });
  };

  const close = () => setModal(null);

  const handleChange = (field, value) => {
    setModal((p) => {
      const updated = { ...p.data, [field]: value };
      if (field === 'shift') {
        updated.medium = '';
        updated.edu_level = '';
        updated.department = '';
      }
      if (field === 'medium') {
        updated.edu_level = '';
        updated.department = '';
      }
      if (field === 'edu_level') {
        updated.department = '';
      }
      return { ...p, data: updated };
    });
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSave = () => {
    const e = validate(modal.data);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (modal.mode === 'add') {
      setClasses((p) => [...p, { ...modal.data, id: Date.now() }]);
      setCodeCounter((n) => n + 1);
    } else {
      setClasses((p) =>
        p.map((c) => (c.id === modal.data.id ? { ...modal.data } : c))
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
            'Class Setup',
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
              label: 'Total Classes',
              value: totalCount,
              color: 'bg-blue-50 dark:bg-blue-900/20',
              icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
              Icon: BookOpen,
            },
            {
              label: 'Active',
              value: activeCount,
              color: 'bg-green-50 dark:bg-green-900/20',
              icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
              Icon: Users,
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
              <GraduationCap size={16} className="text-blue-500" />
              Class List
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search class..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 w-48 transition-all"
                />
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                <Plus size={14} /> Add Class
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
                    'Department',
                    'Class Name',
                    'Code',
                    'Roll ID',
                    'Order',
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
                    <td colSpan={11} className="px-5 py-16 text-center">
                      <GraduationCap
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {search
                          ? 'No classes match your search.'
                          : 'No classes added yet. Click "Add Class" to get started.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {getName(dummyShifts, c.shift, 'shift_name')}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {getName(dummyMediums, c.medium, 'name')}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {getName(dummyEducationLevels, c.edu_level, 'title')}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {getName(dummyDepartments, c.department, 'title')}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {c.class_name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md whitespace-nowrap">
                          {c.class_code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {c.roll_identifier}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {c.ordering || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            c.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`}
                          />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openEdit(c)}
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
            <span>{totalCount} total classes</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ClassModal
          mode={modal.mode}
          data={modal.data}
          errors={errors}
          onChange={handleChange}
          cascaded={{ mediums, eduLevels, departments: depts }}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </DashboardLayout>
  );
}
