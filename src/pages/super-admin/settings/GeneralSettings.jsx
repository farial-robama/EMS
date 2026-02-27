// src/pages/settings/GeneralSettings.jsx
import React, { useState } from 'react';
import {
  ChevronRight, Save, RotateCcw, School, Phone,
  Globe, MapPin, Mail, Facebook, Youtube,
  Settings, Image, Calendar, Clock,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const Label = ({ children, required }) => (
  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={15} />
    </div>
    <div>
      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{title}</p>
      {description && <p className="text-xs text-blue-500 dark:text-blue-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

const INITIAL = {
  // School Info
  schoolName:     'Advance Model School & College',
  schoolCode:     'EIIN-130001',
  schoolType:     'Both (School & College)',
  establishedYear:'1992',
  motto:          'Knowledge is Power',
  // Academic
  currentSession: '2025',
  academicYear:   'January - December',
  weekStart:      'Sunday',
  workingDays:    '6',
  // Contact
  phone:          '+880 1711-000000',
  altPhone:       '+880 1811-000000',
  email:          'info@advanceschool.edu.bd',
  website:        'https://www.advanceschool.edu.bd',
  // Address
  address:        '123, School Road, Dhaka',
  thana:          'Dhanmondi',
  district:       'Dhaka',
  division:       'Dhaka',
  postCode:       '1205',
  // Social
  facebook:       'https://facebook.com/advanceschool',
  youtube:        '',
  // Logo / Banner
  logoUrl:        '',
  bannerUrl:      '',
};

const SCHOOL_TYPES = ['School Only', 'College Only', 'Both (School & College)', 'Madrasha', 'Technical'];
const SESSIONS     = ['2023', '2024', '2025', '2025-2026', '2026'];
const WEEK_STARTS  = ['Sunday', 'Monday', 'Saturday'];
const WORKING_DAYS = ['5', '6'];
const DIVISIONS    = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];

export default function GeneralSettings() {
  const [settings, setSettings] = useState(INITIAL);
  const [saved, setSaved]       = useState(false);
  const [errors, setErrors]     = useState({});
  const [activeTab, setActiveTab] = useState('school');

  const set = (key, val) => {
    setSettings(s => ({ ...s, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!settings.schoolName.trim())     e.schoolName     = 'School name is required';
    if (!settings.schoolCode.trim())     e.schoolCode     = 'School code is required';
    if (!settings.currentSession.trim()) e.currentSession = 'Session is required';
    if (!settings.phone.trim())          e.phone          = 'Phone is required';
    if (!settings.address.trim())        e.address        = 'Address is required';
    if (!settings.district.trim())       e.district       = 'District is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to last saved values?')) {
      setSettings(INITIAL);
      setErrors({});
    }
  };

  const TABS = [
    { id: 'school',   label: 'School Info',    icon: School   },
    { id: 'academic', label: 'Academic',        icon: Calendar },
    { id: 'contact',  label: 'Contact',         icon: Phone    },
    { id: 'address',  label: 'Address',         icon: MapPin   },
    { id: 'social',   label: 'Social & Media',  icon: Globe    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Settings', 'General Settings']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings size={22} className="text-blue-500" /> General Settings
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
              <Save size={14} /> {saved ? 'Saved ✓' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Save banner */}
        {saved && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">✓</span></div>
            Settings saved successfully!
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Tabs sidebar */}
          <div className="lg:w-52 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <tab.icon size={15} className="flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* ── School Info ── */}
            {activeTab === 'school' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <SectionHeader icon={School} title="School Information" description="Basic identity and institutional details" />
                <div className="p-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <Label required>School / Institution Name</Label>
                    <input value={settings.schoolName} onChange={e => set('schoolName', e.target.value)} className={`${inp} ${errors.schoolName ? 'border-red-400' : ''}`} placeholder="Full institution name" />
                    {errors.schoolName && <p className="text-xs text-red-500">{errors.schoolName}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label required>School Code / EIIN</Label>
                      <input value={settings.schoolCode} onChange={e => set('schoolCode', e.target.value)} className={`${inp} font-mono ${errors.schoolCode ? 'border-red-400' : ''}`} placeholder="EIIN-000000" />
                      {errors.schoolCode && <p className="text-xs text-red-500">{errors.schoolCode}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Institution Type</Label>
                      <select value={settings.schoolType} onChange={e => set('schoolType', e.target.value)} className={inp}>
                        {SCHOOL_TYPES.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Established Year</Label>
                      <input value={settings.establishedYear} onChange={e => set('establishedYear', e.target.value)} className={inp} placeholder="e.g. 1992" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>School Motto</Label>
                      <input value={settings.motto} onChange={e => set('motto', e.target.value)} className={inp} placeholder="e.g. Knowledge is Power" />
                    </div>
                  </div>
                  {/* Logo / Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="flex flex-col gap-1.5">
                      <Label>Logo URL</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                          <Image size={14} className="text-gray-400" />
                        </div>
                        <input value={settings.logoUrl} onChange={e => set('logoUrl', e.target.value)} className={inp} placeholder="https://…/logo.png" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Banner URL</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                          <Image size={14} className="text-gray-400" />
                        </div>
                        <input value={settings.bannerUrl} onChange={e => set('bannerUrl', e.target.value)} className={inp} placeholder="https://…/banner.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Academic ── */}
            {activeTab === 'academic' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <SectionHeader icon={Calendar} title="Academic Settings" description="Session, calendar and working schedule" />
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label required>Current Academic Session</Label>
                      <select value={settings.currentSession} onChange={e => set('currentSession', e.target.value)} className={`${inp} ${errors.currentSession ? 'border-red-400' : ''}`}>
                        {SESSIONS.map(v => <option key={v}>{v}</option>)}
                      </select>
                      {errors.currentSession && <p className="text-xs text-red-500">{errors.currentSession}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Academic Year Duration</Label>
                      <input value={settings.academicYear} onChange={e => set('academicYear', e.target.value)} className={inp} placeholder="e.g. January - December" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Week Starts On</Label>
                      <select value={settings.weekStart} onChange={e => set('weekStart', e.target.value)} className={inp}>
                        {WEEK_STARTS.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Working Days Per Week</Label>
                      <select value={settings.workingDays} onChange={e => set('workingDays', e.target.value)} className={inp}>
                        {WORKING_DAYS.map(v => <option key={v}>{v} days</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Info callout */}
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                    <Clock size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">Changing the current academic session will affect all new records. Existing records will not be changed.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Contact ── */}
            {activeTab === 'contact' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <SectionHeader icon={Phone} title="Contact Information" description="Phone, email and website details" />
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label required>Primary Phone</Label>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input value={settings.phone} onChange={e => set('phone', e.target.value)} className={`${inp} pl-8 ${errors.phone ? 'border-red-400' : ''}`} placeholder="+880 1711-000000" />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Alternative Phone</Label>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input value={settings.altPhone} onChange={e => set('altPhone', e.target.value)} className={`${inp} pl-8`} placeholder="+880 1811-000000" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="email" value={settings.email} onChange={e => set('email', e.target.value)} className={`${inp} pl-8`} placeholder="info@school.edu.bd" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Website URL</Label>
                      <div className="relative">
                        <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input value={settings.website} onChange={e => set('website', e.target.value)} className={`${inp} pl-8`} placeholder="https://www.school.edu.bd" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Address ── */}
            {activeTab === 'address' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <SectionHeader icon={MapPin} title="Address & Location" description="Physical address of the institution" />
                <div className="p-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <Label required>Street Address</Label>
                    <textarea rows={2} value={settings.address} onChange={e => set('address', e.target.value)} className={`${inp} resize-none ${errors.address ? 'border-red-400' : ''}`} placeholder="House / Road / Area" />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Thana / Upazila</Label>
                      <input value={settings.thana} onChange={e => set('thana', e.target.value)} className={inp} placeholder="e.g. Dhanmondi" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label required>District</Label>
                      <input value={settings.district} onChange={e => set('district', e.target.value)} className={`${inp} ${errors.district ? 'border-red-400' : ''}`} placeholder="e.g. Dhaka" />
                      {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Division</Label>
                      <select value={settings.division} onChange={e => set('division', e.target.value)} className={inp}>
                        {DIVISIONS.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Post Code</Label>
                      <input value={settings.postCode} onChange={e => set('postCode', e.target.value)} className={inp} placeholder="e.g. 1205" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Social ── */}
            {activeTab === 'social' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <SectionHeader icon={Globe} title="Social Media & Online Presence" description="Links to social platforms and online channels" />
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Facebook Page</Label>
                      <div className="relative">
                        <Facebook size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                        <input value={settings.facebook} onChange={e => set('facebook', e.target.value)} className={`${inp} pl-8`} placeholder="https://facebook.com/…" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>YouTube Channel</Label>
                      <div className="relative">
                        <Youtube size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" />
                        <input value={settings.youtube} onChange={e => set('youtube', e.target.value)} className={`${inp} pl-8`} placeholder="https://youtube.com/…" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Live Preview</p>
                    <div className="space-y-2">
                      {[
                        { label: 'School', value: settings.schoolName, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Phone',  value: settings.phone,      color: 'text-gray-700 dark:text-gray-300' },
                        { label: 'Email',  value: settings.email,      color: 'text-gray-700 dark:text-gray-300' },
                        { label: 'Web',    value: settings.website,    color: 'text-blue-500 dark:text-blue-400' },
                      ].map(r => (
                        <div key={r.label} className="flex items-center gap-2 text-xs">
                          <span className="w-12 text-gray-400 dark:text-gray-500 font-medium">{r.label}:</span>
                          <span className={`truncate ${r.color}`}>{r.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom save bar */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${saved ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
                <Save size={14} /> {saved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}