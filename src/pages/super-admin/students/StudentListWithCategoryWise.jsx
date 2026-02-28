import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Users,
  Printer,
  FileSpreadsheet,
  Tag,
  GraduationCap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Breadcrumb ───────────────────────────────────────────────────────────── */
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-semibold' : 'hover:text-blue-500 cursor-pointer transition-colors'}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
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

/* ── Category color map ──────────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'General': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Transfer': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'New Student': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'Old Student': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Scholarship': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
};

const CategoryBadge = ({ category }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
    <Tag size={9} />
    {category}
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
const CATEGORIES = ['General', 'Transfer', 'New Student', 'Old Student', 'Scholarship'];
const ALL_CLASSES = ['HSC-Science', 'HSC-Arts', 'HSC-Business'];
const ALL_SECTIONS = ['1st Year', '2nd Year'];
const ALL_SESSIONS = ['2025-2026', '2024-2025'];
const GENDERS = ['Male', 'Female'];
const FIRST_NAMES = ['Saiful', 'Nasimul', 'Fatema', 'Rahim', 'Sumaiya', 'Karim', 'Nusrat', 'Arif', 'Dilruba', 'Zakir', 'Roksana', 'Tariqul'];
const LAST_NAMES = ['Islam', 'Hossain', 'Begum', 'Miah', 'Akter', 'Uddin', 'Jahan', 'Ahmed', 'Khatun', 'Hassan', 'Molla', 'Chowdhury'];

const STUDENTS = Array.from({ length: 48 }, (_, i) => {
  const name = `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i + 3) % LAST_NAMES.length]}`;
  return {
    id: i + 1,
    studentCode: `251401003${String(i + 1).padStart(4, '0')}`,
    name,
    gender: GENDERS[i % 2],
    className: ALL_CLASSES[i % 3],
    section: ALL_SECTIONS[i % 2],
    session: ALL_SESSIONS[i % 2],
    roll: `120252603${String(i + 50).padStart(4, '0')}`,
    category: CATEGORIES[i % CATEGORIES.length],
    admissionDate: `0${(i % 9) + 1}-09-2025`,
  };
});

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function StudentListWithCategoryWise() {
  const [filters, setFilters] = useState({ className: '', section: '', session: '', gender: '', category: '' });
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('flat');   // 'flat' | 'grouped'
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const filtered = useMemo(() =>
    STUDENTS.filter((s) => {
      const mf =
        (!filters.className || s.className === filters.className) &&
        (!filters.section || s.section === filters.section) &&
        (!filters.session || s.session === filters.session) &&
        (!filters.gender || s.gender === filters.gender) &&
        (!filters.category || s.category === filters.category);
      const ms =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentCode.includes(search) ||
        s.roll.includes(search);
      return mf && ms;
    }),
  [filters, search]);

  /* Grouped by category */
  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      students: filtered.filter((s) => s.category === cat),
    })).filter((g) => g.students.length > 0);
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const handleReset = () => { setFilters({ className: '', section: '', session: '', gender: '', category: '' }); setSearch(''); setPage(1); };
  const toggleGroup = (cat) => setCollapsedGroups((p) => ({ ...p, [cat]: !p[cat] }));

  const handlePrint = () => window.print();

  const handleDownloadExcel = () => {
    const data = filtered.map((s, i) => ({
      SL: i + 1, Category: s.category, 'Student Code': s.studentCode,
      Name: s.name, Gender: s.gender, 'Class': s.className,
      Section: s.section, Session: s.session, Roll: s.roll,
      'Admission Date': s.admissionDate,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StudentListByCategory');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'StudentListByCategory.xlsx');
  };

  /* Category distribution for stats */
  const catCounts = useMemo(() =>
    CATEGORIES.map((c) => ({ cat: c, count: STUDENTS.filter((s) => s.category === c).length })),
  []);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Student List With Category']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Student List — Category Wise</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 print:hidden">
            <button onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200">
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {catCounts.map(({ cat, count }) => (
            <button
              key={cat}
              onClick={() => { setFilters((p) => ({ ...p, category: p.category === cat ? '' : cat })); setPage(1); }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left
              ${filters.category === cat
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[cat] || ''}`}>
                <Tag size={14} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white leading-none">{count}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{cat}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 print:hidden">
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
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1">
                {[{ v: 'flat', label: 'Flat' }, { v: 'grouped', label: 'Grouped' }].map(({ v, label }) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                    ${viewMode === v ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                  <RefreshCw size={11} /> Reset
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField label="Class" value={filters.className} onChange={(v) => { setFilters((p) => ({ ...p, className: v })); setPage(1); }}
              options={ALL_CLASSES.map((c) => ({ value: c, label: c }))} placeholder="All Classes" />
            <SelectField label="Section" value={filters.section} onChange={(v) => { setFilters((p) => ({ ...p, section: v })); setPage(1); }}
              options={ALL_SECTIONS.map((s) => ({ value: s, label: s }))} placeholder="All Sections" />
            <SelectField label="Session" value={filters.session} onChange={(v) => { setFilters((p) => ({ ...p, session: v })); setPage(1); }}
              options={ALL_SESSIONS.map((s) => ({ value: s, label: s }))} placeholder="All Sessions" />
            <SelectField label="Gender" value={filters.gender} onChange={(v) => { setFilters((p) => ({ ...p, gender: v })); setPage(1); }}
              options={GENDERS.map((g) => ({ value: g, label: g }))} placeholder="All Genders" />
            <SelectField label="Category" value={filters.category} onChange={(v) => { setFilters((p) => ({ ...p, category: v })); setPage(1); }}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))} placeholder="All Categories" />
          </div>
        </div>

        {/* ── FLAT VIEW ────────────────────────────────────────────────────── */}
        {viewMode === 'flat' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
                <select value={perPage} onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                  {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-xs text-gray-500 dark:text-gray-400">entries</span>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search name, code, roll…" value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-52 transition-all" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['#', 'Student', 'Student Code', 'Roll No.', 'Category', 'Class / Section', 'Session'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <Tag size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
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
                              <p className="text-xs text-gray-400 dark:text-gray-500">{s.gender} · {s.admissionDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">{s.studentCode}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{s.roll}</td>
                        <td className="px-5 py-4"><CategoryBadge category={s.category} /></td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.className}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{s.section}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{s.session}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 print:hidden">
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
        )}

        {/* ── GROUPED VIEW ─────────────────────────────────────────────────── */}
        {viewMode === 'grouped' && (
          <div className="space-y-4">
            {grouped.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-14 text-center">
                <Tag size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found</p>
              </div>
            ) : (
              grouped.map(({ category, students }) => {
                const isCollapsed = collapsedGroups[category];
                return (
                  <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {/* Group header */}
                    <button
                      onClick={() => toggleGroup(category)}
                      className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CategoryBadge category={category} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{students.length} students</span>
                      </div>
                      {isCollapsed ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
                    </button>

                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                              {['#', 'Student', 'Student Code', 'Roll No.', 'Class / Section', 'Session'].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {students.map((s, i) => (
                              <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                                <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <Avatar name={s.name} gender={s.gender} />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.name}</p>
                                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.gender}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">{s.studentCode}</span>
                                </td>
                                <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-gray-300">{s.roll}</td>
                                <td className="px-5 py-3.5">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.className}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{s.section}</p>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">{s.session}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}