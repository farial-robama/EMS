import React, { useState, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, Printer, Download, Search, Filter } from "lucide-react";

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

const selCls = "px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const TEACHERS = [
  { name: "Md. Nazrul Islam",    designation: "Assistant Teacher", code: "E000216", indexNo: "",  dob: "1973-09-11", mobile: "01537633780", department: "Science", eduLevel: "Higher Secondary", shift: "Day",     subjects: "Physics, Chemistry, Biology" },
  { name: "Marufa",              designation: "Assistant Teacher", code: "E000217", indexNo: "",  dob: "1997-02-12", mobile: "01953288101", department: "Arts",    eduLevel: "Higher Secondary", shift: "Day",     subjects: "Bangla, English" },
  { name: "Sazia Laizu",         designation: "Assistant Teacher", code: "E000218", indexNo: "",  dob: "1970-01-01", mobile: "01915649018", department: "N/A",     eduLevel: "N/A",              shift: "Day",     subjects: "N/A" },
  { name: "Kaniz Fatema",        designation: "Assistant Teacher", code: "E000219", indexNo: "",  dob: "1985-03-15", mobile: "01700112233", department: "N/A",     eduLevel: "N/A",              shift: "Evening", subjects: "N/A" },
  { name: "Muhammad Liaqat Ali", designation: "Assistant Teacher", code: "E000005", indexNo: "",  dob: "1980-07-22", mobile: "01611223344", department: "Science", eduLevel: "Higher Secondary", shift: "Day",     subjects: "Higher Mathematics, ICT" },
  { name: "Sabina Laiju",        designation: "Assistant Teacher", code: "E000009", indexNo: "",  dob: "1988-11-05", mobile: "01800556677", department: "N/A",     eduLevel: "N/A",              shift: "Day",     subjects: "N/A" },
  { name: "Md. Matiar Rahman",   designation: "Assistant Teacher", code: "E000012", indexNo: "",  dob: "1979-04-30", mobile: "01912334455", department: "N/A",     eduLevel: "N/A",              shift: "Day",     subjects: "N/A" },
  { name: "Md. Farhad Hossain",  designation: "Assistant Teacher", code: "E000002", indexNo: "F2",dob: "1975-06-18", mobile: "01721367110", department: "Arts",    eduLevel: "Higher Secondary", shift: "Day",     subjects: "English, History" },
  { name: "Marjina Begum",       designation: "Assistant Teacher", code: "E000004", indexNo: "",  dob: "1982-08-12", mobile: "01600998877", department: "N/A",     eduLevel: "N/A",              shift: "Evening", subjects: "N/A" },
  { name: "Md. Abdur Razzak",    designation: "Senior Teacher",    code: "E000007", indexNo: "R7",dob: "1968-12-01", mobile: "01555443322", department: "Science", eduLevel: "Higher Secondary", shift: "Day",     subjects: "Chemistry, Biology" },
];

const COLS = ["SL", "Name", "Designation", "Teacher Code", "Index No", "Date of Birth", "Mobile", "Department", "Edu. Level", "Shift", "Subjects"];

export default function TeacherListPrint() {
  const [search, setSearch] = useState("");
  const [shift, setShift] = useState("");
  const [dept, setDept] = useState("");
  const printRef = useRef();

  const filtered = TEACHERS.filter(t =>
    (shift === "" || t.shift === shift) &&
    (dept  === "" || t.department === dept) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Teacher List — Mohammadpur Kendriya College</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; padding: 24px; color: #111; }
        h2 { text-align: center; font-size: 16px; margin-bottom: 4px; }
        h3 { text-align: center; font-size: 13px; margin-bottom: 16px; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
        th { background: #f0f0f0; font-weight: 700; font-size: 10px; text-transform: uppercase; }
        tr:nth-child(even) { background: #fafafa; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Teacher List Print"]} />
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              🖨 Print
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <Filter size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter</span>
          </div>
          <div className="p-5 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shift</label>
              <select value={shift} onChange={e => setShift(e.target.value)} className={selCls}>
                <option value="">All Shifts</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={selCls}>
                <option value="">All Departments</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Name or code…"
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-44" />
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 pb-1 ml-auto">
              {filtered.length} of {TEACHERS.length} records
            </p>
          </div>
        </div>

        {/* Print-ready table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* College header (shows in print) */}
          <div className="px-5 pt-5 pb-2 text-center">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Mohammadpur Kendriya College</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Teacher List</p>
          </div>

          {/* Printable area */}
          <div ref={printRef}>
            <h2 style={{ textAlign: "center", display: "none" }}>Mohammadpur Kendriya College</h2>
            <h3 style={{ textAlign: "center", display: "none" }}>Teacher List</h3>
            <div className="overflow-x-auto px-5 pb-5">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                    {COLS.map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={COLS.length} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                        No records match your filters
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t, i) => (
                      <tr key={t.code}
                        className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t.name}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{t.designation}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 font-mono">{t.code}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">{t.indexNo || "—"}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.dob || "—"}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.mobile || "—"}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${t.department === "Science" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : t.department === "Arts"    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                            {t.department}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.eduLevel}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">{t.shift}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">{t.subjects}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer info */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Total {filtered.length} teachers listed · Generated {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}