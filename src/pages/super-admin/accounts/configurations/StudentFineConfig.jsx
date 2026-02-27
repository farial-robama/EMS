import React, { useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
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

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';
const selCls = inp;

const FINE_TYPES = [
  {
    id: 'latePayment',
    label: 'Late Payment Fine',
    icon: '⏰',
    color:
      'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800',
    hc: 'bg-orange-100 dark:bg-orange-800/50',
    ic: 'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300',
    hasFeeHead: true,
    defaultRate: [{ days: 10, amount: 100 }],
  },
  {
    id: 'absence',
    label: 'Absence Fine',
    icon: '📋',
    color: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800',
    hc: 'bg-red-100 dark:bg-red-800/50',
    ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
    hasFeeHead: false,
    defaultRate: [{ days: 0, amount: 20 }],
  },
  {
    id: 'exam',
    label: 'Exam Fine',
    icon: '📝',
    color:
      'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800',
    hc: 'bg-blue-100 dark:bg-blue-800/50',
    ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
    hasFeeHead: true,
    defaultRate: [{ days: 0, amount: 50 }],
  },
  {
    id: 'library',
    label: 'Library Fine',
    icon: '📚',
    color:
      'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800',
    hc: 'bg-green-100 dark:bg-green-800/50',
    ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
    hasFeeHead: false,
    defaultRate: [{ days: 0, amount: 30 }],
  },
];

const initState = () =>
  Object.fromEntries(
    FINE_TYPES.map((f) => [
      f.id,
      {
        enabled: 'Yes',
        startDate: '',
        feeHead: '',
        rates: [...f.defaultRate.map((r) => ({ ...r }))],
        remarks: '',
        showDetails: false,
      },
    ])
  );

export default function StudentFineConfigurations() {
  const [fines, setFines] = useState(initState());
  const [saved, setSaved] = useState(false);

  const update = (id, field, value) =>
    setFines((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const toggleDetails = (id) =>
    setFines((prev) => ({
      ...prev,
      [id]: { ...prev[id], showDetails: !prev[id].showDetails },
    }));

  const addRate = (id) =>
    setFines((prev) => ({
      ...prev,
      [id]: { ...prev[id], rates: [...prev[id].rates, { days: 0, amount: 0 }] },
    }));

  const removeRate = (id, idx) =>
    setFines((prev) => ({
      ...prev,
      [id]: { ...prev[id], rates: prev[id].rates.filter((_, i) => i !== idx) },
    }));

  const updateRate = (id, idx, field, value) =>
    setFines((prev) => {
      const rates = [...prev[id].rates];
      rates[idx] = { ...rates[idx], [field]: Number(value) };
      return { ...prev, [id]: { ...prev[id], rates } };
    });

  const handleSave = () => {
    console.log('Saved Fines:', fines);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb
            items={['Dashboard', 'Accounts', 'Student Fine Configurations']}
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
          >
            <Check size={15} /> Save Configuration
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Student fine configuration saved successfully!
          </div>
        )}

        {/* ── Fine Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {FINE_TYPES.map((fine) => {
            const f = fines[fine.id];
            return (
              <div
                key={fine.id}
                className={`rounded-2xl border shadow-sm overflow-hidden ${fine.color}`}
              >
                {/* Card Header */}
                <div
                  className={`flex items-center justify-between px-5 py-4 border-b border-inherit ${fine.hc}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${fine.ic}`}
                    >
                      {fine.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {fine.label}
                    </span>
                  </div>
                  {/* Enable toggle */}
                  <div className="flex items-center gap-2">
                    {['Yes', 'No'].map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`enabled-${fine.id}`}
                          value={v}
                          checked={f.enabled === v}
                          onChange={() => update(fine.id, 'enabled', v)}
                          className="accent-blue-600"
                        />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {v}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {f.enabled === 'No' ? (
                  <div className="px-5 py-6 text-center text-sm text-gray-400 dark:text-gray-500 italic">
                    This fine type is disabled.
                  </div>
                ) : (
                  <div className="p-5 space-y-4">
                    {/* Start Date + Fee Head */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={f.startDate}
                          onChange={(e) =>
                            update(fine.id, 'startDate', e.target.value)
                          }
                          className={inp}
                        />
                      </div>
                      {fine.hasFeeHead && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Fee Head
                          </label>
                          <select
                            value={f.feeHead}
                            onChange={(e) =>
                              update(fine.id, 'feeHead', e.target.value)
                            }
                            className={selCls}
                          >
                            <option value="">Select</option>
                            <option value="Tuition">Tuition</option>
                            <option value="Exam">Exam</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Rate Table */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {fine.label} Rate
                        </label>
                        <button
                          onClick={() => addRate(fine.id)}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                        >
                          <Plus size={12} /> Add Row
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Late Days (Greater than)
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Fee Amount (৳)
                              </th>
                              <th className="px-3 py-2.5 w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {f.rates.map((rate, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 bg-white dark:bg-gray-800"
                              >
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    value={rate.days}
                                    min={0}
                                    onChange={(e) =>
                                      updateRate(
                                        fine.id,
                                        idx,
                                        'days',
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    value={rate.amount}
                                    min={0}
                                    onChange={(e) =>
                                      updateRate(
                                        fine.id,
                                        idx,
                                        'amount',
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                                  />
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {f.rates.length > 1 && (
                                    <button
                                      onClick={() => removeRate(fine.id, idx)}
                                      className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mx-auto"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* More Details toggle */}
                    <button
                      onClick={() => toggleDetails(fine.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${f.showDetails ? 'rotate-180' : ''}`}
                      />
                      {f.showDetails ? 'Hide Details' : 'More Details'}
                    </button>

                    {f.showDetails && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Remarks / Notes
                        </label>
                        <textarea
                          value={f.remarks}
                          rows={3}
                          onChange={(e) =>
                            update(fine.id, 'remarks', e.target.value)
                          }
                          placeholder="Add any notes about this fine..."
                          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom Save ─────────────────────────────────────────────────── */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            <Check size={15} /> Save Configuration
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
