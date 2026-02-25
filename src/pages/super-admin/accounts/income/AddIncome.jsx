import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ChevronRight, ChevronDown, Plus, Check, Trash2, DollarSign, X } from "lucide-react";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1 ? "text-gray-700 dark:text-gray-200 font-medium" : "hover:text-blue-500 cursor-pointer transition-colors"}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}><Icon size={14} /></div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

const inp = (err) => `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"}`;
const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const INCOME_HEADS = ["Tuition Fee","Admission Fee","Library Fee","Lab Fee","Exam Fee","Donation","Service Charge","Miscellaneous","Sports Fee","Cultural Fee","Development Fee","ICT Fee"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS  = Array.from({ length: 6 }, (_, i) => 2020 + i);
const PAYMENT_METHODS = ["Cash","Bank Transfer","Cheque","Online","Mobile Banking"];

let nextId = 4;

const INITIAL_RECORDS = [
  { id: 1, head: "Tuition Fee",  month: "July",   year: 2025, amount: 5000, method: "Cash",          date: "2025-07-05", description: "Monthly tuition fee",    status: "Received" },
  { id: 2, head: "Admission Fee",month: "July",   year: 2025, amount: 2000, method: "Bank Transfer",  date: "2025-07-10", description: "New student admission",  status: "Received" },
  { id: 3, head: "Lab Fee",      month: "August", year: 2025, amount: 1500, method: "Cash",          date: "2025-08-02", description: "Science lab fee",        status: "Pending"  },
];

const STATUS_STYLE = {
  Received: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Pending:  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Cancelled:"bg-red-100 dark:bg-red-900/30 text-red-500",
};

const EMPTY_FORM = { head: "", month: "", year: "", amount: "", method: "Cash", date: "", description: "", status: "Received" };

const fmt = (n) => `৳ ${Number(n).toLocaleString("en-IN")}`;

export default function AddIncome() {
  const navigate = useNavigate();
  const [records,  setRecords]  = useState(INITIAL_RECORDS);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [editId,   setEditId]   = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saved,    setSaved]    = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const totalReceived = records.filter(r => r.status === "Received").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending  = records.filter(r => r.status === "Pending").reduce((s, r) => s + Number(r.amount), 0);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.head)          e.head   = "Required";
    if (!form.month)         e.month  = "Required";
    if (!form.year)          e.year   = "Required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.date)          e.date   = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editId !== null) {
      setRecords(prev => prev.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      setRecords(prev => [...prev, { ...form, id: nextId++ }]);
    }
    setForm(EMPTY_FORM); setErrors({});
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = (record) => {
    setForm({ head: record.head, month: record.month, year: record.year, amount: record.amount, method: record.method, date: record.date, description: record.description, status: record.status });
    setEditId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const F = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  const filtered = records.filter(r => filterStatus === "" || r.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Accounts", "Income", "Add Income"]} />
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Income entry {editId !== null ? "updated" : "added"} successfully!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Records",  val: records.length,       color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",       vc: "text-blue-700 dark:text-blue-400" },
            { label: "Total Received", val: fmt(totalReceived),   color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",   vc: "text-green-700 dark:text-green-400" },
            { label: "Total Pending",  val: fmt(totalPending),    color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",   vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <SectionCard title={editId !== null ? "Edit Income Entry" : "Add Income Entry"} icon={Plus}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <F label="Income Head" required error={errors.head}>
                <select name="head" value={form.head} onChange={handleChange} className={selCls}>
                  <option value="">Select Head</option>
                  {INCOME_HEADS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </F>
              <F label="Month" required error={errors.month}>
                <select name="month" value={form.month} onChange={handleChange} className={selCls}>
                  <option value="">Select Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </F>
              <F label="Year" required error={errors.year}>
                <select name="year" value={form.year} onChange={handleChange} className={selCls}>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </F>
              <F label="Amount (৳)" required error={errors.amount}>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" className={inp(errors.amount)} />
              </F>
              <F label="Payment Method">
                <select name="method" value={form.method} onChange={handleChange} className={selCls}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </F>
              <F label="Date" required error={errors.date}>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={inp(errors.date)} />
              </F>
              <F label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={selCls}>
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </F>
              <F label="Description">
                <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Optional note" className={inp(false)} />
              </F>
            </div>
            <div className="flex justify-end gap-2">
              {editId !== null && (
                <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
              )}
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                {editId !== null ? <><Check size={15} /> Update</> : <><Plus size={15} /> Add Entry</>}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* Records List */}
        <SectionCard title="Income Records" icon={DollarSign}
          iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300">
          <div className="flex gap-3 items-center mb-4 flex-wrap">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
              <option value="">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{filtered.length} records</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["SL","Income Head","Month/Year","Amount","Method","Date","Description","Status","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">No income records found</td></tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{r.head}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.month} {r.year}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{fmt(r.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{r.method}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{r.description || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[r.status] || ""}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => startEdit(r)}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors text-xs font-bold">
                            ✏
                          </button>
                          <button onClick={() => setDeleteId(r.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Entry?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "<span className="font-medium text-gray-700 dark:text-gray-200">{records.find(r => r.id === deleteId)?.head}</span>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => { setRecords(prev => prev.filter(r => r.id !== deleteId)); setDeleteId(null); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}