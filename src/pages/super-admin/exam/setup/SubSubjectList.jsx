import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Check,
  Trash2,
  ChevronRight,
  BookOpen,
  Info,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const INITIAL = [
  {
    id: 1,
    name: 'CQ',
    code: 'CQ',
    affectPassFail: false,
    appearMarksheet: false,
    excludeTotal: false,
  },
  {
    id: 2,
    name: 'MCQ',
    code: 'MCQ',
    affectPassFail: false,
    appearMarksheet: false,
    excludeTotal: false,
  },
  {
    id: 3,
    name: 'Pra.',
    code: 'PRACT',
    affectPassFail: false,
    appearMarksheet: false,
    excludeTotal: false,
  },
  {
    id: 4,
    name: 'Assig./Eval.',
    code: 'CLASS_EV',
    affectPassFail: false,
    appearMarksheet: false,
    excludeTotal: false,
  },
];

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

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none
        ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export default function SubSubjectList() {
  const [items, setItems] = useState(INITIAL);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    const id = Date.now();
    setItems((p) => [
      ...p,
      {
        id,
        name: '',
        code: '',
        affectPassFail: false,
        appearMarksheet: false,
        excludeTotal: false,
      },
    ]);
    setEditingId(id);
  };

  const update = (id, field, val) =>
    setItems((p) => p.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const remove = (id) => {
    setItems((p) => p.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  const handleSave = async (id) => {
    setSaving(id);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setEditingId(null);
  };

  const TOGGLE_COLS = [
    { label: 'Affect Pass/Fail?', field: 'affectPassFail' },
    { label: 'Appear on Marksheet?', field: 'appearMarksheet' },
    { label: 'Exclude from Total?', field: 'excludeTotal' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb
              items={['Dashboard', 'Exam & Result', 'Sub Subject List']}
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen size={22} className="text-violet-500" /> Exam Sub
              Subject List
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Define and configure exam type components (CQ, MCQ, Practical,
              etc.)
            </p>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm shadow-violet-200 flex-shrink-0"
          >
            <Plus size={15} /> Add Sub Subject
          </button>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <p className="font-semibold">How to use sub-subjects:</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-600 dark:text-blue-500">
              <li>
                Click <strong>Edit</strong> on a row to modify its name, code,
                and toggle settings
              </li>
              <li>
                <strong>Affect Pass/Fail</strong> — marks from this type count
                toward pass/fail calculation
              </li>
              <li>
                <strong>Appear on Marksheet</strong> — this type will be shown
                on printed marksheets and tabulation sheets
              </li>
              <li>
                <strong>Exclude from Total</strong> — marks will NOT be added to
                total/full marks aggregate
              </li>
            </ul>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Sub Subject Types
              </span>
              <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                {items.length} types
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '860px' }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12">
                    #
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Exam Type Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Code
                  </th>
                  {TOGGLE_COLS.map((c) => (
                    <th
                      key={c.field}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <BookOpen
                        size={32}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-2"
                      />
                      <p className="text-sm text-gray-400">
                        No sub-subjects yet. Click "Add Sub Subject" to get
                        started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((sub, i) => {
                    const isEditing = editingId === sub.id;
                    return (
                      <tr
                        key={sub.id}
                        className={`transition-colors ${isEditing ? 'bg-violet-50/40 dark:bg-violet-900/5' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/20'}`}
                      >
                        <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">
                          {i + 1}
                        </td>

                        {/* Name */}
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <input
                              value={sub.name}
                              onChange={(e) =>
                                update(sub.id, 'name', e.target.value)
                              }
                              placeholder="e.g. CQ, MCQ, Practical…"
                              autoFocus
                              className="w-full px-3 py-2 text-sm rounded-lg border border-violet-300 dark:border-violet-700 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {sub.name || (
                                <span className="text-gray-300 dark:text-gray-600 font-normal italic text-xs">
                                  Untitled
                                </span>
                              )}
                            </span>
                          )}
                        </td>

                        {/* Code */}
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <input
                              value={sub.code}
                              onChange={(e) =>
                                update(
                                  sub.id,
                                  'code',
                                  e.target.value.toUpperCase()
                                )
                              }
                              placeholder="CODE"
                              maxLength={10}
                              className="w-28 px-3 py-2 text-sm rounded-lg border border-violet-300 dark:border-violet-700 bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 font-mono uppercase"
                            />
                          ) : (
                            <span className="text-xs font-mono font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                              {sub.code || '—'}
                            </span>
                          )}
                        </td>

                        {/* Toggle columns */}
                        {TOGGLE_COLS.map((col) => (
                          <td key={col.field} className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <Toggle
                                checked={sub[col.field]}
                                onChange={() =>
                                  isEditing &&
                                  update(sub.id, col.field, !sub[col.field])
                                }
                                disabled={!isEditing}
                              />
                              <span
                                className={`text-xs font-semibold transition-colors ${sub[col.field] ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
                              >
                                {sub[col.field] ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </td>
                        ))}

                        {/* Actions */}
                        <td className="px-5 py-4 pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSave(sub.id)}
                                  disabled={saving === sub.id}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm disabled:opacity-60"
                                >
                                  {saving === sub.id ? (
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Check size={12} />
                                  )}
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setEditingId(sub.id)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteId(sub.id)}
                              className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100 dark:border-red-900"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer hint */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {items.length} sub-subject type{items.length !== 1 ? 's' : ''}{' '}
                configured · Click <strong>Edit</strong> on any row to modify
                toggles
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirm */}
        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
                Delete Sub-Subject?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  "{items.find((s) => s.id === deleteId)?.name || 'this item'}"
                </span>{' '}
                will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => remove(deleteId)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
