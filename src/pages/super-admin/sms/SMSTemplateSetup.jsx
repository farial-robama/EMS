import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  ChevronRight, Plus, Eye, Edit2, Trash2, X, Check,
  MessageSquare, Copy, Tag,
} from "lucide-react";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? "text-gray-700 dark:text-gray-200 font-medium" : "hover:text-blue-500 cursor-pointer transition-colors"}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const inp = (err) => `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err ? "border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"}`;
const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const VARIABLE_TAGS = [
  "{{student_name}}", "{{class_name}}", "{{class_roll}}",
  "{{attendance_day}}", "{{checkin_time}}", "{{parent_name}}",
  "{{school_name}}", "{{fee_amount}}", "{{due_date}}",
];

const TEMPLATE_TYPES = ["Attendance", "Fee", "Exam", "General", "Alert"];

const TYPE_STYLE = {
  Attendance: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Fee:        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Exam:       "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  General:    "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  Alert:      "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

let nextId = 5;

const INITIAL_TEMPLATES = [
  { id: 1, title: "Present SMS Template", type: "Attendance", content: "Respected Parents, your child {{student_name}} is present at school today. Regards - Principal.", status: "Active" },
  { id: 2, title: "Absent SMS",           type: "Attendance", content: "সম্মানিত অভিভাবক, আপনার সন্তান নাম {{student_name}} শ্রেণি {{class_name}} রোল {{class_roll}} আজ {{attendance_day}} তারিখে কলেজে অনুপস্থিত।", status: "Active" },
  { id: 3, title: "Late Arrival Alert",   type: "Attendance", content: "Respected Parents, {{student_name}} is late at school, entrance time: {{checkin_time}}.", status: "Active" },
  { id: 4, title: "Fee Due Reminder",     type: "Fee",        content: "Dear {{parent_name}}, your child {{student_name}} has a pending fee of {{fee_amount}}. Please pay before {{due_date}}.", status: "Inactive" },
];

const EMPTY_FORM = { title: "", type: "General", content: "", status: "Active" };

const F = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

// Highlight {{vars}} in content
const renderContent = (content) => {
  const parts = content.split(/({{[^}]+}})/g);
  return parts.map((p, i) =>
    /^{{.+}}$/.test(p)
      ? <span key={i} className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded px-1 text-xs font-mono">{p}</span>
      : <span key={i}>{p}</span>
  );
};

export default function SmsTemplateSetup() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [modal,     setModal]     = useState(null); // "add"|"edit"|"view"|"delete"
  const [selected,  setSelected]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState({});
  const [toast,     setToast]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [search,    setSearch]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const insertTag = (tag) => setForm(f => ({ ...f, content: f.content + tag }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = "Template title is required";
    if (!form.content.trim()) e.content = "SMS content is required";
    return e;
  };

  const openAdd = () => { setForm(EMPTY_FORM); setErrors({}); setModal("add"); };

  const openEdit = (t) => {
    setSelected(t);
    setForm({ title: t.title, type: t.type, content: t.content, status: t.status });
    setErrors({}); setModal("edit");
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (modal === "add") {
      setTemplates(prev => [...prev, { ...form, id: nextId++ }]);
      showToast("Template added successfully.");
    } else {
      setTemplates(prev => prev.map(t => t.id === selected.id ? { ...form, id: selected.id } : t));
      showToast("Template updated successfully.");
    }
    setModal(null);
  };

  const handleDelete = () => {
    setTemplates(prev => prev.filter(t => t.id !== selected.id));
    setModal(null); showToast("Template deleted.");
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1800);
    });
  };

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  const TemplateForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Template Title" required error={errors.title}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Absent Notification" className={inp(errors.title)} />
        </F>
        <F label="Template Type">
          <select name="type" value={form.type} onChange={handleChange} className={selCls}>
            {TEMPLATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </F>
      </div>

      {/* Variable Tag Inserter */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
          <Tag size={11} className="inline mr-1" />Insert Variable Tag
        </label>
        <div className="flex flex-wrap gap-1.5">
          {VARIABLE_TAGS.map(tag => (
            <button key={tag} type="button" onClick={() => insertTag(tag)}
              className="px-2 py-1 text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <F label="SMS Content" required error={errors.content}>
        <textarea name="content" value={form.content} onChange={handleChange}
          placeholder="Type your SMS here. Click variables above to insert them."
          rows={5} className={inp(errors.content) + " resize-none"} />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{form.content.length} characters</p>
      </F>

      {/* Live preview */}
      {form.content && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Live Preview</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{renderContent(form.content)}</p>
        </div>
      )}

      <F label="Status">
        <select name="status" value={form.status} onChange={handleChange} className={selCls}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </F>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "SMS Setup", "Template Setup"]} />
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add New Template
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Templates", val: templates.length,                                     color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",       vc: "text-blue-700 dark:text-blue-400" },
            { label: "Active",          val: templates.filter(t => t.status === "Active").length,   color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",   vc: "text-green-700 dark:text-green-400" },
            { label: "Inactive",        val: templates.filter(t => t.status === "Inactive").length, color: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",       vc: "text-gray-500 dark:text-gray-400" },
            { label: "Types Used",      val: [...new Set(templates.map(t => t.type))].length,       color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><MessageSquare size={14} /></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">SMS Templates</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{templates.length}</span>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all w-48" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["SL","Title","Type","Content Preview","Status","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No templates found</td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={t.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[t.type] || "bg-gray-100 text-gray-500"}`}>{t.type}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{renderContent(t.content)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === "Active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setSelected(t); setModal("view"); }}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye size={13} /></button>
                        <button onClick={() => openEdit(t)}
                          className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => { setSelected(t); setModal("delete"); }}
                          className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {(modal === "add" || modal === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[92vh] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${modal === "add" ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300"}`}>
                    {modal === "add" ? <Plus size={14} /> : <Edit2 size={14} />}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {modal === "add" ? "Add New SMS Template" : `Edit — ${selected?.title}`}
                  </h3>
                </div>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-5"><TemplateForm /></div>
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  {modal === "add" ? "Save Template" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {modal === "view" && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><Eye size={14} /></div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Template Details</h3>
                </div>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{selected.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[selected.type] || ""}`}>{selected.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status === "Active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{selected.status}</span>
                    </div>
                  </div>
                  <button onClick={() => handleCopy(selected.content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Content box */}
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">SMS Content</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{renderContent(selected.content)}</p>
                </div>

                {/* Variables used */}
                {VARIABLE_TAGS.filter(tag => selected.content.includes(tag)).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Variables Used</p>
                    <div className="flex flex-wrap gap-1.5">
                      {VARIABLE_TAGS.filter(tag => selected.content.includes(tag)).map(tag => (
                        <span key={tag} className="text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-lg">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Close</button>
                <button onClick={() => openEdit(selected)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Edit Template</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal === "delete" && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Template?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "<span className="font-semibold text-gray-700 dark:text-gray-200">{selected.title}</span>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}