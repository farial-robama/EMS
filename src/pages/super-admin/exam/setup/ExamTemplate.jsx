import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Copy,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  FileText,
  BookOpen,
  LayoutTemplate,
  CheckCircle2,
  Clock,
  Eye,
  Tag,
  Calendar,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

// ─── Sample Data ────────────────────────────────────────────────────────────
const TEMPLATE_DATA = [
  {
    id: 1,
    name: 'Annual Examination Template',
    examType: 'Annual',
    eduLevel: 'Primary',
    className: 'Four',
    totalMarks: 100,
    passMark: 33,
    duration: 180,
    subjects: ['Bangla', 'English', 'Math', 'Science', 'Social Science'],
    status: 'Active',
    createdAt: '2025-01-10',
    usedCount: 5,
  },
  {
    id: 2,
    name: 'Half-Yearly Template (Junior)',
    examType: 'Half-Yearly',
    eduLevel: 'Six-Eight',
    className: 'Eight',
    totalMarks: 100,
    passMark: 40,
    duration: 150,
    subjects: ['Bangla', 'English', 'Math', 'Physics', 'Chemistry'],
    status: 'Active',
    createdAt: '2025-01-15',
    usedCount: 3,
  },
  {
    id: 3,
    name: 'Monthly Test Template',
    examType: 'Monthly',
    eduLevel: 'Pre-Primary',
    className: 'KG',
    totalMarks: 50,
    passMark: 20,
    duration: 60,
    subjects: ['Bangla', 'English', 'Math'],
    status: 'Active',
    createdAt: '2025-02-01',
    usedCount: 12,
  },
  {
    id: 4,
    name: 'Terminal Exam Template (Science)',
    examType: 'Terminal',
    eduLevel: 'Nine-Ten',
    className: 'Nine (Science)',
    totalMarks: 200,
    passMark: 80,
    duration: 240,
    subjects: ['Physics', 'Chemistry', 'Biology', 'Math', 'English', 'Bangla'],
    status: 'Active',
    createdAt: '2025-01-20',
    usedCount: 2,
  },
  {
    id: 5,
    name: 'Weekly Quiz Template',
    examType: 'Weekly',
    eduLevel: 'Primary',
    className: 'Two',
    totalMarks: 25,
    passMark: 10,
    duration: 30,
    subjects: ['Bangla', 'Math'],
    status: 'Inactive',
    createdAt: '2025-03-05',
    usedCount: 0,
  },
  {
    id: 6,
    name: 'Pre-Test Template (Arts)',
    examType: 'Pre-Test',
    eduLevel: 'Nine-Ten',
    className: 'Ten (Arts)',
    totalMarks: 100,
    passMark: 33,
    duration: 120,
    subjects: ['Bangla', 'English', 'History', 'Geography', 'Civics'],
    status: 'Active',
    createdAt: '2025-02-18',
    usedCount: 1,
  },
  {
    id: 7,
    name: 'Semester Final Template',
    examType: 'Annual',
    eduLevel: 'Six-Eight',
    className: 'Six',
    totalMarks: 100,
    passMark: 33,
    duration: 180,
    subjects: ['Bangla', 'English', 'Math', 'Science', 'Social Science', 'Religion'],
    status: 'Active',
    createdAt: '2025-01-08',
    usedCount: 4,
  },
];

const EXAM_TYPES = ['All', 'Annual', 'Half-Yearly', 'Terminal', 'Monthly', 'Weekly', 'Pre-Test'];
const EDU_LEVELS = ['All', 'Pre-Primary', 'Primary', 'Six-Eight', 'Nine-Ten', 'Higher Secondary'];
const CLASSES = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Arts)', 'Ten (Commerce)'];

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer'
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

// ─── Badge helpers ────────────────────────────────────────────────────────────
const EXAM_TYPE_COLORS = {
  Annual:      'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-400',
  'Half-Yearly':'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  Terminal:    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Monthly:     'bg-cyan-100   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-400',
  Weekly:      'bg-teal-100   dark:bg-teal-900/30   text-teal-700   dark:text-teal-400',
  'Pre-Test':  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
};

// ─── Modal: Add / Edit Template ───────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  examType: 'Annual',
  eduLevel: 'Primary',
  className: 'Four',
  totalMarks: 100,
  passMark: 33,
  duration: 180,
  subjects: [],
  status: 'Active',
};

const ALL_SUBJECTS = [
  'Bangla','English','Math','Science','Social Science','Physics',
  'Chemistry','Biology','History','Geography','Civics','Religion','ICT',
];

function TemplateModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [subjectInput, setSubjectInput] = useState('');
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSubject = (s) => {
    const trimmed = s.trim();
    if (trimmed && !form.subjects.includes(trimmed)) {
      set('subjects', [...form.subjects, trimmed]);
    }
    setSubjectInput('');
  };

  const removeSubject = (s) => set('subjects', form.subjects.filter(x => x !== s));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Template name is required';
    if (!form.totalMarks || form.totalMarks <= 0) e.totalMarks = 'Total marks must be > 0';
    if (!form.passMark || form.passMark <= 0) e.passMark = 'Pass mark must be > 0';
    if (Number(form.passMark) >= Number(form.totalMarks)) e.passMark = 'Pass mark must be less than total marks';
    if (!form.duration || form.duration <= 0) e.duration = 'Duration must be > 0';
    if (form.subjects.length === 0) e.subjects = 'Add at least one subject';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <LayoutTemplate size={15} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'add' ? 'Add New Template' : mode === 'edit' ? 'Edit Template' : 'Copy Template'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Template Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className={inp} placeholder="e.g. Annual Examination Template" />
              {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11}/>{errors.name}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Exam Type</label>
              <select value={form.examType} onChange={e => set('examType', e.target.value)} className={inp}>
                {EXAM_TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level</label>
              <select value={form.eduLevel} onChange={e => set('eduLevel', e.target.value)} className={inp}>
                {EDU_LEVELS.filter(l => l !== 'All').map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={form.className} onChange={e => set('className', e.target.value)} className={inp}>
                {CLASSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Marks *</label>
              <input type="number" value={form.totalMarks} onChange={e => set('totalMarks', +e.target.value)} className={inp} min={1} />
              {errors.totalMarks && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11}/>{errors.totalMarks}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pass Mark *</label>
              <input type="number" value={form.passMark} onChange={e => set('passMark', +e.target.value)} className={inp} min={1} />
              {errors.passMark && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11}/>{errors.passMark}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration (min) *</label>
              <input type="number" value={form.duration} onChange={e => set('duration', +e.target.value)} className={inp} min={1} />
              {errors.duration && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11}/>{errors.duration}</p>}
            </div>
          </div>

          {/* Subjects */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subjects *</label>
            {/* Quick-add chips */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              {ALL_SUBJECTS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSubject(s)}
                  disabled={form.subjects.includes(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${form.subjects.includes(s) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800 cursor-default' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'}`}
                >
                  {form.subjects.includes(s) ? <span className="flex items-center gap-1"><CheckCircle2 size={10}/>{s}</span> : s}
                </button>
              ))}
            </div>
            {/* Custom subject input */}
            <div className="flex gap-2">
              <input
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(subjectInput); } }}
                placeholder="Type custom subject & press Enter"
                className={inp}
              />
              <button
                type="button"
                onClick={() => addSubject(subjectInput)}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0"
              >
                Add
              </button>
            </div>
            {/* Selected subjects */}
            {form.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                {form.subjects.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800">
                    {s}
                    <button onClick={() => removeSubject(s)} className="ml-0.5 hover:text-red-500 transition-colors"><X size={10}/></button>
                  </span>
                ))}
              </div>
            )}
            {errors.subjects && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11}/>{errors.subjects}</p>}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-3">
              {['Active', 'Inactive'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.status === s ? s === 'Active' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? s === 'Active' ? 'bg-green-500' : 'bg-gray-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
            <LayoutTemplate size={13} />
            {mode === 'add' ? 'Create Template' : mode === 'edit' ? 'Save Changes' : 'Copy Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ template, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye size={15} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Template Details</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">{template.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${EXAM_TYPE_COLORS[template.examType] || 'bg-gray-100 text-gray-500'}`}>
                {template.examType}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${template.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                {template.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: GraduationCap, label: 'Education Level', value: template.eduLevel },
              { icon: BookOpen, label: 'Class', value: template.className },
              { icon: Tag, label: 'Total Marks', value: template.totalMarks },
              { icon: CheckCircle2, label: 'Pass Mark', value: template.passMark },
              { icon: Clock, label: 'Duration', value: `${template.duration} min` },
              { icon: Calendar, label: 'Created', value: template.createdAt },
              { icon: FileText, label: 'Times Used', value: `${template.usedCount} exam(s)` },
              { icon: Tag, label: 'Pass %', value: `${Math.round((template.passMark / template.totalMarks) * 100)}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <Icon size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Subjects ({template.subjects.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {template.subjects.map(s => (
                <span key={s} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExamTemplate() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState(TEMPLATE_DATA);
  const [examType, setExamType] = useState('All');
  const [eduLevel, setEduLevel] = useState('All');
  const [cls, setCls] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Modals
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit'|'copy', template?: ... }
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() =>
    templates.filter(t =>
      (examType === 'All' || t.examType === examType) &&
      (eduLevel === 'All' || t.eduLevel === eduLevel) &&
      (cls === 'All' || t.className === cls) &&
      (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.className.toLowerCase().includes(search.toLowerCase()))
    ),
    [templates, examType, eduLevel, cls, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      const newId = Math.max(...templates.map(t => t.id)) + 1;
      setTemplates(p => [...p, { ...form, id: newId, usedCount: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
    } else if (modal.mode === 'edit') {
      setTemplates(p => p.map(t => t.id === modal.template.id ? { ...t, ...form } : t));
    } else if (modal.mode === 'copy') {
      const newId = Math.max(...templates.map(t => t.id)) + 1;
      setTemplates(p => [...p, { ...form, id: newId, usedCount: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    setModal(null);
  };

  const handleDelete = () => {
    setTemplates(p => p.filter(t => t.id !== deleteTarget.id));
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

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Exam & Result', 'Exam Template']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <LayoutTemplate size={22} className="text-blue-500" /> Exam Template
            </h1>
          </div>
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add New Template
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Templates', value: templates.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Active', value: templates.filter(t => t.status === 'Active').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30', val: 'text-green-700 dark:text-green-400' },
            { label: 'Inactive', value: templates.filter(t => t.status === 'Inactive').length, cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600', val: 'text-gray-600 dark:text-gray-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Templates</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Exam Type', value: examType, set: v => { setExamType(v); setPage(1); }, opts: EXAM_TYPES },
              { label: 'Education Level', value: eduLevel, set: v => { setEduLevel(v); setPage(1); }, opts: EDU_LEVELS },
              { label: 'Class', value: cls, set: v => { setCls(v); setPage(1); }, opts: CLASSES },
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

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Template Records</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
                <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  placeholder="Search templates…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Template Name', 'Exam Type', 'Education Level', 'Class', 'Total Marks', 'Pass Mark', 'Duration', 'Subjects', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-14 text-center">
                      <LayoutTemplate size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400">No templates match your filters</p>
                    </td>
                  </tr>
                ) : paged.map((t, i) => (
                  <tr key={t.id} className={`transition-colors ${t.status === 'Inactive' ? 'opacity-60' : ''} hover:bg-gray-50/70 dark:hover:bg-gray-700/20`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px]" title={t.name}>{t.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar size={10}/>{t.createdAt}
                          {t.usedCount > 0 && <span className="ml-1 text-blue-500">· Used {t.usedCount}×</span>}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap ${EXAM_TYPE_COLORS[t.examType] || 'bg-gray-100 text-gray-500'}`}>
                        {t.examType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.eduLevel}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">
                        {t.className}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t.totalMarks}</td>
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.passMark}</span>
                        <span className="text-xs text-gray-400 ml-1">({Math.round((t.passMark / t.totalMarks) * 100)}%)</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <Clock size={11} className="text-gray-400"/>{t.duration} min
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">
                          {t.subjects.length} subj.
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${t.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        <button onClick={() => setViewTarget(t)} title="View Template" className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-all border border-indigo-100 dark:border-indigo-900">
                          <Eye size={12} />
                        </button>
                        {/* Copy */}
                        <button onClick={() => setModal({ mode: 'copy', template: { ...t, name: `${t.name} (Copy)` } })} title="Copy Template" className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 hover:bg-purple-100 flex items-center justify-center transition-all border border-purple-100 dark:border-purple-900">
                          <Copy size={12} />
                        </button>
                        {/* Edit */}
                        <button onClick={() => setModal({ mode: 'edit', template: t })} title="Edit Template" className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900">
                          <Pencil size={12} />
                        </button>
                        {/* Delete */}
                        <button onClick={() => setDeleteTarget(t)} title="Delete Template" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900">
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
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14}/></button>
              {paginationPages().map((p, i) =>
                typeof p === 'string'
                  ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                  : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>{p}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14}/></button>
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
              ['bg-purple-50 dark:bg-purple-900/20 text-purple-500 border-purple-100', 'Copy Template'],
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Template'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Template'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}>
                  <span className="text-[8px]">●</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit/Copy Modal */}
        {modal && (
          <TemplateModal
            mode={modal.mode}
            initial={modal.template || EMPTY_FORM}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}

        {/* View Modal */}
        {viewTarget && <ViewModal template={viewTarget} onClose={() => setViewTarget(null)} />}

        {/* Delete Confirm */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Template?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.name}"</span> will be permanently removed.
                {deleteTarget.usedCount > 0 && (
                  <span className="block mt-2 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-center gap-1">
                    <AlertTriangle size={11}/> This template has been used in {deleteTarget.usedCount} exam(s).
                  </span>
                )}
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