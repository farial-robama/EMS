import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  FileText,
  ChevronRight,
  Printer,
  Download,
  SlidersHorizontal,
  Search,
  GraduationCap,
  DollarSign,
  Hash,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const sampleData = [
  { id: 1, transactions: 12903, amount: 126344085, commission: 0.0 },
  { id: 2, transactions: 8421, amount: 65432100, commission: 0.0 },
];

const PARTNERS = ['Manual', 'bKash', 'Nagad', 'Rocket', 'Online'];

const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

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

const TransactionSummaryReport = () => {
  const [transactionType, setTransactionType] = useState('');
  const [partner, setPartner] = useState('');
  const [fromDate, setFromDate] = useState('2025-07-28');
  const [toDate, setToDate] = useState('2025-12-24');
  const [data, setData] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!fromDate) e.fromDate = 'Required';
    if (!toDate) e.toDate = 'Required';
    return e;
  };

  const handleShow = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setData(sampleData);
    setSearched(true);
  };

  const totalTransactions = useMemo(() => data.reduce((s, r) => s + r.transactions, 0), [data]);
  const totalAmount = useMemo(() => data.reduce((s, r) => s + r.amount, 0), [data]);
  const totalCommission = useMemo(() => data.reduce((s, r) => s + r.commission, 0), [data]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB');

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(14).text('Transaction Summary Report', 297, 40, { align: 'center' });
    doc.setFontSize(10).text(`${fmt(fromDate)} — ${fmt(toDate)}`, 297, 58, { align: 'center' });
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'No. of Transactions', 'Amount (৳)', 'Commission (৳)']],
      body: data.map((r, i) => [i + 1, r.transactions.toLocaleString(), formatMoney(r.amount), r.commission.toFixed(2)]),
      foot: [['', 'Total', formatMoney(totalAmount), totalCommission.toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: '#7C3AED', textColor: '#fff', fontSize: 10 },
      footStyles: { fillColor: '#F5F3FF', textColor: '#5B21B6', fontStyle: 'bold' },
      styles: { fontSize: 10 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((r, i) => ({
        SL: i + 1,
        'No. of Transactions': r.transactions,
        'Amount (৳)': r.amount,
        'Commission (৳)': r.commission,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TransactionSummary');
    XLSX.writeFile(wb, 'TransactionSummary.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Reports', 'Transaction Summary']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-violet-500" /> Transaction Summary Report
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30">
            <SlidersHorizontal size={15} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">Search Filters</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <F label="Transaction Type">
              <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className={inp}>
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </F>
            <F label="Transaction Partner">
              <select value={partner} onChange={(e) => setPartner(e.target.value)} className={inp}>
                <option value="">All Partners</option>
                {PARTNERS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </F>
            <F label="From Date" required error={errors.fromDate}>
              <input type="date" value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setErrors((p) => ({ ...p, fromDate: undefined })); }}
                className={errors.fromDate ? inpErr : inp} />
            </F>
            <F label="To Date" required error={errors.toDate}>
              <input type="date" value={toDate}
                onChange={(e) => { setToDate(e.target.value); setErrors((p) => ({ ...p, toDate: undefined })); }}
                className={errors.toDate ? inpErr : inp} />
            </F>
            <div className="sm:col-span-2 lg:col-span-4">
              <button onClick={handleShow}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm shadow-violet-200 dark:shadow-none">
                <Search size={14} /> Show Report
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Transactions', value: totalTransactions.toLocaleString(), bg: 'bg-violet-50 dark:bg-violet-900/20', ic: 'bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-300', Icon: Hash },
                { label: 'Total Amount', value: `৳${formatMoney(totalAmount)}`, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: DollarSign },
                { label: 'Total Commission', value: `৳${totalCommission.toFixed(2)}`, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: TrendingUp },
              ].map(({ label, value, bg, ic, Icon }) => (
                <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${bg}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}><Icon size={16} /></div>
                  <div>
                    <div className="text-base font-bold text-gray-800 dark:text-white leading-none">{value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Institute Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={26} className="text-violet-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                  <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-0.5">Transaction Summary</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    From: {fmt(fromDate)} &nbsp;|&nbsp; To: {fmt(toDate)}
                    {transactionType && ` · ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`}
                    {partner && ` · ${partner}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors">
                    <Printer size={13} /> PDF
                  </button>
                  <button onClick={handleExcel} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors">
                    <Download size={13} /> Excel
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {['SL', 'No. of Transactions', 'Amount (৳)', 'Commission (৳)'].map((h) => (
                        <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'SL' ? 'text-left' : 'text-right'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {data.map((row, i) => (
                      <tr key={row.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                          {row.transactions.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                          ৳{formatMoney(row.amount)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                          ৳{row.commission.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-violet-50/50 dark:bg-violet-900/10 border-t-2 border-violet-200 dark:border-violet-900/30">
                      <td className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Total</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-violet-700 dark:text-violet-400 text-right">
                        {totalTransactions.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                        ৳{formatMoney(totalAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">
                        ৳{totalCommission.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionSummaryReport;