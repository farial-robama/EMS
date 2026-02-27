import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Search, Archive, Trash2, Check, X,
  ChevronLeft, ChevronRight as CRight, BookOpen,
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

let nextId = 11;

const INITIAL_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  campus:     "BAF Shaheen College Bogura",
  shift:      i % 2 === 0 ? "Day" : "Morning",
  medium:     i < 5 ? "Bangla" : "English",
  eduLevel:   i < 5 ? "Nine-Ten" : "Primary",
  department: i < 5 ? "Science" : "Default",
  className:  i < 5 ? "Nine (Science)" : "Three",
  session:    i < 5 ? "2025-2026" : "2025",
  examName:   i % 2 === 0 ? "Yearly Examination-2025" : "Class Test - 1 2026",
  archived:   false,
}));

const EDU_LEVEL_STYLE = {
  "Nine-Ten": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "Primary":  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "Higher Secondary": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

export default function ProcessedExamList() {
  const [data,        setData]        = useState(INITIAL_DATA);
  const [search,      setSearch]      = useState("");
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast,       setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2600); };

  const handleArchive = (id) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, archived: true } : item));
    showToast("Result archived successfully.");
  };

  const handleDelete = () => {
    setData(prev => prev.filter(item => item.id !== deleteModal.id));
    setDeleteModal(null); showToast("Result deleted.");
  };

  const filtered = data.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const current    = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={["Dashboard", "Exam & Result", "Result Process", "Processed Exam List"]} />

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Exams",  val: data.length,                                 color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
            { label: "Archived",     val: data.filter(d => d.archived).length,         color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", vc: "text-amber-700 dark:text-amber-400" },
            { label: "Active",       val: data.filter(d => !d.archived).length,        color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><BookOpen size={14} /></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Processed Exam List</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{data.length}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
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
                  {["SL","Campus","Shift","Medium","Edu. Level","Department","Class","Session","Exam Name","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr><td colSpan={10} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No records found</td></tr>
                ) : current.map((item, i) => (
                  <tr key={item.id} className={`border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 transition-colors ${item.archived ? "opacity-60" : "hover:bg-gray-50 dark:hover:bg-gray-700/20"}`}>
                    <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{(safePage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[160px] truncate">{item.campus}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.shift === "Day" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}>{item.shift}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.medium}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EDU_LEVEL_STYLE[item.eduLevel] || "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{item.eduLevel}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.session}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{item.examName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {item.archived
                          ? <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Archived</span>
                          : (
                            <button onClick={() => handleArchive(item.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 rounded-lg transition-colors whitespace-nowrap">
                              <Archive size={12} /> Archive
                            </button>
                          )
                        }
                        <button onClick={() => setDeleteModal(item)}
                          className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
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

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Result?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-1"><span className="font-semibold text-gray-700 dark:text-gray-200">{deleteModal.examName}</span></p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-5">{deleteModal.className} · {deleteModal.session}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}