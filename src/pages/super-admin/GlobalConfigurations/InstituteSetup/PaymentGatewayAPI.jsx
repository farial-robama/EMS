// src/pages/super-admin/globalConfigurations/instituteSetup/PaymentGatewayAPI.jsx
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight, CreditCard, Plus, Search, Pencil, Eye, X, Check,
  AlertCircle, ToggleLeft, ToggleRight,
} from 'lucide-react';

/* ── Reference Data ──────────────────────────────────────────────────────── */
const CODE_OPTIONS = [
  'Bkash', 'Rupali Cash', 'DBBL', 'Nagad', 'Ekpay',
  'Sonali Pay', 'Upay', 'Paystation', 'Cellfin', 'Tap', 'SSL Wireless',
];
const MODE_OPTIONS = ['Sandbox', 'Production'];

// Per-gateway credential field definitions
const API_FIELDS = {
  'Bkash':       { production: ['App Key','App Secret','Username','Password'],            sandbox: ['App Key','App Secret','Username','Password'] },
  'Rupali Cash': { production: ['Username','Password'],                                   sandbox: ['Username','Password'] },
  'DBBL':        { production: ['Username','Password','Client IP'],                       sandbox: ['Username','Password','Client IP'] },
  'Nagad':       { production: ['AppAccount','MerchantId','MerchantPrivateKey','PGPublicKey'], sandbox: ['AppAccount','MerchantId','MerchantPrivateKey','PGPublicKey'] },
  'Ekpay':       { production: ['MerchantId','MerchantRegKey','MacAddress'],              sandbox: ['MerchantId','MerchantRegKey','MacAddress'] },
  'Sonali Pay':  { production: ['Username','Password','AuthKey'],                         sandbox: ['Username','Password','AuthKey'] },
  'Upay':        { production: ['MerchantId','MerchantKey','MerchantName','MerchantCode','MerchantCity','MerchantPhone'], sandbox: ['MerchantId','MerchantKey','MerchantName','MerchantCode','MerchantCity','MerchantPhone'] },
  'Paystation':  { production: ['Username','Password'],                                   sandbox: ['Username','Password'] },
  'Cellfin':     { production: ['MerchantId','Password'],                                 sandbox: ['MerchantId','Password'] },
  'Tap':         { production: [],                                                        sandbox: [] },
  'SSL Wireless':{ production: ['StoreID','StorePassword'],                               sandbox: ['StoreID','StorePassword'] },
};

const INITIAL_APIS = [
  {
    id: 1, title: 'Bkash Payment Gateway', code: 'Bkash', mode: 'Production',
    status: true, enableForAccounts: true,
    credentials: { production: {}, sandbox: {} },
  },
  {
    id: 2, title: 'Nagad Payment Gateway', code: 'Nagad', mode: 'Production',
    status: true, enableForAccounts: false,
    credentials: { production: {}, sandbox: {} },
  },
];

const EMPTY_FORM = {
  title: '', code: '', mode: '', status: true, enableForAccounts: false,
  credentials: { production: {}, sandbox: {} },
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = err =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err
    ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1
          ? 'text-gray-700 dark:text-gray-200 font-medium'
          : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

/* ── Toggle Switch ───────────────────────────────────────────────────────── */
function Toggle({ enabled, onToggle, loading }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
        ${enabled
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          : 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {enabled ? 'On' : 'Off'}
    </button>
  );
}

/* ── Credential Section (in modal) ──────────────────────────────────────── */
function CredentialSection({ code, credentials, onChange, readOnly }) {
  if (!code || !API_FIELDS[code]) return null;
  const fields = API_FIELDS[code];
  if (!fields.production.length && !fields.sandbox.length) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 italic pt-4 border-t border-gray-100 dark:border-gray-700">
        No credential fields required for {code}.
      </p>
    );
  }

  const renderSection = (section, label, dotColor) => {
    if (!fields[section]?.length) return null;
    return (
      <div className="space-y-3">
        <h5 className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {label} Credentials
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields[section].map(field => {
            const key = field.replace(/\s+/g, '_');
            return (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field}</label>
                {readOnly ? (
                  <div className="px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-mono text-gray-700 dark:text-gray-300 min-h-[38px]">
                    {credentials?.[section]?.[key] || <span className="text-gray-400 dark:text-gray-500 italic not-italic text-xs">Not set</span>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={credentials?.[section]?.[key] || ''}
                    onChange={e => onChange(section, key, e.target.value)}
                    placeholder={`Enter ${field}`}
                    className={inp(false)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 space-y-5">
      {renderSection('production', 'Production', 'bg-green-500')}
      {renderSection('sandbox', 'Sandbox', 'bg-amber-500')}
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
function GatewayModal({ mode, data, errors, onFieldChange, onCredChange, onSave, onClose }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

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
            {isView ? 'View' : isEdit ? 'Edit' : 'Add New'} Payment Gateway
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex items-center justify-center transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isView ? (
            <>
              <dl className="divide-y divide-gray-50 dark:divide-gray-700">
                {[
                  ['Title',               data.title],
                  ['Gateway Code',        data.code],
                  ['API Mode',            data.mode],
                  ['Status',              data.status ? 'Active' : 'Inactive'],
                  ['Enable for Accounts', data.enableForAccounts ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</dt>
                    <dd className={`text-sm font-medium ${value === 'Active' || value === 'Yes' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'}`}>{value}</dd>
                  </div>
                ))}
              </dl>
              <CredentialSection
                code={data.code}
                credentials={data.credentials}
                readOnly
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Title" required error={errors.title}>
                    <input name="title" value={data.title} onChange={onFieldChange}
                      placeholder="e.g. Bkash Payment Gateway" autoFocus className={inp(errors.title)} />
                  </Field>
                </div>
                <Field label="Gateway Code" required error={errors.code}>
                  <select name="code" value={data.code} onChange={onFieldChange} className={inp(errors.code)}>
                    <option value="">Select Code</option>
                    {CODE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="API Mode" required error={errors.mode}>
                  <select name="mode" value={data.mode} onChange={onFieldChange} className={inp(errors.mode)}>
                    <option value="">Select Mode</option>
                    {MODE_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={String(data.status)}
                    onChange={e => onFieldChange({ target: { name: 'status', value: e.target.value === 'true' } })}
                    className={inp(false)}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </Field>
                <Field label="Enable for Accounts Payment">
                  <select
                    value={String(data.enableForAccounts)}
                    onChange={e => onFieldChange({ target: { name: 'enableForAccounts', value: e.target.value === 'true' } })}
                    className={inp(false)}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              </div>
              <CredentialSection
                code={data.code}
                credentials={data.credentials}
                onChange={onCredChange}
              />
            </>
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
              <Check size={14} /> {isEdit ? 'Save Changes' : 'Add Gateway'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function PaymentGatewayAPI() {
  const [apis, setApis]               = useState(INITIAL_APIS);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null); // { mode, data }
  const [modalErrors, setModalErrors] = useState({});
  const [toggling, setToggling]       = useState({}); // { `${id}-field`: true }

  const filtered = useMemo(() =>
    apis.filter(a =>
      `${a.title} ${a.code} ${a.mode}`.toLowerCase().includes(search.toLowerCase())
    ), [apis, search]);

  /* modal helpers */
  const openView = api => setModal({ mode: 'view', data: deepClone(api) });
  const openEdit = api => { setModalErrors({}); setModal({ mode: 'edit', data: deepClone(api) }); };
  const openAdd  = ()  => { setModalErrors({}); setModal({ mode: 'add',  data: deepClone(EMPTY_FORM) }); };
  const closeModal = () => setModal(null);

  const deepClone = obj => JSON.parse(JSON.stringify(obj));

  const handleFieldChange = e => {
    const { name, value } = e.target;
    setModal(p => ({ ...p, data: { ...p.data, [name]: value } }));
    if (modalErrors[name]) setModalErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleCredChange = (section, field, value) => {
    setModal(p => ({
      ...p,
      data: {
        ...p.data,
        credentials: {
          ...p.data.credentials,
          [section]: { ...p.data.credentials[section], [field]: value },
        },
      },
    }));
  };

  const validate = d => {
    const e = {};
    if (!d.title?.trim()) e.title = 'Title is required';
    if (!d.code)          e.code  = 'Gateway code is required';
    if (!d.mode)          e.mode  = 'API mode is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate(modal.data);
    if (Object.keys(errs).length) { setModalErrors(errs); return; }
    if (modal.mode === 'edit') {
      setApis(p => p.map(a => a.id === modal.data.id ? modal.data : a));
    } else {
      setApis(p => [...p, { ...modal.data, id: Date.now() }]);
    }
    closeModal();
  };

  /* toggle with optimistic update + 800ms simulated delay */
  const handleToggle = (id, field) => {
    const api = apis.find(a => a.id === id);
    const label = field === 'status' ? 'status' : 'accounts payment';
    if (!window.confirm(`Turn ${api[field] ? 'OFF' : 'ON'} ${label} for "${api.title}"?`)) return;
    const key = `${id}-${field}`;
    setToggling(p => ({ ...p, [key]: true }));
    setTimeout(() => {
      setApis(p => p.map(a => a.id === id ? { ...a, [field]: !a[field] } : a));
      setToggling(p => ({ ...p, [key]: false }));
    }, 800);
  };

  /* stats */
  const stats = [
    { label: 'Total Gateways',   value: apis.length,                                 bg: 'bg-blue-50 dark:bg-blue-900/20',    icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
    { label: 'Active',           value: apis.filter(a => a.status).length,            bg: 'bg-green-50 dark:bg-green-900/20',  icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' },
    { label: 'Accounts Enabled', value: apis.filter(a => a.enableForAccounts).length, bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <Breadcrumb items={['Dashboard', 'Global Configurations', 'Institute Setup', 'Payment Gateway API']} />

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

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <CreditCard size={16} className="text-blue-500" /> Payment Gateway List
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search gateways..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500
                    focus:ring-2 focus:ring-blue-100 w-52 transition-all"
                />
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                  bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200">
                <Plus size={14} /> Add Gateway
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['#', 'Title', 'Code', 'API Mode', 'Status', 'Accounts Enabled', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <CreditCard size={36} className="mx-auto text-gray-200 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {search ? 'No gateways match your search.' : 'No payment gateways configured yet.'}
                      </p>
                      {!search && (
                        <button onClick={openAdd}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <Plus size={13} /> Add your first gateway
                        </button>
                      )}
                    </td>
                  </tr>
                ) : filtered.map((api, i) => (
                  <tr key={api.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 w-12">{i + 1}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">{api.title}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400
                        border border-blue-100 dark:border-blue-800 px-2.5 py-1 rounded-md">
                        {api.code}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                        ${api.mode === 'Production'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {api.mode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Toggle
                        enabled={api.status}
                        onToggle={() => handleToggle(api.id, 'status')}
                        loading={toggling[`${api.id}-status`]}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <Toggle
                        enabled={api.enableForAccounts}
                        onToggle={() => handleToggle(api.id, 'enableForAccounts')}
                        loading={toggling[`${api.id}-enableForAccounts`]}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openView(api)} title="View"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                            hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400
                            flex items-center justify-center transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(api)} title="Edit"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700
                            hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600
                            text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all">
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {apis.length} entries
          </div>
        </div>

      </div>

      {modal && (
        <GatewayModal
          mode={modal.mode}
          data={modal.data}
          errors={modalErrors}
          onFieldChange={handleFieldChange}
          onCredChange={handleCredChange}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </DashboardLayout>
  );
}