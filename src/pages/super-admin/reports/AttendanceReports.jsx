import React, { useState, useMemo } from "react";
import {
  ChevronRight, Users, CheckCircle2, XCircle, Clock,
  TrendingUp, TrendingDown, Search, Download, Filter,
  BarChart2, Calendar, ChevronLeft, ChevronDown,
  AlertCircle, BookOpen, User,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Sample Data ─── */
const CLASSES  = ["All","Six","Seven","Eight","Nine (Science)","Nine (Arts)","Ten (Science)","Ten (Arts)"];
const SECTIONS = ["All","A","B","C","1st Year","2nd Year","Archimedes","Newton"];
const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = MONTHS.map(m => m.slice(0,3));

const STUDENTS = [
  { id:1,  name:"SAKIB HASAN",             roll:"1001", class:"Nine (Science)", section:"A", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:2,Feb:3,Mar:1,Apr:2,May:0,Jun:4,Jul:0,Aug:1,Sep:2,Oct:3,Nov:1,Dec:0} },
  { id:2,  name:"NUSRAT JAHAN",            roll:"1002", class:"Nine (Science)", section:"A", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:0,Feb:1,Mar:0,Apr:1,May:2,Jun:0,Jul:0,Aug:0,Sep:1,Oct:0,Nov:0,Dec:0} },
  { id:3,  name:"FARUK AHMED",             roll:"1003", class:"Nine (Science)", section:"A", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:5,Feb:4,Mar:6,Apr:3,May:5,Jun:7,Jul:0,Aug:4,Sep:6,Oct:5,Nov:4,Dec:0} },
  { id:4,  name:"RIMA AKTER",              roll:"1004", class:"Nine (Science)", section:"A", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:1,Feb:0,Mar:1,Apr:0,May:1,Jun:0,Jul:0,Aug:1,Sep:0,Oct:1,Nov:0,Dec:0} },
  { id:5,  name:"KAMAL HOSSAIN",           roll:"1005", class:"Nine (Science)", section:"A", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:8,Feb:6,Mar:9,Apr:7,May:8,Jun:10,Jul:0,Aug:6,Sep:8,Oct:9,Nov:7,Dec:0} },
  { id:6,  name:"SALMA BEGUM",             roll:"1006", class:"Nine (Science)", section:"B", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:2,Feb:2,Mar:2,Apr:2,May:2,Jun:2,Jul:0,Aug:2,Sep:2,Oct:2,Nov:2,Dec:0} },
  { id:7,  name:"RAHIM SARKER",            roll:"1007", class:"Nine (Science)", section:"B", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:3,Feb:5,Mar:2,Apr:4,May:3,Jun:6,Jul:0,Aug:3,Sep:4,Oct:3,Nov:5,Dec:0} },
  { id:8,  name:"TAHMINA KHATUN",          roll:"1008", class:"Nine (Science)", section:"B", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:0,Feb:0,Mar:1,Apr:0,May:0,Jun:1,Jul:0,Aug:0,Sep:0,Oct:0,Nov:1,Dec:0} },
  { id:9,  name:"ARAFAT ISLAM",            roll:"1009", class:"Nine (Arts)",    section:"A", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:4,Feb:3,Mar:5,Apr:2,May:4,Jun:5,Jul:0,Aug:3,Sep:4,Oct:4,Nov:3,Dec:0} },
  { id:10, name:"SUMAIYA AKTER",           roll:"1010", class:"Nine (Arts)",    section:"A", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:1,Feb:1,Mar:0,Apr:1,May:0,Jun:1,Jul:0,Aug:1,Sep:0,Oct:1,Nov:0,Dec:0} },
  { id:11, name:"RAKIBUL HASAN",           roll:"1011", class:"Nine (Arts)",    section:"B", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:6,Feb:7,Mar:6,Apr:8,May:6,Jun:9,Jul:0,Aug:7,Sep:6,Oct:7,Nov:6,Dec:0} },
  { id:12, name:"LUBNA SULTANA",           roll:"1012", class:"Ten (Science)",  section:"A", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:0,Feb:1,Mar:0,Apr:0,May:1,Jun:0,Jul:0,Aug:0,Sep:1,Oct:0,Nov:0,Dec:0} },
  { id:13, name:"HASIBUL HASAN",           roll:"1013", class:"Ten (Science)",  section:"A", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:2,Feb:3,Mar:1,Apr:2,May:2,Jun:3,Jul:0,Aug:2,Sep:2,Oct:1,Nov:2,Dec:0} },
  { id:14, name:"FARHANA YESMIN",          roll:"1014", class:"Ten (Arts)",     section:"A", gender:"Female", days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:7,Feb:6,Mar:8,Apr:7,May:9,Jun:8,Jul:0,Aug:7,Sep:9,Oct:8,Nov:6,Dec:0} },
  { id:15, name:"TANVIR AHMED",            roll:"1015", class:"Ten (Arts)",     section:"B", gender:"Male",   days:{Jan:22,Feb:19,Mar:23,Apr:20,May:22,Jun:18,Jul:0,Aug:21,Sep:22,Oct:20,Nov:19,Dec:0}, absent:{Jan:1,Feb:2,Mar:1,Apr:1,May:0,Jun:2,Jul:0,Aug:1,Sep:1,Oct:2,Nov:1,Dec:0} },
];

const MONTH_KEYS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const pct = (present, total) => total > 0 ? Math.round((present / total) * 100) : 0;

const statusColor = (p) => {
  if (p >= 90) return { badge:"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", bar:"bg-green-500", label:"Excellent" };
  if (p >= 75) return { badge:"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",   bar:"bg-blue-500",  label:"Good"      };
  if (p >= 60) return { badge:"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",bar:"bg-amber-500",label:"Average"   };
  return           { badge:"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",           bar:"bg-red-500",   label:"Poor"      };
};

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

export default function AttendanceReports() {
  const [cls,     setCls]     = useState("All");
  const [section, setSection] = useState("All");
  const [month,   setMonth]   = useState("All");
  const [gender,  setGender]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState({ key:"roll", dir:"asc" });
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);

  /* computed per student */
  const enriched = useMemo(() => STUDENTS.map(s => {
    const keys = month === "All" ? MONTH_KEYS : [month.slice(0,3)];
    const totalDays   = keys.reduce((acc, k) => acc + (s.days[k] || 0), 0);
    const absentDays  = keys.reduce((acc, k) => acc + (s.absent[k] || 0), 0);
    const presentDays = totalDays - absentDays;
    const attendance  = pct(presentDays, totalDays);
    return { ...s, totalDays, absentDays, presentDays, attendance };
  }), [month]);

  const filtered = useMemo(() => {
    let r = enriched.filter(s =>
      (cls     === "All" || s.class   === cls)     &&
      (section === "All" || s.section === section) &&
      (gender  === "All" || s.gender  === gender)  &&
      (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search))
    );
    r = [...r].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (typeof av === "string") return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === "asc" ? av - bv : bv - av;
    });
    return r;
  }, [enriched, cls, section, gender, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage-1)*perPage, safePage*perPage);

  /* summary stats */
  const summary = useMemo(() => {
    if (!filtered.length) return { avg:0, excellent:0, poor:0, totalPresent:0, totalAbsent:0 };
    const avg         = Math.round(filtered.reduce((s, x) => s + x.attendance, 0) / filtered.length);
    const excellent   = filtered.filter(x => x.attendance >= 90).length;
    const poor        = filtered.filter(x => x.attendance < 75).length;
    const totalPresent = filtered.reduce((s, x) => s + x.presentDays, 0);
    const totalAbsent  = filtered.reduce((s, x) => s + x.absentDays, 0);
    return { avg, excellent, poor, totalPresent, totalAbsent };
  }, [filtered]);

  /* monthly trend for bar chart */
  const monthlyAvg = useMemo(() => MONTH_KEYS.map((k, i) => {
    const active = enriched.filter(s =>
      (cls === "All" || s.class === cls) && (section === "All" || s.section === section)
    );
    if (!active.length) return { key: k, label: MONTHS_SHORT[i], avg: 0 };
    const total = active.reduce((s, x) => {
      const d = x.days[k] || 0;
      const a = x.absent[k] || 0;
      return d > 0 ? { days: s.days + d, present: s.present + (d - a) } : s;
    }, { days: 0, present: 0 });
    return { key: k, label: MONTHS_SHORT[i], avg: pct(total.present, total.days) };
  }), [enriched, cls, section]);

  const sortBy = (key) => setSort(p => ({ key, dir: p.key === key && p.dir === "asc" ? "desc" : "asc" }));
  const SortIcon = ({ col }) => sort.key === col
    ? <span className={`text-blue-500 ${sort.dir === "desc" ? "rotate-180 inline-block" : ""}`}>↑</span>
    : <span className="text-gray-300">↕</span>;

  const handleExport = () => {
    const rows = filtered.map((s, i) => ({
      "#": i+1, Name: s.name, Roll: s.roll, Class: s.class, Section: s.section,
      "Total Days": s.totalDays, Present: s.presentDays, Absent: s.absentDays,
      "Attendance %": `${s.attendance}%`, Status: statusColor(s.attendance).label,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
  };

  const barMax = Math.max(...monthlyAvg.map(m => m.avg), 1);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Attendance","Attendance Reports"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart2 size={22} className="text-teal-500" /> Attendance Reports
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Detailed attendance analytics across classes, sections and time periods</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 flex-shrink-0">
            <Download size={15}/> Export Excel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label:"Total Students",  value:filtered.length,       cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",    val:"text-blue-700 dark:text-blue-400"    },
            { label:"Avg Attendance",  value:`${summary.avg}%`,     cls:"bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900/30",    val:"text-teal-700 dark:text-teal-400"    },
            { label:"Excellent (≥90%)",value:summary.excellent,     cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30", val:"text-green-700 dark:text-green-400"  },
            { label:"At Risk (<75%)",  value:summary.poor,          cls:"bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",         val:"text-red-600 dark:text-red-400"      },
            { label:"Total Absences",  value:summary.totalAbsent,   cls:"bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30", val:"text-amber-600 dark:text-amber-400"  },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Monthly bar chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <TrendingUp size={15} className="text-teal-500"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Monthly Attendance Trend</span>
              <span className="text-xs text-gray-400 ml-1">— avg % of selected group</span>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-end gap-2 h-36">
                {monthlyAvg.map(m => (
                  <div key={m.key} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">{m.avg}%</span>
                    <div className="w-full rounded-t-md transition-all relative overflow-hidden"
                      style={{ height: `${Math.max(4, (m.avg / barMax) * 90)}px` }}>
                      <div className={`absolute inset-0 ${m.avg >= 90 ? "bg-green-400" : m.avg >= 75 ? "bg-teal-400" : m.avg >= 60 ? "bg-amber-400" : "bg-red-400"} dark:opacity-80`}/>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">{m.label}</span>
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {[["bg-green-400","≥90% Excellent"],["bg-teal-400","≥75% Good"],["bg-amber-400","≥60% Average"],["bg-red-400","<60% Poor"]].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${c}`}/>
                    <span className="text-[10px] text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-teal-50 dark:bg-teal-900/10 border-b border-teal-100 dark:border-teal-900/30">
              <Filter size={14} className="text-teal-500"/>
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Filter Options</span>
            </div>
            <div className="p-4 space-y-3.5">
              {[
                { label:"Class",   val:cls,     set:(v)=>{setCls(v);setPage(1)},    opts:CLASSES                  },
                { label:"Section", val:section, set:(v)=>{setSection(v);setPage(1)},opts:SECTIONS                 },
                { label:"Month",   val:month,   set:(v)=>{setMonth(v);setPage(1)},  opts:["All",...MONTHS]        },
                { label:"Gender",  val:gender,  set:(v)=>{setGender(v);setPage(1)}, opts:["All","Male","Female"]  },
              ].map(({ label, val, set, opts }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                  <select value={val} onChange={e => set(e.target.value)} className={inp}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-gray-400"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Attendance</span>
              <span className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                {[10,25,50].map(n => <option key={n}>{n}</option>)}
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                <input placeholder="Search student…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44"/>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"800px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[["#",""],["Name","name"],["Roll","roll"],["Class","class"],["Section","section"],["Total Days","totalDays"],["Present","presentDays"],["Absent","absentDays"],["Attendance %","attendance"],["Status",""]].map(([h, col]) => (
                    <th key={h}
                      onClick={() => col && sortBy(col)}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${col ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" : ""}`}>
                      <span className="flex items-center gap-1">{h}{col && <SortIcon col={col}/>}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={10} className="px-5 py-14 text-center">
                    <Users size={32} className="mx-auto text-gray-200 dark:text-gray-600 mb-2"/>
                    <p className="text-sm text-gray-400">No students match your filters</p>
                  </td></tr>
                ) : paged.map((s, i) => {
                  const sc = statusColor(s.attendance);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-400">{(safePage-1)*perPage+i+1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${s.gender==="Female" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                            {s.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">{s.roll}</td>
                      <td className="px-4 py-4"><span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-semibold">{s.class}</span></td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{s.section}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">{s.totalDays}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-green-700 dark:text-green-400 text-center">{s.presentDays}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-red-600 dark:text-red-400 text-center">{s.absentDays}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden min-w-[60px]">
                            <div className={`h-full rounded-full ${sc.bar}`} style={{ width:`${s.attendance}%` }}/>
                          </div>
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 w-10 text-right">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${sc.badge}`}>
                          {s.attendance >= 75 ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}{sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length===0?0:(safePage-1)*perPage+1}–{Math.min(safePage*perPage,filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">«</button>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,i,arr)=>{
                if(i>0&&arr[i-1]!==p-1)acc.push("…");acc.push(p);return acc;
              },[]).map((p,i)=>typeof p==="string"
                ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                : <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage===p?"bg-teal-600 text-white border-teal-600":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{p}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14}/></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">»</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}