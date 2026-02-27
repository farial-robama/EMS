import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Plus, X, Save, Check, ArrowLeft,
  GraduationCap, ListOrdered, Search,
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
const inp    = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const EDU_STYLE = {
  "Primary":           "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "Six-Eight":         "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "Nine-Ten":          "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "Higher Secondary":  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "Pre-Primary":       "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
};

const INITIAL_LIST = [
  { edu: "Primary",          dept: "Default",                 className: "One",                   hasGrade: true  },
  { edu: "Primary",          dept: "Default",                 className: "Two",                   hasGrade: true  },
  { edu: "Primary",          dept: "Default",                 className: "Three",                 hasGrade: false },
  { edu: "Primary",          dept: "Default",                 className: "Four",                  hasGrade: true  },
  { edu: "Primary",          dept: "Default",                 className: "Five",                  hasGrade: false },
  { edu: "Six-Eight",        dept: "Default",                 className: "Six",                   hasGrade: true  },
  { edu: "Six-Eight",        dept: "Default",                 className: "Seven",                 hasGrade: false },
  { edu: "Six-Eight",        dept: "Default",                 className: "Eight",                 hasGrade: true  },
  { edu: "Nine-Ten",         dept: "Science",                 className: "Nine (Science)",        hasGrade: true  },
  { edu: "Nine-Ten",         dept: "Science",                 className: "Ten (Science)",         hasGrade: true  },
  { edu: "Nine-Ten",         dept: "Business Studies Group",  className: "Nine (Business Studies)",hasGrade: false },
  { edu: "Higher Secondary", dept: "Science",                 className: "HSC Science",           hasGrade: true  },
  { edu: "Pre-Primary",      dept: "Default",                 className: "KG",                    hasGrade: false },
  { edu: "Primary",          dept: "Default",                 className: "Careers",               hasGrade: false },
  { edu: "Nine-Ten",         dept: "Humanities Group",        className: "Nine (Humanities)",     hasGrade: false },
  { edu: "Pre-Primary",      dept: "Golden Eagle Nursery",    className: "Nursery",               hasGrade: true  },
  { edu: "Higher Secondary", dept: "Humanities Group",        className: "Humanities",            hasGrade: false },
  { edu: "Higher Secondary", dept: "Business Studies Group",  className: "Business Studies",      hasGrade: true  },
];

const EMPTY_ROW = { min: "", max: "", grade: "", point: "" };

export default function GradePoint() {
  const [view,      setView]      = useState("list"); // "list" | "add" | "set"
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  // Add form state
  const [filters,   setFilters]   = useState({ eduLevel: "", department: "", className: "" });
  const [gradeRows, setGradeRows] = useState([EMPTY_ROW]);

  const addGradeRow    = ()         => setGradeRows(p => [...p, { ...EMPTY_ROW }]);
  const removeGradeRow = (i)        => setGradeRows(p => p.filter((_, idx) => idx !== i));
  const updateGradeRow = (i, k, v)  => setGradeRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2600); };

  const handleSave = () => {
    showToast(); setView("list");
    setGradeRows([EMPTY_ROW]); setFilters({ eduLevel: "", department: "", className: "" });
  };

  const openSetGrade = (row) => { setActiveRow(row); setGradeRows([EMPTY_ROW]); setView("set"); };

  const filtered = INITIAL_LIST.filter(r =>
    r.className.toLowerCase().includes(search.toLowerCase()) ||
    r.edu.toLowerCase().includes(search.toLowerCase()) ||
    r.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Exam & Result", "Result Setup", "Grade Point"]} />
          {view === "list"
            ? (
              <button onClick={() => setView("add")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
                <Plus size={15} /> Add Grade Point
              </button>
            ) : (
              <button onClick={() => setView("list")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
                <ArrowLeft size={15} /> Back to List
              </button>
            )
          }
        </div>

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Grade point saved successfully.
          </div>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────────── */}
        {view === "list" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Classes",   val: INITIAL_LIST.length,                    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
                { label: "Grade Set",       val: INITIAL_LIST.filter(r => r.hasGrade).length,  color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
                { label: "Grade Not Set",   val: INITIAL_LIST.filter(r => !r.hasGrade).length, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",  vc: "text-amber-700 dark:text-amber-400" },
              ].map(s => (
                <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
                  <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><GraduationCap size={14} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Class Wise Grade Point List</span>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search class…"
                    className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-44" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                      {["SL","Campus","Shift","Medium","Edu. Level","Department","Class","Grade Status","Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">BAF Shaheen College Bogura</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Day</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Bangla</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EDU_STYLE[row.edu] || "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{row.edu}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.dept}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.className}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.hasGrade ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"}`}>
                            {row.hasGrade ? "Grade Set" : "Not Set"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => openSetGrade(row)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
                            <ListOrdered size={12} /> Set Grade List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── ADD FORM ──────────────────────────────────────────────── */}
        {(view === "add" || view === "set") && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><GraduationCap size={14} /></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {view === "set" ? `Set Grade List — ${activeRow?.className}` : "Add New Grade Points"}
                </span>
              </div>
              <div className="p-5">
                {view === "add" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Level <span className="text-red-500">*</span></label>
                      <select value={filters.eduLevel} onChange={e => setFilters(f => ({ ...f, eduLevel: e.target.value }))} className={selCls}>
                        <option value="">Select Edu. Level</option>
                        <option>Pre-Primary</option>
                        <option>Primary</option>
                        <option>Six-Eight</option>
                        <option>Nine-Ten</option>
                        <option>Higher Secondary</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
                      <select value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))} className={selCls}>
                        <option value="">Select Department</option>
                        <option>Default</option>
                        <option>Science</option>
                        <option>Business Studies Group</option>
                        <option>Humanities Group</option>
                        <option>Golden Eagle Nursery</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
                      <select value={filters.className} onChange={e => setFilters(f => ({ ...f, className: e.target.value }))} className={selCls}>
                        <option value="">Select Class</option>
                        <option>One</option><option>Two</option><option>Three</option>
                        <option>Four</option><option>Five</option><option>Six</option>
                        <option>Nine (Science)</option><option>HSC Science</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Grade rows table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                        {["#","Min Value","Max Value","Grade","Point",""].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {gradeRows.map((r, i) => (
                        <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                          <td className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 font-medium">{i + 1}</td>
                          <td className="px-3 py-2.5"><input type="number" value={r.min}   placeholder="Min"   onChange={e => updateGradeRow(i, "min",   e.target.value)} className={inp} /></td>
                          <td className="px-3 py-2.5"><input type="number" value={r.max}   placeholder="Max"   onChange={e => updateGradeRow(i, "max",   e.target.value)} className={inp} /></td>
                          <td className="px-3 py-2.5"><input type="text"   value={r.grade} placeholder="Grade" onChange={e => updateGradeRow(i, "grade", e.target.value)} className={inp} /></td>
                          <td className="px-3 py-2.5"><input type="number" value={r.point} placeholder="Point" onChange={e => updateGradeRow(i, "point", e.target.value)} className={inp} /></td>
                          <td className="px-3 py-2.5">
                            <button onClick={() => removeGradeRow(i)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <button onClick={addGradeRow}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors">
                    <Plus size={14} /> Add Grade Row
                  </button>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setView("list")}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                      <Save size={14} /> Save Grade Points
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}