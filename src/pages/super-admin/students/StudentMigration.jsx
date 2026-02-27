// src/pages/admin/studentSetup/StudentMigration.jsx
import React, { useState } from 'react';
import {
  ChevronRight,
  Shuffle,
  Eye,
  Check,
  X,
  AlertCircle,
  SlidersHorizontal,
  ArrowRight,
  Users,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Shared helpers ──────────────────────────────────────────────────────── */
const sel = `w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30`;
const selErr = `w-full px-3 py-2.5 text-sm rounded-xl border border-red-400
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-semibold'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
          }
        >
          {item}
        </span>
        {i < items.length - 1 && (
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

const F = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={10} />
        {error}
      </p>
    )}
  </div>
);

const DUMMY_STUDENTS = [
  {
    sl: 1,
    session: '2025-2026',
    regNo: '2210607239',
    name: 'SAIFUL ISLAM',
    prevRoll: '1202526033046',
    classRoll: '',
    remarks: '',
  },
  {
    sl: 2,
    session: '2025-2026',
    regNo: '2210662472',
    name: 'MD. NASIMUL ISLAM RADOAN',
    prevRoll: '1202526033047',
    classRoll: '',
    remarks: '',
  },
  {
    sl: 3,
    session: '2025-2026',
    regNo: '2210608416',
    name: 'MD. MAHARAB HOSSEN',
    prevRoll: '1202526033048',
    classRoll: '',
    remarks: '',
  },
  {
    sl: 4,
    session: '2025-2026',
    regNo: '2210601234',
    name: 'FATIMA BEGUM',
    prevRoll: '1202526033049',
    classRoll: '',
    remarks: '',
  },
  {
    sl: 5,
    session: '2025-2026',
    regNo: '2210605678',
    name: 'RAFIQ AHMED',
    prevRoll: '1202526033050',
    classRoll: '',
    remarks: '',
  },
];

const BLANK_CURRENT = {
  shift: 'Day',
  medium: 'Bangla',
  eduLevel: 'Higher Secondary',
  department: 'Science',
  currentClass: 'HSC-Science',
  currentSection: '1st Year',
  currentSession: '2025-2026',
  examName: '',
};
const BLANK_MIGRATE = {
  migrateShift: 'Day',
  migrateMedium: 'Bangla',
  migrateEduLevel: '',
  migrateDepartment: '',
  migrateClass: '',
  migrateSection: '',
  migrateSession: '',
};
const BLANK_OPTIONS = {
  archive: false,
  date: new Date().toISOString().split('T')[0],
};

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function StudentMigration() {
  const [currentFilters, setCurrentFilters] = useState(BLANK_CURRENT);
  const [migrateFilters, setMigrateFilters] = useState(BLANK_MIGRATE);
  const [options, setOptions] = useState(BLANK_OPTIONS);
  const [filterErrors, setFilterErrors] = useState({});
  const [migrateErrors, setMigrateErrors] = useState({});
  const [students, setStudents] = useState(DUMMY_STUDENTS);
  const [selected, setSelected] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCurrent = (e) => {
    const { name, value } = e.target;
    setCurrentFilters((p) => ({ ...p, [name]: value }));
    setFilterErrors((p) => ({ ...p, [name]: undefined }));
  };
  const handleMigrate = (e) => {
    const { name, value } = e.target;
    setMigrateFilters((p) => ({ ...p, [name]: value }));
    setMigrateErrors((p) => ({ ...p, [name]: undefined }));
  };
  const handleOptions = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleAll = (e) =>
    setSelected(e.target.checked ? students.map((s) => s.regNo) : []);
  const toggleOne = (regNo) =>
    setSelected((p) =>
      p.includes(regNo) ? p.filter((r) => r !== regNo) : [...p, regNo]
    );
  const allSelected =
    selected.length === students.length && students.length > 0;
  const someSelected = selected.length > 0 && !allSelected;

  const updateStudent = (regNo, field, value) =>
    setStudents((p) =>
      p.map((s) => (s.regNo === regNo ? { ...s, [field]: value } : s))
    );

  const handleShow = () => {
    const errs = {};
    [
      'shift',
      'medium',
      'eduLevel',
      'department',
      'currentClass',
      'currentSection',
      'currentSession',
    ].forEach((k) => {
      if (!currentFilters[k]) errs[k] = 'Required';
    });
    if (Object.keys(errs).length) {
      setFilterErrors(errs);
      return;
    }
    setFilterErrors({});
    setShowTable(true);
    setSelected([]);
    setSuccessMsg('');
  };

  const handleMigrateClick = () => {
    if (selected.length === 0) return;
    const errs = {};
    ['migrateClass', 'migrateSection', 'migrateSession'].forEach((k) => {
      if (!migrateFilters[k]) errs[k] = 'Required';
    });
    if (Object.keys(errs).length) {
      setMigrateErrors(errs);
      return;
    }
    setMigrateErrors({});
    setConfirmModal(true);
  };

  const confirmMigrate = async () => {
    setMigrating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setMigrating(false);
    setConfirmModal(false);
    setSuccessMsg(
      `✓ ${selected.length} student${selected.length !== 1 ? 's' : ''} migrated to ${migrateFilters.migrateClass} — ${migrateFilters.migrateSection} (${migrateFilters.migrateSession})`
    );
    setSelected([]);
  };

  const CURRENT_FIELDS = [
    { label: 'Shift', name: 'shift', opts: ['Day', 'Morning', 'Evening'] },
    { label: 'Medium', name: 'medium', opts: ['Bangla', 'English'] },
    {
      label: 'Edu Level',
      name: 'eduLevel',
      opts: ['Higher Secondary', 'Secondary'],
    },
    {
      label: 'Department',
      name: 'department',
      opts: ['Science', 'Arts', 'Commerce'],
    },
    { label: 'Class', name: 'currentClass', opts: ['HSC-Science', 'HSC-Arts'] },
    {
      label: 'Section',
      name: 'currentSection',
      opts: ['1st Year', '2nd Year', 'A', 'B'],
    },
    {
      label: 'Session',
      name: 'currentSession',
      opts: ['2024-2025', '2025-2026', '2026-2027'],
    },
    {
      label: 'Exam',
      name: 'examName',
      opts: ['', 'Final', 'Midterm', 'Half-Yearly'],
    },
  ];

  const MIGRATE_FIELDS = [
    {
      label: 'Shift',
      name: 'migrateShift',
      opts: ['Day', 'Morning', 'Evening'],
      req: false,
    },
    {
      label: 'Medium',
      name: 'migrateMedium',
      opts: ['Bangla', 'English'],
      req: false,
    },
    {
      label: 'Edu Level',
      name: 'migrateEduLevel',
      opts: ['', 'Higher Secondary', 'Secondary'],
      req: false,
    },
    {
      label: 'Department',
      name: 'migrateDepartment',
      opts: ['', 'Science', 'Arts', 'Commerce'],
      req: false,
    },
    {
      label: 'Class',
      name: 'migrateClass',
      opts: ['', 'HSC-Science', 'HSC-Arts', 'HSC-Commerce'],
      req: true,
    },
    {
      label: 'Section',
      name: 'migrateSection',
      opts: ['', '2nd Year', '3rd Year', 'A', 'B'],
      req: true,
    },
    {
      label: 'Session',
      name: 'migrateSession',
      opts: ['', '2026-2027', '2027-2028'],
      req: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Student Setup', 'Student Migration']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Shuffle size={22} className="text-purple-500" /> Student Migration
          </h1>
        </div>

        {/* ── Current Class Filters ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
            <SlidersHorizontal size={15} className="text-purple-500" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              Current Class
            </span>
            <span className="text-xs text-purple-400/70">
              — Source class for migration
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {CURRENT_FIELDS.map((f) => (
                <F
                  key={f.name}
                  label={f.label}
                  required={f.name !== 'examName'}
                  error={filterErrors[f.name]}
                >
                  <select
                    name={f.name}
                    value={currentFilters[f.name]}
                    onChange={handleCurrent}
                    className={filterErrors[f.name] ? selErr : sel}
                  >
                    {f.opts.map((o) => (
                      <option key={o} value={o}>
                        {o || 'Select'}
                      </option>
                    ))}
                  </select>
                </F>
              ))}
            </div>
            <button
              onClick={handleShow}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-sm shadow-purple-200"
            >
              <Eye size={14} /> Show Students
            </button>
          </div>
        </div>

        {/* ── Student Table ───────────────────────────────────────────────── */}
        {showTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Users size={16} className="text-purple-500" />
                Student List
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                  {students.length} students
                </span>
              </div>
              {selected.length > 0 && (
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-xl">
                  {selected.length} selected
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => el && (el.indeterminate = someSelected)}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                      />
                    </th>
                    {[
                      '#',
                      'Session',
                      'Reg. No',
                      'Student Name',
                      'Prev. Roll',
                      'New Class Roll',
                      'Remarks',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {students.map((s, i) => (
                    <tr
                      key={s.regNo}
                      className={`transition-colors ${selected.includes(s.regNo) ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(s.regNo)}
                          onChange={() => toggleOne(s.regNo)}
                          className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">
                          {s.session}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-700 dark:text-gray-300">
                        {s.regNo}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {s.prevRoll}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={s.classRoll}
                          onChange={(e) =>
                            updateStudent(s.regNo, 'classRoll', e.target.value)
                          }
                          placeholder="New roll…"
                          className="w-32 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100 transition-all"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={s.remarks}
                          onChange={(e) =>
                            updateStudent(s.regNo, 'remarks', e.target.value)
                          }
                          placeholder="Optional…"
                          className="w-40 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100 transition-all"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Options ─────────────────────────────────────────────────────── */}
        {showTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Migration Options
              </span>
            </div>
            <div className="p-5 flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                ${options.archive ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-500 group-hover:border-purple-400'}`}
                >
                  {options.archive && (
                    <Check size={11} className="text-white" />
                  )}
                  <input
                    type="checkbox"
                    name="archive"
                    checked={options.archive}
                    onChange={handleOptions}
                    className="sr-only"
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Cancel Admission After Migration
                </span>
              </label>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Effective Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={options.date}
                  onChange={handleOptions}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Migrate To ──────────────────────────────────────────────────── */}
        {showTable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
              <ArrowRight size={15} className="text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                Migrate To
              </span>
              <span className="text-xs text-purple-400/70">
                — Select destination class
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {MIGRATE_FIELDS.map((f) => (
                  <F
                    key={f.name}
                    label={f.label}
                    required={f.req}
                    error={migrateErrors[f.name]}
                  >
                    <select
                      name={f.name}
                      value={migrateFilters[f.name]}
                      onChange={handleMigrate}
                      className={migrateErrors[f.name] ? selErr : sel}
                    >
                      {f.opts.map((o) => (
                        <option key={o} value={o}>
                          {o || 'Select'}
                        </option>
                      ))}
                    </select>
                  </F>
                ))}
              </div>

              {successMsg && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10">
                  <Check size={16} className="text-purple-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                    {successMsg}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleMigrateClick}
                  disabled={selected.length === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                  ${selected.length === 0 ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}`}
                >
                  <Shuffle size={15} />
                  Migrate {selected.length > 0 ? `${selected.length} ` : ''}
                  Selected
                </button>
                {selected.length === 0 && showTable && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <AlertCircle size={11} /> Select at least one student to
                    migrate
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Modal ────────────────────────────────────────────────── */}
        {confirmModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => !migrating && setConfirmModal(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 px-5 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Shuffle
                    size={14}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Confirm Migration
                </span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You are about to migrate{' '}
                  <span className="font-bold text-gray-800 dark:text-white">
                    {selected.length} student{selected.length !== 1 ? 's' : ''}
                  </span>{' '}
                  to:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Class', value: migrateFilters.migrateClass },
                    { label: 'Section', value: migrateFilters.migrateSection },
                    { label: 'Session', value: migrateFilters.migrateSession },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 text-center"
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                        {d.label}
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {d.value || '—'}
                      </p>
                    </div>
                  ))}
                </div>
                {options.archive && (
                  <span className="inline-flex text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">
                    Admission will be cancelled
                  </span>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Effective date:{' '}
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {options.date}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => setConfirmModal(false)}
                  disabled={migrating}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMigrate}
                  disabled={migrating}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                  ${migrating ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}`}
                >
                  {migrating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Migrating…
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Confirm Migration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
