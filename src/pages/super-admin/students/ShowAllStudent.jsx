import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Eye,
  RefreshCw,
  X,
  Phone,
  BookOpen,
  CalendarDays,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Breadcrumb ───────────────────────────────────────────────────────────── */
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
          <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
        )}
      </React.Fragment>
    ))}
  </nav>
);

/* ── SelectField ─────────────────────────────────────────────────────────── */
const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5 min-w-[130px]">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

/* ── Status Badge ────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${status === 'Active'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
    {status}
  </span>
);

/* ── Avatar ──────────────────────────────────────────────────────────────── */
const Avatar = ({ name, gender }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const color = gender === 'Female'
    ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400'
    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400';
  return (
    <div className={`w-9 h-9 rounded-xl ${color} font-bold text-xs flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
};

/* ── Seed Data ────────────────────────────────────────────────────────────── */
const STUDENTS = Array.from({ length: 40 }, (_, i) => {
  const genders = ['Male', 'Female'];
  const classes = ['HSC-Science', 'HSC-Arts', 'HSC-Business', 'SSC-Science'];
  const sections = ['1st Year', '2nd Year'];
  const sessions = ['2025-2026', '2024-2025'];
  const departments = ['Science', 'Humanities', 'Business'];
  const statuses = ['Active', 'Active', 'Active', 'Inactive'];
  const firstNames = ['Saiful', 'Nasimul', 'Fatema', 'Rahim', 'Sumaiya', 'Karim', 'Nusrat', 'Arif', 'Dilruba', 'Zakir'];
  const lastNames = ['Islam', 'Hossain', 'Begum', 'Miah', 'Akter', 'Uddin', 'Jahan', 'Ahmed', 'Khatun', 'Hassan'];
  const name = `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`;
  return {
    id: i + 1,
    studentCode: `251401003${String(i + 1).padStart(4, '0')}`,
    name,
    gender: genders[i % 2],
    className: classes[i % 4],
    department: departments[i % 3],
    section: sections[i % 2],
    session: sessions[i % 2],
    roll: `12025260330${String(i + 40).padStart(2, '0')}`,
    contact: `0171000${String(i).padStart(4, '0')}`,
    admissionDate: `0${(i % 9) + 1}-09-2025`,
    status: statuses[i % 4],
    category: i % 5 === 0 ? 'Transfer' : 'General',
  };
});

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function ShowAllStudent() {
  const [filters, setFilters] = useState({ className: '', section: '', session: '', gender: '', status: '' });
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);

  const filtered = useMemo(() =>
    STUDENTS.filter((s) => {
      const mf =
        (!filters.className || s.className === filters.className) &&
        (!filters.section || s.section === filters.section) &&
        (!filters.session || s.session === filters.session) &&
        (!filters.gender || s.gender === filters.gender) &&
        (!filters.status || s.status === filters.status);
      const ms =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentCode.includes(search) ||
        s.roll.includes(search);
      return mf && ms;
    }),
  [filters, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const activeCount = STUDENTS.filter((s) => s.status === 'Active').length;
  const inactiveCount = STUDENTS.length - activeCount;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleReset = () => { setFilters({ className: '', section: '', session: '', gender: '', status: '' }); setSearch(''); setPage(1); };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Show All Student']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Show All Students</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: STUDENTS.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
            { label: 'Active', value: activeCount, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: UserCheck },
            { label: 'Inactive', value: inactiveCount, bg: 'bg-red-50 dark:bg-red-900/20', ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300', Icon: UserX },
            { label: 'Filtered', value: filtered.length, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: Filter },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}>
                <s.Icon size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Filter size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">{activeFilterCount}</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                <RefreshCw size={11} /> Reset
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField label="Class" value={filters.className} onChange={(v) => { setFilters((p) => ({ ...p, className: v })); setPage(1); }}
              options={[{ value: 'HSC-Science', label: 'HSC-Science' }, { value: 'HSC-Arts', label: 'HSC-Arts' }, { value: 'HSC-Business', label: 'HSC-Business' }, { value: 'SSC-Science', label: 'SSC-Science' }]}
              placeholder="All Classes" />
            <SelectField label="Section" value={filters.section} onChange={(v) => { setFilters((p) => ({ ...p, section: v })); setPage(1); }}
              options={[{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }]}
              placeholder="All Sections" />
            <SelectField label="Session" value={filters.session} onChange={(v) => { setFilters((p) => ({ ...p, session: v })); setPage(1); }}
              options={[{ value: '2025-2026', label: '2025-2026' }, { value: '2024-2025', label: '2024-2025' }]}
              placeholder="All Sessions" />
            <SelectField label="Gender" value={filters.gender} onChange={(v) => { setFilters((p) => ({ ...p, gender: v })); setPage(1); }}
              options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
              placeholder="All Genders" />
            <SelectField label="Status" value={filters.status} onChange={(v) => { setFilters((p) => ({ ...p, status: v })); setPage(1); }}
              options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
              placeholder="All Statuses" />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
              >
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">entries</span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, code, roll…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-52 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Student', 'Student Code', 'Roll No.', 'Class / Section', 'Session', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <GraduationCap size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found</p>
                      <button onClick={handleReset} className="mt-2 text-xs text-blue-500 hover:underline">Reset filters</button>
                    </td>
                  </tr>
                ) : (
                  paged.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} gender={s.gender} />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{s.gender} · {s.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">{s.studentCode}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{s.roll}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.className}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{s.section}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{s.session}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setViewStudent(s)}
                            className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push('…'); acc.push(p); return acc; }, [])
                .map((p, i) =>
                  typeof p === 'string' ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span> : (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                      {p}
                    </button>
                  )
                )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── View Student Modal ──────────────────────────────────────────────── */}
        {viewStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewStudent(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center gap-3">
                  <Avatar name={viewStudent.name} gender={viewStudent.gender} />
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{viewStudent.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{viewStudent.studentCode}</p>
                  </div>
                </div>
                <button onClick={() => setViewStudent(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all">
                  <X size={14} />
                </button>
              </div>
              {/* Modal body */}
              <div className="p-5 space-y-3">
                <StatusBadge status={viewStudent.status} />
                {[
                  { Icon: GraduationCap, label: 'Class', value: `${viewStudent.className} — ${viewStudent.section}` },
                  { Icon: BookOpen, label: 'Department', value: viewStudent.department },
                  { Icon: CalendarDays, label: 'Session', value: viewStudent.session },
                  { Icon: Users, label: 'Roll No.', value: viewStudent.roll },
                  { Icon: Phone, label: 'Contact', value: viewStudent.contact },
                  { Icon: CalendarDays, label: 'Admission Date', value: viewStudent.admissionDate },
                  { Icon: Users, label: 'Category', value: viewStudent.category },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex justify-end">
                <button onClick={() => setViewStudent(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}