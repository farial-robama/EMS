import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Plus, Eye, Edit2, Trash2, X, Save, List,
  ChevronLeft, ChevronRight as CRight,
} from "lucide-react";

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

const inp  = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const selCls = inp;

const EMPTY = { id: null, title: "", parent: "", hasChild: "No", headType: "Student", ordering: "" };

const INITIAL_HEADS = [
  { id: 1, title: "Examination Fee",         parent: "", hasChild: "No", headType: "Student", ordering: 1  },
  { id: 2, title: "Primary Apply Fee",        parent: "", hasChild: "No", headType: "Student", ordering: 1  },
  { id: 3, title: "Form Fill Up",             parent: "", hasChild: "No", headType: "Student", ordering: 1  },
  { id: 4, title: "Center Fee",               parent: "", hasChild: "No", headType: "Student", ordering: 99 },
  { id: 5, title: "Tuition Fee",              parent: "", hasChild: "No", headType: "Student", ordering: 2  },
  { id: 6, title: "Library Fee",              parent: "", hasChild: "No", headType: "Student", ordering: 3  },
];

export default function TransactionHead() {
  const [heads,    setHeads]    = useState(INITIAL_HEADS);
  const [form,     setForm]     = useState(EMPTY);
  const [mode,     setMode]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [toast,    setToast]    = useState("");
  const [page,     setPage]     = useState(1);
  const perPage = 10;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd  = () => { setMode("add");  setForm(EMPTY);  setErrors({}); setShowForm(true); };
  const openView = (h) => { setMode("view"); setForm(h);     setErrors({}); setShowForm(true); };
  const openEdit = (h) => { setMode("edit"); setForm(h);     setErrors({}); setShowForm(true); };

  const handleDelete = (id) => {
    setHeads(prev => prev.filter(h => h.id !== id));
    setDeleteId(null);
    showToast("Transaction head deleted.");
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.ordering)     errs.ordering = "Ordering is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (mode === "add") {
      setHeads(prev => [...prev, { ...form, id: Date.now() }]);
      showToast("Transaction head added.");
    } else {
      setHeads(prev => prev.map(h => h.id === form.id ? form : h));
      showToast("Transaction head updated.");
    }
    setShowForm(false);
  };

  const totalPages = Math.max(1, Math.ceil(heads.length / perPage));
  const current    = heads.slice((page - 1) * perPage, page * perPage);

  const typeColor = (t) => t === "Student"
    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Accounts", "Transaction Heads"]} />
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add Transaction Head
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ {toast}
          </div>
        )}

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Heads", val: heads.length,                                        color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",     vc: "text-blue-700 dark:text-blue-400" },
            { label: "Student",     val: heads.filter(h => h.headType === "Student").length,  color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",  vc: "text-green-700 dark:text-green-400" },
            { label: "General",     val: heads.filter(h => h.headType === "General").length,  color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800", vc: "text-purple-700 dark:text-purple-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <List size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Transaction Head List</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["#","Title","Head Type","Has Children","Ordering","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No transaction heads found</td></tr>
                ) : current.map((h, i) => (
                  <tr key={h.id}
                    className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{(page - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200">{h.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor(h.headType)}`}>
                        {h.headType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${h.hasChild === "Yes"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                        {h.hasChild}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{h.ordering}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openView(h)}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(h)}
                          className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(h.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {Math.min((page-1)*perPage+1,heads.length)}–{Math.min(page*perPage,heads.length)} of {heads.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({length: totalPages}, (_,i)=>i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${p===page ? "bg-blue-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <CRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Add/Edit/View Modal ─────────────────────────────────────────── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Transaction Head
                </h3>
                <button onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Transaction Head Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} disabled={mode === "view"}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inp} />
                  {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Parent Head</label>
                  <select value={form.parent} disabled={mode === "view"}
                    onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className={selCls}>
                    <option value="">No Parent</option>
                    {heads.filter(h => h.id !== form.id).map(h => <option key={h.id} value={h.title}>{h.title}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Has Child</label>
                    <select value={form.hasChild} disabled={mode === "view"}
                      onChange={e => setForm(f => ({ ...f, hasChild: e.target.value }))} className={selCls}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Head Type</label>
                    <select value={form.headType} disabled={mode === "view"}
                      onChange={e => setForm(f => ({ ...f, headType: e.target.value }))} className={selCls}>
                      <option value="Student">Student</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ordering <span className="text-red-500">*</span></label>
                  <input type="number" value={form.ordering} disabled={mode === "view"} min={1}
                    onChange={e => setForm(f => ({ ...f, ordering: e.target.value }))} className={inp} />
                  {errors.ordering && <p className="text-xs text-red-500">{errors.ordering}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <X size={14} /> {mode === "view" ? "Close" : "Cancel"}
                </button>
                {mode !== "view" && (
                  <button onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <Save size={14} /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm ───────────────────────────────────────────────── */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">Delete Transaction Head?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-5">
                "<span className="font-medium text-gray-700 dark:text-gray-200">{heads.find(h => h.id === deleteId)?.title}</span>" will be permanently removed.
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