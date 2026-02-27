import React, { useState, useMemo } from "react";
import {
  ChevronRight, DollarSign, TrendingUp, TrendingDown,
  Download, Filter, Search, ChevronLeft, BarChart2,
  CheckCircle2, XCircle, Clock, Calendar, Users,
  ArrowUpRight, ArrowDownRight, Wallet, CreditCard,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Constants ─── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CLASSES  = ["All","Six","Seven","Eight","Nine (Science)","Nine (Arts)","Ten (Science)","Ten (Arts)","HSC Science","HSC Arts"];
const FEE_TYPES = ["All","Tuition Fee","Admission Fee","Exam Fee","Library Fee","Sports Fee","Transport Fee","Hostel Fee","Late Fee"];
const SESSIONS  = ["All","2024-2025","2025-2026","2026-2027"];

/* ─── Sample monthly collection data ─── */
const MONTHLY_DATA = [
  { month:"Jan", collected:184200, due:210000, expense:42000 },
  { month:"Feb", collected:197500, due:210000, expense:38500 },
  { month:"Mar", collected:205800, due:210000, expense:51000 },
  { month:"Apr", collected:178300, due:210000, expense:39000 },
  { month:"May", collected:212400, due:215000, expense:44000 },
  { month:"Jun", collected:89000,  due:210000, expense:35000 },
  { month:"Jul", collected:0,      due:0,      expense:28000 },
  { month:"Aug", collected:196700, due:210000, expense:47000 },
  { month:"Sep", collected:201200, due:215000, expense:52000 },
  { month:"Oct", collected:188900, due:215000, expense:41000 },
  { month:"Nov", collected:176400, due:215000, expense:38000 },
  { month:"Dec", collected:0,      due:0,      expense:0     },
];

/* ─── Sample student fee transactions ─── */
const TRANSACTIONS = [
  { id:1,  name:"SAKIB HASAN",          roll:"1001", class:"Nine (Science)", feeType:"Tuition Fee",  amount:2500, status:"PAID",    date:"2025-11-05", session:"2025-2026", method:"Cash"       },
  { id:2,  name:"NUSRAT JAHAN",         roll:"1002", class:"Nine (Science)", feeType:"Tuition Fee",  amount:2500, status:"PAID",    date:"2025-11-03", session:"2025-2026", method:"bKash"      },
  { id:3,  name:"FARUK AHMED",          roll:"1003", class:"Nine (Science)", feeType:"Exam Fee",     amount:800,  status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
  { id:4,  name:"RIMA AKTER",           roll:"1004", class:"Nine (Science)", feeType:"Library Fee",  amount:300,  status:"PAID",    date:"2025-11-10", session:"2025-2026", method:"Cash"       },
  { id:5,  name:"KAMAL HOSSAIN",        roll:"1005", class:"Nine (Science)", feeType:"Tuition Fee",  amount:2500, status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
  { id:6,  name:"SALMA BEGUM",          roll:"1006", class:"Nine (Arts)",    feeType:"Tuition Fee",  amount:2200, status:"PAID",    date:"2025-11-08", session:"2025-2026", method:"Nagad"      },
  { id:7,  name:"RAHIM SARKER",         roll:"1007", class:"Nine (Arts)",    feeType:"Exam Fee",     amount:800,  status:"PARTIAL", date:"2025-11-12", session:"2025-2026", method:"Cash"       },
  { id:8,  name:"TAHMINA KHATUN",       roll:"1008", class:"Ten (Science)",  feeType:"Tuition Fee",  amount:2800, status:"PAID",    date:"2025-11-02", session:"2025-2026", method:"Bank"       },
  { id:9,  name:"ARAFAT ISLAM",         roll:"1009", class:"Ten (Science)",  feeType:"Sports Fee",   amount:500,  status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
  { id:10, name:"SUMAIYA AKTER",        roll:"1010", class:"Ten (Arts)",     feeType:"Tuition Fee",  amount:2200, status:"PAID",    date:"2025-11-07", session:"2025-2026", method:"bKash"      },
  { id:11, name:"RAKIBUL HASAN",        roll:"1011", class:"Ten (Arts)",     feeType:"Admission Fee",amount:5000, status:"PAID",    date:"2025-11-01", session:"2025-2026", method:"Bank"       },
  { id:12, name:"LUBNA SULTANA",        roll:"1012", class:"HSC Science",    feeType:"Tuition Fee",  amount:3200, status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
  { id:13, name:"HASIBUL HASAN",        roll:"1013", class:"HSC Science",    feeType:"Transport Fee",amount:1200, status:"PAID",    date:"2025-11-09", session:"2025-2026", method:"Cash"       },
  { id:14, name:"FARHANA YESMIN",       roll:"1014", class:"HSC Arts",       feeType:"Hostel Fee",   amount:4500, status:"PARTIAL", date:"2025-11-11", session:"2025-2026", method:"bKash"      },
  { id:15, name:"TANVIR AHMED",         roll:"1015", class:"HSC Arts",       feeType:"Late Fee",     amount:150,  status:"PAID",    date:"2025-11-14", session:"2025-2026", method:"Cash"       },
  { id:16, name:"SADIA ISLAM",          roll:"1016", class:"Seven",          feeType:"Tuition Fee",  amount:1800, status:"PAID",    date:"2025-11-06", session:"2025-2026", method:"Nagad"      },
  { id:17, name:"RIFAT HOSSAIN",        roll:"1017", class:"Seven",          feeType:"Library Fee",  amount:300,  status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
  { id:18, name:"ARIFUL ISLAM",         roll:"1018", class:"Eight",          feeType:"Tuition Fee",  amount:2000, status:"PAID",    date:"2025-11-04", session:"2025-2026", method:"Cash"       },
  { id:19, name:"TANZILA KHATUN",       roll:"1019", class:"Eight",          feeType:"Exam Fee",     amount:600,  status:"PAID",    date:"2025-11-13", session:"2025-2026", method:"bKash"      },
  { id:20, name:"MEHEDI HASAN",         roll:"1020", class:"Six",            feeType:"Tuition Fee",  amount:1500, status:"UNPAID",  date:"",           session:"2025-2026", method:""           },
];

const STATUS_META = {
  PAID:    { badge:"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",  icon:<CheckCircle2 size={10}/>, label:"PAID"    },
  UNPAID:  { badge:"bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",          icon:<XCircle size={10}/>,      label:"UNPAID"  },
  PARTIAL: { badge:"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",  icon:<Clock size={10}/>,         label:"PARTIAL" },
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

const fmt = (n) => "৳" + n.toLocaleString("en-BD");

export default function FinancialReports() {
  const [cls,     setCls]     = useState("All");
  const [feeType, setFeeType] = useState("All");
  const [session, setSession] = useState("All");
  const [status,  setStatus]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState({ key:"name", dir:"asc" });
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() =>
    TRANSACTIONS.filter(t =>
      (cls     === "All" || t.class   === cls)     &&
      (feeType === "All" || t.feeType === feeType) &&
      (session === "All" || t.session === session) &&
      (status  === "All" || t.status  === status)  &&
      (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.roll.includes(search))
    ).sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (typeof av === "string") return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === "asc" ? av - bv : bv - av;
    }),
    [cls, feeType, session, status, search, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  /* summary */
  const summary = useMemo(() => {
    const totalCollected  = TRANSACTIONS.filter(t => t.status === "PAID").reduce((s, t) => s + t.amount, 0);
    const totalDue        = TRANSACTIONS.filter(t => t.status === "UNPAID").reduce((s, t) => s + t.amount, 0);
    const totalPartial    = TRANSACTIONS.filter(t => t.status === "PARTIAL").reduce((s, t) => s + t.amount, 0);
    const filtCollected   = filtered.filter(t => t.status === "PAID").reduce((s, t) => s + t.amount, 0);
    const filtDue         = filtered.filter(t => t.status !== "PAID").reduce((s, t) => s + t.amount, 0);
    return { totalCollected, totalDue, totalPartial, filtCollected, filtDue };
  }, [filtered]);

  /* yearly totals */
  const yearCollected = MONTHLY_DATA.reduce((s, m) => s + m.collected, 0);
  const yearExpense   = MONTHLY_DATA.reduce((s, m) => s + m.expense,   0);
  const yearDue       = MONTHLY_DATA.reduce((s, m) => s + m.due, 0);
  const barMax        = Math.max(...MONTHLY_DATA.map(m => Math.max(m.collected, m.due, m.expense)));

  const sortBy = (key) => setSort(p => ({ key, dir: p.key === key && p.dir === "asc" ? "desc" : "asc" }));
  const SortArrow = ({ col }) => sort.key === col
    ? <span className="text-blue-500">{sort.dir === "asc" ? "↑" : "↓"}</span>
    : <span className="text-gray-300">↕</span>;

  const handleExport = () => {
    const rows = filtered.map((t, i) => ({
      "#":i+1, Name:t.name, Roll:t.roll, Class:t.class,
      "Fee Type":t.feeType, Amount:`৳${t.amount}`, Status:t.status,
      Date:t.date || "—", Method:t.method || "—", Session:t.session,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
    XLSX.writeFile(wb, "FinancialReport.xlsx");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Reports","Financial Reports"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <DollarSign size={22} className="text-emerald-500" /> Financial Reports
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Fee collection, dues, and expense overview for the academic year</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 flex-shrink-0">
            <Download size={15} /> Export Excel
          </button>
        </div>

        {/* Top KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total Collected",  value:fmt(yearCollected), sub:`${Math.round(yearCollected/yearDue*100)}% of dues`, icon:<ArrowUpRight size={14}/>, cls:"bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30", val:"text-emerald-700 dark:text-emerald-400", ic:"text-emerald-500" },
            { label:"Total Due",        value:fmt(yearDue - yearCollected), sub:"Remaining unpaid",                       icon:<ArrowDownRight size={14}/>,cls:"bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30",               val:"text-red-600 dark:text-red-400",          ic:"text-red-500"     },
            { label:"Total Expense",    value:fmt(yearExpense),   sub:"Operational costs",                                icon:<Wallet size={14}/>,          cls:"bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30",       val:"text-amber-700 dark:text-amber-400",      ic:"text-amber-500"   },
            { label:"Net Surplus",      value:fmt(yearCollected - yearExpense), sub:"Income minus expense",              icon:<TrendingUp size={14}/>,      cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30",          val:"text-blue-700 dark:text-blue-400",        ic:"text-blue-500"    },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl border ${s.cls}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
                <span className={s.ic}>{s.icon}</span>
              </div>
              <p className={`text-xl font-bold leading-none ${s.val}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Monthly chart + fee breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <BarChart2 size={15} className="text-emerald-500"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Monthly Collection vs Due vs Expense</span>
            </div>
            <div className="px-5 pt-5 pb-4">
              {/* Grouped bars */}
              <div className="flex items-end gap-1.5 h-44">
                {MONTHLY_DATA.map((m, i) => {
                  const scale = (v) => barMax > 0 ? (v / barMax) * 152 : 0;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5 group">
                      <div className="flex items-end gap-0.5 w-full justify-center">
                        <div title={`Due: ${fmt(m.due)}`}      style={{ height: scale(m.due) }}      className="w-1/3 rounded-t bg-gray-200 dark:bg-gray-600 group-hover:opacity-80 transition-opacity min-h-0.5"/>
                        <div title={`Collected: ${fmt(m.collected)}`} style={{ height: scale(m.collected) }} className="w-1/3 rounded-t bg-emerald-500 group-hover:opacity-80 transition-opacity min-h-0.5"/>
                        <div title={`Expense: ${fmt(m.expense)}`}     style={{ height: scale(m.expense) }}   className="w-1/3 rounded-t bg-amber-400 group-hover:opacity-80 transition-opacity min-h-0.5"/>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">{m.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-5 mt-4 flex-wrap">
                {[["bg-gray-300 dark:bg-gray-500","Total Due"],["bg-emerald-500","Collected"],["bg-amber-400","Expense"]].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm ${c}`}/>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fee type breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Fee Type Breakdown</p>
              <p className="text-xs text-gray-400 mt-0.5">Total amounts across all students</p>
            </div>
            <div className="p-4 space-y-3">
              {FEE_TYPES.filter(f => f !== "All").map(type => {
                const total = TRANSACTIONS.filter(t => t.feeType === type).reduce((s, t) => s + t.amount, 0);
                const grand = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
                const p = grand > 0 ? Math.round((total / grand) * 100) : 0;
                const colors = ["bg-emerald-500","bg-blue-500","bg-purple-500","bg-amber-500","bg-rose-500","bg-teal-500","bg-indigo-500","bg-orange-500","bg-pink-500"];
                const c = colors[FEE_TYPES.indexOf(type) % colors.length];
                if (!total) return null;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{type}</span>
                      <span className="text-gray-400 ml-2 flex-shrink-0 font-mono">{fmt(total)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c}`} style={{ width:`${p}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/30">
            <Filter size={14} className="text-emerald-500"/>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Filter Transactions</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label:"Class",      val:cls,     set:(v)=>{setCls(v);setPage(1)},      opts:CLASSES   },
              { label:"Fee Type",   val:feeType, set:(v)=>{setFeeType(v);setPage(1)},  opts:FEE_TYPES },
              { label:"Session",    val:session, set:(v)=>{setSession(v);setPage(1)},  opts:SESSIONS  },
              { label:"Status",     val:status,  set:(v)=>{setStatus(v);setPage(1)},   opts:["All","PAID","UNPAID","PARTIAL"] },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                <select value={val} onChange={e => set(e.target.value)} className={inp}>{opts.map(o => <option key={o}>{o}</option>)}</select>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                <input placeholder="Name or roll…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
                  className="pl-8 pr-3 py-2.5 text-sm w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <CreditCard size={15} className="text-gray-400"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Fee Transactions</span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Collected: <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmt(summary.filtCollected)}</span>
                {" "}· Due: <span className="font-bold text-red-500">{fmt(summary.filtDue)}</span>
              </span>
              <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setPage(1)}}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none">
                {[10,25,50].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"900px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[["#",""],["Student","name"],["Roll","roll"],["Class","class"],["Fee Type","feeType"],["Amount","amount"],["Status","status"],["Date","date"],["Method","method"]].map(([h,col])=>(
                    <th key={h} onClick={()=>col&&sortBy(col)}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${col?"cursor-pointer hover:text-gray-700 dark:hover:text-gray-200":""}`}>
                      <span className="flex items-center gap-1">{h}{col&&<SortArrow col={col}/>}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-14 text-center">
                    <DollarSign size={32} className="mx-auto text-gray-200 dark:text-gray-600 mb-2"/>
                    <p className="text-sm text-gray-400">No transactions match your filters</p>
                  </td></tr>
                ) : paged.map((t, i) => {
                  const sm = STATUS_META[t.status];
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-400">{(safePage-1)*perPage+i+1}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{t.name}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">{t.roll}</td>
                      <td className="px-4 py-4"><span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-semibold">{t.class}</span></td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{t.feeType}</td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{fmt(t.amount)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${sm.badge}`}>
                          {sm.icon}{sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.date || "—"}</td>
                      <td className="px-4 py-4">
                        {t.method ? (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg">{t.method}</span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500">Showing {filtered.length===0?0:(safePage-1)*perPage+1}–{Math.min(safePage*perPage,filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={()=>setPage(1)} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">«</button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,i,arr)=>{if(i>0&&arr[i-1]!==p-1)acc.push("…");acc.push(p);return acc;},[]).map((p,i)=>
                typeof p==="string" ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                : <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage===p?"bg-emerald-600 text-white border-emerald-600":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{p}</button>
              )}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14}/></button>
              <button onClick={()=>setPage(totalPages)} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">»</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}