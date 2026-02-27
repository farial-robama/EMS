import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  Settings2, Eye, X, AlertTriangle, Clock, Copy, ToggleLeft,
  ToggleRight, CheckCircle2, Briefcase, Users, Percent,
  Building2, CalendarClock, ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const CONFIG_DATA = [
  { id: 1, department: 'Teaching Staff', designation: 'All', shift: 'Day', officeStartTime: '08:00', officeEndTime: '14:00', lateAfter: '08:15', absentAfter: '10:00', earlyLeaveAfter: '13:30', workingDays: ['Sun','Mon','Tue','Wed','Thu'], weeklyHoliday: ['Fri','Sat'], minWorkHours: 6, graceMinutes: 10, allowLate: true, lateCountAs: 'Half Day', allowEarlyLeave: true, overtimeEnabled: false, notifyHR: true, autoLock: true, status: 'Active' },
  { id: 2, department: 'Admin Staff', designation: 'All', shift: 'Day', officeStartTime: '09:00', officeEndTime: '17:00', lateAfter: '09:15', absentAfter: '11:00', earlyLeaveAfter: '16:30', workingDays: ['Sun','Mon','Tue','Wed','Thu'], weeklyHoliday: ['Fri','Sat'], minWorkHours: 7, graceMinutes: 15, allowLate: true, lateCountAs: 'Present', allowEarlyLeave: false, overtimeEnabled: true, notifyHR: true, autoLock: false, status: 'Active' },
  { id: 3, department: 'Accounts', designation: 'Accountant', shift: 'Day', officeStartTime: '09:00', officeEndTime: '17:00', lateAfter: '09:10', absentAfter: '10:30', earlyLeaveAfter: '16:45', workingDays: ['Sun','Mon','Tue','Wed','Thu'], weeklyHoliday: ['Fri','Sat'], minWorkHours: 7, graceMinutes: 10, allowLate: true, lateCountAs: 'Half Day', allowEarlyLeave: true, overtimeEnabled: true, notifyHR: false, autoLock: true, status: 'Active' },
  { id: 4, department: 'Security', designation: 'Guard', shift: 'Night', officeStartTime: '20:00', officeEndTime: '06:00', lateAfter: '20:15', absentAfter: '21:00', earlyLeaveAfter: '05:30', workingDays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], weeklyHoliday: [], minWorkHours: 9, graceMinutes: 15, allowLate: false, lateCountAs: 'Absent', allowEarlyLeave: false, overtimeEnabled: true, notifyHR: true, autoLock: true, status: 'Active' },
  { id: 5, department: 'Support Staff', designation: 'All', shift: 'Morning', officeStartTime: '07:00', officeEndTime: '13:00', lateAfter: '07:10', absentAfter: '09:00', earlyLeaveAfter: '12:45', workingDays: ['Sun','Mon','Tue','Wed','Thu'], weeklyHoliday: ['Fri','Sat'], minWorkHours: 5, graceMinutes: 10, allowLate: true, lateCountAs: 'Half Day', allowEarlyLeave: true, overtimeEnabled: false, notifyHR: false, autoLock: false, status: 'Inactive' },
];

const DEPARTMENTS  = ['All', 'Teaching Staff', 'Admin Staff', 'Accounts', 'Security', 'Support Staff', 'IT Department', 'Library'];
const DESIGNATIONS = ['All', 'All', 'Accountant', 'Guard', 'Librarian', 'IT Officer', 'Peon'];
const SHIFTS       = ['All', 'Day', 'Morning', 'Evening', 'Night'];
const STATUSES     = ['All', 'Active', 'Inactive'];
const LATE_AS      = ['Half Day', 'Present', 'Absent'];
const WEEK_DAYS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  const w = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6';
  const d = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const on = size === 'sm' ? 'left-[18px]' : 'left-[22px]';
  return (
    <button type="button" onClick={() => onChange?.(!value)}
      className={`${w} rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <span className={`${d} rounded-full bg-white shadow absolute top-1/2 -translate-y-1/2 transition-all ${value ? on : 'left-[3px]'}`} />
    </button>
  );
}

const DEPT_COLORS = {
  'Teaching Staff': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Admin Staff':    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  'Accounts':       'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'Security':       'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'Support Staff':  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

const EMPTY_FORM = {
  department: 'Teaching Staff', designation: 'All', shift: 'Day',
  officeStartTime: '08:00', officeEndTime: '14:00', lateAfter: '08:15',
  absentAfter: '10:00', earlyLeaveAfter: '13:30',
  workingDays: ['Sun','Mon','Tue','Wed','Thu'], weeklyHoliday: ['Fri','Sat'],
  minWorkHours: 6, graceMinutes: 10, allowLate: true, lateCountAs: 'Half Day',
  allowEarlyLeave: true, overtimeEnabled: false, notifyHR: true, autoLock: false, status: 'Active',
};

function ConfigModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleDay = (day, field) => {
    const arr = form[field];
    set(field, arr.includes(day) ? arr.filter(d => d !== day) : [...arr, day]);
  };

  const validate = () => {
    const e = {};
    if (!form.officeStartTime) e.officeStartTime = 'Required';
    if (!form.officeEndTime) e.officeEndTime = 'Required';
    if (!form.lateAfter) e.lateAfter = 'Required';
    if (!form.absentAfter) e.absentAfter = 'Required';
    if (form.minWorkHours < 1 || form.minWorkHours > 24) e.minWorkHours = 'Must be 1–24';
    if (form.graceMinutes < 0) e.graceMinutes = 'Cannot be negative';
    if (form.workingDays.length === 0) e.workingDays = 'Select at least one working day';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[93vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 flex items-center justify-center"><Settings2 size={15} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'add' ? 'Add Employee Att. Config' : mode === 'copy' ? 'Copy Config' : 'Edit Employee Att. Config'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Department Info */}
          <section>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Briefcase size={11} />Department</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)} className={inp}>
                  {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Designation</label>
                <input value={form.designation} onChange={e => set('designation', e.target.value)} className={inp} placeholder="e.g. All or Teacher" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shift</label>
                <select value={form.shift} onChange={e => set('shift', e.target.value)} className={inp}>
                  {SHIFTS.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Office Timing */}
          <section>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Clock size={11} />Office Timing</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Start Time *', key: 'officeStartTime', err: errors.officeStartTime },
                { label: 'End Time *', key: 'officeEndTime', err: errors.officeEndTime },
                { label: 'Late After *', key: 'lateAfter', err: errors.lateAfter },
                { label: 'Absent After *', key: 'absentAfter', err: errors.absentAfter },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                  <input type="time" value={form[f.key]} onChange={e => set(f.key, e.target.value)} className={inp} />
                  {f.err && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{f.err}</p>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Early Leave After</label>
                <input type="time" value={form.earlyLeaveAfter} onChange={e => set('earlyLeaveAfter', e.target.value)} className={inp} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Min. Work Hours</label>
                <input type="number" min={1} max={24} value={form.minWorkHours} onChange={e => set('minWorkHours', +e.target.value)} className={inp} />
                {errors.minWorkHours && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.minWorkHours}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Grace Minutes</label>
                <input type="number" min={0} value={form.graceMinutes} onChange={e => set('graceMinutes', +e.target.value)} className={inp} />
                {errors.graceMinutes && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.graceMinutes}</p>}
              </div>
            </div>
          </section>

          {/* Working Days */}
          <section>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CalendarClock size={11} />Working Days & Holidays</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Working Days</p>
                <div className="flex gap-2 flex-wrap">
                  {WEEK_DAYS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDay(d, 'workingDays')}
                      className={`w-12 h-9 rounded-xl text-xs font-semibold border transition-all ${form.workingDays.includes(d) ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-violet-300'}`}>{d}</button>
                  ))}
                </div>
                {errors.workingDays && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertTriangle size={10} />{errors.workingDays}</p>}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Weekly Holiday</p>
                <div className="flex gap-2 flex-wrap">
                  {WEEK_DAYS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDay(d, 'weeklyHoliday')}
                      className={`w-12 h-9 rounded-xl text-xs font-semibold border transition-all ${form.weeklyHoliday.includes(d) ? 'bg-red-500 text-white border-red-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-red-300'}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Late As + Toggle Options */}
          <section>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><ShieldCheck size={11} />Rules & Options</h4>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Late Mark Counts As</label>
              <div className="flex gap-2">
                {LATE_AS.map(l => (
                  <button key={l} type="button" onClick={() => set('lateCountAs', l)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.lateCountAs === l
                      ? l === 'Present' ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
                        : l === 'Half Day' ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400'
                        : 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'allowLate', label: 'Allow Late Marking', desc: 'Track employees who arrive late' },
                { key: 'allowEarlyLeave', label: 'Allow Early Leave Tracking', desc: 'Track employees who leave early' },
                { key: 'overtimeEnabled', label: 'Enable Overtime Tracking', desc: 'Track and record overtime hours' },
                { key: 'notifyHR', label: 'Notify HR on Absence', desc: 'Alert HR when an employee is absent' },
                { key: 'autoLock', label: 'Auto-lock Attendance', desc: 'Lock after absent-after time automatically' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                  <Toggle value={form[key]} onChange={v => set(key, v)} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-3 mt-2">
              {['Active', 'Inactive'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.status === s ? s === 'Active' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? s === 'Active' ? 'bg-green-500' : 'bg-gray-400' : 'bg-gray-200 dark:bg-gray-600'}`} />{s}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm shadow-violet-200">
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
        <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 flex items-center justify-center"><Settings2 size={15} /></div>
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Config Details</span>
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">{config.department} · {config.shift} Shift</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Start', val: config.officeStartTime, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' },
              { label: 'Late After', val: config.lateAfter, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' },
              { label: 'Absent After', val: config.absentAfter, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' },
            ].map(({ label, val, color, bg }) => (
              <div key={label} className={`p-3 rounded-xl border ${bg}`}>
                <p className={`text-lg font-bold ${color}`}>{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Department', value: config.department },
              { label: 'Designation', value: config.designation },
              { label: 'Office End', value: config.officeEndTime },
              { label: 'Early Leave After', value: config.earlyLeaveAfter },
              { label: 'Min. Work Hours', value: `${config.minWorkHours} hrs` },
              { label: 'Grace Minutes', value: `${config.graceMinutes} min` },
              { label: 'Late Counts As', value: config.lateCountAs },
              { label: 'Status', value: config.status },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400">{label}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Working Days</p>
            <div className="flex gap-1.5 flex-wrap">
              {WEEK_DAYS.map(d => (
                <span key={d} className={`w-10 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${config.workingDays.includes(d) ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : config.weeklyHoliday.includes(d) ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>{d}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'allowLate', label: 'Allow Late' },
              { key: 'allowEarlyLeave', label: 'Early Leave' },
              { key: 'overtimeEnabled', label: 'Overtime' },
              { key: 'notifyHR', label: 'Notify HR' },
              { key: 'autoLock', label: 'Auto-lock' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${config[key] ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                  {config[key] ? <CheckCircle2 size={12} /> : <X size={10} />}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeAttConfig() {
  const [configs, setConfigs] = useState(CONFIG_DATA);
  const [filterDept, setFilterDept] = useState('All');
  const [filterShift, setFilterShift] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => configs.filter(c =>
    (filterDept === 'All' || c.department === filterDept) &&
    (filterShift === 'All' || c.shift === filterShift) &&
    (filterStatus === 'All' || c.status === filterStatus) &&
    (!search || c.department.toLowerCase().includes(search.toLowerCase()) || c.designation.toLowerCase().includes(search.toLowerCase()))
  ), [configs, filterDept, filterShift, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleStatus = (id) => setConfigs(p => p.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));

  const handleSave = (form) => {
    if (modal.mode === 'add' || modal.mode === 'copy') setConfigs(p => [...p, { ...form, id: Math.max(...p.map(c => c.id)) + 1 }]);
    else setConfigs(p => p.map(c => c.id === modal.data.id ? { ...c, ...form } : c));
    setModal(null);
  };

  const pp = () => {
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
            <Breadcrumb items={['Dashboard', 'Attendance', 'Employee Att. Config']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings2 size={22} className="text-violet-500" /> Employee Attendance Config
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
            { label: 'Filtered', value: filtered.length, cls: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100', val: 'text-violet-700 dark:text-violet-400' },
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
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Department', value: filterDept, set: v => { setFilterDept(v); setPage(1); }, opts: DEPARTMENTS },
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
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Config Records</span>
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
            <table className="w-full" style={{ minWidth: '1060px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Department', 'Designation', 'Shift', 'Start–End', 'Late After', 'Absent After', 'Grace', 'Late As', 'Working Days', 'Options', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={13} className="py-14 text-center">
                    <Settings2 size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No configurations match your filters</p>
                  </td></tr>
                ) : paged.map((c, i) => (
                  <tr key={c.id} className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${c.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap ${DEPT_COLORS[c.department] || 'bg-gray-100 text-gray-500'}`}>{c.department}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{c.designation}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{c.shift}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-nowrap">{c.officeStartTime}–{c.officeEndTime}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap font-medium">
                        <Clock size={10} />{c.lateAfter}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 whitespace-nowrap font-medium">
                        <Clock size={10} />{c.absentAfter}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{c.graceMinutes}m</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${c.lateCountAs === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : c.lateCountAs === 'Half Day' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{c.lateCountAs}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-0.5 flex-wrap max-w-[130px]">
                        {WEEK_DAYS.map(d => (
                          <span key={d} className={`w-7 h-6 flex items-center justify-center rounded text-[10px] font-semibold ${c.workingDays.includes(d) ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : c.weeklyHoliday.includes(d) ? 'bg-red-100 dark:bg-red-900/20 text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-300'}`}>{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { k: 'notifyHR', l: 'HR' },
                          { k: 'autoLock', l: 'Lock' },
                          { k: 'overtimeEnabled', l: 'OT' },
                        ].map(({ k, l }) => (
                          <span key={k} className={`px-1.5 py-0.5 rounded text-xs font-medium ${c[k] ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through'}`}>{l}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(c)} className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'copy', data: { ...c } })} className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 hover:bg-purple-100 flex items-center justify-center border border-purple-100 dark:border-purple-900"><Copy size={12} /></button>
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
              {pp().map((p, i) => typeof p === 'string' ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span> : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 hover:bg-gray-100'}`}>{p}</button>)}
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
              <p className="text-sm text-gray-500 mb-5">Config for <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.department}"</span> ({deleteTarget.shift} Shift) will be permanently removed.</p>
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