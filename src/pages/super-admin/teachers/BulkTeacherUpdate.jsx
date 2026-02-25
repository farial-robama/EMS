import React, { useState, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  ChevronRight, RefreshCw, Check, AlertCircle, FileSpreadsheet, Download, X,
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

const formatSize = (b) =>
  b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

const MOCK_RESULTS = [
  { name: "Mohammad Karim",   status: "updated", detail: "Updated 3 fields" },
  { name: "Fatima Begum",     status: "updated", detail: "Updated designation" },
  { name: "Abdul Rahman",     status: "error",   detail: "Invalid email format" },
  { name: "Nasrin Akter",     status: "updated", detail: "Updated contact info" },
  { name: "Shahidul Islam",   status: "error",   detail: "Teacher ID not found" },
];

export default function BulkTeacherUpdate() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (![".xls", ".xlsx"].includes(ext)) { alert("Please upload .xls or .xlsx only."); return; }
    setFile(f);
    setResults(null);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const handleUpdate = () => {
    if (!file) return;
    setUpdating(true); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => { setUpdating(false); setResults(MOCK_RESULTS); }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 280);
  };

  const reset = () => { setFile(null); setResults(null); setProgress(0); };

  const updated = results?.filter(r => r.status === "updated").length ?? 0;
  const errored = results?.filter(r => r.status === "error").length ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Bulk Update"]} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300">
              <RefreshCw size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Bulk Teacher Update</span>
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">Excel</span>
          </div>

          <div className="p-5">
            {/* Warning */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-6">
              <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                <strong>This will overwrite existing records.</strong> Ensure teacher IDs in your file match existing records exactly.
                Download the template to see all editable fields.
              </p>
            </div>

            {/* Download button */}
            <button onClick={() => {
              const a = document.createElement("a");
              a.href = "/bulk_teacher_update_template.xlsx";
              a.download = "bulk_teacher_update_template.xlsx";
              a.click();
            }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors mb-6">
              <Download size={15} className="text-amber-500" />
              Download Update Template (.xlsx)
            </button>

            {/* Dropzone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${dragOver
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/10"
                  : file
                    ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                    : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/20 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept=".xls,.xlsx"
                onChange={e => handleFile(e.target.files[0])} className="hidden" />

              {file ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                    <FileSpreadsheet size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{file.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatSize(file.size)}</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <FileSpreadsheet size={22} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Drop your updated Excel file here
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">or click to browse — .xls, .xlsx only</p>
                </>
              )}
            </div>

            {file && (
              <div className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
                  <Check size={13} /> {file.name} ready
                </div>
                <button type="button" onClick={reset} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}

            {updating && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Processing records…</span>
                  <span className="text-xs font-semibold text-amber-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="mt-5 space-y-3">
                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <Check size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-700 dark:text-green-400">{updated}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Records Updated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                      <AlertCircle size={18} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">{errored}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Errors Found</p>
                    </div>
                  </div>
                </div>

                {/* Per-row details */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Result Details</span>
                    <span className="text-xs text-gray-400">{results.length} records</span>
                  </div>
                  {results.map((r, i) => (
                    <div key={i}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 text-sm
                        ${r.status === "updated"
                          ? "bg-white dark:bg-gray-800"
                          : "bg-red-50/50 dark:bg-red-900/10"}`}>
                      <span>{r.status === "updated"
                        ? <Check size={15} className="text-green-500" />
                        : <AlertCircle size={15} className="text-red-500" />}
                      </span>
                      <span className="flex-1 font-medium text-gray-700 dark:text-gray-200">{r.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{r.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button type="button" onClick={reset} disabled={!file && !results}
                className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Clear
              </button>
              <button type="button" onClick={handleUpdate} disabled={!file || updating}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                  ${!file || updating ? "bg-amber-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"}`}>
                {updating
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                  : <><RefreshCw size={15} /> Run Bulk Update</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}