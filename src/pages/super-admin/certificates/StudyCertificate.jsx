import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  Award, User, Calendar, Eye, X, AlertTriangle, Download,
  GraduationCap, BookOpen, Printer, CheckCircle2, Clock, School,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const CERTIFICATE_DATA = [
  { id: 1, certNo: 'SC-2025-001', studentName: 'Rahim Uddin', roll: '101', regNo: 'REG-2020-101', fatherName: 'Abdul Karim', motherName: 'Rahela Begum', className: 'Ten (Science)', section: 'A', session: '2024-2025', admissionDate: '2020-01-15', issueDate: '2025-06-01', reason: 'Passed SSC Examination', conduct: 'Good', status: 'Issued' },
  { id: 2, certNo: 'SC-2025-002', studentName: 'Fatema Begum', roll: '203', regNo: 'REG-2021-203', fatherName: 'Nurul Islam', motherName: 'Nasrin Akter', className: 'Eight', section: 'B', session: '2024-2025', admissionDate: '2021-01-10', issueDate: '2025-06-05', reason: 'Guardian Request', conduct: 'Very Good', status: 'Issued' },
  { id: 3, certNo: 'SC-2025-003', studentName: 'Arif Hasan', roll: '312', regNo: 'REG-2022-312', fatherName: 'Rafiq Islam', motherName: 'Sumaiya Islam', className: 'Five', section: 'A', session: '2024-2025', admissionDate: '2022-01-12', issueDate: '2025-06-10', reason: 'School Transfer', conduct: 'Good', status: 'Pending' },
  { id: 4, certNo: 'SC-2025-004', studentName: 'Sumaiya Khanam', roll: '145', regNo: 'REG-2021-145', fatherName: 'Jahangir Alam', motherName: 'Razia Sultana', className: 'Nine (Arts)', section: 'C', session: '2024-2025', admissionDate: '2021-01-08', issueDate: '2025-06-15', reason: 'Higher Education', conduct: 'Excellent', status: 'Issued' },
  { id: 5, certNo: 'SC-2025-005', studentName: 'Tanvir Ahmed', roll: '089', regNo: 'REG-2023-089', fatherName: 'Salim Ahmed', motherName: 'Nasima Begum', className: 'Six', section: 'A', session: '2024-2025', admissionDate: '2023-01-20', issueDate: '', reason: 'Guardian Request', conduct: 'Satisfactory', status: 'Pending' },
  { id: 6, certNo: 'SC-2025-006', studentName: 'Nadia Islam', roll: '267', regNo: 'REG-2022-267', fatherName: 'Karim Islam', motherName: 'Shirin Akter', className: 'Three', section: 'B', session: '2024-2025', admissionDate: '2022-01-18', issueDate: '2025-07-01', reason: 'Visa / Travel Purpose', conduct: 'Very Good', status: 'Issued' },
];

const CLASSES = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];
const SESSIONS = ['All', '2024-2025', '2025-2026', '2023-2024'];
const STATUSES = ['All', 'Issued', 'Pending'];
const CONDUCT_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement'];
const REASONS = ['Passed SSC Examination', 'Guardian Request', 'School Transfer', 'Higher Education', 'Visa / Travel Purpose', 'Other'];

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

const CONDUCT_COLORS = {
  Excellent:           'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'Very Good':         'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Good:                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Satisfactory:        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  'Needs Improvement': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const EMPTY_FORM = {
  certNo: '', studentName: '', roll: '', regNo: '', fatherName: '', motherName: '',
  className: 'Eight', section: 'A', session: '2024-2025', admissionDate: '',
  issueDate: new Date().toISOString().slice(0, 10), reason: 'Guardian Request',
  conduct: 'Good', status: 'Pending',
};

function CertModal({ mode, initial, onSave, onClose, nextCertNo }) {
  const [form, setForm] = useState(initial || { ...EMPTY_FORM, certNo: nextCertNo });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.certNo.trim()) e.certNo = 'Certificate number is required';
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.roll.trim()) e.roll = 'Roll is required';
    if (!form.fatherName.trim()) e.fatherName = "Father's name is required";
    if (!form.admissionDate) e.admissionDate = 'Admission date is required';
    if (form.status === 'Issued' && !form.issueDate) e.issueDate = 'Issue date required when status is Issued';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award size={15} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'add' ? 'Issue Study Certificate' : 'Edit Study Certificate'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Cert No + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Certificate No. *</label>
              <input value={form.certNo} onChange={e => set('certNo', e.target.value)} className={inp} placeholder="e.g. SC-2025-007" />
              {errors.certNo && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.certNo}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reg. Number</label>
              <input value={form.regNo} onChange={e => set('regNo', e.target.value)} className={inp} placeholder="e.g. REG-2022-001" />
            </div>
          </div>

          {/* Student Name + Roll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Name *</label>
              <input value={form.studentName} onChange={e => set('studentName', e.target.value)} className={inp} placeholder="Full name" />
              {errors.studentName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.studentName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll *</label>
              <input value={form.roll} onChange={e => set('roll', e.target.value)} className={inp} placeholder="e.g. 101" />
              {errors.roll && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.roll}</p>}
            </div>
          </div>

          {/* Father + Mother */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Father's Name *</label>
              <input value={form.fatherName} onChange={e => set('fatherName', e.target.value)} className={inp} placeholder="Father's full name" />
              {errors.fatherName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.fatherName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mother's Name</label>
              <input value={form.motherName} onChange={e => set('motherName', e.target.value)} className={inp} placeholder="Mother's full name" />
            </div>
          </div>

          {/* Class + Section + Session */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={form.className} onChange={e => set('className', e.target.value)} className={inp}>
                {CLASSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Section</label>
              <input value={form.section} onChange={e => set('section', e.target.value)} className={inp} placeholder="A" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={form.session} onChange={e => set('session', e.target.value)} className={inp}>
                {SESSIONS.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Admission Date *</label>
              <input type="date" value={form.admissionDate} onChange={e => set('admissionDate', e.target.value)} className={inp} />
              {errors.admissionDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.admissionDate}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Issue Date</label>
              <input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} className={inp} />
              {errors.issueDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.issueDate}</p>}
            </div>
          </div>

          {/* Reason + Conduct */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reason for Certificate</label>
              <select value={form.reason} onChange={e => set('reason', e.target.value)} className={inp}>
                {REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Conduct</label>
              <select value={form.conduct} onChange={e => set('conduct', e.target.value)} className={inp}>
                {CONDUCT_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-3">
              {['Pending', 'Issued'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.status === s ? s === 'Issued' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? s === 'Issued' ? 'bg-green-500' : 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200">
            <Award size={13} />{mode === 'add' ? 'Issue Certificate' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ cert, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Award size={15} /></div>
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Study Certificate</span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{cert.certNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        {/* Certificate Preview */}
        <div className="p-5">
          <div className="border-2 border-dashed border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 bg-emerald-50/40 dark:bg-emerald-900/5 space-y-3">
            <div className="text-center border-b border-emerald-200 dark:border-emerald-900/30 pb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                <GraduationCap size={22} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Study Certificate</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Certificate No: {cert.certNo}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Student Name', value: cert.studentName },
                { label: 'Roll No.', value: cert.roll },
                { label: "Father's Name", value: cert.fatherName },
                { label: "Mother's Name", value: cert.motherName || '—' },
                { label: 'Class', value: cert.className },
                { label: 'Section', value: cert.section },
                { label: 'Session', value: cert.session },
                { label: 'Reg. No.', value: cert.regNo || '—' },
                { label: 'Admission Date', value: cert.admissionDate },
                { label: 'Issue Date', value: cert.issueDate || 'Pending' },
                { label: 'Conduct', value: cert.conduct },
                { label: 'Reason', value: cert.reason },
              ].map(({ label, value }) => (
                <div key={label} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5 truncate" title={value}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Printer size={13} /> Print
          </button>
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function StudyCertificate() {
  const [certificates, setCertificates] = useState(CERTIFICATE_DATA);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSession, setFilterSession] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() =>
    certificates.filter(c =>
      (filterClass === 'All' || c.className === filterClass) &&
      (filterSession === 'All' || c.session === filterSession) &&
      (filterStatus === 'All' || c.status === filterStatus) &&
      (!search || c.studentName.toLowerCase().includes(search.toLowerCase()) || c.certNo.toLowerCase().includes(search.toLowerCase()) || c.roll.includes(search))
    ), [certificates, filterClass, filterSession, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const nextCertNo = () => {
    const year = new Date().getFullYear();
    const next = certificates.length + 1;
    return `SC-${year}-${String(next).padStart(3, '0')}`;
  };

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      setCertificates(p => [...p, { ...form, id: Math.max(...p.map(c => c.id)) + 1 }]);
    } else {
      setCertificates(p => p.map(c => c.id === modal.data.id ? { ...c, ...form } : c));
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

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Certificates', 'Study Certificate']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Award size={22} className="text-emerald-500" /> Study Certificate
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Issue Certificate
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: certificates.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Issued', value: certificates.filter(c => c.status === 'Issued').length, cls: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30', val: 'text-emerald-700 dark:text-emerald-400' },
            { label: 'Pending', value: certificates.filter(c => c.status === 'Pending').length, cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30', val: 'text-amber-700 dark:text-amber-400' },
            { label: 'Filtered', value: filtered.length, cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Certificates</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Class', value: filterClass, set: v => { setFilterClass(v); setPage(1); }, opts: CLASSES },
              { label: 'Session', value: filterSession, set: v => { setFilterSession(v); setPage(1); }, opts: SESSIONS },
              { label: 'Status', value: filterStatus, set: v => { setFilterStatus(v); setPage(1); }, opts: STATUSES },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                <select value={f.value} onChange={e => f.set(e.target.value)} className={inp}>
                  {f.opts.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Certificate Records</span>
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
                <input placeholder="Search certificates…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Cert No.', 'Student Name', 'Roll', 'Class', 'Session', "Father's Name", 'Conduct', 'Admission Date', 'Issue Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={12} className="px-5 py-14 text-center">
                    <Award size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No certificates match your filters</p>
                  </td></tr>
                ) : paged.map((c, i) => (
                  <tr key={c.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20">
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900">{c.certNo}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{c.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">{c.roll}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{c.className}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{c.session}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{c.fatherName}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap ${CONDUCT_COLORS[c.conduct] || 'bg-gray-100 text-gray-500'}`}>{c.conduct}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{c.admissionDate}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{c.issueDate || <span className="text-amber-500">—</span>}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${c.status === 'Issued' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(c)} title="View / Print" className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-all border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'edit', data: c })} title="Edit" className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button title="Print Certificate" className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-100 flex items-center justify-center transition-all border border-emerald-100 dark:border-emerald-900"><Printer size={12} /></button>
                        <button onClick={() => setDeleteTarget(c)} title="Delete" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
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

        {/* Legend */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Action Guide</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 border-indigo-100', 'View Details'],
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Certificate'],
              ['bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 border-emerald-100', 'Print Certificate'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Certificate'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {modal && <CertModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} nextCertNo={nextCertNo()} />}
        {viewTarget && <ViewModal cert={viewTarget} onClose={() => setViewTarget(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Certificate?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Certificate <span className="font-semibold text-emerald-600">{deleteTarget.certNo}</span> for</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-5">"{deleteTarget.studentName}" will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setCertificates(p => p.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}