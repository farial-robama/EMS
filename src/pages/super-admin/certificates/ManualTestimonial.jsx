import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  MessageSquareQuote, Star, User, BookOpen, GraduationCap, Calendar,
  Eye, X, AlertTriangle, CheckCircle2, School, Hash,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const TESTIMONIAL_DATA = [
  { id: 1, studentName: 'Rahim Uddin', roll: '101', className: 'Ten (Science)', session: '2024-2025', subject: 'Mathematics', teacherName: 'Mr. Karim Hossain', rating: 5, testimonial: 'An outstanding student with exceptional problem-solving skills. Always prepared and participates actively in class discussions.', date: '2025-06-15', status: 'Published' },
  { id: 2, studentName: 'Fatema Begum', roll: '203', className: 'Eight', session: '2024-2025', subject: 'English', teacherName: 'Ms. Nasrin Akter', rating: 4, testimonial: 'Fatema demonstrates excellent writing and communication skills. Her essays are consistently well-structured and insightful.', date: '2025-06-18', status: 'Published' },
  { id: 3, studentName: 'Arif Hasan', roll: '312', className: 'Five', session: '2024-2025', subject: 'Science', teacherName: 'Mr. Rafiq Islam', rating: 5, testimonial: 'Exceptional curiosity and enthusiasm for science. Arif regularly asks thought-provoking questions and excels in lab activities.', date: '2025-06-20', status: 'Draft' },
  { id: 4, studentName: 'Sumaiya Khanam', roll: '145', className: 'Nine (Arts)', session: '2024-2025', subject: 'Bangla', teacherName: 'Ms. Razia Sultana', rating: 4, testimonial: 'A talented writer with a deep appreciation for Bengali literature. Her creative pieces reflect maturity beyond her years.', date: '2025-06-22', status: 'Published' },
  { id: 5, studentName: 'Tanvir Ahmed', roll: '089', className: 'Six', session: '2024-2025', subject: 'Social Science', teacherName: 'Mr. Jahangir Alam', rating: 3, testimonial: 'Shows steady improvement and willingness to participate. Needs to work on assignment submission timeliness.', date: '2025-07-01', status: 'Draft' },
  { id: 6, studentName: 'Nadia Islam', roll: '267', className: 'KG', session: '2024-2025', subject: 'General', teacherName: 'Ms. Shirin Akter', rating: 5, testimonial: 'A bright and cheerful learner who grasps concepts quickly. Nadia is a joy to teach and always brings positive energy to class.', date: '2025-07-05', status: 'Published' },
  { id: 7, studentName: 'Mehedi Hasan', roll: '178', className: 'Ten (Commerce)', session: '2024-2025', subject: 'Accounting', teacherName: 'Mr. Salim Reza', rating: 4, testimonial: 'Demonstrates strong analytical skills in accounting and commerce. Very detail-oriented and consistently achieves high marks.', date: '2025-07-08', status: 'Published' },
];

const CLASSES = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];
const SESSIONS = ['All', '2024-2025', '2025-2026', '2023-2024'];
const STATUSES = ['All', 'Published', 'Draft'];
const RATINGS_FILTER = ['All', '5', '4', '3', '2', '1'];

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

const StarRating = ({ value, onChange, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => onChange && onChange(s)}
        className={`transition-colors ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}>
        <Star size={size} className={s <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
      </button>
    ))}
  </div>
);

const EMPTY_FORM = { studentName: '', roll: '', className: 'Eight', session: '2024-2025', subject: '', teacherName: '', rating: 5, testimonial: '', date: new Date().toISOString().slice(0, 10), status: 'Draft' };

function TestimonialModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.roll.trim()) e.roll = 'Roll number is required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.teacherName.trim()) e.teacherName = 'Teacher name is required';
    if (!form.testimonial.trim()) e.testimonial = 'Testimonial text is required';
    if (form.testimonial.trim().length < 30) e.testimonial = 'Testimonial must be at least 30 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <MessageSquareQuote size={15} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'add' ? 'Add New Testimonial' : 'Edit Testimonial'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Name *</label>
              <input value={form.studentName} onChange={e => set('studentName', e.target.value)} className={inp} placeholder="Full name" />
              {errors.studentName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.studentName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll Number *</label>
              <input value={form.roll} onChange={e => set('roll', e.target.value)} className={inp} placeholder="e.g. 101" />
              {errors.roll && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.roll}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={form.className} onChange={e => set('className', e.target.value)} className={inp}>
                {CLASSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={form.session} onChange={e => set('session', e.target.value)} className={inp}>
                {SESSIONS.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subject *</label>
              <input value={form.subject} onChange={e => set('subject', e.target.value)} className={inp} placeholder="e.g. Mathematics" />
              {errors.subject && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.subject}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teacher Name *</label>
              <input value={form.teacherName} onChange={e => set('teacherName', e.target.value)} className={inp} placeholder="e.g. Mr. Karim Hossain" />
              {errors.teacherName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.teacherName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rating</label>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <StarRating value={form.rating} onChange={v => set('rating', v)} />
                <span className="text-sm font-semibold text-amber-500">{form.rating}/5</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Testimonial Text *</label>
            <textarea value={form.testimonial} onChange={e => set('testimonial', e.target.value)} rows={4} className={inp + ' resize-none'} placeholder="Write the testimonial here (min. 30 characters)..." />
            <div className="flex items-center justify-between">
              {errors.testimonial ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.testimonial}</p> : <span />}
              <span className="text-xs text-gray-400">{form.testimonial.length} chars</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-3">
              {['Draft', 'Published'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.status === s ? s === 'Published' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? s === 'Published' ? 'bg-green-500' : 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm shadow-violet-200">
            <MessageSquareQuote size={13} />{mode === 'add' ? 'Add Testimonial' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ t, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Testimonial Preview</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
              <User size={22} className="text-violet-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">{t.studentName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Roll: {t.roll} · {t.className} · {t.session}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={t.rating} size={13} />
                <span className="text-xs text-amber-500 font-semibold">{t.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="relative bg-violet-50 dark:bg-violet-900/10 rounded-xl p-4 border border-violet-100 dark:border-violet-900/30">
            <MessageSquareQuote size={20} className="text-violet-300 dark:text-violet-700 absolute top-3 left-3" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-6 italic">"{t.testimonial}"</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Subject', value: t.subject },
              { label: 'Teacher', value: t.teacherName },
              { label: 'Date', value: t.date },
              { label: 'Status', value: t.status },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500">{label}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ManualTestimonial() {
  const [testimonials, setTestimonials] = useState(TESTIMONIAL_DATA);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSession, setFilterSession] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() =>
    testimonials.filter(t =>
      (filterClass === 'All' || t.className === filterClass) &&
      (filterSession === 'All' || t.session === filterSession) &&
      (filterStatus === 'All' || t.status === filterStatus) &&
      (filterRating === 'All' || t.rating === +filterRating) &&
      (!search || t.studentName.toLowerCase().includes(search.toLowerCase()) || t.teacherName.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
    ), [testimonials, filterClass, filterSession, filterStatus, filterRating, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      setTestimonials(p => [...p, { ...form, id: Math.max(...p.map(t => t.id)) + 1 }]);
    } else {
      setTestimonials(p => p.map(t => t.id === modal.data.id ? { ...t, ...form } : t));
    }
    setModal(null);
  };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  const avgRating = testimonials.length ? (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1) : '0.0';

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Certificates', 'Manual Testimonial']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <MessageSquareQuote size={22} className="text-violet-500" /> Manual Testimonial
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Testimonial
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: testimonials.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Published', value: testimonials.filter(t => t.status === 'Published').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30', val: 'text-green-700 dark:text-green-400' },
            { label: 'Draft', value: testimonials.filter(t => t.status === 'Draft').length, cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30', val: 'text-amber-700 dark:text-amber-400' },
            { label: 'Avg. Rating', value: avgRating, cls: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30', val: 'text-violet-700 dark:text-violet-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Testimonials</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: 'Class', value: filterClass, set: v => { setFilterClass(v); setPage(1); }, opts: CLASSES },
              { label: 'Session', value: filterSession, set: v => { setFilterSession(v); setPage(1); }, opts: SESSIONS },
              { label: 'Status', value: filterStatus, set: v => { setFilterStatus(v); setPage(1); }, opts: STATUSES },
              { label: 'Rating', value: filterRating, set: v => { setFilterRating(v); setPage(1); }, opts: RATINGS_FILTER },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                <select value={f.value} onChange={e => f.set(e.target.value)} className={inp}>
                  {f.opts.map(v => <option key={v}>{v === 'All' ? `All ${f.label}s` : (f.label === 'Rating' ? `${v} Star${v === '1' ? '' : 's'}` : v)}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Testimonial Records</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show</span>
                <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Search testimonials…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '960px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Student', 'Roll', 'Class', 'Session', 'Subject', 'Teacher', 'Rating', 'Testimonial', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={11} className="px-5 py-14 text-center">
                    <MessageSquareQuote size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No testimonials match your filters</p>
                  </td></tr>
                ) : paged.map((t, i) => (
                  <tr key={t.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20">
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-violet-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{t.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">{t.roll}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{t.className}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.session}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.subject}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.teacherName}</td>
                    <td className="px-4 py-4"><StarRating value={t.rating} size={12} /></td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate italic" title={t.testimonial}>"{t.testimonial}"</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${t.status === 'Published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(t)} title="View" className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-all border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'edit', data: t })} title="Edit" className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button onClick={() => setDeleteTarget(t)} title="Delete" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
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
              {paginationPages().map((p, i) =>
                typeof p === 'string'
                  ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                  : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>{p}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">»</button>
            </div>
          </div>
        </div>

        {/* Action Legend */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Action Guide</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 border-indigo-100', 'View Details'],
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Testimonial'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Testimonial'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {modal && <TestimonialModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        {viewTarget && <ViewModal t={viewTarget} onClose={() => setViewTarget(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Testimonial?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">The testimonial for <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.studentName}"</span> will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setTestimonials(p => p.filter(t => t.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}