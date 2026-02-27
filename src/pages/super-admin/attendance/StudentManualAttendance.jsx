import React, { useState, useMemo } from 'react';
import {
  Search, Filter, ChevronRight, ChevronLeft, ClipboardCheck,
  User, Calendar, CheckCircle2, X, Clock, AlertTriangle,
  Save, RefreshCw, Users, CheckSquare, XSquare, Minus, RotateCcw,
  BookOpen, Lock, Unlock,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// ─── Mock student pool ─────────────────────────────────────────────────────
const STUDENT_POOL = {
  'Eight': [
    { id: 1, roll: '01', name: 'Rahim Uddin',      regNo: 'REG-2021-001', gender: 'Male' },
    { id: 2, roll: '02', name: 'Fatema Begum',      regNo: 'REG-2021-002', gender: 'Female' },
    { id: 3, roll: '03', name: 'Arif Hasan',        regNo: 'REG-2021-003', gender: 'Male' },
    { id: 4, roll: '04', name: 'Sumaiya Khanam',    regNo: 'REG-2021-004', gender: 'Female' },
    { id: 5, roll: '05', name: 'Tanvir Ahmed',      regNo: 'REG-2021-005', gender: 'Male' },
    { id: 6, roll: '06', name: 'Nadia Islam',       regNo: 'REG-2021-006', gender: 'Female' },
    { id: 7, roll: '07', name: 'Mehedi Hasan',      regNo: 'REG-2021-007', gender: 'Male' },
    { id: 8, roll: '08', name: 'Sadia Akter',       regNo: 'REG-2021-008', gender: 'Female' },
    { id: 9, roll: '09', name: 'Sakib Al Hasan',    regNo: 'REG-2021-009', gender: 'Male' },
    { id: 10, roll: '10', name: 'Rifat Jahan',      regNo: 'REG-2021-010', gender: 'Female' },
  ],
  'Five': [
    { id: 11, roll: '01', name: 'Karim Hossain',   regNo: 'REG-2022-001', gender: 'Male' },
    { id: 12, roll: '02', name: 'Mitu Begum',       regNo: 'REG-2022-002', gender: 'Female' },
    { id: 13, roll: '03', name: 'Sohel Rana',       regNo: 'REG-2022-003', gender: 'Male' },
    { id: 14, roll: '04', name: 'Ritu Akter',       regNo: 'REG-2022-004', gender: 'Female' },
    { id: 15, roll: '05', name: 'Jahangir Alam',    regNo: 'REG-2022-005', gender: 'Male' },
    { id: 16, roll: '06', name: 'Poly Begum',       regNo: 'REG-2022-006', gender: 'Female' },
  ],
};

const ATT_STATUS = {
  Present:  { label: 'P', color: 'bg-green-500 text-white', badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', ring: 'ring-green-300' },
  Absent:   { label: 'A', color: 'bg-red-500 text-white',   badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',     ring: 'ring-red-300' },
  Late:     { label: 'L', color: 'bg-amber-500 text-white', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', ring: 'ring-amber-300' },
  Leave:    { label: 'LV', color: 'bg-blue-500 text-white', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',   ring: 'ring-blue-300' },
  Holiday:  { label: 'H', color: 'bg-gray-400 text-white',  badge: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',     ring: 'ring-gray-300' },
};

const CLASSES  = ['Eight', 'Five', 'Nine (Science)', 'Ten (Science)', 'KG', 'Three'];
const SESSIONS = ['2024-2025', '2025-2026', '2023-2024'];
const SHIFTS   = ['Day', 'Morning', 'Evening'];
const SECTIONS = ['A', 'B', 'C'];

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

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

function StatusButton({ current, status, onClick }) {
  const s = ATT_STATUS[status];
  const active = current === status;
  return (
    <button type="button" onClick={onClick}
      className={`w-9 h-8 rounded-lg text-xs font-bold transition-all border-2 ${active ? `${s.color} border-transparent ring-2 ${s.ring}` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}>
      {s.label}
    </button>
  );
}

// Saved attendance records (simulated already-saved dates)
const SAVED_RECORDS = {
  'Eight_A_Day_2024-2025': {
    '2025-06-10': { 1: 'Present', 2: 'Present', 3: 'Absent', 4: 'Present', 5: 'Late', 6: 'Present', 7: 'Present', 8: 'Present', 9: 'Absent', 10: 'Present' },
    '2025-06-11': { 1: 'Present', 2: 'Late', 3: 'Present', 4: 'Present', 5: 'Present', 6: 'Absent', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Present' },
  }
};

export default function StudentManualAttendance() {
  const today = new Date().toISOString().slice(0, 10);

  // Selection state
  const [className, setClassName]   = useState('Eight');
  const [section, setSection]       = useState('A');
  const [shift, setShift]           = useState('Day');
  const [session, setSession]       = useState('2024-2025');
  const [attDate, setAttDate]       = useState(today);
  const [loaded, setLoaded]         = useState(false);
  const [locked, setLocked]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');

  // Attendance state: { studentId: status }
  const [attendance, setAttendance] = useState({});
  const [note, setNote]             = useState('');
  const [search, setSearch]         = useState('');

  const students = STUDENT_POOL[className] || [];
  const filteredStudents = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search)
  );

  const recordKey = `${className}_${section}_${shift}_${session}`;

  const loadAttendance = () => {
    const existing = SAVED_RECORDS[recordKey]?.[attDate];
    if (existing) {
      setAttendance(existing);
    } else {
      // Default all to Present
      const defaults = {};
      students.forEach(s => { defaults[s.id] = 'Present'; });
      setAttendance(defaults);
    }
    setLoaded(true);
    setLocked(false);
    setSaved(false);
    setSaveMsg('');
  };

  const markAll = (status) => {
    if (locked) return;
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const setStudentAtt = (id, status) => {
    if (locked) return;
    setAttendance(p => ({ ...p, [id]: status }));
  };

  const handleSave = () => {
    setSaved(true);
    setLocked(true);
    setSaveMsg(`Attendance saved & locked for ${className} · ${section} · ${attDate}`);
  };

  const handleUnlock = () => { setLocked(false); setSaved(false); setSaveMsg(''); };
  const handleReset = () => { loadAttendance(); setSaveMsg(''); };

  // Summary
  const summary = useMemo(() => {
    const counts = { Present: 0, Absent: 0, Late: 0, Leave: 0, Holiday: 0 };
    students.forEach(s => { const st = attendance[s.id]; if (st && counts[st] !== undefined) counts[st]++; });
    return counts;
  }, [attendance, students]);

  const totalMarked = Object.values(attendance).filter(Boolean).length;
  const attPct = students.length > 0 ? Math.round(((summary.Present + summary.Late) / students.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb items={['Dashboard', 'Attendance', 'Student Manual Attendance']} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ClipboardCheck size={22} className="text-blue-500" /> Student Manual Attendance
            </h1>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
            <Filter size={14} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Select Class & Date</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class</label>
              <select value={className} onChange={e => { setClassName(e.target.value); setLoaded(false); setAttendance({}); }} className={inp}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Section</label>
              <select value={section} onChange={e => { setSection(e.target.value); setLoaded(false); }} className={inp}>
                {SECTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shift</label>
              <select value={shift} onChange={e => { setShift(e.target.value); setLoaded(false); }} className={inp}>
                {SHIFTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Session</label>
              <select value={session} onChange={e => { setSession(e.target.value); setLoaded(false); }} className={inp}>
                {SESSIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</label>
              <input type="date" value={attDate} onChange={e => { setAttDate(e.target.value); setLoaded(false); setAttendance({}); }} className={inp} max={today} />
            </div>
            <div className="flex flex-col gap-1 justify-end">
              <button onClick={loadAttendance} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <BookOpen size={14} /> Load Students
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Sheet */}
        {loaded && (
          <>
            {/* Summary Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{students.length}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                  {Object.entries(summary).map(([status, count]) => {
                    const s = ATT_STATUS[status];
                    return (
                      <div key={status} className="flex items-center gap-1.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${s.color}`}>{s.label}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{count}</p>
                          <p className="text-xs text-gray-400">{status}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${attPct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-green-600">{attPct}%</span>
                    <span className="text-xs text-gray-400">attendance</span>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium mr-1">Mark All:</span>
                  {Object.keys(ATT_STATUS).map(s => (
                    <button key={s} type="button" onClick={() => markAll(s)} disabled={locked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${ATT_STATUS[s].badge} border-current`}>
                      {ATT_STATUS[s].label} {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class info row */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex-wrap">
                <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-lg font-medium">{className}</span>
                <span className="text-xs text-gray-500">Section {section}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{shift} Shift</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{session}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"><Calendar size={11} />{attDate}</span>
                {locked && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg font-medium border border-amber-200 dark:border-amber-900">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
            </div>

            {/* Save message */}
            {saveMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span className="font-medium">{saveMsg}</span>
              </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Attendance Sheet</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{students.length} students</span>
                  <span className="text-xs text-gray-400">{totalMarked}/{students.length} marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 w-44" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '700px' }}>
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">#</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roll</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student Name</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reg. No.</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gender</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Attendance
                        <span className="ml-2 text-xs font-normal text-gray-400 normal-case">(P · A · L · LV · H)</span>
                      </th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {filteredStudents.map((student, i) => {
                      const status = attendance[student.id] || 'Present';
                      const s = ATT_STATUS[status];
                      return (
                        <tr key={student.id} className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20 ${status === 'Absent' ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}>
                          <td className="px-4 py-3.5 text-sm text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-semibold">{student.roll}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status === 'Present' ? 'bg-green-100 dark:bg-green-900/30' : status === 'Absent' ? 'bg-red-100 dark:bg-red-900/30' : status === 'Late' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                <User size={13} className={status === 'Present' ? 'text-green-600' : status === 'Absent' ? 'text-red-500' : status === 'Late' ? 'text-amber-600' : 'text-blue-500'} />
                              </div>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400">{student.regNo}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${student.gender === 'Male' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'}`}>{student.gender}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {Object.keys(ATT_STATUS).map(st => (
                                <StatusButton key={st} current={status} status={st} onClick={() => setStudentAtt(student.id, st)} />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${s.badge}`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Note + Action Buttons */}
              <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Note / Remark (optional)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} disabled={locked}
                    className={`w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white outline-none transition-all focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Add any notes or remarks about today's attendance..." />
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button onClick={handleReset} disabled={locked}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      <RotateCcw size={13} /> Reset
                    </button>
                    {locked && (
                      <button onClick={handleUnlock}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 rounded-xl transition-colors">
                        <Unlock size={13} /> Unlock to Edit
                      </button>
                    )}
                  </div>
                  <button onClick={handleSave} disabled={locked || totalMarked === 0}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Save size={14} /> {saved ? 'Saved ✓' : 'Save & Lock Attendance'}
                  </button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Attendance Legend</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(ATT_STATUS).map(([status, s]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <span className={`w-7 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${s.color}`}>{s.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state before loading */}
        {!loaded && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm py-16 text-center">
            <ClipboardCheck size={42} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-base font-semibold text-gray-400 dark:text-gray-500">Select class, section, and date</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">then click <span className="font-semibold text-blue-500">Load Students</span> to begin marking attendance</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}