import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  ChevronRight,
  Search,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const TEACHERS = [
  {
    id: 1,
    name: 'Md. Rahim Uddin',
    designation: 'Assistant Teacher',
    department: 'Bangla',
    mobile: '017XXXXXXXX',
  },
  {
    id: 2,
    name: 'Mrs. Salma Akter',
    designation: 'Lecturer',
    department: 'English',
    mobile: '018XXXXXXXX',
  },
  {
    id: 3,
    name: 'Mr. Kamal Hossain',
    designation: 'Senior Teacher',
    department: 'Mathematics',
    mobile: '019XXXXXXXX',
  },
  {
    id: 4,
    name: 'Mrs. Nusrat Jahan',
    designation: 'Lecturer',
    department: 'Science',
    mobile: '016XXXXXXXX',
  },
  {
    id: 5,
    name: 'Md. Faruk Ahmed',
    designation: 'Head Teacher',
    department: 'Physics',
    mobile: '017YYYYYYYY',
  },
  {
    id: 6,
    name: 'Mrs. Ruma Begum',
    designation: 'Lecturer',
    department: 'Chemistry',
    mobile: '018YYYYYYYY',
  },
  {
    id: 7,
    name: 'Mr. Shafiqul Islam',
    designation: 'Senior Teacher',
    department: 'History',
    mobile: '019YYYYYYYY',
  },
  {
    id: 8,
    name: 'Mrs. Hosneara Khatun',
    designation: 'Assistant Teacher',
    department: 'Geography',
    mobile: '016YYYYYYYY',
  },
];

const SESSIONS = ['2023-2024', '2024-2025', '2025-2026'];
const CONTACT_TYPES = ['Teacher Mobile No.', 'Personal Mobile No.'];
const DESIGNATIONS = ['All', ...new Set(TEACHERS.map((t) => t.designation))];
const DEPARTMENTS = ['All', ...new Set(TEACHERS.map((t) => t.department))];
const inp =
  'w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer'
          }
        >
          {item}
        </span>
        {i < items.length - 1 && (
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function TeacherBulkSms() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [contactType, setContactType] = useState(CONTACT_TYPES[0]);
  const [session, setSession] = useState('');
  const [smsPurpose, setSmsPurpose] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [designation, setDesignation] = useState('All');
  const [department, setDepartment] = useState('All');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(
    () =>
      TEACHERS.filter(
        (t) =>
          (designation === 'All' || t.designation === designation) &&
          (department === 'All' || t.department === department) &&
          (!search ||
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.department.toLowerCase().includes(search.toLowerCase()))
      ),
    [designation, department, search]
  );

  const allChecked =
    filtered.length > 0 && filtered.every((t) => selectedIds.includes(t.id));
  const someChecked = filtered.some((t) => selectedIds.includes(t.id));

  const toggleTeacher = (id) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const selectAll = () => {
    if (allChecked) {
      setSelectedIds((p) =>
        p.filter((id) => !filtered.find((t) => t.id === id))
      );
    } else {
      const newIds = filtered
        .map((t) => t.id)
        .filter((id) => !selectedIds.includes(id));
      setSelectedIds((p) => [...p, ...newIds]);
    }
  };

  const charCount = smsContent.length;
  const smsPages = Math.ceil(charCount / 160) || 1;

  const handleSend = async () => {
    const e = {};
    if (selectedIds.length === 0) e.teachers = 'Select at least one teacher';
    if (!session) e.session = 'Required';
    if (!smsPurpose.trim()) e.purpose = 'Required';
    if (!smsContent.trim()) e.content = 'Required';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'SMS Setup', 'Teacher Bulk SMS']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-violet-500" /> Teacher Bulk
            SMS
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Teachers',
              value: TEACHERS.length,
              cls: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30',
              val: 'text-violet-700 dark:text-violet-400',
            },
            {
              label: 'Selected',
              value: selectedIds.length,
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              val: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Filtered',
              value: filtered.length,
              cls: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30',
              val: 'text-indigo-700 dark:text-indigo-400',
            },
            {
              label: 'SMS Pages',
              value: smsPages,
              cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
              val: 'text-amber-600 dark:text-amber-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.cls}`}
            >
              <div className={`text-2xl font-bold leading-none ${s.val}`}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Selection Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-violet-50/50 dark:bg-violet-900/10">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Users size={15} className="text-violet-500" />
              <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                Select Teachers
              </span>
              {errors.teachers && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={11} />
                  {errors.teachers}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-violet-500"
              >
                {DESIGNATIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-violet-500"
              >
                {DEPARTMENTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-violet-500 w-40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) =>
                        el && (el.indeterminate = someChecked && !allChecked)
                      }
                      onChange={selectAll}
                      className="w-4 h-4 rounded accent-violet-500 cursor-pointer"
                    />
                  </th>
                  {['Name', 'Designation', 'Department', 'Mobile'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map((t) => {
                  const checked = selectedIds.includes(t.id);
                  return (
                    <tr
                      key={t.id}
                      className={`transition-colors cursor-pointer ${checked ? 'bg-violet-50/40 dark:bg-violet-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                      onClick={() => toggleTeacher(t.id)}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded accent-violet-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${checked ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                          >
                            {t.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {t.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-lg">
                          {t.designation}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {t.department}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {t.mobile}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedIds.length > 0 && (
            <div className="px-5 py-3 bg-violet-50 dark:bg-violet-900/10 border-t border-violet-100 dark:border-violet-900/30">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                {selectedIds.length} teacher
                {selectedIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>

        {/* SMS Compose Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30">
            <MessageSquare size={15} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">
              Compose SMS
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="Teacher Contact Type" required>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className={inp}
                >
                  {CONTACT_TYPES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </F>
              <F label="Session" required error={errors.session}>
                <select
                  value={session}
                  onChange={(e) => {
                    setSession(e.target.value);
                    setErrors((p) => ({ ...p, session: undefined }));
                  }}
                  className={
                    errors.session
                      ? inp.replace(
                          'border-gray-200 dark:border-gray-600',
                          'border-red-400'
                        )
                      : inp
                  }
                >
                  <option value="">Select Session</option>
                  {SESSIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </F>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="File / Image Upload">
                <label
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all
                  ${file ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'}`}
                >
                  <Upload
                    size={15}
                    className={file ? 'text-violet-500' : 'text-gray-400'}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {file ? file.name : 'Choose file…'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                </label>
              </F>
              <F label="SMS Purpose" required error={errors.purpose}>
                <input
                  type="text"
                  value={smsPurpose}
                  onChange={(e) => {
                    setSmsPurpose(e.target.value);
                    setErrors((p) => ({ ...p, purpose: undefined }));
                  }}
                  placeholder="e.g. Meeting Notice, Salary Alert…"
                  className={
                    errors.purpose
                      ? inp.replace(
                          'border-gray-200 dark:border-gray-600',
                          'border-red-400'
                        )
                      : inp
                  }
                />
              </F>
            </div>

            <F label="SMS Content" required error={errors.content}>
              <textarea
                rows={5}
                value={smsContent}
                onChange={(e) => {
                  setSmsContent(e.target.value);
                  setErrors((p) => ({ ...p, content: undefined }));
                }}
                placeholder="Type your SMS message here…"
                className={`${errors.content ? inp.replace('border-gray-200 dark:border-gray-600', 'border-red-400') : inp} resize-none`}
              />
              <div className="flex justify-end -mt-1">
                <span
                  className={`text-xs font-medium ${charCount > 160 ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}
                >
                  {charCount} chars · {smsPages} SMS page
                  {smsPages !== 1 ? 's' : ''}
                </span>
              </div>
            </F>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                  <Send
                    size={14}
                    className="text-violet-600 dark:text-violet-400"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                    Ready to send
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-500">
                    {selectedIds.length} teacher
                    {selectedIds.length !== 1 ? 's' : ''} · {smsPages} SMS page
                    {smsPages !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSend}
                disabled={sending || selectedIds.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm
                  ${
                    sent
                      ? 'bg-green-600 shadow-green-200'
                      : sending || selectedIds.length === 0
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-violet-600 hover:bg-violet-700 shadow-violet-200'
                  }`}
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : sent ? (
                  <>
                    <Check size={15} />
                    SMS Sent!
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send SMS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
