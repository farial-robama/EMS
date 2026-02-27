import React, { useState, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  FileText,
  Search,
  Eye,
  Trash2,
  Download,
  Printer,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Cr,
  X,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const sampleInvoices = [
  {
    id: 1,
    studentName: 'Abu Rayhan',
    invoiceNo: 'INC-00013029',
    txnNo: '',
    studentID: '2116570580006',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '22-12-2025',
    shift: 'Day',
    medium: 'Bangla',
    department: 'Geography & Environment',
    prevClass: 'Geography (Honours)',
    currentClass: 'Geography (Honours)',
    section: '1st Year',
    accountant: 'Abeg',
    phone: '01647384398',
    roll: '2202122320027',
    regNo: '',
    amount: 17350,
    discount: 0,
    total: 17350,
  },
  {
    id: 2,
    studentName: 'Sijan',
    invoiceNo: 'INC-00013030',
    txnNo: '',
    studentID: '2316260170107',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '22-12-2025',
    shift: 'Day',
    medium: 'Bangla',
    department: 'Management',
    prevClass: 'Management (Honours)',
    currentClass: 'Management (Honours)',
    section: '2nd Year',
    accountant: 'bank_user 2',
    phone: '01799799419',
    roll: '2202324260107',
    regNo: '',
    amount: 11300,
    discount: 0,
    total: 11300,
  },
  {
    id: 3,
    studentName: 'Rafi Ahmed',
    invoiceNo: 'INC-00013031',
    txnNo: '',
    studentID: '2416110190077',
    partner: 'Manual',
    purpose: 'Exam Fee',
    date: '23-12-2025',
    shift: 'Day',
    medium: 'Bangla',
    department: 'English',
    prevClass: 'English (Honours)',
    currentClass: 'English (Honours)',
    section: '3rd Year',
    accountant: 'Abeg',
    phone: '01800000001',
    roll: '2202324110077',
    regNo: '22ABC001',
    amount: 2000,
    discount: 100,
    total: 1900,
  },
  {
    id: 4,
    studentName: 'Fatema Khatun',
    invoiceNo: 'INC-00013032',
    txnNo: '',
    studentID: '2516570580099',
    partner: 'Online',
    purpose: 'Library',
    date: '23-12-2025',
    shift: 'Day',
    medium: 'Bangla',
    department: 'History',
    prevClass: 'History (Honours)',
    currentClass: 'History (Honours)',
    section: '1st Year',
    accountant: 'bank_user 2',
    phone: '01900000002',
    roll: '2202324570099',
    regNo: '22DEF002',
    amount: 500,
    discount: 0,
    total: 500,
  },
  {
    id: 5,
    studentName: 'Karim Uddin',
    invoiceNo: 'INC-00013033',
    txnNo: '',
    studentID: '2216110190055',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '24-12-2025',
    shift: 'Day',
    medium: 'English',
    department: 'Science',
    prevClass: 'HSC-Science',
    currentClass: 'HSC-Science',
    section: '2nd Year',
    accountant: 'Abeg',
    phone: '01700000003',
    roll: '2202324110055',
    regNo: '',
    amount: 8000,
    discount: 500,
    total: 7500,
  },
];

const TXN_TYPES = ['Income', 'Expense'];
const DEPARTMENTS = [
  'All',
  ...new Set(sampleInvoices.map((i) => i.department)),
];
const SECTIONS = ['All', ...new Set(sampleInvoices.map((i) => i.section))];

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
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function InvoiceList() {
  const [txnType, setTxnType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dept, setDept] = useState('All');
  const [section, setSection] = useState('All');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [viewInvoice, setViewInvoice] = useState(null);
  const tableRef = useRef();

  const validate = () => {
    const e = {};
    if (!txnType) e.txnType = 'Required';
    if (!fromDate) e.fromDate = 'Required';
    if (!toDate) e.toDate = 'Required';
    return e;
  };

  const handleSearch = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const filtered = sampleInvoices.filter((inv) => {
      const [d, m, y] = inv.date.split('-').map(Number);
      const invDate = new Date(y, m - 1, d);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return (
        invDate >= from &&
        invDate <= to &&
        (dept === 'All' || inv.department === dept) &&
        (section === 'All' || inv.section === section)
      );
    });
    setResults(filtered);
    setSearched(true);
    setPage(1);
  };

  const displayed = useMemo(
    () =>
      results.filter(
        (inv) =>
          !search ||
          inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
          inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          inv.studentID.includes(search)
      ),
    [results, search]
  );

  const totalPages = Math.max(1, Math.ceil(displayed.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = displayed.slice((safePage - 1) * perPage, safePage * perPage);

  const handleDelete = (id) =>
    setResults((p) => p.filter((inv) => inv.id !== id));

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(displayed);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'InvoiceList');
    XLSX.writeFile(wb, 'InvoiceList.xlsx');
  };

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Invoice List Report', 40, 40);
    doc.setFontSize(10).text(`From: ${fromDate}  To: ${toDate}`, 40, 60);
    autoTable(doc, {
      startY: 80,
      head: [
        [
          '#',
          'Student',
          'Invoice No',
          'Date',
          'Department',
          'Section',
          'Amount',
          'Discount',
          'Total',
        ],
      ],
      body: displayed.map((inv, i) => [
        i + 1,
        inv.studentName,
        inv.invoiceNo,
        inv.date,
        inv.department,
        inv.section,
        inv.amount,
        inv.discount,
        inv.total,
      ]),
      theme: 'grid',
      headStyles: { fillColor: '#2563EB', textColor: '#fff' },
    });
    window.open(doc.output('bloburl'));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Invoice List']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-blue-500" /> Invoice List
          </h1>
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Search Filters
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <F label="Transaction Type" required error={errors.txnType}>
                <select
                  value={txnType}
                  onChange={(e) => {
                    setTxnType(e.target.value);
                    setErrors((p) => ({ ...p, txnType: undefined }));
                  }}
                  className={errors.txnType ? inpErr : inp}
                >
                  <option value="">Select Type</option>
                  {TXN_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </F>
              <F label="From Date" required error={errors.fromDate}>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setErrors((p) => ({ ...p, fromDate: undefined }));
                  }}
                  className={errors.fromDate ? inpErr : inp}
                />
              </F>
              <F label="To Date" required error={errors.toDate}>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setErrors((p) => ({ ...p, toDate: undefined }));
                  }}
                  className={errors.toDate ? inpErr : inp}
                />
              </F>
              <F label="Department">
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className={inp}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </F>
              <F label="Section">
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className={inp}
                >
                  {SECTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </F>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Results
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {displayed.length} invoices
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
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
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    placeholder="Filter results…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto" ref={tableRef}>
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {[
                      '#',
                      'Student Name',
                      'Invoice No.',
                      'Txn No',
                      'Student ID',
                      'Partner',
                      'Purpose',
                      'Date',
                      'Shift',
                      'Medium',
                      'Dept.',
                      'Prev. Class',
                      'Curr. Class',
                      'Section',
                      'Accountant',
                      'Phone',
                      'Roll',
                      'Reg. No',
                      'Amount',
                      'Discount',
                      'Total',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-3 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={22} className="px-5 py-12 text-center">
                        <FileText
                          size={36}
                          className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No invoices found for the selected period
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paged.map((inv, i) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-3 py-3.5 text-sm text-gray-400">
                          {(safePage - 1) * perPage + i + 1}
                        </td>
                        <td className="px-3 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                          {inv.studentName}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">
                            {inv.invoiceNo}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-400">
                          {inv.txnNo || '—'}
                        </td>
                        <td className="px-3 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">
                          {inv.studentID}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.partner}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">
                            {inv.purpose}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.date}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.shift}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.medium}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {inv.department}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                          {inv.prevClass}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.currentClass}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.section}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                          {inv.accountant}
                        </td>
                        <td className="px-3 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">
                          {inv.phone}
                        </td>
                        <td className="px-3 py-3.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                          {inv.roll}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                          {inv.regNo || '—'}
                        </td>
                        <td className="px-3 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          ৳{inv.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 text-xs text-orange-600 dark:text-orange-400">
                          {inv.discount > 0 ? `-৳${inv.discount}` : '—'}
                        </td>
                        <td className="px-3 py-3.5 text-sm font-bold text-green-700 dark:text-green-400">
                          ৳{inv.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewInvoice(inv)}
                              className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {displayed.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                      <td
                        colSpan={18}
                        className="px-3 py-3 text-xs font-bold text-gray-500 uppercase"
                      >
                        Grand Total ({displayed.length} invoices)
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                        ৳
                        {displayed
                          .reduce((s, i) => s + i.amount, 0)
                          .toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-orange-600">
                        -৳
                        {displayed
                          .reduce((s, i) => s + i.discount, 0)
                          .toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                        ৳
                        {displayed
                          .reduce((s, i) => s + i.total, 0)
                          .toLocaleString()}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  {displayed.length === 0 ? 0 : (safePage - 1) * perPage + 1}–
                  {Math.min(safePage * perPage, displayed.length)} of{' '}
                  {displayed.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    typeof p === 'string' ? (
                      <span
                        key={i}
                        className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {viewInvoice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewInvoice(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Eye size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Invoice Details
                  </span>
                  <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg">
                    {viewInvoice.invoiceNo}
                  </span>
                </div>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ['Student Name', viewInvoice.studentName],
                  ['Student ID', viewInvoice.studentID],
                  ['Phone', viewInvoice.phone],
                  ['Department', viewInvoice.department],
                  ['Class', viewInvoice.currentClass],
                  ['Section', viewInvoice.section],
                  ['Roll', viewInvoice.roll],
                  ['Date', viewInvoice.date],
                  ['Purpose', viewInvoice.purpose],
                  ['Accountant', viewInvoice.accountant],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {val}
                    </span>
                  </div>
                ))}
                <div className="pt-3 mt-2 grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Amount',
                      value: `৳${viewInvoice.amount.toLocaleString()}`,
                      cls: 'text-gray-700 dark:text-gray-300',
                    },
                    {
                      label: 'Discount',
                      value: `-৳${viewInvoice.discount.toLocaleString()}`,
                      cls: 'text-orange-600 dark:text-orange-400',
                    },
                    {
                      label: 'Total',
                      value: `৳${viewInvoice.total.toLocaleString()}`,
                      cls: 'text-green-700 dark:text-green-400',
                    },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 text-center"
                    >
                      <p className="text-xs text-gray-400 mb-1">{d.label}</p>
                      <p className={`text-base font-bold ${d.cls}`}>
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => setViewInvoice(null)}
                  className="px-5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
