import React, { useState, useMemo } from "react";
import {
  MessageSquare, Send, Users, ChevronRight, Search,
  Upload, Check, AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const CLASS_LIST = [
  { id:1, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Primary",          group:"Default", className:"One",         sections:["Bulbuli","Doyel","Kakatua"]      },
  { id:2, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Primary",          group:"Default", className:"Two",         sections:["Hemonto","Boshonto","Shorot"]     },
  { id:3, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Six-Eight",        group:"Default", className:"Six",         sections:["Neptune","Uranus","Jupiter"]      },
  { id:4, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Higher Secondary", group:"Science", className:"HSC Science", sections:["1st Year","2nd Year"]             },
  { id:5, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Nine-Ten",         group:"Arts",    className:"Nine (Arts)", sections:["A","B","C"]                       },
  { id:6, campus:"BAF Shaheen College Bogura", shift:"Day", medium:"Bangla", level:"Primary",          group:"Default", className:"Three",       sections:["Shapla","Shokhina","Hasnuhana"]   },
];

const SESSIONS      = ["2023-2024","2024-2025","2025-2026"];
const CONTACT_TYPES = ["Student Mobile No.","Guardian Mobile No."];
const inp = "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? "text-gray-700 dark:text-gray-200 font-medium" : "hover:text-blue-500 cursor-pointer"}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export default function StudentBulkSms() {
  const [selectedSections, setSelectedSections] = useState({});
  const [contactType, setContactType] = useState(CONTACT_TYPES[0]);
  const [session,     setSession]     = useState("");
  const [smsPurpose,  setSmsPurpose]  = useState("");
  const [smsContent,  setSmsContent]  = useState("");
  const [file,        setFile]        = useState(null);
  const [search,      setSearch]      = useState("");
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [errors,      setErrors]      = useState({});

  const filtered = useMemo(() =>
    CLASS_LIST.filter((c) =>
      !search ||
      c.className.toLowerCase().includes(search.toLowerCase()) ||
      c.level.toLowerCase().includes(search.toLowerCase()) ||
      c.group.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const isClassChecked       = (cls) => selectedSections[cls.id]?.length === cls.sections.length;
  const isClassIndeterminate = (cls) => { const l = selectedSections[cls.id]?.length || 0; return l > 0 && l < cls.sections.length; };

  const toggleClass = (cls) => {
    if (isClassChecked(cls)) {
      const u = { ...selectedSections }; delete u[cls.id]; setSelectedSections(u);
    } else {
      setSelectedSections({ ...selectedSections, [cls.id]: [...cls.sections] });
    }
  };

  const toggleSection = (classId, section) => {
    const cur  = selectedSections[classId] || [];
    const next = cur.includes(section) ? cur.filter((s) => s !== section) : [...cur, section];
    if (next.length === 0) { const u = { ...selectedSections }; delete u[classId]; setSelectedSections(u); }
    else setSelectedSections({ ...selectedSections, [classId]: next });
  };

  const allChecked  = CLASS_LIST.every((c) => isClassChecked(c));
  const someChecked = Object.values(selectedSections).some((v) => v.length > 0);

  const selectAll = () => {
    if (allChecked) { setSelectedSections({}); }
    else { const all = {}; CLASS_LIST.forEach((c) => { all[c.id] = [...c.sections]; }); setSelectedSections(all); }
  };

  const totalSections  = Object.values(selectedSections).reduce((s, a) => s + a.length, 0);
  const estimatedCount = totalSections * 35;
  const charCount      = smsContent.length;
  const smsPages       = Math.ceil(charCount / 160) || 1;

  const handleSend = async () => {
    const e = {};
    if (!someChecked)       e.classes = "Select at least one class or section";
    if (!session)           e.session = "Required";
    if (!smsPurpose.trim()) e.purpose = "Required";
    if (!smsContent.trim()) e.content = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb items={["Dashboard","SMS Setup","Student Bulk SMS"]} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-blue-500" /> Student Bulk SMS
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Classes Available", value:CLASS_LIST.length, cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",       val:"text-blue-700 dark:text-blue-400"    },
            { label:"Sections Selected", value:totalSections,     cls:"bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30",val:"text-violet-700 dark:text-violet-400" },
            { label:"Est. Recipients",   value:estimatedCount,    cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",    val:"text-green-700 dark:text-green-400"  },
            { label:"SMS Pages",         value:smsPages,          cls:"bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",    val:"text-amber-600 dark:text-amber-400"  },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Class Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Users size={15} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Select Classes & Sections</span>
              {errors.classes && <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{errors.classes}</span>}
            </div>
            <div className="relative w-52">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input placeholder="Search class or level…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "800px" }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3.5 w-10">
                    <input type="checkbox" checked={allChecked}
                      ref={(el) => el && (el.indeterminate = someChecked && !allChecked)}
                      onChange={selectAll} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                  </th>
                  {["Institute","Shift","Medium","Level","Group","Class","Sections"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map((cls) => (
                  <tr key={cls.id} className={`transition-colors ${isClassChecked(cls) ? "bg-blue-50/40 dark:bg-blue-900/10" : "hover:bg-gray-50/70 dark:hover:bg-gray-700/20"}`}>
                    <td className="px-4 py-4">
                      <input type="checkbox" checked={isClassChecked(cls)}
                        ref={(el) => el && (el.indeterminate = isClassIndeterminate(cls))}
                        onChange={() => toggleClass(cls)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{cls.campus}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cls.shift}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cls.medium}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cls.level}</td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">{cls.group}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg">{cls.className}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {cls.sections.map((section) => {
                          const checked = selectedSections[cls.id]?.includes(section) || false;
                          return (
                            <label key={section}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all border select-none
                                ${checked ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleSection(cls.id, section)} className="hidden" />
                              {checked && <Check size={10} />}
                              {section}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SMS Compose Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <MessageSquare size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Compose SMS</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="Student Contact Type" required>
                <select value={contactType} onChange={(e) => setContactType(e.target.value)} className={inp}>
                  {CONTACT_TYPES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </F>
              <F label="Session" required error={errors.session}>
                <select value={session} onChange={(e) => { setSession(e.target.value); setErrors((p) => ({ ...p, session: undefined })); }}
                  className={errors.session ? inp.replace("border-gray-200 dark:border-gray-600","border-red-400") : inp}>
                  <option value="">Select Session</option>
                  {SESSIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </F>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="File / Image Upload">
                <label className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all
                  ${file ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}>
                  <Upload size={15} className={file ? "text-blue-500" : "text-gray-400"} />
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{file ? file.name : "Choose file…"}</span>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
                </label>
              </F>
              <F label="SMS Purpose" required error={errors.purpose}>
                <input type="text" value={smsPurpose}
                  onChange={(e) => { setSmsPurpose(e.target.value); setErrors((p) => ({ ...p, purpose: undefined })); }}
                  placeholder="e.g. Exam Notice, Fee Reminder…"
                  className={errors.purpose ? inp.replace("border-gray-200 dark:border-gray-600","border-red-400") : inp} />
              </F>
            </div>

            <F label="SMS Content" required error={errors.content}>
              <textarea rows={5} value={smsContent}
                onChange={(e) => { setSmsContent(e.target.value); setErrors((p) => ({ ...p, content: undefined })); }}
                placeholder="Type your SMS message here…"
                className={`${errors.content ? inp.replace("border-gray-200 dark:border-gray-600","border-red-400") : inp} resize-none`} />
              <div className="flex justify-end -mt-1">
                <span className={`text-xs font-medium ${charCount > 160 ? "text-amber-500" : "text-gray-400 dark:text-gray-500"}`}>
                  {charCount} chars · {smsPages} SMS page{smsPages !== 1 ? "s" : ""}
                </span>
              </div>
            </F>

            {someChecked && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <Send size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Ready to send</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">
                    {totalSections} section{totalSections !== 1 ? "s" : ""} · ~{estimatedCount} recipients · {smsPages} SMS page{smsPages !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button onClick={handleSend} disabled={sending}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm
                  ${sent ? "bg-green-600 shadow-green-200" : sending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}>
                {sending ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
                  : sent ? <><Check size={15} />SMS Sent!</>
                  : <><Send size={15} />Send SMS</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}