import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  Settings2, Eye, X, AlertTriangle, Users, Calendar, Clock,
  CheckCircle2, ToggleLeft, ToggleRight, Percent, BookOpen,
  AlertCircle, Copy,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const CONFIG_DATA = [
  { id: 1, className: 'Ten (Science)', session: '2024-2025', shift: 'Day', medium: 'Bangla', minAttendance: 75, lateMarkTime: '08:30', absentAfter: '09:00', workingDays: 220, countHolidays: false, allowLate: true, lateCountAs: 'Half Day', notifyParent: true, autoLock: false, status: 'Active' },
  { id: 2, className: 'Eight', session: '2024-2025', shift: 'Day', medium: 'English', minAttendance: 75, lateMarkTime: '08:15', absentAfter: '08:45', workingDays: 220, countHolidays: false, allowLate: true, lateCountAs: 'Half Day', notifyParent: true, autoLock: true, status: 'Active' },
  { id: 3, className: 'KG', session: '2024-2025', shift: 'Morning', medium: 'Bangla', minAttendance: 70, lateMarkTime: '09:00', absentAfter: '09:30', workingDays: 200, countHolidays: false, allowLate: false, lateCountAs: 'Absent', notifyParent: true, autoLock: false, status: 'Active' },
  { id: 4, className: 'Five', session: '2024-2025', shift: 'Day', medium: 'Bangla', minAttendance: 80, lateMarkTime: '08:00', absentAfter: '08:30', workingDays: 220, countHolidays: true, allowLate: true, lateCountAs: 'Present', notifyParent: false, autoLock: false, status: 'Inactive' },
  { id: 5, className: 'Nine (Arts)', session: '2024-2025', shift: 'Day', medium: 'Bangla', minAttendance: 75, lateMarkTime: '08:30', absentAfter: '09:00', workingDays: 220, countHolidays: false, allowLate: true, lateCountAs: 'Half Day', notifyParent: true, autoLock: true, status: 'Active' },
  { id: 6, className: 'Six', session: '2025-2026', shift: 'Day', medium: 'English', minAttendance: 75, lateMarkTime: '08:20', absentAfter: '08:50', workingDays: 215, countHolidays: false, allowLate: true, lateCountAs: 'Half Day', notifyParent: false, autoLock: false, status: 'Active' },
];

const CLASSES  = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];
const SESSIONS = ['All', '2024-2025', '2025-2026', '2023-2024'];
const SHIFTS   = ['All', 'Day', 'Morning', 'Evening'];
const STATUSES = ['All', 'Active', 'Inactive'];
const LATE_AS  = ['Half Day', 'Present', 'Absent'];

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

function Toggle({ value, onChange, size = 'md' }) {
  const h = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const dot = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const on = size === 'sm' ? 'left-[18px]' : 'left-[22px]';
  return (
    <button type="button" onClick={() => onChange && onChange(!value)}
      className={`${h} rounded-full relative transition-all flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <span className={`${dot} rounded-full bg-white shadow-sm absolute top-1/2 -translate-y-1/2 transition-all ${value ? on : 'left-[3px]'}`} />
    </button>
  );
}

const EMPTY_FORM = {
  className: 'Eight', session: '2024-2025', shift: 'Day', medium: 'Bangla',
  minAttendance: 75, lateMarkTime: '08:30', absentAfter: '09:00',
  workingDays: 220, countHolidays: false, allowLate: true,
  lateCountAs: 'Half Day', notifyParent: true, autoLock: false, status: 'Active',
};

function ConfigModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.minAttendance || form.minAttendance < 1 || form.minAttendance > 100) e.minAttendance = 'Must be between 1–100';
    if (!form.workingDays || form.workingDays < 1) e.workingDays = 'Working days must be > 0';
    if (!form.lateMarkTime) e.lateMarkTime = 'Late mark time is required';
    if (!form.absentAfter) e.absentAfter = 'Absent-after time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Settings2 size={15} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{mode === 'add' ? 'Add Attendance Config' : mode === 'copy' ? 'Copy Config' : 'Edit Attendance Config'}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Class Identity */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen size={12} /> Class Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shift</label>
                <select value={form.shift} onChange={e => set('shift', e.target.value)} className={inp}>
                  {SHIFTS.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Medium</label>
                <select value={form.medium} onChange={e => set('medium', e.target.value)} className={inp}>
                  {['Bangla', 'English', 'Arabic'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Attendance Rules */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Percent size={12} /> Attendance Rules
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Min. Attendance (%)*</label>
                <input type="number" min={1} max={100} value={form.minAttendance} onChange={e => set('minAttendance', +e.target.value)} className={inp} />
                {errors.minAttendance && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.minAttendance}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Working Days *</label>
                <input type="number" min={1} value={form.workingDays} onChange={e => set('workingDays', +e.target.value)} className={inp} />
                {errors.workingDays && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.workingDays}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Late As</label>
                <select value={form.lateCountAs} onChange={e => set('lateCountAs', e.target.value)} className={inp} disabled={!form.allowLate}>
                  {LATE_AS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Timing */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={12} /> Timing Configuration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Late Mark After *</label>
                <input type="time" value={form.lateMarkTime} onChange={e => set('lateMarkTime', e.target.value)} className={inp} />
                <p className="text-xs text-gray-400">Students arriving after this time are marked Late</p>
                {errors.lateMarkTime && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.lateMarkTime}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Absent After *</label>
                <input type="time" value={form.absentAfter} onChange={e => set('absentAfter', e.target.value)} className={inp} />
                <p className="text-xs text-gray-400">Students arriving after this time are marked Absent</p>
                {errors.absentAfter && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.absentAfter}</p>}
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings2 size={12} /> Additional Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'countHolidays', label: 'Count Holidays in Working Days', desc: 'Include public holidays in total working days count' },
                { key: 'allowLate', label: 'Allow Late Marking', desc: 'Enable separate late attendance status for students' },
                { key: 'notifyParent', label: 'Notify Parents on Absence', desc: 'Send SMS/notification when student is absent' },
                { key: 'autoLock', label: 'Auto-lock Attendance', desc: 'Automatically lock attendance after the absent time' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                  <Toggle value={form[key]} onChange={v => set(key, v)} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-3">
              {['Active', 'Inactive'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.status === s ? s === 'Active' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? s === 'Active' ? 'bg-green-500' : 'bg-gray-400' : 'bg-gray-200 dark:bg-gray-600'}`} />{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200">
            <Settings2 size={13} />{mode === 'add' ? 'Create Config' : mode === 'copy' ? 'Copy Config' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ config, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Settings2 size={15} /></div>
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Config Details</span>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{config.className} · {config.session}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
              <p className="text-2xl font-bold text-blue-600">{config.minAttendance}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Min Attendance</p>
            </div>
            <div className="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-100 dark:border-teal-900/30 text-center">
              <p className="text-2xl font-bold text-teal-600">{config.workingDays}</p>
              <p className="text-xs text-gray-500 mt-0.5">Working Days</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center">
              <p className="text-lg font-bold text-amber-600">{config.lateMarkTime}</p>
              <p className="text-xs text-gray-500 mt-0.5">Late After</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Class', value: config.className },
              { label: 'Session', value: config.session },
              { label: 'Shift', value: config.shift },
              { label: 'Medium', value: config.medium },
              { label: 'Absent After', value: config.absentAfter },
              { label: 'Late Counts As', value: config.lateCountAs },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400">{label}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Toggle summary */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Count Holidays', value: config.countHolidays },
              { label: 'Allow Late', value: config.allowLate },
              { label: 'Notify Parent', value: config.notifyParent },
              { label: 'Auto-lock', value: config.autoLock },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${value ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                  {value ? <CheckCircle2 size={12} /> : <X size={10} />}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentAttConfig() {
  const [configs, setConfigs] = useState(CONFIG_DATA);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSession, setFilterSession] = useState('All');
  const [filterShift, setFilterShift] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => configs.filter(c =>
    (filterClass === 'All' || c.className === filterClass) &&
    (filterSession === 'All' || c.session === filterSession) &&
    (filterShift === 'All' || c.shift === filterShift) &&
    (filterStatus === 'All' || c.status === filterStatus) &&
    (!search || c.className.toLowerCase().includes(search.toLowerCase()) || c.session.includes(search))
  ), [configs, filterClass, filterSession, filterShift, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleStatus = (id) => setConfigs(p => p.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));

  const handleSave = (form) => {
    if (modal.mode === 'add' || modal.mode === 'copy') setConfigs(p => [...p, { ...form, id: Math.max(...p.map(c => c.id)) + 1 }]);
    else setConfigs(p => p.map(c => c.id === modal.data.id ? { ...c, ...form } : c));
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
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Attendance', 'Student Att. Config']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings2 size={22} className="text-blue-500" /> Student Attendance Config
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Config
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Configs', value: configs.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Active', value: configs.filter(c => c.status === 'Active').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100', val: 'text-green-700 dark:text-green-400' },
            { label: 'Inactive', value: configs.filter(c => c.status === 'Inactive').length, cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200', val: 'text-gray-600 dark:text-gray-400' },
            { label: 'Filtered', value: filtered.length, cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100', val: 'text-indigo-700 dark:text-indigo-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Configurations</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Class', value: filterClass, set: v => { setFilterClass(v); setPage(1); }, opts: CLASSES },
              { label: 'Session', value: filterSession, set: v => { setFilterSession(v); setPage(1); }, opts: SESSIONS },
              { label: 'Shift', value: filterShift, set: v => { setFilterShift(v); setPage(1); }, opts: SHIFTS },
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
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Configuration Records</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show</span>
                <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none">
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Search configs…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1020px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Class', 'Session', 'Shift', 'Min. Att.', 'Late After', 'Absent After', 'Working Days', 'Late As', 'Options', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={12} className="py-14 text-center">
                    <Settings2 size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No configurations match your filters</p>
                  </td></tr>
                ) : paged.map((c, i) => (
                  <tr key={c.id} className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${c.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{c.className}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{c.session}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{c.shift}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-bold ${c.minAttendance >= 80 ? 'text-blue-600' : c.minAttendance >= 75 ? 'text-teal-600' : 'text-amber-600'}`}>{c.minAttendance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <Clock size={11} className="text-amber-500" />{c.lateMarkTime}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <Clock size={11} className="text-red-400" />{c.absentAfter}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{c.workingDays}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${c.lateCountAs === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : c.lateCountAs === 'Half Day' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{c.lateCountAs}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5">
                        {[
                          { key: 'notifyParent', label: 'Notify' },
                          { key: 'autoLock', label: 'Lock' },
                          { key: 'allowLate', label: 'Late' },
                        ].map(({ key, label }) => (
                          <span key={key} className={`px-1.5 py-0.5 rounded text-xs font-medium ${c[key] ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through'}`}>{label}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(c)} className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'copy', data: { ...c } })} title="Copy Config" className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 hover:bg-purple-100 flex items-center justify-center border border-purple-100 dark:border-purple-900"><Copy size={12} /></button>
                        <button onClick={() => setModal({ mode: 'edit', data: c })} className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button onClick={() => toggleStatus(c.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${c.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}>
                          {c.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500">Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
              {paginationPages().map((p, i) => typeof p === 'string'
                ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 hover:bg-gray-100'}`}>{p}</button>
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
              ['bg-purple-50 dark:bg-purple-900/20 text-purple-500 border-purple-100', 'Copy Config'],
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Config'],
              ['bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100', 'Toggle Active/Inactive'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Config'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {modal && <ConfigModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        {viewTarget && <ViewModal config={viewTarget} onClose={() => setViewTarget(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Config?</h3>
              <p className="text-sm text-gray-500 mb-5">Attendance config for <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.className}"</span> ({deleteTarget.session}) will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setConfigs(p => p.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}