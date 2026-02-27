import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ChevronRight, Save, Check, Trophy, Info } from "lucide-react";

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

// Compact toggle switch
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

// Compact radio
const Radio = ({ checked, onChange }) => (
  <input type="radio" checked={checked} onChange={onChange}
    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 cursor-pointer accent-blue-600" />
);

const CLASS_ROWS = [
  { edu: "Primary",          dept: "Default",                className: "One",                    minMarks: 40 },
  { edu: "Primary",          dept: "Default",                className: "Two",                    minMarks: 40 },
  { edu: "Primary",          dept: "Default",                className: "Three",                  minMarks: 40 },
  { edu: "Primary",          dept: "Default",                className: "Four",                   minMarks: 40 },
  { edu: "Primary",          dept: "Default",                className: "Five",                   minMarks: 40 },
  { edu: "Six-Eight",        dept: "Default",                className: "Six",                    minMarks: 40 },
  { edu: "Six-Eight",        dept: "Default",                className: "Seven",                  minMarks: 40 },
  { edu: "Six-Eight",        dept: "Default",                className: "Eight",                  minMarks: 40 },
  { edu: "Nine-Ten",         dept: "Science",                className: "Nine (Science)",         minMarks: 40 },
  { edu: "Nine-Ten",         dept: "Science",                className: "Ten (Science)",          minMarks: 40 },
  { edu: "Nine-Ten",         dept: "Business Studies Group", className: "Nine (Business Studies)",minMarks: 40 },
  { edu: "Higher Secondary", dept: "Science",                className: "HSC Science",            minMarks: 0  },
];

const EDU_STYLE = {
  "Primary":          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "Six-Eight":        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "Nine-Ten":         "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "Higher Secondary": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const EMPTY_STATE = {
  combinePass: false, considerFailed: false, allowSameMerit: false,
  countFailed4th: false, countMark: false, countFail: false,
  allowFailedMerit: false, allowParentSubject: false,
  meritBase: "points", round: "none", minPoints: 2,
};

const TH = ({ children, className = "" }) => (
  <th className={`px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap bg-gray-50 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </th>
);

const TD = ({ children, className = "" }) => (
  <td className={`px-3 py-3 text-sm border-b border-gray-50 dark:border-gray-700/50 ${className}`}>
    {children}
  </td>
);

export default function MeritConfig() {
  const [rows, setRows] = useState(
    CLASS_ROWS.map(r => ({ ...r, ...EMPTY_STATE }))
  );
  const [toast, setToast] = useState(false);

  const toggle = (i, key) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: !r[key] } : r));
  const update = (i, key, val) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const handleSave = () => { setToast(true); setTimeout(() => setToast(false), 2600); };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Exam & Result", "Result Setup", "Merit Config"]} />
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Save size={15} /> Save Configuration
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Merit list configuration saved successfully.
          </div>
        )}

        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Merit position is calculated according to <strong>Points</strong>, <strong>Marks</strong>, and <strong>Class Roll</strong>. Configure each class row individually to control how merit is determined.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Classes",     val: rows.length,                               color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
            { label: "Points Based",      val: rows.filter(r => r.meritBase === "points").length, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
            { label: "Failed Allowed",    val: rows.filter(r => r.allowFailedMerit).length,       color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",    vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main table card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300"><Trophy size={14} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Merit List Configuration</span>
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium ml-auto">{rows.length} classes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                {/* Group headers */}
                <tr>
                  <TH className="w-10">SL</TH>
                  <TH>Edu. Level</TH>
                  <TH>Department</TH>
                  <TH>Class</TH>
                  <TH className="bg-indigo-50 dark:bg-indigo-900/20 border-l border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                    Parent Subject<br />Combine Pass
                  </TH>

                  {/* Merit Base */}
                  <th colSpan={4} className="px-3 py-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 border-l border-blue-100 dark:border-blue-800">
                    Merit Calculation Base
                  </th>

                  {/* Toggles */}
                  <th colSpan={2} className="px-3 py-2 text-center text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800 border-l border-purple-100 dark:border-purple-800">
                    Merit Options
                  </th>

                  {/* Marks & Points */}
                  <th colSpan={3} className="px-3 py-2 text-center text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 border-l border-green-100 dark:border-green-800">
                    Subject Settings
                  </th>

                  {/* Special */}
                  <th colSpan={2} className="px-3 py-2 text-center text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 border-l border-amber-100 dark:border-amber-800">
                    Special Subject
                  </th>

                  {/* Allow */}
                  <th colSpan={2} className="px-3 py-2 text-center text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 border-l border-red-100 dark:border-red-800">
                    Allow Settings
                  </th>

                  {/* Rounding */}
                  <th colSpan={4} className="px-3 py-2 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 border-l border-gray-200 dark:border-gray-600">
                    Marks Round As
                  </th>
                </tr>

                {/* Sub headers */}
                <tr>
                  <th className="px-3 py-2 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700" colSpan={4} />
                  <TH className="bg-indigo-50/50 dark:bg-indigo-900/10 border-l border-indigo-100 dark:border-indigo-800 text-indigo-500">Yes/No</TH>

                  <TH className="bg-blue-50/50 dark:bg-blue-900/10 border-l border-blue-100 dark:border-blue-800 text-blue-500">Points</TH>
                  <TH className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-500">Marks</TH>
                  <TH className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-500">Pts & Marks</TH>
                  <TH className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-500">A+,Pts,Marks,Roll</TH>

                  <TH className="bg-purple-50/50 dark:bg-purple-900/10 border-l border-purple-100 dark:border-purple-800 text-purple-500">Consider Failed</TH>
                  <TH className="bg-purple-50/50 dark:bg-purple-900/10 text-purple-500">Same Merit</TH>

                  <TH className="bg-green-50/50 dark:bg-green-900/10 border-l border-green-100 dark:border-green-800 text-green-500">Min Marks</TH>
                  <TH className="bg-green-50/50 dark:bg-green-900/10 text-green-500">Min Points</TH>
                  <TH className="bg-green-50/50 dark:bg-green-900/10 text-green-500">Failed 4th Subj.</TH>

                  <TH className="bg-amber-50/50 dark:bg-amber-900/10 border-l border-amber-100 dark:border-amber-800 text-amber-500">Count Mark</TH>
                  <TH className="bg-amber-50/50 dark:bg-amber-900/10 text-amber-500">Count Fail</TH>

                  <TH className="bg-red-50/50 dark:bg-red-900/10 border-l border-red-100 dark:border-red-800 text-red-500">Failed Merit</TH>
                  <TH className="bg-red-50/50 dark:bg-red-900/10 text-red-500">Parent Subj.</TH>

                  <TH className="border-l border-gray-200 dark:border-gray-600">Don't Round</TH>
                  <TH>General</TH>
                  <TH>Ceil</TH>
                  <TH>Sub Subj. Ceil</TH>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <TD className="text-gray-400 dark:text-gray-500 font-medium">{i + 1}</TD>
                    <TD>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${EDU_STYLE[r.edu] || "bg-gray-100 text-gray-500"}`}>{r.edu}</span>
                    </TD>
                    <TD className="text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">{r.dept}</TD>
                    <TD className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{r.className}</TD>

                    {/* Combine Pass */}
                    <TD className="border-l border-indigo-50 dark:border-indigo-900/20 text-center">
                      <Toggle checked={r.combinePass} onChange={() => toggle(i, "combinePass")} />
                    </TD>

                    {/* Merit Base radios */}
                    <TD className="border-l border-blue-50 dark:border-blue-900/20 text-center"><Radio checked={r.meritBase === "points"}   onChange={() => update(i, "meritBase", "points")} /></TD>
                    <TD className="text-center"><Radio checked={r.meritBase === "marks"}    onChange={() => update(i, "meritBase", "marks")} /></TD>
                    <TD className="text-center"><Radio checked={r.meritBase === "both"}     onChange={() => update(i, "meritBase", "both")} /></TD>
                    <TD className="text-center"><Radio checked={r.meritBase === "advanced"} onChange={() => update(i, "meritBase", "advanced")} /></TD>

                    {/* Merit toggles */}
                    <TD className="border-l border-purple-50 dark:border-purple-900/20 text-center"><Toggle checked={r.considerFailed} onChange={() => toggle(i, "considerFailed")} /></TD>
                    <TD className="text-center"><Toggle checked={r.allowSameMerit} onChange={() => toggle(i, "allowSameMerit")} /></TD>

                    {/* Subject settings */}
                    <TD className="border-l border-green-50 dark:border-green-900/20">
                      <input type="number" value={r.minMarks} onChange={e => update(i, "minMarks", e.target.value)}
                        className="w-16 px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all text-center" />
                    </TD>
                    <TD>
                      <input type="number" value={r.minPoints} onChange={e => update(i, "minPoints", e.target.value)}
                        className="w-16 px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all text-center" />
                    </TD>
                    <TD className="text-center"><Toggle checked={r.countFailed4th} onChange={() => toggle(i, "countFailed4th")} /></TD>

                    {/* Special subject */}
                    <TD className="border-l border-amber-50 dark:border-amber-900/20 text-center"><Toggle checked={r.countMark} onChange={() => toggle(i, "countMark")} /></TD>
                    <TD className="text-center"><Toggle checked={r.countFail} onChange={() => toggle(i, "countFail")} /></TD>

                    {/* Allow */}
                    <TD className="border-l border-red-50 dark:border-red-900/20 text-center"><Toggle checked={r.allowFailedMerit}   onChange={() => toggle(i, "allowFailedMerit")} /></TD>
                    <TD className="text-center"><Toggle checked={r.allowParentSubject} onChange={() => toggle(i, "allowParentSubject")} /></TD>

                    {/* Rounding radios */}
                    <TD className="border-l border-gray-100 dark:border-gray-700 text-center"><Radio checked={r.round === "none"}    onChange={() => update(i, "round", "none")} /></TD>
                    <TD className="text-center"><Radio checked={r.round === "general"} onChange={() => update(i, "round", "general")} /></TD>
                    <TD className="text-center"><Radio checked={r.round === "ceil"}    onChange={() => update(i, "round", "ceil")} /></TD>
                    <TD className="text-center"><Radio checked={r.round === "sub"}     onChange={() => update(i, "round", "sub")} /></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save bar */}
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