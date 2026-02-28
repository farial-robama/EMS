import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileText,
  ChevronRight,
  Printer,
  Eye,
  X,
  SlidersHorizontal,
  Search,
  GraduationCap,
  CreditCard,
  DollarSign,
  Clock,
  AlertCircle,
  Receipt,
  User,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const payments = [
  { id: 1, invoice: 'INC-00008412', mode: 'Manual', txnId: '', date: '19-10-2025 10:21:00 AM', amount: 3000 },
  { id: 2, invoice: 'INC-00000495', mode: 'Manual', txnId: '', date: '20-08-2025 10:13:00 AM', amount: 8210 },
];

const studentInfo = {
  name: 'Sharif Tahzeeb Al Adiat',
  id: '2414010030001',
  roll: '1202425033001',
  shift: 'Day',
  medium: 'Bangla',
  group: 'Science',
  class: 'HSC-Science',
  section: '2nd year',
  session: '2024-2025',
  dueAmount: 6000,
  reportTime: '24-Dec-2025 09:28 PM',
};

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30';

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

const StudentPaymentHistories = () => {
  const [filters, setFilters] = useState({ name: '', studentId: '2414010030001', roll: '', class: '', session: '', paymentMode: '', invoice: '', fatherName: '', fatherContact: '' });
  const [showReport, setShowReport] = useState(false);
  const [viewPayment, setViewPayment] = useState(null);
  const [errors, setErrors] = useState({});
  const printRef = useRef();

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);

  const validate = () => {
    const e = {};
    if (!filters.studentId && !filters.name) e.studentId = 'Student ID or Name required';
    return e;
  };

  const handleShow = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setShowReport(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(14).text('Fee Payment Details Report', 297, 40, { align: 'center' });
    doc.setFontSize(10).text(`${studentInfo.name} | ID: ${studentInfo.id}`, 297, 58, { align: 'center' });
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Invoice No.', 'Payment Mode', 'Txn. ID', 'Date', 'Amount', 'Total']],
      body: payments.map((p, i) => [i + 1, p.invoice, p.mode, p.txnId || '—', p.date, p.amount, p.amount.toFixed(2)]),
      theme: 'grid',
      headStyles: { fillColor: '#7C3AED', textColor: '#fff', fontSize: 9 },
      styles: { fontSize: 9 },
    });
    window.open(doc.output('bloburl'));
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=650');
    win.document.write(`<html><head><title>Payment History</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#7C3AED;color:#fff}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Reports', 'Student Payment Histories']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CreditCard size={22} className="text-purple-500" /> Student Payment Histories
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
            <SlidersHorizontal size={15} className="text-purple-500" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Search Filters</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'name', label: 'Student Name (English)', placeholder: 'Student Name' },
              { key: 'studentId', label: 'Student ID', placeholder: 'e.g. 2414010030001', required: true },
              { key: 'roll', label: 'Class Roll', placeholder: 'Class Roll' },
            ].map(({ key, label, placeholder, required }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input value={filters[key]} onChange={(e) => { setFilters((p) => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined })); }}
                  placeholder={placeholder} className={errors[key] ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp} />
                {errors[key] && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{errors[key]}</p>}
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Class</label>
              <select value={filters.class} onChange={(e) => setFilters((p) => ({ ...p, class: e.target.value }))} className={inp}>
                <option value="">Select Class</option>
                <option>HSC-Science</option>
                <option>HSC-Arts</option>
                <option>SSC</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Session</label>
              <select value={filters.session} onChange={(e) => setFilters((p) => ({ ...p, session: e.target.value }))} className={inp}>
                <option value="">Select Session</option>
                <option>2024-2025</option>
                <option>2023-2024</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Payment Mode</label>
              <select value={filters.paymentMode} onChange={(e) => setFilters((p) => ({ ...p, paymentMode: e.target.value }))} className={inp}>
                <option value="">All Modes</option>
                <option>Manual</option>
                <option>bKash</option>
                <option>Nagad</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Invoice No.</label>
              <input value={filters.invoice} onChange={(e) => setFilters((p) => ({ ...p, invoice: e.target.value }))} placeholder="Invoice No." className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Father's Name</label>
              <input value={filters.fatherName} onChange={(e) => setFilters((p) => ({ ...p, fatherName: e.target.value }))} placeholder="Father's Name" className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Father's Contact No</label>
              <input value={filters.fatherContact} onChange={(e) => setFilters((p) => ({ ...p, fatherContact: e.target.value }))} placeholder="Father's Contact" className={inp} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <button onClick={handleShow} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-sm shadow-purple-200">
                <Search size={14} /> Show Report
              </button>
            </div>
          </div>
        </div>

        {/* Report */}
        {showReport && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Student Info Header */}
            <div className="px-5 py-5 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <User size={26} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-gray-800 dark:text-white">{studentInfo.name}</h2>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-semibold">
                      {studentInfo.class}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ID: {studentInfo.id} &nbsp;·&nbsp; Roll: {studentInfo.roll} &nbsp;·&nbsp; Shift: {studentInfo.shift} &nbsp;·&nbsp;
                    Medium: {studentInfo.medium} &nbsp;·&nbsp; Group: {studentInfo.group} &nbsp;·&nbsp;
                    Section: {studentInfo.section} &nbsp;·&nbsp; Session: {studentInfo.session}
                  </p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                      <DollarSign size={12} /> Total Due: ৳{studentInfo.dueAmount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={12} /> Generated: {studentInfo.reportTime}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                    <Printer size={13} /> Print
                  </button>
                  <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors">
                    <FileText size={13} /> PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto" ref={printRef}>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['SL', 'Invoice No.', 'Payment Mode', 'Txn. ID', 'Date', 'Amount (৳)', 'Total (৳)', 'Action'].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Action' ? 'text-center' : h.includes('৳') ? 'text-right' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {payments.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">{p.invoice}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg">{p.mode}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{p.txnId || '—'}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.date}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">{p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">{p.amount.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => setViewPayment(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors">
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                    <td colSpan={5} className="px-5 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200">Total</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">{totalAmount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">{totalAmount.toFixed(2)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {viewPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-purple-500" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">Payment Details</span>
              </div>
              <button onClick={() => setViewPayment(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-5 space-y-3">
              {[
                { label: 'Invoice No.', value: viewPayment.invoice, mono: true },
                { label: 'Payment Mode', value: viewPayment.mode },
                { label: 'Transaction ID', value: viewPayment.txnId || '—', mono: true },
                { label: 'Date & Time', value: viewPayment.date },
                { label: 'Amount', value: `৳${viewPayment.amount.toLocaleString()}`, bold: true, green: true },
              ].map(({ label, value, mono, bold, green }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
                  <span className={`text-sm ${mono ? 'font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300' : ''} ${bold ? 'font-bold' : ''} ${green ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setViewPayment(null)} className="w-full py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentPaymentHistories;