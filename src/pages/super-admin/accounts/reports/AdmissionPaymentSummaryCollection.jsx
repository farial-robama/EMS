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
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

/* ─── Sample Data ─── */
const admissionEvents = [
  { id: 101, title: 'Degree Admission | Session 2024–2025 (BA • BSS • BBS)', session: '2024-2025' },
  { id: 102, title: 'Professional Programs | Session 2024–2025 (BBA • CSE • THM)', session: '2024-2025' },
  { id: 103, title: 'Masters Preliminary (Private) 2022-2023', session: '2022-2023' },
];

const collectionData = [
  {
    eventId: 101,
    departments: [
      { id: 1, department: 'Bachelor of Arts (B.A.)', candidates: 44, perHead: 8470, totalCollected: 372680, online: 0, manual: 372680 },
      { id: 2, department: 'Bachelor of Social Science (B.S.S)', candidates: 21, perHead: 8470, totalCollected: 177870, online: 0, manual: 177870 },
      { id: 3, department: 'Bachelor of Business Studies (BBS)', candidates: 19, perHead: 8470, totalCollected: 160930, online: 0, manual: 160930 },
    ],
  },
  {
    eventId: 102,
    departments: [
      { id: 4, department: 'Bachelor of Business Administration (BBA)', candidates: 31, perHead: 9500, totalCollected: 294500, online: 12000, manual: 282500 },
      { id: 5, department: 'Computer Science & Engineering (CSE)', candidates: 17, perHead: 9500, totalCollected: 161500, online: 9500, manual: 152000 },
    ],
  },
  {
    eventId: 103,
    departments: [
      { id: 6, department: 'Masters Preliminary (Private)', candidates: 58, perHead: 7200, totalCollected: 417600, online: 0, manual: 417600 },
    ],
  },
];

const SESSIONS = ['All', '2024-2025', '2023-2024', '2022-2023'];

const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900/30';

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

/* ─── Collapsible Event Group ─── */
const EventGroup = ({ event, departments }) => {
  const [open, setOpen] = useState(true);
  const subtotalCandidates = departments.reduce((s, d) => s + d.candidates, 0);
  const subtotalAmount = departments.reduce((s, d) => s + d.totalCollected, 0);
  const subtotalOnline = departments.reduce((s, d) => s + d.online, 0);
  const subtotalManual = departments.reduce((s, d) => s + d.manual, 0);

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Group Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
            <BookOpen size={14} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{event.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {departments.length} department{departments.length !== 1 ? 's' : ''} · Session {event.session}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">৳{formatMoney(subtotalAmount)}</p>
            <p className="text-xs text-gray-400">{subtotalCandidates} candidates</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                {['#', 'Department', 'Candidates', 'Per Head (৳)', 'Online (৳)', 'Manual (৳)', 'Total Collected (৳)'].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${
                    ['Per Head (৳)', 'Online (৳)', 'Manual (৳)', 'Total Collected (৳)'].includes(h) ? 'text-right' :
                    h === 'Candidates' ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {departments.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 py-3.5 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-800 dark:text-gray-200">{row.department}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-sm font-bold text-blue-700 dark:text-blue-400">
                      {row.candidates}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                    ৳{formatMoney(row.perHead)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-purple-700 dark:text-purple-400 font-semibold text-right">
                    {row.online > 0 ? `৳${formatMoney(row.online)}` : <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-indigo-700 dark:text-indigo-400 font-semibold text-right">
                    ৳{formatMoney(row.manual)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                    ৳{formatMoney(row.totalCollected)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-rose-50/40 dark:bg-rose-900/10 border-t border-rose-100 dark:border-rose-900/30">
                <td colSpan={2} className="px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Subtotal
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-bold text-blue-700 dark:text-blue-400">
                    {subtotalCandidates}
                  </span>
                </td>
                <td />
                <td className="px-4 py-3 text-sm font-bold text-purple-700 dark:text-purple-400 text-right">
                  {subtotalOnline > 0 ? `৳${formatMoney(subtotalOnline)}` : <span className="text-gray-300 dark:text-gray-600">—</span>}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-indigo-700 dark:text-indigo-400 text-right">
                  ৳{formatMoney(subtotalManual)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-green-700 dark:text-green-400 text-right">
                  ৳{formatMoney(subtotalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
const AdmissionPaymentSummaryCollection = () => {
  const [session, setSession] = useState('All');
  const [searched, setSearched] = useState(false);

  const filteredData = useMemo(() => {
    if (session === 'All') return collectionData;
    return collectionData.filter((d) => {
      const event = admissionEvents.find((e) => e.id === d.eventId);
      return event?.session === session;
    });
  }, [session]);

  const allDepts = useMemo(() => filteredData.flatMap((d) => d.departments), [filteredData]);
  const grandTotalCandidates = useMemo(() => allDepts.reduce((s, d) => s + d.candidates, 0), [allDepts]);
  const grandTotalAmount = useMemo(() => allDepts.reduce((s, d) => s + d.totalCollected, 0), [allDepts]);
  const grandTotalOnline = useMemo(() => allDepts.reduce((s, d) => s + d.online, 0), [allDepts]);
  const grandTotalManual = useMemo(() => allDepts.reduce((s, d) => s + d.manual, 0), [allDepts]);

  const handleShow = () => setSearched(true);

  const handlePDF = () => {
    const doc = new jsPDF('l', 'pt', 'a3');
    doc.setFontSize(14).text('Admission Payment Summary Collection', 40, 40);
    doc.setFontSize(10).text(`Mohammadpur Kendriya College · Session: ${session}`, 40, 58);
    let startY = 80;
    filteredData.forEach((group) => {
      const event = admissionEvents.find((e) => e.id === group.eventId);
      doc.setFontSize(11).setTextColor('#BE123C').text(event?.title || '', 40, startY);
      startY += 15;
      autoTable(doc, {
        startY,
        head: [['#', 'Department', 'Candidates', 'Per Head (৳)', 'Online (৳)', 'Manual (৳)', 'Total Collected (৳)']],
        body: group.departments.map((d, i) => [
          i + 1, d.department, d.candidates,
          formatMoney(d.perHead), formatMoney(d.online),
          formatMoney(d.manual), formatMoney(d.totalCollected),
        ]),
        theme: 'grid',
        headStyles: { fillColor: '#BE123C', textColor: '#fff', fontSize: 8 },
        styles: { fontSize: 8 },
        didDrawPage: (dt) => { startY = dt.cursor.y + 20; },
      });
      startY += 15;
    });
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const rows = [];
    filteredData.forEach((group) => {
      const event = admissionEvents.find((e) => e.id === group.eventId);
      rows.push({ Event: event?.title, Department: '', Candidates: '', 'Per Head': '', Online: '', Manual: '', Total: '' });
      group.departments.forEach((d, i) => {
        rows.push({
          Event: '', Department: d.department, Candidates: d.candidates,
          'Per Head': d.perHead, Online: d.online, Manual: d.manual, Total: d.totalCollected,
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary Collection');
    XLSX.writeFile(wb, 'Admission_Payment_Summary_Collection.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Transaction Reports', 'Admission Payment Summary Collection']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-rose-500" /> Admission Payment Summary Collection
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-rose-50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/30">
            <SlidersHorizontal size={15} className="text-rose-500" />
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">Search Filters</span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col gap-1.5 w-full sm:w-64">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={session} onChange={(e) => setSession(e.target.value)} className={inp}>
                {SESSIONS.map((s) => <option key={s}>{s}</option>)}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Events', value: filteredData.length, bg: 'bg-rose-50 dark:bg-rose-900/20', ic: 'bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-300', Icon: BookOpen },
                { label: 'Total Candidates', value: grandTotalCandidates, bg: 'bg-blue-50 dark:bg-blue-900/20', ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300', Icon: Users },
                { label: 'Online Collected', value: `৳${formatMoney(grandTotalOnline)}`, bg: 'bg-purple-50 dark:bg-purple-900/20', ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', Icon: TrendingUp },
                { label: 'Grand Total', value: `৳${formatMoney(grandTotalAmount)}`, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: DollarSign },
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
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">Admission Payment Summary Collection</p>
                  <p className="text-xs text-gray-400 mt-0.5">Session: {session}</p>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">No data found for selected session</p>
                  </div>
                ) : (
                  filteredData.map((group) => {
                    const event = admissionEvents.find((e) => e.id === group.eventId);
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
                      {grandTotalCandidates} candidates
                    </span>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Online</p>
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-400">৳{formatMoney(grandTotalOnline)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Manual</p>
                      <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">৳{formatMoney(grandTotalManual)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-400">৳{formatMoney(grandTotalAmount)}</p>
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
};

export default AdmissionPaymentSummaryCollection;