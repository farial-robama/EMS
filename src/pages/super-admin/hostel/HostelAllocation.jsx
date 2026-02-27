import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, Filter, ChevronRight, ChevronLeft,
  Home, Eye, X, AlertTriangle, User, BedDouble, Calendar,
  ArrowRightLeft, CheckCircle2, Clock, BadgeCheck, Building2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const ALLOCATION_DATA = [
  { id: 1, allocNo: 'HA-2025-001', studentName: 'Rahim Uddin', roll: '101', regNo: 'REG-2020-101', className: 'Ten (Science)', roomNo: 'H-101', block: 'Block A', floor: '1st Floor', roomType: 'Single', monthlyFee: 3500, allocDate: '2025-01-10', validUntil: '2025-12-31', guardianContact: '01711-000001', status: 'Active' },
  { id: 2, allocNo: 'HA-2025-002', studentName: 'Fatema Begum', roll: '203', regNo: 'REG-2021-203', className: 'Eight', roomNo: 'H-102', block: 'Block A', floor: '1st Floor', roomType: 'Double', monthlyFee: 2500, allocDate: '2025-01-15', validUntil: '2025-12-31', guardianContact: '01711-000002', status: 'Active' },
  { id: 3, allocNo: 'HA-2025-003', studentName: 'Arif Hasan', roll: '312', regNo: 'REG-2022-312', className: 'Five', roomNo: 'H-301', block: 'Block B', floor: '3rd Floor', roomType: 'Triple', monthlyFee: 1500, allocDate: '2025-02-01', validUntil: '2025-12-31', guardianContact: '01711-000003', status: 'Active' },
  { id: 4, allocNo: 'HA-2025-004', studentName: 'Mehedi Hasan', roll: '178', regNo: 'REG-2022-178', className: 'Ten (Commerce)', roomNo: 'H-202', block: 'Block A', floor: '2nd Floor', roomType: 'Single', monthlyFee: 2800, allocDate: '2025-01-20', validUntil: '2025-06-30', guardianContact: '01711-000004', status: 'Expired' },
  { id: 5, allocNo: 'HA-2025-005', studentName: 'Nadia Islam', roll: '267', regNo: 'REG-2022-267', className: 'Three', roomNo: 'H-307', block: 'Block B', floor: '3rd Floor', roomType: 'Dormitory', monthlyFee: 900, allocDate: '2025-03-01', validUntil: '2025-12-31', guardianContact: '01711-000005', status: 'Active' },
  { id: 6, allocNo: 'HA-2025-006', studentName: 'Tanvir Ahmed', roll: '089', regNo: 'REG-2023-089', className: 'Six', roomNo: 'H-401', block: 'Block B', floor: '4th Floor', roomType: 'Double', monthlyFee: 3000, allocDate: '2025-03-10', validUntil: '2025-12-31', guardianContact: '01711-000006', status: 'Suspended' },
];

// Rooms available to assign (mirrored from HostelRoom data, only non-full)
const AVAILABLE_ROOMS = [
  { roomNo: 'H-102', block: 'Block A', floor: '1st Floor', type: 'Double', vacant: 1, fee: 2500 },
  { roomNo: 'H-201', block: 'Block A', floor: '2nd Floor', type: 'Double', vacant: 2, fee: 2800 },
  { roomNo: 'H-301', block: 'Block B', floor: '3rd Floor', type: 'Triple', vacant: 1, fee: 1500 },
  { roomNo: 'H-302', block: 'Block B', floor: '3rd Floor', type: 'Dormitory', vacant: 3, fee: 900 },
];

const CLASSES   = ['All', 'KG', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine (Science)', 'Nine (Arts)', 'Ten (Science)', 'Ten (Arts)', 'Ten (Commerce)'];
const BLOCKS    = ['All', 'Block A', 'Block B', 'Block C'];
const STATUSES  = ['All', 'Active', 'Expired', 'Suspended'];

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
  Active:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Expired:   'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
  Suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const EMPTY_FORM = {
  allocNo: '', studentName: '', roll: '', regNo: '', className: 'Eight',
  roomNo: 'H-102', block: 'Block A', floor: '1st Floor', roomType: 'Double',
  monthlyFee: 2500, allocDate: new Date().toISOString().slice(0, 10),
  validUntil: '', guardianContact: '', status: 'Active',
};

function AllocModal({ mode, initial, onSave, onClose, nextAllocNo }) {
  const [form, setForm] = useState(initial || { ...EMPTY_FORM, allocNo: nextAllocNo });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRoomSelect = (rm) => {
    set('roomNo', rm.roomNo);
    set('block', rm.block);
    set('floor', rm.floor);
    set('roomType', rm.type);
    set('monthlyFee', rm.fee);
  };

  const validate = () => {
    const e = {};
    if (!form.allocNo.trim()) e.allocNo = 'Allocation number is required';
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.roll.trim()) e.roll = 'Roll is required';
    if (!form.allocDate) e.allocDate = 'Allocation date is required';
    if (!form.validUntil) e.validUntil = 'Valid until date is required';
    if (!form.guardianContact.trim()) e.guardianContact = 'Guardian contact is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 flex items-center justify-center"><Home size={15} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{mode === 'add' ? 'New Hostel Allocation' : 'Edit Allocation'}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Alloc No + Reg No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Alloc. No. *</label>
              <input value={form.allocNo} onChange={e => set('allocNo', e.target.value)} className={inp} placeholder="e.g. HA-2025-007" />
              {errors.allocNo && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.allocNo}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reg. Number</label>
              <input value={form.regNo} onChange={e => set('regNo', e.target.value)} className={inp} placeholder="REG-2022-001" />
            </div>
          </div>

          {/* Student + Roll */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Class + Guardian */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={form.className} onChange={e => set('className', e.target.value)} className={inp}>
                {CLASSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Guardian Contact *</label>
              <input value={form.guardianContact} onChange={e => set('guardianContact', e.target.value)} className={inp} placeholder="e.g. 01711-000001" />
              {errors.guardianContact && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.guardianContact}</p>}
            </div>
          </div>

          {/* Room Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Room</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_ROOMS.map(rm => (
                <button key={rm.roomNo} type="button" onClick={() => handleRoomSelect(rm)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${form.roomNo === rm.roomNo ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600 hover:border-orange-200'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${form.roomNo === rm.roomNo ? 'bg-orange-100 dark:bg-orange-900 text-orange-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
                    <BedDouble size={12} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${form.roomNo === rm.roomNo ? 'text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-gray-200'}`}>{rm.roomNo}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{rm.block} · {rm.floor}</p>
                    <p className="text-xs text-gray-400">{rm.type} · {rm.vacant} vacant · ৳{rm.fee}/mo</p>
                  </div>
                </button>
              ))}
            </div>
            {/* Manual room entry if room not in list */}
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Room No.</label>
                <input value={form.roomNo} onChange={e => set('roomNo', e.target.value)} className={inp} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Block</label>
                <select value={form.block} onChange={e => set('block', e.target.value)} className={inp}>
                  {BLOCKS.filter(b => b !== 'All').map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Monthly Fee (৳)</label>
                <input type="number" value={form.monthlyFee} onChange={e => set('monthlyFee', +e.target.value)} className={inp} />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Allocation Date *</label>
              <input type="date" value={form.allocDate} onChange={e => set('allocDate', e.target.value)} className={inp} />
              {errors.allocDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.allocDate}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Valid Until *</label>
              <input type="date" value={form.validUntil} onChange={e => set('validUntil', e.target.value)} className={inp} />
              {errors.validUntil && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.validUntil}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <div className="flex gap-2 flex-wrap">
              {['Active', 'Expired', 'Suspended'].map(s => (
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
          <button onClick={() => { if (validate()) onSave(form); }} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm shadow-orange-200">
            <Home size={13} />{mode === 'add' ? 'Allocate Room' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ alloc, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 flex items-center justify-center"><Home size={15} /></div>
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Allocation Details</span>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">{alloc.allocNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <User size={22} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">{alloc.studentName}</h3>
              <p className="text-xs text-gray-500">Roll: {alloc.roll} · {alloc.className}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold mt-1 ${STATUS_STYLES[alloc.status]}`}>{alloc.status}</span>
            </div>
          </div>

          {/* Room card */}
          <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-100 dark:border-teal-900/30">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
              <BedDouble size={18} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{alloc.roomNo} <span className="text-xs font-normal text-gray-500">({alloc.roomType})</span></p>
              <p className="text-xs text-gray-500">{alloc.block} · {alloc.floor}</p>
              <p className="text-xs font-semibold text-teal-600">৳{alloc.monthlyFee.toLocaleString()}/month</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Alloc. No.', value: alloc.allocNo },
              { label: 'Reg. No.', value: alloc.regNo || '—' },
              { label: 'Alloc. Date', value: alloc.allocDate },
              { label: 'Valid Until', value: alloc.validUntil },
              { label: 'Guardian Contact', value: alloc.guardianContact },
              { label: 'Status', value: alloc.status },
            ].map(({ label, value }) => (
              <div key={label} className="p-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400">{label}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function HostelAllocation() {
  const [allocations, setAllocations] = useState(ALLOCATION_DATA);
  const [filterClass, setFilterClass] = useState('All');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => allocations.filter(a =>
    (filterClass === 'All' || a.className === filterClass) &&
    (filterBlock === 'All' || a.block === filterBlock) &&
    (filterStatus === 'All' || a.status === filterStatus) &&
    (!search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.allocNo.toLowerCase().includes(search.toLowerCase()) || a.roomNo.toLowerCase().includes(search.toLowerCase()))
  ), [allocations, filterClass, filterBlock, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const nextAllocNo = () => `HA-${new Date().getFullYear()}-${String(allocations.length + 1).padStart(3, '0')}`;

  const handleSave = (form) => {
    if (modal.mode === 'add') setAllocations(p => [...p, { ...form, id: Math.max(...p.map(a => a.id)) + 1 }]);
    else setAllocations(p => p.map(a => a.id === modal.data.id ? { ...a, ...form } : a));
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
            <Breadcrumb items={['Dashboard', 'Hostel', 'Hostel Allocation']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Home size={22} className="text-orange-500" /> Hostel Allocation
            </h1>
          </div>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Allocate Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Allocs.', value: allocations.length, cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100', val: 'text-blue-700 dark:text-blue-400' },
            { label: 'Active', value: allocations.filter(a => a.status === 'Active').length, cls: 'bg-green-50 dark:bg-green-900/20 border-green-100', val: 'text-green-700 dark:text-green-400' },
            { label: 'Expired', value: allocations.filter(a => a.status === 'Expired').length, cls: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200', val: 'text-gray-600 dark:text-gray-400' },
            { label: 'Suspended', value: allocations.filter(a => a.status === 'Suspended').length, cls: 'bg-red-50 dark:bg-red-900/20 border-red-100', val: 'text-red-600 dark:text-red-400' },
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
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Allocations</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Class', value: filterClass, set: v => { setFilterClass(v); setPage(1); }, opts: CLASSES },
              { label: 'Block', value: filterBlock, set: v => { setFilterBlock(v); setPage(1); }, opts: BLOCKS },
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
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Allocation Records</span>
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
                <input placeholder="Search allocations…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '980px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Alloc. No.', 'Student', 'Roll', 'Class', 'Room', 'Block / Floor', 'Monthly Fee', 'Alloc. Date', 'Valid Until', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={12} className="py-14 text-center">
                    <Home size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No allocations match your filters</p>
                  </td></tr>
                ) : paged.map((a, i) => (
                  <tr key={a.id} className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${a.status === 'Expired' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono font-semibold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-lg border border-orange-100 dark:border-orange-900">{a.allocNo}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-orange-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{a.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">{a.roll}</span></td>
                    <td className="px-4 py-4"><span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">{a.className}</span></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={12} className="text-teal-500" />
                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">{a.roomNo}</span>
                        <span className="text-xs text-gray-400">({a.roomType})</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{a.block} · {a.floor}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">৳{a.monthlyFee.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{a.allocDate}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{a.validUntil}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${STATUS_STYLES[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(a)} className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center border border-indigo-100 dark:border-indigo-900"><Eye size={12} /></button>
                        <button onClick={() => setModal({ mode: 'edit', data: a })} className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100 dark:border-amber-900"><Pencil size={12} /></button>
                        <button onClick={() => setDeleteTarget(a)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-100 dark:border-red-900"><Trash2 size={12} /></button>
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

        {modal && <AllocModal mode={modal.mode} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} nextAllocNo={nextAllocNo()} />}
        {viewTarget && <ViewModal alloc={viewTarget} onClose={() => setViewTarget(null)} />}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Allocation?</h3>
              <p className="text-sm text-gray-500 mb-1">Allocation <span className="font-semibold text-orange-600">{deleteTarget.allocNo}</span> for</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-5">"{deleteTarget.studentName}" will be removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={() => { setAllocations(p => p.filter(a => a.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}