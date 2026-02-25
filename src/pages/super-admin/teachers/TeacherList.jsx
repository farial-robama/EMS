import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, Search, Edit2, Trash2, ChevronLeft, ChevronRight as CRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const INITIAL_TEACHERS = [
  { code: "E000216", name: "Md. Nazrul Islam",    designation: "Assistant Teacher", indexNo: "—", department: "Science", joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
  { code: "E000217", name: "Marufa",              designation: "Assistant Teacher", indexNo: "—", department: "Arts",    joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
  { code: "E000218", name: "Sazia Laizu",         designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000219", name: "Kaniz Fatema",        designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000005", name: "Muhammad Liaqat Ali", designation: "Assistant Teacher", indexNo: "—", department: "Science", joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
  { code: "E000009", name: "Sabina Laiju",        designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000012", name: "Md. Matiar Rahman",   designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000002", name: "Md. Farhad Hossain",  designation: "Assistant Teacher", indexNo: "—", department: "Arts",    joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
  { code: "E000004", name: "Marjina Begum",        designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000007", name: "Md. Abdur Razzak",    designation: "Assistant Teacher", indexNo: "—", department: "—",       joiningDate: "—", shift: "Day", eduLevel: "—",                type: "Teacher" },
  { code: "E000001", name: "Kumud Ranjan Biswas", designation: "Assistant Teacher", indexNo: "—", department: "Science", joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
  { code: "E000003", name: "Fatima Begum",        designation: "Senior Teacher",    indexNo: "—", department: "Arts",    joiningDate: "—", shift: "Day", eduLevel: "Higher Secondary", type: "Teacher" },
];

const ENTRIES_OPTIONS = [10, 25, 50];

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeP = Math.min(page, totalPages);
  const start = (safeP - 1) * perPage;
  const current = filtered.slice(start, start + perPage);

  const handleDelete = (code) => {
    setTeachers(prev => prev.filter(t => t.code !== code));
    setDeleteConfirm(null);
  };

  const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const deptColor = (dept) => {
    const map = { Science: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", Arts: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", Commerce: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" };
    return map[dept] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Teacher List"]} />
          <button onClick={() => navigate("/admin/teacher-setup/add-teacher")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            + Add Teacher
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Staff", val: teachers.length, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800", vc: "text-blue-700 dark:text-blue-400" },
            { label: "With Department", val: teachers.filter(t => t.department !== "—").length, color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
            { label: "Unset Info", val: teachers.filter(t => t.department === "—").length, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300">
                <Users size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Teacher List</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                Show
                <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                  className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                  {ENTRIES_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                entries
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search name, code, dept…"
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-52" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["SL", "Teacher", "Designation", "Index No", "Department", "Joining Date", "Shift", "Edu. Level", "Type", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  current.map((t, i) => (
                    <tr key={t.code}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{start + i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {initials(t.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{t.designation}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{t.indexNo}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColor(t.department)}`}>
                          {t.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{t.joiningDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{t.shift}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.eduLevel}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => navigate("/admin/teacher-setup/add-teacher", { state: { teacher: t } })}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm(t.code)}
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

          {/* Pagination */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{start + 1}</span> to{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{Math.min(start + perPage, filtered.length)}</span> of{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safeP === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safeP) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => p === "..." ? (
                  <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                      ${p === safeP
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {p}
                  </button>
                ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safeP === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <CRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Teacher?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                This will permanently remove{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {teachers.find(t => t.code === deleteConfirm)?.name}
                </span>{" "}
                from the list.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">
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