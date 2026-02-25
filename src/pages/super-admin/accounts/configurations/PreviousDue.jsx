import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Search, Plus, X, Check, CreditCard, AlertCircle,
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

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";
const selCls = inp;
const fmt = (n) => `৳ ${Number(n).toFixed(2)}`;

const INITIAL_STUDENTS = [
  {
    id: "S001", roll: "01", name: "Md. Sojibul Islam",
    transactions: [
      { head: "Tuition Fee", month: "January 2025",  due: 500, waiver: 50,  payable: 450, paid: false, remarks: "Late Payment" },
      { head: "Exam Fee",    month: "February 2025", due: 300, waiver: 0,   payable: 300, paid: false, remarks: "" },
    ],
  },
  {
    id: "S002", roll: "02", name: "Jane Smith",
    transactions: [
      { head: "Tuition Fee", month: "January 2025", due: 400, waiver: 0, payable: 400, paid: false, remarks: "" },
    ],
  },
  {
    id: "S003", roll: "03", name: "Michael Brown",
    transactions: [
      { head: "Exam Fee", month: "March 2025", due: 200, waiver: 0, payable: 200, paid: false, remarks: "" },
    ],
  },
];

export default function PreviousDue() {
  const [students,         setStudents]         = useState(INITIAL_STUDENTS);
  const [searchId,         setSearchId]         = useState("");
  const [searchRoll,       setSearchRoll]       = useState("");
  const [searchName,       setSearchName]       = useState("");
  const [filtered,         setFiltered]         = useState([]);
  const [searched,         setSearched]         = useState(false);
  const [modal,            setModal]            = useState(null);
  const [newDue,           setNewDue]           = useState({ head: "", month: "", amount: "" });
  const [dueErrors,        setDueErrors]        = useState({});
  const [toast,            setToast]            = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const applyFilter = (src) => src.filter(s =>
    (searchId   === "" || s.id.toLowerCase().includes(searchId.toLowerCase())) &&
    (searchRoll === "" || s.roll.toLowerCase().includes(searchRoll.toLowerCase())) &&
    (searchName === "" || s.name.toLowerCase().includes(searchName.toLowerCase()))
  );

  const handleSearch = () => { setFiltered(applyFilter(students)); setSearched(true); };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handlePay = (studentId, txIdx) => {
    const updated = students.map(s =>
      s.id === studentId
        ? { ...s, transactions: s.transactions.map((t, i) => i === txIdx ? { ...t, paid: true } : t) }
        : s
    );
    setStudents(updated);
    setFiltered(applyFilter(updated));
    showToast("Payment marked as paid.");
  };

  const openAddDue = (student) => {
    setModal(student);
    setNewDue({ head: "", month: "", amount: "" });
    setDueErrors({});
  };

  const handleAddDue = () => {
    const errs = {};
    if (!newDue.head)   errs.head   = "Required";
    if (!newDue.month)  errs.month  = "Required";
    if (!newDue.amount) errs.amount = "Required";
    if (Object.keys(errs).length) { setDueErrors(errs); return; }

    const updated = students.map(s =>
      s.id === modal.id
        ? { ...s, transactions: [...s.transactions, {
            head: newDue.head, month: newDue.month,
            due: parseFloat(newDue.amount), waiver: 0,
            payable: parseFloat(newDue.amount), paid: false, remarks: "",
          }]}
        : s
    );
    setStudents(updated);
    setFiltered(applyFilter(updated));
    setModal(null);
    showToast("Due added successfully.");
  };

  const totalDue     = (student) => student.transactions.reduce((a, t) => a + (t.paid ? 0 : t.payable), 0);
  const initials     = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <Breadcrumb items={["Dashboard", "Accounts", "Student Due List"]} />

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* ── Search Panel ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Search size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Search Student</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { label: "Student ID",   val: searchId,   set: setSearchId,   ph: "Enter Student ID" },
                { label: "Roll",         val: searchRoll, set: setSearchRoll, ph: "Enter Roll" },
                { label: "Student Name", val: searchName, set: setSearchName, ph: "Enter Name" },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder={f.ph} className={inp} />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────────────── */}
        {searched && filtered.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">No students found matching your search.</p>
          </div>
        )}

        {!searched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
              <Search size={22} className="text-blue-400" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Use the search above to find students with previous dues.</p>
          </div>
        )}

        {filtered.map(student => (
          <div key={student.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Student header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {initials(student.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{student.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">ID: {student.id} · Roll: {student.roll}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Total Payable</p>
                  <p className="text-sm font-bold text-red-500">{fmt(totalDue(student))}</p>
                </div>
                <button onClick={() => openAddDue(student)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Plus size={13} /> Add Due
                </button>
              </div>
            </div>

            {/* Transactions table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                    {["#","Transaction Due Head","Month","Due Amount","Waiver","Payable","Remarks","Status","Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.transactions.map((t, idx) => (
                    <tr key={idx}
                      className={`border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 transition-colors
                        ${t.paid ? "bg-green-50/40 dark:bg-green-900/5" : "hover:bg-gray-50 dark:hover:bg-gray-700/20"}`}>
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t.head}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.month}</td>
                      <td className="px-4 py-3 text-sm text-red-500 font-medium">{fmt(t.due)}</td>
                      <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">{fmt(t.waiver)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100">{fmt(t.payable)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">{t.remarks || "—"}</td>
                      <td className="px-4 py-3">
                        {t.paid
                          ? <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Paid</span>
                          : <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">Unpaid</span>}
                      </td>
                      <td className="px-4 py-3">
                        {!t.paid && (
                          <button onClick={() => handlePay(student.id, idx)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                            <CreditCard size={11} /> Pay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* ── Add Due Modal ─────────────────────────────────────────────── */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Add Due</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{modal.name}</p>
                </div>
                <button onClick={() => setModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Due Transaction Head</label>
                  <select value={newDue.head} onChange={e => setNewDue(d => ({ ...d, head: e.target.value }))} className={selCls}>
                    <option value="">Select</option>
                    <option value="Tuition Fees (Due)">Tuition Fees (Due)</option>
                    <option value="Exam Fees (Due)">Exam Fees (Due)</option>
                    <option value="Other Fees">Other Fees</option>
                  </select>
                  {dueErrors.head && <p className="text-xs text-red-500">{dueErrors.head}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Year & Month</label>
                  <input type="month" value={newDue.month} onChange={e => setNewDue(d => ({ ...d, month: e.target.value }))} className={inp} />
                  {dueErrors.month && <p className="text-xs text-red-500">{dueErrors.month}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount (৳)</label>
                  <input type="number" value={newDue.amount} onChange={e => setNewDue(d => ({ ...d, amount: e.target.value }))} min={0} className={inp} />
                  {dueErrors.amount && <p className="text-xs text-red-500">{dueErrors.amount}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddDue}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}