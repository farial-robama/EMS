import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ChevronRight,
  Upload,
  Check,
  AlertCircle,
  GraduationCap,
  Users,
  FileSpreadsheet,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const inp =
  'w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';

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

export default function BulkSmsMixed({
  selectedStudents = 128,
  selectedTeachers = 24,
}) {
  const [smsPurpose, setSmsPurpose] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const totalRecipients = selectedStudents + selectedTeachers;
  const charCount = smsContent.length;
  const smsPages = Math.ceil(charCount / 160) || 1;
  const totalSms = totalRecipients * smsPages;

  const handleSend = async () => {
    const e = {};
    if (totalRecipients === 0) e.recipients = 'No recipients selected';
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
          <Breadcrumb items={['Dashboard', 'SMS Setup', 'Send Bulk SMS']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-blue-500" /> Send Bulk SMS
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Review recipients and compose your message
          </p>
        </div>

        {/* Recipient Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <GraduationCap size={20} />,
              label: 'Selected Students',
              value: selectedStudents,
              sub: 'From student bulk SMS',
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              ic: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
              val: 'text-blue-700 dark:text-blue-400',
            },
            {
              icon: <Users size={20} />,
              label: 'Selected Teachers',
              value: selectedTeachers,
              sub: 'From teacher bulk SMS',
              cls: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30',
              ic: 'bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400',
              val: 'text-violet-700 dark:text-violet-400',
            },
            {
              icon: <MessageSquare size={20} />,
              label: 'Total Recipients',
              value: totalRecipients,
              sub: `${smsPages} SMS page${smsPages !== 1 ? 's' : ''} per recipient`,
              cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
              ic: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
              val: 'text-green-700 dark:text-green-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 p-5 rounded-2xl border ${s.cls}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                {s.icon}
              </div>
              <div>
                <div className={`text-3xl font-bold leading-none ${s.val}`}>
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No recipients warning */}
        {totalRecipients === 0 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
            <AlertCircle
              size={16}
              className="text-amber-500 flex-shrink-0 mt-0.5"
            />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              <p className="font-semibold mb-0.5">No recipients selected yet</p>
              <p>
                Go to <strong>Student Bulk SMS</strong> or{' '}
                <strong>Teacher Bulk SMS</strong> to select recipients first.
              </p>
            </div>
          </div>
        )}

        {/* Compose Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <MessageSquare size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Compose Message
            </span>
          </div>
          <div className="p-5 space-y-4">
            {/* Excel Upload */}
            <F label="Excel File (Additional Contacts)">
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all
                ${excelFile ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700/50'}`}
              >
                <FileSpreadsheet
                  size={18}
                  className={excelFile ? 'text-green-500' : 'text-gray-400'}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {excelFile ? excelFile.name : 'Upload .xlsx / .csv file'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {excelFile
                      ? 'Click to change'
                      : 'Drag and drop or click to browse'}
                  </p>
                </div>
                {excelFile && (
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                )}
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  className="hidden"
                  onChange={(e) => setExcelFile(e.target.files[0] || null)}
                />
              </label>
            </F>

            {/* SMS Purpose */}
            <F label="SMS Purpose" required error={errors.purpose}>
              <input
                type="text"
                value={smsPurpose}
                onChange={(e) => {
                  setSmsPurpose(e.target.value);
                  setErrors((p) => ({ ...p, purpose: undefined }));
                }}
                placeholder="e.g. Exam Notice, Event Announcement…"
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

            {/* SMS Content */}
            <F label="SMS Content" required error={errors.content}>
              <textarea
                rows={6}
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
                  {charCount} chars · {smsPages} page{smsPages !== 1 ? 's' : ''}
                </span>
              </div>
            </F>

            {/* Cost estimate */}
            {smsContent.length > 0 && totalRecipients > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Recipients',
                    value: totalRecipients.toLocaleString(),
                  },
                  { label: 'SMS Pages', value: smsPages },
                  { label: 'Total SMS', value: totalSms.toLocaleString() },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl text-center border border-gray-100 dark:border-gray-700"
                  >
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSend}
                disabled={sending || totalRecipients === 0}
                className={`flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm
                  ${
                    sent
                      ? 'bg-green-600 shadow-green-200'
                      : sending || totalRecipients === 0
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
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
                    All SMS Sent!
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send to {totalRecipients} Recipients
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
