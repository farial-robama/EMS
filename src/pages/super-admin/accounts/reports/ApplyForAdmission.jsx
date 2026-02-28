import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  GraduationCap,
  ChevronRight,
  User,
  Phone,
  Mail,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  ChevronLeft,
  Send,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const STEPS = ['Personal Info', 'Academic Info', 'Contact Info', 'Review & Submit'];

const PROGRAMS = [
  'Bachelor of Arts (B.A.)',
  'Bachelor of Social Science (B.S.S)',
  'Bachelor of Business Studies (BBS)',
  'Bachelor of Science (B.Sc.)',
  'Professional - BBA',
  'Professional - CSE',
  'Masters Preliminary',
];

const SESSIONS = ['2024-2025', '2025-2026'];
const RELIGIONS = ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const inp = 'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30';
const inpErr = 'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

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

const ApplyForAdmission = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNo] = useState(`ADM-${Date.now().toString().slice(-6)}`);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Personal
    fullName: '', fatherName: '', motherName: '', dob: '', gender: '', religion: '', bloodGroup: '',
    // Academic
    program: '', session: '', prevInstitution: '', prevBoard: '', prevRoll: '', prevReg: '', prevResult: '', prevYear: '',
    // Contact
    mobile: '', email: '', address: '', district: '', emergency: '',
    // Photo placeholder
    photo: null,
  });

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName) e.fullName = 'Required';
      if (!form.fatherName) e.fatherName = 'Required';
      if (!form.dob) e.dob = 'Required';
      if (!form.gender) e.gender = 'Required';
    }
    if (step === 1) {
      if (!form.program) e.program = 'Required';
      if (!form.session) e.session = 'Required';
      if (!form.prevInstitution) e.prevInstitution = 'Required';
      if (!form.prevResult) e.prevResult = 'Required';
    }
    if (step === 2) {
      if (!form.mobile) e.mobile = 'Required';
      if (!form.address) e.address = 'Required';
    }
    return e;
  };

  const next = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((p) => p + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(16).text('Admission Application', 297, 50, { align: 'center' });
    doc.setFontSize(11).text('Mohammadpur Kendriya College', 297, 70, { align: 'center' });
    doc.setFontSize(10).text(`Application No: ${applicationNo}`, 297, 90, { align: 'center' });
    const fields = [
      ['Full Name', form.fullName], ['Father\'s Name', form.fatherName], ['Mother\'s Name', form.motherName],
      ['Date of Birth', form.dob], ['Gender', form.gender], ['Religion', form.religion],
      ['Program', form.program], ['Session', form.session], ['Previous Institution', form.prevInstitution],
      ['Previous Board', form.prevBoard], ['Previous Result', form.prevResult], ['Passing Year', form.prevYear],
      ['Mobile', form.mobile], ['Email', form.email], ['Address', form.address],
    ];
    let y = 120;
    fields.forEach(([label, value]) => {
      doc.setFontSize(9).setTextColor('#6B7280').text(label, 50, y);
      doc.setFontSize(10).setTextColor('#111827').text(value || '—', 200, y);
      y += 20;
    });
    window.open(doc.output('bloburl'));
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <Breadcrumb items={['Dashboard', 'Admission', 'Apply for Admission', 'Success']} />
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />
            <div className="flex flex-col items-center text-center px-8 py-14">
              <div className="w-20 h-20 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Application Submitted!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-3">
                Your admission application has been received. Keep your application number safe for future reference.
              </p>
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl mb-8">
                <FileText size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Application No: {applicationNo}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePDF} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200">
                  <FileText size={15} /> Download PDF
                </button>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Admission', 'Apply for Admission']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <GraduationCap size={22} className="text-emerald-500" /> Apply for Admission
          </h1>
        </div>

        {/* Stepper */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700 mx-8 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-emerald-500 z-0 transition-all duration-500 mx-8"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${i === step ? 'text-emerald-600 dark:text-emerald-400' : i < step ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/30">
            {step === 0 && <User size={15} className="text-emerald-500" />}
            {step === 1 && <BookOpen size={15} className="text-emerald-500" />}
            {step === 2 && <Phone size={15} className="text-emerald-500" />}
            {step === 3 && <FileText size={15} className="text-emerald-500" />}
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{STEPS[step]}</span>
          </div>

          <div className="p-5">
            {/* Step 0 – Personal Info */}
            {step === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Full Name" required error={errors.fullName}>
                  <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Full name (as per certificate)" className={errors.fullName ? inpErr : inp} />
                </F>
                <F label="Father's Name" required error={errors.fatherName}>
                  <input value={form.fatherName} onChange={(e) => set('fatherName', e.target.value)} placeholder="Father's name" className={errors.fatherName ? inpErr : inp} />
                </F>
                <F label="Mother's Name">
                  <input value={form.motherName} onChange={(e) => set('motherName', e.target.value)} placeholder="Mother's name" className={inp} />
                </F>
                <F label="Date of Birth" required error={errors.dob}>
                  <input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} className={errors.dob ? inpErr : inp} />
                </F>
                <F label="Gender" required error={errors.gender}>
                  <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={errors.gender ? inpErr : inp}>
                    <option value="">Select Gender</option>
                    {GENDERS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </F>
                <F label="Religion">
                  <select value={form.religion} onChange={(e) => set('religion', e.target.value)} className={inp}>
                    <option value="">Select Religion</option>
                    {RELIGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </F>
                <F label="Blood Group">
                  <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} className={inp}>
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </F>
                <F label="Photo">
                  <label className={`${inp} flex items-center gap-2 cursor-pointer`}>
                    <Upload size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 text-sm">{form.photo ? form.photo.name : 'Upload passport photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => set('photo', e.target.files[0])} />
                  </label>
                </F>
              </div>
            )}

            {/* Step 1 – Academic Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Program / Department" required error={errors.program}>
                  <select value={form.program} onChange={(e) => set('program', e.target.value)} className={errors.program ? inpErr : inp}>
                    <option value="">Select Program</option>
                    {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </F>
                <F label="Session" required error={errors.session}>
                  <select value={form.session} onChange={(e) => set('session', e.target.value)} className={errors.session ? inpErr : inp}>
                    <option value="">Select Session</option>
                    {SESSIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </F>
                <F label="Previous Institution" required error={errors.prevInstitution}>
                  <input value={form.prevInstitution} onChange={(e) => set('prevInstitution', e.target.value)} placeholder="Name of last institution" className={errors.prevInstitution ? inpErr : inp} />
                </F>
                <F label="Previous Board">
                  <input value={form.prevBoard} onChange={(e) => set('prevBoard', e.target.value)} placeholder="e.g. Dhaka Board" className={inp} />
                </F>
                <F label="Roll No.">
                  <input value={form.prevRoll} onChange={(e) => set('prevRoll', e.target.value)} placeholder="Exam roll number" className={inp} />
                </F>
                <F label="Registration No.">
                  <input value={form.prevReg} onChange={(e) => set('prevReg', e.target.value)} placeholder="Registration number" className={inp} />
                </F>
                <F label="Result / GPA" required error={errors.prevResult}>
                  <input value={form.prevResult} onChange={(e) => set('prevResult', e.target.value)} placeholder="e.g. GPA 5.00 / A+" className={errors.prevResult ? inpErr : inp} />
                </F>
                <F label="Passing Year">
                  <input value={form.prevYear} onChange={(e) => set('prevYear', e.target.value)} placeholder="e.g. 2023" className={inp} />
                </F>
              </div>
            )}

            {/* Step 2 – Contact Info */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Mobile Number" required error={errors.mobile}>
                  <input type="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="01XXXXXXXXX" className={errors.mobile ? inpErr : inp} />
                </F>
                <F label="Email Address">
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" className={inp} />
                </F>
                <div className="sm:col-span-2">
                  <F label="Present Address" required error={errors.address}>
                    <textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Full present address" rows={3}
                      className={`${errors.address ? inpErr : inp} resize-none`} />
                  </F>
                </div>
                <F label="District">
                  <input value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="e.g. Dhaka" className={inp} />
                </F>
                <F label="Emergency Contact">
                  <input type="tel" value={form.emergency} onChange={(e) => set('emergency', e.target.value)} placeholder="Emergency contact number" className={inp} />
                </F>
              </div>
            )}

            {/* Step 3 – Review */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Application No</p>
                  <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{applicationNo}</p>
                </div>
                {[
                  { title: 'Personal Information', color: 'text-blue-600 dark:text-blue-400', fields: [
                    ['Full Name', form.fullName], ['Father\'s Name', form.fatherName], ['Mother\'s Name', form.motherName],
                    ['Date of Birth', form.dob], ['Gender', form.gender], ['Religion', form.religion], ['Blood Group', form.bloodGroup],
                  ]},
                  { title: 'Academic Information', color: 'text-purple-600 dark:text-purple-400', fields: [
                    ['Program', form.program], ['Session', form.session], ['Previous Institution', form.prevInstitution],
                    ['Previous Board', form.prevBoard], ['Roll No.', form.prevRoll], ['Result', form.prevResult], ['Passing Year', form.prevYear],
                  ]},
                  { title: 'Contact Information', color: 'text-teal-600 dark:text-teal-400', fields: [
                    ['Mobile', form.mobile], ['Email', form.email], ['Address', form.address], ['District', form.district], ['Emergency', form.emergency],
                  ]},
                ].map(({ title, color, fields }) => (
                  <div key={title} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className={`px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700`}>
                      <span className={`text-xs font-bold uppercase tracking-wide ${color}`}>{title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-gray-50 dark:divide-gray-700/50">
                      {fields.map(([label, value]) => (
                        <div key={label} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{value || '—'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50/50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700">
            <button onClick={() => setStep((p) => Math.max(0, p - 1))} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={15} /> Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none">
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none">
                <Send size={14} /> Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyForAdmission;