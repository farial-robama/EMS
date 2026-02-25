import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, ChevronDown, Search, Check, Users, User, AlertCircle } from "lucide-react";

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

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}><Icon size={14} /></div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          {badge && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

/* ─── Dummy data ─────────────────────────────────────────────────────────── */
const SECTIONS_DATA = [
  {
    shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Science",
    className: "HSC-Science",
    sections: [
      {
        name: "1st Year (A)", session: "2025-2026",
        assignedTeacher: "",
        subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Higher Mathematics", "ICT"],
      },
      {
        name: "1st Year (B)", session: "2025-2026",
        assignedTeacher: "",
        subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Higher Mathematics", "ICT"],
      },
      {
        name: "2nd Year (A)", session: "2025-2026",
        assignedTeacher: "Md. Nazrul Islam",
        subjects: ["Bangla", "English", "Physics", "Chemistry", "Biology", "Higher Mathematics", "ICT"],
      },
    ],
  },
  {
    shift: "Day", medium: "Bangla", eduLevel: "Higher Secondary", department: "Arts",
    className: "HSC-Humanities",
    sections: [
      {
        name: "1st Year", session: "2025-2026",
        assignedTeacher: "",
        subjects: ["Bangla", "English", "Economics", "Logic", "Civics", "ICT"],
      },
      {
        name: "2nd Year", session: "2025-2026",
        assignedTeacher: "Marufa",
        subjects: ["Bangla", "English", "Economics", "Logic", "Civics", "ICT"],
      },
    ],
  },
];

const ALL_TEACHERS = ["Md. Nazrul Islam", "Marufa", "Prof. Rahim Uddin", "Dr. Nasrin Akter", "Shahidul Islam"];

export default function SectionTeacherAdvising() {
  const [filters, setFilters] = useState({ eduLevel: "", shift: "", medium: "", department: "" });
  const [data, setData] = useState(SECTIONS_DATA);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFilter = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = () => setSearched(true);

  const filteredData = data.filter(d =>
    (filters.eduLevel   === "" || d.eduLevel   === filters.eduLevel) &&
    (filters.shift      === "" || d.shift      === filters.shift) &&
    (filters.medium     === "" || d.medium     === filters.medium) &&
    (filters.department === "" || d.department === filters.department)
  );

  const assignTeacher = (classIdx, secIdx, teacher) => {
    setData(prev => {
      const next = structuredClone(prev);
      // find real index
      const ri = prev.findIndex((d, i) => filteredData[classIdx] === d);
      next[ri].sections[secIdx].assignedTeacher = teacher;
      return next;
    });
  };

  const handleSave = () => {
    console.log("Saved section teacher advising:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalSections = data.reduce((a, d) => a + d.sections.length, 0);
  const assignedSections = data.reduce((a, d) => a + d.sections.filter(s => s.assignedTeacher).length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Section Teacher Advising"]} />
          {searched && (
            <button onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
              <Check size={15} /> Save Assignments
            </button>
          )}
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Section teacher assignments saved successfully!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Sections", val: totalSections, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800", valColor: "text-blue-700 dark:text-blue-400" },
            { label: "Assigned", val: assignedSections, color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", valColor: "text-green-700 dark:text-green-400" },
            { label: "Unassigned", val: totalSections - assignedSections, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", valColor: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.valColor}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <SectionCard title="Filter Sections" icon={Search}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { name: "eduLevel", label: "Edu Level", opts: ["Higher Secondary", "Graduate"] },
              { name: "shift", label: "Shift", opts: ["Day", "Evening"] },
              { name: "medium", label: "Medium", opts: ["Bangla", "English"] },
              { name: "department", label: "Department", opts: ["Science", "Arts", "Commerce", "Business"] },
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
          <div className="flex justify-end">
            <button onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Search size={15} /> Show Sections
            </button>
          </div>
        </SectionCard>

        {/* Section-Teacher Assignment Table */}
        {searched && (
          filteredData.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={22} className="text-amber-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No sections found for the selected filters.</p>
            </div>
          ) : (
            filteredData.map((classData, ci) => (
              <SectionCard key={ci}
                title={`${classData.className} — ${classData.medium} Medium · ${classData.shift} Shift`}
                icon={Users}
                iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
                badge={`${classData.sections.filter(s => s.assignedTeacher).length}/${classData.sections.length} assigned`}>

                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        {["SL", "Section", "Session", "Subjects", "Assigned Teacher", "Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classData.sections.map((sec, si) => (
                        <tr key={si}
                          className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{si + 1}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{sec.name}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{sec.session}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {sec.subjects.slice(0, 3).map(s => (
                                <span key={s} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{s}</span>
                              ))}
                              {sec.subjects.length > 3 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500">+{sec.subjects.length - 3} more</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={sec.assignedTeacher}
                              onChange={e => assignTeacher(ci, si, e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all">
                              <option value="">-- Select Teacher --</option>
                              {ALL_TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {sec.assignedTeacher ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                <Check size={10} /> Assigned
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            ))
          )
        )}

      </div>
    </DashboardLayout>
  );
}