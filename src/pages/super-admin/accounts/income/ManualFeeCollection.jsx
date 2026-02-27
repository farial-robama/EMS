import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, Search, User, CreditCard, Check } from 'lucide-react';

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

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';
const selCls = inp;

const STUDENT = {
  img: '',
  name: 'Md. Sojibul Islam',
  admissionDate: '',
  totalDue: 0,
  totalPaid: 5450,
  totalWaiver: 4000,
  studentId: '18374',
  studentCode: '1916560570030',
  roll: '2201920240110',
  className: 'Finance & Banking (Honours)',
  section: '3rd Year',
  medium: 'Bangla',
  department: 'Finance & Banking',
  shift: 'Day',
};

const ALL_MONTHLY = [
  {
    monthValue: '2023-07',
    month: 'July-2023',
    subtotal: 4000,
    totalWaiver: 1000,
  },
  {
    monthValue: '2023-08',
    month: 'August-2023',
    subtotal: 3000,
    totalWaiver: 500,
  },
  {
    monthValue: '2023-09',
    month: 'September-2023',
    subtotal: 3500,
    totalWaiver: 0,
  },
  {
    monthValue: '2023-10',
    month: 'October-2023',
    subtotal: 2000,
    totalWaiver: 0,
  },
];

const MONTHLY_FEES = [
  {
    month: 'July-2023',
    formFillup: 3450,
    notPromoted: 2000,
    subtotal: 4000,
    totalWaiver: 5450,
    totalPayable: 5450,
    totalPaid: 5450,
  },
];

const MONTH_OPTS = [
  { label: 'July 2023', value: '2023-07' },
  { label: 'August 2023', value: '2023-08' },
  { label: 'September 2023', value: '2023-09' },
  { label: 'October 2023', value: '2023-10' },
];

const fmt = (n) => `৳ ${Number(n).toLocaleString('en-IN')}`;

export default function ManualFeeCollection() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [searchRoll, setSearchRoll] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [fromMonth, setFromMonth] = useState('2023-07');
  const [toMonth, setToMonth] = useState('2023-07');
  const [paymentDate, setPaymentDate] = useState('2025-12-21');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalWaiver, setTotalWaiver] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);

  useEffect(() => {
    const filtered = ALL_MONTHLY.filter(
      (m) => m.monthValue >= fromMonth && m.monthValue <= toMonth
    );
    const total = filtered.reduce((s, f) => s + f.subtotal, 0);
    const waiver = filtered.reduce((s, f) => s + f.totalWaiver, 0);
    setTotalAmount(total);
    setTotalWaiver(waiver);
    setPayableAmount(Math.max(total - waiver, 0));
  }, [fromMonth, toMonth]);

  const handleSearch = () => {
    if (!searchId && !searchRoll)
      return alert('Please enter Student ID or Roll');
    setIsSearched(true);
  };

  const handlePayment = () =>
    navigate('/manualFeeCollection/makePayment', {
      state: {
        student: STUDENT,
        fromMonth,
        toMonth,
        paymentDate,
        totalAmount,
        totalWaiver,
        payableAmount,
      },
    });

  const InfoRow = ({ label, val }) => (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-32 flex-shrink-0">
        {label}
      </span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
        {val || '—'}
      </span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb
          items={['Dashboard', 'Accounts', 'Income', 'Manual Fee Collection']}
        />

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Search size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Search Student
            </span>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Student ID
                </label>
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter student ID"
                  className={inp}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Student Roll
                </label>
                <input
                  value={searchRoll}
                  onChange={(e) => setSearchRoll(e.target.value)}
                  placeholder="Enter roll number"
                  className={inp}
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
              >
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {isSearched && (
          <>
            {/* Student Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300">
                  <User size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Student Information
                </span>
              </div>
              <div className="p-5">
                <div className="flex gap-6 flex-wrap">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {STUDENT.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  {/* Cols */}
                  <div className="flex gap-8 flex-wrap flex-1">
                    <div className="space-y-2">
                      <InfoRow label="Student Name" val={STUDENT.name} />
                      <InfoRow
                        label="Admission Date"
                        val={STUDENT.admissionDate}
                      />
                      <InfoRow label="Total Due" val={fmt(STUDENT.totalDue)} />
                      <InfoRow
                        label="Total Paid"
                        val={fmt(STUDENT.totalPaid)}
                      />
                      <InfoRow
                        label="Total Waiver"
                        val={fmt(STUDENT.totalWaiver)}
                      />
                    </div>
                    <div className="space-y-2">
                      <InfoRow label="Student ID" val={STUDENT.studentId} />
                      <InfoRow label="Student Code" val={STUDENT.studentCode} />
                      <InfoRow label="Roll" val={STUDENT.roll} />
                      <InfoRow label="Class" val={STUDENT.className} />
                      <InfoRow label="Section" val={STUDENT.section} />
                      <InfoRow label="Medium" val={STUDENT.medium} />
                      <InfoRow label="Department" val={STUDENT.department} />
                      <InfoRow label="Shift" val={STUDENT.shift} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Template:{' '}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Fee Collection Template
                  </span>
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300">
                  <CreditCard size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Fee Collection Template
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      From
                    </label>
                    <select
                      value={fromMonth}
                      onChange={(e) => setFromMonth(e.target.value)}
                      className={selCls}
                    >
                      {MONTH_OPTS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      To
                    </label>
                    <select
                      value={toMonth}
                      onChange={(e) => setToMonth(e.target.value)}
                      className={selCls}
                    >
                      {MONTH_OPTS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className={inp}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Total Amount
                    </label>
                    <input
                      type="text"
                      value={fmt(totalAmount)}
                      readOnly
                      className={
                        inp + ' bg-gray-100 dark:bg-gray-600 cursor-default'
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Total Waiver
                    </label>
                    <input
                      type="text"
                      value={fmt(totalWaiver)}
                      readOnly
                      className={
                        inp + ' bg-gray-100 dark:bg-gray-600 cursor-default'
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Payable Amount
                    </label>
                    <input
                      type="text"
                      value={fmt(payableAmount)}
                      readOnly
                      className={
                        inp +
                        ' bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold cursor-default border-green-200 dark:border-green-700'
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handlePayment}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200"
                  >
                    <Check size={15} /> Make Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Fees */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Monthly Fees Information
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                      {[
                        'SL',
                        'Month',
                        'Form Fill-up',
                        'Not Promoted Fee',
                        'Sub Total',
                        'Total Waiver',
                        'Total Payable',
                        'Total Paid',
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
                    {MONTHLY_FEES.map((fee, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                          {fee.month}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {fmt(fee.formFillup)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {fmt(fee.notPromoted)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {fmt(fee.subtotal)}
                        </td>
                        <td className="px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                          {fmt(fee.totalWaiver)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
                          {fmt(fee.totalPayable)}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                          {fmt(fee.totalPaid)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
