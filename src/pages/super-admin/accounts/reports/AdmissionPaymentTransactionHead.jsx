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
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const paymentListData = [
  { sl: 1, studentName: 'Abu Rayhan', admissionRoll: '2116570580006', department: 'BBS', gt: 3500 },
  { sl: 2, studentName: 'Sadia Akter', admissionRoll: '2116570580007', department: 'BBS', gt: 3000 },
  { sl: 3, studentName: 'Rafi Hasan', admissionRoll: '2116570580008', department: 'BA', gt: 4000 },
  { sl: 4, studentName: 'Mitu Begum', admissionRoll: '2116570580009', department: 'BSS', gt: 2500 },
  { sl: 5, studentName: 'Karim Molla', admissionRoll: '2116570580010', department: 'BA', gt: 3500 },
];

const DEPARTMENTS = ['BBS', 'BA', 'BSS'];

const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';

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

const HeadWiseDetails = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() =>
    paymentListData.filter(
      (item) =>
        (!department || item.department === department) &&
        item.studentName.toLowerCase().includes(search.toLowerCase())
    ),
    [department, search]
  );

  const totalAmount = useMemo(() => filtered.reduce((s, r) => s + r.gt, 0), [filtered]);

  const validate = () => {
    const e = {};
    if (!startDate) e.startDate = 'Required';
    if (!endDate) e.endDate = 'Required';
    return e;
  };

  const handleSearch = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSearched(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(14).text('Head Wise Details', 297, 40, { align: 'center' });
    doc.setFontSize(10).text(`${startDate} — ${endDate}`, 297, 58, { align: 'center' });
    autoTable(doc, {
      startY: 80,
      head: [['SL', 'Student Name', 'Admission Roll', 'Department', 'Grand Total']],
      body: filtered.map((r) => [r.sl, r.studentName, r.admissionRoll, r.department, formatMoney(r.gt)]),
      theme: 'grid',
      headStyles: { fillColor: '#2563EB', textColor: '#fff', fontSize: 9 },
      styles: { fontSize: 9 },
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map((r) => ({
      SL: r.sl, 'Student Name': r.studentName, 'Admission Roll': r.admissionRoll,
      Department: r.department, 'Grand Total (৳)': r.gt,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HeadWise');
    XLSX.writeFile(wb, 'Head_Wise_Details.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Reports', 'Head Wise Details']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-blue-500" /> Head Wise Details
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Degree Admission | Session 2024–2025 (BA • BSS • BBS)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <SlidersHorizontal size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Search Filters</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                Date From <span className="text-red-500">*</span>
              </label>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: undefined })); }}
                className={errors.startDate ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp} />
              {errors.startDate && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{errors.startDate}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                Date To <span className="text-red-500">*</span>
              </label>
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: undefined })); }}
                className={errors.endDate ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp} />
              {errors.endDate && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{errors.endDate}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className={inp}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search Student</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..."
                  className={`${inp} pl-8`} />
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <button onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

            {/* Institute Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={26} className="text-blue-500" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">Income Report — Head Wise Details</p>
                <p className="text-xs text-gray-400 mt-0.5">{startDate} to {endDate}{department ? ` · ${department}` : ''}</p>
              </div>
              {/* Summary inline */}
              <div className="flex gap-4">
                {[
                  { label: 'Students', value: filtered.length, Icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Total', value: `৳${formatMoney(totalAmount)}`, Icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                ].map(({ label, value, Icon, color, bg }) => (
                  <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bg}`}>
                    <Icon size={14} className={color} />
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{value}</p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
              <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors">
                <Printer size={13} /> PDF
              </button>
              <button onClick={handleExcel} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors">
                <Download size={13} /> Excel
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['SL', 'Student Name', 'Admission Roll', 'Department', 'Grand Total (৳)'].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Grand Total (৳)' ? 'text-right' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-14 text-center">
                        <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Data was not found!</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.sl} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-gray-400">{row.sl}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-200">{row.studentName}</td>
                        <td className="px-5 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{row.admissionRoll}</span></td>
                        <td className="px-5 py-3.5"><span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg">{row.department}</span></td>
                        <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(row.gt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filtered.length > 0 && (
                  <tfoot>
                    <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                      <td colSpan={4} className="px-5 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 text-right">Total Amount</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">৳{formatMoney(totalAmount)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HeadWiseDetails;