import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Search, Eye, Check, X, Filter,
  ChevronLeft, ChevronRight as CRight, Users, ClipboardCheck,
} from "lucide-react";

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

const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const STUDENTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  studentId: `25140101201${String(i).padStart(2, "0")}`,
  name: `Student Name ${i + 1}`,
  fatherName: "Father Name",
  motherName: "Mother Name",
  phone: "01770001654",
  roll: i + 1,
  shift: i % 2 === 0 ? "Day" : "Morning",
  section: i < 12 ? "1st Year - Einstein" : "2nd Year - Newton",
  processed: null,
  examName: "Class Test - 1 2026",
  photo: "",
}));

export default function ProcessResult() {
  const [filters, setFilters]       = useState({ eduLevel: "", department: "", className: "", session: "", exam: "" });
  const [showTable, setShowTable]   = useState(false);
  const [search, setSearch]         = useState("");
  const [perPage, setPerPage]       = useState(10);
  const [page, setPage]             = useState(1);
  const [checked, setChecked]       = useState({});
  const [checkAll, setCheckAll]     = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [successModal, setSuccessModal] = useState("");
  const [students, setStudents]     = useState(STUDENTS);

  const handleFilterChange = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleShow = () => { setShowTable(true); setPage(1); setChecked({}); setCheckAll(false); };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.includes(search) ||
    String(s.roll).includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const current    = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleCheckAll = () => {
    const newVal = !checkAll;
    setCheckAll(newVal);
    const newChecked = {};
    current.forEach(s => { newChecked[s.id] = newVal; });
    setChecked(prev => ({ ...prev, ...newChecked }));
  };

  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedIds = Object.entries(checked).filter(([, v]) => v).map(([k]) => +k);

  const handleProcessAll = () => {
    setStudents(prev => prev.map(s => ({ ...s, processed: "Processed" })));
    setSuccessModal("all");
  };

  const handleProcessSelected = () => {
    if (selectedIds.length === 0) return alert("Please select at least one student.");
    setStudents(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, processed: "Processed" } : s));
    setSuccessModal("selected");
  };

  const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={["Dashboard", "Exam & Result", "Result Process", "Process Result"]} />

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><Filter size={14} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Students</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Edu. Level</label>
                <select name="eduLevel" value={filters.eduLevel} onChange={handleFilterChange} className={selCls}>
                  <option value="">Select Level</option>
                  <option>Primary</option>
                  <option>Higher Secondary</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
                <select name="department" value={filters.department} onChange={handleFilterChange} className={selCls}>
                  <option value="">Select Department</option>
                  <option>Science</option>
                  <option>Arts</option>
                  <option>Commerce</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
                <select name="className" value={filters.className} onChange={handleFilterChange} className={selCls}>
                  <option value="">Select Class</option>
                  <option>HSC Science</option>
                  <option>HSC Arts</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
                <select name="session" value={filters.session} onChange={handleFilterChange} className={selCls}>
                  <option value="">Select Session</option>
                  <option>2025-2026</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Exam <span className="text-red-500">*</span></label>
                <select name="exam" value={filters.exam} onChange={handleFilterChange} className={selCls}>
                  <option value="">Select Exam Name</option>
                  <option>Class Test - 1 2026</option>
                  <option>Half Yearly Exam 2025</option>
                  <option>Yearly Examination 2025</option>
                </select>
              </div>
              <button onClick={handleShow}
                className="flex items-center gap-2 justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Users size={15} /> Show Students
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {showTable && (
          <>
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Students", val: filtered.length,                                           color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
                { label: "Processed",      val: students.filter(s => s.processed === "Processed").length,  color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
                { label: "Selected",       val: selectedIds.length,                                        color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
              ].map(s => (
                <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
                  <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  Show
                  <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                    className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                    {[10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  entries
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search students…"
                    className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-48" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">SL</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        <input type="checkbox" checked={checkAll} onChange={toggleCheckAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
                      </th>
                      {["Student ID","Photo","Name","Contact","Roll","Shift","Section","Result","Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {current.length === 0 ? (
                      <tr><td colSpan={11} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No students found</td></tr>
                    ) : current.map((s, i) => (
                      <tr key={s.id} className={`border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 transition-colors ${checked[s.id] ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-700/20"}`}>
                        <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={!!checked[s.id]} onChange={() => toggleCheck(s.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">{s.studentId}</td>
                        <td className="px-4 py-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                            {initials(s.name)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{s.name}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-medium">{s.roll}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.shift === "Day" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}>{s.shift}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.section}</td>
                        <td className="px-4 py-3">
                          {s.processed === "Processed"
                            ? <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Processed</span>
                            : <span className="text-xs text-gray-400 dark:text-gray-500 italic">Pending</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setViewDetails(s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons + Pagination */}
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={handleProcessAll}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200">
                    <ClipboardCheck size={15} /> Process All Results
                  </button>
                  <button onClick={handleProcessSelected}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors
                      ${selectedIds.length > 0
                        ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
                        : "text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"}`}>
                    <Check size={15} /> Process Selected ({selectedIds.length})
                  </button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">«</button>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={14} /></button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce((acc, p, idx, arr) => { if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("…"); acc.push(p); return acc; }, [])
                      .map((p, idx) => p === "…"
                        ? <span key={`e${idx}`} className="w-8 flex items-center justify-center text-xs text-gray-400">…</span>
                        : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === safePage ? "bg-blue-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{p}</button>
                      )}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><CRight size={14} /></button>
                    <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="w-8 h-8 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">»</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* View Details Modal */}
        {viewDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setViewDetails(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><Eye size={14} /></div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Details</h3>
                </div>
                <button onClick={() => setViewDetails(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {initials(viewDetails.name)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{viewDetails.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Roll: {viewDetails.roll} · ID: {viewDetails.studentId}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{viewDetails.section}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Father Name", val: viewDetails.fatherName },
                    { label: "Mother Name", val: viewDetails.motherName },
                    { label: "Phone",       val: viewDetails.phone },
                    { label: "Shift",       val: viewDetails.shift },
                    { label: "Exam",        val: viewDetails.examName },
                    { label: "Result",      val: viewDetails.processed || "Pending" },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-28 flex-shrink-0">{r.label}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setViewDetails(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Result Processed!</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
                {successModal === "all" ? "All student results have been processed successfully." : `${selectedIds.length} selected student result(s) processed successfully.`}
              </p>
              <button onClick={() => { setSuccessModal(""); setChecked({}); setCheckAll(false); }}
                className="w-full py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}