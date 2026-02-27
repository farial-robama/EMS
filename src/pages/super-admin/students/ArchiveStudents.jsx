// src/pages/admin/studentSetup/ArchiveStudents.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Archive,
  Search,
  Eye,
  Download,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

const FILTER_OPTIONS = {
  shift: ['Day', 'Morning', 'Evening'],
  medium: ['Bangla', 'English'],
  eduLevel: ['Higher Secondary', 'Secondary'],
  department: ['Science', 'Arts', 'Commerce'],
  className: [
    'HSC-Science',
    'HSC-Arts',
    'HSC-Commerce',
    'SSC-Science',
    'SSC-Arts',
  ],
  section: ['1st Year', '2nd Year', 'A', 'B', 'C'],
  session: ['2024-2025', '2025-2026', '2026-2027'],
};

const INITIAL_STUDENTS = [
  {
    id: 1,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Higher Secondary',
    department: 'Science',
    className: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentCode: '2210607239',
    name: 'SAIFUL ISLAM',
    classRoll: '1202526033046',
    active: true,
  },
  {
    id: 2,
    shift: 'Morning',
    medium: 'English',
    eduLevel: 'Higher Secondary',
    department: 'Science',
    className: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentCode: '2210662472',
    name: 'MD. NASIMUL ISLAM RADOAN',
    classRoll: '1202526033047',
    active: false,
  },
  {
    id: 3,
    shift: 'Day',
    medium: 'Bangla',
    eduLevel: 'Higher Secondary',
    department: 'Arts',
    className: 'HSC-Arts',
    section: '2nd Year',
    session: '2024-2025',
    studentCode: '2210600001',
    name: 'FATIMA BEGUM',
    classRoll: '1202526033048',
    active: true,
  },
  {
    id: 4,
    shift: 'Evening',
    medium: 'English',
    eduLevel: 'Secondary',
    department: 'Science',
    className: 'SSC-Science',
    section: 'A',
    session: '2025-2026',
    studentCode: '2210600002',
    name: 'RAFIQ AHMED',
    classRoll: '1202526033049',
    active: false,
  },
];

const EMPTY_FILTER = {
  shift: '',
  medium: '',
  eduLevel: '',
  department: '',
  className: '',
  section: '',
  session: '',
  roll: '',
  studentCode: '',
};

const inp = `px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-full`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
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

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`}
    />
    {active ? 'Active' : 'Archived'}
  </span>
);

export default function ArchiveStudents() {
  const [filters, setFilters] = useState(EMPTY_FILTER);
  const [filterErrors, setFilterErrors] = useState({});
  const [searched, setSearched] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [students] = useState(INITIAL_STUDENTS);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
    setFilterErrors((p) => ({ ...p, [name]: undefined }));
    setSearched(false);
  };

  const handleSearch = () => {
    const required = [
      'shift',
      'medium',
      'eduLevel',
      'department',
      'className',
      'section',
      'session',
    ];
    const errs = {};
    required.forEach((k) => {
      if (!filters[k]) errs[k] = 'Required';
    });
    if (Object.keys(errs).length) {
      setFilterErrors(errs);
      return;
    }
    setFilterErrors({});
    setSearched(true);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTER);
    setFilterErrors({});
    setSearched(false);
    setTableSearch('');
  };

  const results = useMemo(() => {
    if (!searched) return [];
    return students.filter(
      (s) =>
        s.shift === filters.shift &&
        s.medium === filters.medium &&
        s.eduLevel === filters.eduLevel &&
        s.department === filters.department &&
        s.className === filters.className &&
        s.section === filters.section &&
        s.session === filters.session &&
        (!filters.roll || s.classRoll.includes(filters.roll)) &&
        (!filters.studentCode || s.studentCode.includes(filters.studentCode)) &&
        (!tableSearch ||
          `${s.name} ${s.studentCode} ${s.classRoll}`
            .toLowerCase()
            .includes(tableSearch.toLowerCase()))
    );
  }, [students, filters, searched, tableSearch]);

  const handleExport = () => {
    const rows = [
      [
        'SL',
        'Shift',
        'Medium',
        'Edu Level',
        'Department',
        'Class',
        'Section',
        'Session',
        'Student Code',
        'Name',
        'Roll',
        'Status',
      ],
      ...results.map((s, i) => [
        i + 1,
        s.shift,
        s.medium,
        s.eduLevel,
        s.department,
        s.className,
        s.section,
        s.session,
        s.studentCode,
        s.name,
        s.classRoll,
        s.active ? 'Active' : 'Archived',
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
      download: 'archive_students.csv',
    });
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb
          items={['Dashboard', 'Student Setup', 'Archive Students']}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Students',
              value: students.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Active',
              value: students.filter((s) => s.active).length,
              bg: 'bg-green-50 dark:bg-green-900/20',
              icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
            {
              label: 'Archived',
              value: students.filter((s) => !s.active).length,
              bg: 'bg-red-50 dark:bg-red-900/20',
              icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}
              >
                <Archive size={18} />
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

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Filter Criteria
            </span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              Select all required fields
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {[
                { label: 'Shift', name: 'shift' },
                { label: 'Medium', name: 'medium' },
                { label: 'Edu. Level', name: 'eduLevel' },
                { label: 'Department', name: 'department' },
                { label: 'Class', name: 'className' },
                { label: 'Section', name: 'section' },
                { label: 'Session', name: 'session' },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {f.label}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    name={f.name}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    className={`${inp} ${filterErrors[f.name] ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select</option>
                    {(FILTER_OPTIONS[f.name] || []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {filterErrors[f.name] && (
                    <p className="text-xs text-red-500 flex items-center gap-0.5">
                      <AlertCircle size={10} />
                      Req.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Roll
                </label>
                <input
                  name="roll"
                  value={filters.roll}
                  onChange={handleFilterChange}
                  placeholder="Roll number"
                  className={inp}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Student Code
                </label>
                <input
                  name="studentCode"
                  value={filters.studentCode}
                  onChange={handleFilterChange}
                  placeholder="Student code"
                  className={inp}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                <Eye size={14} /> Search Students
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {searched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Archive size={16} className="text-blue-500" /> Archive List
                <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {results.length} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search name, code…"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-44 transition-all"
                  />
                </div>
                {results.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {[
                      '#',
                      'Shift',
                      'Medium',
                      'Edu Level',
                      'Department',
                      'Class',
                      'Section',
                      'Session',
                      'Student Code',
                      'Student Name',
                      'Roll No',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-5 py-12 text-center">
                        <Archive
                          size={36}
                          className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                        />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          No archived students found matching your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    results.map((s, i) => (
                      <tr
                        key={s.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.shift}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.medium}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.eduLevel}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.department}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.className}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.section}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.session}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {s.studentCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {s.name}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                          {s.classRoll}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge active={s.active} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
              Showing {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
