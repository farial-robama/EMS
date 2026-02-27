import React, { useState, useMemo } from "react";
import {
  ChevronRight, ChevronLeft, Search, Filter, Eye, Pencil,
  CheckCircle2, XCircle, Clock, AlertCircle, Download,
  Users, UserCheck, UserX, GraduationCap, Plus, X, Check,
  FileText, Phone, Mail, MapPin, Calendar,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Sample Applicants ─── */
const ALL_APPLICANTS = [
  { id:1,  name:"ABDULLAH AL MUKIM",        gender:"Male",   dob:"2012-03-15", phone:"017XXXXXXXX", email:"",                   address:"Bogura Sadar",      eduLevel:"Six-Eight",  className:"Eight",           session:"2026",      roll:"86532", fee:"New Admission MNC Male Eight",      payment:"UNPAID",  approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:2,  name:"TASMIA RAHMAN",             gender:"Female", dob:"2013-07-22", phone:"018XXXXXXXX", email:"tasmia@example.com", address:"Bogura Cantonment", eduLevel:"Six-Eight",  className:"Six",             session:"2026",      roll:"60885", fee:"New Admission MNC Female Six",      payment:"UNPAID",  approval:"APPROVED", submitted:"No",  status:"Active"   },
  { id:3,  name:"MST FATHIYA BINTE YEASIN",  gender:"Female", dob:"2009-11-05", phone:"019XXXXXXXX", email:"",                   address:"Rajshahi",          eduLevel:"Nine-Ten",   className:"Nine (Science)",  session:"2026-2027", roll:"9114",  fee:"New Admission Baf 4th Female Nine", payment:"PAID",    approval:"APPROVED", submitted:"No",  status:"Active"   },
  { id:4,  name:"MOHAMMAD RAYHAN",           gender:"Male",   dob:"2013-05-10", phone:"016XXXXXXXX", email:"",                   address:"Bogura",            eduLevel:"Six-Eight",  className:"Seven",           session:"2026",      roll:"72341", fee:"New Admission MNC Male Seven",      payment:"PAID",    approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:5,  name:"SUMAIYA AKTER",             gender:"Female", dob:"2008-02-28", phone:"017YYYYYYYY", email:"",                   address:"Dhaka",             eduLevel:"Nine-Ten",   className:"Ten (Arts)",      session:"2026-2027", roll:"10224", fee:"New Admission Female Ten Arts",     payment:"UNPAID",  approval:"PENDING",  submitted:"Yes", status:"Inactive" },
  { id:6,  name:"RIFAT HOSSAIN",             gender:"Male",   dob:"2012-09-18", phone:"018YYYYYYYY", email:"",                   address:"Bogura",            eduLevel:"Six-Eight",  className:"Eight",           session:"2026",      roll:"86999", fee:"New Admission MNC Male Eight",      payment:"PAID",    approval:"APPROVED", submitted:"No",  status:"Active"   },
  { id:7,  name:"NAZMUN NAHAR MITU",         gender:"Female", dob:"2009-01-12", phone:"019YYYYYYYY", email:"",                   address:"Dhaka",             eduLevel:"Nine-Ten",   className:"Nine (Science)",  session:"2026-2027", roll:"9087",  fee:"New Admission Female Nine Science", payment:"UNPAID",  approval:"REJECTED", submitted:"No",  status:"Inactive" },
  { id:8,  name:"TOWHID ISLAM",              gender:"Male",   dob:"2013-06-30", phone:"016YYYYYYYY", email:"",                   address:"Bogura Cantonment", eduLevel:"Six-Eight",  className:"Six",             session:"2026",      roll:"60321", fee:"New Admission MNC Male Six",        payment:"PAID",    approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:9,  name:"FARIDA KHANAM",             gender:"Female", dob:"2008-12-03", phone:"017ZZZZZZZ",  email:"",                   address:"Chittagong",        eduLevel:"Nine-Ten",   className:"Ten (Commerce)",  session:"2026-2027", roll:"10551", fee:"New Admission Female Ten Commerce", payment:"UNPAID",  approval:"PENDING",  submitted:"No",  status:"Active"   },
  { id:10, name:"ARIFUL ISLAM SIAM",         gender:"Male",   dob:"2013-04-20", phone:"018ZZZZZZZ",  email:"",                   address:"Bogura",            eduLevel:"Six-Eight",  className:"Seven",           session:"2026",      roll:"72888", fee:"New Admission MNC Male Seven",      payment:"PAID",    approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:11, name:"TANVIR AHMED",              gender:"Male",   dob:"2012-08-14", phone:"019ZZZZZZZ",  email:"",                   address:"Naogaon",           eduLevel:"Six-Eight",  className:"Eight",           session:"2026",      roll:"86712", fee:"New Admission MNC Male Eight",      payment:"UNPAID",  approval:"APPROVED", submitted:"No",  status:"Active"   },
  { id:12, name:"SADIA ISLAM RIPA",          gender:"Female", dob:"2009-03-07", phone:"016ZZZZZZZ",  email:"",                   address:"Bogura",            eduLevel:"Nine-Ten",   className:"Nine (Science)",  session:"2026-2027", roll:"9201",  fee:"New Admission Female Nine Science", payment:"PAID",    approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:13, name:"HASIBUL HASAN",             gender:"Male",   dob:"2010-10-25", phone:"017AAAAAAA",  email:"",                   address:"Sirajganj",         eduLevel:"Nine-Ten",   className:"Nine (Arts)",     session:"2026-2027", roll:"9340",  fee:"New Admission Male Nine Arts",      payment:"UNPAID",  approval:"PENDING",  submitted:"No",  status:"Active"   },
  { id:14, name:"LUBNA SULTANA",             gender:"Female", dob:"2012-07-11", phone:"018AAAAAAA",  email:"",                   address:"Bogura Cantonment", eduLevel:"Six-Eight",  className:"Six",             session:"2026",      roll:"60432", fee:"New Admission MNC Female Six",      payment:"PAID",    approval:"APPROVED", submitted:"Yes", status:"Active"   },
  { id:15, name:"RAKIBUL HASAN",             gender:"Male",   dob:"2008-05-19", phone:"019AAAAAAA",  email:"",                   address:"Natore",            eduLevel:"Nine-Ten",   className:"Ten (Science)",   session:"2026-2027", roll:"10123", fee:"New Admission Male Ten Science",    payment:"UNPAID",  approval:"REJECTED", submitted:"No",  status:"Inactive" },
];

const EDU_LEVELS = ["All","Six-Eight","Nine-Ten","Primary","Higher Secondary"];
const SESSIONS   = ["All","2026","2026-2027","2025-2026"];
const CLASSES    = ["All","Six","Seven","Eight","Nine (Science)","Nine (Arts)","Ten (Science)","Ten (Arts)","Ten (Commerce)"];
const PAYMENTS   = ["All","PAID","UNPAID"];
const APPROVALS  = ["All","APPROVED","PENDING","REJECTED"];

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

const ApprovalBadge = ({ v }) => ({
  APPROVED: <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"><CheckCircle2 size={10} />APPROVED</span>,
  PENDING:  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"><Clock size={10} />PENDING</span>,
  REJECTED: <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><XCircle size={10} />REJECTED</span>,
}[v] || null);

const PayBadge = ({ v }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold ${v==="PAID" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>{v}</span>
);

export default function ApplicantList() {
  const [level,    setLevel]    = useState("All");
  const [session,  setSession]  = useState("All");
  const [cls,      setCls]      = useState("All");
  const [payment,  setPayment]  = useState("All");
  const [approval, setApproval] = useState("All");
  const [search,   setSearch]   = useState("");
  const [perPage,  setPerPage]  = useState(10);
  const [page,     setPage]     = useState(1);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [applicants, setApplicants] = useState(ALL_APPLICANTS);

  const filtered = useMemo(() =>
    applicants.filter((a) =>
      (level    === "All" || a.eduLevel   === level)    &&
      (session  === "All" || a.session    === session)  &&
      (cls      === "All" || a.className  === cls)      &&
      (payment  === "All" || a.payment    === payment)  &&
      (approval === "All" || a.approval   === approval) &&
      (!search  || a.name.toLowerCase().includes(search.toLowerCase()) || a.roll.includes(search))
    ), [applicants, level, session, cls, payment, approval, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const stats = useMemo(() => ({
    total:    applicants.length,
    approved: applicants.filter(a => a.approval === "APPROVED").length,
    pending:  applicants.filter(a => a.approval === "PENDING").length,
    rejected: applicants.filter(a => a.approval === "REJECTED").length,
    paid:     applicants.filter(a => a.payment  === "PAID").length,
  }), [applicants]);

  const updateApproval = (id, val) => setApplicants(p => p.map(a => a.id === id ? { ...a, approval: val } : a));

  const handleEditSave = () => {
    setApplicants(p => p.map(a => a.id === editItem.id ? { ...a, ...editForm } : a));
    setEditItem(null);
  };

  const handleExcel = () => {
    const data = filtered.map((a, i) => ({
      "#": i + 1, Name: a.name, Gender: a.gender, Level: a.eduLevel,
      Class: a.className, Session: a.session, Roll: a.roll,
      Phone: a.phone, Address: a.address, Payment: a.payment,
      Approval: a.approval, Status: a.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "ApplicantList.xlsx");
  };

  const paginationPages = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== "…") arr.push("…");
    }
    return arr;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Admission","Applicant List"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText size={22} className="text-blue-500" /> Applicant List
            </h1>
          </div>
          <button onClick={handleExcel}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200 flex-shrink-0">
            <Download size={15} /> Export Excel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label:"Total Applicants",  value:stats.total,    cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",       val:"text-blue-700 dark:text-blue-400"    },
            { label:"Approved",          value:stats.approved, cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",   val:"text-green-700 dark:text-green-400"  },
            { label:"Pending",           value:stats.pending,  cls:"bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",   val:"text-amber-600 dark:text-amber-400"  },
            { label:"Rejected",          value:stats.rejected, cls:"bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",           val:"text-red-600 dark:text-red-400"      },
            { label:"Fees Paid",         value:stats.paid,     cls:"bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",val:"text-purple-700 dark:text-purple-400"},
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filter Applicants</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label:"Education Level", val:level,    set:setLevel,    opts:EDU_LEVELS  },
              { label:"Session",         val:session,  set:setSession,  opts:SESSIONS    },
              { label:"Class",           val:cls,      set:setCls,      opts:CLASSES     },
              { label:"Payment Status",  val:payment,  set:setPayment,  opts:PAYMENTS    },
              { label:"Approval Status", val:approval, set:setApproval, opts:APPROVALS   },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                <select value={val} onChange={(e) => { set(e.target.value); setPage(1); }} className={inp}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Applicants</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{filtered.length} found</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show</span>
                <select value={perPage} onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500">
                  {[10,25,50].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input placeholder="Search name or roll…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-48 transition-all" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "1050px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {["#","Name","Gender","Class","Session","Roll","Fee Template","Payment","Approval","Form","Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h==="Actions" ? "text-right pr-5" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr><td colSpan={11} className="px-5 py-14 text-center">
                    <Users size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No applicants match your filters</p>
                  </td></tr>
                ) : paged.map((a, i) => (
                  <tr key={a.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-400">{(safePage-1)*perPage+i+1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${a.gender === "Female" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                          {a.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{a.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{a.eduLevel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${a.gender==="Male" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400"}`}>{a.gender}</span>
                    </td>
                    <td className="px-4 py-4"><span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg">{a.className}</span></td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{a.session}</td>
                    <td className="px-4 py-4 text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">{a.roll}</td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-[140px] truncate" title={a.fee}>{a.fee}</td>
                    <td className="px-4 py-4"><PayBadge v={a.payment} /></td>
                    <td className="px-4 py-4"><ApprovalBadge v={a.approval} /></td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${a.submitted==="Yes" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{a.submitted}</span>
                    </td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewItem(a)}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 flex items-center justify-center border border-blue-100 dark:border-blue-900 transition-all" title="View">
                          <Eye size={12} />
                        </button>
                        <button onClick={() => { setEditItem(a); setEditForm({ approval: a.approval, payment: a.payment, status: a.status }); }}
                          className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100 dark:border-amber-900 transition-all" title="Edit">
                          <Pencil size={12} />
                        </button>
                        {a.approval === "PENDING" && (
                          <>
                            <button onClick={() => updateApproval(a.id, "APPROVED")}
                              className="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 flex items-center justify-center border border-green-100 dark:border-green-900 transition-all" title="Approve">
                              <Check size={12} />
                            </button>
                            <button onClick={() => updateApproval(a.id, "REJECTED")}
                              className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center border border-red-100 dark:border-red-900 transition-all" title="Reject">
                              <X size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length===0?0:(safePage-1)*perPage+1}–{Math.min(safePage*perPage,filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">«</button>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
              {paginationPages().map((p, i) =>
                typeof p === "string"
                  ? <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                  : <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${safePage===p ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{p}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={safePage===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">»</button>
            </div>
          </div>
        </div>

        {/* ── View Modal ── */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Eye size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Applicant Details</span>
                </div>
                <button onClick={() => setViewItem(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><X size={14} /></button>
              </div>
              {/* Avatar + name */}
              <div className="flex items-center gap-4 px-5 pt-5 pb-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${viewItem.gender==="Female" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                  {viewItem.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white">{viewItem.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{viewItem.eduLevel} · Roll {viewItem.roll}</p>
                </div>
              </div>
              <div className="px-5 pb-4 space-y-0 divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ["Class",        viewItem.className],
                  ["Session",      viewItem.session],
                  ["Gender",       viewItem.gender],
                  ["Date of Birth",viewItem.dob],
                  ["Phone",        viewItem.phone],
                  ["Address",      viewItem.address],
                  ["Fee Template", viewItem.fee],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 text-right max-w-[55%]">{val}</span>
                  </div>
                ))}
                <div className="pt-3 flex items-center justify-around gap-3">
                  <div className="text-center"><p className="text-xs text-gray-400 mb-1">Payment</p><PayBadge v={viewItem.payment} /></div>
                  <div className="text-center"><p className="text-xs text-gray-400 mb-1">Approval</p><ApprovalBadge v={viewItem.approval} /></div>
                  <div className="text-center"><p className="text-xs text-gray-400 mb-1">Form</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${viewItem.submitted==="Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{viewItem.submitted}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setViewItem(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Modal ── */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center"><Pencil size={13} /></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Update Applicant</span>
                </div>
                <button onClick={() => setEditItem(null)} className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400"><X size={14} /></button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Updating: <span className="font-semibold text-gray-700 dark:text-gray-200">{editItem.name}</span></p>
                {[
                  { label:"Approval Status", key:"approval",  opts:["APPROVED","PENDING","REJECTED"] },
                  { label:"Payment Status",  key:"payment",   opts:["PAID","UNPAID"] },
                  { label:"Active Status",   key:"status",    opts:["Active","Inactive"] },
                ].map(({ label, key, opts }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
                    <select value={editForm[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} className={inp}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleEditSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors shadow-sm">
                  <Check size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}