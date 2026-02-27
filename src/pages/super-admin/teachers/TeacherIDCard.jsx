import React, { useState, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  Download,
  Printer,
  User,
  IdCard,
  QrCode,
} from 'lucide-react';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
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

const selCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';

const TEACHERS = [
  {
    code: 'E000001',
    name: 'Kumud Ranjan Biswas',
    designation: 'Assistant Teacher',
    dob: '1970-01-01',
    mobile: '01700000000',
    department: 'Science',
    eduLevel: 'Higher Secondary',
    shift: 'Day',
    subjects: ['Bangla', 'Physics', 'Chemistry'],
    photo: '',
  },
  {
    code: 'E000002',
    name: 'Md. Farhad Hossain',
    designation: 'Assistant Teacher',
    dob: '1975-06-15',
    mobile: '01721367110',
    department: 'Arts',
    eduLevel: 'Higher Secondary',
    shift: 'Day',
    subjects: ['English', 'History'],
    photo: '',
  },
  {
    code: 'E000216',
    name: 'Md. Nazrul Islam',
    designation: 'Assistant Teacher',
    dob: '1973-09-11',
    mobile: '01537633780',
    department: 'Science',
    eduLevel: 'Higher Secondary',
    shift: 'Day',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    photo: '',
  },
];

/* Mini ID Card component */
function IDCard({ teacher, withBg, side }) {
  const initials = teacher.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (side === 'front') {
    return (
      <div
        className={`relative w-56 h-36 rounded-xl overflow-hidden shadow-lg flex-shrink-0 select-none
        ${
          withBg
            ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100'
        }`}
      >
        {/* Header stripe */}
        <div
          className={`px-3 py-1.5 flex items-center gap-1.5 ${withBg ? 'bg-white/10' : 'bg-blue-600'}`}
        >
          <div
            className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold
            ${withBg ? 'bg-white text-blue-700' : 'bg-white text-blue-600'}`}
          >
            M
          </div>
          <span
            className={`text-xs font-semibold leading-tight ${withBg ? 'text-white' : 'text-white'}`}
          >
            Mohammadpur Kendriya College
          </span>
        </div>
        {/* Body */}
        <div className="flex gap-2 px-3 pt-2">
          {/* Photo */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold
            ${withBg ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}
          >
            {teacher.photo ? (
              <img
                src={teacher.photo}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              initials
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold truncate ${withBg ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}
            >
              {teacher.name}
            </p>
            <p
              className={`text-xs truncate mt-0.5 ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {teacher.designation}
            </p>
            <p
              className={`text-xs mt-0.5 ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
            >
              ID: {teacher.code}
            </p>
            <p
              className={`text-xs ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Dept: {teacher.department}
            </p>
          </div>
        </div>
        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-3 py-1 text-xs flex justify-between
          ${withBg ? 'bg-white/10 text-blue-100' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 border-t border-gray-100 dark:border-gray-600'}`}
        >
          <span>{teacher.eduLevel}</span>
          <span>{teacher.shift} Shift</span>
        </div>
      </div>
    );
  }

  // Back
  return (
    <div
      className={`relative w-56 h-36 rounded-xl overflow-hidden shadow-lg flex-shrink-0 select-none
      ${
        withBg
          ? 'bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-700 text-white'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100'
      }`}
    >
      <div
        className={`px-3 py-1.5 text-xs font-bold ${withBg ? 'bg-white/10 text-white' : 'bg-blue-600 text-white'}`}
      >
        Teacher Details
      </div>
      <div className="flex gap-3 px-3 pt-2">
        <div className="flex-1 space-y-0.5">
          <p
            className={`text-xs ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <span className="font-semibold">DOB:</span> {teacher.dob}
          </p>
          <p
            className={`text-xs ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <span className="font-semibold">Mobile:</span> {teacher.mobile}
          </p>
          <p
            className={`text-xs ${withBg ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'} line-clamp-2`}
          >
            <span className="font-semibold">Subjects:</span>{' '}
            {teacher.subjects.join(', ')}
          </p>
        </div>
        {/* QR placeholder */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
          ${withBg ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
        >
          QR
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 px-3 py-1 text-xs text-center
        ${withBg ? 'bg-white/10 text-blue-100' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 border-t border-gray-100 dark:border-gray-600'}`}
      >
        Mohammadpur Kendriya College
      </div>
    </div>
  );
}

export default function TeacherIDCard() {
  const [filters, setFilters] = useState({
    teacherCode: '',
    printingType: 'onlyDownload',
    formatType: 'withBackground',
  });

  const handleChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const filtered = TEACHERS.filter(
    (t) => filters.teacherCode === '' || t.code === filters.teacherCode
  );
  const withBg = filters.formatType === 'withBackground';

  const handleDownload = (t) => alert(`Downloading ID Card for ${t.name}`);
  const handlePrint = (t) => alert(`Printing ID Card for ${t.name}`);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb
          items={['Dashboard', 'Teacher Setup', 'Teacher ID Cards']}
        />

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
              <User size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              ID Card Settings
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Teacher Name
                </label>
                <select
                  name="teacherCode"
                  value={filters.teacherCode}
                  onChange={handleChange}
                  className={selCls}
                >
                  <option value="">All Teachers</option>
                  {TEACHERS.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} — {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Printing Type
                </label>
                <select
                  name="printingType"
                  value={filters.printingType}
                  onChange={handleChange}
                  className={selCls}
                >
                  <option value="onlyDownload">Only Download</option>
                  <option value="printAndDownload">Print & Download</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Format Type
                </label>
                <select
                  name="formatType"
                  value={filters.formatType}
                  onChange={handleChange}
                  className={selCls}
                >
                  <option value="withBackground">With Background</option>
                  <option value="withoutBackground">Without Background</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ID Card Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <User size={22} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Select a teacher to preview their ID card.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((teacher) => (
              <div
                key={teacher.code}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {teacher.code} · {teacher.designation}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${withBg ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                  >
                    {withBg ? 'With BG' : 'No BG'}
                  </span>
                </div>

                {/* Card previews */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                    Preview
                  </p>
                  <div className="flex flex-wrap gap-4 mb-5">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                        Front Side
                      </p>
                      <IDCard teacher={teacher} withBg={withBg} side="front" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                        Back Side
                      </p>
                      <IDCard teacher={teacher} withBg={withBg} side="back" />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-end">
                    {filters.printingType === 'printAndDownload' && (
                      <button
                        onClick={() => handlePrint(teacher)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        🖨 Print
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(teacher)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
                    >
                      ↓ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
