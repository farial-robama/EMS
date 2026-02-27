import React, { useState, useMemo } from "react";
import {
  ChevronRight, ChevronLeft, Users, GraduationCap,
  TrendingUp, TrendingDown, Search, Download, Filter,
  Eye, X, BarChart2, BookOpen, Award, UserCheck,
  UserX, AlertCircle, CheckCircle2, ArrowUpRight,
  ArrowDownRight, User,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Constants ─── */
const CLASSES    = ["All","Six","Seven","Eight","Nine (Science)","Nine (Arts)","Ten (Science)","Ten (Arts)","HSC Science","HSC Arts"];
const SECTIONS   = ["All","A","B","C","1st Year","2nd Year","Archimedes","Newton","Einstein"];
const SESSIONS   = ["All","2024-2025","2025-2026","2026-2027"];
const GENDERS    = ["All","Male","Female"];
const RELIGIONS  = ["All","Islam","Hindu","Christian","Buddhist"];
const BLOOD_GRP  = ["All","A+","A-","B+","B-","O+","O-","AB+","AB-"];
const STATUS_OPT = ["All","Active","Inactive","Suspended","Transferred"];

/* ─── Sample Students ─── */
const STUDENTS = [
  { id:1,  name:"SAKIB HASAN",          roll:"1001", cls:"Nine (Science)",  section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"B+",  dob:"2009-05-12", phone:"017XXXXXXXX", guardian:"MD. HASAN",      attendance:88, gpa:4.75, status:"Active",    fee:"PAID"    },
  { id:2,  name:"NUSRAT JAHAN",         roll:"1002", cls:"Nine (Science)",  section:"A", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"A+",  dob:"2009-08-22", phone:"018XXXXXXXX", guardian:"MR. JAHAN",       attendance:96, gpa:5.00, status:"Active",    fee:"PAID"    },
  { id:3,  name:"FARUK AHMED",          roll:"1003", cls:"Nine (Science)",  section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"O+",  dob:"2008-12-05", phone:"019XXXXXXXX", guardian:"MD. AHMED",       attendance:61, gpa:3.25, status:"Active",    fee:"UNPAID"  },
  { id:4,  name:"RIMA AKTER",           roll:"1004", cls:"Nine (Science)",  section:"A", session:"2025-2026", gender:"Female", religion:"Hindu",   blood:"B-",  dob:"2009-03-18", phone:"016XXXXXXXX", guardian:"MR. AKTER",       attendance:98, gpa:4.90, status:"Active",    fee:"PAID"    },
  { id:5,  name:"KAMAL HOSSAIN",        roll:"1005", cls:"Nine (Science)",  section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"AB+", dob:"2008-07-30", phone:"015XXXXXXXX", guardian:"MD. HOSSAIN",     attendance:55, gpa:2.50, status:"Suspended", fee:"UNPAID"  },
  { id:6,  name:"SALMA BEGUM",          roll:"1006", cls:"Nine (Science)",  section:"B", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"A-",  dob:"2009-01-14", phone:"017YYYYYYYY", guardian:"MR. BEGUM",       attendance:91, gpa:4.50, status:"Active",    fee:"PAID"    },
  { id:7,  name:"RAHIM SARKER",         roll:"1007", cls:"Nine (Science)",  section:"B", session:"2025-2026", gender:"Male",   religion:"Hindu",   blood:"O-",  dob:"2008-10-20", phone:"018YYYYYYYY", guardian:"MR. SARKER",      attendance:79, gpa:3.75, status:"Active",    fee:"PARTIAL" },
  { id:8,  name:"TAHMINA KHATUN",       roll:"1008", cls:"Nine (Arts)",     section:"A", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"B+",  dob:"2009-06-09", phone:"019YYYYYYYY", guardian:"MD. KHATUN",      attendance:94, gpa:4.25, status:"Active",    fee:"PAID"    },
  { id:9,  name:"ARAFAT ISLAM",         roll:"1009", cls:"Nine (Arts)",     section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"A+",  dob:"2008-11-25", phone:"016YYYYYYYY", guardian:"MD. ISLAM",       attendance:72, gpa:3.50, status:"Active",    fee:"UNPAID"  },
  { id:10, name:"SUMAIYA AKTER",        roll:"1010", cls:"Nine (Arts)",     section:"B", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"O+",  dob:"2009-02-14", phone:"015YYYYYYYY", guardian:"MD. AKTER",       attendance:99, gpa:5.00, status:"Active",    fee:"PAID"    },
  { id:11, name:"RAKIBUL HASAN",        roll:"1011", cls:"Ten (Science)",   section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"B+",  dob:"2007-08-17", phone:"017ZZZZZZZ",  guardian:"MD. HASAN",       attendance:58, gpa:2.00, status:"Inactive",  fee:"UNPAID"  },
  { id:12, name:"LUBNA SULTANA",        roll:"1012", cls:"Ten (Science)",   section:"A", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"A+",  dob:"2007-12-03", phone:"018ZZZZZZZ",  guardian:"MR. SULTANA",     attendance:93, gpa:4.80, status:"Active",    fee:"PAID"    },
  { id:13, name:"HASIBUL HASAN",        roll:"1013", cls:"Ten (Science)",   section:"B", session:"2025-2026", gender:"Male",   religion:"Hindu",   blood:"AB-", dob:"2007-05-28", phone:"019ZZZZZZZ",  guardian:"MR. HASAN",       attendance:85, gpa:4.25, status:"Active",    fee:"PARTIAL" },
  { id:14, name:"FARHANA YESMIN",       roll:"1014", cls:"Ten (Arts)",      section:"A", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"O+",  dob:"2007-09-11", phone:"016ZZZZZZZ",  guardian:"MD. YESMIN",      attendance:62, gpa:2.75, status:"Active",    fee:"UNPAID"  },
  { id:15, name:"TANVIR AHMED",         roll:"1015", cls:"Ten (Arts)",      section:"A", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"B+",  dob:"2007-04-06", phone:"015ZZZZZZZ",  guardian:"MD. AHMED",       attendance:90, gpa:4.00, status:"Active",    fee:"PAID"    },
  { id:16, name:"SADIA ISLAM",          roll:"1016", cls:"HSC Science",     section:"1st Year", session:"2025-2026", gender:"Female", religion:"Islam", blood:"A-", dob:"2006-07-19", phone:"017AAAAAAA", guardian:"MD. ISLAM",  attendance:97, gpa:5.00, status:"Active",    fee:"PAID"    },
  { id:17, name:"RIFAT HOSSAIN",        roll:"1017", cls:"HSC Science",     section:"1st Year", session:"2025-2026", gender:"Male",   religion:"Islam", blood:"O+", dob:"2006-02-25", phone:"018AAAAAAA", guardian:"MD. HOSSAIN", attendance:74, gpa:3.25, status:"Active",    fee:"PARTIAL" },
  { id:18, name:"ARIFUL ISLAM",         roll:"1018", cls:"HSC Arts",        section:"2nd Year", session:"2025-2026", gender:"Male",   religion:"Islam", blood:"B-", dob:"2005-10-08", phone:"019AAAAAAA", guardian:"MD. ISLAM",  attendance:88, gpa:4.00, status:"Active",    fee:"PAID"    },
  { id:19, name:"TANZILA KHATUN",       roll:"1019", cls:"Eight",           section:"A", session:"2025-2026", gender:"Female", religion:"Islam",   blood:"AB+", dob:"2010-06-15", phone:"016AAAAAAA",  guardian:"MD. KHATUN",      attendance:95, gpa:4.75, status:"Active",    fee:"PAID"    },
  { id:20, name:"MEHEDI HASAN",         roll:"1020", cls:"Seven",           section:"B", session:"2025-2026", gender:"Male",   religion:"Islam",   blood:"A+",  dob:"2011-03-22", phone:"015AAAAAAA",  guardian:"MD. HASAN",       attendance:83, gpa:3.75, status:"Transferred",fee:"UNPAID" },
];

/* ─── Helpers ─── */
const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const FEE_BADGE = {
  PAID:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  UNPAID:  "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  PARTIAL: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
};

const STATUS_BADGE = {
  Active:      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Inactive:    "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  Suspended:   "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  Transferred: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

const gpaColor = (gpa) => {
  if (gpa >= 4.5) return "text-emerald-600 dark:text-emerald-400";
  if (gpa >= 3.5) return "text-blue-600 dark:text-blue-400";
  if (gpa >= 2.5) return "text-amber-600 dark:text-amber-400";
  return "text-red-500";
};

const attBar = (a) => {
  if (a >= 90) return "bg-emerald-500";
  if (a >= 75) return "bg-blue-500";
  if (a >= 60) return "bg-amber-400";
  return "bg-red-500";
};

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

export default function StudentReports() {
  const [cls,      setCls]      = useState("All");
  const [section,  setSection]  = useState("All");
  const [session,  setSession]  = useState("All");
  const [gender,   setGender]   = useState("All");
  const [religion, setReligion] = useState("All");
  const [blood,    setBlood]    = useState("All");
  const [statusF,  setStatusF]  = useState("All");
  const [feeF,     setFeeF]     = useState("All");
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState({ key:"roll", dir:"asc" });
  const [perPage,  setPerPage]  = useState(10);
  const [page,     setPage]     = useState(1);
  const [detail,   setDetail]   = useState(null);

  const filtered = useMemo(() =>
    STUDENTS.filter(s =>
      (cls      === "All" || s.cls      === cls)      &&
      (section  === "All" || s.section  === section)  &&
      (session  === "All" || s.session  === session)  &&
      (gender   === "All" || s.gender   === gender)   &&
      (religion === "All" || s.religion === religion) &&
      (blood    === "All" || s.blood    === blood)    &&
      (statusF  === "All" || s.status   === statusF)  &&
      (feeF     === "All" || s.fee      === feeF)     &&
      (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search))
    ).sort((a, b) => {
      const av = a[sort.key === "cls" ? "cls" : sort.key];
      const bv = b[sort.key === "cls" ? "cls" : sort.key];
      if (typeof av === "string") return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === "asc" ? av - bv : bv - av;
    }),
    [cls, section, session, gender, religion, blood, statusF, feeF, search, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  /* ── Analytics ── */
  const stats = useMemo(() => ({
    total:       STUDENTS.length,
    active:      STUDENTS.filter(s => s.status === "Active").length,
    male:        STUDENTS.filter(s => s.gender === "Male").length,
    female:      STUDENTS.filter(s => s.gender === "Female").length,
    feePaid:     STUDENTS.filter(s => s.fee === "PAID").length,
    feeUnpaid:   STUDENTS.filter(s => s.fee === "UNPAID").length,
    atRisk:      STUDENTS.filter(s => s.attendance < 75).length,
    avgGpa:      (STUDENTS.reduce((s, x) => s + x.gpa, 0) / STUDENTS.length).toFixed(2),
    avgAtt:      Math.round(STUDENTS.reduce((s, x) => s + x.attendance, 0) / STUDENTS.length),
  }), []);

  /* class distribution */
  const classDist = useMemo(() => {
    const groups = {};
    STUDENTS.forEach(s => { groups[s.cls] = (groups[s.cls] || 0) + 1; });
    return Object.entries(groups).sort((a,b) => b[1] - a[1]);
  }, []);

  const sortBy = (key) => setSort(p => ({ key, dir: p.key === key && p.dir === "asc" ? "desc" : "asc" }));
  const SortArrow = ({ col }) => sort.key === col
    ? <span className="text-blue-500">{sort.dir === "asc" ? "↑" : "↓"}</span>
    : <span className="text-gray-300">↕</span>;

  const handleExport = () => {
    const rows = filtered.map((s, i) => ({
      "#":i+1, Name:s.name, Roll:s.roll, Class:s.cls, Section:s.section,
      Session:s.session, Gender:s.gender, Religion:s.religion, "Blood Group":s.blood,
      DOB:s.dob, Phone:s.phone, Guardian:s.guardian,
      "Attendance %":s.attendance, GPA:s.gpa, Status:s.status, Fee:s.fee,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Report");
    XLSX.writeFile(wb, "StudentReport.xlsx");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Reports","Student Reports"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users size={22} className="text-blue-500" /> Student Reports
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Comprehensive student data — demographics, attendance, GPA, and fee status
            </p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 flex-shrink-0">
            <Download size={15} /> Export Excel
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label:"Total Students", value:stats.total,    cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",       val:"text-blue-700 dark:text-blue-400"    },
            { label:"Active",         value:stats.active,   cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",   val:"text-green-700 dark:text-green-400"  },
            { label:"Fee Defaulters", value:stats.feeUnpaid,cls:"bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",           val:"text-red-600 dark:text-red-400"      },
            { label:"Avg Attendance", value:`${stats.avgAtt}%`, cls:"bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900/30",  val:"text-teal-700 dark:text-teal-400"    },
            { label:"Avg GPA",        value:stats.avgGpa,   cls:"bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",val:"text-purple-700 dark:text-purple-400"},
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Gender split + status split */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Demographics</p>
            </div>
            <div className="p-5 space-y-5">
              {/* Gender */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Gender Split</p>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.male}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Male</p>
                  </div>
                  <div className="flex-1 bg-pink-100 dark:bg-pink-900/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-pink-700 dark:text-pink-400">{stats.female}</p>
                    <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">Female</p>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width:`${(stats.male/stats.total)*100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>{Math.round((stats.male/stats.total)*100)}% Male</span>
                  <span>{Math.round((stats.female/stats.total)*100)}% Female</span>
                </div>
              </div>

              {/* Fee status */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Fee Status</p>
                <div className="space-y-2">
                  {[
                    ["PAID",    STUDENTS.filter(s=>s.fee==="PAID").length,    "bg-green-500"],
                    ["UNPAID",  STUDENTS.filter(s=>s.fee==="UNPAID").length,  "bg-red-500"  ],
                    ["PARTIAL", STUDENTS.filter(s=>s.fee==="PARTIAL").length, "bg-amber-400"],
                  ].map(([label, count, color]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{label}</span>
                        <span className="text-gray-400">{count} students</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width:`${(count/stats.total)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance risk */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{stats.atRisk} students at risk</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500">Attendance below 75%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Class distribution bar chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <BarChart2 size={15} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Students by Class</span>
            </div>
            <div className="p-5">
              <div className="space-y-2.5">
                {classDist.map(([name, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  const colors = ["bg-blue-500","bg-indigo-500","bg-violet-500","bg-purple-500","bg-pink-500","bg-rose-500","bg-orange-500","bg-amber-500","bg-teal-500"];
                  const color  = colors[classDist.findIndex(([n])=>n===name) % colors.length];
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[180px]">{name}</span>
                        <span className="text-gray-400 ml-2 flex-shrink-0 font-mono">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all`} style={{ width:`${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* GPA distribution */}
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">GPA Distribution</p>
                <div className="flex items-end gap-2 h-16">
                  {[
                    ["5.0", STUDENTS.filter(s=>s.gpa>=4.8).length, "bg-emerald-500"],
                    ["4.5+",STUDENTS.filter(s=>s.gpa>=4.5&&s.gpa<4.8).length,"bg-green-500"],
                    ["4.0+",STUDENTS.filter(s=>s.gpa>=4.0&&s.gpa<4.5).length,"bg-teal-500"],
                    ["3.5+",STUDENTS.filter(s=>s.gpa>=3.5&&s.gpa<4.0).length,"bg-blue-500"],
                    ["3.0+",STUDENTS.filter(s=>s.gpa>=3.0&&s.gpa<3.5).length,"bg-amber-500"],
                    ["<3.0",STUDENTS.filter(s=>s.gpa<3.0).length,"bg-red-500"],
                  ].map(([label, count, color]) => {
                    const max = Math.max(...[5,4,4,3,2,2]);
                    return (
                      <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                        <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(4,(count/stats.total)*52)}px` }} />
                        <span className="text-[9px] text-gray-400 font-mono">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Students</span>
            {filtered.length < STUDENTS.length && (
              <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                {filtered.length} / {STUDENTS.length} shown
              </span>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label:"Class",    val:cls,      set:(v)=>{setCls(v);setPage(1)},      opts:CLASSES    },
              { label:"Section",  val:section,  set:(v)=>{setSection(v);setPage(1)},  opts:SECTIONS   },
              { label:"Session",  val:session,  set:(v)=>{setSession(v);setPage(1)},  opts:SESSIONS   },
              { label:"Gender",   val:gender,   set:(v)=>{setGender(v);setPage(1)},   opts:GENDERS    },
              { label:"Religion", val:religion, set:(v)=>{setReligion(v);setPage(1)}, opts:RELIGIONS  },
              { label:"Blood Grp",val:blood,    set:(v)=>{setBlood(v);setPage(1)},    opts:BLOOD_GRP  },
              { label:"Status",   val:statusF,  set:(v)=>{setStatusF(v);setPage(1)},  opts:STATUS_OPT },
              { label:"Fee",      val:feeF,     set:(v)=>{setFeeF(v);setPage(1)},     opts:["All","PAID","UNPAID","PARTIAL"] },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{label}</label>
                <select value={val} onChange={e => set(e.target.value)} className={inp}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student List</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setPage(1)}}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none">
                {[10,25,50].map(n=><option key={n}>{n}</option>)}
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Search name or roll…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"1000px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[["#",""],["Student","name"],["Roll","roll"],["Class","cls"],["Section","section"],["Gender","gender"],["Blood","blood"],["Attendance","attendance"],["GPA","gpa"],["Fee","fee"],["Status","status"],["",""]].map(([h,col])=>(
                    <th key={h+col} onClick={()=>col&&sortBy(col)}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${col?"cursor-pointer hover:text-gray-700 dark:hover:text-gray-200":""}`}>
                      <span className="flex items-center gap-1">{h}{col&&<SortArrow col={col}/>}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={12} className="px-5 py-14 text-center">
                    <Users size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3"/>
                    <p className="text-sm text-gray-400">No students match your filters</p>
                  </td></tr>
                ) : paged.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-400">{(safePage-1)*perPage+i+1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${s.gender==="Female" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">{s.roll}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-semibold whitespace-nowrap">{s.cls}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400">{s.section}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${s.gender==="Male"?"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400":"bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400"}`}>{s.gender}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg font-mono font-semibold">{s.blood}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                          <div className={`h-full rounded-full ${attBar(s.attendance)}`} style={{ width:`${s.attendance}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{s.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${gpaColor(s.gpa)}`}>{s.gpa.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${FEE_BADGE[s.fee]}`}>{s.fee}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${STATUS_BADGE[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setDetail(s)}
                        className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 flex items-center justify-center border border-blue-200 dark:border-blue-900 transition-all">
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length===0?0:(safePage-1)*perPage+1}–{Math.min(safePage*perPage,filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={()=>setPage(1)} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">«</button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,i,arr)=>{if(i>0&&arr[i-1]!==p-1)acc.push("…");acc.push(p);return acc;},[]).map((p,i)=>
                typeof p==="string" ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                : <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage===p?"bg-blue-600 text-white border-blue-600":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{p}</button>
              )}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14}/></button>
              <button onClick={()=>setPage(totalPages)} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">»</button>
            </div>
          </div>
        </div>

        {/* ── Detail Modal ── */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={e => e.stopPropagation()}>

              {/* Color top band */}
              <div className={`h-1.5 w-full ${detail.gender==="Female" ? "bg-pink-400" : "bg-blue-500"}`} />

              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Profile</span>
                <button onClick={() => setDetail(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><X size={14}/></button>
              </div>

              {/* Avatar + headline */}
              <div className="flex items-center gap-4 px-5 pt-5 pb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0
                  ${detail.gender==="Female" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                  {detail.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white">{detail.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Roll {detail.roll} · {detail.cls} — {detail.section}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${STATUS_BADGE[detail.status]}`}>{detail.status}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${FEE_BADGE[detail.fee]}`}>{detail.fee}</span>
                  </div>
                </div>
              </div>

              {/* Detail grid */}
              <div className="px-5 pb-5 grid grid-cols-2 gap-x-6 gap-y-0 divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ["Session",       detail.session],
                  ["Gender",        detail.gender],
                  ["Date of Birth", detail.dob],
                  ["Religion",      detail.religion],
                  ["Blood Group",   detail.blood],
                  ["Phone",         detail.phone],
                  ["Guardian",      detail.guardian],
                ].map(([label, val]) => (
                  <div key={label} className="col-span-1 flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{label}</span>
                    <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Attendance + GPA bars */}
              <div className="mx-5 mb-5 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Attendance</span>
                    <span className={`font-bold ${attBar(detail.attendance).replace("bg-","text-")}`}>{detail.attendance}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${attBar(detail.attendance)}`} style={{ width:`${detail.attendance}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">GPA (out of 5.00)</span>
                    <span className={`font-bold ${gpaColor(detail.gpa)}`}>{detail.gpa.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width:`${(detail.gpa/5)*100}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end px-5 pb-5">
                <button onClick={() => setDetail(null)} className="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}