import React, { useState, useMemo } from "react";
import {
  ChevronRight, MessageSquare, Send, CheckCircle2,
  XCircle, Clock, Search, Download, Filter,
  ChevronLeft, BarChart2, Users, TrendingUp,
  Phone, FileText, Eye, X, Calendar,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Constants ─── */
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SMS_TYPES  = ["All","Bulk Student","Bulk Teacher","Mixed","Individual"];
const SMS_STATUS = ["All","Delivered","Failed","Pending"];

/* ─── Monthly SMS volume ─── */
const MONTHLY_VOLUME = [
  { month:"Jan", sent:342, delivered:318, failed:24  },
  { month:"Feb", sent:289, delivered:271, failed:18  },
  { month:"Mar", sent:567, delivered:541, failed:26  },
  { month:"Apr", sent:421, delivered:398, failed:23  },
  { month:"May", sent:380, delivered:362, failed:18  },
  { month:"Jun", sent:198, delivered:188, failed:10  },
  { month:"Jul", sent:0,   delivered:0,   failed:0   },
  { month:"Aug", sent:445, delivered:422, failed:23  },
  { month:"Sep", sent:512, delivered:487, failed:25  },
  { month:"Oct", sent:398, delivered:376, failed:22  },
  { month:"Nov", sent:327, delivered:310, failed:17  },
  { month:"Dec", sent:0,   delivered:0,   failed:0   },
];

/* ─── Sample SMS log ─── */
const SMS_LOG = [
  { id:1,  purpose:"Exam Schedule Notification",         type:"Bulk Student",   recipients:156, delivered:148, failed:8,  cost:156,  date:"2025-11-14", sentBy:"Admin",         status:"Delivered", preview:"Dear Parent, The annual examination schedule has been published. Please check the notice board or school website for details." },
  { id:2,  purpose:"Fee Due Reminder — November",        type:"Bulk Student",   recipients:43,  delivered:40,  failed:3,  cost:43,   date:"2025-11-12", sentBy:"Admin",         status:"Delivered", preview:"Dear Parent, Monthly tuition fee for November 2025 is due. Please pay by 15th November to avoid late charges." },
  { id:3,  purpose:"Staff Meeting Reminder",             type:"Bulk Teacher",   recipients:28,  delivered:28,  failed:0,  cost:28,   date:"2025-11-10", sentBy:"Principal",     status:"Delivered", preview:"Respected Teacher, A mandatory staff meeting is scheduled for tomorrow at 2:00 PM in the conference room." },
  { id:4,  purpose:"Result Published Alert",             type:"Mixed",          recipients:184, delivered:171, failed:13, cost:184,  date:"2025-11-08", sentBy:"Admin",         status:"Delivered", preview:"Dear Guardian, Half-yearly examination results have been published. Please visit school to collect the mark sheet." },
  { id:5,  purpose:"Absence Notification — MD. RAFIQ",   type:"Individual",     recipients:1,   delivered:1,   failed:0,  cost:1,    date:"2025-11-07", sentBy:"Class Teacher", status:"Delivered", preview:"Dear Parent, Your child MD. RAFIQ was absent today (07-Nov-2025) without prior notice. Please inform the school." },
  { id:6,  purpose:"Sports Day Invitation",              type:"Bulk Student",   recipients:312, delivered:298, failed:14, cost:312,  date:"2025-11-05", sentBy:"Admin",         status:"Delivered", preview:"Dear Parent, Annual Sports Day is on 14-Feb-2026. Students must wear sports attire. Events begin at 9:00 AM sharp." },
  { id:7,  purpose:"Holiday Notice — Victory Day",       type:"Mixed",          recipients:340, delivered:325, failed:15, cost:340,  date:"2025-11-03", sentBy:"Admin",         status:"Delivered", preview:"Dear Students & Teachers, The school will remain closed on 16th December 2025 (Victory Day). Classes resume on 17th Dec." },
  { id:8,  purpose:"Parent-Teacher Meeting",             type:"Bulk Student",   recipients:98,  delivered:91,  failed:7,  cost:98,   date:"2025-10-28", sentBy:"Admin",         status:"Delivered", preview:"Dear Parent, A Parent-Teacher meeting is scheduled for 5th Nov 2025 at 10:00 AM. Your presence is requested." },
  { id:9,  purpose:"Urgent: School Closed Tomorrow",     type:"Mixed",          recipients:368, delivered:349, failed:19, cost:368,  date:"2025-10-22", sentBy:"Principal",     status:"Delivered", preview:"URGENT: School is closed tomorrow 23-Oct-2025 due to unavoidable circumstances. Regular classes resume Friday." },
  { id:10, purpose:"Salary Credit Notification",         type:"Bulk Teacher",   recipients:28,  delivered:26,  failed:2,  cost:28,   date:"2025-10-01", sentBy:"Accounts",      status:"Delivered", preview:"Dear Teacher, Your salary for the month of September 2025 has been credited to your account. Please check your bank statement." },
  { id:11, purpose:"Exam Admit Card Ready",              type:"Bulk Student",   recipients:87,  delivered:82,  failed:5,  cost:87,   date:"2025-09-25", sentBy:"Admin",         status:"Delivered", preview:"Dear Student, Your admit card for the upcoming examination is ready. Please collect it from the school office before 30th Sep." },
  { id:12, purpose:"New Circular: Dress Code Policy",    type:"Mixed",          recipients:395, delivered:0,   failed:395,cost:395,  date:"2025-09-20", sentBy:"Admin",         status:"Failed",    preview:"Dear Guardian, A new dress code policy has been implemented effective October 2025. Refer to the school circular for details." },
  { id:13, purpose:"Prize Giving Ceremony Reminder",     type:"Bulk Student",   recipients:156, delivered:0,   failed:0,  cost:156,  date:"2025-11-18", sentBy:"Admin",         status:"Pending",   preview:"Dear Guardian, Annual Prize Giving Ceremony is scheduled for 25-Nov-2025. Please ensure your child attends with formal attire." },
  { id:14, purpose:"Science Fair Registration Open",     type:"Bulk Student",   recipients:234, delivered:221, failed:13, cost:234,  date:"2025-09-15", sentBy:"Admin",         status:"Delivered", preview:"Dear Student, Registration for the Annual Science Fair 2025 is now open. Interested students must register by 30th September." },
  { id:15, purpose:"Monthly Attendance Alert",           type:"Bulk Student",   recipients:12,  delivered:12,  failed:0,  cost:12,   date:"2025-09-10", sentBy:"System",        status:"Delivered", preview:"Dear Parent, Your child's attendance this month is below the required 75%. Please ensure regular attendance to avoid exam restrictions." },
];

const STATUS_META = {
  Delivered: { badge:"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",  icon:<CheckCircle2 size={10}/> },
  Failed:    { badge:"bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",           icon:<XCircle size={10}/>     },
  Pending:   { badge:"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",   icon:<Clock size={10}/>       },
};

const TYPE_META = {
  "Bulk Student": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  "Bulk Teacher": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  "Mixed":        "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400",
  "Individual":   "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
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

export default function SMSReports() {
  const [type,    setType]    = useState("All");
  const [status,  setStatus]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() =>
    SMS_LOG.filter(s =>
      (type   === "All" || s.type   === type)   &&
      (status === "All" || s.status === status) &&
      (!search || s.purpose.toLowerCase().includes(search.toLowerCase()) || s.sentBy.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => b.date.localeCompare(a.date)),
    [type, status, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  /* yearly totals */
  const totalSent      = MONTHLY_VOLUME.reduce((s, m) => s + m.sent, 0);
  const totalDelivered = MONTHLY_VOLUME.reduce((s, m) => s + m.delivered, 0);
  const totalFailed    = MONTHLY_VOLUME.reduce((s, m) => s + m.failed, 0);
  const deliveryRate   = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const barMax = Math.max(...MONTHLY_VOLUME.map(m => m.sent), 1);

  const handleExport = () => {
    const rows = filtered.map((s, i) => ({
      "#":i+1, Purpose:s.purpose, Type:s.type, Recipients:s.recipients,
      Delivered:s.delivered, Failed:s.failed, "Cost (SMS)":s.cost,
      Status:s.status, Date:s.date, "Sent By":s.sentBy,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SMS Report");
    XLSX.writeFile(wb, "SMSReport.xlsx");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Reports","SMS Reports"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <MessageSquare size={22} className="text-violet-500" /> SMS Reports
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Track SMS delivery, volume, cost, and campaign performance</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 flex-shrink-0">
            <Download size={15} /> Export Excel
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total Sent",      value:totalSent.toLocaleString(),      sub:"This academic year",           cls:"bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-900/30",   val:"text-violet-700 dark:text-violet-400" },
            { label:"Delivered",       value:totalDelivered.toLocaleString(), sub:`${deliveryRate}% delivery rate`,cls:"bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30",     val:"text-green-700 dark:text-green-400"  },
            { label:"Failed",          value:totalFailed.toLocaleString(),    sub:"Undelivered messages",          cls:"bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30",             val:"text-red-600 dark:text-red-400"      },
            { label:"Total Campaigns", value:SMS_LOG.length,                  sub:`${SMS_LOG.filter(s=>s.status==="Delivered").length} successful`,cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30",val:"text-blue-700 dark:text-blue-400"},
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl border ${s.cls}`}>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
              <p className={`text-2xl font-bold leading-none ${s.val}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart + Type breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Monthly bar */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <BarChart2 size={15} className="text-violet-500"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Monthly SMS Volume</span>
            </div>
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-end gap-2 h-40">
                {MONTHLY_VOLUME.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5 group">
                    <div className="flex items-end gap-0.5 w-full justify-center">
                      <div style={{ height:`${(m.sent/barMax)*130}px` }}       title={`Sent: ${m.sent}`}      className="w-1/3 rounded-t bg-violet-200 dark:bg-violet-800 min-h-0"/>
                      <div style={{ height:`${(m.delivered/barMax)*130}px` }}  title={`Delivered: ${m.delivered}`} className="w-1/3 rounded-t bg-violet-500 min-h-0"/>
                      <div style={{ height:`${(m.failed/barMax)*130}px` }}     title={`Failed: ${m.failed}`}  className="w-1/3 rounded-t bg-red-400 min-h-0"/>
                    </div>
                    <span className="text-[9px] text-gray-400">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-5 mt-4">
                {[["bg-violet-200 dark:bg-violet-800","Sent"],["bg-violet-500","Delivered"],["bg-red-400","Failed"]].map(([c,l])=>(
                  <div key={l} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm ${c}`}/>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Type breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Campaign Types</p>
            </div>
            <div className="p-4 space-y-4">
              {SMS_TYPES.filter(t=>t!=="All").map(t => {
                const logs = SMS_LOG.filter(s => s.type === t);
                const sentTotal = logs.reduce((s,l) => s+l.recipients,0);
                const grandTotal = SMS_LOG.reduce((s,l) => s+l.recipients, 0);
                const p = grandTotal > 0 ? Math.round((sentTotal/grandTotal)*100) : 0;
                const bars = {"Bulk Student":"bg-blue-500","Bulk Teacher":"bg-purple-500","Mixed":"bg-teal-500","Individual":"bg-orange-500"};
                return (
                  <div key={t}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`px-2 py-0.5 rounded-lg font-semibold ${TYPE_META[t]}`}>{t}</span>
                      <span className="text-gray-400 font-mono">{sentTotal.toLocaleString()} sent</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bars[t]}`} style={{width:`${p}%`}}/>
                    </div>
                  </div>
                );
              })}

              {/* Delivery rate ring-like indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Delivery Rate</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width:`${deliveryRate}%`}}/>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400 flex-shrink-0">{deliveryRate}%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{totalDelivered.toLocaleString()} of {totalSent.toLocaleString()} delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30">
            <Filter size={14} className="text-violet-500"/>
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">Filter SMS Log</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label:"SMS Type",  val:type,   set:(v)=>{setType(v);setPage(1)},   opts:SMS_TYPES  },
              { label:"Status",    val:status, set:(v)=>{setStatus(v);setPage(1)}, opts:SMS_STATUS },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                <select value={val} onChange={e=>set(e.target.value)} className={inp}>{opts.map(o=><option key={o}>{o}</option>)}</select>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                <input placeholder="Search purpose or sender…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
                  className="pl-8 pr-3 py-2.5 text-sm w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <MessageSquare size={15} className="text-gray-400"/>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">SMS Campaign Log</span>
              <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setPage(1)}}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none">
              {[10,25,50].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"900px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {["#","Purpose","Type","Recipients","Delivered","Failed","Cost","Status","Date","Sent By",""].map(h=>(
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={11} className="px-5 py-14 text-center">
                    <MessageSquare size={32} className="mx-auto text-gray-200 dark:text-gray-600 mb-2"/>
                    <p className="text-sm text-gray-400">No SMS campaigns match your filters</p>
                  </td></tr>
                ) : paged.map((s, i) => {
                  const sm = STATUS_META[s.status];
                  const delivRate = s.recipients > 0 ? Math.round((s.delivered/s.recipients)*100) : 0;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-400">{(safePage-1)*perPage+i+1}</td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={s.purpose}>{s.purpose}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${TYPE_META[s.type]}`}>{s.type}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-700 dark:text-gray-300 font-semibold">{s.recipients}</td>
                      <td className="px-4 py-4 text-sm text-center text-green-600 dark:text-green-400 font-semibold">{s.delivered}</td>
                      <td className="px-4 py-4 text-sm text-center text-red-500 font-semibold">{s.failed}</td>
                      <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono">{s.cost} SMS</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${sm.badge}`}>
                            {sm.icon}{s.status}
                          </span>
                          {s.status === "Delivered" && (
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-12">
                                <div className="h-full bg-green-400 rounded-full" style={{width:`${delivRate}%`}}/>
                              </div>
                              <span className="text-[9px] text-gray-400">{delivRate}%</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.date}</td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{s.sentBy}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => setPreview(s)}
                          className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-500 hover:bg-violet-100 flex items-center justify-center border border-violet-200 dark:border-violet-900 transition-all">
                          <Eye size={12}/>
                        </button>
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
                : <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-medium ${safePage===p?"bg-violet-600 text-white border-violet-600":"border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{p}</button>
              )}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14}/></button>
              <button onClick={()=>setPage(totalPages)} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 text-xs font-bold flex items-center justify-center">»</button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-900/30">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-violet-500"/>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">SMS Preview</span>
                </div>
                <button onClick={()=>setPreview(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><X size={14}/></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[["Purpose",preview.purpose],["Type",preview.type],["Sent By",preview.sentBy],["Date",preview.date],["Recipients",preview.recipients],["Delivered",preview.delivered]].map(([l,v])=>(
                    <div key={l}>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{l}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Message Content</p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{preview.preview}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{preview.preview.length} characters · {Math.ceil(preview.preview.length/160)} SMS page</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {React.cloneElement(STATUS_META[preview.status].icon, { size:14, className:`${preview.status==="Delivered"?"text-green-500":preview.status==="Failed"?"text-red-500":"text-amber-500"}` })}
                  <span className={`text-sm font-semibold ${preview.status==="Delivered"?"text-green-600":preview.status==="Failed"?"text-red-500":"text-amber-600"}`}>{preview.status}</span>
                  {preview.status==="Delivered" && <span className="text-xs text-gray-400">({Math.round((preview.delivered/preview.recipients)*100)}% delivery rate)</span>}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}