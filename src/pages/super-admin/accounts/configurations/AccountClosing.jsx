import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Plus, Download, TrendingUp, TrendingDown,
  DollarSign, Lock, Check, X,
} from "lucide-react";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1
          ? "text-gray-700 dark:text-gray-200 font-medium"
          : "hover:text-blue-500 cursor-pointer transition-colors"}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS  = Array.from({ length: 10 }, (_, i) => 2025 + i);
const fmt    = (n) => `৳ ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function AccountClosing() {
  const [accounts, setAccounts] = useState([
    { id: 1, month: "January 2025",  previousBalance: 15000, totalIncome: 8000,  totalExpense: 5000, closed: false },
    { id: 2, month: "February 2025", previousBalance: 18000, totalIncome: 12000, totalExpense: 7000, closed: false },
    { id: 3, month: "March 2025",    previousBalance: 23000, totalIncome: 9000,  totalExpense: 4000, closed: true  },
  ]);
  const [showModal,     setShowModal]     = useState(false);
  const [selMonth,      setSelMonth]      = useState("");
  const [selYear,       setSelYear]       = useState("");
  const [confirmClose,  setConfirmClose]  = useState(null);
  const [toast,         setToast]         = useState("");

  const net = (a) => a.previousBalance + a.totalIncome - a.totalExpense;

  const totals = accounts.reduce((acc, a) => ({
    prev: acc.prev + a.previousBalance,
    inc:  acc.inc  + a.totalIncome,
    exp:  acc.exp  + a.totalExpense,
    net:  acc.net  + net(a),
  }), { prev: 0, inc: 0, exp: 0, net: 0 });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = () => {
    if (!selMonth || !selYear) return;
    const label = `${selMonth} ${selYear}`;
    if (accounts.find(a => a.month === label)) { showToast("This month is already added."); return; }
    const last = accounts[accounts.length - 1];
    setAccounts(prev => [...prev, {
      id: Date.now(), month: label,
      previousBalance: last ? net(last) : 0,
      totalIncome: 0, totalExpense: 0, closed: false,
    }]);
    setSelMonth(""); setSelYear(""); setShowModal(false);
    showToast(`${label} added successfully.`);
  };

  const handleClose = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, closed: true } : a));
    setConfirmClose(null);
    showToast("Month closed successfully.");
  };

  const handleExportCSV = () => {
    let csv = "Month,Previous Balance,Total Income,Total Expense,Net Balance\n";
    accounts.forEach(a => csv += `${a.month},${a.previousBalance},${a.totalIncome},${a.totalExpense},${net(a)}\n`);
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "account_closing.csv";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Accounts", "Account Closing"]} />
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            <button onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              🖨 Print
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Plus size={15} /> Add New Month
            </button>
          </div>
        </div>

        {/* ── Toast ──────────────────────────────────────────────────────── */}
        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* ── Summary Stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Prev. Balance", val: totals.prev, Icon: DollarSign,   bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",     vc: "text-blue-700 dark:text-blue-400",     ic: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" },
            { label: "Total Income",        val: totals.inc,  Icon: TrendingUp,   bg: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",  vc: "text-green-700 dark:text-green-400",   ic: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300" },
            { label: "Total Expense",       val: totals.exp,  Icon: TrendingDown, bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",          vc: "text-red-700 dark:text-red-400",       ic: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300" },
            { label: "Net Balance",         val: totals.net,  Icon: DollarSign,   bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400", ic: "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300" },
          ].map(({ label, val, Icon, bg, vc, ic }) => (
            <div key={label} className={`p-4 rounded-xl border ${bg} flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className={`text-lg font-bold leading-tight ${vc}`}>{fmt(val)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <Lock size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Monthly Account Closing</span>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
              {accounts.filter(a => a.closed).length} closed · {accounts.filter(a => !a.closed).length} open
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["Month","Previous Balance","Total Income","Total Expense","Net Balance","Status","Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id}
                    className={`border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 transition-colors
                      ${acc.closed ? "bg-gray-50/60 dark:bg-gray-700/10" : "hover:bg-gray-50 dark:hover:bg-gray-700/20"}`}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{acc.month}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{fmt(acc.previousBalance)}</td>
                    <td className="px-5 py-3 text-sm font-medium text-green-600 dark:text-green-400">{fmt(acc.totalIncome)}</td>
                    <td className="px-5 py-3 text-sm font-medium text-red-500">{fmt(acc.totalExpense)}</td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-800 dark:text-gray-100">{fmt(net(acc))}</td>
                    <td className="px-5 py-3">
                      {acc.closed
                        ? <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">Closed</span>
                        : <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Open</span>}
                    </td>
                    <td className="px-5 py-3">
                      {!acc.closed && (
                        <button onClick={() => setConfirmClose(acc)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                          <Lock size={12} /> Close Month
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 dark:bg-gray-700/40 border-t-2 border-gray-200 dark:border-gray-600 font-semibold">
                  <td className="px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200">Totals</td>
                  <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">{fmt(totals.prev)}</td>
                  <td className="px-5 py-3 text-sm text-green-600 dark:text-green-400">{fmt(totals.inc)}</td>
                  <td className="px-5 py-3 text-sm text-red-500">{fmt(totals.exp)}</td>
                  <td className="px-5 py-3 text-sm font-bold text-purple-700 dark:text-purple-400">{fmt(totals.net)}</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Add Month Modal ─────────────────────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Add Month Closing</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Month</label>
                  <select value={selMonth} onChange={e => setSelMonth(e.target.value)} className={selCls}>
                    <option value="">Select Month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Year</label>
                  <select value={selYear} onChange={e => setSelYear(e.target.value)} className={selCls}>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowModal(false); setSelMonth(""); setSelYear(""); }}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!selMonth || !selYear}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Close Modal ─────────────────────────────────────────── */}
        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Lock size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Close Month?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                Are you sure you want to permanently close{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">{confirmClose.month}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmClose(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleClose(confirmClose.id)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                  Close Month
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}