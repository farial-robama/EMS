import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Search,
  Trash2,
  Check,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
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

const CRITERIA = [
  { id: 'name', label: 'Same Full Name', desc: 'Match by student full name' },
  { id: 'roll', label: 'Same Roll No.', desc: 'Match by roll number' },
  { id: 'dob', label: 'Same Date of Birth', desc: 'Match by birth date' },
  {
    id: 'contact',
    label: 'Same Contact Info',
    desc: 'Match by phone or email',
  },
];

const MOCK_DUPLICATES = [
  {
    name: 'Rahim Uddin',
    initials: 'RU',
    entries: [
      { id: 'STD-1042', detail: 'Roll: 1024 · DOB: 12/03/2006', keep: true },
      { id: 'STD-1087', detail: 'Roll: 1024 · DOB: 12/03/2006', keep: false },
    ],
  },
  {
    name: 'Nusrat Jahan',
    initials: 'NJ',
    entries: [
      { id: 'STD-2031', detail: 'Name + Contact match', keep: true },
      { id: 'STD-2054', detail: 'Name + Contact match', keep: false },
      { id: 'STD-2078', detail: 'Name match only', keep: false },
    ],
  },
  {
    name: 'Karim Hossain',
    initials: 'KH',
    entries: [
      { id: 'STD-3010', detail: 'Roll: 2056 · DOB: 05/07/2005', keep: true },
      { id: 'STD-3044', detail: 'Roll: 2056 · DOB: 05/07/2005', keep: false },
    ],
  },
];

const TOTAL_SCANNED = 342;
const TOTAL_DUPES = MOCK_DUPLICATES.reduce(
  (acc, g) => acc + g.entries.filter((e) => !e.keep).length,
  0
);

export default function RemoveDuplicateStudents() {
  const navigate = useNavigate();
  const [state, setState] = useState('idle'); // idle | scanning | results | done
  const [progress, setProgress] = useState(0);
  const [criteria, setCriteria] = useState(['name', 'roll']);
  const [confirmed, setConfirmed] = useState(false);

  const toggleCriteria = (id) =>
    setCriteria((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleScan = () => {
    if (!criteria.length) return;
    setState('scanning');
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => setState('results'), 400);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  const handleRemove = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setState('done');
  };

  const handleReset = () => {
    setState('idle');
    setProgress(0);
    setConfirmed(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb
            items={['Dashboard', 'Student Setup', 'Remove Duplicates']}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300">
              <ShieldAlert size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Remove Duplicate Students
            </span>
            {state === 'results' && (
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                {TOTAL_DUPES} duplicates found
              </span>
            )}
          </div>

          <div className="p-5">
            {/* ── IDLE: configure & scan ─────────────────────────────── */}
            {state === 'idle' && (
              <>
                {/* Warning notice */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 mb-6">
                  <AlertCircle
                    size={15}
                    className="text-red-500 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-xs text-red-700 dark:text-red-400 leading-relaxed space-y-1">
                    <p>
                      <strong>Before you proceed:</strong>
                    </p>
                    <p>
                      • This tool scans all student records for duplicates based
                      on selected criteria.
                    </p>
                    <p>
                      • You can review all matches before any deletion occurs.
                    </p>
                    <p>
                      • Deleted records <strong>cannot be recovered</strong> —
                      proceed carefully.
                    </p>
                  </div>
                </div>

                {/* Criteria selection */}
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Matching Criteria
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {CRITERIA.map((c) => {
                    const selected = criteria.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCriteria(c.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                          ${
                            selected
                              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                              : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/20 hover:border-blue-300'
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all flex-shrink-0
                          ${
                            selected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}
                        >
                          {selected && (
                            <Check size={11} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {c.label}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {c.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={!criteria.length}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                      ${!criteria.length ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    <Search size={15} /> Scan for Duplicates
                  </button>
                </div>
              </>
            )}

            {/* ── SCANNING ──────────────────────────────────────────── */}
            {state === 'scanning' && (
              <div className="py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw size={26} className="text-blue-500 animate-spin" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Scanning Student Records…
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
                  Comparing {TOTAL_SCANNED} records using {criteria.length}{' '}
                  {criteria.length === 1 ? 'criterion' : 'criteria'}
                </p>
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Scanning…</span>
                    <span className="text-xs font-semibold text-blue-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* ── RESULTS ───────────────────────────────────────────── */}
            {state === 'results' && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: 'Records Scanned',
                      val: TOTAL_SCANNED,
                      color:
                        'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700',
                      valColor: 'text-gray-800 dark:text-gray-100',
                    },
                    {
                      label: 'Duplicates Found',
                      val: TOTAL_DUPES,
                      color:
                        'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800',
                      valColor: 'text-red-600 dark:text-red-400',
                    },
                    {
                      label: 'Unique Records',
                      val: TOTAL_SCANNED - TOTAL_DUPES,
                      color:
                        'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
                      valColor: 'text-green-600 dark:text-green-400',
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`p-3 rounded-xl border text-center ${s.color}`}
                    >
                      <p className={`text-2xl font-bold ${s.valColor}`}>
                        {s.val}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Duplicate groups */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-5">
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Duplicate Groups ({MOCK_DUPLICATES.length})
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ✓ = Original to keep
                    </span>
                  </div>
                  {MOCK_DUPLICATES.map((g, gi) => (
                    <div
                      key={gi}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      {/* Group header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-red-50/50 dark:bg-red-900/10">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                          {g.initials}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex-1">
                          {g.name}
                        </span>
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                          {g.entries.length} entries
                        </span>
                      </div>
                      {/* Entries */}
                      {g.entries.map((entry, ei) => (
                        <div
                          key={ei}
                          className={`flex items-center gap-3 px-4 py-2.5 pl-16 text-xs border-t border-gray-50 dark:border-gray-700/50
                            ${entry.keep ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/20'}`}
                        >
                          {entry.keep ? (
                            <Check
                              size={13}
                              className="text-green-500 flex-shrink-0"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              defaultChecked
                              className="accent-red-500 flex-shrink-0"
                            />
                          )}
                          <code className="text-gray-400 dark:text-gray-500 font-mono">
                            {entry.id}
                          </code>
                          <span className="flex-1 text-gray-600 dark:text-gray-300">
                            {entry.detail}
                          </span>
                          {entry.keep && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              Keep
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Confirm checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer mb-5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 accent-red-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    I understand this action is <strong>irreversible</strong>{' '}
                    and will permanently delete {TOTAL_DUPES} duplicate records.
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ← Back to Setup
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleScan}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RefreshCw size={13} /> Re-scan
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={!confirmed}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                        ${!confirmed ? 'bg-red-300 dark:bg-red-900/40 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 shadow-red-200'}`}
                    >
                      <Trash2 size={15} /> Remove {TOTAL_DUPES} Duplicates
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── DONE ──────────────────────────────────────────────── */}
            {state === 'done' && (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check
                    size={32}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Duplicates Removed Successfully
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  {TOTAL_DUPES} duplicate records have been permanently deleted.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Scan Again
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/AdminDashboard')}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
