const fs = require('fs');
const path = require('path');

const pages = [
  'src/pages/super-admin/UserManagement/AllUsers',
  'src/pages/super-admin/SystemManagement/SystemTasks',
  'src/pages/super-admin/SystemManagement/SystemUsers',
  'src/pages/super-admin/globalConfigurations/instituteSetup/ProfileSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/ShiftSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/MediumSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/EducationLevelSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/DepartmentSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/ClassSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/SectionSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/SubjectSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/SessionSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/SubjectSubType',
  'src/pages/super-admin/globalConfigurations/instituteSetup/ClassSubjects',
  'src/pages/super-admin/globalConfigurations/instituteSetup/BackgroundUpload',
  'src/pages/super-admin/globalConfigurations/instituteSetup/DesignationSetup',
  'src/pages/super-admin/globalConfigurations/instituteSetup/PaymentGatewayAPI',
  'src/pages/super-admin/globalConfigurations/instituteSetup/PaymentGatewayCharge',
  'src/pages/super-admin/globalConfigurations/GlobalSettings',
  'src/pages/super-admin/globalConfigurations/ClearCache',
  'src/pages/super-admin/accounts/configurations/TransactionTypes',
  'src/pages/super-admin/accounts/configurations/TransactionHead',
  'src/pages/super-admin/accounts/configurations/FeeCollectionTemplate',
  'src/pages/super-admin/accounts/configurations/InvoiceConfig',
  'src/pages/super-admin/accounts/configurations/DiscountConfig',
  'src/pages/super-admin/accounts/configurations/AccountClosing',
  'src/pages/super-admin/accounts/configurations/StudentFineConfig',
  'src/pages/super-admin/accounts/configurations/PreviousDue',
  'src/pages/super-admin/accounts/income/ManualFeeCollection',
  'src/pages/super-admin/accounts/income/OtherIncome',
  'src/pages/super-admin/accounts/income/ExtraFeeCollection',
  'src/pages/super-admin/accounts/income/BankFeeCollection',
  'src/pages/super-admin/accounts/income/AddIncome',
  'src/pages/super-admin/accounts/expenses/TeacherSalary',
  'src/pages/super-admin/accounts/expenses/OtherExpenses',
  'src/pages/super-admin/accounts/reports/InvoiceList',
  'src/pages/super-admin/accounts/reports/InvoiceListDetails',
  'src/pages/super-admin/accounts/reports/TotalCollection',
  'src/pages/super-admin/accounts/reports/MonthlyFeeReport',
  'src/pages/super-admin/accounts/reports/BalanceSheet',
  'src/pages/super-admin/accounts/reports/StudentBalanceSheet',
  'src/pages/super-admin/accounts/reports/PaidUnpaidReport',
  'src/pages/super-admin/teachers/AddTeacher',
  'src/pages/super-admin/teachers/BulkTeacherUpload',
  'src/pages/super-admin/teachers/BulkTeacherUpdate',
  'src/pages/super-admin/teachers/TeacherList',
  'src/pages/super-admin/teachers/DepartmentalHead',
  'src/pages/super-admin/teachers/TeacherCourseAdvising',
  'src/pages/super-admin/teachers/TeacherIDCard',
  'src/pages/super-admin/students/AddSingleStudent',
  'src/pages/super-admin/students/StudentList',
  'src/pages/super-admin/students/StudentBulkUpload',
  'src/pages/super-admin/students/StudentCategories',
  'src/pages/super-admin/students/StudentPromotion',
  'src/pages/super-admin/students/StudentMigration',
  'src/pages/super-admin/students/ArchiveStudents',
  'src/pages/super-admin/students/StudentIDCard',
  'src/pages/super-admin/sms/SMSAPIConfig',
  'src/pages/super-admin/sms/SMSTemplateSetup',
  'src/pages/super-admin/sms/StudentBulkSMS',
  'src/pages/super-admin/sms/TeacherBulkSMS',
  'src/pages/super-admin/sms/BulkSMSMixed',
  'src/pages/super-admin/sms/SMSSentReports',
  'src/pages/super-admin/candidates/ApplicantList',
  'src/pages/super-admin/candidates/AdmissionApplicable',
  'src/pages/super-admin/calendar/AcademicCalendar',
  'src/pages/super-admin/calendar/EventCalendar',
  'src/pages/super-admin/routine/ClassPeriod',
  'src/pages/super-admin/routine/RoutineSchedule',
  'src/pages/super-admin/exam/setup/ExamTemplate',
  'src/pages/super-admin/exam/setup/ExamList',
  'src/pages/super-admin/exam/setup/SubSubjectList',
  'src/pages/super-admin/exam/result/PassConfig',
  'src/pages/super-admin/exam/result/ResultConfig',
  'src/pages/super-admin/exam/result/MeritConfig',
  'src/pages/super-admin/exam/result/GradePoint',
  'src/pages/super-admin/exam/result/CommentSetting',
  'src/pages/super-admin/exam/marks/MarkEntry',
  'src/pages/super-admin/exam/marks/MarkEntryFormat',
  'src/pages/super-admin/exam/marks/TeacherMarkEntry',
  'src/pages/super-admin/exam/process/ProcessResult',
  'src/pages/super-admin/exam/process/ProcessedExamList',
  'src/pages/super-admin/exam/process/ResultArchive',
  'src/pages/super-admin/exam/reports/AdmitCardQR',
  'src/pages/super-admin/exam/reports/ExamAdmitCard',
  'src/pages/super-admin/exam/reports/Marksheet',
  'src/pages/super-admin/exam/reports/ResultSummary',
  'src/pages/super-admin/exam/reports/TabulationSheet',
  'src/pages/super-admin/attendance/StudentAttConfig',
  'src/pages/super-admin/attendance/EmployeeAttConfig',
  'src/pages/super-admin/attendance/StudentManualAttendance',
  'src/pages/super-admin/attendance/SpecialHoliday',
  'src/pages/super-admin/library/BuildingEntry',
  'src/pages/super-admin/library/BookCategory',
  'src/pages/super-admin/library/BookEntry',
  'src/pages/super-admin/library/BookAllocation',
  'src/pages/super-admin/hostel/HostelRoom',
  'src/pages/super-admin/hostel/HostelAllocation',
  'src/pages/super-admin/certificates/TransferCertificate',
  'src/pages/super-admin/certificates/StudyCertificate',
  'src/pages/super-admin/certificates/ManualTestimonial',
  'src/pages/super-admin/reports/AttendanceReports',
  'src/pages/super-admin/reports/StudentReports',
  'src/pages/super-admin/reports/FinancialReports',
  'src/pages/super-admin/reports/SMSReports',
  'src/pages/super-admin/settings/PaymentCollectionConfig',
  'src/pages/super-admin/settings/AdmissionConfig',
  'src/pages/super-admin/settings/GeneralSettings',
  'src/pages/admin/students/StudentList',
  'src/pages/admin/students/AddStudent',
  'src/pages/admin/teachers/TeacherList',
  'src/pages/admin/accounts/FeeCollection',
  'src/pages/admin/accounts/Reports',
  'src/pages/admin/Reports',
  'src/pages/teacher/Classes',
  'src/pages/teacher/Students',
  'src/pages/teacher/exams/MarkEntry',
  'src/pages/teacher/exams/ExamList',
  'src/pages/teacher/Attendance',
  'src/pages/teacher/LessonPlan',
  'src/pages/student/Profile',
  'src/pages/student/Results',
  'src/pages/student/Attendance',
  'src/pages/student/fees/PaymentHistory',
  'src/pages/student/fees/PendingFees',
  'src/pages/student/Library',
  'src/pages/student/Assignments',
];

// Also create the Placeholder base component
const placeholderDir = 'src/pages';
fs.mkdirSync(placeholderDir, { recursive: true });
const placeholderContent = [
  "import React from 'react';",
  "import DashboardLayout from '../components/layout/DashboardLayout';",
  '',
  "export default function Placeholder({ title = 'Page' }) {",
  '  return (',
  '    <DashboardLayout>',
  "      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:'12px', color:'#94a3b8' }}>",
  "        <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='none' viewBox='0 0 24 24' stroke='currentColor'>",
  "          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.655m5.65-4.65l4.654-5.654a2.548 2.548 0 013.586 3.586l-5.654 4.654' />",
  '        </svg>',
  "        <p style={{ fontSize:'18px', fontWeight:600 }}>{title}</p>",
  "        <p style={{ fontSize:'14px' }}>This page is under construction.</p>",
  '      </div>',
  '    </DashboardLayout>',
  '  );',
  '}',
].join('\n');

const placeholderPath = 'src/pages/Placeholder.jsx';
if (!fs.existsSync(placeholderPath)) {
  fs.writeFileSync(placeholderPath, placeholderContent);
  console.log('CREATED: src/pages/Placeholder.jsx');
} else {
  console.log('EXISTS:  src/pages/Placeholder.jsx');
}

// Generate all page placeholders
let created = 0;
let skipped = 0;

pages.forEach((p) => {
  const filepath = p + '.jsx';

  if (fs.existsSync(filepath)) {
    console.log('EXISTS:  ' + filepath);
    skipped++;
    return;
  }

  // Create directory
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });

  // Calculate relative path to Placeholder
  const depth = filepath.split('/').length - 2;
  const rel = '../'.repeat(depth) + 'Placeholder';

  // Get component name from filename
  const name = path.basename(p);

  // Add spaces before capital letters for the title
  const title = name.replace(/([A-Z])/g, ' $1').trim();

  const content = [
    "import Placeholder from '@/pages/Placeholder' '" + rel + "';",
    'export default function ' + name + '() {',
    "  return <Placeholder title='" + title + "' />;",
    '}',
  ].join('\n');

  fs.writeFileSync(filepath, content);
  console.log('CREATED: ' + filepath);
  created++;
});

console.log(
  '\n✅ Done! Created: ' + created + ', Skipped (already exist): ' + skipped
);
