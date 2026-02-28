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
  BookOpen,
  TrendingUp,
  ChevronDown,
  CreditCard,
  Receipt,
  Hash,
  CalendarDays,
  User,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

/* ─── Helpers ─── */
const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900/30';

/* ─── Breadcrumb ─── */
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

/* ─── Payment Method Badge ─── */
const MethodBadge = ({ method }) => {
  const styles = {
    Online: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Manual: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    'Bank Transfer': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[method] || 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
      <CreditCard size={9} />
      {method}
    </span>
  );
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
    ${status === 'Paid'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : status === 'Partial'
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-green-500' : status === 'Partial' ? 'bg-amber-400' : 'bg-red-400'}`} />
    {status}
  </span>
);

/* ─── Sample Data ─── */
const SESSIONS = ['All', '2024-2025', '2023-2024', '2022-2023'];
const ADMISSION_EVENTS = [
  { id: 101, title: 'Degree Admission | Session 2024–2025 (BA • BSS • BBS)', session: '2024-2025' },
  { id: 102, title: 'Professional Programs | Session 2024–2025 (BBA • CSE • THM)', session: '2024-2025' },
  { id: 103, title: 'Masters Preliminary (Private) 2022-2023', session: '2022-2023' },
];

const generateTransactions = (eventId, deptName, startId, count) =>
  Array.from({ length: count }, (_, i) => {
    const methods = ['Manual', 'Online', 'Manual', 'Bank Transfer', 'Manual'];
    const statuses = ['Paid', 'Paid', 'Paid', 'Partial', 'Paid'];
    const firstNames = ['Saiful', 'Nasimul', 'Fatema', 'Rahim', 'Sumaiya', 'Karim', 'Nusrat', 'Arif'];
    const lastNames = ['Islam', 'Hossain', 'Begum', 'Miah', 'Akter', 'Uddin', 'Jahan', 'Ahmed'];
    const name = `${firstNames[(startId + i) % firstNames.length]} ${lastNames[(startId + i + 3) % lastNames.length]}`;
    const amount = eventId === 103 ? 7200 : eventId === 102 ? 9500 : 8470;
    return {
      id: startId + i,
      invoiceNo: `INV-${eventId}-${String(startId + i).padStart(4, '0')}`,
      studentCode: `2514010030${String(startId + i).padStart(3, '0')}`,
      studentName: name,
      roll: `12025260330${String(startId + i).padStart(2, '0')}`,
      department: deptName,
      paymentMethod: methods[(startId + i) % methods.length],
      status: statuses[(startId + i) % statuses.length],
      amountPaid: statuses[(startId + i) % statuses.length] === 'Partial' ? Math.round(amount * 0.5) : amount,
      totalFee: amount,
      paymentDate: `${String((i % 28) + 1).padStart(2, '0')}-09-2024`,
      receiptNo: `RCP-${String(1000 + startId + i)}`,
    };
  });

const DETAIL_DATA = [
  {
    eventId: 101,
    departments: [
      { id: 1, name: 'Bachelor of Arts (B.A.)', transactions: generateTransactions(101, 'Bachelor of Arts (B.A.)', 1, 8) },
      { id: 2, name: 'Bachelor of Social Science (B.S.S)', transactions: generateTransactions(101, 'Bachelor of Social Science (B.S.S)', 9, 6) },
      { id: 3, name: 'Bachelor of Business Studies (BBS)', transactions: generateTransactions(101, 'Bachelor of Business Studies (BBS)', 15, 5) },
    ],
  },
  {
    eventId: 102,
    departments: [
      { id: 4, name: 'Bachelor of Business Administration (BBA)', transactions: generateTransactions(102, 'BBA', 21, 6) },
      { id: 5, name: 'Computer Science & Engineering (CSE)', transactions: generateTransactions(102, 'CSE', 27, 4) },
    ],
  },
  {
    eventId: 103,
    departments: [
      { id: 6, name: 'Masters Preliminary (Private)', transactions: generateTransactions(103, 'Masters Preliminary (Private)', 31, 7) },
    ],
  },
];

/* ─── Department Detail Group ─── */
const DepartmentGroup = ({ dept, eventId }) => {
  const [open, setOpen] = useState(true);
  const totalPaid = dept.transactions.reduce((s, t) => s + t.amountPaid, 0);
  const totalFee = dept.transactions.reduce((s, t) => s + t.totalFee, 0);
  const paidCount = dept.transactions.filter((t) => t.status === 'Paid').length;
  const onlineCount = dept.transactions.filter((t) => t.paymentMethod === 'Online').length;

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Dept Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-rose-50/60 dark:bg-rose-900/10 hover:bg-rose-100/60 dark:hover:bg-rose-900/20 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
            <BookOpen size={12} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{dept.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {dept.transactions.length} transactions · {paidCount} paid · {onlineCount} online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">৳{formatMoney(totalPaid)}</p>
            <p className="text-xs text-gray-400">of ৳{formatMoney(totalFee)}</p>
          </div>
          <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Transactions Table */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                {[
                  { label: '#', align: 'left' },
                  { label: 'Invoice No.', align: 'left' },
                  { label: 'Receipt No.', align: 'left' },
                  { label: 'Student Code', align: 'left' },
                  { label: 'Student Name', align: 'left' },
                  { label: 'Roll No.', align: 'left' },
                  { label: 'Payment Date', align: 'left' },
                  { label: 'Method', align: 'center' },
                  { label: 'Status', align: 'center' },
                  { label: 'Total Fee (৳)', align: 'right' },
                  { label: 'Amount Paid (৳)', align: 'right' },
                  { label: 'Due (৳)', align: 'right' },
                ].map(({ label, align }) => (
                  <th key={label}
                    className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap text-${align}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {dept.transactions.map((tx, i) => {
                const due = tx.totalFee - tx.amountPaid;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-md">
                        {tx.invoiceNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
                        {tx.receiptNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{tx.studentCode}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{tx.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{tx.roll}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">{tx.paymentDate}</td>
                    <td className="px-4 py-3 text-center"><MethodBadge method={tx.paymentMethod} /></td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                      ৳{formatMoney(tx.totalFee)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                      ৳{formatMoney(tx.amountPaid)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      {due > 0
                        ? <span className="text-red-500 dark:text-red-400">৳{formatMoney(due)}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-rose-50/40 dark:bg-rose-900/10 border-t border-rose-100 dark:border-rose-900/30">
                <td colSpan={9} className="px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Dept. Subtotal — {dept.transactions.length} records
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">
                  ৳{formatMoney(totalFee)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                  ৳{formatMoney(totalPaid)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-red-500 dark:text-red-400 text-right">
                  {totalFee - totalPaid > 0 ? `৳${formatMoney(totalFee - totalPaid)}` : <span className="text-gray-300 dark:text-gray-600">—</span>}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

/* ─── Event Group ─── */
const EventGroup = ({ event, departments }) => {
  const [open, setOpen] = useState(true);
  const allTx = departments.flatMap((d) => d.transactions);
  const subtotalFee = allTx.reduce((s, t) => s + t.totalFee, 0);
  const subtotalPaid = allTx.reduce((s, t) => s + t.amountPaid, 0);

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
      {/* Event Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
            <Receipt size={16} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{event.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {departments.length} dept{departments.length !== 1 ? 's' : ''} ·
              {allTx.length} transactions · Session {event.session}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">৳{formatMoney(subtotalPaid)}</p>
            <p className="text-xs text-gray-400">{allTx.length} transactions</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dept groups */}
      {open && (
        <div className="p-4 space-y-3 bg-gray-50/30 dark:bg-gray-700/10">
          {departments.map((dept) => (
            <DepartmentGroup key={dept.id} dept={dept} eventId={event.id} />
          ))}

          {/* Event Subtotal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-rose-500" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Event Subtotal</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Fee</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">৳{formatMoney(subtotalFee)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Collected</p>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">৳{formatMoney(subtotalPaid)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Due</p>
                <p className="text-sm font-bold text-red-500 dark:text-red-400">
                  {subtotalFee - subtotalPaid > 0 ? `৳${formatMoney(subtotalFee - subtotalPaid)}` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
export default function AdmissionPaymentSummaryDetails() {
  const [session, setSession] = useState('All');
  const [eventId, setEventId] = useState('All');
  const [searched, setSearched] = useState(false);

  const availableEvents = useMemo(() => {
    if (session === 'All') return ADMISSION_EVENTS;
    return ADMISSION_EVENTS.filter((e) => e.session === session);
  }, [session]);

  const filteredData = useMemo(() => {
    let data = DETAIL_DATA;
    if (session !== 'All') {
      data = data.filter((d) => {
        const ev = ADMISSION_EVENTS.find((e) => e.id === d.eventId);
        return ev?.session === session;
      });
    }
    if (eventId !== 'All') {
      data = data.filter((d) => d.eventId === Number(eventId));
    }
    return data;
  }, [session, eventId]);

  const allTx = useMemo(() => filteredData.flatMap((d) => d.departments.flatMap((dept) => dept.transactions)), [filteredData]);
  const grandTotalFee = useMemo(() => allTx.reduce((s, t) => s + t.totalFee, 0), [allTx]);
  const grandTotalPaid = useMemo(() => allTx.reduce((s, t) => s + t.amountPaid, 0), [allTx]);
  const grandTotalDue = grandTotalFee - grandTotalPaid;
  const onlineTotal = useMemo(() => allTx.filter((t) => t.paymentMethod === 'Online').reduce((s, t) => s + t.amountPaid, 0), [allTx]);
  const paidCount = useMemo(() => allTx.filter((t) => t.status === 'Paid').length, [allTx]);

  const handleShow = () => setSearched(true);

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Admission Payment Summary Details', 40, 40);
    doc.setFontSize(10).text(`Mohammadpur Kendriya College · Session: ${session}`, 40, 58);
    let startY = 80;
    filteredData.forEach((group) => {
      const event = ADMISSION_EVENTS.find((e) => e.id === group.eventId);
      doc.setFontSize(11).setTextColor('#BE123C').text(event?.title || '', 40, startY);
      startY += 15;
      const rows = group.departments.flatMap((dept) =>
        dept.transactions.map((tx, i) => [
          i + 1, tx.invoiceNo, tx.receiptNo, tx.studentCode,
          tx.studentName, tx.roll, tx.paymentDate,
          tx.paymentMethod, tx.status,
          formatMoney(tx.totalFee), formatMoney(tx.amountPaid),
          formatMoney(tx.totalFee - tx.amountPaid),
        ])
      );
      autoTable(doc, {
        startY,
        head: [['#', 'Invoice', 'Receipt', 'Std Code', 'Name', 'Roll', 'Date', 'Method', 'Status', 'Total Fee', 'Paid', 'Due']],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: '#BE123C', textColor: '#fff', fontSize: 7 },
        styles: { fontSize: 7 },
        didDrawPage: (dt) => { startY = dt.cursor.y + 20; },
      });
      startY += 15;
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const rows = [];
    filteredData.forEach((group) => {
      const event = ADMISSION_EVENTS.find((e) => e.id === group.eventId);
      rows.push({ Event: event?.title, Department: '', 'Invoice No': '', 'Receipt No': '', 'Student Code': '', Name: '', Roll: '', Date: '', Method: '', Status: '', 'Total Fee': '', Paid: '', Due: '' });
      group.departments.forEach((dept) => {
        dept.transactions.forEach((tx) => {
          rows.push({
            Event: '', Department: dept.name,
            'Invoice No': tx.invoiceNo, 'Receipt No': tx.receiptNo,
            'Student Code': tx.studentCode, Name: tx.studentName, Roll: tx.roll,
            Date: tx.paymentDate, Method: tx.paymentMethod, Status: tx.status,
            'Total Fee': tx.totalFee, Paid: tx.amountPaid, Due: tx.totalFee - tx.amountPaid,
          });
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Details');
    XLSX.writeFile(wb, 'Admission_Payment_Summary_Details.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Reports', 'Admission Payment Summary Details']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-rose-500" /> Admission Payment Summary Details
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-rose-50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/30">
            <SlidersHorizontal size={15} className="text-rose-500" />
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">Search Filters</span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row gap-4 items-end flex-wrap">
            {/* Session */}
            <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={session} onChange={(e) => { setSession(e.target.value); setEventId('All'); setSearched(false); }} className={inp}>
                {SESSIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* Event */}
            <div className="flex flex-col gap-1.5 w-full sm:w-80">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Admission Event</label>
              <select value={eventId} onChange={(e) => { setEventId(e.target.value); setSearched(false); }} className={inp}>
                <option value="All">All Events</option>
                {availableEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
            <button
              onClick={handleShow}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-200 dark:shadow-none whitespace-nowrap"
            >
              <Search size={14} /> Show Report
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'Total Transactions', value: allTx.length, bg: 'bg-rose-50 dark:bg-rose-900/20', ic: 'bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-300', Icon: Receipt },
                { label: 'Total Students', value: allTx.length, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
                { label: 'Paid', value: paidCount, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: TrendingUp },
                { label: 'Online Collected', value: `৳${formatMoney(onlineTotal)}`, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: CreditCard },
                { label: 'Grand Total Paid', value: `৳${formatMoney(grandTotalPaid)}`, bg: 'bg-emerald-50 dark:bg-emerald-900/20', ic: 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300', Icon: DollarSign },
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

            {/* Main Report Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Institute Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-rose-50 to-white dark:from-rose-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={26} className="text-rose-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">Admission Payment Summary Details</p>
                  <p className="text-xs text-gray-400 mt-0.5">Session: {session} · {allTx.length} total transactions</p>
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

              {/* Event Groups */}
              <div className="p-5 space-y-4">
                {filteredData.length === 0 ? (
                  <div className="py-14 text-center">
                    <FileText size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found for selected filters</p>
                  </div>
                ) : (
                  filteredData.map((group) => {
                    const event = ADMISSION_EVENTS.find((e) => e.id === group.eventId);
                    return <EventGroup key={group.eventId} event={event} departments={group.departments} />;
                  })
                )}
              </div>

              {/* Grand Total Footer */}
              {filteredData.length > 0 && (
                <div className="mx-5 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">Grand Total</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                      {allTx.length} transactions
                    </span>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Fee</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">৳{formatMoney(grandTotalFee)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Collected</p>
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">৳{formatMoney(grandTotalPaid)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Due</p>
                      <p className="text-lg font-bold text-red-500 dark:text-red-400">
                        {grandTotalDue > 0 ? `৳${formatMoney(grandTotalDue)}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}