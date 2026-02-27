import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Check,
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Upload,
  AlertCircle,
  ImageIcon,
  Copy,
} from 'lucide-react';

/* ─── Shared style helpers (identical to AddSingleStudent) ───────────────── */
const inp = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
  }`;

const roInp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none';

const fileInp =
  'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all outline-none';

const taCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none min-h-[80px] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
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

function PhotoUpload({ name, label, preview, onChange }) {
  const ref = useRef(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => ref.current?.click()}
        className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700/40 cursor-pointer flex items-center justify-center overflow-hidden group transition-all"
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-400 transition-colors">
            <ImageIcon size={24} />
            <span className="text-xs">Upload</span>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

const INITIAL = {
  employeeId: '',
  eduLevel: '',
  department: '',
  fullNameEn: '',
  fullNameBn: '',
  fatherName: '',
  motherName: '',
  dob: '',
  gender: '',
  religion: '',
  bloodGroup: '',
  nationalId: '',
  birthPlace: '',
  responsibility: '',
  designation: '',
  joiningDate: '',
  batchId: '',
  indexNo: '',
  teacherPicture: null,
  presentAddress: '',
  permanentAddress: '',
  contactPhone: '',
  mobileNo: '',
  email: '',
  bcsBatch: '',
  degreeName: '',
  divisionGPA: '',
  obtainYear: '',
  boardUniversity: '',
  otherDegreeName: '',
  otherDivisionGPA: '',
  otherObtainYear: '',
  otherBoardUniversity: '',
  resume: null,
  employeeType: 'Teacher',
  instituteName: '',
  position: '',
  experienceYear: '',
  officeAddress: '',
  attendanceId: '',
  timeSchedule: '',
  ordering: '',
};

export default function AddTeacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      employeeId: `EMP${String(Date.now()).slice(-6)}`,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.[0]) {
      setFormData((p) => ({ ...p, [name]: files[0] }));
      setPreviews((p) => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const sel = (name, options, err, disabled) => (
    <select
      name={name}
      value={formData[name]}
      onChange={handleChange}
      disabled={disabled}
      className={
        disabled
          ? 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/40 text-gray-400 cursor-not-allowed outline-none'
          : inp(err)
      }
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const validate = () => {
    const e = {};
    if (!formData.fullNameEn.trim())
      e.fullNameEn = 'Full name (English) is required';
    if (!formData.gender) e.gender = 'Gender is required';
    if (!formData.designation.trim()) e.designation = 'Designation is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    if (!formData.department) e.department = 'Department is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setFormData({
      ...INITIAL,
      employeeId: `EMP${String(Date.now()).slice(-6)}`,
    });
    setPreviews({});
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb items={['Dashboard', 'Teacher Setup', 'Add Teacher']} />
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm flex-shrink-0
              ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                Saving…
              </>
            ) : (
              <>
                <Check size={15} /> Add Teacher
              </>
            )}
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
            <Check size={16} /> Teacher / Employee registered successfully!
          </div>
        )}

        {/* ── 1. Personal Information ───────────────────────────────────── */}
        <SectionCard
          title="Personal Information"
          icon={User}
          iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
          badge="Required"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <PhotoUpload
                name="teacherPicture"
                label="Staff Photo"
                preview={previews.teacherPicture}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <F label="Employee ID">
                <div className="flex gap-2">
                  <input
                    value={formData.employeeId}
                    readOnly
                    className={roInp}
                  />
                  <button
                    type="button"
                    title="Copy ID"
                    onClick={() =>
                      navigator.clipboard?.writeText(formData.employeeId)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 text-gray-500 transition-all"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </F>
              <F label="Full Name (English)" required error={errors.fullNameEn}>
                <input
                  name="fullNameEn"
                  value={formData.fullNameEn}
                  onChange={handleChange}
                  placeholder="Full name in English"
                  className={inp(errors.fullNameEn)}
                />
              </F>
              <F label="Full Name (Bangla)">
                <input
                  name="fullNameBn"
                  value={formData.fullNameBn}
                  onChange={handleChange}
                  placeholder="বাংলায় নাম লিখুন"
                  className={inp(false)}
                />
              </F>
              <F label="Date of Birth">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={inp(false)}
                />
              </F>
              <F label="Gender" required error={errors.gender}>
                {sel('gender', ['Male', 'Female', 'Other'], errors.gender)}
              </F>
              <F label="Religion">
                {sel(
                  'religion',
                  ['Islam', 'Hindu', 'Christian', 'Buddhist', 'Other'],
                  false
                )}
              </F>
              <F label="Blood Group">
                {sel(
                  'bloodGroup',
                  ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
                  false
                )}
              </F>
              <F label="National ID">
                <input
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={inp(false)}
                />
              </F>
              <F label="Birth Place">
                <input
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  className={inp(false)}
                />
              </F>
              <F label="Country">
                <input value="BANGLADESH" readOnly className={roInp} />
              </F>
              <F label="Nationality">
                <input value="Bangladeshi" readOnly className={roInp} />
              </F>
              <F label="Father / Husband Name">
                <input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={inp(false)}
                />
              </F>
              <F label="Mother Name">
                <input
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className={inp(false)}
                />
              </F>
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Professional Details ───────────────────────────────────── */}
        <SectionCard
          title="Professional Details"
          icon={Briefcase}
          iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
          badge="Required"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <F label="Employee Type">
              {sel('employeeType', ['Teacher', 'Employee'], false)}
            </F>
            <F label="Educational Level">
              {sel(
                'eduLevel',
                ['Higher Secondary', 'Graduate', 'Post-Graduate', 'PhD'],
                false
              )}
            </F>
            <F label="Department" required error={errors.department}>
              {sel(
                'department',
                ['Science', 'Arts', 'Commerce', 'Engineering', 'Humanities'],
                errors.department
              )}
            </F>
            <F label="Designation" required error={errors.designation}>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Teacher"
                className={inp(errors.designation)}
              />
            </F>
            <F label="Responsibility">
              <input
                name="responsibility"
                value={formData.responsibility}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Joining Date">
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Batch ID">
              <input
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Index No.">
              <input
                name="indexNo"
                value={formData.indexNo}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Attendance Machine ID">
              <input
                name="attendanceId"
                value={formData.attendanceId}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Time Schedule">
              <input
                name="timeSchedule"
                value={formData.timeSchedule}
                onChange={handleChange}
                placeholder="e.g. 8:00 AM – 2:00 PM"
                className={inp(false)}
              />
            </F>
            <F label="Display Ordering">
              <input
                type="number"
                name="ordering"
                value={formData.ordering}
                onChange={handleChange}
                min={0}
                className={inp(false)}
              />
            </F>
          </div>
        </SectionCard>

        {/* ── 3. Contact Information ────────────────────────────────────── */}
        <SectionCard
          title="Contact Information"
          icon={Phone}
          iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <F label="Email Address" required error={errors.email}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={inp(errors.email)}
              />
            </F>
            <F label="Mobile No.">
              <input
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="+880 1X XX-XXXXXX"
                className={inp(false)}
              />
            </F>
            <F label="Phone">
              <input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="BCS Batch No.">
              <input
                name="bcsBatch"
                value={formData.bcsBatch}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="Present Address">
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  placeholder="House, Road, Area, City"
                  className={taCls}
                />
              </F>
              <F label="Permanent Address">
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="House, Road, Area, City"
                  className={taCls}
                />
              </F>
            </div>
          </div>
        </SectionCard>

        {/* ── 4. Educational Qualification ─────────────────────────────── */}
        <SectionCard
          title="Educational Qualification"
          icon={GraduationCap}
          iconColor="bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300"
          defaultOpen={false}
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Primary Degree
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <F label="Degree Name">
                  <input
                    name="degreeName"
                    value={formData.degreeName}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Division / GPA">
                  <input
                    name="divisionGPA"
                    value={formData.divisionGPA}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Obtain Year">
                  <input
                    name="obtainYear"
                    value={formData.obtainYear}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Board / University">
                  <input
                    name="boardUniversity"
                    value={formData.boardUniversity}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Other Degree
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <F label="Degree Name">
                  <input
                    name="otherDegreeName"
                    value={formData.otherDegreeName}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Division / GPA">
                  <input
                    name="otherDivisionGPA"
                    value={formData.otherDivisionGPA}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Obtain Year">
                  <input
                    name="otherObtainYear"
                    value={formData.otherObtainYear}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
                <F label="Board / University">
                  <input
                    name="otherBoardUniversity"
                    value={formData.otherBoardUniversity}
                    onChange={handleChange}
                    className={inp(false)}
                  />
                </F>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 5. Work Experience & Documents ───────────────────────────── */}
        <SectionCard
          title="Work Experience & Documents"
          icon={Upload}
          iconColor="bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <F label="Institute / Company Name">
              <input
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Position Held">
              <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Years of Experience">
              <input
                type="number"
                name="experienceYear"
                value={formData.experienceYear}
                onChange={handleChange}
                min={0}
                className={inp(false)}
              />
            </F>
            <F label="Office Address">
              <input
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                className={inp(false)}
              />
            </F>
            <F label="Resume Upload (PDF only)">
              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={handleChange}
                className={fileInp}
              />
              {formData.resume && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                  <Check size={11} /> {formData.resume.name}
                </span>
              )}
            </F>
          </div>
        </SectionCard>

        {/* ── Bottom Save ───────────────────────────────────────────────── */}
        <div className="flex justify-end pb-6">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
              ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                Saving…
              </>
            ) : (
              <>
                <Upload size={15} /> Save Teacher / Employee
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
