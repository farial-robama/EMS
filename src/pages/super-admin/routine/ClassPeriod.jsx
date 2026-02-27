import React, { useState, useMemo } from "react";
import {
  ChevronRight, Plus, Edit2, Trash2, Check, X, Clock,
  AlertCircle, Search, Filter, ToggleLeft, Timer,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Constants ─── */
const PERIOD_TYPES = ["class", "break", "special", "exam", "activity"];

const TYPE_META = {
  class:    { label: "Class",    dot: "bg-blue-500",   badge: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40"    },
  break:    { label: "Break",    dot: "bg-green-500",  badge: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40"  },
  special:  { label: "Special",  dot: "bg-purple-500", badge: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40"},
  exam:     { label: "Exam",     dot: "bg-red-500",    badge: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40"          },
  activity: { label: "Activity", dot: "bg-amber-500",  badge: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"  },
};

const TIMELINE_COLORS = {
  class:    "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300",
  break:    "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300",
  special:  "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300",
  exam:     "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300",
  activity: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300",
};

const INITIAL_PERIODS = [
  { id:1,  name:"Assembly",     startTime:"07:45", endTime:"08:00", type:"special", active:true  },
  { id:2,  name:"1st Period",   startTime:"08:00", endTime:"08:45", type:"class",   active:true  },
  { id:3,  name:"2nd Period",   startTime:"08:45", endTime:"09:30", type:"class",   active:true  },
  { id:4,  name:"Short Break",  startTime:"09:30", endTime:"09:45", type:"break",   active:true  },
  { id:5,  name:"3rd Period",   startTime:"09:45", endTime:"10:30", type:"class",   active:true  },
  { id:6,  name:"4th Period",   startTime:"10:30", endTime:"11:15", type:"class",   active:true  },
  { id:7,  name:"Tiffin Break", startTime:"11:15", endTime:"11:45", type:"break",   active:true  },
  { id:8,  name:"5th Period",   startTime:"11:45", endTime:"12:30", type:"class",   active:true  },
  { id:9,  name:"6th Period",   startTime:"12:30", endTime:"13:15", type:"class",   active:true  },
  { id:10, name:"Extra Class",  startTime:"13:15", endTime:"14:00", type:"class",   active:false },
];

const getMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const getDuration = (s, e) => { const d = getMins(e) - getMins(s); return d > 0 ? `${d} min` : "—"; };

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const BLANK = { name: "", startTime: "", endTime: "", type: "class", active: true };

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

function SlimToggle({ checked, onChange }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative w-9 flex-shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}
      style={{ height: "20px" }}>
      <span className="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }} />
    </button>
  );
}

function FieldErr({ msg }) {
  return msg ? <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle size={11} />{msg}</p> : null;
}

export default function ClassPeriod() {
  const [periods,     setPeriods]     = useState(INITIAL_PERIODS);
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(BLANK);
  const [editId,      setEditId]      = useState(null);
  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState("all");
  const [deleteId,    setDeleteId]    = useState(null);
  const [errors,      setErrors]      = useState({});

  const sorted = useMemo(() =>
    [...periods].sort((a, b) => a.startTime.localeCompare(b.startTime)), [periods]);

  const filtered = useMemo(() =>
    sorted.filter(p =>
      (filterType === "all" || p.type === filterType) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    ), [sorted, filterType, search]);

  const activeSorted = sorted.filter(p => p.active);

  const stats = {
    total:  periods.length,
    active: periods.filter(p => p.active).length,
    class:  periods.filter(p => p.type === "class").length,
    breaks: periods.filter(p => p.type === "break").length,
    totalClassMins: periods.filter(p => p.type === "class" && p.active)
      .reduce((s, p) => s + Math.max(0, getMins(p.endTime) - getMins(p.startTime)), 0),
  };

  const openAdd  = () => { setForm(BLANK); setErrors({}); setModal("add"); };
  const openEdit = (p)  => { setForm({ name:p.name, startTime:p.startTime, endTime:p.endTime, type:p.type, active:p.active }); setEditId(p.id); setErrors({}); setModal("edit"); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name      = "Required";
    if (!form.startTime)    e.startTime = "Required";
    if (!form.endTime)      e.endTime   = "Required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime) e.endTime = "Must be after start time";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === "add") setPeriods(p => [...p, { id: Date.now(), ...form }]);
    else setPeriods(p => p.map(x => x.id === editId ? { ...x, ...form } : x));
    setModal(null);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* Timeline pixel calc: map 07:45–14:30 across 100% */
  const TSTART = getMins("07:45");
  const TEND   = getMins("14:30");
  const TSPAN  = TEND - TSTART;
  const pct    = (t) => ((getMins(t) - TSTART) / TSPAN) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Academic Setup","Class Period"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Clock size={22} className="text-blue-500" /> Class Period
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Define and manage daily class periods, breaks, and special slots</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Period
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label:"Total Periods",   value: stats.total,         cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",    val:"text-blue-700 dark:text-blue-400"    },
            { label:"Active",          value: stats.active,        cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30", val:"text-green-700 dark:text-green-400"  },
            { label:"Class Slots",     value: stats.class,         cls:"bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30",val:"text-indigo-700 dark:text-indigo-400"},
            { label:"Breaks",          value: stats.breaks,        cls:"bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30", val:"text-amber-600 dark:text-amber-400"  },
            { label:"Class Time",      value: `${Math.floor(stats.totalClassMins/60)}h ${stats.totalClassMins%60}m`,
                                                                   cls:"bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",val:"text-purple-700 dark:text-purple-400"},
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
            <Timer size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Daily Timeline</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">07:45 → 14:30 · Active periods</span>
          </div>
          <div className="px-5 py-5">
            <div className="relative h-12">
              {/* base track */}
              <div className="absolute inset-y-3 left-0 right-0 bg-gray-100 dark:bg-gray-700 rounded-full" />
              {/* blocks */}
              {activeSorted.map(p => (
                <div key={p.id}
                  title={`${p.name}: ${p.startTime}–${p.endTime}`}
                  className={`absolute inset-y-1.5 flex items-center justify-center rounded-lg border text-[9px] font-bold overflow-hidden cursor-default transition-opacity hover:opacity-80 ${TIMELINE_COLORS[p.type]}`}
                  style={{ left:`${pct(p.startTime)}%`, width:`${pct(p.endTime) - pct(p.startTime)}%` }}>
                  <span className="truncate px-1">{p.name}</span>
                </div>
              ))}
            </div>
            {/* tick labels */}
            <div className="flex justify-between mt-1">
              {["07:45","09:00","10:00","11:00","12:00","13:00","14:30"].map(t => (
                <span key={t} className="text-[9px] text-gray-300 dark:text-gray-600 font-mono">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 flex-wrap">
              {["all", ...PERIOD_TYPES].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all capitalize
                    ${filterType === t
                      ? t === "all"
                        ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                        : `${TYPE_META[t].badge} ring-1 ring-inset ring-current`
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400"}`}>
                  {t === "all" ? `All (${periods.length})` : `${TYPE_META[t].label} (${periods.filter(p=>p.type===t).length})`}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input placeholder="Search period…" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"700px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {["#","Period Name","Start","End","Duration","Type","Active","Actions"].map(h => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h==="Actions"?"text-right pr-5":""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-14 text-center">
                    <Clock size={32} className="mx-auto text-gray-200 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">No periods match your filters</p>
                  </td></tr>
                ) : filtered.map((p, i) => {
                  const meta = TYPE_META[p.type];
                  return (
                    <tr key={p.id} className={`transition-colors ${!p.active ? "opacity-50" : "hover:bg-gray-50/70 dark:hover:bg-gray-700/20"}`}>
                      <td className="px-4 py-4 text-sm text-gray-400">{i+1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{p.startTime}</td>
                      <td className="px-4 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{p.endTime}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{getDuration(p.startTime, p.endTime)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}/>{meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <SlimToggle checked={p.active} onChange={() => setPeriods(pr => pr.map(x => x.id===p.id ? {...x, active:!x.active} : x))} />
                      </td>
                      <td className="px-4 py-4 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-200 dark:border-amber-900 transition-all"><Edit2 size={12}/></button>
                          <button onClick={() => setDeleteId(p.id)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-200 dark:border-red-900 transition-all"><Trash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400">{filtered.length} period{filtered.length!==1?"s":""} shown · {stats.active} active</p>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{modal==="add" ? "Add New Period" : "Edit Period"}</span>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14}/></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Period Name *</label>
                  <input type="text" value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. 1st Period, Lunch Break…" className={errors.name ? `${inp} border-red-400` : inp} autoFocus />
                  <FieldErr msg={errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Time *</label>
                    <input type="time" value={form.startTime} onChange={e => f("startTime", e.target.value)} className={errors.startTime ? `${inp} border-red-400` : inp} />
                    <FieldErr msg={errors.startTime} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Time *</label>
                    <input type="time" value={form.endTime} onChange={e => f("endTime", e.target.value)} className={errors.endTime ? `${inp} border-red-400` : inp} />
                    <FieldErr msg={errors.endTime} />
                  </div>
                </div>
                {form.startTime && form.endTime && getMins(form.endTime) > getMins(form.startTime) && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    <Clock size={11} /> Duration: {getDuration(form.startTime, form.endTime)}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</label>
                    <select value={form.type} onChange={e => f("type", e.target.value)} className={inp}>
                      {PERIOD_TYPES.map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active</label>
                    <div className="flex items-center gap-3 h-10">
                      <SlimToggle checked={form.active} onChange={() => f("active", !form.active)} />
                      <span className={`text-sm font-semibold ${form.active ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>{form.active ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={save} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <Check size={14}/>{modal==="add" ? "Add Period" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-500"/></div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Delete Period?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This will permanently remove <strong className="text-gray-700 dark:text-gray-200">{periods.find(p => p.id===deleteId)?.name}</strong>.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={() => { setPeriods(p => p.filter(x => x.id!==deleteId)); setDeleteId(null); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}