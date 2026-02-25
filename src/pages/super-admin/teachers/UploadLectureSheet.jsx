import React, { useState, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, ChevronDown, Plus, Upload, Eye, FileText, Check, X, Filter } from "lucide-react";

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

const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const CAMPUS = "Mohammadpur Kendriya College";

const INITIAL_SHEETS = [
  { id: 1, campus: CAMPUS, shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Science", className: "HSC-Science", section: "1st Year", session: "2025-2026", file: null },
  { id: 2, campus: CAMPUS, shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Science", className: "HSC-Science", section: "2nd Year", session: "2025-2026", file: null },
  { id: 3, campus: CAMPUS, shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Arts",    className: "HSC-Arts",    section: "1st Year", session: "2025-2026", file: null },
];

export default function UploadLectureSheet() {
  const [filters, setFilters] = useState({ eduLevel: "", department: "", className: "", section: "", session: "" });
  const [sheets, setSheets] = useState(INITIAL_SHEETS);
  const [nextId, setNextId] = useState(4);
  const [viewFile, setViewFile] = useState(null);
  const fileRefs = useRef({});

  const handleFilter = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));

  const filtered = sheets.filter(s =>
    (filters.eduLevel   === "" || s.eduLevel   === filters.eduLevel) &&
    (filters.department === "" || s.department === filters.department) &&
    (filters.className  === "" || s.className  === filters.className) &&
    (filters.section    === "" || s.section    === filters.section) &&
    (filters.session    === "" || s.session    === filters.session)
  );

  const handleFileUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSheets(prev => prev.map(s => s.id === id ? { ...s, file } : s));
  };

  const handleView = (sheet) => {
    if (!sheet.file) return alert("No file uploaded yet.");
    setViewFile(sheet);
  };

  const handleAdd = () => {
    setSheets(prev => [...prev, {
      id: nextId, campus: CAMPUS, shift: "Day", medium: "Bangla",
      eduLevel: "", department: "", className: "", section: "", session: "", file: null,
    }]);
    setNextId(n => n + 1);
  };

  const handleRemove = (id) => setSheets(prev => prev.filter(s => s.id !== id));

  const handleFieldChange = (id, field, value) => {
    setSheets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const uploadedCount = sheets.filter(s => s.file).length;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Lecture Sheet"]} />
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Lecture Sheet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Sheets", val: sheets.length,  color: "bg-blue-50  dark:bg-blue-900/20  border-blue-100  dark:border-blue-800",  vc: "text-blue-700  dark:text-blue-400" },
            { label: "Uploaded",     val: uploadedCount,  color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
            { label: "Pending",      val: sheets.length - uploadedCount, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Filter size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Lecture Sheets</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { name: "eduLevel",   label: "Edu. Level",  opts: ["Higher Secondary", "Graduate"] },
                { name: "department", label: "Department",   opts: ["Science", "Arts", "Commerce", "Business"] },
                { name: "className",  label: "Class",        opts: ["HSC-Science", "HSC-Arts", "HSC-Commerce"] },
                { name: "section",    label: "Section",      opts: ["1st Year", "2nd Year", "3rd Year"] },
                { name: "session",    label: "Session",      opts: ["2025-2026", "2024-2025"] },
              ].map(f => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                  <select name={f.name} value={filters[f.name]} onChange={handleFilter} className={selCls}>
                    <option value="">All</option>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
              <FileText size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Lecture Sheet List</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">— {CAMPUS}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["SL", "Campus", "Shift", "Medium", "Edu. Level", "Department", "Class", "Section", "Session", "File", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filtered.map((sheet, i) => (
                    <tr key={sheet.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 max-w-[120px] truncate">{sheet.campus}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{sheet.shift}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{sheet.medium}</td>
                      {/* Editable cells for new empty rows */}
                      {["eduLevel", "department", "className", "section", "session"].map(field => (
                        <td key={field} className="px-4 py-3">
                          {sheet[field] ? (
                            <span className="text-sm text-gray-700 dark:text-gray-200">{sheet[field]}</span>
                          ) : (
                            <select value={sheet[field]}
                              onChange={e => handleFieldChange(sheet.id, field, e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
                              <option value="">Select…</option>
                              {field === "eduLevel"   && ["Higher Secondary","Graduate"].map(o => <option key={o} value={o}>{o}</option>)}
                              {field === "department" && ["Science","Arts","Commerce","Business"].map(o => <option key={o} value={o}>{o}</option>)}
                              {field === "className"  && ["HSC-Science","HSC-Arts","HSC-Commerce"].map(o => <option key={o} value={o}>{o}</option>)}
                              {field === "section"    && ["1st Year","2nd Year","3rd Year"].map(o => <option key={o} value={o}>{o}</option>)}
                              {field === "session"    && ["2025-2026","2024-2025"].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          )}
                        </td>
                      ))}
                      {/* File status */}
                      <td className="px-4 py-3">
                        {sheet.file ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                            <Check size={11} /> {sheet.file.name.length > 12 ? sheet.file.name.slice(0, 12) + "…" : sheet.file.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">No file</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <input ref={el => fileRefs.current[sheet.id] = el}
                            type="file" className="hidden"
                            onChange={e => handleFileUpload(sheet.id, e)} />
                          <button onClick={() => fileRefs.current[sheet.id]?.click()}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors">
                            <Upload size={12} /> Upload
                          </button>
                          <button onClick={() => handleView(sheet)} disabled={!sheet.file}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            <Eye size={12} /> View
                          </button>
                          <button onClick={() => handleRemove(sheet.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* File View Modal */}
        {viewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <FileText size={22} className="text-blue-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">File Preview</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-1">{viewFile.file?.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-5">
                {viewFile.className} · {viewFile.section} · {viewFile.session}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setViewFile(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Close
                </button>
                <button onClick={() => { alert(`Opening: ${viewFile.file?.name}`); setViewFile(null); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Open File
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}