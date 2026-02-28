import React, { useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Hash,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const candidateData = [
  { sl: 1, studentCode: '2415730510015', name: 'Imran Hossen', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '2025558', contact: '01762122765', regNo: '1815694339', roll: '4202425623015', session: '2024-2025', txnId: '', txnDate: '2025-11-16 12:48:58', amount: 8470 },
  { sl: 2, studentCode: '2415730510013', name: 'Md. Ibrahim', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '4020960', contact: '01781421320', regNo: '1911307170', roll: '4202425623013', session: '2024-2025', txnId: '', txnDate: '2025-11-16 12:03:48', amount: 8470 },
  { sl: 3, studentCode: '2415730510022', name: 'Rina Begum', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '3045123', contact: '01900123456', regNo: '2011234567', roll: '4202425623022', session: '2024-2025', txnId: 'TXN001', txnDate: '2025-11-17 09:15:00', amount: 8470 },
  { sl: 4, studentCode: '2415730510031', name: 'Karim Molla', department: 'Bachelor of Business Studies (BBS)', admissionRoll: '5067891', contact: '01712345678', regNo: '2112345678', roll: '4202425623031', session: '2024-2025', txnId: '', txnDate: '2025-11-17 11:20:30', amount: 8470 },
];

const formatMoney = (amount) =>
  Number(amount).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const AdmissionPaymentSummaryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const totalAmount = useMemo(() => candidateData.reduce((s, r) => s + r.amount, 0), []);
  const printingDate = new Date().toLocaleDateString('en-GB');

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Department-wise Candidate Payment Details', 40, 40);
    doc.setFontSize(10).text(`Printing Date: ${printingDate}`, 40, 58);
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Student Code', 'Name', 'Department', 'Adm. Roll', 'Contact', 'Reg No', 'Roll', 'Session', 'Txn ID', 'Txn Date', 'Amount']],
      body: candidateData.map((r) => [r.sl, r.studentCode, r.name, r.department, r.admissionRoll, r.contact, r.regNo, r.roll, r.session, r.txnId || '—', r.txnDate, `${formatMoney(r.amount)}`]),
      theme: 'grid',
      headStyles: { fillColor: '#4F46E5', textColor: '#fff', fontSize: 8 },
      styles: { fontSize: 8 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      candidateData.map((r) => ({
        SL: r.sl, 'Student Code': r.studentCode, Name: r.name, Department: r.department,
        'Admission Roll': r.admissionRoll, Contact: r.contact, 'Reg No': r.regNo, Roll: r.roll,
        Session: r.session, 'Txn ID': r.txnId, 'Txn Date': r.txnDate, 'Amount (৳)': r.amount,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
    XLSX.writeFile(wb, `Department_Payment_View_${id}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Admission Payment', 'Payment Summary', 'Department View']} />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users size={22} className="text-purple-500" /> Department-wise Candidate Details
            </h1>
            <div className="flex gap-2">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Candidates', value: candidateData.length, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: Users },
            { label: 'Total Amount', value: `৳${formatMoney(totalAmount)}`, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: DollarSign },
            { label: 'Printing Date', value: printingDate, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Hash },
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

        {/* Institute Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center py-5 px-5 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <GraduationCap size={24} className="text-purple-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
            <p className="text-xs text-gray-400 mt-0.5">College Code: 0 &nbsp;|&nbsp; Printing Date: {printingDate}</p>
            <div className="mt-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                Degree Admission | Session 2024–2025 (BA • BSS • BBS)
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" ref={printRef}>
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
                {candidateData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-14 text-center">
                      <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Data was not found!</p>
                    </td>
                  </tr>
                ) : (
                  candidateData.map((row) => (
                    <tr key={row.sl} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-400">{row.sl}</td>
                      <td className="px-4 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">{row.studentCode}</span></td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3.5"><span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">{row.department}</span></td>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdmissionPaymentSummaryView;