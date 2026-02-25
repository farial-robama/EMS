import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import {
  ChevronRight, Plus, Check, Trash2, X, FileText, User,
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

const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

const COPY_COLORS = [
  { bg: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800",    header: "bg-blue-100 dark:bg-blue-800/50",   ic: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" },
  { bg: "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800", header: "bg-green-100 dark:bg-green-800/50", ic: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300" },
  { bg: "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800", header: "bg-purple-100 dark:bg-purple-800/50", ic: "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300" },
  { bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800",  header: "bg-amber-100 dark:bg-amber-800/50",  ic: "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300" },
];

const DEFAULT_SIGNATORIES = ["Student's Sign", "Office's Sign", "Bank's Sign"];

export default function InvoiceConfiguration() {
  const [configs, setConfigs] = useState([
    { id: 1, copyName: "Student Copy", description: "", notes: "", signatories: [...DEFAULT_SIGNATORIES] },
    { id: 2, copyName: "Bank Copy",    description: "", notes: "", signatories: [...DEFAULT_SIGNATORIES] },
    { id: 3, copyName: "Office Copy",  description: "", notes: "", signatories: [...DEFAULT_SIGNATORIES] },
    { id: 4, copyName: "Dept. Copy",   description: "", notes: "", signatories: [...DEFAULT_SIGNATORIES] },
  ]);
  const [saved,   setSaved]   = useState(false);
  const [nextId,  setNextId]  = useState(5);

  const update = (id, field, value) =>
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const addSignatory = (id) =>
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, signatories: [...c.signatories, ""] } : c));

  const removeSignatory = (id, idx) =>
    setConfigs(prev => prev.map(c => c.id === id
      ? { ...c, signatories: c.signatories.filter((_, i) => i !== idx) } : c));

  const updateSignatory = (id, idx, value) =>
    setConfigs(prev => prev.map(c => c.id === id
      ? { ...c, signatories: c.signatories.map((s, i) => i === idx ? value : s) } : c));

  const addCopy = () => {
    setConfigs(prev => [...prev, { id: nextId, copyName: "", description: "", notes: "", signatories: [...DEFAULT_SIGNATORIES] }]);
    setNextId(n => n + 1);
  };

  const removeCopy = (id) => setConfigs(prev => prev.filter(c => c.id !== id));

  const handleSave = () => {
    console.log("Saved Invoice Configurations:", configs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "Accounts", "Invoice Configuration"]} />
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={addCopy}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Plus size={14} /> Add More Copy
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Check size={15} /> Save All
            </button>
          </div>
        </div>

        {/* ── Toast ──────────────────────────────────────────────────────── */}
        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Invoice configurations saved successfully!
          </div>
        )}

        {/* ── Info strip ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <FileText size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Account Invoice Configs</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium ml-auto">
              {configs.length} copies
            </span>
          </div>
          <div className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
            Configure each invoice copy with its name, description, footer notes, and the list of authorised signatories.
          </div>
        </div>

        {/* ── Invoice Copy Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {configs.map((config, ci) => {
            const theme = COPY_COLORS[ci % COPY_COLORS.length];
            return (
              <div key={config.id}
                className={`rounded-2xl border shadow-sm overflow-hidden ${theme.bg}`}>
                {/* Card header */}
                <div className={`flex items-center justify-between px-5 py-4 border-b border-inherit ${theme.header}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${theme.ic}`}>
                      <FileText size={14} />
                    </div>
                    <input
                      type="text"
                      value={config.copyName}
                      onChange={e => update(config.id, "copyName", e.target.value)}
                      placeholder="Invoice Copy Name"
                      className="text-sm font-semibold bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 w-40" />
                  </div>
                  {configs.length > 1 && (
                    <button onClick={() => removeCopy(config.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Description + Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</label>
                      <input
                        type="text"
                        value={config.description}
                        onChange={e => update(config.id, "description", e.target.value)}
                        placeholder="Invoice description"
                        className={inp} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Footer Notes</label>
                      <input
                        type="text"
                        value={config.notes}
                        onChange={e => update(config.id, "notes", e.target.value)}
                        placeholder="Notes shown at bottom"
                        className={inp} />
                    </div>
                  </div>

                  {/* Signatories */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Signatories</label>
                      <button onClick={() => addSignatory(config.id)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {config.signatories.map((sign, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                            <User size={11} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={sign}
                            onChange={e => updateSignatory(config.id, idx, e.target.value)}
                            placeholder="Signatory name / role"
                            className={inp} />
                          <button onClick={() => removeSignatory(config.id, idx)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {config.signatories.length === 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">No signatories added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Preview strip */}
                  {config.signatories.length > 0 && (
                    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Invoice Footer Preview</p>
                      <div className="flex flex-wrap gap-4">
                        {config.signatories.map((sign, idx) => (
                          <div key={idx} className="text-center min-w-[80px]">
                            <div className="border-b border-gray-300 dark:border-gray-500 mb-1 pb-4 w-20" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sign || "—"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom save ─────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pb-6">
          <button onClick={addCopy}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Plus size={14} /> Add More Copy
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
            <Check size={15} /> Save Configurations
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}