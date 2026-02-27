import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { ChevronRight, Plus, X, Upload, Check } from 'lucide-react';

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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const YEARS = Array.from({ length: 5 }, (_, i) => 2021 + i);
const TX_HEADS = [
  'Donation',
  'Service',
  'Miscellaneous',
  'Grant',
  'Sponsorship',
];

const fmt = (n) => `৳ ${Number(n).toLocaleString('en-IN')}`;

export default function OtherIncome() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [entries, setEntries] = useState([{ transactionHead: '', amount: '' }]);
  const [invoiceDate, setInvoiceDate] = useState('2025-12-22');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [checkNo, setCheckNo] = useState('');
  const [checkDate, setCheckDate] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(entries.reduce((s, e) => s + Number(e.amount || 0), 0));
  }, [entries]);

  const handleEntryChange = (idx, field, value) => {
    const updated = [...entries];
    updated[idx][field] = value;
    setEntries(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/otherIncome/invoice', {
      state: {
        entries,
        invoiceDate,
        month,
        year,
        checkNo,
        checkDate,
        file,
        description,
        totalAmount,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb
          items={['Dashboard', 'Accounts', 'Income', 'Other Income']}
        />

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {entries.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Transaction Entries
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {fmt(totalAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Total Amount
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {entries.filter((e) => e.transactionHead).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Filled Entries
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Part 1 – Transaction Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                  <Plus size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Transaction Entries
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {entries.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEntries((prev) => [
                    ...prev,
                    { transactionHead: '', amount: '' },
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus size={12} /> Add More
              </button>
            </div>
            <div className="p-5 space-y-3">
              {entries.map((entry, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex flex-col gap-1.5 flex-1">
                    {i === 0 && (
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Transaction Head
                      </label>
                    )}
                    <select
                      value={entry.transactionHead}
                      onChange={(e) =>
                        handleEntryChange(i, 'transactionHead', e.target.value)
                      }
                      className={selCls}
                    >
                      <option value="">Select Transaction Head</option>
                      {TX_HEADS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 w-40">
                    {i === 0 && (
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Amount
                      </label>
                    )}
                    <input
                      type="number"
                      value={entry.amount}
                      onChange={(e) =>
                        handleEntryChange(i, 'amount', e.target.value)
                      }
                      placeholder="0"
                      className={inp}
                    />
                  </div>
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setEntries((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 mb-px"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
              {/* Total row */}
              <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Total:
                  </span>
                  <span className="text-base font-bold text-green-600 dark:text-green-400">
                    {fmt(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Part 2 – Invoice Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Invoice Details
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className={inp}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={selCls}
                  >
                    <option value="">Select Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={selCls}
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Check No
                  </label>
                  <input
                    type="text"
                    value={checkNo}
                    onChange={(e) => setCheckNo(e.target.value)}
                    placeholder="Enter check number"
                    className={inp}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Check Date
                  </label>
                  <input
                    type="date"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                    className={inp}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Attachment
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`flex items-center gap-2 ${inp} justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
                  >
                    <Upload size={14} className="text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 truncate">
                      {file ? file.name : 'Choose file…'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Purpose / Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter purpose or description"
                    rows={3}
                    className={inp + ' resize-none'}
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
                      inp +
                      ' bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold cursor-default border-green-200 dark:border-green-700'
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200"
                >
                  <Check size={15} /> Pay Now
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
