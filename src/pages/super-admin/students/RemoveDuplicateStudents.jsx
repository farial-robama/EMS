import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ChevronRight,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  Copy,
  Eye,
  X,
  LayoutGrid,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ─── Sample student data with intentional duplicates ─── */
const ALL_STUDENTS = [
  {
    id: 1,
    name: 'SAKIB HASAN',
    roll: '1202526033001',
    class: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514010030001',
  },
  {
    id: 2,
    name: 'SAKIB HASAN',
    roll: '1202526033001',
    class: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514010030001',
  },
  {
    id: 3,
    name: 'NUSRAT JAHAN',
    roll: '1202526033002',
    class: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514010030002',
  },
  {
    id: 4,
    name: 'FARUK AHMED',
    roll: '1202526033003',
    class: 'HSC-Arts',
    section: '2nd Year',
    session: '2025-2026',
    studentId: '2514020030003',
  },
  {
    id: 5,
    name: 'FARUK AHMED',
    roll: '1202526033003',
    class: 'HSC-Arts',
    section: '2nd Year',
    session: '2025-2026',
    studentId: '2514020030003',
  },
  {
    id: 6,
    name: 'FARUK AHMED',
    roll: '1202526033003',
    class: 'HSC-Arts',
    section: '2nd Year',
    session: '2025-2026',
    studentId: '2514020030003',
  },
  {
    id: 7,
    name: 'RIMA AKTER',
    roll: '1202526033004',
    class: 'HSC-Science',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514010030004',
  },
  {
    id: 8,
    name: 'KAMAL HOSSAIN',
    roll: '1202526033005',
    class: 'HSC-Commerce',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514030030005',
  },
  {
    id: 9,
    name: 'KAMAL HOSSAIN',
    roll: '1202526033005',
    class: 'HSC-Commerce',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514030030005',
  },
  {
    id: 10,
    name: 'SALMA BEGUM',
    roll: '1202526033006',
    class: 'HSC-Arts',
    section: '1st Year',
    session: '2025-2026',
    studentId: '2514020030006',
  },
  {
    id: 11,
    name: 'RAHIM SARKER',
    roll: '1202526033007',
    class: 'HSC-Science',
    section: '2nd Year',
    session: '2025-2026',
    studentId: '2514010030007',
  },
  {
    id: 12,
    name: 'RAHIM SARKER',
    roll: '1202526033007',
    class: 'HSC-Science',
    section: '2nd Year',
    session: '2025-2026',
    studentId: '2514010030007',
  },
];

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

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

export default function RemoveDuplicateStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState(ALL_STUDENTS);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewGroup, setViewGroup] = useState(null);

  /* ─── Find duplicates ─── */
  const duplicateGroups = useMemo(() => {
    const groups = {};
    students.forEach((s) => {
      const key = `${s.roll}__${s.studentId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return Object.values(groups).filter((g) => g.length > 1);
  }, [students]);

  const totalDuplicates = duplicateGroups.reduce(
    (sum, g) => sum + g.length - 1,
    0
  );

  const filteredGroups = useMemo(
    () =>
      duplicateGroups.filter((g) => {
        const s = g[0];
        return (
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.roll.includes(search) ||
          s.studentId.includes(search)
        );
      }),
    [duplicateGroups, search]
  );

  /* ─── Remove duplicates (keep first of each group) ─── */
  const handleRemoveDuplicates = async () => {
    setConfirmOpen(false);
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 1200));

    const seen = new Set();
    const deduped = students.filter((s) => {
      const key = `${s.roll}__${s.studentId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setStudents(deduped);
    setRemoving(false);
    setRemoved(true);
    setTimeout(() => setRemoved(false), 5000);
  };

  /* ─── Remove a specific duplicate ─── */
  const removeSingle = (id) => {
    setStudents((p) => p.filter((s) => s.id !== id));
    if (viewGroup) {
      const updated = viewGroup.filter((s) => s.id !== id);
      if (updated.length <= 1) setViewGroup(null);
      else setViewGroup(updated);
    }
  };

  const totalStudents = students.length;
  const uniqueStudents = totalStudents - totalDuplicates;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb
              items={[
                'Dashboard',
                'Exam & Result',
                'Remove Duplicate Students',
              ]}
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Copy size={22} className="text-orange-500" /> Remove Duplicate
              Students
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Detect and remove duplicate student records from the mark entry
              system
            </p>
          </div>
          {duplicateGroups.length > 0 && (
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={removing}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200 flex-shrink-0 disabled:opacity-60"
            >
              {removing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Remove All Duplicates
                </>
              )}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Records',
              value: totalStudents,
              cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
              val: 'text-blue-700 dark:text-blue-400',
            },
            {
              label: 'Unique Students',
              value: uniqueStudents,
              cls: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
              val: 'text-green-700 dark:text-green-400',
            },
            {
              label: 'Duplicate Groups',
              value: duplicateGroups.length,
              cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
              val: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: 'Extra Records',
              value: totalDuplicates,
              cls: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30',
              val: 'text-red-600 dark:text-red-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border ${s.cls}`}
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

        {/* Success Banner */}
        {removed && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                Duplicates removed successfully
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                All extra records have been cleaned up. One record per student
                is retained.
              </p>
            </div>
          </div>
        )}

        {/* No Duplicates State */}
        {duplicateGroups.length === 0 && !removed && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
              No Duplicates Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All student records are unique. The database is clean.
            </p>
          </div>
        )}

        {/* Duplicate Groups Table */}
        {duplicateGroups.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Duplicate Groups
                </span>
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                  {filteredGroups.length} groups
                </span>
              </div>
              <div className="relative w-52">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  placeholder="Search name or roll…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Warning Banner */}
            <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
              <AlertCircle
                size={15}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                The following student records appear more than once. Removing
                duplicates will keep the <strong>first record</strong> and
                delete all extras. Click <strong>View</strong> to inspect
                individual records before removing.
              </p>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {[
                      '#',
                      'Student Name',
                      'Roll No',
                      'Student ID',
                      'Class',
                      'Section',
                      'Session',
                      'Copies',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right pr-5' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filteredGroups.map((group, i) => {
                    const s = group[0];
                    return (
                      <tr
                        key={i}
                        className="bg-red-50/20 dark:bg-red-900/5 hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-400">
                          {i + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {s.name}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                          {s.roll}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                          {s.studentId}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg">
                            {s.class}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {s.section}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {s.session}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            ×{group.length}
                          </span>
                        </td>
                        <td className="px-4 py-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewGroup(group)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => {
                                // keep first, remove rest
                                const [keep, ...extras] = group;
                                setStudents((p) =>
                                  p.filter(
                                    (s) => !extras.find((e) => e.id === s.id)
                                  )
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {filteredGroups.length} duplicate group
                {filteredGroups.length !== 1 ? 's' : ''} · {totalDuplicates}{' '}
                extra record{totalDuplicates !== 1 ? 's' : ''} to remove
              </p>
            </div>
          </div>
        )}

        {/* ── View Group Modal ── */}
        {viewGroup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setViewGroup(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Copy size={13} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Duplicate Records — {viewGroup[0].name}
                  </span>
                </div>
                <button
                  onClick={() => setViewGroup(null)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5">
                <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg px-3 py-2 mb-4">
                  The first record (Row 1) will be kept. All others can be
                  removed individually or all at once.
                </p>
                <div className="space-y-2">
                  {viewGroup.map((s, i) => (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border ${i === 0 ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-red-50/40 dark:bg-red-900/5 border-red-200 dark:border-red-900/30'}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-400' : 'bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-400'}`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {s.roll} · {s.studentId} · {s.class} {s.section}
                        </p>
                      </div>
                      {i === 0 ? (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-lg font-semibold">
                          Keep
                        </span>
                      ) : (
                        <button
                          onClick={() => removeSingle(s.id)}
                          className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 flex items-center justify-center transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => setViewGroup(null)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const [, ...extras] = viewGroup;
                    setStudents((p) =>
                      p.filter((s) => !extras.find((e) => e.id === s.id))
                    );
                    setViewGroup(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
                >
                  <Trash2 size={14} /> Remove Duplicates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Remove All Modal ── */}
        {confirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                Remove All Duplicates?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                This will delete{' '}
                <span className="font-bold text-red-600">
                  {totalDuplicates} extra records
                </span>{' '}
                across{' '}
                <span className="font-bold">
                  {duplicateGroups.length} groups
                </span>
                .
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                One record per student will be kept. This action cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveDuplicates}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Remove All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
