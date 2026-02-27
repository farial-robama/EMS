// ─────────────────────────────────────────────────────────────
// InvoiceListDetails.jsx
// ─────────────────────────────────────────────────────────────
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
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  Users,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const sampleInvoices = [
  {
    id: 1,
    shift: 'Day',
    studentName: 'SHAH NEWAZ KHAN LISUN',
    invoiceNo: 'INC-00013035',
    txnNo: '',
    studentID: '2514010030068',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '22-12-2025',
    prevClass: 'HSC-Science',
    prevRoll: '1202526033051',
    currentClass: 'HSC-Science',
    currentRoll: '1202526033051',
    section: '1st Year',
    roll: '1202526033051',
    regNo: '2210619562',
    amount: 2000,
    discount: 0,
    total: 2000,
  },
  {
    id: 2,
    shift: 'Day',
    studentName: 'Kawser Ahmed Emon',
    invoiceNo: 'INC-00013031',
    txnNo: '',
    studentID: '2316110190091',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '22-12-2025',
    prevClass: 'English-(Honours)',
    prevRoll: '2202324110096',
    currentClass: 'English-(Honours)',
    currentRoll: '2202324110096',
    section: '2nd Year',
    roll: '2202324110096',
    regNo: '',
    amount: 11300,
    discount: 0,
    total: 11300,
  },
  {
    id: 3,
    shift: 'Day',
    studentName: 'SHAH NEWAZ KHAN LISUN',
    invoiceNo: 'INC-00013036',
    txnNo: '',
    studentID: '2514010030068',
    partner: 'Manual',
    purpose: 'Library Fee',
    date: '23-12-2025',
    prevClass: 'HSC-Science',
    prevRoll: '1202526033051',
    currentClass: 'HSC-Science',
    currentRoll: '1202526033051',
    section: '1st Year',
    roll: '1202526033051',
    regNo: '2210619562',
    amount: 500,
    discount: 0,
    total: 500,
  },
  {
    id: 4,
    shift: 'Day',
    studentName: 'Kawser Ahmed Emon',
    invoiceNo: 'INC-00013032',
    txnNo: '',
    studentID: '2316110190091',
    partner: 'Manual',
    purpose: 'Exam Fee',
    date: '23-12-2025',
    prevClass: 'English-(Honours)',
    prevRoll: '2202324110096',
    currentClass: 'English-(Honours)',
    currentRoll: '2202324110096',
    section: '2nd Year',
    roll: '2202324110096',
    regNo: '',
    amount: 2000,
    discount: 0,
    total: 2000,
  },
  {
    id: 5,
    shift: 'Day',
    studentName: 'Rafiq Islam',
    invoiceNo: 'INC-00013033',
    txnNo: '',
    studentID: '2416110190077',
    partner: 'Manual',
    purpose: 'Accounts',
    date: '22-12-2025',
    prevClass: 'HSC-Arts',
    prevRoll: '2202324110055',
    currentClass: 'HSC-Arts',
    currentRoll: '2202324110055',
    section: '2nd Year',
    roll: '2202324110055',
    regNo: '',
    amount: 8000,
    discount: 0,
    total: 8000,
  },
];

const TXN_TYPES = ['Income', 'Expense'];
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

export function InvoiceListDetails() {
  const [txnType, setTxnType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});
  const [collapsed, setCollapsed] = useState({});

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
      return invDate >= new Date(fromDate) && invDate <= new Date(toDate);
    });
    setResults(filtered);
    setSearched(true);
  };

  const handleDelete = (id) => setResults((p) => p.filter((i) => i.id !== id));

  const grouped = useMemo(() => {
    const g = {};
    results.forEach((inv) => {
      if (!g[inv.studentName]) g[inv.studentName] = [];
      g[inv.studentName].push(inv);
    });
    return g;
  }, [results]);

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Details');
    XLSX.writeFile(wb, 'InvoiceListDetails.xlsx');
  };

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Student-wise Collection Summary', 40, 40);
    doc.setFontSize(10).text(`${fromDate} — ${toDate}`, 40, 58);
    let startY = 80;
    Object.entries(grouped).forEach(([student, invs]) => {
      doc.setFontSize(12).setTextColor('#1D4ED8').text(student, 40, startY);
      autoTable(doc, {
        startY: startY + 10,
        head: [
          ['#', 'Invoice', 'Purpose', 'Date', 'Amount', 'Discount', 'Total'],
        ],
        body: invs.map((inv, i) => [
          i + 1,
          inv.invoiceNo,
          inv.purpose,
          inv.date,
          inv.amount,
          inv.discount,
          inv.total,
        ]),
        theme: 'grid',
        headStyles: { fillColor: '#2563EB', textColor: '#fff', fontSize: 9 },
        styles: { fontSize: 9 },
        didDrawPage: (d) => {
          startY = d.cursor.y + 20;
        },
      });
      startY += 15;
    });
    window.open(doc.output('bloburl'));
  };

  const grandTotal = results.reduce((s, i) => s + i.total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Invoice List Details']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-indigo-500" /> Invoice List
            (Student-wise)
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            <SlidersHorizontal size={15} className="text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              Search Filters
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="sm:col-span-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-200"
              >
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Student-wise Summary
                </span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  {Object.keys(grouped).length} students
                </span>
              </div>
              <div className="flex gap-2">
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

            {results.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-14 text-center">
                <FileText
                  size={36}
                  className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No invoices found for the selected period
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([student, invs]) => {
                const total = invs.reduce((s, i) => s + i.total, 0);
                const isOpen = !collapsed[student];
                return (
                  <div
                    key={student}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() =>
                        setCollapsed((p) => ({ ...p, [student]: !p[student] }))
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Users
                            size={15}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            {student}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {invs[0].studentID} · {invs.length} invoice
                            {invs.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                          ৳{total.toLocaleString()}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px]">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                              {[
                                '#',
                                'Shift',
                                'Invoice No.',
                                'Txn No',
                                'Partner',
                                'Purpose',
                                'Date',
                                'Prev. Class',
                                'Prev. Roll',
                                'Curr. Class',
                                'Curr. Roll',
                                'Section',
                                'Roll',
                                'Reg. No',
                                'Amount',
                                'Discount',
                                'Total',
                                'Action',
                              ].map((h) => (
                                <th
                                  key={h}
                                  className={`px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Action' ? 'text-right pr-5' : ''}`}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {invs.map((inv, i) => (
                              <tr
                                key={inv.id}
                                className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                              >
                                <td className="px-3 py-3 text-sm text-gray-400">
                                  {i + 1}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {inv.shift}
                                </td>
                                <td className="px-3 py-3">
                                  <span className="font-mono text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg">
                                    {inv.invoiceNo}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-400">
                                  {inv.txnNo || '—'}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {inv.partner}
                                </td>
                                <td className="px-3 py-3">
                                  <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">
                                    {inv.purpose}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {inv.date}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                                  {inv.prevClass}
                                </td>
                                <td className="px-3 py-3 text-xs font-mono text-gray-500">
                                  {inv.prevRoll}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {inv.currentClass}
                                </td>
                                <td className="px-3 py-3 text-xs font-mono text-gray-500">
                                  {inv.currentRoll}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {inv.section}
                                </td>
                                <td className="px-3 py-3 text-xs font-mono text-gray-500">
                                  {inv.roll}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-500">
                                  {inv.regNo || '—'}
                                </td>
                                <td className="px-3 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  ৳{inv.amount.toLocaleString()}
                                </td>
                                <td className="px-3 py-3 text-xs text-orange-600">
                                  {inv.discount > 0 ? `-৳${inv.discount}` : '—'}
                                </td>
                                <td className="px-3 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                                  ৳{inv.total.toLocaleString()}
                                </td>
                                <td className="px-3 py-3 pr-5">
                                  <button
                                    onClick={() => handleDelete(inv.id)}
                                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900 ml-auto"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-indigo-50/50 dark:bg-indigo-900/10 border-t border-indigo-100 dark:border-indigo-900/30">
                              <td
                                colSpan={16}
                                className="px-3 py-3 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                              >
                                Subtotal — {invs.length} invoice
                                {invs.length !== 1 ? 's' : ''}
                              </td>
                              <td className="px-3 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                                ৳{total.toLocaleString()}
                              </td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {results.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                  Grand Total
                </span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─────────────────────────────────────────────────────────────
// TotalCollectionReport.jsx (MonthlyFeeReport)
// ─────────────────────────────────────────────────────────────
const monthlyData = [
  {
    month: 'August, 2025',
    manualQty: 3337,
    onlineQty: 0,
    manualAmount: 42006075,
    onlineAmount: 0,
  },
  {
    month: 'September, 2025',
    manualQty: 4442,
    onlineQty: 0,
    manualAmount: 43851885,
    onlineAmount: 0,
  },
  {
    month: 'October, 2025',
    manualQty: 1915,
    onlineQty: 0,
    manualAmount: 13361210,
    onlineAmount: 0,
  },
  {
    month: 'November, 2025',
    manualQty: 2166,
    onlineQty: 0,
    manualAmount: 18436835,
    onlineAmount: 0,
  },
  {
    month: 'December, 2025',
    manualQty: 1026,
    onlineQty: 0,
    manualAmount: 9861550,
    onlineAmount: 0,
  },
];

export function TotalCollectionReport() {
  const [reportType, setReportType] = useState('');
  const [year, setYear] = useState('2025');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef();

  const totals = {
    manualQty: monthlyData.reduce((s, r) => s + r.manualQty, 0),
    onlineQty: monthlyData.reduce((s, r) => s + r.onlineQty, 0),
    manualAmount: monthlyData.reduce((s, r) => s + r.manualAmount, 0),
    onlineAmount: monthlyData.reduce((s, r) => s + r.onlineAmount, 0),
    total: monthlyData.reduce((s, r) => s + r.manualAmount + r.onlineAmount, 0),
  };

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc
      .setFontSize(14)
      .text('Total Collection Report', 297, 40, { align: 'center' });
    doc.setFontSize(10).text(`Year: ${year}`, 297, 58, { align: 'center' });
    autoTable(doc, {
      startY: 80,
      head: [
        [
          'Month',
          'Manual Qty',
          'Online Qty',
          'Manual Amount',
          'Online Amount',
          'Total',
        ],
      ],
      body: monthlyData.map((r) => [
        r.month,
        r.manualQty,
        r.onlineQty,
        r.manualAmount.toFixed(2),
        r.onlineAmount.toFixed(2),
        (r.manualAmount + r.onlineAmount).toFixed(2),
      ]),
      theme: 'grid',
      headStyles: { fillColor: '#2563EB', textColor: '#fff' },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const data = monthlyData.map((r) => ({
      Month: r.month,
      'Manual Qty': r.manualQty,
      'Online Qty': r.onlineQty,
      'Manual Amount': r.manualAmount,
      'Online Amount': r.onlineAmount,
      Total: r.manualAmount + r.onlineAmount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collection');
    XLSX.writeFile(wb, 'Total_Collection_Report.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Total Collection Report']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-green-500" /> Total Collection
            Report
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Manual Qty',
              value: totals.manualQty.toLocaleString(),
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Total Online Qty',
              value: totals.onlineQty.toLocaleString(),
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
            },
            {
              label: 'Manual Amount',
              value: `৳${totals.manualAmount.toLocaleString()}`,
              bg: 'bg-amber-50 dark:bg-amber-900/20',
              ic: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300',
            },
            {
              label: 'Grand Total',
              value: `৳${totals.total.toLocaleString()}`,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <FileText size={16} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30">
            <SlidersHorizontal size={15} className="text-green-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Report Settings
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className={inp}
              >
                <option value="">Select</option>
                <option value="yearly">Yearly</option>
                <option value="dateRange">Date Range</option>
              </select>
            </div>
            {reportType === 'yearly' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inp}
                >
                  {['2025', '2024', '2023'].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
            {reportType === 'dateRange' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inp}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inp}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Report Table */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          ref={reportRef}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Monthly Breakdown
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Year: {year}
              </p>
            </div>
            <div className="flex gap-2">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th
                    rowSpan={2}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-r border-gray-100 dark:border-gray-700"
                  >
                    Month
                  </th>
                  <th
                    colSpan={2}
                    className="px-5 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-r border-gray-100 dark:border-gray-700 border-b border-gray-100 dark:border-gray-700"
                  >
                    Quantity
                  </th>
                  <th
                    colSpan={3}
                    className="px-5 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Amount (৳)
                  </th>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['Manual', 'Online', 'Manual', 'Online', 'Total'].map(
                    (h, i) => (
                      <th
                        key={i}
                        className={`px-5 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${i === 1 ? 'border-r border-gray-100 dark:border-gray-700' : ''}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {monthlyData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 border-r border-gray-100 dark:border-gray-700">
                      {row.month}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {row.manualQty.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700">
                      {row.onlineQty.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {row.manualAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {row.onlineAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400">
                      {(row.manualAmount + row.onlineAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600">
                  <td className="px-5 py-3 text-xs font-bold text-gray-500 uppercase border-r border-gray-100 dark:border-gray-700">
                    Grand Total
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totals.manualQty.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700">
                    {totals.onlineQty.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totals.manualAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {totals.onlineAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                    {totals.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InvoiceListDetails;
