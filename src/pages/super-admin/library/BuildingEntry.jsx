import React, { useState, useMemo } from 'react';
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
  Building2,
  Layers,
  DoorOpen,
  MapPin,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ── static options ─────────────────────────────────────────────────────────────
const BUILDING_TYPES = ['All', 'Academic', 'Administrative', 'Dormitory', 'Sports', 'Cafeteria', 'Laboratory', 'Library'];
const FLOOR_OPTIONS  = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];
const ROOM_TYPES     = ['Classroom', 'Lab', 'Office', 'Staff Room', 'Library', 'Sports Hall', 'Canteen', 'Store Room', 'Meeting Room', 'Prayer Room'];

// ── seed data ──────────────────────────────────────────────────────────────────
const INITIAL_BUILDINGS = [
  { id: 1,  code: 'BLD-01', name: 'Main Academic Block',       type: 'Academic',       totalFloors: 4, totalRooms: 32, location: 'North Campus',  constructionYear: '1995', capacity: 1200, status: 'Active'   },
  { id: 2,  code: 'BLD-02', name: 'Science & Lab Building',    type: 'Laboratory',     totalFloors: 3, totalRooms: 18, location: 'East Wing',    constructionYear: '2005', capacity: 450,  status: 'Active'   },
  { id: 3,  code: 'BLD-03', name: 'Administrative Block',      type: 'Administrative', totalFloors: 2, totalRooms: 14, location: 'Central',      constructionYear: '1990', capacity: 200,  status: 'Active'   },
  { id: 4,  code: 'BLD-04', name: 'Library & Resource Center', type: 'Library',        totalFloors: 2, totalRooms: 8,  location: 'South Campus', constructionYear: '2010', capacity: 300,  status: 'Active'   },
  { id: 5,  code: 'BLD-05', name: "Boys' Dormitory",           type: 'Dormitory',      totalFloors: 3, totalRooms: 60, location: 'West Campus',  constructionYear: '2008', capacity: 240,  status: 'Active'   },
  { id: 6,  code: 'BLD-06', name: "Girls' Dormitory",          type: 'Dormitory',      totalFloors: 3, totalRooms: 55, location: 'West Campus',  constructionYear: '2009', capacity: 220,  status: 'Active'   },
  { id: 7,  code: 'BLD-07', name: 'Sports Complex',            type: 'Sports',         totalFloors: 1, totalRooms: 10, location: 'South Wing',   constructionYear: '2015', capacity: 800,  status: 'Active'   },
  { id: 8,  code: 'BLD-08', name: 'Cafeteria & Canteen',       type: 'Cafeteria',      totalFloors: 1, totalRooms: 4,  location: 'Central',      constructionYear: '2012', capacity: 400,  status: 'Active'   },
  { id: 9,  code: 'BLD-09', name: 'Old Annex Block',           type: 'Academic',       totalFloors: 2, totalRooms: 12, location: 'North Campus', constructionYear: '1980', capacity: 350,  status: 'Inactive' },
  { id: 10, code: 'BLD-10', name: 'Computer Lab Center',       type: 'Laboratory',     totalFloors: 2, totalRooms: 8,  location: 'East Wing',    constructionYear: '2018', capacity: 160,  status: 'Active'   },
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

const typeColorMap = {
  Academic:       'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  Administrative: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  Dormitory:      'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  Sports:         'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  Cafeteria:      'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Laboratory:     'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400',
  Library:        'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
};

const EMPTY_FORM = { code: '', name: '', type: 'Academic', totalFloors: '', totalRooms: '', location: '', constructionYear: '', capacity: '', status: 'Active' };

// ── component ──────────────────────────────────────────────────────────────────
export default function BuildingEntry() {
  const [buildings, setBuildings]       = useState(INITIAL_BUILDINGS);
  const [search, setSearch]             = useState('');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [perPage, setPerPage]           = useState(10);
  const [page, setPage]                 = useState(1);

  const [formModal, setFormModal]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});

  // ── filter ───────────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    buildings.filter(b =>
      (typeFilter === 'All' || b.type === typeFilter) &&
      (!search || b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase()))
    ), [buildings, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // ── handlers ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    const nextNum = String(Math.max(...buildings.map(b => parseInt(b.code.replace('BLD-', '')))) + 1).padStart(2, '0');
    setForm({ ...EMPTY_FORM, code: `BLD-${nextNum}` });
    setFormErrors({});
    setFormModal({ mode: 'add' });
  };

  const openEdit = (b) => {
    setForm({ code: b.code, name: b.name, type: b.type, totalFloors: b.totalFloors, totalRooms: b.totalRooms, location: b.location, constructionYear: b.constructionYear, capacity: b.capacity, status: b.status });
    setFormErrors({});
    setFormModal({ mode: 'edit', id: b.id });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                           errs.name     = 'Building name is required';
    if (!form.code.trim())                           errs.code     = 'Building code is required';
    if (!form.location.trim())                       errs.location = 'Location is required';
    if (!form.totalFloors || +form.totalFloors <= 0) errs.totalFloors = 'Total floors must be > 0';
    if (!form.totalRooms  || +form.totalRooms  <= 0) errs.totalRooms  = 'Total rooms must be > 0';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (formModal.mode === 'add') {
      const newId = Math.max(...buildings.map(b => b.id)) + 1;
      setBuildings(p => [...p, { id: newId, ...form, totalFloors: +form.totalFloors, totalRooms: +form.totalRooms, capacity: +form.capacity || 0 }]);
    } else {
      setBuildings(p => p.map(b => b.id === formModal.id ? { ...b, ...form, totalFloors: +form.totalFloors, totalRooms: +form.totalRooms, capacity: +form.capacity || 0 } : b));
    }
    setFormModal(null);
  };

  const toggleStatus = (id) =>
    setBuildings(p => p.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));

  const handleDelete = () => {
    setBuildings(p => p.filter(b => b.id !== deleteTarget.id));
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

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Infrastructure', 'Building Entry']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Building2 size={22} className="text-blue-500" /> Building Entry
            </h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Building
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Buildings',  value: buildings.length,                                             cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',      val: 'text-blue-700 dark:text-blue-400'   },
            { label: 'Active',           value: buildings.filter(b => b.status === 'Active').length,          cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',  val: 'text-green-700 dark:text-green-400' },
            { label: 'Total Rooms',      value: buildings.reduce((s, b) => s + b.totalRooms, 0),              cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', val: 'text-indigo-700 dark:text-indigo-400' },
            { label: 'Total Capacity',   value: buildings.reduce((s, b) => s + b.capacity, 0).toLocaleString(), cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',  val: 'text-amber-700 dark:text-amber-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Buildings</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Building Type</label>
              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className={inp}>
                {BUILDING_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Name, code, location…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Building Records</span>
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
            <table className="w-full" style={{ minWidth: '950px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Code', 'Building Name', 'Type', 'Location', 'Floors', 'Rooms', 'Capacity', 'Built', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-14 text-center">
                      <Building2 size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400">No buildings match your filters</p>
                    </td>
                  </tr>
                ) : paged.map((bld, i) => (
                  <tr key={bld.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${bld.status === 'Inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium font-mono">{bld.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0">
                          <Building2 size={12} />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{bld.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap ${typeColorMap[bld.type] || 'bg-gray-100 text-gray-600'}`}>{bld.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <MapPin size={11} className="text-gray-400" /> {bld.location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <Layers size={11} className="text-blue-400" /> {bld.totalFloors}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <DoorOpen size={11} className="text-purple-400" /> {bld.totalRooms}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{bld.capacity.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{bld.constructionYear}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${bld.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {bld.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(bld)} title="Edit Building"
                          className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => toggleStatus(bld.id)} title="Toggle Status"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${bld.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 border-green-100 dark:border-green-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 border-gray-200 dark:border-gray-600'}`}>
                          {bld.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button onClick={() => setDeleteTarget(bld)} title="Delete Building"
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
              ['bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100', 'Edit Building'],
              ['bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100', 'Toggle Active/Inactive'],
              ['bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100', 'Delete Building'],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${cls}`}><span className="text-[8px]">●</span></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add / Edit Modal */}
        {formModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFormModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Building2 size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formModal.mode === 'add' ? 'Add New Building' : 'Edit Building'}</span>
                </div>
                <button onClick={() => setFormModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Code / Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Building Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={`${inp} font-mono ${formErrors.code ? 'border-red-400' : ''}`} placeholder="BLD-01" />
                    {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inp}>
                      <option>Active</option><option>Inactive</option>
                    </select>
                  </div>
                </div>
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Building Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={`${inp} ${formErrors.name ? 'border-red-400' : ''}`} placeholder="e.g. Main Academic Block" />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                {/* Type / Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Building Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inp}>
                      {BUILDING_TYPES.filter(t => t !== 'All').map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location *</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={`${inp} ${formErrors.location ? 'border-red-400' : ''}`} placeholder="e.g. North Campus" />
                    {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
                  </div>
                </div>
                {/* Floors / Rooms / Capacity / Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Floors *</label>
                    <input type="number" min="1" value={form.totalFloors} onChange={e => setForm(f => ({ ...f, totalFloors: e.target.value }))} className={`${inp} ${formErrors.totalFloors ? 'border-red-400' : ''}`} placeholder="e.g. 4" />
                    {formErrors.totalFloors && <p className="text-xs text-red-500">{formErrors.totalFloors}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Rooms *</label>
                    <input type="number" min="1" value={form.totalRooms} onChange={e => setForm(f => ({ ...f, totalRooms: e.target.value }))} className={`${inp} ${formErrors.totalRooms ? 'border-red-400' : ''}`} placeholder="e.g. 32" />
                    {formErrors.totalRooms && <p className="text-xs text-red-500">{formErrors.totalRooms}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Capacity (persons)</label>
                    <input type="number" min="0" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className={inp} placeholder="e.g. 1200" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Construction Year</label>
                    <input value={form.constructionYear} onChange={e => setForm(f => ({ ...f, constructionYear: e.target.value }))} className={inp} placeholder="e.g. 2005" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setFormModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <Building2 size={13} /> {formModal.mode === 'add' ? 'Add Building' : 'Save Changes'}
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
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Building?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">"{deleteTarget.name}"</span> will be permanently removed from the system.
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