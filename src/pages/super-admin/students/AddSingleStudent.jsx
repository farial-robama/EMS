// src/pages/admin/studentSetup/AddSingleStudent.jsx
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, User, Users, GraduationCap, BookOpen,
  Building2, Bus, Upload, Check, AlertCircle, ImageIcon, X, Copy,
} from 'lucide-react';

/* ── Static reference data (replace with API fetched data) ───────────────── */
const EDUCATION_BOARDS = [
  'Dhaka','Chittagong','Rajshahi','Barisal','Sylhet',
  'Comilla','Jessore','Mymensingh','Dinajpur','Madrasah','Technical',
];
const DIVISIONS_SSC_HSC = ['Science','Humanities','Business Studies'];
const STUDENT_CATEGORIES = ['New Student','Old Student','Transfer Student'];

const DUMMY_SHIFTS      = [{ id: 1, shift_name: 'Morning' }, { id: 2, shift_name: 'Evening' }];
const DUMMY_MEDIUMS     = [{ id: 1, medium_name: 'Bangla' }, { id: 2, medium_name: 'English' }];
const DUMMY_EDU_LEVELS  = [{ id: 1, level_name: 'School' }, { id: 2, level_name: 'College' }];
const DUMMY_DEPARTMENTS = [{ id: 1, department_name: 'Science' }, { id: 2, department_name: 'Arts' }];
const DUMMY_CLASSES     = [
  { id: 1, department_id: 1, class_name: 'Class 9' },
  { id: 2, department_id: 1, class_name: 'Class 10' },
  { id: 3, department_id: 2, class_name: 'Class 11' },
];
const DUMMY_SECTIONS = [
  { id: 1, class_id: 1, section_name: 'Section A' },
  { id: 2, class_id: 1, section_name: 'Section B' },
  { id: 3, class_id: 2, section_name: 'Section A' },
];
const DUMMY_SESSIONS = [
  { id: 1, section_id: 1, session_name: '2024-2025' },
  { id: 2, section_id: 1, session_name: '2025-2026' },
];

/* ── Initial form state ──────────────────────────────────────────────────── */
const INITIAL = {
  studentId:'', fullName:'', fullNameBangla:'', birthRegNo:'', dob:'',
  nationality:'Bangladeshi', country:'Bangladesh', religion:'', bloodGroup:'',
  gender:'', maritalStatus:'Unmarried', email:'', studentPhone:'',
  profilePic:null, studyBreak:'',
  fatherName:'', fatherPhone:'', fatherNID:'', fatherPassport:'',
  fatherOccupation:'', fatherIncome:'', fatherImage:null, isFatherGuardian:false,
  motherName:'', motherPhone:'', motherNID:'', motherPassport:'',
  motherOccupation:'', motherIncome:'', motherImage:null, isMotherGuardian:false,
  guardianType:'Father', guardianName:'', guardianPhone:'', guardianRelation:'',
  guardianIncome:'', guardianImage:null,
  presentAddress:'', permanentAddress:'',
  shift:'', medium:'', eduLevel:'', department:'', className:'', section:'', session:'',
  roll:'', regNo:'', attendanceId:'', admissionDate:'', studentCategory:'', oldStudentCode:'',
  pscDivision:'None', pscRoll:'', pscGpa:'', pscTotal:'', pscGpaWithout4th:'', pscPassingYear:'', pscRegNo:'', pscSession:'', pscBoard:'',
  jscDivision:'None', jscRoll:'', jscGpa:'', jscTotal:'', jscGpaWithout4th:'', jscPassingYear:'', jscRegNo:'', jscSession:'', jscBoard:'',
  sscDivision:'', sscRoll:'', sscGpa:'', sscTotal:'', sscGpaWithout4th:'', sscPassingYear:'', sscRegNo:'', sscSession:'', sscBoard:'',
  hscDivision:'', hscRoll:'', hscGpa:'', hscTotal:'', hscGpaWithout4th:'', hscPassingYear:'', hscRegNo:'', hscSession:'', hscBoard:'',
  hostel:'', hostelRoom:'', allotmentDate:'', hostelType:'', hostelFee:'', paymentStatus:'', guardianPermission:'', emergencyContact:'',
  busNo:'', roadNo:'', pickupPoint:'', dropPoint:'', transportType:'', driverName:'', driverContact:'', transportFee:'', transportPaymentStatus:'',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all
  ${err
    ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

const roInp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none';

const ta = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none min-h-[80px]
  ${err
    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`;

function F({ label, required, error, col, children }) {
  return (
    <div className={col === 'full' ? 'col-span-full flex flex-col gap-1.5' : 'flex flex-col gap-1.5'}>
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer transition-colors'}>{item}</span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600"/>}
      </React.Fragment>
    ))}
  </nav>
);

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}><Icon size={14}/></div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          {badge && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

/* ── Profile Pic Upload ──────────────────────────────────────────────────── */
function ProfilePicUpload({ preview, onChange }) {
  const ref = useRef(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <div onClick={() => ref.current?.click()}
        className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-700/40 cursor-pointer flex items-center justify-center overflow-hidden group transition-all">
        {preview
          ? <img src={preview} alt="Profile" className="w-full h-full object-cover"/>
          : <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-400 transition-colors">
              <ImageIcon size={24}/><span className="text-xs">Upload</span>
            </div>}
        <input ref={ref} type="file" name="profilePic" accept="image/*" onChange={onChange} className="hidden"/>
      </div>
      <span className="text-xs text-gray-400">Profile Photo</span>
    </div>
  );
}

/* ── Qualification Table Row ─────────────────────────────────────────────── */
function QualRow({ label, prefix, form, onChange, boards, divisionOptions }) {
  const f = (name) => `${prefix}${name}`;
  const tdCls = "px-2 py-1.5";
  const cellInp = "w-full px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
      <td className={`${tdCls} pl-4`}>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{label}</span>
      </td>
      <td className={tdCls}>
        <select name={f('Division')} value={form[f('Division')]} onChange={onChange} className={cellInp}>
          {divisionOptions === 'none'
            ? <option value="None">None</option>
            : <>
                <option value="">Select</option>
                {DIVISIONS_SSC_HSC.map(d => <option key={d} value={d}>{d}</option>)}
              </>}
        </select>
      </td>
      {['Roll','Gpa','Total','GpaWithout4th','PassingYear','RegNo','Session'].map(col => (
        <td key={col} className={tdCls}>
          <input name={f(col)} value={form[f(col)]} onChange={onChange}
            placeholder={col === 'Gpa' ? '0.00' : ''}
            type={['Gpa','Total','GpaWithout4th'].includes(col) ? 'number' : 'text'}
            step={['Gpa','GpaWithout4th'].includes(col) ? '0.01' : undefined}
            min={['Gpa','GpaWithout4th'].includes(col) ? '0' : undefined}
            max={['Gpa','GpaWithout4th'].includes(col) ? '5' : undefined}
            className={cellInp}/>
        </td>
      ))}
      <td className={tdCls + ' pr-4'}>
        <select name={f('Board')} value={form[f('Board')]} onChange={onChange} className={cellInp}>
          <option value="">Board</option>
          {boards.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </td>
    </tr>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function AddSingleStudent() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingStudent = location.state?.student || null;
  const isEditMode = Boolean(editingStudent);

  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [previews, setPreviews] = useState({});
  const [saving, setSaving]     = useState(false);
  const [sameAddress, setSameAddress] = useState(false);

  /* cascaded dropdowns from dummy data */
  const filteredClasses  = DUMMY_CLASSES.filter(c => c.department_id === +formData.department);
  const filteredSections = DUMMY_SECTIONS.filter(s => s.class_id === +formData.className);
  const filteredSessions = DUMMY_SESSIONS.filter(s => s.section_id === +formData.section);

  /* Generate student ID */
  useEffect(() => {
    if (!isEditMode) {
      setFormData(p => ({ ...p, studentId: `STU${String(Date.now()).slice(-6)}` }));
    } else if (editingStudent) {
      setFormData(p => ({ ...p, ...editingStudent }));
    }
  }, [isEditMode]);

  /* Reset downstream on change */
  useEffect(() => {
    if (!isEditMode) setFormData(p => ({ ...p, className: '', section: '', session: '' }));
  }, [formData.department]);
  useEffect(() => {
    if (!isEditMode) setFormData(p => ({ ...p, section: '', session: '' }));
  }, [formData.className]);
  useEffect(() => {
    if (!isEditMode) setFormData(p => ({ ...p, session: '' }));
  }, [formData.section]);

  /* Sync guardian from father/mother */
  useEffect(() => {
    if (!isEditMode) return;
    if (editingStudent?.guardianType === 'Father') {
      setFormData(p => ({ ...p, isFatherGuardian: true, isMotherGuardian: false }));
    } else if (editingStudent?.guardianType === 'Mother') {
      setFormData(p => ({ ...p, isMotherGuardian: true, isFatherGuardian: false }));
    }
  }, [isEditMode]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => {
      let updated = { ...prev, [name]: type === 'checkbox' ? checked : files ? files[0] : value };

      if (name === 'isFatherGuardian' && checked) {
        updated.isMotherGuardian = false;
        updated.guardianType  = 'Father';
        updated.guardianName  = prev.fatherName;
        updated.guardianPhone = prev.fatherPhone;
      }
      if (name === 'isMotherGuardian' && checked) {
        updated.isFatherGuardian = false;
        updated.guardianType  = 'Mother';
        updated.guardianName  = prev.motherName;
        updated.guardianPhone = prev.motherPhone;
      }
      if ((name === 'isFatherGuardian' || name === 'isMotherGuardian') && !checked) {
        updated.guardianName = ''; updated.guardianPhone = '';
      }
      if (name === 'fatherName' && prev.isFatherGuardian) updated.guardianName = value;
      if (name === 'fatherPhone' && prev.isFatherGuardian) updated.guardianPhone = value;
      if (name === 'motherName' && prev.isMotherGuardian) updated.guardianName = value;
      if (name === 'motherPhone' && prev.isMotherGuardian) updated.guardianPhone = value;
      return updated;
    });
    if (files?.[0]) setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSameAddress = () => {
    setSameAddress(s => {
      if (!s) setFormData(p => ({ ...p, permanentAddress: p.presentAddress }));
      return !s;
    });
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())      e.fullName      = 'Full name is required';
    if (!formData.fullNameBangla.trim())e.fullNameBangla= 'Bangla name is required';
    if (!formData.dob)                  e.dob           = 'Date of birth is required';
    if (!formData.religion)             e.religion      = 'Religion is required';
    if (!formData.bloodGroup)           e.bloodGroup    = 'Blood group is required';
    if (!formData.gender)               e.gender        = 'Gender is required';
    if (!formData.fatherName.trim())    e.fatherName    = 'Father name is required';
    if (!formData.fatherPhone.trim())   e.fatherPhone   = 'Father phone is required';
    if (!formData.motherName.trim())    e.motherName    = 'Mother name is required';
    if (!formData.motherPhone.trim())   e.motherPhone   = 'Mother phone is required';
    if (!formData.guardianName.trim())  e.guardianName  = 'Guardian name is required';
    if (!formData.guardianPhone.trim()) e.guardianPhone = 'Guardian phone is required';
    if (!formData.presentAddress.trim())e.presentAddress= 'Present address is required';
    if (!formData.permanentAddress.trim())e.permanentAddress='Permanent address is required';
    if (!formData.shift)                e.shift         = 'Shift is required';
    if (!formData.department)           e.department    = 'Department is required';
    if (!formData.className)            e.className     = 'Class is required';
    if (!formData.roll.trim())          e.roll          = 'Roll is required';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.querySelector('[data-error-field]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    if (isEditMode) {
      navigate('/studentList');
    } else {
      setFormData(INITIAL);
      setPreviews({});
      setFormData(p => ({ ...p, studentId: `STU${String(Date.now()).slice(-6)}` }));
    }
  };

  const sel = (name, options, labelKey, valueKey = 'id', err, disabled) => (
    <select name={name} value={formData[name]} onChange={handleChange}
      disabled={disabled}
      className={disabled
        ? 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/40 text-gray-400 cursor-not-allowed outline-none'
        : inp(err)}>
      <option value="">Select</option>
      {options.map(o => <option key={o[valueKey] || o} value={o[valueKey] || o}>{o[labelKey] || o}</option>)}
    </select>
  );

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb items={['Dashboard', 'Student Setup', isEditMode ? 'Edit Student' : 'Add Student']}/>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditMode && (
              <button type="button" onClick={() => navigate(-1)}
                className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                ${saving ? 'bg-blue-400 cursor-not-allowed' : isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Saving…</>
                : <><Check size={15}/> {isEditMode ? 'Update Student' : 'Add Student'}</>}
            </button>
          </div>
        </div>

        {/* ── 1. Personal Information ──────────────────────────────────────── */}
        <SectionCard title="Personal Information" icon={User} iconColor="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" badge="Required">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile pic */}
            <div className="flex-shrink-0">
              <ProfilePicUpload preview={previews.profilePic} onChange={handleChange}/>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <F label="Student ID">
                <div className="flex gap-2">
                  <input value={formData.studentId} readOnly className={roInp}/>
                  <button type="button" title="Copy ID" onClick={() => navigator.clipboard?.writeText(formData.studentId)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 text-gray-500 transition-all">
                    <Copy size={13}/>
                  </button>
                </div>
              </F>
              <F label="Full Name" required error={errors.fullName}>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" className={inp(errors.fullName)}/>
              </F>
              <F label="Full Name (Bangla)" required error={errors.fullNameBangla}>
                <input name="fullNameBangla" value={formData.fullNameBangla} onChange={handleChange} placeholder="বাংলায় নাম লিখুন" className={inp(errors.fullNameBangla)}/>
              </F>
              <F label="Date of Birth" required error={errors.dob}>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inp(errors.dob)}/>
              </F>
              <F label="Gender" required error={errors.gender}>
                {sel('gender', ['Male','Female','Other'], null, null, errors.gender)}
              </F>
              <F label="Religion" required error={errors.religion}>
                {sel('religion', ['Islam','Hinduism','Christianity','Buddhism'], null, null, errors.religion)}
              </F>
              <F label="Blood Group" required error={errors.bloodGroup}>
                {sel('bloodGroup', ['A+','A-','B+','B-','O+','O-','AB+','AB-'], null, null, errors.bloodGroup)}
              </F>
              <F label="Marital Status">
                {sel('maritalStatus', ['Unmarried','Married'], null, null, false)}
              </F>
              <F label="Nationality" required>
                <input name="nationality" value={formData.nationality} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Country" required>
                <input name="country" value={formData.country} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Student Email">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@email.com" className={inp(false)}/>
              </F>
              <F label="Student Phone">
                <input name="studentPhone" value={formData.studentPhone} onChange={handleChange} placeholder="+880 1X XX-XXXXXX" className={inp(false)}/>
              </F>
              <F label="Birth Reg. No">
                <input name="birthRegNo" value={formData.birthRegNo} onChange={handleChange} placeholder="Birth registration number" className={inp(false)}/>
              </F>
              <F label="Study Break Remarks" col="full">
                <textarea name="studyBreak" value={formData.studyBreak} onChange={handleChange} placeholder="If any study break, mention reason…" className={ta(false)}/>
              </F>
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Family Information ────────────────────────────────────────── */}
        <SectionCard title="Family Information" icon={Users} iconColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300" defaultOpen={false}>
          {/* Father */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">Father</h4>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" name="isFatherGuardian" checked={formData.isFatherGuardian} onChange={handleChange}
                  className="w-4 h-4 rounded accent-blue-500"/>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">Set as Guardian</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <F label="Father Name" required error={errors.fatherName}>
                <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's full name" className={inp(errors.fatherName)}/>
              </F>
              <F label="Father Phone" required error={errors.fatherPhone}>
                <input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="Mobile number" className={inp(errors.fatherPhone)}/>
              </F>
              <F label="Father NID">
                <input name="fatherNID" value={formData.fatherNID} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Father Passport">
                <input name="fatherPassport" value={formData.fatherPassport} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Occupation">
                <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Yearly Income (৳)">
                <input type="number" name="fatherIncome" value={formData.fatherIncome} onChange={handleChange} min={0} className={inp(false)}/>
              </F>
              <F label="Father Photo">
                <input type="file" name="fatherImage" accept="image/*" onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all outline-none"/>
                {previews.fatherImage && <img src={previews.fatherImage} alt="Father" className="mt-2 w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600"/>}
              </F>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">Mother</h4>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" name="isMotherGuardian" checked={formData.isMotherGuardian} onChange={handleChange}
                  className="w-4 h-4 rounded accent-blue-500"/>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">Set as Guardian</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <F label="Mother Name" required error={errors.motherName}>
                <input name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's full name" className={inp(errors.motherName)}/>
              </F>
              <F label="Mother Phone" required error={errors.motherPhone}>
                <input name="motherPhone" value={formData.motherPhone} onChange={handleChange} placeholder="Mobile number" className={inp(errors.motherPhone)}/>
              </F>
              <F label="Mother NID">
                <input name="motherNID" value={formData.motherNID} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Mother Passport">
                <input name="motherPassport" value={formData.motherPassport} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Occupation">
                <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className={inp(false)}/>
              </F>
              <F label="Yearly Income (৳)">
                <input type="number" name="motherIncome" value={formData.motherIncome} onChange={handleChange} min={0} className={inp(false)}/>
              </F>
              <F label="Mother Photo">
                <input type="file" name="motherImage" accept="image/*" onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all outline-none"/>
                {previews.motherImage && <img src={previews.motherImage} alt="Mother" className="mt-2 w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600"/>}
              </F>
            </div>
          </div>

          {/* Guardian */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">Guardian</h4>
              {(formData.isFatherGuardian || formData.isMotherGuardian) && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  Auto-filled from {formData.isFatherGuardian ? 'Father' : 'Mother'}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <F label="Guardian Type">
                {sel('guardianType', ['Father','Mother','Other'], null, null, false)}
              </F>
              <F label="Guardian Name" required error={errors.guardianName}>
                <input name="guardianName" value={formData.guardianName} onChange={handleChange}
                  placeholder="Guardian name" className={inp(errors.guardianName)}/>
              </F>
              <F label="Guardian Phone" required error={errors.guardianPhone}>
                <input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange}
                  placeholder="Guardian phone" className={inp(errors.guardianPhone)}/>
              </F>
              <F label="Relation">
                <input name="guardianRelation" value={formData.guardianRelation} onChange={handleChange}
                  placeholder="e.g. Uncle" className={inp(false)}/>
              </F>
              <F label="Yearly Income (৳)">
                <input type="number" name="guardianIncome" value={formData.guardianIncome} onChange={handleChange} min={0} className={inp(false)}/>
              </F>
              <F label="Guardian Photo">
                <input type="file" name="guardianImage" accept="image/*" onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all outline-none"/>
                {previews.guardianImage && <img src={previews.guardianImage} alt="Guardian" className="mt-2 w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600"/>}
              </F>
            </div>
          </div>

          {/* Addresses */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="Present Address" required error={errors.presentAddress}>
                <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange}
                  placeholder="House, Road, Area, City" className={ta(errors.presentAddress)}/>
              </F>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Permanent Address<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button type="button" onClick={handleSameAddress}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium
                      ${sameAddress ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:text-blue-500 hover:border-blue-300'}`}>
                    {sameAddress ? '✓ Same as present' : 'Same as present'}
                  </button>
                </div>
                <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}
                  placeholder="House, Road, Area, City" className={ta(errors.permanentAddress)}/>
                {errors.permanentAddress && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11}/>{errors.permanentAddress}</p>}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 3. Academic Information ──────────────────────────────────────── */}
        <SectionCard title="Academic Information" icon={GraduationCap} iconColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300" badge="Required" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <F label="Shift" required error={errors.shift}>
              {sel('shift', DUMMY_SHIFTS, 'shift_name', 'id', errors.shift)}
            </F>
            <F label="Medium" required error={errors.medium}>
              {sel('medium', DUMMY_MEDIUMS, 'medium_name', 'id', errors.medium)}
            </F>
            <F label="Education Level">
              {sel('eduLevel', DUMMY_EDU_LEVELS, 'level_name', 'id', false)}
            </F>
            <F label="Department" required error={errors.department}>
              {sel('department', DUMMY_DEPARTMENTS, 'department_name', 'id', errors.department)}
            </F>
            <F label="Class" required error={errors.className}>
              {sel('className', filteredClasses, 'class_name', 'id', errors.className, !formData.department)}
            </F>
            <F label="Section">
              {sel('section', filteredSections, 'section_name', 'id', false, !formData.className)}
            </F>
            <F label="Session">
              {sel('session', filteredSessions, 'session_name', 'id', false, !formData.section)}
            </F>
            <F label="Roll" required error={errors.roll}>
              <input name="roll" value={formData.roll} onChange={handleChange} placeholder="Roll number" className={inp(errors.roll)}/>
            </F>
            <F label="Registration No">
              <input name="regNo" value={formData.regNo} onChange={handleChange} placeholder="Registration number" className={inp(false)}/>
            </F>
            <F label="Attendance Machine ID">
              <input name="attendanceId" value={formData.attendanceId} onChange={handleChange} placeholder="Attendance ID" className={inp(false)}/>
            </F>
            <F label="Admission Date">
              <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className={inp(false)}/>
            </F>
            <F label="Student Category">
              {sel('studentCategory', STUDENT_CATEGORIES, null, null, false)}
            </F>
            <F label="Old Student Code">
              <input name="oldStudentCode" value={formData.oldStudentCode} onChange={handleChange} placeholder="Old code" className={inp(false)}/>
            </F>
          </div>
        </SectionCard>

        {/* ── 4. Qualification ─────────────────────────────────────────────── */}
        <SectionCard title="Qualification Information" icon={BookOpen} iconColor="bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300" defaultOpen={false}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['Exam','Group / Division','Board Roll','GPA','Total','GPA (w/o 4th)','Pass Year','Reg. No','Session','Board'].map(h => (
                    <th key={h} className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide first:pl-5 last:pr-5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <QualRow label="PSC" prefix="psc" form={formData} onChange={handleChange} boards={EDUCATION_BOARDS} divisionOptions="none"/>
                <QualRow label="JSC" prefix="jsc" form={formData} onChange={handleChange} boards={EDUCATION_BOARDS} divisionOptions="none"/>
                <QualRow label="SSC" prefix="ssc" form={formData} onChange={handleChange} boards={EDUCATION_BOARDS} divisionOptions="ssc"/>
                <QualRow label="HSC" prefix="hsc" form={formData} onChange={handleChange} boards={EDUCATION_BOARDS} divisionOptions="hsc"/>
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── 5. Hostel Information ─────────────────────────────────────────── */}
        <SectionCard title="Hostel Information" icon={Building2} iconColor="bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <F label="Hostel Name"><input name="hostel" value={formData.hostel} onChange={handleChange} placeholder="Hostel name" className={inp(false)}/></F>
            <F label="Room / Bed No"><input name="hostelRoom" value={formData.hostelRoom} onChange={handleChange} placeholder="Room or bed number" className={inp(false)}/></F>
            <F label="Allotment Date"><input type="date" name="allotmentDate" value={formData.allotmentDate} onChange={handleChange} className={inp(false)}/></F>
            <F label="Hostel Type">{sel('hostelType', ['Boys','Girls','Staff','Other'], null, null, false)}</F>
            <F label="Hostel Fee (৳)"><input type="number" name="hostelFee" value={formData.hostelFee} onChange={handleChange} min={0} className={inp(false)}/></F>
            <F label="Payment Status">{sel('paymentStatus', ['Paid','Pending','Partial'], null, null, false)}</F>
            <F label="Guardian Permission">{sel('guardianPermission', ['Granted','Not Granted'], null, null, false)}</F>
            <F label="Emergency Contact"><input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency phone" className={inp(false)}/></F>
          </div>
        </SectionCard>

        {/* ── 6. Transport Information ──────────────────────────────────────── */}
        <SectionCard title="Transport Information" icon={Bus} iconColor="bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <F label="Bus / Route No"><input name="busNo" value={formData.busNo} onChange={handleChange} placeholder="Bus or route number" className={inp(false)}/></F>
            <F label="Road / Stop No"><input name="roadNo" value={formData.roadNo} onChange={handleChange} placeholder="Road or stop number" className={inp(false)}/></F>
            <F label="Pickup Point"><input name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} placeholder="Pickup location" className={inp(false)}/></F>
            <F label="Drop Point"><input name="dropPoint" value={formData.dropPoint} onChange={handleChange} placeholder="Drop location" className={inp(false)}/></F>
            <F label="Transport Type">{sel('transportType', ['Bus','Van','Other'], null, null, false)}</F>
            <F label="Driver Name"><input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver full name" className={inp(false)}/></F>
            <F label="Driver Contact"><input name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver phone" className={inp(false)}/></F>
            <F label="Transport Fee (৳)"><input type="number" name="transportFee" value={formData.transportFee} onChange={handleChange} min={0} className={inp(false)}/></F>
            <F label="Payment Status">{sel('transportPaymentStatus', ['Paid','Pending','Partial'], null, null, false)}</F>
          </div>
        </SectionCard>

        {/* Bottom save */}
        <div className="flex justify-end pb-6">
          <button type="submit" disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
              ${saving ? 'bg-blue-400 cursor-not-allowed' : isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Saving…</>
              : <><Upload size={15}/> {isEditMode ? 'Update Student' : 'Save Student'}</>}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}