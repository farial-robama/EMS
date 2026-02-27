import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleRight,
  ToggleLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  BookOpen,
  BookMarked,
  Hash,
  Library,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ── static options ─────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Mathematics', 'Science', 'Bengali Literature', 'English Grammar', 'Social Science', 'Religious Studies', 'ICT', 'Arts & Crafts', 'Physical Education', 'Home Science'];
const EDU_LEVELS = ['All', 'Pre-Primary', 'Primary', 'Six-Eight', 'Nine-Ten', 'Higher Secondary'];
const LANGUAGES  = ['All', 'Bangla', 'English'];

// ── seed data ──────────────────────────────────────────────────────────────────
const INITIAL_BOOKS = [
  { id: 1,  code: 'BK-0101', title: 'My First English Book',           author: 'NCTB',             publisher: 'NCTB',              category: 'English Grammar',   eduLevel: 'Pre-Primary', language: 'English', edition: '2024', totalCopies: 50,  availableCopies: 32, status: 'Active'   },
  { id: 2,  code: 'BK-0201', title: 'Amaar Bangla Boi',                author: 'NCTB',             publisher: 'NCTB',              category: 'Bengali Literature', eduLevel: 'Primary',     language: 'Bangla',  edition: '2024', totalCopies: 80,  availableCopies: 55, status: 'Active'   },
  { id: 3,  code: 'BK-1101', title: 'Bangla Grammar & Composition',    author: 'Dr. Munir Chowdhury', publisher: 'Abul Fazal',    category: 'Bengali Literature', eduLevel: 'Primary',     language: 'Bangla',  edition: '2023', totalCopies: 60,  availableCopies: 48, status: 'Active'   },
  { id: 4,  code: 'BK-1102', title: 'Primary Mathematics',             author: 'NCTB',             publisher: 'NCTB',              category: 'Mathematics',        eduLevel: 'Primary',     language: 'Bangla',  edition: '2024', totalCopies: 75,  availableCopies: 53, status: 'Active'   },
  { id: 5,  code: 'BK-1803', title: 'English for Today (Class 8)',     author: 'NCTB',             publisher: 'NCTB',              category: 'English Grammar',   eduLevel: 'Six-Eight',   language: 'English', edition: '2024', totalCopies: 45,  availableCopies: 23, status: 'Active'   },
  { id: 6,  code: 'BK-0601', title: 'ICT for Class 6',                 author: 'Md. Zillur Rahaman', publisher: 'TechBooks BD',   category: 'ICT',                eduLevel: 'Six-Eight',   language: 'Bangla',  edition: '2023', totalCopies: 30,  availableCopies: 18, status: 'Active'   },
  { id: 7,  code: 'BK-2201', title: 'Higher Mathematics',              author: 'S.U. Ahmed',       publisher: 'Panjeree',          category: 'Mathematics',        eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2024', totalCopies: 55,  availableCopies: 44, status: 'Active'   },
  { id: 8,  code: 'BK-2202', title: 'Physics for Class 9-10',         author: 'Dr. Golam Hossain', publisher: 'Ideal',            category: 'Science',            eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2024', totalCopies: 50,  availableCopies: 38, status: 'Active'   },
  { id: 9,  code: 'BK-2203', title: 'Chemistry Textbook',              author: 'NCTB',             publisher: 'NCTB',              category: 'Science',            eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2024', totalCopies: 50,  availableCopies: 41, status: 'Active'   },
  { id: 10, code: 'BK-2204', title: 'Biology Textbook',                author: 'NCTB',             publisher: 'NCTB',              category: 'Science',            eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2024', totalCopies: 50,  availableCopies: 39, status: 'Active'   },
  { id: 11, code: 'BK-2401', title: 'Civic & Citizenship',             author: 'NCTB',             publisher: 'NCTB',              category: 'Social Science',     eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2023', totalCopies: 35,  availableCopies: 27, status: 'Active'   },
  { id: 12, code: 'BK-2402', title: 'Bangladesh & World Identity',     author: 'NCTB',             publisher: 'NCTB',              category: 'Social Science',     eduLevel: 'Nine-Ten',    language: 'Bangla',  edition: '2023', totalCopies: 35,  availableCopies: 35, status: 'Inactive' },
];

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const EMPTY_FORM = { code: '', title: '', author: '', publisher: '', category: 'Mathematics', eduLevel: 'Primary', language: 'Bangla', edition: '', totalCopies: '', status: 'Active' };

// ── component ──────────────────────────────────────────────────────────────────
export default function BookEntry() {
  const [books, setBooks]             = useState(INITIAL_BOOKS);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [langFilter, setLangFilter]   = useState('All');
  const [perPage, setPerPage]         = useState(10);
  const [page, setPage]               = useState(1);

  const [formModal, setFormModal]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]   = useState({});

  // ── filter ───────────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    books.filter(b =>
      (catFilter   === 'All' || b.category === catFilter) &&
      (levelFilter === 'All' || b.eduLevel === levelFilter) &&
      (langFilter  === 'All' || b.language === langFilter) &&
      (!search || b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()))
    ), [books, catFilter, levelFilter, langFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // ── handlers ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    const nextNum = String(Math.max(...books.map(b => parseInt(b.code.replace('BK-', '')))) + 1).padStart(4, '0');
    setForm({ ...EMPTY_FORM, code: `BK-${nextNum}` });
    setFormErrors({});
    setFormModal({ mode: 'add' });
  };

  const openEdit = (b) => {
    setForm({ code: b.code, title: b.title, author: b.author, publisher: b.publisher, category: b.category, eduLevel: b.eduLevel, language: b.language, edition: b.edition, totalCopies: b.totalCopies, status: b.status });
    setFormErrors({});
    setFormModal({ mode: 'edit', id: b.id });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())                          errs.title = 'Book title is required';
    if (!form.code.trim())                           errs.code  = 'Book code is required';
    if (!form.author.trim())                         errs.author = 'Author is required';
    if (!form.totalCopies || +form.totalCopies <= 0) errs.totalCopies = 'Total copies must be > 0';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...books.map(b => b.id)) + 1;
      setBooks(p => [...p, { id: newId, ...form, totalCopies: +form.totalCopies, availableCopies: +form.totalCopies }]);
    } else {
      setBooks(p => p.map(b => b.id === formModal.id ? { ...b, ...form, totalCopies: +form.totalCopies } : b));
    }
    setFormModal(null);
  };

  const toggleStatus = (id) =>
    setBooks(p => p.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));

  const handleDelete = () => {
    setBooks(p => p.filter(b => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  // ── availability badge color ──────────────────────────────────────────────────
  const availBadge = (avail, total) => {
    const pct = total === 0 ? 0 : avail / total;
    if (pct > 0.5) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (pct > 0.2) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Library', 'Book Entry']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Library size={22} className="text-blue-500" /> Book Entry
            </h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add New Book
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Books',      value: books.length,                                          cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',      val: 'text-blue-700 dark:text-blue-400'   },
            { label: 'Active',           value: books.filter(b => b.status === 'Active').length,       cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',  val: 'text-green-700 dark:text-green-400' },
            { label: 'Total Copies',     value: books.reduce((s, b) => s + b.totalCopies, 0),          cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400' },
            { label: 'Available Copies', value: books.reduce((s, b) => s + b.availableCopies, 0),      cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',  val: 'text-amber-700 dark:text-amber-400' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Books</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
              <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} className={inp}>
                {CATEGORIES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
              <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }} className={inp}>
                {EDU_LEVELS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Language</label>
              <select value={langFilter} onChange={e => { setLangFilter(e.target.value); setPage(1); }} className={inp}>
                {LANGUAGES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Title, code, author…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Book Records</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Code', 'Book Title', 'Author', 'Publisher', 'Category', 'Level', 'Language', 'Edition', 'Copies', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-14 text-center">
                      <BookOpen size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400">No books match your filters</p>
                    </td>
                  </tr>
                ) : paged.map((book, i) => (
                  <tr key={book.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${book.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{book.code}</span>
                    </td>
                    <td className="px-4 py-4 max-w-[180px]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0">
                          <BookMarked size={12} />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate" title={book.title}>{book.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{book.author}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{book.publisher}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{book.category}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{book.eduLevel}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{book.language}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{book.edition}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${availBadge(book.availableCopies, book.totalCopies)}`}>
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${book.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(book)} title="Edit Book"
                          className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => toggleStatus(book.id)} title="Toggle Status"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${book.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}>
                          {book.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => setDeleteTarget(book)} title="Delete Book"
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
              {paginationPages().map((p, i) => typeof p === 'string' ? (
                <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">»</button>
            </div>
          </div>
        </div>

        {/* Action Guide */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Action Guide</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Book'],
              ['bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100', 'Toggle Active/Inactive'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Book'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-200 dark:border-gray-600">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-semibold">12/50</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Available / Total copies</span>
            </div>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {formModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Library size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Add New Book' : 'Edit Book'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Book Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={`${inp} font-mono ${formErrors.code ? 'border-red-400' : ''}`} placeholder="BK-0001" />
                    {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inp}>
                      <option>Active</option><option>Inactive</option>
                    </select>
                  </div>
                </div>
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Book Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={`${inp} ${formErrors.title ? 'border-red-400' : ''}`} placeholder="e.g. Higher Mathematics" />
                  {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                </div>
                {/* Author / Publisher */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Author *</label>
                    <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className={`${inp} ${formErrors.author ? 'border-red-400' : ''}`} placeholder="Author name" />
                    {formErrors.author && <p className="text-xs text-red-500">{formErrors.author}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Publisher</label>
                    <input value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} className={inp} placeholder="Publisher name" />
                  </div>
                </div>
                {/* Category / Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
                      {CATEGORIES.filter(c => c !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
                    <select value={form.eduLevel} onChange={e => setForm(f => ({ ...f, eduLevel: e.target.value }))} className={inp}>
                      {EDU_LEVELS.filter(l => l !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                {/* Language / Edition / Copies */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Language</label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inp}>
                      {LANGUAGES.filter(l => l !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Edition</label>
                    <input value={form.edition} onChange={e => setForm(f => ({ ...f, edition: e.target.value }))} className={inp} placeholder="e.g. 2024" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Copies *</label>
                    <input type="number" min="1" value={form.totalCopies} onChange={e => setForm(f => ({ ...f, totalCopies: e.target.value }))} className={`${inp} ${formErrors.totalCopies ? 'border-red-400' : ''}`} placeholder="0" />
                    {formErrors.totalCopies && <p className="text-xs text-red-500">{formErrors.totalCopies}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <Library size={13} /> {formModal.mode === 'add' ? 'Add Book' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Book?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.title}"</span> will be permanently removed from the library.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}