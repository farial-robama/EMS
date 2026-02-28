import React, { useMemo, useState } from 'react';
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
  Users,
  DollarSign,
  Search,
  ChevronLeft,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const candidatesData = [
  { sl: 1, studentCode: '2415710450039', studentName: 'Nahid Hasan Ripon', department: 'Bachelor of Arts (B.A.)', admissionRoll: '2000072', contact: '01345188508', regNo: '1715560063', roll: '4202425612539', session: '2024-2025', txnId: '', txnDate: '2025-11-16 14:55:35', amount: 8470 },
  { sl: 2, studentCode: '2415710450009', studentName: 'Sayed Jalal', department: 'Bachelor of Arts (B.A.)', admissionRoll: '2004871', contact: '01961664482', regNo: '2600925731', roll: '4202425612509', session: '2024-2025', txnId: '', txnDate: '2025-11-10 12:30:25', amount: 8470 },
  { sl: 3, studentCode: '2415730510015', studentName: 'Imran Hossen', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '2025558', contact: '01762122765', regNo: '1815694339', roll: '4202425623015', session: '2024-2025', txnId: '', txnDate: '2025-11-16 12:48:58', amount: 8470 },
  { sl: 4, studentCode: '2415730510013', studentName: 'Md. Ibrahim', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '4020960', contact: '01781421320', regNo: '1911307170', roll: '4202425623013', session: '2024-2025', txnId: '', txnDate: '2025-11-16 12:03:48', amount: 8470 },
  { sl: 5, studentCode: '2415720450011', studentName: 'Fatema Khatun', department: 'Bachelor of Social Science (B.S.S)', admissionRoll: '3010567', contact: '01823456789', regNo: '2012345678', roll: '4202425634011', session: '2024-2025', txnId: 'TXN002', txnDate: '2025-11-17 10:00:00', amount: 8470 },
  { sl: 6, studentCode: '2415720450019', studentName: 'Rahim Uddin', department: 'Bachelor of Social Science (B.S.S)', admissionRoll: '3010901', contact: '01934567890', regNo: '2112345000', roll: '4202425634019', session: '2024-2025', txnId: '', txnDate: '2025-11-18 09:30:10', amount: 8470 },
];

const formatMoney = (amount) =>
  Number(amount).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAGE_SIZES = [10, 25, 50];

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

const AdmissionPaymentSummaryTotalView = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const printingDate = new Date().toLocaleDateString('en-GB');

  const filtered = useMemo(() =>
    candidatesData.filter(
      (r) =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentCode.includes(search) ||
        r.department.toLowerCase().includes(search.toLowerCase()) ||
        r.admissionRoll.includes(search)
    ),
    [search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalAmount = useMemo(() => candidatesData.reduce((s, r) => s + r.amount, 0), []);
  const departments = useMemo(() => [...new Set(candidatesData.map((r) => r.department))], []);

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('All Candidates Payment Summary', 40, 40);
    doc.setFontSize(10).text(`Printing Date: ${printingDate}`, 40, 58);
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Student Code', 'Name', 'Department', 'Adm. Roll', 'Contact', 'Reg No', 'Roll', 'Session', 'Txn ID', 'Txn Date', 'Amount']],
      body: candidatesData.map((r) => [r.sl, r.studentCode, r.studentName, r.department, r.admissionRoll, r.contact, r.regNo, r.roll, r.session, r.txnId || '—', r.txnDate, formatMoney(r.amount)]),
      theme: 'grid',
      headStyles: { fillColor: '#059669', textColor: '#fff', fontSize: 8 },
      styles: { fontSize: 8 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      candidatesData.map((r) => ({
        SL: r.sl, 'Student Code': r.studentCode, 'Student Name': r.studentName, Department: r.department,
        'Admission Roll': r.admissionRoll, 'Contact No': r.contact, 'Reg No': r.regNo, Roll: r.roll,
        Session: r.session, 'Txn ID': r.txnId, 'Txn Date': r.txnDate, 'Amount (৳)': r.amount,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Candidates');
    XLSX.writeFile(wb, 'Admission_Payment_Total_View.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Admission Payment', 'Payment Summary', 'Total View']} />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users size={22} className="text-green-500" /> All Candidates Payment View
            </h1>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <ArrowLeft size={13} /> Back
              </button>
              <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors">
                <Printer size={13} /> PDF
              </button>
              <button onClick={handleExcel} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors">
                <Download size={13} /> Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Candidates', value: candidatesData.length, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: Users },
            { label: 'Departments', value: departments.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: GraduationCap },
            { label: 'Total Collected', value: `৳${formatMoney(totalAmount)}`, bg: 'bg-amber-50 dark:bg-amber-900/20', ic: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300', Icon: DollarSign },
            { label: 'Printing Date', value: printingDate, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: FileText },
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

        {/* Main Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Institute Header */}
          <div className="flex flex-col items-center py-5 px-5 bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <GraduationCap size={24} className="text-green-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
            <p className="text-xs text-gray-400 mt-0.5">College Code: 0 &nbsp;|&nbsp; Printing Date: {printingDate}</p>
            <div className="mt-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                Degree Admission | Session 2024–2025 (BA • BSS • BBS)
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Show
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-400"
              >
                {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
              entries
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search candidates..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['SL.', 'Student Code', 'Student Name', 'Department', 'Adm. Roll', 'Contact No', 'Reg No', 'Roll', 'Session', 'Txn. ID', 'Txn. Date', 'Amount (৳)'].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Amount (৳)' ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-14 text-center">
                      <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No candidates found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((row) => (
                    <tr key={row.sl} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-400">{row.sl}</td>
                      <td className="px-4 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">{row.studentCode}</span></td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.studentName}</td>
                      <td className="px-4 py-3.5"><span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-lg">{row.department}</span></td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">{row.admissionRoll}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{row.contact}</td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-500">{row.regNo}</td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-500">{row.roll}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{row.session}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">{row.txnId || '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{row.txnDate}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(row.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                  <td colSpan={11} className="px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 text-right">Total Amount</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${page === p ? 'bg-green-600 text-white border border-green-600' : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-green-50 hover:border-green-300 hover:text-green-600'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdmissionPaymentSummaryTotalView;