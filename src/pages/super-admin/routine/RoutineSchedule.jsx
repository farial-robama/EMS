import React, { useState, useMemo } from "react";
import {
  ChevronRight, Plus, Edit2, Trash2, Check, X,
  Calendar, BookOpen, User, Search, RefreshCw, AlertCircle,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Data ─── */
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
const PERIODS = [
  { id:"p1", name:"1st",   time:"08:00–08:45" },
  { id:"p2", name:"2nd",   time:"08:45–09:30" },
  { id:"p3", name:"3rd",   time:"09:45–10:30" },
  { id:"p4", name:"4th",   time:"10:30–11:15" },
  { id:"p5", name:"5th",   time:"11:45–12:30" },
  { id:"p6", name:"6th",   time:"12:30–13:15" },
];

const SUBJECTS   = ["Bangla","English","Mathematics","Science","Physics","Chemistry","Biology","ICT","History","Geography","Islamic Studies","Arabic","Physical Education"];
const TEACHERS   = ["Mr. Karim","Mrs. Jahan","Mr. Ahmed","Mrs. Begum","Mr. Hossain","Mrs. Islam","Mr. Rahman","Mrs. Akter","Mr. Das","Mrs. Roy"];
const CLASSES    = ["Six","Seven","Eight","Nine (Science)","Nine (Arts)","Ten (Science)","Ten (Arts)","HSC Science","HSC Arts"];
const SECTIONS   = ["A","B","C","1st Year","2nd Year","Archimedes","Newton","Einstein"];
const SHIFTS     = ["Day","Morning","Evening"];

/* colour per subject (cycling) */
const SUB_COLORS = [
  "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  "bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  "bg-lime-50 dark:bg-lime-900/20 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-800",
  "bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800",
];

const subColor = (sub) => SUB_COLORS[SUBJECTS.indexOf(sub) % SUB_COLORS.length] ?? SUB_COLORS[0];

/* Build a sample routine for Nine Science / A */
const buildSample = () => {
  const data = {};
  const subsByDay = [
    ["Bangla","English","Mathematics","Physics","Chemistry","ICT"],
    ["English","Mathematics","Science","Chemistry","History","Bangla"],
    ["Mathematics","Physics","Bangla","ICT","Arabic","Science"],
    ["ICT","Bangla","English","Geography","Mathematics","Physics"],
    ["Physics","Chemistry","Mathematics","Bangla","English","Science"],
  ];
  DAYS.forEach((day, di) => {
    data[day] = {};
    PERIODS.forEach((p, pi) => {
      const sub = subsByDay[di][pi];
      data[day][p.id] = { subject: sub, teacher: TEACHERS[pi % TEACHERS.length] };
    });
  });
  return data;
};

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const BLANK_CELL = { subject: "", teacher: "" };

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

export default function RoutineSchedule() {
  const [cls,     setCls]     = useState("Nine (Science)");
  const [section, setSection] = useState("A");
  const [shift,   setShift]   = useState("Day");
  const [session, setSession] = useState("2025-2026");
  const [loaded,  setLoaded]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState({});

  /* cell edit modal */
  const [cellModal, setCellModal] = useState(null); // { day, periodId, current }
  const [cellForm,  setCellForm]  = useState(BLANK_CELL);
  const [errors,    setErrors]    = useState({});

  /* teacher search filter */
  const [filterTeacher, setFilterTeacher] = useState("");

  const handleLoad = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setRoutine(buildSample());
    setLoaded(true);
    setLoading(false);
  };

  const handleReset = () => { setRoutine({}); setLoaded(false); };

  const openCell = (day, pid) => {
    const cur = routine[day]?.[pid] || BLANK_CELL;
    setCellForm({ subject: cur.subject, teacher: cur.teacher });
    setErrors({});
    setCellModal({ day, periodId: pid });
  };

  const saveCell = () => {
    const e = {};
    if (!cellForm.subject) e.subject = "Required";
    if (!cellForm.teacher) e.teacher = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setRoutine(p => ({
      ...p,
      [cellModal.day]: { ...(p[cellModal.day] || {}), [cellModal.periodId]: cellForm }
    }));
    setCellModal(null);
  };

  const clearCell = (day, pid) => {
    setRoutine(p => ({ ...p, [day]: { ...(p[day] || {}), [pid]: null } }));
  };

  /* teacher workload summary */
  const teacherLoad = useMemo(() => {
    const counts = {};
    Object.values(routine).forEach(daySlots => {
      Object.values(daySlots || {}).forEach(cell => {
        if (cell?.teacher) counts[cell.teacher] = (counts[cell.teacher] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [routine]);

  const filteredTeacherLoad = filterTeacher
    ? teacherLoad.filter(([t]) => t.toLowerCase().includes(filterTeacher.toLowerCase()))
    : teacherLoad;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Academic Setup","Routine Schedule"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar size={22} className="text-indigo-500" /> Routine Schedule
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Weekly class timetable — assign subjects and teachers per period</p>
          </div>
          {loaded && (
            <button onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
              <RefreshCw size={14}/> Change Class
            </button>
          )}
        </div>

        {/* Filter / load */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            <BookOpen size={14} className="text-indigo-500"/>
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Select Class &amp; Session</span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label:"Class",   val:cls,     set:setCls,     opts:CLASSES   },
              { label:"Section", val:section, set:setSection, opts:SECTIONS  },
              { label:"Shift",   val:shift,   set:setShift,   opts:SHIFTS    },
              { label:"Session", val:session, set:setSession, opts:["2024-2025","2025-2026","2026-2027"] },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <select value={val} onChange={e => { set(e.target.value); setLoaded(false); }} className={inp}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <button onClick={handleLoad} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl transition-colors shadow-sm shadow-indigo-200">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Loading…</> : <><Calendar size={14}/>Load Routine</>}
            </button>
          </div>
        </div>

        {/* Routine grid + sidebar */}
        {loaded && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

            {/* Grid */}
            <div className="xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    Class <span className="text-indigo-600 dark:text-indigo-400">{cls}</span> — Section <span className="text-indigo-600 dark:text-indigo-400">{section}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{shift} Shift · {session} · Click any cell to assign</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth:"700px" }}>
                  <thead>
                    <tr>
                      <th className="w-24 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-r border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">Day \ Period</th>
                      {PERIODS.map(p => (
                        <th key={p.id} className="px-2 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-r border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 text-center last:border-r-0">
                          <div>{p.name}</div>
                          <div className="text-[9px] font-normal text-gray-400 mt-0.5">{p.time}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day, di) => (
                      <tr key={day} className={di % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/40 dark:bg-gray-700/10"}>
                        <td className="px-4 py-2 border-b border-r border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap align-middle">
                          {day.slice(0,3)}
                        </td>
                        {PERIODS.map(p => {
                          const cell = routine[day]?.[p.id];
                          return (
                            <td key={p.id} className="p-1 border-b border-r border-gray-100 dark:border-gray-700 last:border-r-0 align-top">
                              {cell ? (
                                <div
                                  onClick={() => openCell(day, p.id)}
                                  className={`group relative rounded-lg border p-2 cursor-pointer transition-all hover:shadow-sm ${subColor(cell.subject)}`}>
                                  <p className="text-[11px] font-bold leading-tight truncate">{cell.subject}</p>
                                  <p className="text-[9px] opacity-70 mt-0.5 truncate flex items-center gap-0.5">
                                    <User size={8}/>{cell.teacher.replace("Mr. ","").replace("Mrs. ","")}
                                  </p>
                                  <button
                                    onClick={e => { e.stopPropagation(); clearCell(day, p.id); }}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded opacity-0 group-hover:opacity-100 bg-white/70 dark:bg-black/30 flex items-center justify-center transition-all hover:bg-red-100">
                                    <X size={8} className="text-red-500"/>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => openCell(day, p.id)}
                                  className="rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all min-h-[52px] flex items-center justify-center">
                                  <Plus size={12} className="text-gray-300 dark:text-gray-600"/>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar: teacher load */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Teacher Workload</p>
                  <p className="text-xs text-gray-400 mt-0.5">Periods per teacher this week</p>
                </div>
                <div className="p-3">
                  <div className="relative mb-3">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input placeholder="Filter teachers…" value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-indigo-500 w-full"/>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {filteredTeacherLoad.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No teachers assigned yet</p>
                    ) : filteredTeacherLoad.map(([teacher, count]) => {
                      const pct = Math.round((count / (DAYS.length * PERIODS.length)) * 100);
                      return (
                        <div key={teacher}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{teacher}</span>
                            <span className="text-gray-400 ml-2 flex-shrink-0">{count} pd</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width:`${pct}%` }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Subject coverage */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Subject Coverage</p>
                </div>
                <div className="p-3 space-y-1.5">
                  {SUBJECTS.map(sub => {
                    let count = 0;
                    Object.values(routine).forEach(day => Object.values(day||{}).forEach(cell => { if (cell?.subject===sub) count++; }));
                    if (count === 0) return null;
                    return (
                      <div key={sub} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-block w-2 h-2 rounded-full ${subColor(sub).split(" ")[0].replace("bg-","bg-").replace("-50","").replace("-900/20","")}`}
                            style={{ background: undefined }}/>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${subColor(sub)}`}>{sub}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{count}×</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cell Edit Modal */}
        {cellModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setCellModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Assign Period</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cellModal.day} · {PERIODS.find(p=>p.id===cellModal.periodId)?.name} ({PERIODS.find(p=>p.id===cellModal.periodId)?.time})</p>
                </div>
                <button onClick={() => setCellModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><X size={14}/></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subject *</label>
                  <select value={cellForm.subject} onChange={e => setCellForm(p => ({...p, subject: e.target.value}))} className={errors.subject ? `${inp} border-red-400` : inp} autoFocus>
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11}/>{errors.subject}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teacher *</label>
                  <select value={cellForm.teacher} onChange={e => setCellForm(p => ({...p, teacher: e.target.value}))} className={errors.teacher ? `${inp} border-red-400` : inp}>
                    <option value="">Select Teacher</option>
                    {TEACHERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.teacher && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11}/>{errors.teacher}</p>}
                </div>
                {cellForm.subject && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${subColor(cellForm.subject)}`}>
                    <BookOpen size={12}/>{cellForm.subject}
                    {cellForm.teacher && <><span className="opacity-40">·</span><User size={12}/>{cellForm.teacher}</>}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setCellModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={saveCell} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  <Check size={14}/>Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}