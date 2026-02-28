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
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const students = [
  { name: 'Sharif Tahzeeb Al Adiat', studentId: '2414010030001', roll: '1202425033001', category: '-', payments: [1000, 1000, 1000, 1000, 500, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 11210], monthlyFee: 1000, totalUnpaid: 1200 },
  { name: 'SAHIDUL ISLAM FAHIM', studentId: '2414010030002', roll: '1202425033002', category: '-', payments: [1000, 500, 0, 1000, 400, 0, 0, 1000, 1000, 1000, 0, 1000, 13560], monthlyFee: 1000, totalUnpaid: 4000 },
  { name: 'MD. AFJAL HOSSAIN', studentId: '2414010030003', roll: '1202425033003', category: '-', payments: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21060], monthlyFee: 1000, totalUnpaid: 21060 },
];

const months = ['Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/30';

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

const PaymentCell = ({ amount, monthlyFee }) => {
  if (amount === 0)
    return <span className="inline-flex items-center justify-center w-full h-7 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold">0</span>;
  if (amount < monthlyFee)
    return <span className="inline-flex items-center justify-center w-full h-7 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">{amount}</span>;
  return <span className="inline-flex items-center justify-center w-full h-7 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold">{amount}</span>;
};

const StudentPaymentDetails = () => {
  const [filters, setFilters] = useState({ eduLevel: '', department: '', class: '', section: '', session: '' });
  const [showData, setShowData] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!filters.eduLevel) e.eduLevel = 'Required';
    if (!filters.class) e.class = 'Required';
    if (!filters.session) e.session = 'Required';
    return e;
  };

  const handleShow = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setShowData(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(13).text('Student Payment Details', 40, 40);
    doc.setFontSize(10).text(`Class: ${filters.class} | Section: ${filters.section} | Session: ${filters.session}`, 40, 58);
    autoTable(doc, {
      startY: 75,
      head: [['Name', 'Student ID', 'Roll', 'Category', ...months, 'Total Paid', 'Unpaid']],
      body: students.map((s) => [s.name, s.studentId, s.roll, s.category, ...s.payments, s.payments.reduce((a, b) => a + b, 0), s.totalUnpaid]),
      theme: 'grid',
      headStyles: { fillColor: '#D97706', textColor: '#fff', fontSize: 7 },
      styles: { fontSize: 7 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const data = students.map((s) => {
      const row = { Name: s.name, 'Student ID': s.studentId, Roll: s.roll, Category: s.category };
      months.forEach((m, i) => { row[m] = s.payments[i]; });
      row['Total Paid'] = s.payments.reduce((a, b) => a + b, 0);
      row['Total Unpaid'] = s.totalUnpaid;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Details');
    XLSX.writeFile(wb, 'Student_Payment_Details.xlsx');
  };

  const F = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{error}</p>}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Reports', 'Student Payment Details']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <GraduationCap size={22} className="text-amber-500" /> Student Payment Details
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30">
            <SlidersHorizontal size={15} className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Filter Settings</span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <F label="Education Level" required error={errors.eduLevel}>
              <select value={filters.eduLevel} onChange={(e) => { setFilters((p) => ({ ...p, eduLevel: e.target.value })); setErrors((p) => ({ ...p, eduLevel: undefined })); }} className={errors.eduLevel ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp}>
                <option value="">Select</option>
                <option>Higher Secondary</option>
                <option>Secondary</option>
              </select>
            </F>
            <F label="Department">
              <select value={filters.department} onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value }))} className={inp}>
                <option value="">All</option>
                <option>Science</option>
                <option>Arts</option>
                <option>Commerce</option>
              </select>
            </F>
            <F label="Class" required error={errors.class}>
              <select value={filters.class} onChange={(e) => { setFilters((p) => ({ ...p, class: e.target.value })); setErrors((p) => ({ ...p, class: undefined })); }} className={errors.class ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp}>
                <option value="">Select</option>
                <option>HSC-Science</option>
                <option>HSC-Arts</option>
                <option>SSC</option>
              </select>
            </F>
            <F label="Section">
              <select value={filters.section} onChange={(e) => setFilters((p) => ({ ...p, section: e.target.value }))} className={inp}>
                <option value="">All</option>
                <option>1st year</option>
                <option>2nd year</option>
              </select>
            </F>
            <F label="Session" required error={errors.session}>
              <select value={filters.session} onChange={(e) => { setFilters((p) => ({ ...p, session: e.target.value })); setErrors((p) => ({ ...p, session: undefined })); }} className={errors.session ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp}>
                <option value="">Select</option>
                <option>2024-2025</option>
                <option>2023-2024</option>
              </select>
            </F>
            <div className="col-span-2 sm:col-span-3 lg:col-span-5">
              <button onClick={handleShow} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm shadow-amber-200">
                <Search size={14} /> Show Report
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showData && (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Legend:</span>
            {[
              { Icon: CheckCircle2, label: 'Full Payment', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
              { Icon: MinusCircle, label: 'Partial Payment', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { Icon: XCircle, label: 'No Payment', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map(({ Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${bg}`}>
                <Icon size={13} className={color} />
                <span className={`text-xs font-medium ${color}`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Report Table */}
        {showData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Institute Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={26} className="text-amber-500" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">Student Payment Details</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filters.department && `Dept: ${filters.department} · `}
                  Class: {filters.class} · Section: {filters.section || 'All'} · Shift: Day · Session: {filters.session}
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

            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: `${200 + months.length * 70 + 160}px` }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sticky left-0 bg-gray-50 dark:bg-gray-700/50 whitespace-nowrap z-10">Student Name</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Student ID</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Roll</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cat.</th>
                    {months.map((m) => (
                      <th key={m} className="px-2 py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{m}</th>
                    ))}
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide whitespace-nowrap">Total Paid</th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide whitespace-nowrap">Unpaid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {students.map((student, idx) => {
                    const totalPaid = student.payments.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-800 whitespace-nowrap z-10">{student.name}</td>
                        <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{student.studentId}</span></td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">{student.roll}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 text-center">{student.category}</td>
                        {student.payments.map((amt, i) => (
                          <td key={i} className="px-2 py-3 text-center">
                            <PaymentCell amount={amt} monthlyFee={student.monthlyFee} />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right whitespace-nowrap">{totalPaid.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 text-right whitespace-nowrap">{student.totalUnpaid.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentPaymentDetails;