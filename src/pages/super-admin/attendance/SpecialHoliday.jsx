import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  CalendarDays, Eye, X, AlertTriangle, Globe2, School,
  Sun, Star, Flag, Calendar, Clock, Users2, Copy,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const HOLIDAY_DATA = [
  { id: 1, name: 'Eid ul-Fitr', type: 'Religious', startDate: '2025-03-31', endDate: '2025-04-02', days: 3, appliesTo: 'All', year: '2025', recurring: true, description: 'Celebration marking the end of Ramadan.', status: 'Active' },
  { id: 2, name: 'Eid ul-Adha', type: 'Religious', startDate: '2025-06-07', endDate: '2025-06-09', days: 3, appliesTo: 'All', year: '2025', recurring: true, description: 'Festival of Sacrifice.', status: 'Active' },
  { id: 3, name: 'Independence Day', type: 'National', startDate: '2025-03-26', endDate: '2025-03-26', days: 1, appliesTo: 'All', year: '2025', recurring: true, description: 'Bangladesh Independence Day – March 26.', status: 'Active' },
  { id: 4, name: 'Victory Day', type: 'National', startDate: '2025-12-16', endDate: '2025-12-16', days: 1, appliesTo: 'All', year: '2025', recurring: true, description: 'Bangladesh Liberation Victory Day.', status: 'Active' },
  { id: 5, name: 'Annual Sports Day', type: 'School Event', startDate: '2025-02-14', endDate: '2025-02-14', days: 1, appliesTo: 'Students', year: '2025', recurring: false, description: 'School annual sports day – students only.', status: 'Active' },
  { id: 6, name: 'Teachers Day', type: 'School Event', startDate: '2025-05-05', endDate: '2025-05-05', days: 1, appliesTo: 'Staff', year: '2025', recurring: false, description: 'Staff off day for Teachers Day celebration.', status: 'Active' },
  { id: 7, name: 'Summer Vacation', type: 'School Vacation', startDate: '2025-06-20', endDate: '2025-07-10', days: 21, appliesTo: 'All', year: '2025', recurring: true, description: 'Annual summer school closure.', status: 'Active' },
  { id: 8, name: 'Winter Break', type: 'School Vacation', startDate: '2025-12-25', endDate: '2026-01-01', days: 8, appliesTo: 'All', year: '2025', recurring: true, description: 'Year-end winter vacation.', status: 'Inactive' },
];

const TYPES    = ['All', 'National', 'Religious', 'School Event', 'School Vacation', 'Gazetted', 'Optional'];
const APPLIES  = ['All', 'All', 'Students', 'Staff', 'Teachers Only'];
const YEARS    = ['All', '2025', '2026', '2024'];
const STATUSES = ['All', 'Active', 'Inactive'];

const TYPE_STYLES = {
  National:         'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Religious:        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'School Event':   'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  'School Vacation':'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Gazetted:         'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  Optional:         'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

const TYPE_ICONS = { National: Flag, Religious: Star, 'School Event': School, 'School Vacation': Sun, Gazetted: Globe2, Optional: Calendar };

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

const calcDays = (start, end) => {
  if (!start || !end) return 1;
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return Math.max(1, diff + 1);
};

const EMPTY_FORM = { name: '', type: 'National', startDate: '', endDate: '', appliesTo: 'All', year: '2025', recurring: false, description: '', status: 'Active' };

function HolidayModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const days = calcDays(form.startDate, form.endDate);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Holiday name is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) e.endDate = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const TypeIcon = TYPE_ICONS[form.type] || Calendar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center"><CalendarDays size={15} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'add' ? 'Add Special Holiday' : mode === 'copy' ? 'Copy Holiday' : 'Edit Holiday'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Holiday Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inp} placeholder="e.g. Eid ul-Fitr" />
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.name}</p>}
          </div>

          {/* Type + Applies To */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Holiday Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                {TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Applies To</label>
              <select value={form.appliesTo} onChange={e => set('appliesTo', e.target.value)} className={inp}>
                {APPLIES.map((a, i) => <option key={i}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inp} />
              {errors.startDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.startDate}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date *</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inp} />
              {errors.endDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.endDate}</p>}
            </div>
          </div>

          {/* Auto-calculated days */}
          {form.startDate && form.endDate && (
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
              <CalendarDays size={16} className="text-rose-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                This holiday spans <span className="font-bold text-rose-600">{days} day{days !== 1 ? 's' : ''}</span>
                {days > 7 && <span className="ml-1 text-xs text-gray-400">({Math.ceil(days / 7)} weeks)</span>}
              </p>
            </div>
          )}

          {/* Year + Recurring */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Year</label>
              <select value={form.year} onChange={e => set('year', e.target.value)} className={inp}>
                {YEARS.filter(y => y !== 'All').map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 justify-end">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600 h-[42px]">
                <button type="button" onClick={() => set('recurring', !form.recurring)}
                  className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${form.recurring ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full bg-white shadow absolute top-1/2 -translate-y-1/2 transition-all ${form.recurring ? 'left-[18px]' : 'left-[3px]'}`} />
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Recurring Annually</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className={inp + ' resize-none'} placeholder="Brief description of the holiday..." />
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
          <button onClick={() => { if (validate()) onSave({ ...form, days: calcDays(form.startDate, form.endDate) }); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-200">
            <CalendarDays size={13} />{mode === 'add' ? 'Add Holiday' : mode === 'copy' ? 'Copy Holiday' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SpecialHoliday() {
  const [holidays, setHolidays] = useState(HOLIDAY_DATA);
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterApplies, setFilterApplies] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => holidays.filter(h =>
    (filterType === 'All' || h.type === filterType) &&
    (filterYear === 'All' || h.year === filterYear) &&
    (filterApplies === 'All' || h.appliesTo === filterApplies) &&
    (filterStatus === 'All' || h.status === filterStatus) &&
    (!search || h.name.toLowerCase().includes(search.toLowerCase()) || h.type.toLowerCase().includes(search.toLowerCase()))
  ), [holidays, filterType, filterYear, filterApplies, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const totalDays = holidays.filter(h => h.status === 'Active').reduce((a, h) => a + h.days, 0);

  const handleSave = (form) => {
    if (modal.mode === 'add' || modal.mode === 'copy') setHolidays(p => [...p, { ...form, id: Math.max(...p.map(h => h.id)) + 1 }]);
    else setHolidays(p => p.map(h => h.id === modal.data.id ? { ...h, ...form } : h));
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
            <Breadcrumb items={['Dashboard', 'Attendance', 'Special Holiday']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CalendarDays size={22} className="text-rose-500" /> Special Holiday
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Holiday
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Holidays', value: holidays.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Active', value: holidays.filter(h => h.status === 'Active').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100', val: 'text-green-700 dark:text-green-400' },
            { label: 'Total Off Days', value: totalDays, cls: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100', val: 'text-rose-700 dark:text-rose-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Holidays</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Type', value: filterType, set: v => { setFilterType(v); setPage(1); }, opts: TYPES },
              { label: 'Year', value: filterYear, set: v => { setFilterYear(v); setPage(1); }, opts: YEARS },
              { label: 'Applies To', value: filterApplies, set: v => { setFilterApplies(v); setPage(1); }, opts: APPLIES },
              { label: 'Status', value: filterStatus, set: v => { setFilterStatus(v); setPage(1); }, opts: STATUSES },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                <select value={f.value} onChange={e => f.set(e.target.value)} className={inp}>
                  {f.opts.map((v, i) => <option key={i}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Holiday Records</span>
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
                <input placeholder="Search holidays…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '900px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Holiday Name', 'Type', 'Start Date', 'End Date', 'Days', 'Applies To', 'Year', 'Recurring', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={11} className="py-14 text-center">
                    <CalendarDays size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No holidays match your filters</p>
                  </td></tr>
                ) : paged.map((h, i) => {
                  const Icon = TYPE_ICONS[h.type] || Calendar;
                  return (
                    <tr key={h.id} className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${h.status === 'Inactive' ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_STYLES[h.type] || 'bg-gray-100 text-gray-500'}`}>
                            <Icon size={13} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{h.name}</p>
                            {h.description && <p className="text-xs text-gray-400 truncate max-w-[160px]">{h.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap ${TYPE_STYLES[h.type] || 'bg-gray-100 text-gray-500'}`}>{h.type}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{h.startDate}</td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{h.endDate}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${h.days === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : h.days <= 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>{h.days}d</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          <Users2 size={10} className="text-gray-400" />{h.appliesTo}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{h.year}</td>
                      <td className="px-4 py-4">
                        {h.recurring
                          ? <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium"><Clock size={10} />Yearly</span>
                          : <span className="text-xs text-gray-400">One-time</span>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${h.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{h.status}</span>
                      </td>
                      <td className="px-4 py-4 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setModal({ mode: 'copy', data: { ...h, name: `${h.name} (Copy)` } })} className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 hover:bg-purple-100 flex items-center justify-center border border-purple-100 dark:border-purple-900"><Copy size={12} /></button>
                          <button onClick={() => setModal({ mode: 'edit', data: h })} className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                          <button onClick={() => setDeleteTarget(h)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

        {modal && <HolidayModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Holiday?</h3>
              <p className="text-sm text-gray-500 mb-5"><span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.name}"</span> will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setHolidays(p => p.filter(h => h.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}