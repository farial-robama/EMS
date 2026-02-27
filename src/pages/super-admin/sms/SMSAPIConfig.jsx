import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronRight, Plus, Eye, Edit2, Trash2, X, Check, Wifi, Globe } from "lucide-react";

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
  ${err ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"}`;
const selCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

let nextId = 7;

const INITIAL_APIS = [
  { id: 1, url: "https://bangladeshsms.com/smsapimany", apiType: "Many to Many", gateway: "Bangladesh SMS", balanceUrl: "",                              status: "Inactive", params: [{ key: "api_key", value: "xxx" }] },
  { id: 2, url: "https://bangladeshsms.com/smsapi",     apiType: "One to Many",  gateway: "Bangladesh SMS", balanceUrl: "",                              status: "Inactive", params: [{ key: "user", value: "demo" }, { key: "password", value: "pass" }] },
  { id: 3, url: "http://sms4.pondit.com:7788/send",     apiType: "One to Many",  gateway: "Pondit",         balanceUrl: "",                              status: "Inactive", params: [] },
  { id: 4, url: "http://sms4.pondit.com:7788/send",     apiType: "Many to Many", gateway: "Pondit",         balanceUrl: "",                              status: "Inactive", params: [] },
  { id: 5, url: "https://sms.mram.com.bd/smsapimany",  apiType: "Many to Many", gateway: "Bangladesh SMS", balanceUrl: "https://sms.mram.com.bd/balance", status: "Active",   params: [{ key: "api_key", value: "live_key" }] },
  { id: 6, url: "https://sms.mram.com.bd/smsapi",      apiType: "One to Many",  gateway: "Bangladesh SMS", balanceUrl: "https://sms.mram.com.bd/balance", status: "Active",   params: [] },
];

const EMPTY_FORM = { url: "", apiType: "One to Many", gateway: "Bangladesh SMS", balanceUrl: "", status: "Active", params: [{ key: "", value: "" }] };
const GATEWAYS   = ["Bangladesh SMS", "Pondit", "SSL Wireless", "Infobip", "Twilio"];
const API_TYPES  = ["One to Many", "Many to Many"];

const F = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

export default function SmsApiConfig() {
  const [apis,     setApis]     = useState(INITIAL_APIS);
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const handleParamChange = (idx, field, value) => {
    const updated = [...form.params];
    updated[idx][field] = value;
    setForm(f => ({ ...f, params: updated }));
  };

  const validate = () => {
    const e = {};
    if (!form.url.trim()) e.url = "API URL is required";
    return e;
  };

  const openAdd = () => { setForm(EMPTY_FORM); setErrors({}); setModal("add"); };

  const openEdit = (api) => {
    setSelected(api);
    setForm({ url: api.url, apiType: api.apiType, gateway: api.gateway, balanceUrl: api.balanceUrl || "", status: api.status, params: api.params.length ? [...api.params.map(p => ({...p}))] : [{ key: "", value: "" }] });
    setErrors({}); setModal("edit");
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (modal === "add") {
      setApis(prev => [...prev, { ...form, id: nextId++ }]);
      showToast("SMS API added successfully.");
    } else {
      setApis(prev => prev.map(a => a.id === selected.id ? { ...form, id: selected.id } : a));
      showToast("SMS API updated successfully.");
    }
    setModal(null);
  };

  const handleDelete = () => {
    setApis(prev => prev.filter(a => a.id !== selected.id));
    setModal(null); showToast("SMS API deleted.");
  };

  const ApiForm = () => (
    <div className="space-y-4">
      <F label="API URL" required error={errors.url}>
        <input name="url" value={form.url} onChange={handleChange} placeholder="https://example.com/smsapi" className={inp(errors.url)} />
      </F>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="API Type">
          <select name="apiType" value={form.apiType} onChange={handleChange} className={selCls}>
            {API_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </F>
        <F label="Gateway Type">
          <select name="gateway" value={form.gateway} onChange={handleChange} className={selCls}>
            {GATEWAYS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </F>
      </div>
      <F label="Balance Checking URL">
        <input name="balanceUrl" value={form.balanceUrl} onChange={handleChange} placeholder="https://example.com/balance (optional)" className={inp(false)} />
      </F>
      <F label="Status">
        <select name="status" value={form.status} onChange={handleChange} className={selCls}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </F>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Parameters</label>
          <button type="button" onClick={() => setForm(f => ({ ...f, params: [...f.params, { key: "", value: "" }] }))}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.params.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={p.key}   onChange={e => handleParamChange(i, "key",   e.target.value)} placeholder="Parameter name" className={inp(false) + " flex-1"} />
              <input value={p.value} onChange={e => handleParamChange(i, "value", e.target.value)} placeholder="Value"          className={inp(false) + " flex-1"} />
              <button type="button" onClick={() => setForm(f => ({ ...f, params: f.params.filter((_, idx) => idx !== i) }))}
                className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
          {form.params.length === 0 && <p className="text-xs text-gray-400 dark:text-gray-500 italic">No parameters. Click "Add" to add one.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Breadcrumb items={["Dashboard", "SMS Setup", "API Configurations"]} />
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 flex-shrink-0">
            <Plus size={15} /> Add New SMS API
          </button>
        </div>

        {toast && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> {toast}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total APIs", val: apis.length,                                  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",    vc: "text-blue-700 dark:text-blue-400" },
            { label: "Active",     val: apis.filter(a => a.status === "Active").length,   color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800", vc: "text-green-700 dark:text-green-400" },
            { label: "Inactive",   val: apis.filter(a => a.status === "Inactive").length, color: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",     vc: "text-gray-500 dark:text-gray-400" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
              <p className={`text-2xl font-bold ${s.vc}`}>{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"><Wifi size={14} /></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">SMS API Configurations</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                  {["SL","API URL","API Type","Gateway","Params","Status","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apis.map((api, i) => (
                  <tr key={api.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300 max-w-[220px] truncate">{api.url}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{api.apiType}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{api.gateway}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">{api.params.length} params</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${api.status === "Active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{api.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setSelected(api); setModal("view"); }} className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye size={13} /></button>
                        <button onClick={() => openEdit(api)} className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => { setSelected(api); setModal("delete"); }} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(modal === "add" || modal === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${modal === "add" ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300"}`}>{modal === "add" ? <Plus size={14} /> : <Edit2 size={14} />}</div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{modal === "add" ? "Add New SMS API" : "Edit SMS API"}</h3>
                </div>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-5"><ApiForm /></div>
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {modal === "view" && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">API Details</h3>
                <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-5 space-y-3">
                {[{label:"URL",val:selected.url},{label:"API Type",val:selected.apiType},{label:"Gateway",val:selected.gateway},{label:"Balance URL",val:selected.balanceUrl||"—"},{label:"Status",val:selected.status}].map(r => (
                  <div key={r.label} className="flex gap-3 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-24 flex-shrink-0">{r.label}</span>
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-200 break-all">{r.val}</span>
                  </div>
                ))}
                {selected.params.length > 0 && (
                  <div className="pt-1">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Parameters</p>
                    <div className="rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {selected.params.map((p, i) => (
                        <div key={i} className="flex border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                          <span className="px-3 py-2 text-xs font-mono font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 w-1/2 border-r border-gray-100 dark:border-gray-700">{p.key}</span>
                          <span className="px-3 py-2 text-xs font-mono text-gray-500 dark:text-gray-400 w-1/2">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Close</button>
                <button onClick={() => openEdit(selected)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Edit</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal === "delete" && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">Delete SMS API?</h3>
              <p className="text-xs font-mono text-gray-400 text-center mb-4 break-all px-2">{selected.url}</p>
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