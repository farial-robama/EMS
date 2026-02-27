import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  BookOpen,
  User,
  AlertCircle,
} from 'lucide-react';

/* ─── Breadcrumb ─────────────────────────────────────────────────────────── */
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

/* ─── SectionCard ────────────────────────────────────────────────────────── */
function SectionCard({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = true,
  badge,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}
          >
            <Icon size={14} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {title}
          </span>
          {badge && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

/* ─── Select helper ──────────────────────────────────────────────────────── */
const selCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all';

/* ─── Static data ────────────────────────────────────────────────────────── */
const TEACHERS = [
  {
    code: 'E000216',
    name: 'Md. Nazrul Islam',
    department: 'Science',
    eduLevel: 'Higher Secondary',
    session: '2025-2026',
    shift: 'Day',
    medium: 'Bangla',
    courses: [
      {
        className: 'HSC-Science',
        sections: ['2nd Year', '1st Year', '1st Year (A)'],
        subjects: [
          'Bangla',
          'English',
          'Bangla 1st Part',
          'Bangla 2nd Part',
          'English 1st Part',
          'English 2nd Part',
          'Physics',
          'Physics 1st Part',
          'Physics 2nd Part',
          'Chemistry',
          'Chemistry 1st Part',
          'Chemistry 2nd Part',
          'Biology',
          'Biology 1st Paper',
          'Biology 2nd Part',
          'Higher Mathematics',
          'Higher Mathematics 1st Part',
          'Higher Mathematics 2nd Part',
          'ICT',
        ],
      },
      {
        className: 'HSC-Humanities',
        sections: ['2nd Year', '1st Year'],
        subjects: [
          'Bangla 1st Part',
          'Bangla',
          'Bangla 2nd Part',
          'English 1st Part',
          'English',
          'English 2nd Part',
          'ICT',
          'Economics 1st Part',
          'Economics',
          'Economics 2nd Part',
          'Logic 1st Part',
          'Logic',
          'Logic 2nd Part',
          'Islamic History 1st Part',
          'Islamic History',
          'Islamic History 2nd Part',
          'Civics 1st Part',
          'Civics',
          'Civics 2nd Part',
          'Islamic Studies',
          'Islamic Studies 1st Part',
          'Islamic Studies 2nd Part',
          'Psychology',
          'Psychology 1st Part',
          'Psychology 2nd Part',
          'Geography',
          'Geography 1st Part',
          'Geography 2nd Part',
          'Social Work 1st Paper',
          'Social Work 2nd Paper',
          'Home Science 1st Part',
          'Home Science 2nd Part',
        ],
      },
    ],
  },
  {
    code: 'E000217',
    name: 'Marufa',
    department: 'Arts',
    eduLevel: 'Higher Secondary',
    session: '2025-2026',
    shift: 'Day',
    medium: 'English',
    courses: [
      {
        className: 'HSC-Arts',
        sections: ['1st Year', '2nd Year'],
        subjects: ['Bangla', 'English', 'History', 'Civics'],
      },
    ],
  },
];

export default function TeacherCourseAdvising() {
  const [filters, setFilters] = useState({
    eduLevel: '',
    session: '',
    shift: '',
    medium: '',
    department: '',
    teacherCode: '',
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSelectedTeacher(null);
    setSelectedSubjects({});
    setSubmitted(false);
  };

  const handleShow = () => {
    const t = TEACHERS.find(
      (t) =>
        (filters.teacherCode === '' || t.code === filters.teacherCode) &&
        (filters.eduLevel === '' || t.eduLevel === filters.eduLevel) &&
        (filters.session === '' || t.session === filters.session) &&
        (filters.shift === '' || t.shift === filters.shift) &&
        (filters.medium === '' || t.medium === filters.medium) &&
        (filters.department === '' || t.department === filters.department)
    );
    setSelectedTeacher(t || null);
    setSelectedSubjects({});
    setSubmitted(false);
    if (t) {
      const init = {};
      t.courses.forEach((c) =>
        c.sections.forEach((s) => {
          init[`${c.className}||${s}`] = true;
        })
      );
      setOpenSections(init);
    }
  };

  const toggleSubject = (className, section, subject, checked) => {
    const key = `${className}||${section}`;
    setSelectedSubjects((prev) => {
      const cur = prev[key] || [];
      return {
        ...prev,
        [key]: checked ? [...cur, subject] : cur.filter((s) => s !== subject),
      };
    });
  };

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const allAllocated = Object.values(selectedSubjects).flat();

  const handleSubmit = () => {
    console.log('Allocated Courses:', selectedSubjects);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb
            items={['Dashboard', 'Teacher Setup', 'Course Advising']}
          />
        </div>

        {submitted && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Courses allocated and submitted successfully!
          </div>
        )}

        {/* Filters */}
        <SectionCard
          title="Filter Teachers"
          icon={Search}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Edu Level
              </label>
              <select
                name="eduLevel"
                value={filters.eduLevel}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                <option value="Higher Secondary">Higher Secondary</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Session
              </label>
              <select
                name="session"
                value={filters.session}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Shift
              </label>
              <select
                name="shift"
                value={filters.shift}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Medium
              </label>
              <select
                name="medium"
                value={filters.medium}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                <option value="Bangla">Bangla</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Department
              </label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Teacher
              </label>
              <select
                name="teacherCode"
                value={filters.teacherCode}
                onChange={handleFilterChange}
                className={selCls}
              >
                <option value="">All</option>
                {TEACHERS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleShow}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
            >
              <Search size={15} /> Show Course Advising Panel
            </button>
          </div>
        </SectionCard>

        {/* Advising Panel */}
        {selectedTeacher && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Left: Subject Selection */}
            <SectionCard
              title="Class & Section Wise Subjects"
              icon={BookOpen}
              iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
              badge={selectedTeacher.name}
            >
              {/* Teacher info strip */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: 'Education', val: selectedTeacher.eduLevel },
                  { label: 'Dept', val: selectedTeacher.department },
                  { label: 'Shift', val: selectedTeacher.shift },
                  { label: 'Medium', val: selectedTeacher.medium },
                ].map((i) => (
                  <span
                    key={i.label}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg"
                  >
                    <span className="font-semibold text-gray-400">
                      {i.label}:
                    </span>{' '}
                    {i.val}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                {selectedTeacher.courses.map((course, ci) => (
                  <div
                    key={ci}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Class header */}
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        {course.className} — {selectedTeacher.medium} Medium ·{' '}
                        {selectedTeacher.shift} Shift
                      </p>
                    </div>

                    {course.sections.map((sec, si) => {
                      const key = `${course.className}||${sec}`;
                      const chosen = selectedSubjects[key] || [];
                      return (
                        <div
                          key={si}
                          className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          {/* Section toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-left"
                          >
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                              {sec}
                            </span>
                            <div className="flex items-center gap-2">
                              {chosen.length > 0 && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                  {chosen.length} selected
                                </span>
                              )}
                              <ChevronDown
                                size={14}
                                className={`text-gray-400 transition-transform ${openSections[key] ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </button>

                          {/* Subjects grid */}
                          {openSections[key] && (
                            <div className="px-4 pb-3 grid grid-cols-1 gap-1">
                              {course.subjects.map((sub, j) => {
                                const checked = chosen.includes(sub);
                                return (
                                  <label
                                    key={j}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                                      ${
                                        checked
                                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                                      }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                      ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-500'}`}
                                    >
                                      {checked && (
                                        <Check
                                          size={10}
                                          className="text-white"
                                        />
                                      )}
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={(e) =>
                                        toggleSubject(
                                          course.className,
                                          sec,
                                          sub,
                                          e.target.checked
                                        )
                                      }
                                      className="hidden"
                                    />
                                    {sub}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Right: Allocated Table */}
            <div className="flex flex-col gap-5">
              <SectionCard
                title="Allocated Course(s)"
                icon={User}
                iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
                badge={
                  allAllocated.length > 0
                    ? `${allAllocated.length} subjects`
                    : undefined
                }
              >
                {allAllocated.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                      <BookOpen
                        size={22}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No subjects selected yet.
                      <br />
                      Check subjects from the left panel.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            {[
                              'Shift',
                              'Medium',
                              'Edu. Level',
                              'Class',
                              'Section',
                              'Subject',
                            ].map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedSubjects).map(
                            ([key, subs]) => {
                              const [className, section] = key.split('||');
                              return subs.map((sub, idx) => (
                                <tr
                                  key={`${key}-${sub}-${idx}`}
                                  className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                                >
                                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                                    {selectedTeacher.shift}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                                    {selectedTeacher.medium}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                                    {selectedTeacher.eduLevel}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                    {className}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                    {section}
                                  </td>
                                  <td className="px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-100">
                                    {sub}
                                  </td>
                                </tr>
                              ));
                            }
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
                      >
                        <Check size={15} /> Submit Allocation
                      </button>
                    </div>
                  </>
                )}
              </SectionCard>
            </div>
          </div>
        )}

        {/* No result */}
        {selectedTeacher === null && filters.teacherCode !== '' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-amber-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              No teacher found matching the selected filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
