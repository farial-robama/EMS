import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ChevronRight, Plus, X, Save, Check, MessageSquare, AlertTriangle } from "lucide-react";

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

const inp = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

function CommentTable({ title, icon: Icon, iconColor, accentColor, rows, setRows }) {
  const addRow    = ()        => setRows(p => [...p, { start: "", end: "", comment: "" }]);
  const removeRow = (i)       => setRows(p => p.filter((_, idx) => idx !== i));
  const updateRow = (i, f, v) => setRows(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}><Icon size={14} /></div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${accentColor}`}>{rows.length} rule{rows.length !== 1 ? "s" : ""}</span>
        </div>
        <button onClick={addRow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors">
          <Plus size={12} /> Add Row
        </button>
      </div>

      <div className="p-5">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No rules defined. Click "Add Row" to start.</div>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-3 px-2 mb-1" style={{ gridTemplateColumns: "36px 1fr 1fr 2fr 36px" }}>
              {["#", "Start Point", "End Point", "Comment Text", ""].map((h, i) => (
                <span key={i} className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid gap-3 items-center bg-gray-50 dark:bg-gray-700/30 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700"
                style={{ gridTemplateColumns: "36px 1fr 1fr 2fr 36px" }}>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 text-center">{i + 1}</span>
                <input type="text" value={row.start}   placeholder="e.g. 4.00" onChange={e => updateRow(i, "start",   e.target.value)} className={inp} />
                <input type="text" value={row.end}     placeholder="e.g. 5.00" onChange={e => updateRow(i, "end",     e.target.value)} className={inp} />
                <input type="text" value={row.comment} placeholder="Enter comment text…" onChange={e => updateRow(i, "comment", e.target.value)} className={inp} />
                <button onClick={() => removeRow(i)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentSetting() {
  const [gradeRows,  setGradeRows]  = useState([
    { start: "5.00", end: "5.00", comment: "A+ Excellent" },
    { start: "4.00", end: "4.99", comment: "A Very Good" },
    { start: "3.50", end: "3.99", comment: "A- Good" },
    { start: "3.00", end: "3.49", comment: "B+ Above Average" },
  ]);
  const [failedRows, setFailedRows] = useState([
    { start: "0", end: "32", comment: "Failed in one or more subjects" },
  ]);
  const [toast, setToast] = useState(false);

  const handleSave = () => { setToast(true); setTimeout(() => setToast(false), 2600); };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Exam & Result", "Result Setup", "Comment Setting"]} />
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Save size={15} /> Save Settings
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Comment settings saved successfully.
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 flex items-center gap-2.5">
          <MessageSquare size={15} className="text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Define grade point ranges and their associated comment text displayed on student result sheets.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Grade Rules",  val: gradeRows.length,  color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",    vc: "text-green-700 dark:text-green-400" },
            { label: "Failed Rules", val: failedRows.length, color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",             vc: "text-red-600 dark:text-red-400" },
            { label: "Total Rules",  val: gradeRows.length + failedRows.length, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800", vc: "text-blue-700 dark:text-blue-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <CommentTable
          title="Grade Settings"
          icon={MessageSquare}
          iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
          accentColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          rows={gradeRows} setRows={setGradeRows}
        />

        <CommentTable
          title="Failed Subject Settings"
          icon={AlertTriangle}
          iconColor="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
          accentColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          rows={failedRows} setRows={setFailedRows}
        />

        <div className="flex justify-end pt-1">
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
            <Save size={15} /> Save Settings
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}