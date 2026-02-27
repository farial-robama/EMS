import React, { useState, useEffect } from "react";
import {
  ChevronRight, Trash2, RefreshCw, CheckCircle2, AlertTriangle,
  Database, Image, FileText, Code, BarChart2, Clock,
  AlertCircle, Info, Zap, Server, HardDrive, Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

/* ─── Cache types ─── */
const CACHE_TYPES = [
  {
    id:    "application",
    label: "Application Cache",
    desc:  "Framework-level cache including route cache, config cache, and bootstrapped data",
    icon:  <Code size={18} />,
    size:  "4.2 MB",
    items: 1240,
    color: "blue",
    risk:  "low",
    lastCleared: "3 days ago",
  },
  {
    id:    "database",
    label: "Database Query Cache",
    desc:  "Cached query results for frequently accessed data such as student lists, class info",
    icon:  <Database size={18} />,
    size:  "11.8 MB",
    items: 3876,
    color: "purple",
    risk:  "low",
    lastCleared: "1 day ago",
  },
  {
    id:    "images",
    label: "Image & Media Cache",
    desc:  "Resized and optimized copies of student photos, logos, and uploaded media",
    icon:  <Image size={18} />,
    size:  "28.4 MB",
    items: 512,
    color: "green",
    risk:  "low",
    lastCleared: "7 days ago",
  },
  {
    id:    "reports",
    label: "Report & PDF Cache",
    desc:  "Pre-generated reports, mark sheets, admit cards, and other downloadable PDFs",
    icon:  <FileText size={18} />,
    size:  "18.1 MB",
    items: 234,
    color: "amber",
    risk:  "medium",
    lastCleared: "5 days ago",
  },
  {
    id:    "sessions",
    label: "Session Data",
    desc:  "Active user session files — clearing this will log out all users immediately",
    icon:  <Clock size={18} />,
    size:  "1.3 MB",
    items: 47,
    color: "rose",
    risk:  "high",
    lastCleared: "12 hours ago",
  },
  {
    id:    "analytics",
    label: "Analytics Cache",
    desc:  "Precomputed dashboard stats, attendance summaries, and fee collection data",
    icon:  <BarChart2 size={18} />,
    size:  "6.7 MB",
    items: 890,
    color: "indigo",
    risk:  "low",
    lastCleared: "2 hours ago",
  },
];

const COLOR_MAP = {
  blue:   { icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",     border: "border-blue-200 dark:border-blue-900/40",  badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"   },
  purple: { icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-900/40", badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  green:  { icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",   border: "border-green-200 dark:border-green-900/40",  badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"  },
  amber:  { icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",   border: "border-amber-200 dark:border-amber-900/40",  badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"  },
  rose:   { icon: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",       border: "border-rose-200 dark:border-rose-900/40",    badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"    },
  indigo: { icon: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-900/40", badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" },
};

const RISK_BADGE = {
  low:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  high:   "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
};

export default function ClearCache() {
  const [selected,    setSelected]    = useState([]);
  const [clearing,    setClearing]    = useState({}); // { [id]: true }
  const [cleared,     setCleared]     = useState({}); // { [id]: true }
  const [clearingAll, setClearingAll] = useState(false);
  const [clearedAll,  setClearedAll]  = useState(false);
  const [confirmId,   setConfirmId]   = useState(null); // id to confirm, or "all"
  const [caches,      setCaches]      = useState(CACHE_TYPES);
  const [log,         setLog]         = useState([]);

  /* ── total cache size ── */
  const totalSize = caches
    .filter(c => !cleared[c.id])
    .reduce((sum, c) => sum + parseFloat(c.size), 0)
    .toFixed(1);

  const totalItems = caches
    .filter(c => !cleared[c.id])
    .reduce((sum, c) => sum + c.items, 0);

  const addLog = (msg) => setLog(p => [{ time: new Date().toLocaleTimeString(), msg }, ...p.slice(0, 19)]);

  /* ── Clear single ── */
  const clearSingle = async (id) => {
    setConfirmId(null);
    setClearing(p => ({ ...p, [id]: true }));
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setClearing(p => ({ ...p, [id]: false }));
    setCleared(p => ({ ...p, [id]: true }));
    const ct = caches.find(c => c.id === id);
    addLog(`✓ Cleared "${ct?.label}" — freed ${ct?.size}`);
    setCaches(p => p.map(c => c.id === id ? { ...c, size: "0 KB", items: 0, lastCleared: "just now" } : c));
  };

  /* ── Clear all ── */
  const clearAll = async () => {
    setConfirmId(null);
    setClearingAll(true);
    const toProcess = caches.filter(c => !cleared[c.id]);
    for (const ct of toProcess) {
      setClearing(p => ({ ...p, [ct.id]: true }));
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
      setClearing(p => ({ ...p, [ct.id]: false }));
      setCleared(p => ({ ...p, [ct.id]: true }));
      setCaches(p => p.map(c => c.id === ct.id ? { ...c, size: "0 KB", items: 0, lastCleared: "just now" } : c));
      addLog(`✓ Cleared "${ct.label}" — freed ${ct.size}`);
    }
    setClearingAll(false);
    setClearedAll(true);
    addLog("🎉 All caches cleared successfully");
    setTimeout(() => setClearedAll(false), 6000);
  };

  /* ── Reset (dev helper) ── */
  const resetAll = () => {
    setCaches(CACHE_TYPES);
    setCleared({});
    setSelected([]);
    setLog([]);
    setClearedAll(false);
  };

  const toggleSelect = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const allCleaned = caches.every(c => cleared[c.id]);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Administration","Clear Cache"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Trash2 size={22} className="text-orange-500" /> Clear Cache
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Free up storage, fix stale data, and improve system performance</p>
          </div>
          <button
            onClick={() => setConfirmId("all")}
            disabled={clearingAll || allCleaned}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm flex-shrink-0
              ${clearedAll  ? "bg-green-600 shadow-green-200"
              : allCleaned  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : clearingAll ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"}`}>
            {clearingAll  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Clearing…</>
            : clearedAll  ? <><CheckCircle2 size={15} />All Cleared!</>
            : allCleaned  ? <><CheckCircle2 size={15} />All Clean</>
            : <><Trash2 size={15} />Clear All Caches</>}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Cache Types",    value:CACHE_TYPES.length,             cls:"bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",    val:"text-blue-700 dark:text-blue-400"    },
            { label:"Total Size",     value:`${totalSize} MB`,              cls:"bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",val:"text-orange-600 dark:text-orange-400"},
            { label:"Cached Items",   value:totalItems.toLocaleString(),    cls:"bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",val:"text-purple-700 dark:text-purple-400"},
            { label:"Already Cleared",value:Object.keys(cleared).length,    cls:"bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",  val:"text-green-700 dark:text-green-400"  },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}>
              <div className={`text-2xl font-bold leading-none ${s.val}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* All-cleared banner */}
        {allCleaned && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">All caches have been cleared!</p>
              <p className="text-xs text-green-600 dark:text-green-500">System is running clean. You can now restore demo data below.</p>
            </div>
            <button onClick={resetAll} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors flex-shrink-0">
              <RefreshCw size={11} /> Reset Demo
            </button>
          </div>
        )}

        {/* Warning notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <p className="font-semibold mb-0.5">Before clearing cache</p>
            <p>Clearing caches may temporarily slow down the system as data is re-cached. <strong>Session cache</strong> will immediately log out all active users. Use during low-traffic hours when possible.</p>
          </div>
        </div>

        {/* Cache cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {caches.map((ct) => {
            const c      = COLOR_MAP[ct.color];
            const isDone = cleared[ct.id];
            const isBusy = clearing[ct.id];

            return (
              <div key={ct.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-sm transition-all overflow-hidden
                  ${isDone ? "border-green-300 dark:border-green-700 opacity-75" : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`}`}>

                {/* Progress overlay */}
                {isBusy && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                    <span className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth:"3px" }} />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Clearing…</p>
                  </div>
                )}

                {/* Cleared badge */}
                {isDone && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg border border-green-200 dark:border-green-900/40">
                      <CheckCircle2 size={11} /> Cleared
                    </span>
                  </div>
                )}

                <div className="p-5">
                  {/* Icon + labels */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                      {ct.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{ct.label}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${RISK_BADGE[ct.risk]}`}>{ct.risk} risk</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">·  {ct.lastCleared}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{ct.desc}</p>

                  {/* Stats */}
                  <div className="flex gap-3 mb-4">
                    <div className={`flex-1 text-center py-2 rounded-lg ${c.badge}`}>
                      <p className="text-base font-bold leading-none">{ct.size}</p>
                      <p className="text-[10px] mt-0.5 opacity-70">Size</p>
                    </div>
                    <div className={`flex-1 text-center py-2 rounded-lg ${c.badge}`}>
                      <p className="text-base font-bold leading-none">{ct.items.toLocaleString()}</p>
                      <p className="text-[10px] mt-0.5 opacity-70">Items</p>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => ct.risk === "high" ? setConfirmId(ct.id) : clearSingle(ct.id)}
                    disabled={isBusy || isDone}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all
                      ${isDone
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : ct.risk === "high"
                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-200"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200"
                      } disabled:opacity-50`}>
                    {isDone
                      ? <><CheckCircle2 size={14} />Cache Cleared</>
                      : <><Trash2 size={14} />Clear {ct.risk === "high" ? "(Requires Confirmation)" : "Cache"}</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* System info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
            <Server size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">System Storage</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label:"Total Cache Size",  value:`${CACHE_TYPES.reduce((s,c)=>s+parseFloat(c.size),0).toFixed(1)} MB`, icon:<HardDrive size={16} />, color:"text-orange-500", bar:32 },
              { label:"Disk Used",         value:"2.3 GB / 20 GB",  icon:<Database size={16} />,   color:"text-blue-500",   bar:12 },
              { label:"System Uptime",     value:"14 days, 6 hrs",  icon:<Zap size={16} />,         color:"text-green-500",  bar:null },
            ].map(s => (
              <div key={s.label} className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 ${s.color}`}>{s.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{s.value}</p>
                  {s.bar !== null && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color.replace("text-","bg-")}`} style={{ width:`${s.bar}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        {log.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Activity Log</span>
              </div>
              <button onClick={() => setLog([])} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Clear log</button>
            </div>
            <div className="p-4 space-y-1.5 max-h-48 overflow-y-auto font-mono">
              {log.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">{entry.time}</span>
                  <span className="text-gray-700 dark:text-gray-300">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Confirm Modal ── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-rose-500" />
            </div>
            {confirmId === "all" ? (
              <>
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Clear All Caches?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">This will clear all {CACHE_TYPES.length} cache types including session data.</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-5">⚠ All logged-in users will be signed out immediately.</p>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Clear Session Cache?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">This will immediately log out all {caches.find(c=>c.id===confirmId)?.items || 0} active user sessions.</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-5">⚠ Users will need to log in again.</p>
              </>
            )}
            <div className="flex gap-2">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={() => confirmId === "all" ? clearAll() : clearSingle(confirmId)}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-sm shadow-rose-200">
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}