// src/pages/super-admin/globalConfigurations/instituteSetup/ProfileSetup.jsx
import React, { useState, useRef } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Globe,
  Phone,
  Eye,
  BookOpen,
  Users,
  FileText,
  ImageIcon,
  Pen,
  Check,
  Upload,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';

/* ── File Fields ─────────────────────────────────────────────────────────── */
const FILE_FIELDS = [
  'mission_img',
  'mission_msg_img',
  'vision_img',
  'vision_msg_img',
  'approach_img',
  'approach_msg_img',
  'welcome_img',
  'about_img',
  'principal_img',
  'principal_says_img',
  'vp_img',
  'vp_says_img',
  'person_one_img',
  'person_one_says_img',
  'person_two_img',
  'person_two_says_img',
  'rules_pdf',
  'logo',
  'principal_signature',
  'convener_signature',
  'headmaster_signature',
  'guide_teacher_signature',
  'exam_controller_signature',
  'header_img',
];

/* ── Initial form state ──────────────────────────────────────────────────── */
const INITIAL_FORM = {
  institute_name_en: '',
  institute_name_bn: '',
  meta_title: '',
  nu_code: '',
  short_code: '',
  college_code: '',
  ein_number: '',
  institute_type: '',
  masking: '',
  website_link: '',
  facebook_link: '',
  youtube_link: '',
  webmail_link: '',
  contact_person: '',
  mobile_no: '',
  phone_no: '',
  web_contact_no: '',
  email: '',
  fax: '',
  address: '',
  mission_msg: '',
  vision_msg: '',
  approach_msg: '',
  about_msg: '',
  principal_name: '',
  principal_msg: '',
  principal_label: '',
  principal_placeholder: '',
  vp_name: '',
  vp_msg: '',
  vp_label: '',
  person_one_msg: '',
  person_one_label: '',
  person_two_msg: '',
  person_two_label: '',
  footer_caption: '',
  show_header: 'Off',
  total_building: '',
  founded_year: '',
  principal_name_sig: '',
  convener_name: '',
  headmaster_name: '',
  guide_teacher_name: '',
  exam_controller_name: '',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
  }`;

const ta = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none min-h-[90px]
  ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
  }`;

function Field({ label, required, error, hint, children, full }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? 'col-span-full' : ''}`}>
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && (
          <span className="normal-case font-normal text-gray-400 dark:text-gray-500 text-xs">
            ({hint})
          </span>
        )}
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

/* ── FileUpload Component ────────────────────────────────────────────────── */
function FileUpload({ label, name, preview, onFileSelect, isPdf, required }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect({ target: { name, files: [file] } });
  };

  const clearFile = (e) => {
    e.stopPropagation();
    onFileSelect({ target: { name, files: [] }, isClear: true });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative group border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500
          rounded-xl cursor-pointer transition-all bg-gray-50 dark:bg-gray-700/40 hover:bg-blue-50/30 dark:hover:bg-blue-900/10
          overflow-hidden min-h-[80px] flex items-center justify-center"
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={isPdf ? 'application/pdf' : 'image/*'}
          onChange={onFileSelect}
          className="hidden"
        />

        {preview ? (
          <>
            {isPdf ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <FileText size={28} className="text-red-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  PDF uploaded
                </span>
                <a
                  href={preview}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  <Eye size={11} /> View PDF
                </a>
              </div>
            ) : (
              <div className="relative w-full">
                <img
                  src={preview}
                  alt={label}
                  className="w-full h-28 object-contain rounded-lg p-1"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
                    Click to change
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X size={10} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 px-3 text-center">
            {isPdf ? (
              <FileText
                size={22}
                className="text-gray-300 dark:text-gray-500 group-hover:text-blue-400 transition-colors"
              />
            ) : (
              <ImageIcon
                size={22}
                className="text-gray-300 dark:text-gray-500 group-hover:text-blue-400 transition-colors"
              />
            )}
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                Click or drag to upload
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {isPdf ? 'PDF only' : 'JPG, PNG, SVG'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Collapsible Section Card ────────────────────────────────────────────── */
function SectionCard({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = true,
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

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function ProfileSetup() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleFile = (e) => {
    const { name } = e.target;
    if (e.isClear) {
      setFiles((p) => {
        const n = { ...p };
        delete n[name];
        return n;
      });
      setPreviews((p) => {
        const n = { ...p };
        delete n[name];
        return n;
      });
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((p) => ({ ...p, [name]: file }));
    setPreviews((p) => ({ ...p, [name]: URL.createObjectURL(file) }));
  };

  const validate = () => {
    const e = {};
    if (!form.institute_name_en.trim())
      e.institute_name_en = 'English name is required';
    if (!form.institute_name_bn.trim())
      e.institute_name_bn = 'Bangla name is required';
    if (!form.institute_type) e.institute_type = 'Institute type is required';
    if (!form.contact_person.trim())
      e.contact_person = 'Contact person is required';
    if (!form.mobile_no.trim()) e.mobile_no = 'Mobile number is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const signatories = [
    'principal',
    'convener',
    'headmaster',
    'guide_teacher',
    'exam_controller',
  ];
  const sigLabel = (s) =>
    s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb
            items={[
              'Dashboard',
              'Global Configurations',
              'Institute Setup',
              'Profile Setup',
            ]}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                <Check size={14} /> Saved!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm shadow-blue-200
                ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                  Saving…
                </>
              ) : (
                <>
                  <Check size={15} /> Save Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── 1. Basic Information ─────────────────────────────────────────── */}
        <SectionCard
          title="Basic Information"
          icon={Building2}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Institute Name (English)"
              required
              error={errors.institute_name_en}
            >
              <input
                data-error={!!errors.institute_name_en}
                name="institute_name_en"
                value={form.institute_name_en}
                onChange={handleInput}
                placeholder="e.g. Dhaka Model College"
                className={inp(errors.institute_name_en)}
              />
            </Field>
            <Field
              label="Institute Name (Bangla)"
              required
              error={errors.institute_name_bn}
            >
              <input
                name="institute_name_bn"
                value={form.institute_name_bn}
                onChange={handleInput}
                placeholder="ঢাকা মডেল কলেজ"
                className={inp(errors.institute_name_bn)}
              />
            </Field>
            <Field
              label="Meta Title"
              required
              error={errors.meta_title}
              hint="for SEO"
            >
              <input
                name="meta_title"
                value={form.meta_title}
                onChange={handleInput}
                placeholder="e.g. Dhaka Model College | Official"
                className={inp(errors.meta_title)}
              />
            </Field>
            <Field
              label="Institute Type"
              required
              error={errors.institute_type}
            >
              <select
                name="institute_type"
                value={form.institute_type}
                onChange={handleInput}
                className={inp(errors.institute_type)}
              >
                <option value="">Select Type</option>
                {['Primary School', 'School', 'College', 'University'].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </Field>
            <Field label="NU Code">
              <input
                name="nu_code"
                value={form.nu_code}
                onChange={handleInput}
                placeholder="National University Code"
                className={inp(false)}
              />
            </Field>
            <Field label="Short Code">
              <input
                name="short_code"
                value={form.short_code}
                onChange={handleInput}
                placeholder="e.g. DMC"
                className={inp(false)}
              />
            </Field>
            <Field label="College Code">
              <input
                name="college_code"
                value={form.college_code}
                onChange={handleInput}
                placeholder="College Code"
                className={inp(false)}
              />
            </Field>
            <Field label="EIN Number">
              <input
                name="ein_number"
                value={form.ein_number}
                onChange={handleInput}
                placeholder="EIN Number"
                className={inp(false)}
              />
            </Field>
            <Field label="Masking" hint="SMS sender ID">
              <input
                name="masking"
                value={form.masking}
                onChange={handleInput}
                placeholder="e.g. DMCollege"
                className={inp(false)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── 2. Web & Social Links ─────────────────────────────────────────── */}
        <SectionCard
          title="Web & Social Links"
          icon={Globe}
          iconColor="bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: 'Website Link',
                name: 'website_link',
                placeholder: 'https://college.edu.bd',
              },
              {
                label: 'Facebook Link',
                name: 'facebook_link',
                placeholder: 'https://facebook.com/page',
              },
              {
                label: 'YouTube Link',
                name: 'youtube_link',
                placeholder: 'https://youtube.com/channel',
              },
              {
                label: 'Webmail Link',
                name: 'webmail_link',
                placeholder: 'Webmail URL',
              },
            ].map((f) => (
              <Field key={f.name} label={f.label}>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleInput}
                  placeholder={f.placeholder}
                  className={inp(false)}
                />
              </Field>
            ))}
          </div>
        </SectionCard>

        {/* ── 3. Contact Information ────────────────────────────────────────── */}
        <SectionCard
          title="Contact Information"
          icon={Phone}
          iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="Contact Person"
              required
              error={errors.contact_person}
            >
              <input
                name="contact_person"
                value={form.contact_person}
                onChange={handleInput}
                placeholder="Full name"
                className={inp(errors.contact_person)}
              />
            </Field>
            <Field label="Mobile No" required error={errors.mobile_no}>
              <input
                name="mobile_no"
                value={form.mobile_no}
                onChange={handleInput}
                placeholder="+880 1X XX-XXXXXX"
                className={inp(errors.mobile_no)}
              />
            </Field>
            <Field label="Phone No">
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleInput}
                placeholder="PABX / Landline"
                className={inp(false)}
              />
            </Field>
            <Field label="Web Contact No">
              <input
                name="web_contact_no"
                value={form.web_contact_no}
                onChange={handleInput}
                placeholder="Public contact"
                className={inp(false)}
              />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="info@college.edu.bd"
                className={inp(errors.email)}
              />
            </Field>
            <Field label="Fax">
              <input
                name="fax"
                value={form.fax}
                onChange={handleInput}
                placeholder="Fax number"
                className={inp(false)}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Full Address" required error={errors.address} full>
              <textarea
                name="address"
                value={form.address}
                onChange={handleInput}
                placeholder="House, Road, Area, District, Bangladesh"
                className={ta(errors.address)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── 4. Mission / Vision / Approach / About ───────────────────────── */}
        {[
          {
            key: 'mission',
            title: 'Mission',
            imgKeys: ['mission_img', 'mission_msg_img'],
          },
          {
            key: 'vision',
            title: 'Vision',
            imgKeys: ['vision_img', 'vision_msg_img'],
          },
          {
            key: 'approach',
            title: 'Approach',
            imgKeys: ['approach_img', 'approach_msg_img'],
          },
        ].map((sec) => (
          <SectionCard
            key={sec.key}
            title={sec.title}
            icon={Eye}
            iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
            defaultOpen={false}
          >
            <div className="space-y-4">
              <Field label={`${sec.title} Message`} full>
                <textarea
                  name={`${sec.key}_msg`}
                  value={form[`${sec.key}_msg`]}
                  onChange={handleInput}
                  placeholder={`Enter ${sec.title} message…`}
                  className={ta(false)}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUpload
                  label={`${sec.title} Image`}
                  name={sec.imgKeys[0]}
                  preview={previews[sec.imgKeys[0]]}
                  onFileSelect={handleFile}
                />
                <FileUpload
                  label={`${sec.title} Message Image`}
                  name={sec.imgKeys[1]}
                  preview={previews[sec.imgKeys[1]]}
                  onFileSelect={handleFile}
                />
              </div>
            </div>
          </SectionCard>
        ))}

        {/* ── About Us ─────────────────────────────────────────────────────── */}
        <SectionCard
          title="About Us"
          icon={Info}
          iconColor="bg-sky-100 dark:bg-sky-800 text-sky-600 dark:text-sky-300"
          defaultOpen={false}
        >
          <div className="space-y-4">
            <Field label="About Message" full>
              <textarea
                name="about_msg"
                value={form.about_msg}
                onChange={handleInput}
                placeholder="About the institute…"
                className={ta(false)}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                label="Welcome Image"
                name="welcome_img"
                preview={previews.welcome_img}
                onFileSelect={handleFile}
              />
              <FileUpload
                label="About Image"
                name="about_img"
                preview={previews.about_img}
                onFileSelect={handleFile}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── 5. Principal / VP / Persons ──────────────────────────────────── */}
        {[
          {
            key: 'principal',
            title: 'Principal',
            icon: Users,
            iconColor:
              'bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-300',
            fields: [
              {
                label: 'Principal Name',
                name: 'principal_name',
                placeholder: 'Full name',
              },
              {
                label: 'Principal Label',
                name: 'principal_label',
                placeholder: 'e.g. Honourable Principal',
              },
              {
                label: 'Placeholder Text',
                name: 'principal_placeholder',
                placeholder: 'Optional placeholder',
              },
            ],
            msgField: 'principal_msg',
            imgKeys: ['principal_img', 'principal_says_img'],
          },
          {
            key: 'vp',
            title: 'Vice Principal',
            icon: Users,
            iconColor:
              'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300',
            fields: [
              {
                label: 'Vice Principal Name',
                name: 'vp_name',
                placeholder: 'Full name',
              },
              {
                label: 'Vice Principal Label',
                name: 'vp_label',
                placeholder: 'e.g. Vice Principal',
              },
            ],
            msgField: 'vp_msg',
            imgKeys: ['vp_img', 'vp_says_img'],
          },
          {
            key: 'person_one',
            title: 'Person One',
            icon: Users,
            iconColor:
              'bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300',
            fields: [
              {
                label: 'Person One Label',
                name: 'person_one_label',
                placeholder: 'e.g. Senior Teacher',
              },
            ],
            msgField: 'person_one_msg',
            imgKeys: ['person_one_img', 'person_one_says_img'],
          },
          {
            key: 'person_two',
            title: 'Person Two',
            icon: Users,
            iconColor:
              'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300',
            fields: [
              {
                label: 'Person Two Label',
                name: 'person_two_label',
                placeholder: 'e.g. Senior Teacher',
              },
            ],
            msgField: 'person_two_msg',
            imgKeys: ['person_two_img', 'person_two_says_img'],
          },
        ].map((sec) => (
          <SectionCard
            key={sec.key}
            title={sec.title}
            icon={sec.icon}
            iconColor={sec.iconColor}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sec.fields.map((f) => (
                  <Field key={f.name} label={f.label}>
                    <input
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleInput}
                      placeholder={f.placeholder}
                      className={inp(false)}
                    />
                  </Field>
                ))}
              </div>
              <Field label={`${sec.title} Message`} full>
                <textarea
                  name={sec.msgField}
                  value={form[sec.msgField]}
                  onChange={handleInput}
                  placeholder={`Enter message…`}
                  className={ta(false)}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sec.imgKeys.map((key) => (
                  <FileUpload
                    key={key}
                    label={key
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    name={key}
                    preview={previews[key]}
                    onFileSelect={handleFile}
                  />
                ))}
              </div>
            </div>
          </SectionCard>
        ))}

        {/* ── 6. Rules PDF ─────────────────────────────────────────────────── */}
        <SectionCard
          title="Rules & Regulations"
          icon={FileText}
          iconColor="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
          defaultOpen={false}
        >
          <div className="max-w-sm">
            <FileUpload
              label="Rules & Regulations PDF"
              name="rules_pdf"
              preview={previews.rules_pdf}
              onFileSelect={handleFile}
              isPdf
            />
          </div>
        </SectionCard>

        {/* ── 7. Footer & Logo ─────────────────────────────────────────────── */}
        <SectionCard
          title="Footer & Logo"
          icon={ImageIcon}
          iconColor="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-4">
              <Field label="Footer Caption" full>
                <textarea
                  name="footer_caption"
                  value={form.footer_caption}
                  onChange={handleInput}
                  placeholder="Footer text shown on website…"
                  className={ta(false)}
                />
              </Field>
            </div>
            <FileUpload
              label="Institute Logo"
              name="logo"
              preview={previews.logo}
              onFileSelect={handleFile}
              required
            />
          </div>
        </SectionCard>

        {/* ── 8. Signatures ────────────────────────────────────────────────── */}
        <SectionCard
          title="Signatures"
          icon={Pen}
          iconColor="bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatories.map((s) => (
              <div
                key={s}
                className="space-y-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20"
              >
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {sigLabel(s)}
                </p>
                <Field label="Name">
                  <input
                    name={`${s}_name`}
                    value={form[`${s}_name`] ?? ''}
                    onChange={handleInput}
                    placeholder="Full name"
                    className={inp(false)}
                  />
                </Field>
                <FileUpload
                  label="Signature Image"
                  name={`${s}_signature`}
                  preview={previews[`${s}_signature`]}
                  onFileSelect={handleFile}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── 9. Header Configuration ──────────────────────────────────────── */}
        <SectionCard
          title="Header Configuration"
          icon={ImageIcon}
          iconColor="bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Show Header Image">
              <select
                name="show_header"
                value={form.show_header}
                onChange={handleInput}
                className={inp(false)}
              >
                <option value="Off">Off</option>
                <option value="On">On</option>
              </select>
            </Field>
            {form.show_header === 'On' && (
              <FileUpload
                label="Header Image"
                name="header_img"
                preview={previews.header_img}
                onFileSelect={handleFile}
              />
            )}
          </div>
        </SectionCard>

        {/* ── 10. Institute Stats ───────────────────────────────────────────── */}
        <SectionCard
          title="Institute Statistics"
          icon={Building2}
          iconColor="bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Total Buildings">
              <input
                type="number"
                name="total_building"
                value={form.total_building}
                onChange={handleInput}
                placeholder="e.g. 3"
                min={0}
                className={inp(false)}
              />
            </Field>
            <Field label="Founded Year">
              <input
                type="number"
                name="founded_year"
                value={form.founded_year}
                onChange={handleInput}
                placeholder="e.g. 1975"
                min={1800}
                max={new Date().getFullYear()}
                className={inp(false)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Save Button (bottom) ─────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-6">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
              <Check size={14} /> Profile saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm shadow-blue-200
              ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                Saving…
              </>
            ) : (
              <>
                <Upload size={15} /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
