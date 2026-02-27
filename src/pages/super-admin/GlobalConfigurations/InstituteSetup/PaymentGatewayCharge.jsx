// src/pages/super-admin/globalConfigurations/instituteSetup/PaymentGatewayCharge.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight, CreditCard, Plus, Eye, Pencil, X, Check, AlertCircle,
  ToggleLeft, ToggleRight, Percent, DollarSign,
} from 'lucide-react';

/* ── Reference Data ──────────────────────────────────────────────────────── */
const GATEWAY_OPTIONS = ['Bkash', 'Nagad', 'DBBL', 'Rupali Cash', 'SSL Wireless', 'Ekpay'];
const API_CONFIG_OPTIONS = {
  Bkash:        ['Bkash Payment Gateway', 'Bkash Sandbox'],
  Nagad:        ['Nagad Payment Gateway', 'Nagad Sandbox'],
  DBBL:         ['DBBL Payment Gateway'],
  'Rupali Cash':['Rupali Cash Gateway'],
  'SSL Wireless':['SSL Wireless Production', 'SSL Wireless Sandbox'],
  Ekpay:        ['Ekpay Gateway'],
};

const INITIAL_CHARGES = [
  {
    id: 1, gateway: 'Bkash', apiConfig: 'Bkash Payment Gateway',
    extraChargeRate: '1.5', minChargeAmount: '10',
    softbdChargeRate: '0.5', softbdChargeTrack: 'No',
    isFixedCharge: 'No', chargeAmount: '1.5', status: true,
  },
  {
    id: 2, gateway: 'DBBL', apiConfig: 'DBBL Payment Gateway',
    extraChargeRate: '2', minChargeAmount: '20',
    softbdChargeRate: '0.8', softbdChargeTrack: 'Yes',
    isFixedCharge: 'Yes', chargeAmount: '25', status: true,
  },
];

const EMPTY_FORM = {
  gateway: '', apiConfig: '', extraChargeRate: '', minChargeAmount: '',
  softbdChargeRate: '', softbdChargeTrack: 'No',
  isFixedCharge: 'No', chargeAmount: '0', status: true,
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = (err, disabled) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all
  ${disabled
    ? 'bg-gray-100 dark:bg-gray-700/40 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
    : err
      ? 'bg-gray-50 dark:bg-gray-700 dark:text-white border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
      : 'bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1
          ? 'text-gray-700 dark:text-gray-200 font-medium'
          : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

function Toggle({ enabled, onToggle, loading }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
        ${enabled
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          : 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'}
        ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {enabled ? 'Active' : 'Inactive'}
    </button>
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
function ChargeModal({ mode, data, errors, onChange, onSave, onClose }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const configOptions = data.gateway ? (API_CONFIG_OPTIONS[data.gateway] || []) : [];

  // Auto-calc charge amount when not fixed
  const effectiveChargeAmount = data.isFixedCharge === 'No'
    ? (data.extraChargeRate || '0')
    : data.chargeAmount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 z-10
          ${isView ? 'bg-gray-50 dark:bg-gray-700/30'
            : isEdit ? 'bg-amber-50 dark:bg-amber-900/10'
            : 'bg-blue-50 dark:bg-blue-900/10'}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {isView ? <Eye size={15} className="text-gray-500" />
              : isEdit ? <Pencil size={15} className="text-amber-500" />
              : <Plus size={15} className="text-blue-500" />}
            {isView ? 'View' : isEdit ? 'Edit' : 'Add New'} Gateway Charge Config
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex items-center justify-center transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isView ? (
            /* ── View Mode: Read-only summary ── */
            <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-700">
              {[
                ['Gateway',             data.gateway],
                ['API Config',          data.apiConfig],
                ['Extra Charge Rate',   `${data.extraChargeRate}%`],
                ['Min Charge Amount',   `৳${data.minChargeAmount}`],
                ['SoftBD Charge Rate',  `${data.softbdChargeRate}%`],
                ['SoftBD Charge Track', data.softbdChargeTrack],
                ['Is Fixed Charge?',    data.isFixedCharge],
                ['Charge Amount',       `৳${effectiveChargeAmount}`],
                ['Status',              data.status ? 'Active' : 'Inactive'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</dt>
                  <dd className={`text-sm font-medium ${label === 'Status' && data.status ? 'text-green-600 dark:text-green-400' : label === 'Status' ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          ) : (
            /* ── Add / Edit Form ── */
            <div className="space-y-5">
              {/* Row 1: Gateway + API Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Gateway" required error={errors.gateway}>
                  <select name="gateway" value={data.gateway} onChange={onChange} className={inp(errors.gateway, false)}>
                    <option value="">Select Gateway</option>
                    {GATEWAY_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Payment API Config" required error={errors.apiConfig}>
                  <select name="apiConfig" value={data.apiConfig} onChange={onChange}
                    disabled={!data.gateway} className={inp(errors.apiConfig, !data.gateway)}>
                    <option value="">Select Config</option>
                    {configOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row 2: Charge Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Extra Charge Rate (%)" required error={errors.extraChargeRate}>
                  <div className="relative">
                    <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="number" step="0.01" name="extraChargeRate" value={data.extraChargeRate}
                      onChange={onChange} placeholder="e.g. 1.5" min={0} className={`${inp(errors.extraChargeRate, false)} pr-8`} />
                  </div>
                </Field>
                <Field label="Min Charge Amount (৳)" error={errors.minChargeAmount}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">৳</span>
                    <input type="number" step="0.01" name="minChargeAmount" value={data.minChargeAmount}
                      onChange={onChange} placeholder="e.g. 10" min={0} className={`${inp(false, false)} pl-7`} />
                  </div>
                </Field>
                <Field label="SoftBD Charge Rate (%)">
                  <div className="relative">
                    <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="number" step="0.01" name="softbdChargeRate" value={data.softbdChargeRate}
                      onChange={onChange} placeholder="e.g. 0.5" min={0} className={`${inp(false, false)} pr-8`} />
                  </div>
                </Field>
              </div>

              {/* Row 3: Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="SoftBD Charge Track">
                  <select name="softbdChargeTrack" value={data.softbdChargeTrack} onChange={onChange} className={inp(false, false)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </Field>
                <Field label="Is Fixed Charge?">
                  <select name="isFixedCharge" value={data.isFixedCharge} onChange={onChange} className={inp(false, false)}>
                    <option value="No">No — use rate %</option>
                    <option value="Yes">Yes — fixed amount</option>
                  </select>
                </Field>
              </div>

              {/* Conditional: Fixed charge amount */}
              {data.isFixedCharge === 'Yes' && (
                <Field label="Fixed Charge Amount (৳)" required error={errors.chargeAmount}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">৳</span>
                    <input type="number" step="0.01" name="chargeAmount" value={data.chargeAmount}
                      onChange={onChange} placeholder="e.g. 25" min={0} className={`${inp(errors.chargeAmount, false)} pl-7`} />
                  </div>
                </Field>
              )}

              {/* Auto-calculated display */}
              <div className={`flex items-center justify-between p-3.5 rounded-xl border
                ${data.isFixedCharge === 'No'
                  ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-100 dark:border-blue-800'
                  : 'bg-purple-50 dark:bg-purple-900/15 border-purple-100 dark:border-purple-800'}`}>
                <div className="flex items-center gap-2">
                  <DollarSign size={15} className={data.isFixedCharge === 'No' ? 'text-blue-500' : 'text-purple-500'} />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Effective Charge Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  ৳{effectiveChargeAmount || '0'}
                  {data.isFixedCharge === 'No' && data.extraChargeRate && (
                    <span className="text-xs font-normal text-gray-400 ml-1">(= rate%)</span>
                  )}
                </span>
              </div>

              {/* Status */}
              <Field label="Status">
                <select name="status" value={String(data.status)}
                  onChange={e => onChange({ target: { name: 'status', value: e.target.value === 'true' } })}
                  className={inp(false, false)}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700
              border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600
                hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <Check size={14} /> {isEdit ? 'Save Changes' : 'Add Config'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function PaymentGatewayCharge() {
  const [charges, setCharges]     = useState(INITIAL_CHARGES);
  const [modal, setModal]         = useState(null); // { mode, data }
  const [modalErrors, setModalErrors] = useState({});
  const [toggling, setToggling]   = useState({});
  const [search, setSearch]       = useState('');

  const filtered = useMemo(() =>
    charges.filter(c =>
      `${c.gateway} ${c.apiConfig}`.toLowerCase().includes(search.toLowerCase())
    ), [charges, search]);

  /* Auto-calculate chargeAmount when extraChargeRate changes and isFixedCharge = No */
  useEffect(() => {
    if (!modal || modal.mode === 'view') return;
    if (modal.data.isFixedCharge === 'No') {
      setModal(p => ({
        ...p,
        data: { ...p.data, chargeAmount: p.data.extraChargeRate || '0' },
      }));
    }
  }, [modal?.data?.extraChargeRate, modal?.data?.isFixedCharge]);

  /* Modal helpers */
  const openAdd  = () => { setModalErrors({}); setModal({ mode: 'add',  data: { ...EMPTY_FORM } }); };
  const openView = c  => setModal({ mode: 'view', data: { ...c } });
  const openEdit = c  => { setModalErrors({}); setModal({ mode: 'edit', data: { ...c } }); };
  const closeModal = () => setModal(null);

  const handleModalChange = e => {
    const { name, value } = e.target;
    setModal(p => ({ ...p, data: { ...p.data, [name]: value } }));
    if (modalErrors[name]) setModalErrors(p => ({ ...p, [name]: undefined }));
    // Reset apiConfig if gateway changes
    if (name === 'gateway') {
      setModal(p => ({ ...p, data: { ...p.data, gateway: value, apiConfig: '' } }));
    }
  };

  const validate = d => {
    const e = {};
    if (!d.gateway)            e.gateway          = 'Gateway is required';
    if (!d.apiConfig)          e.apiConfig        = 'API config is required';
    if (!d.extraChargeRate)    e.extraChargeRate   = 'Charge rate is required';
    if (d.isFixedCharge === 'Yes' && !d.chargeAmount) e.chargeAmount = 'Charge amount is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate(modal.data);
    if (Object.keys(errs).length) { setModalErrors(errs); return; }
    // Auto-fill chargeAmount if not fixed
    const finalData = {
      ...modal.data,
      chargeAmount: modal.data.isFixedCharge === 'No'
        ? modal.data.extraChargeRate
        : modal.data.chargeAmount,
    };
    if (modal.mode === 'edit') {
      setCharges(p => p.map(c => c.id === finalData.id ? finalData : c));
    } else {
      setCharges(p => [...p, { ...finalData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleToggle = id => {
    const charge = charges.find(c => c.id === id);
    if (!window.confirm(`Turn ${charge.status ? 'OFF' : 'ON'} status for "${charge.gateway}"?`)) return;
    setToggling(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setCharges(p => p.map(c => c.id === id ? { ...c, status: !c.status } : c));
      setToggling(p => ({ ...p, [id]: false }));
    }, 800);
  };

  const stats = [
    { label: 'Total Configs', value: charges.length, bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
    { label: 'Active',        value: charges.filter(c => c.status).length, bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
    { label: 'Inactive',      value: charges.filter(c => !c.status).length, bg: 'bg-red-50 dark:bg-red-900/20', icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Payment Gateway Charge']} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                <CreditCard size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <CreditCard size={16} className="text-blue-500" /> Gateway Charge Config List
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-3 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-44 transition-all" />
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Plus size={14} /> Add Config
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Gateway', 'API Config', 'Charge Rate', 'Fixed?', 'Charge Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                    No charge configs found.
                  </td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-2.5 py-1 rounded-md font-semibold">
                        {c.gateway}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{c.apiConfig}</td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{c.extraChargeRate}%</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        ${c.isFixedCharge === 'Yes'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        {c.isFixedCharge === 'Yes' ? 'Fixed' : 'Rate %'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                      ৳{c.chargeAmount}
                    </td>
                    <td className="px-5 py-4">
                      <Toggle enabled={c.status} onToggle={() => handleToggle(c.id)} loading={toggling[c.id]} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openView(c)} title="View"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(c)} title="Edit"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {charges.length} entries
          </div>
        </div>
      </div>

      {modal && (
        <ChargeModal
          mode={modal.mode} data={modal.data} errors={modalErrors}
          onChange={handleModalChange} onSave={handleSave} onClose={closeModal}
        />
      )}
    </DashboardLayout>
  );
}