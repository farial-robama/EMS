import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Filter, Search, Archive, Eye, Download,
  ChevronLeft, ChevronRight as CRight, ArchiveIcon,
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

// Dummy archived results
const ARCHIVE_DATA = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  studentId:   `2514010120${String(i + 1).padStart(2, "0")}`,
  name:        `Student Name ${i + 1}`,
  roll:        i + 1,
  section:     i < 9 ? "1st Year - Einstein" : "2nd Year - Newton",
  shift:       i % 2 === 0 ? "Day" : "Morning",
  examName:    i < 9 ? "Class Test – 2025" : "Half Yearly Exam 2025",
  gpa:         (3.0 + Math.random() * 2).toFixed(2),
  grade:       ["A+","A","A-","B+","B"][i % 5],
  status:      i % 7 === 0 ? "Failed" : "Passed",
}));

const GRADE_STYLE = {
  "A+": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "A":  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "A-": "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  "B+": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "B":  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

export default function ResultArchive() {
  const [filters, setFilters] = useState({
    eduLevel: "Higher Secondary", department: "Science", className: "HSC-Science",
    section: "1st Year", session: "2025-2026", resultType: "Class Wise", examName: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [search,     setSearch]     = useState("");
  const [perPage,    setPerPage]    = useState(10);
  const [page,       setPage]       = useState(1);

  const handleFilterChange = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleShow = () => { setShowResult(true); setPage(1); setSearch(""); };

  const filtered = ARCHIVE_DATA.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.studentId.includes(search) ||
    r.examName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const current    = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const passCount = filtered.filter(r => r.status === "Passed").length;
  const failCount = filtered.filter(r => r.status === "Failed").length;
  const avgGpa    = (filtered.reduce((s, r) => s + parseFloat(r.gpa), 0) / (filtered.length || 1)).toFixed(2);

  const handleExport = () => {
    const csv = [
      ["SL","Student ID","Name","Roll","Section","Shift","Exam","GPA","Grade","Status"],
      ...filtered.map((r, i) => [i+1, r.studentId, r.name, r.roll, r.section, r.shift, r.examName, r.gpa, r.grade, r.status])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "result-archive.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={["Dashboard", "Exam & Result", "Result Process", "Result Archive"]} />

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300"><Filter size={14} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Archive</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Edu. Level</label>
                <select name="eduLevel" value={filters.eduLevel} onChange={handleFilterChange} className={selCls}>
                  <option>Higher Secondary</option>
                  <option>Primary</option>
                  <option>Secondary</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
                <select name="department" value={filters.department} onChange={handleFilterChange} className={selCls}>
                  <option>Science</option>
                  <option>Arts</option>
                  <option>Commerce</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
                <select name="className" value={filters.className} onChange={handleFilterChange} className={selCls}>
                  <option>HSC-Science</option>
                  <option>HSC-Arts</option>
                  <option>SSC-Science</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Section</label>
                <select name="section" value={filters.section} onChange={handleFilterChange} className={selCls}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
                <select name="session" value={filters.session} onChange={handleFilterChange} className={selCls}>
                  <option>2025-2026</option>
                  <option>2024-2025</option>
                  <option>2023-2024</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Result Type</label>
                <select name="resultType" value={filters.resultType} onChange={handleFilterChange} className={selCls}>
                  <option>Class Wise</option>
                  <option>Student Wise</option>
                  <option>Subject Wise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Exam Name</label>
                <select name="examName" value={filters.examName} onChange={handleFilterChange} className={selCls}>
                  <option value="">★ Inter 1st Year | Class Test – 2025 ★</option>
                  <option>Half Yearly Exam 2025</option>
                  <option>Yearly Examination 2025</option>
                </select>
              </div>
              <button onClick={handleShow}
                className="flex items-center gap-2 justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <ArchiveIcon size={15} /> Show Archive
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {showResult && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Students", val: filtered.length,  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
                { label: "Passed",         val: passCount,         color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
                { label: "Failed",         val: failCount,         color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",         vc: "text-red-600 dark:text-red-400" },
                { label: "Average GPA",    val: avgGpa,            color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
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
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300"><Archive size={14} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Archived Results</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">{filtered.length} records</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 rounded-lg transition-colors">
                    <Download size={13} /> Export CSV
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    Show
                    <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                      className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                      {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search…"
                      className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-44" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                      {["SL","Student ID","Name","Roll","Section","Shift","Exam","GPA","Grade","Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {current.length === 0 ? (
                      <tr><td colSpan={10} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No archived results found</td></tr>
                    ) : current.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">{r.studentId}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{r.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.roll}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.section}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.shift === "Day" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}>{r.shift}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.examName}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200">{r.gpa}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${GRADE_STYLE[r.grade] || "bg-gray-100 text-gray-500"}`}>{r.grade}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === "Passed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length} entries
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
          </>
        )}

      </div>
    </DashboardLayout>
  );
}