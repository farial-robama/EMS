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
  Users,
  ChevronLeft,
  Wifi,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['2026', '2025', '2024', '2023'];
const PAGE_SIZES = [10, 25, 50];

const onlinePayments = [
  { sl: 1, paymentDate: 'August, 2025', amount: 500, name: 'Arif Hossain', studentId: '24150010011', roll: '120245001001', className: 'HSC-Science', section: '1st Year', session: '2024-2025', txnId: 'TXN983746' },
  { sl: 2, paymentDate: 'August, 2025', amount: 1200, name: 'Nasrin Akter', studentId: '24150010022', roll: '120245001002', className: 'HSC-Arts', section: '2nd Year', session: '2024-2025', txnId: 'TXN983747' },
  { sl: 3, paymentDate: 'August, 2025', amount: 800, name: 'Md. Rakib Hasan', studentId: '24150010033', roll: '120245001003', className: 'HSC-Science', section: '1st Year', session: '2024-2025', txnId: 'TXN983748' },
  { sl: 4, paymentDate: 'August, 2025', amount: 1000, name: 'Fatema Begum', studentId: '24150010044', roll: '120245001004', className: 'SSC', section: '10th Grade', session: '2024-2025', txnId: 'TXN983749' },
  { sl: 5, paymentDate: 'September, 2025', amount: 1500, name: 'Karim Uddin', studentId: '24150010055', roll: '120245001005', className: 'HSC-Commerce', section: '2nd Year', session: '2024-2025', txnId: 'TXN984001' },
];

const formatMoney = (n) => Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/30';

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

const OnlinePaymentList = () => {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('August');
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() =>
    onlinePayments.filter(
      (p) =>
        p.paymentDate.includes(month) &&
        p.paymentDate.includes(year) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.studentId.includes(search) ||
          p.txnId.toLowerCase().includes(search.toLowerCase()))
    ),
    [month, year, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalAmount = useMemo(() => filtered.reduce((s, p) => s + p.amount, 0), [filtered]);

  const handleSearch = () => {
    setPage(1);
    setSearched(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Online Payment List', 40, 40);
    doc.setFontSize(10).text(`${month}, ${year}`, 40, 58);
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Payment Date', 'Paid Amount', 'Student Name', 'Student ID', 'Roll', 'Class', 'Section', 'Session', 'Txn ID']],
      body: filtered.map((p) => [p.sl, p.paymentDate, formatMoney(p.amount), p.name, p.studentId, p.roll, p.className, p.section, p.session, p.txnId]),
      theme: 'grid',
      headStyles: { fillColor: '#0D9488', textColor: '#fff', fontSize: 9 },
      styles: { fontSize: 9 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        SL: p.sl, 'Payment Date': p.paymentDate, 'Paid Amount (৳)': p.amount,
        'Student Name': p.name, 'Student ID': p.studentId, Roll: p.roll,
        Class: p.className, Section: p.section, Session: p.session, 'Txn ID': p.txnId,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Online Payments');
    XLSX.writeFile(wb, `Online_Payment_List_${month}_${year}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Reports', 'Online Payment List']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Wifi size={22} className="text-teal-500" /> Online Payment List
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-teal-50 dark:bg-teal-900/10 border-b border-teal-100 dark:border-teal-900/30">
            <SlidersHorizontal size={15} className="text-teal-500" />
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Report Settings</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inp}>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Month</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className={inp}>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-200 dark:shadow-none"
              >
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
                { label: 'Total Payments', value: filtered.length, bg: 'bg-teal-50 dark:bg-teal-900/20', ic: 'bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300', Icon: Users },
                { label: 'Total Collected', value: `৳${formatMoney(totalAmount)}`, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: DollarSign },
                { label: 'Period', value: `${month}, ${year}`, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: FileText },
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

            {/* Table Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Institute Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-teal-50 to-white dark:from-teal-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={26} className="text-teal-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">Online Payment List</p>
                  <p className="text-xs text-gray-400 mt-0.5">{month}, {year}</p>
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

              {/* Search + Page Size Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  Show
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-teal-400">
                    {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  entries
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, ID, Txn..." className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      {['SL', 'Payment Date', 'Paid Amount', 'Student Name', 'Student ID', 'Roll', 'Class', 'Section', 'Session', 'Txn ID'].map((h) => (
                        <th key={h} className={`px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Paid Amount' ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-5 py-14 text-center">
                          <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No online payments found for {month}, {year}</p>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((p) => (
                        <tr key={p.sl} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3.5 text-sm text-gray-400">{p.sl}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.paymentDate}</td>
                          <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(p.amount)}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.name}</td>
                          <td className="px-4 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{p.studentId}</span></td>
                          <td className="px-4 py-3.5 text-xs font-mono text-gray-500">{p.roll}</td>
                          <td className="px-4 py-3.5"><span className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-lg whitespace-nowrap">{p.className}</span></td>
                          <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.section}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{p.session}</td>
                          <td className="px-4 py-3.5"><span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg">{p.txnId}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {filtered.length > 0 && (
                    <tfoot>
                      <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                        <td colSpan={2} className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase">Grand Total</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(totalAmount)}</td>
                        <td colSpan={7} />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${page === p ? 'bg-teal-600 text-white border border-teal-600' : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OnlinePaymentList;