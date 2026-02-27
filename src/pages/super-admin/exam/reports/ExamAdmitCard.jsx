import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  ChevronRight, SlidersHorizontal, Eye, Printer,
  GraduationCap, Calendar, Clock, BookOpen, AlertCircle,
  CheckCircle2, User, Filter,
} from "lucide-react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";

/* ─── Sample Data ─── */
const EXAM_ROUTINE = [
  { date: "08-05-2024",  day: "Wednesday", time: "10:00 AM", durationHr: 3, durationMin: 0,  subject: "Bangla",               code: "101, 102" },
  { date: "10-05-2024",  day: "Friday",    time: "10:00 AM", durationHr: 3, durationMin: 0,  subject: "English",               code: "107" },
  { date: "13-05-2024",  day: "Monday",    time: "10:00 AM", durationHr: 1, durationMin: 30, subject: "Digital Technology/ICT", code: "275" },
  { date: "15-05-2024",  day: "Wednesday", time: "10:00 AM", durationHr: 3, durationMin: 0,  subject: "Physics",               code: "174" },
  { date: "18-05-2024",  day: "Saturday",  time: "10:00 AM", durationHr: 3, durationMin: 0,  subject: "Chemistry",             code: "176" },
  { date: "20-05-2024",  day: "Monday",    time: "10:00 AM", durationHr: 3, durationMin: 0,  subject: "Higher Mathematics",    code: "265" },
  { date: "22-05-2024",  day: "Wednesday", time: "10:00 AM", durationHr: 2, durationMin: 0,  subject: "Botany",                code: "001" },
  { date: "24-05-2024",  day: "Friday",    time: "10:00 AM", durationHr: 2, durationMin: 0,  subject: "Zoology",               code: "002" },
];

const STUDENTS = [
  { name: "MD. SHAH BODIUZZAMAN SIZAN",  roll: 1,  id: "2514010030001" },
  { name: "MOTI CHANDRA DAS",            roll: 2,  id: "2514010030002" },
  { name: "MD AHANAF AHAMED ISTIAK",     roll: 3,  id: "2514010030003" },
  { name: "MD. AMIR HAMZA",              roll: 4,  id: "2514010030004" },
  { name: "PLABON DATTO",                roll: 5,  id: "2514010030005" },
  { name: "TANZIMUT TAHDI",              roll: 6,  id: "2514010030006" },
  { name: "SADI MD. MIZAN SARKER",       roll: 7,  id: "2514010030007" },
];

const EDU_LEVELS  = ["Pre-Primary","Primary","Six-Eight","Nine-Ten","Higher Secondary"];
const DEPARTMENTS = ["Default","Science","Arts","Commerce"];
const CLASSES     = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine (Science)","Ten (Science)","HSC Science","HSC Arts"];
const SECTIONS    = ["A","B","1st Year – Einstein","1st Year – Newton","2nd Year – Curie"];
const SESSIONS    = ["2024-2025","2025-2026","2026-2027"];
const EXAMS       = ["Half Yearly Examination – 2026","Annual Examination – 2025","Pre-Test Examination – 2025"];
const CARD_TYPES  = ["Without Background","With Background"];

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

/* ─── Single Admit Card ─── */
function AdmitCardView({ student, examName, section, session, cardType }) {
  const withBg = cardType === "With Background";
  return (
    <div
      className={`admit-card-print w-full max-w-[720px] mx-auto rounded-2xl border-2 border-gray-800 overflow-hidden ${withBg ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white" : "bg-white text-gray-900"}`}
      style={{ pageBreakAfter: "always", fontFamily: "Georgia, serif" }}
    >
      {/* Card Header */}
      <div className={`flex items-center justify-between px-6 pt-5 pb-4 border-b-2 ${withBg ? "border-slate-600" : "border-gray-800"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xs border-2 ${withBg ? "bg-slate-700 border-slate-500 text-slate-300" : "bg-gray-100 border-gray-800 text-gray-600"}`}>LOGO</div>
          <div>
            <p className={`text-base font-bold uppercase tracking-wide ${withBg ? "text-white" : "text-gray-900"}`}>BAF Shaheen College Bogura</p>
            <p className={`text-xs ${withBg ? "text-slate-400" : "text-gray-500"}`}>Bogura Cantonment, Bogura – 5800, Bangladesh</p>
          </div>
        </div>
        <div className={`w-16 h-20 rounded-lg border-2 flex items-center justify-center text-xs ${withBg ? "bg-slate-700 border-slate-500 text-slate-400" : "bg-gray-50 border-gray-800 text-gray-400"}`}>Photo</div>
      </div>

      {/* Title */}
      <div className={`px-6 py-3 text-center border-b-2 ${withBg ? "bg-slate-700/50 border-slate-600" : "bg-gray-100 border-gray-800"}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest ${withBg ? "text-slate-300" : "text-gray-500"}`}>Admit Card</p>
        <p className={`text-base font-bold mt-0.5 ${withBg ? "text-white" : "text-gray-900"}`}>{examName}</p>
      </div>

      {/* Student Info */}
      <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
        {[
          ["Name",        student.name],
          ["Student ID",  student.id],
          ["Roll No.",    student.roll],
          ["Class",       "HSC Science"],
          ["Section",     section],
          ["Session",     session],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start gap-2">
            <span className={`font-semibold min-w-[80px] text-xs uppercase tracking-wide pt-0.5 ${withBg ? "text-slate-400" : "text-gray-500"}`}>{label}</span>
            <span className={`font-bold text-sm ${withBg ? "text-white" : "text-gray-900"}`}>{val}</span>
          </div>
        ))}
      </div>

      {/* Exam Table */}
      <div className={`mx-6 mb-4 rounded-xl overflow-hidden border-2 ${withBg ? "border-slate-600" : "border-gray-800"}`}>
        <table className="w-full text-xs">
          <thead>
            <tr className={withBg ? "bg-slate-600 text-white" : "bg-gray-800 text-white"}>
              {["Date & Day","Start Time","Duration","Subject & Code"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXAM_ROUTINE.map((r, i) => (
              <tr key={i} className={`border-b ${withBg ? "border-slate-700 even:bg-slate-700/30" : "border-gray-200 even:bg-gray-50"}`}>
                <td className="px-3 py-2.5 font-medium">{r.date} – {r.day}</td>
                <td className="px-3 py-2.5">{r.time}</td>
                <td className="px-3 py-2.5">{r.durationHr}h {r.durationMin > 0 ? `${r.durationMin}m` : ""}</td>
                <td className="px-3 py-2.5 font-semibold">{r.subject} <span className={`font-normal ${withBg ? "text-slate-400" : "text-gray-500"}`}>({r.code})</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Directions */}
      <div className={`mx-6 mb-4 p-3.5 rounded-xl text-xs space-y-1 border ${withBg ? "bg-slate-700/30 border-slate-600 text-slate-300" : "bg-blue-50 border-blue-200 text-gray-700"}`}>
        <p className="font-bold uppercase tracking-wide mb-1">Directions</p>
        <p>1. The examinee must bring the admit card to the examination hall.</p>
        <p>2. The examinee must sign the attendance sheet for each subject, otherwise they will be treated as absent.</p>
        <p>3. Mobile phones and electronic devices are strictly prohibited in the examination hall.</p>
      </div>

      {/* Signatures */}
      <div className={`px-6 pb-5 grid grid-cols-3 gap-6 pt-2 border-t-2 ${withBg ? "border-slate-600" : "border-gray-300"}`}>
        {["Student's Signature","Class Teacher's Signature","Principal's Signature"].map((sig) => (
          <div key={sig} className="text-center">
            <div className={`h-10 border-b-2 mb-1.5 ${withBg ? "border-slate-500" : "border-gray-700"}`} />
            <p className={`text-xs font-semibold ${withBg ? "text-slate-400" : "text-gray-500"}`}>{sig}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ExamAdmitCard() {
  const printRef = useRef();
  const [form, setForm] = useState({
    eduLevel: "", department: "", className: "", section: "",
    session: "", examName: "", studentName: "", rollFrom: 1, rollTo: 11,
    cardType: CARD_TYPES[0], forEvery: true,
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

  const handlePrint = () => window.print();

  const visibleStudents = STUDENTS.filter((s) => s.roll >= form.rollFrom && s.roll <= form.rollTo);
  const displayStudents = form.studentName ? STUDENTS.filter((s) => s.name.includes(form.studentName)) : visibleStudents;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Exam & Result","Admit Card"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <GraduationCap size={22} className="text-blue-500" /> Student Admit Card
            </h1>
          </div>
          {show && (
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-xl transition-colors shadow-sm flex-shrink-0">
              <Printer size={15} /> Print All
            </button>
          )}
        </div>

        {/* Filter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden print:hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Admit Card Parameters</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <F label="Education Level">
                <select value={form.eduLevel} onChange={(e) => set("eduLevel", e.target.value)} className={inp}>
                  <option value="">Select Edu. Level</option>
                  {EDU_LEVELS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Department">
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={inp}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Class">
                <select value={form.className} onChange={(e) => set("className", e.target.value)} className={inp}>
                  <option value="">Select Class</option>
                  {CLASSES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Section">
                <select value={form.section} onChange={(e) => set("section", e.target.value)} className={inp}>
                  <option value="">Select Section</option>
                  {SECTIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Session">
                <select value={form.session} onChange={(e) => set("session", e.target.value)} className={inp}>
                  <option value="">Select Session</option>
                  {SESSIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Exam Name">
                <select value={form.examName} onChange={(e) => set("examName", e.target.value)} className={inp}>
                  <option value="">Select Exam</option>
                  {EXAMS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Student Name">
                <select value={form.studentName} onChange={(e) => set("studentName", e.target.value)} className={inp}>
                  <option value="">All Students</option>
                  {STUDENTS.map((s) => <option key={s.id}>{s.name}</option>)}
                </select>
              </F>
              <F label="Admit Card Type">
                <select value={form.cardType} onChange={(e) => set("cardType", e.target.value)} className={inp}>
                  {CARD_TYPES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <F label="Roll From">
                <input type="number" min={1} value={form.rollFrom} onChange={(e) => set("rollFrom", +e.target.value)} className={inp} />
              </F>
              <F label="Roll To">
                <input type="number" min={1} value={form.rollTo} onChange={(e) => set("rollTo", +e.target.value)} className={inp} />
              </F>
              <F label="Generate for every student?">
                <label className="flex items-center gap-2.5 cursor-pointer h-10">
                  <div onClick={() => set("forEvery", !form.forEvery)}
                    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer ${form.forEvery ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}
                    style={{ height: "22px" }}>
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                      style={{ transform: form.forEvery ? "translateX(18px)" : "translateX(0)" }} />
                  </div>
                  <span className={`text-sm font-semibold ${form.forEvery ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>{form.forEvery ? "Yes" : "No"}</span>
                </label>
              </F>
              <div>
                <button onClick={handleView} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 disabled:opacity-60">
                  {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Loading…</> : <><Eye size={14} />View Admit Card</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admit Cards */}
        {show && (
          <div ref={printRef} className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{displayStudents.length} admit card{displayStudents.length !== 1 ? "s" : ""} generated</span>
              </div>
            </div>
            {displayStudents.map((student) => (
              <AdmitCardView
                key={student.id}
                student={student}
                examName={form.examName || EXAMS[0]}
                section={form.section || SECTIONS[0]}
                session={form.session || SESSIONS[0]}
                cardType={form.cardType}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}