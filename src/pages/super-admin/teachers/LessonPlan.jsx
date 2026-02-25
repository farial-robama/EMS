import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, ChevronDown, Plus, Check, Trash2, BookOpen, Search, Edit2, X } from "lucide-react";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1
          ? "text-gray-700 dark:text-gray-200 font-medium"
          : "hover:text-blue-500 cursor-pointer transition-colors"}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}><Icon size={14} /></div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          {badge && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

const inp = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"}`;

const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const TEACHERS = ["Md. Nazrul Islam", "Marufa", "Sazia Laizu", "Md. Farhad Hossain", "Muhammad Liaqat Ali"];
const SUBJECTS = ["Bangla", "English", "Physics", "Chemistry", "Biology", "Higher Mathematics", "ICT", "Economics", "History", "Civics"];
const CLASSES  = ["HSC-Science", "HSC-Arts", "HSC-Commerce"];
const SECTIONS = ["1st Year", "2nd Year", "1st Year (A)", "1st Year (B)"];

let nextId = 4;

const INITIAL_PLANS = [
  { id: 1, teacher: "Md. Nazrul Islam", subject: "Physics",   className: "HSC-Science", section: "1st Year", topic: "Motion and Forces",    date: "2025-09-01", duration: "45", status: "Completed" },
  { id: 2, teacher: "Marufa",           subject: "English",   className: "HSC-Arts",    section: "2nd Year", topic: "Essay Writing Basics",  date: "2025-09-03", duration: "45", status: "Ongoing" },
  { id: 3, teacher: "Md. Nazrul Islam", subject: "Chemistry", className: "HSC-Science", section: "2nd Year", topic: "Periodic Table",        date: "2025-09-05", duration: "50", status: "Planned" },
];

const STATUS_STYLE = {
  Completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Ongoing:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Planned:   "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const EMPTY_FORM = { teacher: "", subject: "", className: "", section: "", topic: "", date: "", duration: "45", status: "Planned" };

export default function LessonPlan() {
  const [plans, setPlans]         = useState(INITIAL_PLANS);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [search, setSearch]       = useState("");
  const [editId, setEditId]       = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [saved, setSaved]         = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.teacher)      e.teacher = "Required";
    if (!form.subject)      e.subject = "Required";
    if (!form.className)    e.className = "Required";
    if (!form.section)      e.section = "Required";
    if (!form.topic.trim()) e.topic = "Required";
    if (!form.date)         e.date = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editId !== null) {
      setPlans(prev => prev.map(p => p.id === editId ? { ...form, id: editId } : p));
      setEditId(null);
    } else {
      setPlans(prev => [...prev, { ...form, id: nextId++ }]);
    }
    setForm(EMPTY_FORM);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = (plan) => {
    setForm({ teacher: plan.teacher, subject: plan.subject, className: plan.className, section: plan.section, topic: plan.topic, date: plan.date, duration: plan.duration, status: plan.status });
    setEditId(plan.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); };

  const handleDelete = (id) => { setPlans(prev => prev.filter(p => p.id !== id)); setDeleteId(null); };

  const filtered = plans.filter(p =>
    (filterStatus === "" || p.status === filterStatus) &&
    (search === "" || p.teacher.toLowerCase().includes(search.toLowerCase()) ||
     p.subject.toLowerCase().includes(search.toLowerCase()) ||
     p.topic.toLowerCase().includes(search.toLowerCase()))
  );

  const F = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Teacher Setup", "Lesson Plan"]} />
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Lesson plan {editId !== null ? "updated" : "added"} successfully!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Plans",  val: plans.length,                                  color: "bg-blue-50  dark:bg-blue-900/20  border-blue-100  dark:border-blue-800",  vc: "text-blue-700  dark:text-blue-400" },
            { label: "Completed",    val: plans.filter(p => p.status==="Completed").length, color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
            { label: "Planned",      val: plans.filter(p => p.status==="Planned").length,   color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800", vc: "text-amber-700 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit Form */}
        <SectionCard
          title={editId !== null ? "Edit Lesson Plan" : "Add Lesson Plan"}
          icon={Plus}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
          badge={editId !== null ? "Editing" : undefined}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <F label="Teacher" required error={errors.teacher}>
                <select name="teacher" value={form.teacher} onChange={handleChange} className={selCls}>
                  <option value="">Select Teacher</option>
                  {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </F>
              <F label="Subject" required error={errors.subject}>
                <select name="subject" value={form.subject} onChange={handleChange} className={selCls}>
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </F>
              <F label="Class" required error={errors.className}>
                <select name="className" value={form.className} onChange={handleChange} className={selCls}>
                  <option value="">Select Class</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="Section" required error={errors.section}>
                <select name="section" value={form.section} onChange={handleChange} className={selCls}>
                  <option value="">Select Section</option>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </F>
              <F label="Topic / Chapter" required error={errors.topic}>
                <input name="topic" value={form.topic} onChange={handleChange}
                  placeholder="e.g. Motion and Forces" className={inp(errors.topic)} />
              </F>
              <F label="Plan Date" required error={errors.date}>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={inp(errors.date)} />
              </F>
              <F label="Duration (min)">
                <input type="number" name="duration" value={form.duration} onChange={handleChange} min={10} max={180} className={inp(false)} />
              </F>
              <F label="Status">
                <select name="status" value={form.status} onChange={handleChange} className={selCls}>
                  <option value="Planned">Planned</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </F>
            </div>
            <div className="flex justify-end gap-2">
              {editId !== null && (
                <button type="button" onClick={cancelEdit}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
              )}
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                {editId !== null ? <><Check size={15} /> Update Plan</> : <><Plus size={15} /> Add Plan</>}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* List */}
        <SectionCard title="Lesson Plan List" icon={BookOpen}
          iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
          badge={`${plans.length} plans`}>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all">
              <option value="">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="relative ml-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search teacher, subject, topic…"
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-56" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {["SL","Teacher","Subject","Class","Section","Topic","Date","Duration","Status","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">No lesson plans found</td></tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr key={p.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{p.teacher}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{p.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.className}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.section}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 max-w-[140px] truncate">{p.topic}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.duration} min</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => startEdit(p)}
                            className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteId(p.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Delete modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Lesson Plan?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "<span className="font-medium text-gray-700 dark:text-gray-200">{plans.find(p => p.id === deleteId)?.topic}</span>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}