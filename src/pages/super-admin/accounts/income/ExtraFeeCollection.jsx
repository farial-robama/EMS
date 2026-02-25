import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ChevronRight, Search, User, Plus, X, Check, FileText } from "lucide-react";

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

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";
const selCls = inp;

const STUDENT = {
  code: "2414020080238", name: "Tansir Khan Sajid", roll: "23",
  className: "12th Grade", section: "A", department: "Science",
  medium: "English", shift: "Morning",
  invoiceDate: "2025-12-22", paymentUpTo: "December 2025",
};

const TX_HEADS = ["Library Fee","Lab Fee","ID Card Fee","Sports Fee","Cultural Fee","Exam Fee"];
const CAUSES   = ["Lost","Damaged","Old ID","Expired","Other"];

const fmt = (n) => `৳ ${Number(n).toLocaleString("en-IN")}`;

export default function ExtraFeeCollection() {
  const navigate = useNavigate();
  const [studentID,  setStudentID]  = useState("");
  const [studentRoll,setStudentRoll]= useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [entries,    setEntries]    = useState([{ transactionHead: "", amount: "" }]);
  const [cause,      setCause]      = useState("");
  const [totalAmount,setTotalAmount]= useState(0);
  const [markedPaid, setMarkedPaid] = useState(false);

  useEffect(() => {
    setTotalAmount(entries.reduce((s, e) => s + Number(e.amount || 0), 0));
  }, [entries]);

  const handleEntryChange = (idx, field, value) => {
    const updated = [...entries];
    updated[idx][field] = value;
    setEntries(updated);
  };

  const handleSearch = () => {
    if (!studentID && !studentRoll) return alert("Please enter Student ID or Roll");
    setIsSearched(true);
  };

  const handleGenerateInvoice = () =>
    navigate("/extraFeeCollection/invoice", { state: { student: STUDENT, entries, totalAmount, cause } });

  const InfoRow = ({ label, val }) => (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{val || "—"}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={["Dashboard", "Accounts", "Income", "Extra Fee Collection"]} />

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><Search size={14} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Search Student</span>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student ID</label>
                <input value={studentID} onChange={e => setStudentID(e.target.value)} placeholder="Enter student ID" className={inp} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Roll</label>
                <input value={studentRoll} onChange={e => setStudentRoll(e.target.value)} placeholder="Enter roll number" className={inp} />
              </div>
              <button onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"><User size={14} /></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Information</span>
              </div>
              <div className="p-5">
                <div className="flex gap-6 flex-wrap">
                  <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400">
                    {STUDENT.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex gap-8 flex-wrap flex-1">
                    <div className="space-y-2">
                      <InfoRow label="Student Code"  val={STUDENT.code} />
                      <InfoRow label="Name"          val={STUDENT.name} />
                      <InfoRow label="Roll"          val={STUDENT.roll} />
                      <InfoRow label="Class"         val={STUDENT.className} />
                      <InfoRow label="Section"       val={STUDENT.section} />
                    </div>
                    <div className="space-y-2">
                      <InfoRow label="Department"    val={STUDENT.department} />
                      <InfoRow label="Medium"        val={STUDENT.medium} />
                      <InfoRow label="Shift"         val={STUDENT.shift} />
                      <InfoRow label="Invoice Date"  val={STUDENT.invoiceDate} />
                      <InfoRow label="Payment Up To" val={STUDENT.paymentUpTo} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Entries */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Transaction Heads & Amounts</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{entries.length}</span>
                </div>
                <button type="button" onClick={() => setEntries(prev => [...prev, { transactionHead: "", amount: "" }])}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors">
                  <Plus size={12} /> Add More
                </button>
              </div>
              <div className="p-5 space-y-3">
                {entries.map((entry, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <div className="flex flex-col gap-1.5 flex-1">
                      {i === 0 && <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Transaction Head</label>}
                      <select value={entry.transactionHead} onChange={e => handleEntryChange(i, "transactionHead", e.target.value)} className={selCls}>
                        <option value="">Select Transaction Head</option>
                        {TX_HEADS.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5 w-36">
                      {i === 0 && <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</label>}
                      <input type="number" value={entry.amount} onChange={e => handleEntryChange(i, "amount", e.target.value)} placeholder="0" className={inp} />
                    </div>
                    {entries.length > 1 && (
                      <button type="button" onClick={() => setEntries(prev => prev.filter((_, idx) => idx !== i))}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 mb-px">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total + Cause + Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Fee Summary & Actions</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Amount</label>
                    <input type="text" value={fmt(totalAmount)} readOnly
                      className={inp + " bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold cursor-default border-green-200 dark:border-green-700"} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cause of ID Card Re-issue</label>
                    <select value={cause} onChange={e => setCause(e.target.value)} className={selCls}>
                      <option value="">Select Cause</option>
                      {CAUSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide invisible">Action</label>
                    <button type="button" onClick={() => setMarkedPaid(true)}
                      className={`flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors
                        ${markedPaid
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                          : "text-white bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-200"}`}>
                      <Check size={15} /> {markedPaid ? "Marked as Paid" : "Mark As Paid"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" onClick={handleGenerateInvoice}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                    <FileText size={15} /> Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}