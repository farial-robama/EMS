import React, { useState, useRef } from "react";
import {
  ChevronRight, Filter, Eye, Printer, GraduationCap,
  BookOpen, Award, TrendingUp, CheckCircle2, AlertTriangle,
} from "lucide-react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";

/* ─── Data ─── */
const STUDENTS = [
  {
    name: "Sharif Tahzeeb Al Adiat",
    roll: "1202425033001",
    studentId: "2414010030001",
    subjects: [
      { name: "Bangla",            fm: 100, obt: 63, high: 85, grade: "A-", gp: 3.5 },
      { name: "English",           fm: 100, obt: 69, high: 80, grade: "A-", gp: 3.5 },
      { name: "Physics",           fm: 100, obt: 52, high: 75, grade: "B",  gp: 3.0 },
      { name: "Chemistry",         fm: 100, obt: 45, high: 71, grade: "C",  gp: 2.0 },
      { name: "ICT",               fm: 100, obt: 76, high: 86, grade: "A",  gp: 4.0 },
      { name: "Higher Mathematics",fm: 100, obt: 56, high: 82, grade: "B",  gp: 3.0 },
    ],
    meritClass: 43, meritSection: 43,
  },
  {
    name: "SAHIDUL ISLAM FAHIM",
    roll: "1202425033002",
    studentId: "2414010030002",
    subjects: [
      { name: "Bangla",            fm: 100, obt: 78, high: 85, grade: "A",  gp: 4.0 },
      { name: "English",           fm: 100, obt: 72, high: 80, grade: "A",  gp: 4.0 },
      { name: "Physics",           fm: 100, obt: 65, high: 75, grade: "A-", gp: 3.5 },
      { name: "Chemistry",         fm: 100, obt: 58, high: 71, grade: "B",  gp: 3.0 },
      { name: "ICT",               fm: 100, obt: 83, high: 86, grade: "A+", gp: 5.0 },
      { name: "Higher Mathematics",fm: 100, obt: 74, high: 82, grade: "A",  gp: 4.0 },
    ],
    meritClass: 5, meritSection: 5,
  },
];

const GRADE_SCALE = [
  { range: "80–100", grade: "A+", point: 5.0 },
  { range: "70–79",  grade: "A",  point: 4.0 },
  { range: "60–69",  grade: "A–", point: 3.5 },
  { range: "50–59",  grade: "B",  point: 3.0 },
  { range: "40–49",  grade: "C",  point: 2.0 },
  { range: "33–39",  grade: "D",  point: 1.0 },
  { range: "0–32",   grade: "F",  point: 0.0 },
];

const EDU_LEVELS  = ["Higher Secondary","Secondary","Primary"];
const DEPARTMENTS = ["Science","Arts","Commerce","Default"];
const CLASSES     = ["HSC-Science","HSC-Arts","Nine (Science)","Ten (Science)"];
const SECTIONS    = ["1st Year","2nd Year","A","B"];
const SESSIONS    = ["2024-2025","2025-2026"];
const RESULT_TYPES = ["Class Wise","Section Wise","Individual"];
const EXAMS       = ["Annual Exam – 2025","Half Yearly – 2025","Pre-Test – 2025"];
const GRADES      = ["All Grades","A+","A","A–","B","C","D","F"];
const PAGE_TYPES  = ["A4 Portrait","A4 Landscape","Letter"];

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1 ? "text-gray-700 dark:text-gray-200 font-medium" : "hover:text-blue-500 cursor-pointer"}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

function F({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const GRADE_COLORS = {
  "A+": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  "A":  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "A-": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  "A–": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  "B":  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "C":  "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  "D":  "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  "F":  "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

/* ─── Single Transcript ─── */
function Transcript({ student, examName, session, department, className: cls, section }) {
  const total   = student.subjects.reduce((s, sub) => s + sub.obt, 0);
  const fullMks = student.subjects.reduce((s, sub) => s + sub.fm, 0);
  const gpa     = (student.subjects.reduce((s, sub) => s + sub.gp, 0) / student.subjects.length).toFixed(2);
  const hasFail = student.subjects.some((s) => s.grade === "F");
  const pct     = Math.round((total / fullMks) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-800 dark:border-gray-600 overflow-hidden"
      style={{ pageBreakAfter: "always", fontFamily: "Georgia, serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-gray-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-600 flex items-center justify-center text-xs font-bold border border-gray-500">LOGO</div>
          <div>
            <p className="text-base font-bold uppercase tracking-wide">BAF Shaheen College Bogura</p>
            <p className="text-xs text-gray-400">Bogura Cantonment, Bogura – 5800, Bangladesh</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Academic Transcript</p>
          <p className="text-sm font-bold text-white mt-0.5">{examName || EXAMS[0]}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
          {[
            ["Name",        student.name],
            ["Roll No.",    student.roll],
            ["Student ID",  student.studentId],
            ["Department",  department || "Science"],
            ["Class",       cls || "HSC-Science"],
            ["Section",     section || "2nd Year"],
            ["Session",     session || "2024-2025"],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-2">
              <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide w-24 shrink-0 pt-0.5">{label}</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{val}</span>
            </div>
          ))}
        </div>

        {/* Two-column layout: grade scale + summary */}
        <div className="grid grid-cols-3 gap-4">
          {/* Grade Scale */}
          <div className="col-span-1 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-800 text-white px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide">Grade Scale</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 py-2 text-left font-semibold text-gray-500 dark:text-gray-400">Marks</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-500 dark:text-gray-400">Grade</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-500 dark:text-gray-400">GP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {GRADE_SCALE.map((g) => (
                  <tr key={g.grade} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20">
                    <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400">{g.range}</td>
                    <td className="px-2 py-1.5">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[g.grade] || ""}`}>{g.grade}</span>
                    </td>
                    <td className="px-2 py-1.5 font-semibold text-gray-700 dark:text-gray-300">{g.point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary + Progress */}
          <div className="col-span-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Marks",        val: `${total} / ${fullMks}`, cls: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",    txt: "text-blue-700 dark:text-blue-400"    },
                { label: "Percentage",         val: `${pct}%`,               cls: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30", txt: "text-indigo-700 dark:text-indigo-400" },
                { label: "GPA",                val: gpa,                     cls: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",  txt: "text-green-700 dark:text-green-400"  },
                { label: "Merit in Class",     val: `#${student.meritClass}`,cls: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",txt: "text-purple-700 dark:text-purple-400"},
              ].map((s) => (
                <div key={s.label} className={`p-3 rounded-xl border ${s.cls}`}>
                  <div className={`text-xl font-bold leading-none ${s.txt}`}>{s.val}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Result badge */}
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${hasFail ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30" : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30"}`}>
              {hasFail ? <AlertTriangle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
              <div>
                <p className={`text-sm font-bold ${hasFail ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                  {hasFail ? "Result: FAILED" : "Result: PASSED"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Merit in Section: #{student.meritSection}</p>
              </div>
            </div>

            {/* Per-subject bar chart (visual) */}
            <div className="space-y-1.5">
              {student.subjects.map((sub) => (
                <div key={sub.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-32 shrink-0 truncate">{sub.name}</span>
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${sub.grade === "F" ? "bg-red-400" : sub.obt >= 80 ? "bg-emerald-500" : sub.obt >= 60 ? "bg-blue-500" : "bg-amber-400"}`}
                      style={{ width: `${sub.obt}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-6 text-right ${sub.grade === "F" ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>{sub.obt}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[sub.grade] || ""}`}>{sub.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Marks Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                {["#","Subject","Full Marks","Marks Obtained","Highest","Grade","GP"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {student.subjects.map((sub, i) => (
                <tr key={sub.name} className={`${sub.grade === "F" ? "bg-red-50/50 dark:bg-red-900/5" : i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-700/20"} hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors`}>
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{sub.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{sub.fm}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">{sub.obt}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{sub.high}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold ${GRADE_COLORS[sub.grade] || ""}`}>{sub.grade}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">{sub.gp}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 dark:bg-gray-700/40 border-t-2 border-gray-200 dark:border-gray-600">
                <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</td>
                <td className="px-4 py-3 text-base font-bold text-gray-900 dark:text-gray-100">{total}</td>
                <td /><td />
                <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">{gpa}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          {["Guardian's Signature","Class Teacher's Signature","Principal's Signature"].map((sig) => (
            <div key={sig} className="text-center">
              <div className="h-12 border-b-2 border-gray-700 dark:border-gray-500 mb-2" />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{sig}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function MarkSheet() {
  const [form, setForm] = useState({
    eduLevel: "Higher Secondary", department: "Science",
    className: "HSC-Science", section: "2nd Year",
    session: "2024-2025", resultType: "Class Wise",
    examName: EXAMS[0], gradeWise: "", pageType: "A4 Portrait",
  });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setShow(false); };

  const handleView = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setShow(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Exam & Result","Mark Sheet"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen size={22} className="text-blue-500" /> Mark Sheet
            </h1>
          </div>
          {show && (
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-xl transition-colors shadow-sm flex-shrink-0">
              <Printer size={15} /> Print
            </button>
          )}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden print:hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Mark Sheet Parameters</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <F label="Education Level">
                <select value={form.eduLevel} onChange={(e) => set("eduLevel", e.target.value)} className={inp}>
                  {EDU_LEVELS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Department">
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={inp}>
                  {DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Class">
                <select value={form.className} onChange={(e) => set("className", e.target.value)} className={inp}>
                  {CLASSES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Section">
                <select value={form.section} onChange={(e) => set("section", e.target.value)} className={inp}>
                  {SECTIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Session">
                <select value={form.session} onChange={(e) => set("session", e.target.value)} className={inp}>
                  {SESSIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Result Type">
                <select value={form.resultType} onChange={(e) => set("resultType", e.target.value)} className={inp}>
                  {RESULT_TYPES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Exam Name">
                <select value={form.examName} onChange={(e) => set("examName", e.target.value)} className={inp}>
                  {EXAMS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Grade Wise Result">
                <select value={form.gradeWise} onChange={(e) => set("gradeWise", e.target.value)} className={inp}>
                  {GRADES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Print Page Type">
                <select value={form.pageType} onChange={(e) => set("pageType", e.target.value)} className={inp}>
                  {PAGE_TYPES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
            </div>
            <div className="flex gap-3">
              <button onClick={handleView} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 disabled:opacity-60">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Loading…</> : <><Eye size={14} />View Mark Sheet</>}
              </button>
            </div>
          </div>
        </div>

        {/* Mark Sheets */}
        {show && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 print:hidden">
              <CheckCircle2 size={15} className="text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{STUDENTS.length} mark sheet{STUDENTS.length !== 1 ? "s" : ""} generated</span>
            </div>
            {STUDENTS.map((st, i) => (
              <Transcript
                key={i}
                student={st}
                examName={form.examName}
                session={form.session}
                department={form.department}
                className={form.className}
                section={form.section}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}