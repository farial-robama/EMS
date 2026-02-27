import React, { useState, useMemo } from 'react';
import {
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCheck,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const ALL_CANDIDATES = [
  {
    id: 1,
    name: 'ABDULLAH AL MUKIM',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Eight',
    session: '2026',
    roll: '86532',
    feeTemplate: 'New Admission MNC Male Eight',
    submitted: 'No',
    approval: 'APPROVED',
    payment: 'UNPAID',
    status: 'Active',
  },
  {
    id: 2,
    name: 'TASMIA',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Six',
    session: '2026',
    roll: '60885',
    feeTemplate: 'New Admission MNC Female Six',
    submitted: 'No',
    approval: 'APPROVED',
    payment: 'UNPAID',
    status: 'Active',
  },
  {
    id: 3,
    name: 'MST FATHIYA BINTE YEASIN',
    level: 'Nine-Ten',
    dept: 'Science',
    board: 'Rajshahi Board',
    className: 'Nine (Science)',
    session: '2026-2027',
    roll: '9114',
    feeTemplate: 'New Admission Baf 4th Female Nine',
    submitted: 'No',
    approval: 'APPROVED',
    payment: 'UNPAID',
    status: 'Active',
  },
  {
    id: 4,
    name: 'MOHAMMAD RAYHAN',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Seven',
    session: '2026',
    roll: '72341',
    feeTemplate: 'New Admission MNC Male Seven',
    submitted: 'Yes',
    approval: 'APPROVED',
    payment: 'PAID',
    status: 'Active',
  },
  {
    id: 5,
    name: 'SUMAIYA AKTER',
    level: 'Nine-Ten',
    dept: 'Arts',
    board: 'Dhaka Board',
    className: 'Ten (Arts)',
    session: '2026-2027',
    roll: '10224',
    feeTemplate: 'New Admission Female Ten Arts',
    submitted: 'Yes',
    approval: 'PENDING',
    payment: 'UNPAID',
    status: 'Inactive',
  },
  {
    id: 6,
    name: 'RIFAT HOSSAIN',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Eight',
    session: '2026',
    roll: '86999',
    feeTemplate: 'New Admission MNC Male Eight',
    submitted: 'No',
    approval: 'APPROVED',
    payment: 'PAID',
    status: 'Active',
  },
  {
    id: 7,
    name: 'NAZMUN NAHAR MITU',
    level: 'Nine-Ten',
    dept: 'Science',
    board: 'Dhaka Board',
    className: 'Nine (Science)',
    session: '2026-2027',
    roll: '9087',
    feeTemplate: 'New Admission Female Nine Science',
    submitted: 'No',
    approval: 'REJECTED',
    payment: 'UNPAID',
    status: 'Inactive',
  },
  {
    id: 8,
    name: 'TOWHID ISLAM',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Six',
    session: '2026',
    roll: '60321',
    feeTemplate: 'New Admission MNC Male Six',
    submitted: 'Yes',
    approval: 'APPROVED',
    payment: 'PAID',
    status: 'Active',
  },
  {
    id: 9,
    name: 'FARIDA KHANAM',
    level: 'Nine-Ten',
    dept: 'Commerce',
    board: 'Ctg Board',
    className: 'Ten (Commerce)',
    session: '2026-2027',
    roll: '10551',
    feeTemplate: 'New Admission Female Ten Commerce',
    submitted: 'No',
    approval: 'PENDING',
    payment: 'UNPAID',
    status: 'Active',
  },
  {
    id: 10,
    name: 'ARIFUL ISLAM SIAM',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Seven',
    session: '2026',
    roll: '72888',
    feeTemplate: 'New Admission MNC Male Seven',
    submitted: 'Yes',
    approval: 'APPROVED',
    payment: 'PAID',
    status: 'Active',
  },
  {
    id: 11,
    name: 'TANVIR AHMED',
    level: 'Six-Eight',
    dept: 'Default',
    board: '',
    className: 'Eight',
    session: '2026',
    roll: '86712',
    feeTemplate: 'New Admission MNC Male Eight',
    submitted: 'No',
    approval: 'APPROVED',
    payment: 'UNPAID',
    status: 'Active',
  },
  {
    id: 12,
    name: 'SADIA ISLAM RIPA',
    level: 'Nine-Ten',
    dept: 'Science',
    board: 'Rajshahi Board',
    className: 'Nine (Science)',
    session: '2026-2027',
    roll: '9201',
    feeTemplate: 'New Admission Female Nine Science',
    submitted: 'Yes',
    approval: 'APPROVED',
    payment: 'PAID',
    status: 'Active',
  },
];

const LEVELS = ['All', 'Six-Eight', 'Nine-Ten', 'Primary'];
const SESSIONS = ['All', '2026', '2026-2027', '2025'];
const CLASSES = [
  'All',
  'Six',
  'Seven',
  'Eight',
  'Nine (Science)',
  'Nine (Arts)',
  'Ten (Arts)',
  'Ten (Commerce)',
];
const PAYMENTS = ['All', 'PAID', 'UNPAID'];
const APPROVALS = ['All', 'APPROVED', 'PENDING', 'REJECTED'];

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

const ApprovalBadge = ({ val }) => {
  const map = {
    APPROVED:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    PENDING:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${map[val] || map.PENDING}`}
    >
      {val}
    </span>
  );
};

const PaymentBadge = ({ val }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${val === 'PAID' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
  >
    {val}
  </span>
);

const StatusBadge = ({ val }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${val === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
  >
    {val}
  </span>
);

const SubmittedBadge = ({ val }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${val === 'Yes' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
  >
    {val}
  </span>
);

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function AdmissionsApplicableCandidate() {
  const [level, setLevel] = useState('All');
  const [session, setSession] = useState('All');
  const [cls, setCls] = useState('All');
  const [payment, setPayment] = useState('All');
  const [approval, setApproval] = useState('All');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);

  const filtered = useMemo(
    () =>
      ALL_CANDIDATES.filter(
        (c) =>
          (level === 'All' || c.level === level) &&
          (session === 'All' || c.session === session) &&
          (cls === 'All' || c.className === cls) &&
          (payment === 'All' || c.payment === payment) &&
          (approval === 'All' || c.approval === approval) &&
          (!search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.roll.includes(search))
      ),
    [level, session, cls, payment, approval, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const stats = useMemo(
    () => ({
      total: ALL_CANDIDATES.length,
      approved: ALL_CANDIDATES.filter((c) => c.approval === 'APPROVED').length,
      paid: ALL_CANDIDATES.filter((c) => c.payment === 'PAID').length,
      pending: ALL_CANDIDATES.filter((c) => c.approval === 'PENDING').length,
    }),
    []
  );

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1)
        arr.push(i);
      else if (arr[arr.length - 1] !== '…') arr.push('…');
    }
    return arr;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb
            items={['Dashboard', 'Admission', 'Applicable Candidates']}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UserCheck size={22} className="text-blue-500" /> Admission New
            Candidate List
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Candidates',
              value: stats.total,
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              val: 'text-blue-700 dark:text-blue-400',
              ic: 'bg-blue-100 dark:bg-blue-900 text-blue-500',
            },
            {
              label: 'Approved',
              value: stats.approved,
              cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
              val: 'text-green-700 dark:text-green-400',
              ic: 'bg-green-100 dark:bg-green-900 text-green-500',
            },
            {
              label: 'Paid',
              value: stats.paid,
              cls: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30',
              val: 'text-purple-700 dark:text-purple-400',
              ic: 'bg-purple-100 dark:bg-purple-900 text-purple-500',
            },
            {
              label: 'Pending Approval',
              value: stats.pending,
              cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
              val: 'text-amber-600 dark:text-amber-400',
              ic: 'bg-amber-100 dark:bg-amber-900 text-amber-500',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <Users size={16} />
              </div>
              <div>
                <div className={`text-2xl font-bold leading-none ${s.val}`}>
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
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Filter Candidates
            </span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Education Level
              </label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {LEVELS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Session
              </label>
              <select
                value={session}
                onChange={(e) => {
                  setSession(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {SESSIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class
              </label>
              <select
                value={cls}
                onChange={(e) => {
                  setCls(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {CLASSES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Payment Status
              </label>
              <select
                value={payment}
                onChange={(e) => {
                  setPayment(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {PAYMENTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Approval
              </label>
              <select
                value={approval}
                onChange={(e) => {
                  setApproval(e.target.value);
                  setPage(1);
                }}
                className={inp}
              >
                {APPROVALS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Candidates
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {filtered.length} found
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Show
                </span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  placeholder="Search name or roll…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1200px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Student Name',
                    'Edu. Level',
                    'Department',
                    'Board',
                    'Class',
                    'Session',
                    'Admission Roll',
                    'Fee Template',
                    'Form Submitted?',
                    'Approval',
                    'Payment',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-5 py-14 text-center">
                      <UserCheck
                        size={36}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        No candidates match your filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((c, i) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {c.level}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {c.dept}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {c.board || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium">
                          {c.className}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                        {c.session}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                        {c.roll}
                      </td>
                      <td
                        className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-[160px] truncate"
                        title={c.feeTemplate}
                      >
                        {c.feeTemplate}
                      </td>
                      <td className="px-4 py-4">
                        <SubmittedBadge val={c.submitted} />
                      </td>
                      <td className="px-4 py-4">
                        <ApprovalBadge val={c.approval} />
                      </td>
                      <td className="px-4 py-4">
                        <PaymentBadge val={c.payment} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge val={c.status} />
                      </td>
                      <td className="px-4 py-4 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewItem(c)}
                            className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}
              –{Math.min(safePage * perPage, filtered.length)} of{' '}
              {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft size={14} />
              </button>
              {paginationPages().map((p, i) =>
                typeof p === 'string' ? (
                  <span
                    key={i}
                    className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold"
              >
                »
              </button>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {viewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewItem(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Eye size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Candidate Details
                  </span>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-5 space-y-0 divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ['Student Name', viewItem.name],
                  ['Education Level', viewItem.level],
                  ['Department', viewItem.dept],
                  ['Board', viewItem.board || '—'],
                  ['Class', viewItem.className],
                  ['Session', viewItem.session],
                  ['Admission Roll', viewItem.roll],
                  ['Fee Template', viewItem.feeTemplate],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 text-right max-w-[60%]">
                      {val}
                    </span>
                  </div>
                ))}
                <div className="pt-3 mt-1 flex items-center justify-around gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Form</p>
                    <SubmittedBadge val={viewItem.submitted} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Approval</p>
                    <ApprovalBadge val={viewItem.approval} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Payment</p>
                    <PaymentBadge val={viewItem.payment} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <StatusBadge val={viewItem.status} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => setViewItem(null)}
                  className="px-5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
