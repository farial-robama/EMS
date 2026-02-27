import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  BedDouble, Eye, X, AlertTriangle, Users, Hash, Building2,
  DoorOpen, CheckCircle2, Layers, Wifi, Wind, ShowerHead, Tv2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const ROOM_DATA = [
  { id: 1, roomNo: 'H-101', floor: '1st Floor', block: 'Block A', type: 'Single', capacity: 1, occupied: 1, amenities: ['WiFi', 'AC', 'Attached Bath'], monthlyFee: 3500, status: 'Full' },
  { id: 2, roomNo: 'H-102', floor: '1st Floor', block: 'Block A', type: 'Double', capacity: 2, occupied: 1, amenities: ['WiFi', 'Attached Bath'], monthlyFee: 2500, status: 'Available' },
  { id: 3, roomNo: 'H-103', floor: '1st Floor', block: 'Block A', type: 'Triple', capacity: 3, occupied: 3, amenities: ['WiFi'], monthlyFee: 1800, status: 'Full' },
  { id: 4, roomNo: 'H-201', floor: '2nd Floor', block: 'Block A', type: 'Double', capacity: 2, occupied: 0, amenities: ['WiFi', 'AC'], monthlyFee: 2800, status: 'Available' },
  { id: 5, roomNo: 'H-202', floor: '2nd Floor', block: 'Block A', type: 'Single', capacity: 1, occupied: 1, amenities: ['WiFi', 'AC', 'Attached Bath', 'TV'], monthlyFee: 4000, status: 'Full' },
  { id: 6, roomNo: 'H-301', floor: '3rd Floor', block: 'Block B', type: 'Triple', capacity: 3, occupied: 2, amenities: ['WiFi', 'Fan'], monthlyFee: 1500, status: 'Available' },
  { id: 7, roomNo: 'H-302', floor: '3rd Floor', block: 'Block B', type: 'Dormitory', capacity: 8, occupied: 5, amenities: ['WiFi', 'Fan'], monthlyFee: 900, status: 'Available' },
  { id: 8, roomNo: 'H-401', floor: '4th Floor', block: 'Block B', type: 'Double', capacity: 2, occupied: 2, amenities: ['WiFi', 'AC', 'Attached Bath'], monthlyFee: 3000, status: 'Full' },
  { id: 9, roomNo: 'H-402', floor: '4th Floor', block: 'Block B', type: 'Single', capacity: 1, occupied: 0, amenities: ['WiFi', 'AC'], monthlyFee: 3200, status: 'Maintenance' },
];

const FLOORS   = ['All', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];
const BLOCKS   = ['All', 'Block A', 'Block B', 'Block C'];
const TYPES    = ['All', 'Single', 'Double', 'Triple', 'Dormitory'];
const STATUSES = ['All', 'Available', 'Full', 'Maintenance'];
const ALL_AMENITIES = ['WiFi', 'AC', 'Fan', 'Attached Bath', 'TV', 'Fridge', 'Hot Water'];

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

const STATUS_STYLES = {
  Available:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Full:        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  Maintenance: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

const TYPE_STYLES = {
  Single:     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Double:     'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  Triple:     'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  Dormitory:  'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
};

const AMENITY_ICONS = { WiFi: Wifi, AC: Wind, Fan: Wind, 'Attached Bath': ShowerHead, TV: Tv2 };

const EMPTY_FORM = { roomNo: '', floor: '1st Floor', block: 'Block A', type: 'Double', capacity: 2, occupied: 0, amenities: ['WiFi'], monthlyFee: 2500, status: 'Available' };

function OccupancyBar({ occupied, capacity }) {
  const pct = capacity > 0 ? (occupied / capacity) * 100 : 0;
  const color = pct === 100 ? 'bg-red-500' : pct >= 50 ? 'bg-amber-400' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{occupied}/{capacity}</span>
    </div>
  );
}

function RoomModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAmenity = (a) => set('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);

  const validate = () => {
    const e = {};
    if (!form.roomNo.trim()) e.roomNo = 'Room number is required';
    if (!form.capacity || form.capacity < 1) e.capacity = 'Capacity must be at least 1';
    if (form.occupied > form.capacity) e.occupied = 'Occupied cannot exceed capacity';
    if (!form.monthlyFee || form.monthlyFee < 0) e.monthlyFee = 'Monthly fee is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 flex items-center justify-center"><BedDouble size={15} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{mode === 'add' ? 'Add New Room' : 'Edit Room'}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Room No. *</label>
              <input value={form.roomNo} onChange={e => set('roomNo', e.target.value)} className={inp} placeholder="e.g. H-101" />
              {errors.roomNo && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.roomNo}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Block</label>
              <select value={form.block} onChange={e => set('block', e.target.value)} className={inp}>
                {BLOCKS.filter(b => b !== 'All').map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Floor</label>
              <select value={form.floor} onChange={e => set('floor', e.target.value)} className={inp}>
                {FLOORS.filter(f => f !== 'All').map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Room Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                {TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Capacity *</label>
              <input type="number" min={1} value={form.capacity} onChange={e => set('capacity', +e.target.value)} className={inp} />
              {errors.capacity && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.capacity}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Occupied</label>
              <input type="number" min={0} value={form.occupied} onChange={e => set('occupied', +e.target.value)} className={inp} />
              {errors.occupied && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.occupied}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Monthly Fee (৳)</label>
              <input type="number" min={0} value={form.monthlyFee} onChange={e => set('monthlyFee', +e.target.value)} className={inp} />
              {errors.monthlyFee && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.monthlyFee}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {ALL_AMENITIES.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${form.amenities.includes(a) ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-teal-200'}`}>
                  {form.amenities.includes(a) && <CheckCircle2 size={10} />}{a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-2 flex-wrap">
              {['Available', 'Full', 'Maintenance'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${form.status === s ? STATUS_STYLES[s] + ' border-current' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${form.status === s ? 'bg-current' : 'bg-gray-300 dark:bg-gray-600'}`} />{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-200">
            <BedDouble size={13} />{mode === 'add' ? 'Add Room' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ room, onClose }) {
  const pct = Math.round((room.occupied / room.capacity) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 flex items-center justify-center"><BedDouble size={15} /></div>
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Room Details</span>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{room.roomNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{room.roomNo}</h3>
              <p className="text-sm text-gray-500">{room.block} · {room.floor}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-600">৳{room.monthlyFee.toLocaleString()}</p>
              <p className="text-xs text-gray-400">/month</p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500">Occupancy</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{pct}%</span>
            </div>
            <OccupancyBar occupied={room.occupied} capacity={room.capacity} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['Type', room.type], ['Capacity', room.capacity], ['Vacant', room.capacity - room.occupied]].map(([l, v]) => (
              <div key={l} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">{l}</p>
                <p className="text-base font-bold text-gray-800 dark:text-white mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amenities</p>
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.map(a => (
                <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-lg text-xs font-medium border border-teal-100 dark:border-teal-900">{a}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLES[room.status]}`}>{room.status}</span>
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function HostelRoom() {
  const [rooms, setRooms] = useState(ROOM_DATA);
  const [filterFloor, setFilterFloor] = useState('All');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => rooms.filter(r =>
    (filterFloor === 'All' || r.floor === filterFloor) &&
    (filterBlock === 'All' || r.block === filterBlock) &&
    (filterType === 'All' || r.type === filterType) &&
    (filterStatus === 'All' || r.status === filterStatus) &&
    (!search || r.roomNo.toLowerCase().includes(search.toLowerCase()) || r.block.toLowerCase().includes(search.toLowerCase()))
  ), [rooms, filterFloor, filterBlock, filterType, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const totalCapacity = rooms.reduce((a, r) => a + r.capacity, 0);
  const totalOccupied = rooms.reduce((a, r) => a + r.occupied, 0);

  const handleSave = (form) => {
    if (modal.mode === 'add') setRooms(p => [...p, { ...form, id: Math.max(...p.map(r => r.id)) + 1 }]);
    else setRooms(p => p.map(r => r.id === modal.data.id ? { ...r, ...form } : r));
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
            <Breadcrumb items={['Dashboard', 'Hostel', 'Hostel Room']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BedDouble size={22} className="text-teal-500" /> Hostel Room
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Rooms', value: rooms.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100', val: 'text-green-700 dark:text-green-400' },
            { label: 'Total Beds', value: totalCapacity, cls: 'bg-teal-50 dark:bg-teal-900/20 border-teal-100', val: 'text-teal-700 dark:text-teal-400' },
            { label: 'Occupied Beds', value: totalOccupied, cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100', val: 'text-indigo-700 dark:text-indigo-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Rooms</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Floor', value: filterFloor, set: v => { setFilterFloor(v); setPage(1); }, opts: FLOORS },
              { label: 'Block', value: filterBlock, set: v => { setFilterBlock(v); setPage(1); }, opts: BLOCKS },
              { label: 'Room Type', value: filterType, set: v => { setFilterType(v); setPage(1); }, opts: TYPES },
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
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Room Records</span>
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
                <input placeholder="Search rooms…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '900px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Room No.', 'Block', 'Floor', 'Type', 'Occupancy', 'Monthly Fee', 'Amenities', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={10} className="py-14 text-center">
                    <BedDouble size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No rooms match your filters</p>
                  </td></tr>
                ) : paged.map((r, i) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                          <BedDouble size={13} className="text-teal-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{r.roomNo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{r.block}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.floor}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TYPE_STYLES[r.type]}`}>{r.type}</span>
                    </td>
                    <td className="px-4 py-4 w-36"><OccupancyBar occupied={r.occupied} capacity={r.capacity} /></td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">৳{r.monthlyFee.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {r.amenities.slice(0, 2).map(a => (
                          <span key={a} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">{a}</span>
                        ))}
                        {r.amenities.length > 2 && <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded text-xs">+{r.amenities.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(r)} className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'edit', data: r })} className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
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

        {modal && <RoomModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        {viewTarget && <ViewModal room={viewTarget} onClose={() => setViewTarget(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Room?</h3>
              <p className="text-sm text-gray-500 mb-1">Room <span className="font-semibold text-teal-600">{deleteTarget.roomNo}</span></p>
              {deleteTarget.occupied > 0 && <p className="text-xs text-amber-600 flex items-center justify-center gap-1 mb-3"><AlertTriangle size={11} />This room has {deleteTarget.occupied} occupant(s).</p>}
              <p className="text-sm text-gray-500 mb-5">will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setRooms(p => p.filter(r => r.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}