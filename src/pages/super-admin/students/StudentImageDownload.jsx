import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Download,
  Search,
  Filter,
  Image,
  Users,
  CheckSquare,
  Square,
  RefreshCw,
  ImageOff,
  Check,
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
const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px]">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

/* ── Seed Students ────────────────────────────────────────────────────────── */
const STUDENTS = [
  { id: 1, studentCode: '2514010030063', name: 'Saiful Islam', roll: '1202526033046', hasImage: true },
  { id: 2, studentCode: '2514010030064', name: 'MD. Nasimul Islam', roll: '1202526033047', hasImage: true },
  { id: 3, studentCode: '2514010030065', name: 'Fatema Begum', roll: '1202526033048', hasImage: false },
  { id: 4, studentCode: '2514010030066', name: 'Rahim Miah', roll: '1202526033049', hasImage: true },
  { id: 5, studentCode: '2514010030067', name: 'Sumaiya Akter', roll: '1202526033050', hasImage: true },
  { id: 6, studentCode: '2514010030068', name: 'Karim Uddin', roll: '1202526033051', hasImage: false },
  { id: 7, studentCode: '2514010030069', name: 'Nusrat Jahan', roll: '1202526033052', hasImage: true },
  { id: 8, studentCode: '2514010030070', name: 'Arif Hossain', roll: '1202526033053', hasImage: true },
];

/* ── Avatar Placeholder ─────────────────────────────────────────────────── */
const Avatar = ({ name, hasImage, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm';
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className={`${dim} rounded-xl ${color} font-bold flex items-center justify-center flex-shrink-0 relative`}>
      {initials}
      {!hasImage && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-gray-800 flex items-center justify-center">
          <ImageOff size={7} className="text-white" />
        </div>
      )}
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function StudentImageDownload() {
  const [filters, setFilters] = useState({
    eduLevel: 'Higher Secondary',
    department: 'Science',
    className: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
  });
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [imageFilter, setImageFilter] = useState('all'); // all | with | without

  const handleShow = async () => {
    setLoading(true);
    setSelected([]);
    setSearch('');
    await new Promise((r) => setTimeout(r, 700));
    setStudents(STUDENTS);
    setFetched(true);
    setLoading(false);
  };

  /* Filter & paginate */
  const filtered = useMemo(() =>
    students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentCode.includes(search) ||
        s.roll.includes(search);
      const matchImage =
        imageFilter === 'all' ||
        (imageFilter === 'with' && s.hasImage) ||
        (imageFilter === 'without' && !s.hasImage);
      return matchSearch && matchImage;
    }),
  [students, search, imageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  /* Selection helpers */
  const isAllPageSelected = paged.length > 0 && paged.every((s) => selected.includes(s.id));
  const toggleAll = () => {
    if (isAllPageSelected) {
      setSelected((p) => p.filter((id) => !paged.find((s) => s.id === id)));
    } else {
      setSelected((p) => [...new Set([...p, ...paged.map((s) => s.id)])]);
    }
  };
  const toggleOne = (id) =>
    setSelected((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const withImages = students.filter((s) => s.hasImage).length;
  const withoutImages = students.length - withImages;

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDownloading(false);
    alert(`${selected.length} student image(s) would be downloaded as a ZIP file.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Student Setup', 'Student Image Download']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Student Image Download
            </h1>
          </div>
          {fetched && selected.length > 0 && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
            >
              {downloading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {downloading ? 'Preparing…' : `Download (${selected.length})`}
            </button>
          )}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Filter size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</span>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SelectField
              label="Edu. Level"
              value={filters.eduLevel}
              onChange={(v) => { setFilters((p) => ({ ...p, eduLevel: v })); setFetched(false); }}
              options={[
                { value: 'Higher Secondary', label: 'Higher Secondary' },
                { value: 'Secondary', label: 'Secondary' },
              ]}
            />
            <SelectField
              label="Department"
              value={filters.department}
              onChange={(v) => { setFilters((p) => ({ ...p, department: v })); setFetched(false); }}
              options={[
                { value: 'Science', label: 'Science' },
                { value: 'Arts', label: 'Arts' },
                { value: 'Commerce', label: 'Commerce' },
              ]}
            />
            <SelectField
              label="Class"
              value={filters.className}
              onChange={(v) => { setFilters((p) => ({ ...p, className: v })); setFetched(false); }}
              options={[
                { value: 'HSC-Science', label: 'HSC-Science' },
                { value: 'HSC-Arts', label: 'HSC-Arts' },
              ]}
            />
            <SelectField
              label="Section"
              value={filters.section}
              onChange={(v) => { setFilters((p) => ({ ...p, section: v })); setFetched(false); }}
              options={[
                { value: '1st Year', label: '1st Year' },
                { value: '2nd Year', label: '2nd Year' },
              ]}
            />
            <SelectField
              label="Session"
              value={filters.session}
              onChange={(v) => { setFilters((p) => ({ ...p, session: v })); setFetched(false); }}
              options={[
                { value: '2025-2026', label: '2025-2026' },
                { value: '2024-2025', label: '2024-2025' },
              ]}
            />
            <button
              onClick={handleShow}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
              {loading ? 'Loading…' : 'Show'}
            </button>
          </div>
        </div>

        {/* Stats — shown after fetch */}
        {fetched && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Students', value: students.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
                { label: 'With Image', value: withImages, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: Image },
                { label: 'Without Image', value: withoutImages, bg: 'bg-amber-50 dark:bg-amber-900/20', ic: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300', Icon: ImageOff },
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

            {/* Table Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
                  <select
                    value={perPage}
                    onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                  >
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <span className="text-xs text-gray-500 dark:text-gray-400">entries</span>

                  {/* Image filter pills */}
                  <div className="flex gap-1 ml-2">
                    {['all', 'with', 'without'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setImageFilter(f); setPage(1); }}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all capitalize
                        ${imageFilter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {f === 'all' ? 'All' : f === 'with' ? 'With Image' : 'No Image'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selected.length > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-semibold">
                      {selected.length} selected
                    </span>
                  )}
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search student…"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-48 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-5 py-3.5 text-left">
                        <button
                          onClick={toggleAll}
                          className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {isAllPageSelected ? (
                            <CheckSquare size={16} className="text-blue-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </th>
                      {['#', 'Student', 'Student Code', 'Roll No.', 'Image Status'].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {paged.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-14 text-center">
                          <Image size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No students found</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting the search or image filter.</p>
                        </td>
                      </tr>
                    ) : (
                      paged.map((s, i) => {
                        const isChecked = selected.includes(s.id);
                        return (
                          <tr
                            key={s.id}
                            onClick={() => toggleOne(s.id)}
                            className={`cursor-pointer transition-colors ${isChecked ? 'bg-blue-50/60 dark:bg-blue-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                          >
                            <td className="px-5 py-4">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleOne(s.id); }}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {isChecked ? (
                                  <CheckSquare size={16} className="text-blue-600" />
                                ) : (
                                  <Square size={16} />
                                )}
                              </button>
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                              {(safePage - 1) * perPage + i + 1}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={s.name} hasImage={s.hasImage} />
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                                {s.studentCode}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{s.roll}</td>
                            <td className="px-5 py-4">
                              {s.hasImage ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  <Check size={10} /> Image Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                  <ImageOff size={10} /> No Image
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer with select-all helpers & pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
                  </p>
                  {filtered.length > 0 && (
                    <button
                      onClick={() => setSelected(filtered.filter((s) => s.hasImage).map((s) => s.id))}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Select all with image
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      typeof p === 'string' ? (
                        <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all
                          ${safePage === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky bottom download bar when items selected */}
            {selected.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-600">
                <span className="text-sm font-semibold">{selected.length} image{selected.length > 1 ? 's' : ''} selected</span>
                <button
                  onClick={() => setSelected([])}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                >
                  {downloading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                  {downloading ? 'Preparing ZIP…' : 'Download ZIP'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state before Show */}
        {!fetched && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm py-16 text-center">
            <Image size={40} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Select filters and click <strong>Show</strong> to load students.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}