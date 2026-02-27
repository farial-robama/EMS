import React, { useState, useMemo } from "react";
import {
  ChevronRight, ChevronLeft, Calendar, Plus, X, Edit2,
  Check, Clock, MapPin, Users, Trash2, LayoutGrid, List,
  Filter, AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const CATEGORIES = [
  { id: "cultural",  label: "Cultural",   color: "bg-pink-500",    dot: "bg-pink-500",    light: "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900/30"     },
  { id: "sports",    label: "Sports",     color: "bg-green-500",   dot: "bg-green-500",   light: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30"   },
  { id: "academic",  label: "Academic",   color: "bg-blue-500",    dot: "bg-blue-500",    light: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"       },
  { id: "ceremony",  label: "Ceremony",   color: "bg-purple-500",  dot: "bg-purple-500",  light: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30"  },
  { id: "workshop",  label: "Workshop",   color: "bg-amber-500",   dot: "bg-amber-500",   light: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"    },
  { id: "meeting",   label: "Meeting",    color: "bg-slate-500",   dot: "bg-slate-500",   light: "bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-900/30"    },
];

const INITIAL_EVENTS = [
  { id:1,  title:"Annual Sports Day",              date:"2025-02-14", time:"09:00", endTime:"17:00", venue:"School Ground",       cat:"sports",    audience:"All Students",   desc:"Inter-house athletics and team sports competition."            },
  { id:2,  title:"Science Fair 2025",              date:"2025-05-08", time:"10:00", endTime:"16:00", venue:"Main Hall",           cat:"academic",  audience:"Class 6–12",     desc:"Students present their science projects to judges."            },
  { id:3,  title:"Annual Prize Giving Ceremony",   date:"2025-08-15", time:"10:00", endTime:"13:00", venue:"Auditorium",          cat:"ceremony",  audience:"All",            desc:"Recognition of academic and co-curricular achievements."       },
  { id:4,  title:"Cultural Week Opening",          date:"2025-09-10", time:"09:00", endTime:"12:00", venue:"Auditorium",          cat:"cultural",  audience:"All",            desc:"Opening ceremony of the annual cultural week festivities."     },
  { id:5,  title:"Debate Competition",             date:"2025-09-12", time:"11:00", endTime:"15:00", venue:"Conference Room",     cat:"academic",  audience:"Class 9–12",     desc:"Inter-class debate on contemporary topics."                   },
  { id:6,  title:"Drama Festival",                 date:"2025-09-13", time:"14:00", endTime:"18:00", venue:"Auditorium",          cat:"cultural",  audience:"All",            desc:"Student drama performances representing different cultures."   },
  { id:7,  title:"Football Tournament",            date:"2025-10-01", time:"08:00", endTime:"17:00", venue:"School Ground",       cat:"sports",    audience:"Boys Sections",  desc:"Annual inter-section football championship."                   },
  { id:8,  title:"Parents-Teachers Workshop",      date:"2025-10-15", time:"10:00", endTime:"13:00", venue:"Classrooms",          cat:"workshop",  audience:"Parents & Staff",desc:"Workshop on student mental health and academic guidance."      },
  { id:9,  title:"Staff Meeting – Q4 Planning",    date:"2025-10-20", time:"14:00", endTime:"16:00", venue:"Staff Room",          cat:"meeting",   audience:"Staff",          desc:"Quarterly planning and review for academic year end."          },
  { id:10, title:"Art Exhibition",                 date:"2025-11-05", time:"10:00", endTime:"17:00", venue:"Art Gallery",         cat:"cultural",  audience:"All",            desc:"Display of student artworks across various media."             },
  { id:11, title:"Graduation Ceremony",            date:"2025-12-10", time:"10:00", endTime:"13:00", venue:"Auditorium",          cat:"ceremony",  audience:"Graduating Class",desc:"Farewell and graduation celebration for outgoing students."    },
  { id:12, title:"Year-End Assembly",              date:"2025-12-31", time:"09:00", endTime:"11:00", venue:"Main Hall",           cat:"ceremony",  audience:"All",            desc:"Final assembly and announcements for the academic year."       },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
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

const BLANK_FORM = { title:"", date:"", time:"09:00", endTime:"10:00", venue:"", cat:"cultural", audience:"", desc:"" };

export default function EventCalendar() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view,  setView]  = useState("month"); // month | list
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filterCat, setFilterCat] = useState("all");
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState(BLANK_FORM);
  const [detailEvent, setDetailEvent] = useState(null);

  /* ── Calendar grid ── */
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMo = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const arr = [];
    for (let i = firstDay - 1; i >= 0; i--) arr.push({ day: prevDays - i, cur: false });
    for (let d = 1; d <= daysInMo; d++) arr.push({ day: d, cur: true });
    while (arr.length % 7 !== 0) arr.push({ day: arr.length - daysInMo - firstDay + 1, cur: false });
    return arr;
  }, [year, month, firstDay, daysInMo, prevDays]);

  const eventsForDate = (d) => {
    if (!d.cur) return [];
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d.day).padStart(2,"0")}`;
    return events.filter(e => e.date === key && (filterCat === "all" || e.cat === filterCat));
  };

  const monthEvents = useMemo(() =>
    events.filter(e => {
      const [y, m] = e.date.split("-").map(Number);
      return y === year && m === month + 1 && (filterCat === "all" || e.cat === filterCat);
    }).sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
  [events, year, month, filterCat]);

  const prevMonth = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const isToday = (d) => d.cur && d.day===today.getDate() && month===today.getMonth() && year===today.getFullYear();

  const openAdd = (date="") => { setForm({ ...BLANK_FORM, date }); setModal("add"); };
  const openEdit = (ev) => { setForm({ ...ev }); setModal("edit"); };

  const save = () => {
    if (!form.title.trim() || !form.date) return;
    if (modal === "add") setEvents(p => [...p, { id: Date.now(), ...form }]);
    else setEvents(p => p.map(e => e.id === form.id ? { ...form } : e));
    setModal(null);
    setDetailEvent(null);
  };

  const del = (id) => { setEvents(p => p.filter(e => e.id !== id)); setDetailEvent(null); };

  const upcoming = useMemo(() => {
    const now = today.toISOString().slice(0,10);
    return events.filter(e => e.date >= now && (filterCat==="all"||e.cat===filterCat)).slice(0,5);
  }, [events, filterCat]);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Events","Event Calendar"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar size={22} className="text-violet-500" /> Event Calendar
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1">
              {[["month",<LayoutGrid size={14}/>],["list",<List size={14}/>]].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${view===v ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                  {icon}{v.charAt(0).toUpperCase()+v.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => openAdd()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm shadow-violet-200">
              <Plus size={15} /> Add Event
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterCat==="all" ? "bg-gray-800 text-white border-gray-800" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"}`}>
            All Events ({events.filter(e => { const [y,m]=e.date.split("-").map(Number); return y===year&&m===month+1; }).length})
          </button>
          {CATEGORIES.map((c) => {
            const count = events.filter(e => { const [y,m]=e.date.split("-").map(Number); return y===year&&m===month+1&&e.cat===c.id; }).length;
            return (
              <button key={c.id} onClick={() => setFilterCat(filterCat===c.id ? "all" : c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                  ${filterCat===c.id ? c.light+" ring-1 ring-current" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"}`}>
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />{c.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* ── Main View ── */}
          <div className="lg:col-span-3">
            {view === "month" ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Nav */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"><ChevronLeft size={16} className="text-gray-500" /></button>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800 dark:text-white">{MONTHS[month]} {year}</p>
                    <p className="text-xs text-gray-400">{monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"><ChevronRight size={16} className="text-gray-500" /></button>
                </div>
                {/* Day labels */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
                  {DAYS.map(d => <div key={d} className="py-2.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">{d}</div>)}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-700/50">
                  {cells.map((d, i) => {
                    const dayEvs = eventsForDate(d);
                    const dateKey = d.cur ? `${year}-${String(month+1).padStart(2,"0")}-${String(d.day).padStart(2,"0")}` : "";
                    return (
                      <div key={i} className={`min-h-[80px] p-1.5 ${!d.cur ? "bg-gray-50/60 dark:bg-gray-800/30" : "hover:bg-gray-50/70 dark:hover:bg-gray-700/10 cursor-pointer"} transition-colors`}
                        onClick={() => d.cur && openAdd(dateKey)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ml-auto mb-1
                          ${isToday(d) ? "bg-violet-600 text-white" : d.cur ? "text-gray-700 dark:text-gray-200" : "text-gray-300 dark:text-gray-600"}`}>
                          {d.day}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvs.slice(0,2).map(ev => (
                            <div key={ev.id}
                              onClick={e => { e.stopPropagation(); setDetailEvent(ev); }}
                              className={`truncate text-[9px] font-semibold px-1.5 py-0.5 rounded-md cursor-pointer border ${getCat(ev.cat).light}`}>
                              {ev.time} {ev.title}
                            </div>
                          ))}
                          {dayEvs.length > 2 && <div className="text-[9px] text-gray-400 px-1">+{dayEvs.length-2}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* List view */
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"><ChevronLeft size={14} /></button>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"><ChevronRight size={14} /></button>
                  </div>
                  <span className="text-xs text-gray-400">{monthEvents.length} events</span>
                </div>
                {monthEvents.length === 0 ? (
                  <div className="py-16 text-center">
                    <Calendar size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No events this month</p>
                    <button onClick={() => openAdd()} className="mt-3 text-xs text-violet-500 hover:text-violet-700 font-semibold">+ Add an event</button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {monthEvents.map((ev) => (
                      <div key={ev.id}
                        onClick={() => setDetailEvent(ev)}
                        className="flex gap-4 px-5 py-4 hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors cursor-pointer group">
                        {/* Date block */}
                        <div className="text-center w-10 flex-shrink-0">
                          <div className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">{ev.date.slice(8)}</div>
                          <div className="text-xs text-gray-400">{MONTHS[month].slice(0,3)}</div>
                        </div>
                        <div className={`w-1 rounded-full flex-shrink-0 ${getCat(ev.cat).color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{ev.title}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{ev.time}–{ev.endTime}</span>
                            {ev.venue && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={10} />{ev.venue}</span>}
                            {ev.audience && <span className="flex items-center gap-1 text-xs text-gray-400"><Users size={10} />{ev.audience}</span>}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg border self-start ${getCat(ev.cat).light}`}>{getCat(ev.cat).label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Upcoming */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Upcoming Events</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {upcoming.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-gray-400">No upcoming events</p>
                ) : upcoming.map((ev) => (
                  <div key={ev.id} onClick={() => setDetailEvent(ev)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/70 dark:hover:bg-gray-700/20 cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getCat(ev.cat).dot}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{ev.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ev.date} · {ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Year-month nav */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setYear(y=>y-1)}><ChevronLeft size={15} className="text-gray-400" /></button>
                <span className="text-sm font-bold text-gray-800 dark:text-white">{year}</span>
                <button onClick={() => setYear(y=>y+1)}><ChevronRight size={15} className="text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((m_, i) => (
                  <button key={m_} onClick={() => setMonth(i)}
                    className={`text-xs py-1.5 rounded-lg transition-colors font-medium
                      ${i===month ? "bg-violet-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                    {m_.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        {detailEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailEvent(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className={`h-2 w-full ${getCat(detailEvent.cat).color}`} />
              <div className="flex items-start justify-between px-5 pt-4 pb-2">
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border mb-2 ${getCat(detailEvent.cat).light}`}>{getCat(detailEvent.cat).label}</span>
                  <h2 className="text-base font-bold text-gray-800 dark:text-white">{detailEvent.title}</h2>
                </div>
                <button onClick={() => setDetailEvent(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 flex-shrink-0 mt-1"><X size={14} /></button>
              </div>
              <div className="px-5 py-3 space-y-2.5">
                {[
                  [<Calendar size={13} />, `${detailEvent.date}`],
                  [<Clock size={13} />,    `${detailEvent.time} – ${detailEvent.endTime}`],
                  detailEvent.venue    && [<MapPin size={13} />, detailEvent.venue],
                  detailEvent.audience && [<Users size={13} />,  detailEvent.audience],
                ].filter(Boolean).map(([icon, text], i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-400">{icon}</span>{text}
                  </div>
                ))}
                {detailEvent.desc && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">{detailEvent.desc}</p>
                )}
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => del(detailEvent.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={13} /> Delete
                </button>
                <button onClick={() => { openEdit(detailEvent); setDetailEvent(null); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors">
                  <Edit2 size={13} /> Edit Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add/Edit Modal ── */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{modal==="add" ? "Add New Event" : "Edit Event"}</span>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="Enter event title…" className={inp} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date *</label>
                    <input type="date" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} className={inp} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                    <select value={form.cat} onChange={e => setForm(p=>({...p,cat:e.target.value}))} className={inp}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Time</label>
                    <input type="time" value={form.time} onChange={e => setForm(p=>({...p,time:e.target.value}))} className={inp} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Time</label>
                    <input type="time" value={form.endTime} onChange={e => setForm(p=>({...p,endTime:e.target.value}))} className={inp} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Venue</label>
                    <input type="text" value={form.venue} onChange={e => setForm(p=>({...p,venue:e.target.value}))} placeholder="e.g. Auditorium" className={inp} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Audience</label>
                    <input type="text" value={form.audience} onChange={e => setForm(p=>({...p,audience:e.target.value}))} placeholder="e.g. All Students" className={inp} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</label>
                  <textarea rows={3} value={form.desc} onChange={e => setForm(p=>({...p,desc:e.target.value}))} placeholder="Event details…" className={`${inp} resize-none`} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={save} disabled={!form.title.trim()||!form.date}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm">
                  <Check size={14} /> {modal==="add" ? "Add Event" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}