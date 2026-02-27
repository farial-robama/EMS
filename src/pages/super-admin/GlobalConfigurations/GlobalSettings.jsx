import React, { useState } from "react";
import {
  Settings, ChevronRight, Save, Check, AlertCircle, Globe,
  Building2, Phone, Mail, MapPin, Upload, Clock, Bell,
  Shield, Palette, BookOpen, Users, DollarSign, Printer,
  X, Info, ToggleLeft, ToggleRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Helpers ─── */
const inp = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30";
const textarea = `${inp} resize-none`;

function F({ label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && (
          <span title={hint} className="cursor-help text-gray-300 dark:text-gray-600 hover:text-blue-400 transition-colors">
            <Info size={11} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div onClick={onChange}
        className={`relative mt-0.5 w-10 flex-shrink-0 rounded-full transition-colors duration-200 cursor-pointer ${checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`}
        style={{ height: "22px" }}>
        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
        {desc && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>}
      </div>
    </label>
  );
}

function SectionCard({ icon, title, color = "blue", children }) {
  const colors = {
    blue:   "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400",
    green:  "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400",
    amber:  "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400",
    rose:   "bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
    indigo: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${colors[color]}`}>
        <span className={colors[color].split(" ").pop()}>{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

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

/* ─── Initial Settings State ─── */
const INITIAL = {
  // Institution
  instituteName:   "BAF Shaheen College Bogura",
  instituteCode:   "BAFSCB-2025",
  email:           "info@bafshaheen.edu.bd",
  phone:           "+880-51-123456",
  mobile:          "017XXXXXXXX",
  fax:             "",
  address:         "Bogura Cantonment, Bogura – 5800, Bangladesh",
  website:         "https://www.bafshaheen.edu.bd",
  logoUrl:         "",
  signatureUrl:    "",

  // Academic
  currentSession:  "2025-2026",
  currentYear:     "2025",
  gradingSystem:   "GPA-5",
  passMark:        33,
  attendanceMin:   75,
  classStartTime:  "08:00",
  classEndTime:    "14:00",
  workingDays:     "Sun-Thu",

  // Notifications
  smsEnabled:       true,
  emailEnabled:     false,
  absentNotify:     true,
  feeReminder:      true,
  examNotify:       true,
  resultNotify:     true,
  smsProvider:      "SSL Wireless",
  smsApiKey:        "",

  // Financial
  currency:        "BDT",
  currencySymbol:  "৳",
  taxEnabled:      false,
  taxRate:         0,
  lateFeeEnabled:  true,
  lateFeeAmount:   50,
  fiscalYear:      "July–June",

  // Security
  sessionTimeout:  30,
  twoFactorAdmin:  false,
  loginAttempts:   5,
  passwordMinLen:  8,
  passwordExpiry:  90,

  // Appearance
  theme:           "light",
  primaryColor:    "#3B82F6",
  dateFormat:      "DD-MM-YYYY",
  timeFormat:      "12h",
  language:        "English",
  timezone:        "Asia/Dhaka",

  // Print
  printHeader:     true,
  printFooter:     true,
  printWatermark:  false,
  footerText:      "BAF Shaheen College Bogura — Excellence in Education",
};

export default function GlobalSettings() {
  const [settings,  setSettings]  = useState(INITIAL);
  const [activeTab, setActiveTab] = useState("institution");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [logoFile,  setLogoFile]  = useState(null);
  const [errors,    setErrors]    = useState({});

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));
  const tog = (k)    => setSettings(p => ({ ...p, [k]: !p[k] }));

  const validate = () => {
    const e = {};
    if (!settings.instituteName.trim()) e.instituteName = "Required";
    if (!settings.email.trim() || !settings.email.includes("@")) e.email = "Valid email required";
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const TABS = [
    { id:"institution", label:"Institution",   icon:<Building2 size={14} />,  color:"blue"   },
    { id:"academic",    label:"Academic",       icon:<BookOpen size={14} />,   color:"green"  },
    { id:"notification",label:"Notifications", icon:<Bell size={14} />,       color:"amber"  },
    { id:"financial",   label:"Financial",      icon:<DollarSign size={14} />, color:"purple" },
    { id:"security",    label:"Security",       icon:<Shield size={14} />,     color:"rose"   },
    { id:"appearance",  label:"Appearance",     icon:<Palette size={14} />,    color:"indigo" },
    { id:"print",       label:"Print / PDF",    icon:<Printer size={14} />,    color:"green"  },
  ];

  const tabColor = TABS.find(t => t.id === activeTab)?.color || "blue";

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={["Dashboard","Administration","Global Settings"]} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings size={22} className="text-blue-500" /> Global Settings
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Manage institution-wide configuration and preferences</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm flex-shrink-0
              ${saved ? "bg-green-600 shadow-green-200" : saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}>
            {saving  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
            : saved   ? <><Check size={15} />Saved!</>
            : <><Save size={15} />Save Changes</>}
          </button>
        </div>

        {/* Saved banner */}
        {saved && (
          <div className="flex items-center gap-3 p-3.5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
            <Check size={15} className="text-green-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">Settings saved successfully. Changes are now live.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* ── Tab sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden sticky top-4">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Settings Sections</p>
              </div>
              <div className="p-2 space-y-0.5">
                {TABS.map((t) => {
                  const colors = {
                    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                    green:  "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40",
                    amber:  "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
                    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                    rose:   "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40",
                    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40",
                  };
                  const isActive = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left border
                        ${isActive ? colors[t.color] : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"}`}>
                      <span className={isActive ? "" : "opacity-60"}>{t.icon}</span>
                      {t.label}
                      {isActive && <ChevronRight size={13} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Settings panels ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* INSTITUTION */}
            {activeTab === "institution" && (
              <>
                <SectionCard icon={<Building2 size={15} />} title="Institution Information" color="blue">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <F label="Institution Name" required>
                        <input type="text" value={settings.instituteName} onChange={e => set("instituteName", e.target.value)}
                          className={errors.instituteName ? `${inp} border-red-400` : inp} />
                        {errors.instituteName && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle size={11} />{errors.instituteName}</p>}
                      </F>
                    </div>
                    <F label="Institution Code">
                      <input type="text" value={settings.instituteCode} onChange={e => set("instituteCode", e.target.value)} className={inp} />
                    </F>
                    <F label="Official Website">
                      <input type="url" value={settings.website} onChange={e => set("website", e.target.value)} placeholder="https://…" className={inp} />
                    </F>
                    <F label="Email Address" required>
                      <input type="email" value={settings.email} onChange={e => set("email", e.target.value)}
                        className={errors.email ? `${inp} border-red-400` : inp} />
                      {errors.email && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle size={11} />{errors.email}</p>}
                    </F>
                    <F label="Phone Number">
                      <input type="tel" value={settings.phone} onChange={e => set("phone", e.target.value)} className={inp} />
                    </F>
                    <F label="Mobile Number">
                      <input type="tel" value={settings.mobile} onChange={e => set("mobile", e.target.value)} className={inp} />
                    </F>
                    <F label="Fax Number">
                      <input type="tel" value={settings.fax} onChange={e => set("fax", e.target.value)} placeholder="Optional" className={inp} />
                    </F>
                    <div className="sm:col-span-2">
                      <F label="Full Address">
                        <textarea rows={2} value={settings.address} onChange={e => set("address", e.target.value)} className={textarea} />
                      </F>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon={<Upload size={15} />} title="Logo & Signature" color="blue">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[["Institution Logo","logoFile","PNG or JPG, max 2 MB, ideal 200×200"],["Principal's Signature","sigFile","PNG with transparent bg, max 500 KB"]].map(([label, key, hint]) => (
                      <div key={key}>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">{label}</p>
                        <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700/30 cursor-pointer transition-all">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Upload size={16} className="text-blue-500" />
                          </div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Click to upload</p>
                          <p className="text-[10px] text-gray-400 text-center">{hint}</p>
                          <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files[0])} />
                        </label>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ACADEMIC */}
            {activeTab === "academic" && (
              <SectionCard icon={<BookOpen size={15} />} title="Academic Configuration" color="green">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F label="Current Academic Session" hint="e.g. 2025-2026">
                    <input type="text" value={settings.currentSession} onChange={e => set("currentSession", e.target.value)} className={inp} />
                  </F>
                  <F label="Current Year">
                    <input type="text" value={settings.currentYear} onChange={e => set("currentYear", e.target.value)} className={inp} />
                  </F>
                  <F label="Grading System">
                    <select value={settings.gradingSystem} onChange={e => set("gradingSystem", e.target.value)} className={inp}>
                      {["GPA-5","GPA-4","Percentage","Letter Grade"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Working Days">
                    <select value={settings.workingDays} onChange={e => set("workingDays", e.target.value)} className={inp}>
                      {["Sun-Thu","Sat-Wed","Mon-Fri","Sat-Thu"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Minimum Pass Mark" hint="Marks required to pass any subject">
                    <input type="number" min={0} max={100} value={settings.passMark} onChange={e => set("passMark", +e.target.value)} className={inp} />
                  </F>
                  <F label="Minimum Attendance (%)" hint="Students below this % are barred from exams">
                    <input type="number" min={0} max={100} value={settings.attendanceMin} onChange={e => set("attendanceMin", +e.target.value)} className={inp} />
                  </F>
                  <F label="Class Start Time">
                    <input type="time" value={settings.classStartTime} onChange={e => set("classStartTime", e.target.value)} className={inp} />
                  </F>
                  <F label="Class End Time">
                    <input type="time" value={settings.classEndTime} onChange={e => set("classEndTime", e.target.value)} className={inp} />
                  </F>
                </div>
              </SectionCard>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notification" && (
              <>
                <SectionCard icon={<Bell size={15} />} title="Notification Channels" color="amber">
                  <div className="space-y-5">
                    <Toggle checked={settings.smsEnabled}   onChange={() => tog("smsEnabled")}   label="SMS Notifications"   desc="Send automated SMS to students, parents, and staff" />
                    <Toggle checked={settings.emailEnabled} onChange={() => tog("emailEnabled")} label="Email Notifications" desc="Send automated emails to registered email addresses" />
                  </div>
                </SectionCard>

                <SectionCard icon={<Bell size={15} />} title="Notification Triggers" color="amber">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Toggle checked={settings.absentNotify} onChange={() => tog("absentNotify")} label="Absence Alert"    desc="Notify guardians when a student is absent" />
                    <Toggle checked={settings.feeReminder}  onChange={() => tog("feeReminder")}  label="Fee Reminder"    desc="Send reminders before fee due dates" />
                    <Toggle checked={settings.examNotify}   onChange={() => tog("examNotify")}   label="Exam Schedule"   desc="Notify students about upcoming exams" />
                    <Toggle checked={settings.resultNotify} onChange={() => tog("resultNotify")} label="Result Published" desc="Notify when exam results are published" />
                  </div>
                </SectionCard>

                {settings.smsEnabled && (
                  <SectionCard icon={<Phone size={15} />} title="SMS Provider Configuration" color="amber">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <F label="SMS Provider">
                        <select value={settings.smsProvider} onChange={e => set("smsProvider", e.target.value)} className={inp}>
                          {["SSL Wireless","Infobip","Twilio","BulkSMSBD","Robi Axiata"].map(v => <option key={v}>{v}</option>)}
                        </select>
                      </F>
                      <F label="API Key" hint="Keep this secret">
                        <input type="password" value={settings.smsApiKey} onChange={e => set("smsApiKey", e.target.value)} placeholder="Enter API key…" className={inp} />
                      </F>
                    </div>
                  </SectionCard>
                )}
              </>
            )}

            {/* FINANCIAL */}
            {activeTab === "financial" && (
              <SectionCard icon={<DollarSign size={15} />} title="Financial Settings" color="purple">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F label="Currency">
                    <select value={settings.currency} onChange={e => set("currency", e.target.value)} className={inp}>
                      {["BDT","USD","EUR","GBP","INR"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Currency Symbol">
                    <input type="text" value={settings.currencySymbol} onChange={e => set("currencySymbol", e.target.value)} className={inp} maxLength={4} />
                  </F>
                  <F label="Fiscal Year">
                    <select value={settings.fiscalYear} onChange={e => set("fiscalYear", e.target.value)} className={inp}>
                      {["July–June","January–December","April–March"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
                    <Toggle checked={settings.taxEnabled} onChange={() => tog("taxEnabled")} label="Enable Tax/VAT" desc="Apply tax on applicable fee transactions" />
                    {settings.taxEnabled && (
                      <F label="Tax Rate (%)">
                        <input type="number" min={0} max={100} value={settings.taxRate} onChange={e => set("taxRate", +e.target.value)} className={`${inp} max-w-[160px]`} />
                      </F>
                    )}
                    <Toggle checked={settings.lateFeeEnabled} onChange={() => tog("lateFeeEnabled")} label="Enable Late Fee" desc="Charge extra for overdue payments" />
                    {settings.lateFeeEnabled && (
                      <F label={`Late Fee Amount (${settings.currencySymbol})`}>
                        <input type="number" min={0} value={settings.lateFeeAmount} onChange={e => set("lateFeeAmount", +e.target.value)} className={`${inp} max-w-[160px]`} />
                      </F>
                    )}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <SectionCard icon={<Shield size={15} />} title="Security & Access" color="rose">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F label="Session Timeout (minutes)" hint="Auto-logout after inactivity">
                    <input type="number" min={5} max={480} value={settings.sessionTimeout} onChange={e => set("sessionTimeout", +e.target.value)} className={inp} />
                  </F>
                  <F label="Max Login Attempts" hint="Account locked after this many failures">
                    <input type="number" min={3} max={20} value={settings.loginAttempts} onChange={e => set("loginAttempts", +e.target.value)} className={inp} />
                  </F>
                  <F label="Min Password Length">
                    <input type="number" min={6} max={32} value={settings.passwordMinLen} onChange={e => set("passwordMinLen", +e.target.value)} className={inp} />
                  </F>
                  <F label="Password Expiry (days)" hint="Force password change after this many days">
                    <input type="number" min={0} max={365} value={settings.passwordExpiry} onChange={e => set("passwordExpiry", +e.target.value)} className={inp} />
                  </F>
                  <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <Toggle checked={settings.twoFactorAdmin} onChange={() => tog("twoFactorAdmin")} label="Two-Factor Authentication for Admins"
                      desc="Require 2FA for all administrator accounts (recommended)" />
                  </div>
                </div>
                <div className="mt-5 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={15} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-700 dark:text-rose-400">
                      <p className="font-semibold mb-0.5">Security Reminder</p>
                      <p>Changing security settings takes effect immediately. Ensure all admins are aware before modifying session timeout or 2FA requirements.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* APPEARANCE */}
            {activeTab === "appearance" && (
              <SectionCard icon={<Palette size={15} />} title="Display & Localization" color="indigo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F label="Date Format">
                    <select value={settings.dateFormat} onChange={e => set("dateFormat", e.target.value)} className={inp}>
                      {["DD-MM-YYYY","MM/DD/YYYY","YYYY-MM-DD","DD Month YYYY"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Time Format">
                    <select value={settings.timeFormat} onChange={e => set("timeFormat", e.target.value)} className={inp}>
                      {["12h","24h"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Interface Language">
                    <select value={settings.language} onChange={e => set("language", e.target.value)} className={inp}>
                      {["English","Bangla","Arabic"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <F label="Timezone">
                    <select value={settings.timezone} onChange={e => set("timezone", e.target.value)} className={inp}>
                      {["Asia/Dhaka","Asia/Kolkata","UTC","Asia/Karachi","Asia/Dubai"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </F>
                  <div className="sm:col-span-2">
                    <F label="Default Theme">
                      <div className="flex gap-3 mt-1">
                        {[["light","Light","bg-white border-gray-300 text-gray-700"],["dark","Dark","bg-gray-800 border-gray-600 text-white"],["system","System","bg-gradient-to-r from-white to-gray-800 border-gray-400 text-gray-600"]].map(([v, label, cls]) => (
                          <button key={v} onClick={() => set("theme", v)}
                            className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${settings.theme===v ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50" : "border-gray-200 dark:border-gray-600"} ${cls}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </F>
                  </div>
                  <F label="Primary Accent Color">
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings.primaryColor} onChange={e => set("primaryColor", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer bg-transparent" />
                      <input type="text" value={settings.primaryColor} onChange={e => set("primaryColor", e.target.value)}
                        className={`${inp} font-mono`} maxLength={7} />
                    </div>
                  </F>
                </div>
              </SectionCard>
            )}

            {/* PRINT */}
            {activeTab === "print" && (
              <SectionCard icon={<Printer size={15} />} title="Print & PDF Options" color="green">
                <div className="space-y-5">
                  <Toggle checked={settings.printHeader}    onChange={() => tog("printHeader")}    label="Include Header in Prints"    desc="Show institution name, logo, and contact on printed documents" />
                  <Toggle checked={settings.printFooter}    onChange={() => tog("printFooter")}    label="Include Footer in Prints"    desc="Show footer text and page numbers on printed documents" />
                  <Toggle checked={settings.printWatermark} onChange={() => tog("printWatermark")} label="Add Watermark to PDFs"       desc="Display a faint 'OFFICIAL' watermark on generated PDFs" />
                  {settings.printFooter && (
                    <div className="pl-14 border-t border-gray-100 dark:border-gray-700 pt-4">
                      <F label="Custom Footer Text">
                        <input type="text" value={settings.footerText} onChange={e => set("footerText", e.target.value)}
                          placeholder="e.g. Institution name — tagline" className={inp} />
                      </F>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Bottom Save */}
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm
                  ${saved ? "bg-green-600 shadow-green-200" : saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}>
                {saving  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                : saved   ? <><Check size={15} />Saved!</>
                : <><Save size={15} />Save Changes</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}