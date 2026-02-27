import React, { useState, useMemo } from "react";
import {
  ChevronRight, ChevronLeft, Calendar, Plus, X, Edit2,
  Check, BookOpen, GraduationCap, Award, Clock, Filter,
  Download, Printer, Trash2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Event Categories ─── */
const CATEGORIES = [
  { id: "exam",      label: "Examination",  color: "bg-red-500",    light: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30"    },
  { id: "holiday",   label: "Holiday",      color: "bg-green-500",  light: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30"  },
  { id: "event",     label: "School Event", color: "bg-blue-500",   light: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"     },
  { id: "activity",  label: "Activity",     color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30" },
  { id: "meeting",   label: "Meeting",      color: "bg-amber-500",  light: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"  },
];

/* ─── Initial Events ─── */
const INITIAL_EVENTS = [
  { id:1,  date:"2025-01-01", title:"New Year Holiday",               cat:"holiday"  },
  { id:2,  date:"2025-02-14", title:"Annual Sports Day",              cat:"event"    },
  { id:3,  date:"2025-02-21", title:"International Mother Language Day",cat:"holiday"},
  { id:4,  date:"2025-03-03", title:"Half-Yearly Exam Starts",        cat:"exam"     },
  { id:5,  date:"2025-03-15", title:"Half-Yearly Exam Ends",          cat:"exam"     },
  { id:6,  date:"2025-03-26", title:"Independence Day",               cat:"holiday"  },
  { id:7,  date:"2025-04-01", title:"Parents-Teachers Meeting",       cat:"meeting"  },
  { id:8,  date:"2025-04-14", title:"Bangla New Year (Pahela Baishakh)", cat:"holiday"},
  { id:9,  date:"2025-05-01", title:"Labour Day Holiday",             cat:"holiday"  },
  { id:10, date:"2025-05-08", title:"Science Fair",                   cat:"activity" },
  { id:11, date:"2025-06-10", title:"Summer Vacation Begins",         cat:"holiday"  },
  { id:12, date:"2025-07-01", title:"Summer Vacation Ends",           cat:"holiday"  },
  { id:13, date:"2025-08-15", title:"Annual Prize Giving Ceremony",   cat:"event"    },
  { id:14, date:"2025-09-01", title:"Pre-Test Examination",           cat:"exam"     },
  { id:15, date:"2025-10-05", title:"Annual Exam Preparation Meeting",cat:"meeting"  },
  { id:16, date:"2025-11-01", title:"Annual Examination Starts",      cat:"exam"     },
  { id:17, date:"2025-11-20", title:"Annual Examination Ends",        cat:"exam"     },
  { id:18, date:"2025-12-16", title:"Victory Day",                    cat:"holiday"  },
  { id:19, date:"2025-12-25", title:"Christmas Holiday",              cat:"holiday"  },
  { id:20, date:"2025-12-31", title:"Year-End Assembly",              cat:"event"    },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

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

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function getCat(id) { return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]; }

export default function AcademicCalendar() {
  const today   = new Date();
  const [year,  setYear]   = useState(today.getFullYear());
  const [month, setMonth]  = useState(today.getMonth());
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filterCat, setFilterCat] = useState("all");
  const [modal, setModal]  = useState(null); // { mode:'add'|'edit'|'view', date?, event? }
  const [form,  setForm]   = useState({ title:"", cat:"exam", date:"", note:"" });
  const [selectedDay, setSelectedDay] = useState(null);

  /* ── Calendar grid ── */
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMo  = new Date(year, month + 1, 0).getDate();
  const prevDays  = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const arr = [];
    for (let i = firstDay - 1; i >= 0; i--) arr.push({ day: prevDays - i, cur: false });
    for (let d = 1; d <= daysInMo; d++) arr.push({ day: d, cur: true });
    while (arr.length % 7 !== 0) arr.push({ day: arr.length - daysInMo - firstDay + 1, cur: false });
    return arr;
  }, [year, month, firstDay, daysInMo, prevDays]);

  const eventsForDate = (d) => {
    if (!d.cur) return [];
    const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(d.day).padStart(2,"0")}`;
    return events.filter((e) => e.date === key && (filterCat === "all" || e.cat === filterCat));
  };

  const monthEvents = useMemo(() =>
    events.filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return y === year && m === month + 1 && (filterCat === "all" || e.cat === filterCat);
    }).sort((a, b) => a.date.localeCompare(b.date)),
  [events, year, month, filterCat]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const openAdd = (date = "") => {
    setForm({ title:"", cat:"exam", date, note:"" });
    setModal({ mode:"add" });
  };

  const openEdit = (ev) => {
    setForm({ title: ev.title, cat: ev.cat, date: ev.date, note: ev.note || "" });
    setModal({ mode:"edit", event: ev });
  };

  const saveEvent = () => {
    if (!form.title.trim() || !form.date) return;
    if (modal.mode === "add") {
      setEvents(p => [...p, { id: Date.now(), ...form }]);
    } else {
      setEvents(p => p.map(e => e.id === modal.event.id ? { ...e, ...form } : e));
    }
    setModal(null);
  };

  const deleteEvent = (id) => { setEvents(p => p.filter(e => e.id !== id)); };

  const isToday = (d) => d.cur && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const stats = useMemo(() => {
    const all = events.filter(e => { const [y,m] = e.date.split("-").map(Number); return y === year && m === month + 1; });
    return CATEGORIES.map(c => ({ ...c, count: all.filter(e => e.cat === c.id).length }));
  }, [events, year, month]);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Academic","Academic Calendar"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar size={22} className="text-blue-500" /> Academic Calendar
            </h1>
          </div>
          <button onClick={() => openAdd()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Event
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div key={s.id}
              onClick={() => setFilterCat(filterCat === s.id ? "all" : s.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${filterCat === s.id ? s.light + " ring-2 ring-offset-1 ring-current" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color}`} />
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-none">{s.count}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Calendar Grid ── */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                <ChevronLeft size={16} className="text-gray-500" />
              </button>
              <div className="text-center">
                <p className="text-base font-bold text-gray-800 dark:text-white">{MONTHS[month]}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{year}</p>
              </div>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
              {DAYS.map((d) => (
                <div key={d} className="py-2.5 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-700/50">
              {cells.map((d, i) => {
                const dayEvents = eventsForDate(d);
                const today_ = isToday(d);
                const dateKey = d.cur ? `${year}-${String(month+1).padStart(2,"0")}-${String(d.day).padStart(2,"0")}` : "";
                return (
                  <div key={i}
                    onClick={() => d.cur && (setSelectedDay(dateKey === selectedDay ? null : dateKey))}
                    className={`min-h-[76px] p-1.5 cursor-pointer transition-colors relative
                      ${!d.cur ? "bg-gray-50/60 dark:bg-gray-800/30" : selectedDay === dateKey ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-gray-50/70 dark:hover:bg-gray-700/20"}`}>
                    {/* Date number */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ml-auto
                      ${today_ ? "bg-blue-600 text-white" : d.cur ? "text-gray-700 dark:text-gray-200" : "text-gray-300 dark:text-gray-600"}`}>
                      {d.day}
                    </div>
                    {/* Events */}
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div key={ev.id}
                          onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                          className={`truncate text-[9px] font-semibold px-1 py-0.5 rounded cursor-pointer ${getCat(ev.cat).light}`}>
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-gray-400 px-1">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                    {/* Add dot */}
                    {d.cur && dayEvents.length === 0 && (
                      <button onClick={(e) => { e.stopPropagation(); openAdd(dateKey); }}
                        className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Plus size={8} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Events Sidebar ── */}
          <div className="space-y-4">
            {/* Year nav */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Navigate Year</p>
              <div className="flex items-center justify-between">
                <button onClick={() => setYear(y => y - 1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
                  <ChevronLeft size={16} className="text-gray-500" />
                </button>
                <span className="text-lg font-bold text-gray-800 dark:text-white">{year}</span>
                <button onClick={() => setYear(y => y + 1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
                  <ChevronRight size={16} className="text-gray-500" />
                </button>
              </div>
              {/* Month mini-nav */}
              <div className="grid grid-cols-4 gap-1 mt-3">
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => setMonth(i)}
                    className={`text-xs py-1 rounded-lg transition-colors font-medium
                      ${i === month ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                    {m.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>

            {/* This month's events */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{MONTHS[month]} Events</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{monthEvents.length}</span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
                {monthEvents.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Calendar size={28} className="mx-auto text-gray-200 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">No events this month</p>
                  </div>
                ) : monthEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors group">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getCat(ev.cat).color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{ev.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{ev.date.slice(8)} {MONTHS[month].slice(0,3)}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(ev)} className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><Edit2 size={11} /></button>
                      <button onClick={() => deleteEvent(ev.id)} className="w-6 h-6 rounded hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-gray-400 hover:text-red-500"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Legend</p>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${c.color}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Add/Edit Modal ── */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {modal.mode === "add" ? "Add New Event" : "Edit Event"}
                </span>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Enter event title…" className={inp} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} className={inp} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                    <select value={form.cat} onChange={(e) => setForm(p => ({ ...p, cat: e.target.value }))} className={inp}>
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Note (optional)</label>
                  <textarea rows={2} value={form.note} onChange={(e) => setForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="Additional notes…" className={`${inp} resize-none`} />
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                {modal.mode === "edit" && (
                  <button onClick={() => { deleteEvent(modal.event.id); setModal(null); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                  <button onClick={saveEvent} disabled={!form.title.trim() || !form.date}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm">
                    <Check size={14} /> {modal.mode === "add" ? "Add Event" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}