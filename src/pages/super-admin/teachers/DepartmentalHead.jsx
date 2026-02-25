import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, Building2, Search, Edit2, Check, X } from "lucide-react";

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

const INITIAL_DEPTS = [
  "Bachelor of Arts (B.A.)",
  "Bachelor of Business Studies (BBS)",
  "Bachelor of Science (B.Sc.)",
  "Bachelor of Social Science (B.S.S.)",
  "Economics",
  "Islamic History & Culture",
  "Accounting",
  "Management",
  "Bangla",
  "English",
  "Philosophy",
  "Islamic Studies",
  "Political Science",
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
  "Psychology",
  "Mathematics",
  "Statistics",
  "Sociology",
  "Biology",
  "Production Management & Marketing",
  "Library & Information Science",
  "Finance & Banking",
  "Geography & Environment",
  "Marketing",
  "Social Work",
  "Home Economics",
];

const SAMPLE_TEACHERS = [
  "Md. Nazrul Islam", "Marufa Begum", "Prof. Rahim Uddin",
  "Dr. Nasrin Akter", "Shahidul Islam", "Fatima Begum",
];

export default function DepartmentalHead() {
  const [departments, setDepartments] = useState(
    INITIAL_DEPTS.map(name => ({ name, head: "" }))
  );
  const [editingIdx, setEditingIdx] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditVal(departments[idx].head);
  };

  const confirmEdit = (idx) => {
    setDepartments(prev => prev.map((d, i) => i === idx ? { ...d, head: editVal } : d));
    setEditingIdx(null);
    setEditVal("");
  };

  const cancelEdit = () => { setEditingIdx(null); setEditVal(""); };

  const handleSaveAll = () => {
    console.log("Saved departmental heads:", departments);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const assignedCount = departments.filter(d => d.head).length;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Departmental Head"]} />
          <button onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Check size={15} /> Save All
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Departmental heads saved successfully!
          </div>
        )}

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Departments", val: departments.length, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800", valColor: "text-blue-700 dark:text-blue-400" },
            { label: "Assigned Heads", val: assignedCount, color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", valColor: "text-green-700 dark:text-green-400" },
            { label: "Unassigned", val: departments.length - assignedCount, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", valColor: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.valColor}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                <Building2 size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Departmental Head Assignment</span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search department…"
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-56" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12">SL</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department Name</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Departmental Head</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                      No departments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((dept, i) => {
                    // find real index in departments array
                    const realIdx = departments.findIndex(d => d.name === dept.name);
                    const isEditing = editingIdx === realIdx;
                    return (
                      <tr key={realIdx}
                        className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">{dept.name}</td>
                        <td className="px-5 py-3">
                          {isEditing ? (
                            <select
                              value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-blue-400 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                              autoFocus>
                              <option value="">-- Select Teacher --</option>
                              {SAMPLE_TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          ) : (
                            <span className={dept.head
                              ? "text-sm font-medium text-gray-800 dark:text-gray-100"
                              : "text-sm text-gray-400 dark:text-gray-500 italic"}>
                              {dept.head || "No Teacher Assigned"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => confirmEdit(realIdx)}
                                className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 transition-colors">
                                <Check size={13} />
                              </button>
                              <button onClick={cancelEdit}
                                className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => startEdit(realIdx)}
                              className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <Edit2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}