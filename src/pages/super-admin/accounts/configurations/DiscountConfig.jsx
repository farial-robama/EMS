import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Plus,
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight as CRight,
  Tag,
} from 'lucide-react';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
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

const selCls =
  'px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';
const fmt = (n) => `৳ ${Number(n).toLocaleString('en-IN')}`;

const STATUS_STYLE = {
  approved:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending:
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-500',
};

const STUDENT_DISCOUNTS = [
  {
    id: 1,
    name: 'Md. Sojibul Islam',
    studentId: '1916560570030',
    roll: '2201920240110',
    className: 'Finance & Banking (Honours)',
    section: '3rd Year',
    session: '2019-2020',
    quantity: 1,
    totalAmount: 4000,
    status: 'approved',
    transactions: [
      {
        sl: 1,
        duration: 'Jul, 2023',
        head: 'Not promoted (Jan-Jun) Tuition Fee',
        amount: 4000,
        date: '23 Nov, 2025',
        stage: 'Approved',
        remarks: 'Sommukh sarir july joddah (Principal)',
        status: 'Paid',
      },
    ],
  },
  {
    id: 2,
    name: 'MD. HOSEN MUNSHI',
    studentId: '2514020080188',
    roll: '1202526022145',
    className: 'HSC-Business Studies',
    section: '1st Year',
    session: '2025-2026',
    quantity: 6,
    totalAmount: 6000,
    status: 'approved',
    transactions: [
      {
        sl: 1,
        duration: 'Jul, 2025',
        head: 'Tuition Fee',
        amount: 6000,
        date: '01 Dec, 2025',
        stage: 'Approved',
        remarks: 'Paid by Bank',
        status: 'Paid',
      },
    ],
  },
  {
    id: 3,
    name: 'Fatima Begum',
    studentId: '1823040120045',
    roll: '1105524031022',
    className: 'HSC-Science',
    section: '2nd Year',
    session: '2024-2025',
    quantity: 2,
    totalAmount: 2000,
    status: 'pending',
    transactions: [
      {
        sl: 1,
        duration: 'Aug, 2024',
        head: 'Admission Fee Waiver',
        amount: 2000,
        date: '15 Aug, 2024',
        stage: 'Pending',
        remarks: 'Awaiting principal approval',
        status: 'Unpaid',
      },
    ],
  },
  {
    id: 4,
    name: 'Rahim Uddin',
    studentId: '2012030340067',
    roll: '2204820240188',
    className: 'HSC-Humanities',
    section: '1st Year',
    session: '2025-2026',
    quantity: 3,
    totalAmount: 3000,
    status: 'approved',
    transactions: [
      {
        sl: 1,
        duration: 'Sep, 2025',
        head: 'Monthly Tuition',
        amount: 3000,
        date: '10 Sep, 2025',
        stage: 'Approved',
        remarks: 'Scholarship discount',
        status: 'Paid',
      },
    ],
  },
];

export default function DiscountConfig() {
  const navigate = useNavigate();
  const [session, setSession] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = STUDENT_DISCOUNTS.filter(
    (s) =>
      (session === '' || s.session === session) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.includes(search) ||
        s.roll.includes(search))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Student Fee Discounts']}
          />
          <button
            onClick={() => navigate('/discountConfig/addDiscount')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Discount
          </button>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Discounts',
              val: STUDENT_DISCOUNTS.length,
              color:
                'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
              vc: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Approved',
              val: STUDENT_DISCOUNTS.filter((s) => s.status === 'approved')
                .length,
              color:
                'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
              vc: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Pending',
              val: STUDENT_DISCOUNTS.filter((s) => s.status === 'pending')
                .length,
              color:
                'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
              vc: 'text-amber-700 dark:text-amber-400',
            },
            {
              label: 'Total Amount',
              val: `৳ ${STUDENT_DISCOUNTS.reduce((a, s) => a + s.totalAmount, 0).toLocaleString()}`,
              color:
                'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
              vc: 'text-purple-700 dark:text-purple-400',
            },
          ].map((s) => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters + Table ────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <Tag size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Student Fee Discounts
              </span>
            </div>
            <div className="flex items-center gap-3 ml-auto flex-wrap">
              <select
                value={session}
                onChange={(e) => {
                  setSession(e.target.value);
                  setPage(1);
                }}
                className={selCls}
              >
                <option value="">All Sessions</option>
                {['2019-2020', '2022-2023', '2024-2025', '2025-2026'].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Name, ID, Roll…"
                  className="pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-48"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {[
                    'SL',
                    'Student Name',
                    'Student ID',
                    'Roll',
                    'Class',
                    'Section',
                    'Session',
                    'Qty',
                    'Total Amount',
                    'Status',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  current.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {s.studentId}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {s.roll}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {s.className}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {s.section}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {s.session}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">
                        {s.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {fmt(s.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLE[s.status] || ''}`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setModal(s)}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}{' '}
              entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${p === page ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Transactions Modal ──────────────────────────────────────────── */}
        {modal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-3xl max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {modal.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Transactions · {modal.className} · {modal.session}
                  </p>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-5">
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                        {[
                          'SL',
                          'Duration',
                          'Transaction Head',
                          'Amount',
                          'Date',
                          'Stage',
                          'Remarks',
                          'Status',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modal.transactions.map((t) => (
                        <tr
                          key={t.sl}
                          className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                        >
                          <td className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500">
                            {t.sl}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {t.duration}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200">
                            {t.head}
                          </td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {fmt(t.amount)}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t.date}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              {t.stage}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 max-w-[150px]">
                            {t.remarks}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${
                                t.status === 'Paid'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    Total Amount:{' '}
                    <span className="text-blue-600 dark:text-blue-400">
                      {fmt(modal.totalAmount)}
                    </span>
                  </p>
                  <button
                    onClick={() => setModal(null)}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
