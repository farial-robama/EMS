import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Save, Check, Info, BarChart2, Search,
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

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer
      ${checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
      ${checked ? "translate-x-4" : "translate-x-0"}`} />
  </button>
);

const EDU_STYLE = {
  "Primary":           "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "Six-Eight":         "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "Nine-Ten":          "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "Higher Secondary":  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "Pre-Primary":       "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
};

const INITIAL_CONFIGS = [
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Primary",          department: "Default",                className: "One",                   percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Primary",          department: "Default",                className: "Two",                   percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Primary",          department: "Default",                className: "Three",                 percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Primary",          department: "Default",                className: "Four",                  percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Primary",          department: "Default",                className: "Five",                  percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Six-Eight",        department: "Default",                className: "Six",                   percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Six-Eight",        department: "Default",                className: "Seven",                 percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Six-Eight",        department: "Default",                className: "Eight",                 percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Nine-Ten",         department: "Science",                className: "Nine (Science)",        percentageWise: true,  totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Nine-Ten",         department: "Science",                className: "Ten (Science)",         percentageWise: true,  totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Nine-Ten",         department: "Business Studies Group", className: "Nine (Business Studies)",percentageWise: false, totalMarksWise: false },
  { campus: "BAF Shaheen College Bogura", shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Science",                className: "HSC Science",           percentageWise: true,  totalMarksWise: true  },
];

const TH = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </th>
);

export default function ResultConfig() {
  const [configs, setConfigs] = useState(INITIAL_CONFIGS);
  const [search,  setSearch]  = useState("");
  const [toast,   setToast]   = useState(false);

  const toggle = (i, key) => setConfigs(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: !r[key] } : r));

  const handleSave = () => { setToast(true); setTimeout(() => setToast(false), 2600); };

  const filtered = configs.filter(r =>
    r.className.toLowerCase().includes(search.toLowerCase()) ||
    r.eduLevel.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const pctCount   = configs.filter(r => r.percentageWise).length;
  const marksCount = configs.filter(r => r.totalMarksWise).length;
  const bothCount  = configs.filter(r => r.percentageWise && r.totalMarksWise).length;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Exam & Result", "Result Setup", "Result Config"]} />
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Save size={15} /> Save Config
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Result configuration saved successfully.
          </div>
        )}

        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Configure how results are displayed for each class — either as a <strong>percentage</strong> or based on <strong>total marks</strong>. Enable both for combined display.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Classes",   val: configs.length,  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",       vc: "text-blue-700 dark:text-blue-400" },
            { label: "% Wise",          val: pctCount,         color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",   vc: "text-green-700 dark:text-green-400" },
            { label: "Total Marks Wise",val: marksCount,       color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
            { label: "Both Enabled",    val: bothCount,        color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",   vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><BarChart2 size={14} /></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Class Wise Result Configs</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{configs.length} classes</span>
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
                <tr>
                  <TH>SL</TH>
                  <TH>Campus</TH>
                  <TH>Shift</TH>
                  <TH>Medium</TH>
                  <TH>Edu. Level</TH>
                  <TH>Department</TH>
                  <TH>Class</TH>
                  <TH className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-l border-green-100 dark:border-green-800 text-center">
                    Result on Percentage Wise
                  </TH>
                  <TH className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-l border-purple-100 dark:border-purple-800 text-center">
                    Result on Total Marks Wise
                  </TH>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No classes found</td></tr>
                ) : filtered.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap max-w-[160px] truncate">{row.campus}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.shift === "Day" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}>{row.shift}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{row.medium}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${EDU_STYLE[row.eduLevel] || "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{row.eduLevel}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.department}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.className}</td>

                    {/* Percentage Wise */}
                    <td className="px-4 py-4 text-center border-l border-green-50 dark:border-green-900/10">
                      <div className="flex flex-col items-center gap-1">
                        <Toggle checked={row.percentageWise} onChange={() => toggle(i, "percentageWise")} />
                        <span className={`text-xs font-medium ${row.percentageWise ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                          {row.percentageWise ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>

                    {/* Total Marks Wise */}
                    <td className="px-4 py-4 text-center border-l border-purple-50 dark:border-purple-900/10">
                      <div className="flex flex-col items-center gap-1">
                        <Toggle checked={row.totalMarksWise} onChange={() => toggle(i, "totalMarksWise")} />
                        <span className={`text-xs font-medium ${row.totalMarksWise ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`}>
                          {row.totalMarksWise ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save footer */}
          <div className="flex justify-end px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Save size={15} /> Save Configuration
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}