import React, { useState } from "react";
import {
  ChevronRight, GraduationCap, Eye, Printer, Filter,
  CheckCircle2, QrCode, ImageIcon, User,
} from "lucide-react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";

/* ─── Data ─── */
const STUDENTS = [
  { id: "250060001", name: "MD. ALIF",                  roll: 1 },
  { id: "250060002", name: "SHIMU RANI SHAHA",          roll: 2 },
  { id: "250060003", name: "FALAK ANSARY",              roll: 3 },
  { id: "250060004", name: "MUSARRAT TABASSUM MUSKAN",  roll: 4 },
  { id: "250060005", name: "TAIYABA",                   roll: 5 },
  { id: "250060006", name: "RIFAT HOSSAIN",             roll: 6 },
  { id: "250060007", name: "SUMAIYA AKTER",             roll: 7 },
  { id: "250060008", name: "NUSRAT JAHAN RIMI",         roll: 8 },
];

const EDU_LEVELS  = ["Pre-Primary","Primary","Six-Eight","Nine-Ten","Higher Secondary"];
const DEPARTMENTS = ["Default","Science","Arts","Commerce"];
const CLASSES     = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine (Science)","Ten (Science)"];
const SECTIONS    = ["A","B","C","Archimedes","Bulbuli","Doyel"];
const SESSIONS    = ["2025","2024-2025","2025-2026"];
const EXAMS       = ["Annual Exam – 2025","Half Yearly – 2025","Monthly Test – 2025"];
const IMAGE_FMTS  = ["Without Student Image","With Student Image"];
const BARCODE_POS = ["No Barcode","Barcode at the Top","Barcode at the Bottom"];

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

/* ─── Barcode Graphic (SVG) ─── */
function BarcodeGraphic({ value }) {
  const bars = value.split("").map((c) => c.charCodeAt(0) % 3 + 1);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-end gap-px h-7">
        {bars.map((w, i) => (
          <div key={i} style={{ width: `${w}px`, height: `${14 + (i % 3) * 4}px` }} className="bg-gray-900" />
        ))}
      </div>
      <p className="text-[8px] font-mono tracking-widest text-gray-700">{value}</p>
    </div>
  );
}

/* ─── Single Minimal Card ─── */
function MinimalCard({ student, examName, examDate, className, section, session, group, showImage, barcodePos }) {
  const showBarcode = barcodePos !== "No Barcode";
  const barcodeTop  = barcodePos === "Barcode at the Top";

  return (
    <div className="admit-card-print w-64 rounded-xl border-2 border-gray-700 overflow-hidden bg-white"
      style={{ pageBreakInside: "avoid", fontFamily: "Arial, sans-serif" }}>

      {/* Barcode at top */}
      {showBarcode && barcodeTop && (
        <div className="flex justify-center py-2 bg-gray-50 border-b border-gray-200">
          <BarcodeGraphic value={student.id} />
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-800 text-white px-3 py-2.5">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 rounded-lg bg-gray-600 flex items-center justify-center text-[8px] font-bold border border-gray-500 flex-shrink-0">LOGO</div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase leading-tight">PATGUDAM HIGH SCHOOL</p>
            <p className="text-[8px] text-gray-400 leading-tight mt-0.5">Kali Bari Road, Patgudam, Mymensingh</p>
          </div>
        </div>
      </div>

      {/* Card Title */}
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Admit Card</p>
          <p className="text-[11px] font-bold text-gray-800 leading-tight">{examName || EXAMS[0]}</p>
        </div>
        {showImage && (
          <div className="w-12 h-14 rounded border-2 border-gray-400 bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 ml-2">
            <User size={16} className="text-gray-300" />
            <p className="text-[7px] text-gray-300 mt-0.5">Photo</p>
          </div>
        )}
      </div>

      {/* Exam Date */}
      <div className="px-3 py-1.5 bg-blue-50 border-b border-blue-100">
        <p className="text-[9px] font-semibold text-blue-700 uppercase tracking-wide">Exam Start Date: {examDate || "20/11/2025"}</p>
      </div>

      {/* Student Info */}
      <div className="px-3 py-2.5 space-y-1">
        {[
          ["Name",       student.name],
          ["Student ID", student.id],
          ["Roll No.",   student.roll],
          ["Class",      className || "Six"],
          ["Session",    session || "2025"],
          ["Group",      group || "Default"],
          ["Section",    section || "A"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-start gap-1.5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide w-16 shrink-0 pt-px">{label}</span>
            <span className="text-[10px] font-bold text-gray-900 leading-tight">{val}</span>
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-3 px-3 pt-1 pb-3 border-t border-gray-200">
        {["Class Teacher","Headmaster"].map((sig) => (
          <div key={sig} className="text-center">
            <div className="h-6 border-b border-gray-500 mb-1" />
            <p className="text-[8px] text-gray-500 font-semibold">{sig}</p>
          </div>
        ))}
      </div>

      {/* Barcode at bottom */}
      {showBarcode && !barcodeTop && (
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <BarcodeGraphic value={student.id} />
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function MinimalAdmitCard() {
  const [form, setForm] = useState({
    eduLevel: "Six-Eight", department: "Default", className: "Six",
    section: "A", session: "2025", examName: EXAMS[0],
    studentName: "", rollFrom: 1, rollTo: 20,
    imageFormat: IMAGE_FMTS[0], barcode: BARCODE_POS[0],
    examDate: "20/11/2025",
  });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setShow(false); };

  const handleView = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setShow(true);
  };

  const displayStudents = STUDENTS.filter((s) => {
    const inRange = s.roll >= form.rollFrom && s.roll <= form.rollTo;
    const matchName = !form.studentName || s.name.includes(form.studentName);
    return inRange && matchName;
  });

  const showImage  = form.imageFormat === IMAGE_FMTS[1];

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Exam & Result","Admit Card Report"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <GraduationCap size={22} className="text-indigo-500" /> Student Admit Card Report
            </h1>
          </div>
          {show && (
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-xl transition-colors shadow-sm flex-shrink-0">
              <Printer size={15} /> Print All
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden print:hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            <Filter size={14} className="text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Admit Card Parameters</span>
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
              <F label="Exam Name">
                <select value={form.examName} onChange={(e) => set("examName", e.target.value)} className={inp}>
                  {EXAMS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Student Name">
                <select value={form.studentName} onChange={(e) => set("studentName", e.target.value)} className={inp}>
                  <option value="">All Students</option>
                  {STUDENTS.map((s) => <option key={s.id}>{s.name}</option>)}
                </select>
              </F>
              <F label="Exam Start Date">
                <input type="date" value={form.examDate.split("/").reverse().join("-")}
                  onChange={(e) => { const [y,m,d] = e.target.value.split("-"); set("examDate", `${d}/${m}/${y}`); }}
                  className={inp} />
              </F>
              <F label="Image Format">
                <select value={form.imageFormat} onChange={(e) => set("imageFormat", e.target.value)} className={inp}>
                  {IMAGE_FMTS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Barcode">
                <select value={form.barcode} onChange={(e) => set("barcode", e.target.value)} className={inp}>
                  {BARCODE_POS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Roll From">
                <input type="number" min={1} value={form.rollFrom} onChange={(e) => set("rollFrom", +e.target.value)} className={inp} />
              </F>
              <F label="Roll To">
                <input type="number" min={1} value={form.rollTo} onChange={(e) => set("rollTo", +e.target.value)} className={inp} />
              </F>
            </div>

            <div className="flex gap-3">
              <button onClick={handleView} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-60">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Loading…</> : <><Eye size={14} />View Admit Card</>}
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {show && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 print:hidden">
              <CheckCircle2 size={15} className="text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {displayStudents.length} admit card{displayStudents.length !== 1 ? "s" : ""} generated
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                · {showImage ? "With photo" : "No photo"} · {form.barcode}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {displayStudents.map((s) => (
                <MinimalCard
                  key={s.id}
                  student={s}
                  examName={form.examName}
                  examDate={form.examDate}
                  className={form.className}
                  section={form.section}
                  session={form.session}
                  group={form.department}
                  showImage={showImage}
                  barcodePos={form.barcode}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}