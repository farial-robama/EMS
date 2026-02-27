import React, { useState, useMemo } from 'react';
import {
  Users,
  Save,
  CheckSquare,
  Square,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Download,
  FileText,
  Calculator,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const initialTeachers = [
  {
    id: 1,
    name: 'Md. Nazrul Islam',
    designation: 'Assistant Teacher',
    monthlyAmount: 30000,
  },
  {
    id: 2,
    name: 'Marufa Akter',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
  {
    id: 3,
    name: 'Sazia Laizu',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
  {
    id: 4,
    name: 'Kaniz Fatema',
    designation: 'Senior Teacher',
    monthlyAmount: 35000,
  },
  {
    id: 5,
    name: 'Muhammad Liaqat Ali',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
  {
    id: 6,
    name: 'Fatema Begum',
    designation: 'Head Teacher',
    monthlyAmount: 45000,
  },
  {
    id: 7,
    name: 'Rafiqul Islam',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
  {
    id: 8,
    name: 'Nasima Khanam',
    designation: 'Senior Teacher',
    monthlyAmount: 35000,
  },
  {
    id: 9,
    name: 'Jahangir Alam',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
  {
    id: 10,
    name: 'Sharmin Sultana',
    designation: 'Assistant Teacher',
    monthlyAmount: 28000,
  },
];

const bonusOptions = ['Performance Bonus', 'Festival Bonus', 'Other Bonus'];

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
const YEARS = ['2025', '2026', '2027'];

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

export default function TeacherSalary() {
  const [teachers, setTeachers] = useState(
    initialTeachers.map((t) => ({
      ...t,
      selected: false,
      twd: '',
      tpd: '',
      tad: '',
      tld: '',
      thd: '',
      fine: '',
      bonusPurpose: '',
      bonus: '',
    }))
  );
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState('2025');
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const PER_PAGE = 10;

  const filtered = useMemo(
    () =>
      teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.designation.toLowerCase().includes(search.toLowerCase())
      ),
    [teachers, search]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const allSelected = paged.every((t) => t.selected);
  const someSelected = paged.some((t) => t.selected) && !allSelected;

  const toggleAll = () => {
    const pagedIds = new Set(paged.map((t) => t.id));
    setTeachers((prev) =>
      prev.map((t) =>
        pagedIds.has(t.id) ? { ...t, selected: !allSelected } : t
      )
    );
  };

  const update = (id, field, value) =>
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

  const calcTotal = (t) => {
    const base = t.monthlyAmount;
    const fine = parseFloat(t.fine) || 0;
    const bonus = parseFloat(t.bonus) || 0;
    // deduct half-day as half-day = monthlyAmount / (twd*2) per half day
    const twd = parseFloat(t.twd) || 26;
    const tad = parseFloat(t.tad) || 0;
    const thd = parseFloat(t.thd) || 0;
    const perDay = twd > 0 ? base / twd : 0;
    const deductions = tad * perDay + thd * perDay * 0.5 + fine;
    return Math.max(0, base - deductions + bonus).toFixed(2);
  };

  const selectedCount = teachers.filter((t) => t.selected).length;
  const totalPayable = teachers
    .filter((t) => t.selected)
    .reduce((s, t) => s + parseFloat(calcTotal(t)), 0);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const numInp =
    'w-16 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 text-center';

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Accounts', 'Teacher Salary']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users size={22} className="text-blue-500" /> Teacher Salary
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || selectedCount === 0}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
              ${saving || selectedCount === 0 ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : saved ? 'bg-green-600 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : saved ? (
              <>
                <Save size={15} />
                Saved!
              </>
            ) : (
              <>
                <Save size={15} />
                Save Salary
              </>
            )}
          </button>
        </div>

        {/* Month / Year selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
              >
                {MONTHS.map((m) => (
                  <option key={m}>{m}</option>
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
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
              >
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Selected
              </label>
              <div className="flex items-center h-[42px] px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                {selectedCount} teacher{selectedCount !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Payable
              </label>
              <div className="flex items-center h-[42px] px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-bold">
                ৳ {totalPayable.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Calculator size={16} className="text-blue-500" />
              Salary Sheet — {month} {year}
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {filtered.length} teachers
              </span>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                placeholder="Search teacher…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => el && (el.indeterminate = someSelected)}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </th>
                  {[
                    '#',
                    'Teacher Name',
                    'Designation',
                    'Monthly (৳)',
                    'TWD',
                    'TPD',
                    'TAD',
                    'TLD',
                    'THD',
                    'Fine (৳)',
                    'Bonus Purpose',
                    'Bonus (৳)',
                    'Total (৳)',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`transition-colors ${t.selected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={t.selected}
                        onChange={(e) =>
                          update(t.id, 'selected', e.target.checked)
                        }
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-400 dark:text-gray-500">
                      {(safePage - 1) * PER_PAGE + i + 1}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {t.name}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">
                        {t.designation}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
                      {t.monthlyAmount.toLocaleString()}
                    </td>
                    {['twd', 'tpd', 'tad', 'tld', 'thd'].map((f) => (
                      <td key={f} className="px-2 py-3">
                        <input
                          type="number"
                          min="0"
                          value={t[f]}
                          onChange={(e) => update(t.id, f, e.target.value)}
                          placeholder="0"
                          className={numInp}
                        />
                      </td>
                    ))}
                    <td className="px-2 py-3">
                      <input
                        type="number"
                        min="0"
                        value={t.fine}
                        onChange={(e) => update(t.id, 'fine', e.target.value)}
                        placeholder="0"
                        className={numInp}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={t.bonusPurpose}
                        onChange={(e) =>
                          update(t.id, 'bonusPurpose', e.target.value)
                        }
                        className="w-36 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"
                      >
                        <option value="">None</option>
                        {bonusOptions.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <input
                        type="number"
                        min="0"
                        value={t.bonus}
                        onChange={(e) => update(t.id, 'bonus', e.target.value)}
                        placeholder="0"
                        className={numInp}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">
                        ৳{parseFloat(calcTotal(t)).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing{' '}
              {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
              {Math.min(safePage * PER_PAGE, filtered.length)} of{' '}
              {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            Abbreviations
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            <strong>TWD</strong>: Total Working Days &nbsp;|&nbsp;{' '}
            <strong>TPD</strong>: Total Present Days &nbsp;|&nbsp;{' '}
            <strong>TAD</strong>: Total Absent Days &nbsp;|&nbsp;{' '}
            <strong>TLD</strong>: Total Leave Days &nbsp;|&nbsp;{' '}
            <strong>THD</strong>: Total Half Days
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
