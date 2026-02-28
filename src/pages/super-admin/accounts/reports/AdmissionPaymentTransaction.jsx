import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  FileText,
  ChevronRight,
  Printer,
  Download,
  ArrowLeft,
  GraduationCap,
  DollarSign,
  Hash,
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Eye,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

// ── Mock Data ────────────────────────────────────────────────────────────────
const transactionData = [
  { sl: 1,  txnId: 'TXN-2025-001', studentCode: '2415730510015', name: 'Imran Hossen',      department: 'BBS', admissionRoll: '2025558', contact: '01762122765', session: '2024-2025', paymentMethod: 'bKash',   amount: 8470,  status: 'Success',  txnDate: '2025-11-16 12:48:58', bank: 'bKash Mobile' },
  { sl: 2,  txnId: 'TXN-2025-002', studentCode: '2415730510013', name: 'Md. Ibrahim',        department: 'BBS', admissionRoll: '4020960', contact: '01781421320', session: '2024-2025', paymentMethod: 'Nagad',   amount: 8470,  status: 'Pending',  txnDate: '2025-11-16 12:03:48', bank: 'Nagad Mobile' },
  { sl: 3,  txnId: 'TXN-2025-003', studentCode: '2415730510022', name: 'Rina Begum',         department: 'BBS', admissionRoll: '3045123', contact: '01900123456', session: '2024-2025', paymentMethod: 'Rocket',  amount: 8470,  status: 'Success',  txnDate: '2025-11-17 09:15:00', bank: 'DBBL Rocket' },
  { sl: 4,  txnId: 'TXN-2025-004', studentCode: '2415730510031', name: 'Karim Molla',        department: 'BBS', admissionRoll: '5067891', contact: '01712345678', session: '2024-2025', paymentMethod: 'bKash',   amount: 8470,  status: 'Failed',   txnDate: '2025-11-17 11:20:30', bank: 'bKash Mobile' },
  { sl: 5,  txnId: 'TXN-2025-005', studentCode: '2415730510044', name: 'Fatema Khatun',      department: 'BA',  admissionRoll: '6078234', contact: '01823456789', session: '2024-2025', paymentMethod: 'Nagad',   amount: 8470,  status: 'Success',  txnDate: '2025-11-18 08:30:00', bank: 'Nagad Mobile' },
  { sl: 6,  txnId: 'TXN-2025-006', studentCode: '2415730510055', name: 'Rafiqul Islam',      department: 'BSS', admissionRoll: '7089345', contact: '01934567890', session: '2024-2025', paymentMethod: 'bKash',   amount: 8470,  status: 'Success',  txnDate: '2025-11-18 10:45:00', bank: 'bKash Mobile' },
  { sl: 7,  txnId: 'TXN-2025-007', studentCode: '2415730510063', name: 'Nasrin Akter',       department: 'BA',  admissionRoll: '8090456', contact: '01645678901', session: '2024-2025', paymentMethod: 'Rocket',  amount: 8470,  status: 'Pending',  txnDate: '2025-11-19 14:00:00', bank: 'DBBL Rocket' },
  { sl: 8,  txnId: 'TXN-2025-008', studentCode: '2415730510071', name: 'Sumon Ahmed',        department: 'BSS', admissionRoll: '9101567', contact: '01756789012', session: '2024-2025', paymentMethod: 'bKash',   amount: 8470,  status: 'Success',  txnDate: '2025-11-19 16:20:00', bank: 'bKash Mobile' },
  { sl: 9,  txnId: 'TXN-2025-009', studentCode: '2415730510082', name: 'Tahmina Begum',      department: 'BBS', admissionRoll: '1112678', contact: '01867890123', session: '2024-2025', paymentMethod: 'Nagad',   amount: 8470,  status: 'Failed',   txnDate: '2025-11-20 09:10:00', bank: 'Nagad Mobile' },
  { sl: 10, txnId: 'TXN-2025-010', studentCode: '2415730510090', name: 'Hasan Mahmud',       department: 'BA',  admissionRoll: '2223789', contact: '01978901234', session: '2024-2025', paymentMethod: 'Rocket',  amount: 8470,  status: 'Success',  txnDate: '2025-11-20 11:55:00', bank: 'DBBL Rocket' },
];

const SESSION_OPTIONS  = ['2024-2025', '2023-2024', '2022-2023'];
const DEPT_OPTIONS     = ['All', 'BA', 'BBS', 'BSS'];
const METHOD_OPTIONS   = ['All', 'bKash', 'Nagad', 'Rocket'];
const STATUS_OPTIONS   = ['All', 'Success', 'Pending', 'Failed'];

const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Sub-components ────────────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const StatusBadge = ({ status }) => {
  const map = {
    Success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Failed:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const Icon = { Success: CheckCircle, Pending: Clock, Failed: XCircle }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${map[status]}`}>
      {Icon && <Icon size={11} />} {status}
    </span>
  );
};

const MethodBadge = ({ method }) => {
  const map = {
    bKash:  'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
    Nagad:  'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    Rocket: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${map[method] || 'bg-gray-100 text-gray-600'}`}>
      <CreditCard size={11} /> {method}
    </span>
  );
};

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdmissionPaymentTransaction = () => {
  const navigate    = useNavigate();
  const printRef    = useRef();
  const printingDate = new Date().toLocaleDateString('en-GB');

  // Filter state
  const [session,       setSession]       = useState('2024-2025');
  const [department,    setDepartment]    = useState('All');
  const [method,        setMethod]        = useState('All');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [search,        setSearch]        = useState('');
  const [dateFrom,      setDateFrom]      = useState('');
  const [dateTo,        setDateTo]        = useState('');
  const [selectedRows,  setSelectedRows]  = useState(new Set());

  // Filtered data
  const filtered = useMemo(() => {
    return transactionData.filter((r) => {
      if (department !== 'All' && r.department !== department) return false;
      if (method     !== 'All' && r.paymentMethod !== method)  return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.txnId.toLowerCase().includes(q) && !r.studentCode.includes(q)) return false;
      }
      return true;
    });
  }, [department, method, statusFilter, search]);

  // Summary stats
  const stats = useMemo(() => ({
    total:   filtered.length,
    success: filtered.filter((r) => r.status === 'Success').length,
    pending: filtered.filter((r) => r.status === 'Pending').length,
    failed:  filtered.filter((r) => r.status === 'Failed').length,
    amount:  filtered.filter((r) => r.status === 'Success').reduce((s, r) => s + r.amount, 0),
  }), [filtered]);

  // Row selection
  const toggleRow = (sl) => setSelectedRows((prev) => {
    const next = new Set(prev);
    next.has(sl) ? next.delete(sl) : next.add(sl);
    return next;
  });
  const toggleAll = () =>
    setSelectedRows(selectedRows.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.sl)));

  // Reset filters
  const resetFilters = () => {
    setDepartment('All'); setMethod('All'); setStatusFilter('All'); setSearch(''); setDateFrom(''); setDateTo('');
  };

  // PDF Export
  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Admission Payment Transaction Report', 40, 40);
    doc.setFontSize(10).text(`Session: ${session}   |   Printing Date: ${printingDate}`, 40, 58);
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Txn ID', 'Student Code', 'Name', 'Dept', 'Adm. Roll', 'Contact', 'Session', 'Method', 'Bank', 'Txn Date', 'Amount', 'Status']],
      body: filtered.map((r) => [r.sl, r.txnId, r.studentCode, r.name, r.department, r.admissionRoll, r.contact, r.session, r.paymentMethod, r.bank, r.txnDate, `৳${formatMoney(r.amount)}`, r.status]),
      theme: 'grid',
      headStyles: { fillColor: '#7C3AED', textColor: '#fff', fontSize: 8 },
      styles: { fontSize: 8 },
    });
    window.open(doc.output('bloburl'));
  };

  // Excel Export
  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map((r) => ({
      SL: r.sl, 'Txn ID': r.txnId, 'Student Code': r.studentCode, Name: r.name,
      Department: r.department, 'Adm. Roll': r.admissionRoll, Contact: r.contact,
      Session: r.session, Method: r.paymentMethod, Bank: r.bank,
      'Txn Date': r.txnDate, 'Amount (৳)': r.amount, Status: r.status,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `Admission_Payment_Transactions_${session}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Breadcrumb + Title ── */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Admission Payment', 'Payment Transaction']} />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CreditCard size={22} className="text-purple-500" />
              Admission Payment Transactions
            </h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <button
                onClick={handlePDF}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Printer size={13} /> PDF
              </button>
              <button
                onClick={handleExcel}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Download size={13} /> Excel
              </button>
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Txn',     value: stats.total,                      bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: Hash },
            { label: 'Success',       value: stats.success,                     bg: 'bg-green-50 dark:bg-green-900/20',  ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',   Icon: CheckCircle },
            { label: 'Pending',       value: stats.pending,                     bg: 'bg-yellow-50 dark:bg-yellow-900/20',ic: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300',Icon: Clock },
            { label: 'Failed',        value: stats.failed,                      bg: 'bg-red-50 dark:bg-red-900/20',      ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',           Icon: XCircle },
            { label: 'Collected (৳)', value: `৳${formatMoney(stats.amount)}`,  bg: 'bg-blue-50 dark:bg-blue-900/20',    ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',       Icon: TrendingUp },
          ].map(({ label, value, bg, ic, Icon }) => (
            <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${bg}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}>
                <Icon size={16} />
              </div>
              <div>
                <div className="text-base font-bold text-gray-800 dark:text-white leading-none">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Panel ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-purple-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Transactions</span>
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition-colors"
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <SelectField label="Session"        value={session}       onChange={setSession}       options={SESSION_OPTIONS} />
            <SelectField label="Department"     value={department}    onChange={setDepartment}    options={DEPT_OPTIONS} />
            <SelectField label="Payment Method" value={method}        onChange={setMethod}        options={METHOD_OPTIONS} />
            <SelectField label="Status"         value={statusFilter}  onChange={setStatusFilter}  options={STATUS_OPTIONS} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all" />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, transaction ID, or student code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

          {/* Institute Header */}
          <div className="flex flex-col items-center py-5 px-5 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <GraduationCap size={24} className="text-purple-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
            <p className="text-xs text-gray-400 mt-0.5">College Code: 0 &nbsp;|&nbsp; Printing Date: {printingDate}</p>
            <div className="mt-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                Degree Admission — Payment Transaction Report | Session {session}
              </p>
            </div>
          </div>

          {/* Selected row info */}
          {selectedRows.size > 0 && (
            <div className="px-4 py-2.5 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900/30 flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''} selected
              </span>
              <button onClick={() => setSelectedRows(new Set())} className="ml-auto text-xs text-purple-500 hover:underline">
                Clear selection
              </button>
            </div>
          )}

          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  {['SL.', 'Txn ID', 'Student Code', 'Student Name', 'Dept', 'Adm. Roll', 'Contact No', 'Session', 'Method', 'Txn. Date', 'Amount (৳)', 'Status', 'Action'].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${['Amount (৳)'].includes(h) ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-5 py-14 text-center">
                      <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found!</p>
                      <button onClick={resetFilters} className="mt-2 text-xs text-purple-500 hover:underline">Reset filters</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.sl}
                      className={`hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors ${selectedRows.has(row.sl) ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.sl)}
                          onChange={() => toggleRow(row.sl)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-400">{row.sl}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded">
                          {row.txnId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {row.studentCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">{row.department}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">{row.admissionRoll}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{row.contact}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{row.session}</td>
                      <td className="px-4 py-3.5"><MethodBadge method={row.paymentMethod} /></td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{row.txnDate}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(row.amount)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={row.status} /></td>
                      <td className="px-4 py-3.5">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                  <td colSpan={12} className="px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 text-right">
                    Total Collected (Success only)
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                    ৳{formatMoney(stats.amount)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{transactionData.length}</span> transactions
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              <DollarSign size={11} className="inline" /> Success rate:{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {filtered.length ? Math.round((stats.success / filtered.length) * 100) : 0}%
              </span>
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdmissionPaymentTransaction;