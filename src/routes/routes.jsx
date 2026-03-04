// import { lazy } from 'react';
// import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// // Lazy-loaded pages for code-splitting
// const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
// const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
// const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// const SuperAdminDashboard = lazy(() => import('../pages/dashboards/SuperAdminDashboard'));
// const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
// const TeacherDashboard = lazy(() => import('../pages/dashboards/TeacherDashboard'));
// const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard'));

// // User Profile
// const UserProfile = lazy(() => import('../pages/UserProfile/UserProfile'));

// // Super Admin pages
// const StudentsAdmission = lazy(() => import('../pages/super-admin/StudentsAdmission'));
// const AddTeacher = lazy(() => import('../pages/super-admin/AddTeacher'));
// const ManageUsers = lazy(() => import('../pages/super-admin/ManageUsers'));
// const Reports = lazy(() => import('../pages/super-admin/Reports'));

// // User Management sub-pages
// const UserGroupList = lazy(() => import('../pages/super-admin/UserManagement/UserGroupList'));
// const UserRoleGroupManagement = lazy(() => import('../pages/super-admin/UserManagement/UserRoleGroupManagement'));

// const routes = [
//   // Authentication
//   { path: '/auth/login', element: LoginPage, title: 'Login - Advance School & College' },
//   { path: '/auth/forgot-password', element: ForgotPasswordPage, title: 'Forgot Password' },
//   { path: '/auth/reset-password', element: ResetPasswordPage, title: 'Reset Password' },
//   { path: '/auth/verify-email', element: VerifyEmailPage, title: 'Verify Email' },

//   // User Profile
//   {
//     path: '/profile',
//     element: UserProfile,
//     protected: true,
//     allowedRoles: ['super_admin', 'admin', 'teacher', 'student'],
//     title: 'My Profile',
//   },

//   // Dashboards
//   {
//     path: '/super-admin/dashboard',
//     element: SuperAdminDashboard,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Super Admin Dashboard',
//   },
//   {
//     path: '/admin/dashboard',
//     element: AdminDashboard,
//     protected: true,
//     allowedRoles: ['admin', 'super_admin'],
//     title: 'Admin Dashboard',
//   },
//   {
//     path: '/teacher/dashboard',
//     element: TeacherDashboard,
//     protected: true,
//     allowedRoles: ['teacher'],
//     title: 'Teacher Dashboard',
//   },
//   {
//     path: '/student/dashboard',
//     element: StudentDashboard,
//     protected: true,
//     allowedRoles: ['student'],
//     title: 'Student Dashboard',
//   },

//   // Super admin action pages
//   {
//     path: '/super-admin/students/admission',
//     element: StudentsAdmission,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Student Admission',
//     breadcrumbs: [
//       { label: 'Dashboard', path: '/super-admin/dashboard' },
//       { label: 'Students' },
//       { label: 'Admission' },
//     ],
//   },
//   {
//     path: '/super-admin/teachers/add',
//     element: AddTeacher,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Add Teacher',
//     breadcrumbs: [
//       { label: 'Dashboard', path: '/super-admin/dashboard' },
//       { label: 'Teachers' },
//       { label: 'Add' },
//     ],
//   },
//   {
//     path: '/super-admin/users',
//     element: ManageUsers,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Manage Users',
//     breadcrumbs: [
//       { label: 'Dashboard', path: '/super-admin/dashboard' },
//       { label: 'Users' },
//     ],
//   },
//   {
//     path: '/super-admin/reports',
//     element: Reports,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Reports',
//     breadcrumbs: [
//       { label: 'Dashboard', path: '/super-admin/dashboard' },
//       { label: 'Reports' },
//     ],
//   },

//   // User Group & Role routes
//   {
//     path: '/super-admin/users/groups',
//     element: UserGroupList,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'User Groups',
//   },
//   {
//     path: '/super-admin/users/roles',
//     element: UserRoleGroupManagement,
//     protected: true,
//     allowedRoles: ['super_admin'],
//     title: 'Role & Permissions',
//   },
// ];

// export default routes;

import { lazy } from 'react';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// ─── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(
  () => import('../pages/auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// ─── Dashboards ───────────────────────────────────────────────────────────────
const SuperAdminDashboard = lazy(
  () => import('../pages/dashboards/SuperAdminDashboard')
);
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
const TeacherDashboard = lazy(
  () => import('../pages/dashboards/TeacherDashboard')
);
const StudentDashboard = lazy(
  () => import('../pages/dashboards/StudentDashboard')
);

// ─── Profile ──────────────────────────────────────────────────────────────────
const UserProfile = lazy(() => import('../pages/UserProfile/UserProfile'));

// ─── User Management ──────────────────────────────────────────────────────────
const UserGroupList = lazy(
  () => import('../pages/super-admin/UserManagement/UserGroupList')
);
const UserRoleGroupManagement = lazy(
  () => import('../pages/super-admin/UserManagement/UserRoleGroupManagement')
);
const AllUsers = lazy(
  () => import('../pages/super-admin/UserManagement/AllUsers')
);

// ─── System Management ────────────────────────────────────────────────────────
const SystemTasks = lazy(
  () => import('../pages/super-admin/SystemManagement/SystemTasks')
);
const SystemUsers = lazy(
  () => import('../pages/super-admin/SystemManagement/SystemUsers')
);

// ─── Global Configurations › Institute Setup ──────────────────────────────────
const ProfileSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/ProfileSetup')
);
const CampusSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/CampusSetup')
);
const ShiftSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/ShiftSetup')
);
const MediumSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/MediumSetup')
);
const EducationLevelSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/EducationLevelSetup')
);
const DepartmentSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/DepartmentSetup')
);
const ClassSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/ClassSetup')
);
const SectionSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/SectionSetup')
);
const SubjectSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/SubjectSetup')
);
const SessionSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/SessionSetup')
);
const SubjectSubType = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/SubjectSubType')
);
const ClassSubjects = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/ClassSubjects')
);
const BackgroundUpload = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/BackgroundUpload')
);
const DesignationSetup = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/DesignationSetup')
);
const PaymentGatewayAPI = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/PaymentGatewayAPI')
);
const PaymentGatewayCharge = lazy(
  () =>
    import('../pages/super-admin/globalConfigurations/InstituteSetup/PaymentGatewayCharge')
);

// ─── Global Configurations › Other ────────────────────────────────────────────
const GlobalSettings = lazy(
  () => import('../pages/super-admin/globalConfigurations/GlobalSettings')
);
const ClearCache = lazy(
  () => import('../pages/super-admin/globalConfigurations/ClearCache')
);

// ─── Accounts › Configurations ────────────────────────────────────────────────
const TransactionTypes = lazy(
  () => import('../pages/super-admin/accounts/configurations/TransactionTypes')
);
const TransactionHead = lazy(
  () => import('../pages/super-admin/accounts/configurations/TransactionHead')
);
const FeeCollectionTemplate = lazy(
  () =>
    import('../pages/super-admin/accounts/configurations/FeeCollectionTemplate')
);
const InvoiceConfig = lazy(
  () => import('../pages/super-admin/accounts/configurations/InvoiceConfig')
);
const DiscountConfig = lazy(
  () => import('../pages/super-admin/accounts/configurations/DiscountConfig')
);
const AccountClosing = lazy(
  () => import('../pages/super-admin/accounts/configurations/AccountClosing')
);
const StudentFineConfig = lazy(
  () => import('../pages/super-admin/accounts/configurations/StudentFineConfig')
);
const PreviousDue = lazy(
  () => import('../pages/super-admin/accounts/configurations/PreviousDue')
);

// ─── Accounts › Income ────────────────────────────────────────────────────────
const ManualFeeCollection = lazy(
  () => import('../pages/super-admin/accounts/income/ManualFeeCollection')
);
const OtherIncome = lazy(
  () => import('../pages/super-admin/accounts/income/OtherIncome')
);
const ExtraFeeCollection = lazy(
  () => import('../pages/super-admin/accounts/income/ExtraFeeCollection')
);
const BankFeeCollection = lazy(
  () => import('../pages/super-admin/accounts/income/BankFeeCollection')
);
const AddIncome = lazy(
  () => import('../pages/super-admin/accounts/income/AddIncome')
);

// ─── Accounts › Expenses ──────────────────────────────────────────────────────
const TeacherSalary = lazy(
  () => import('../pages/super-admin/accounts/expenses/TeacherSalary')
);
const OtherExpenses = lazy(
  () => import('../pages/super-admin/accounts/expenses/OtherExpenses')
);

// ─── Accounts › Reports ───────────────────────────────────────────────────────
const InvoiceList = lazy(
  () => import('../pages/super-admin/accounts/reports/InvoiceList')
);
const InvoiceListDetails = lazy(
  () => import('../pages/super-admin/accounts/reports/InvoiceListDetails')
);
const TotalCollection = lazy(
  () => import('../pages/super-admin/accounts/reports/TotalCollection')
);
const MonthlyFeeReport = lazy(
  () => import('../pages/super-admin/accounts/reports/MonthlyFeeReport')
);
const BalanceSheet = lazy(
  () => import('../pages/super-admin/accounts/reports/BalanceSheet')
);
const StudentBalanceSheet = lazy(
  () => import('../pages/super-admin/accounts/reports/StudentBalanceSheet')
);
const PaidUnpaidReport = lazy(
  () => import('../pages/super-admin/accounts/reports/PaidUnpaidReport')
);
const AdmissionPaymentReport = lazy(
  () => import('../pages/super-admin/accounts/reports/AdmissionPaymentReport')
);
const AdmissionPaymentSummary = lazy(
  () => import('../pages/super-admin/accounts/reports/AdmissionPaymentSummary')
);
const AdmissionPaymentSummaryDetails = lazy(
  () =>
    import('../pages/super-admin/accounts/reports/AdmissionPaymentSummaryDetails')
);
const AdmissionPaymentSummaryCollection = lazy(
  () =>
    import('../pages/super-admin/accounts/reports/AdmissionPaymentSummaryCollection')
);
const AdmissionPaymentTransaction = lazy(
  () =>
    import('../pages/super-admin/accounts/reports/AdmissionPaymentTransaction')
);
const StudentPaymentDetails = lazy(
  () => import('../pages/super-admin/accounts/reports/StudentPaymentDetails')
);
const StudentPaymentHistories = lazy(
  () => import('../pages/super-admin/accounts/reports/StudentPaymentHistories')
);
const TransactionSummaryReport = lazy(
  () => import('../pages/super-admin/accounts/reports/TransactionSummaryReport')
);
const OnlinePaymentList = lazy(
  () => import('../pages/super-admin/accounts/reports/OnlinePaymentList')
);
const ApplyForAdmission = lazy(
  () => import('../pages/super-admin/accounts/reports/ApplyForAdmission')
);

// ─── Teacher & Staff ──────────────────────────────────────────────────────────
const AddTeacher = lazy(
  () => import('../pages/super-admin/teachers/AddTeacher')
);
const BulkTeacherUpload = lazy(
  () => import('../pages/super-admin/teachers/BulkTeacherUpload')
);
const BulkTeacherUpdate = lazy(
  () => import('../pages/super-admin/teachers/BulkTeacherUpdate')
);
const TeacherList = lazy(
  () => import('../pages/super-admin/teachers/TeacherList')
);
const DepartmentalHead = lazy(
  () => import('../pages/super-admin/teachers/DepartmentalHead')
);
const TeacherCourseAdvising = lazy(
  () => import('../pages/super-admin/teachers/TeacherCourseAdvising')
);
const TeacherIDCard = lazy(
  () => import('../pages/super-admin/teachers/TeacherIDCard')
);

// ─── Student Setup ────────────────────────────────────────────────────────────
const AddSingleStudent = lazy(
  () => import('../pages/super-admin/students/AddSingleStudent')
);
const StudentList = lazy(
  () => import('../pages/super-admin/students/StudentList')
);
const StudentBulkUpload = lazy(
  () => import('../pages/super-admin/students/StudentBulkUpload')
);
const StudentCategories = lazy(
  () => import('../pages/super-admin/students/StudentCategories')
);
const StudentPromotion = lazy(
  () => import('../pages/super-admin/students/StudentPromotion')
);
const StudentMigration = lazy(
  () => import('../pages/super-admin/students/StudentMigration')
);
const ArchiveStudents = lazy(
  () => import('../pages/super-admin/students/ArchiveStudents')
);
const StudentRollPrefix = lazy(
  () => import('../pages/super-admin/students/StudentRollPrefix')
);
const RemoveDuplicateStudent = lazy(
  () => import('../pages/super-admin/students/RemoveDuplicateStudents')
);
const StudentIDCard = lazy(
  () => import('../pages/super-admin/students/StudentIDCard')
);
const ShowAllStudent = lazy(
  () => import('../pages/super-admin/students/ShowAllStudent')
);
const BulkStudentUpdate = lazy(
  () => import('../pages/super-admin/students/BulkStudentUpdate')
);
const BulkCourseAdvising = lazy(
  () => import('../pages/super-admin/students/BulkCourseAdvising')
);
const StudentListPrint = lazy(
  () => import('../pages/super-admin/students/StudentListPrint')
);
const StudentListWithCategory = lazy(
  () => import('../pages/super-admin/students/StudentListWithCategoryWise')
);
const StudentCountReport = lazy(
  () => import('../pages/super-admin/students/StudentCountReport')
);
const StudentImageDownload = lazy(
  () => import('../pages/super-admin/students/StudentImageDownload')
);
const StudentToughtList = lazy(
  () => import('../pages/super-admin/students/StudentToughtList')
);
const SubjectWiseStudents = lazy(
  () => import('../pages/super-admin/students/SubjectWiseStudents')
);

// ─── SMS Setup ────────────────────────────────────────────────────────────────
const SMSAPIConfig = lazy(
  () => import('../pages/super-admin/sms/SMSAPIConfig')
);
const SMSTemplateSetup = lazy(
  () => import('../pages/super-admin/sms/SMSTemplateSetup')
);
const StudentBulkSMS = lazy(
  () => import('../pages/super-admin/sms/StudentBulkSMS')
);
const TeacherBulkSMS = lazy(
  () => import('../pages/super-admin/sms/TeacherBulkSMS')
);
const BulkSMSMixed = lazy(
  () => import('../pages/super-admin/sms/BulkSMSMixed')
);
const SMSSentReports = lazy(
  () => import('../pages/super-admin/sms/SMSSentReports')
);

// ─── Candidates ───────────────────────────────────────────────────────────────
const ApplicantList = lazy(
  () => import('../pages/super-admin/candidates/ApplicantList')
);
const AdmissionApplicable = lazy(
  () => import('../pages/super-admin/candidates/AdmissionApplicable')
);

// ─── Calendar ─────────────────────────────────────────────────────────────────
const AcademicCalendar = lazy(
  () => import('../pages/super-admin/calendar/AcademicCalendar')
);
const EventCalendar = lazy(
  () => import('../pages/super-admin/calendar/EventCalendar')
);

// ─── Class Routine ────────────────────────────────────────────────────────────
const ClassPeriod = lazy(
  () => import('../pages/super-admin/routine/ClassPeriod')
);
const RoutineSchedule = lazy(
  () => import('../pages/super-admin/routine/RoutineSchedule')
);

// ─── Exam › Setup ─────────────────────────────────────────────────────────────
const ExamTemplate = lazy(
  () => import('../pages/super-admin/exam/setup/ExamTemplate')
);
const ExamList = lazy(() => import('../pages/super-admin/exam/setup/ExamList'));
const SubSubjectList = lazy(
  () => import('../pages/super-admin/exam/setup/SubSubjectList')
);

// ─── Exam › Result Setup ──────────────────────────────────────────────────────
const PassConfig = lazy(
  () => import('../pages/super-admin/exam/result/PassConfig')
);
const ResultConfig = lazy(
  () => import('../pages/super-admin/exam/result/ResultConfig')
);
const MeritConfig = lazy(
  () => import('../pages/super-admin/exam/result/MeritConfig')
);
const GradePoint = lazy(
  () => import('../pages/super-admin/exam/result/GradePoint')
);
const CommentSetting = lazy(
  () => import('../pages/super-admin/exam/result/CommentSetting')
);

// ─── Exam › Mark Entry ────────────────────────────────────────────────────────
const MarkEntry = lazy(
  () => import('../pages/super-admin/exam/marks/MarkEntry')
);
const MarkEntryFormat = lazy(
  () => import('../pages/super-admin/exam/marks/MarkEntryFormat')
);
const TeacherMarkEntry = lazy(
  () => import('../pages/super-admin/exam/marks/TeacherMarkEntry')
);

// ─── Exam › Result Process ────────────────────────────────────────────────────
const ProcessResult = lazy(
  () => import('../pages/super-admin/exam/process/ProcessResult')
);
const ProcessedExamList = lazy(
  () => import('../pages/super-admin/exam/process/ProcessedExamList')
);
const ResultArchive = lazy(
  () => import('../pages/super-admin/exam/process/ResultArchive')
);

// ─── Exam › Reports ───────────────────────────────────────────────────────────
const AdmitCardQR = lazy(
  () => import('../pages/super-admin/exam/reports/AdmitCardQR')
);
const ExamAdmitCard = lazy(
  () => import('../pages/super-admin/exam/reports/ExamAdmitCard')
);
const Marksheet = lazy(
  () => import('../pages/super-admin/exam/reports/Marksheet')
);
const ResultSummary = lazy(
  () => import('../pages/super-admin/exam/reports/ResultSummary')
);
const TabulationSheet = lazy(
  () => import('../pages/super-admin/exam/reports/TabulationSheet')
);

// ─── Attendance ───────────────────────────────────────────────────────────────
const StudentAttConfig = lazy(
  () => import('../pages/super-admin/attendance/StudentAttConfig')
);
const EmployeeAttConfig = lazy(
  () => import('../pages/super-admin/attendance/EmployeeAttConfig')
);
const StudentManualAttendance = lazy(
  () => import('../pages/super-admin/attendance/StudentManualAttendance')
);
const SpecialHoliday = lazy(
  () => import('../pages/super-admin/attendance/SpecialHoliday')
);

// ─── Library ──────────────────────────────────────────────────────────────────
const BuildingEntry = lazy(
  () => import('../pages/super-admin/library/BuildingEntry')
);
const BookCategory = lazy(
  () => import('../pages/super-admin/library/BookCategory')
);
const BookEntry = lazy(() => import('../pages/super-admin/library/BookEntry'));
const BookAllocation = lazy(
  () => import('../pages/super-admin/library/BookAllocation')
);

// ─── Hostel ───────────────────────────────────────────────────────────────────
const HostelRoom = lazy(() => import('../pages/super-admin/hostel/HostelRoom'));
const HostelAllocation = lazy(
  () => import('../pages/super-admin/hostel/HostelAllocation')
);

// ─── Certificates ─────────────────────────────────────────────────────────────
const TransferCertificate = lazy(
  () => import('../pages/super-admin/certificates/TransferCertificate')
);
const StudyCertificate = lazy(
  () => import('../pages/super-admin/certificates/StudyCertificate')
);
const ManualTestimonial = lazy(
  () => import('../pages/super-admin/certificates/ManualTestimonial')
);

// ─── Reports ──────────────────────────────────────────────────────────────────
const AttendanceReports = lazy(
  () => import('../pages/super-admin/reports/AttendanceReports')
);
const StudentReports = lazy(
  () => import('../pages/super-admin/reports/StudentReports')
);
const FinancialReports = lazy(
  () => import('../pages/super-admin/reports/FinancialReports')
);
const SMSReports = lazy(
  () => import('../pages/super-admin/reports/SMSReports')
);

// ─── Settings ─────────────────────────────────────────────────────────────────
const PaymentCollectionConfig = lazy(
  () => import('../pages/super-admin/settings/PaymentCollectionConfig')
);
const AdmissionConfig = lazy(
  () => import('../pages/super-admin/settings/AdmissionConfig')
);
const GeneralSettings = lazy(
  () => import('../pages/super-admin/settings/GeneralSettings')
);

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminStudentList = lazy(
  () => import('../pages/admin/students/StudentList')
);
const AdminAddStudent = lazy(
  () => import('../pages/admin/students/AddStudent')
);
const AdminTeacherList = lazy(
  () => import('../pages/admin/teachers/TeacherList')
);
const AdminFeeCollection = lazy(
  () => import('../pages/admin/accounts/FeeCollection')
);
const AdminReports = lazy(() => import('../pages/admin/accounts/Reports'));
const AdminAllReports = lazy(() => import('../pages/admin/Reports'));

// ─── Teacher pages ────────────────────────────────────────────────────────────
const TeacherClasses = lazy(() => import('../pages/teacher/Classes'));
const TeacherStudents = lazy(() => import('../pages/teacher/Students'));
const TeacherExamMarkEntry = lazy(
  () => import('../pages/teacher/exams/MarkEntry')
);
const TeacherExamList = lazy(() => import('../pages/teacher/exams/ExamList'));
const TeacherAttendance = lazy(() => import('../pages/teacher/Attendance'));
const LessonPlan = lazy(() => import('../pages/teacher/LessonPlan'));

// ─── Student pages ────────────────────────────────────────────────────────────
const StudentProfilePage = lazy(() => import('../pages/student/Profile'));
const StudentResults = lazy(() => import('../pages/student/Results'));
const StudentAttendance = lazy(() => import('../pages/student/Attendance'));
const StudentPayHistory = lazy(
  () => import('../pages/student/fees/PaymentHistory')
);
const StudentPendingFees = lazy(
  () => import('../pages/student/fees/PendingFees')
);
const StudentLibrary = lazy(() => import('../pages/student/Library'));
const StudentAssignments = lazy(() => import('../pages/student/Assignments'));

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────
const SA = ['super_admin'];
const SA_A = ['super_admin', 'admin'];
const ALL = ['super_admin', 'admin', 'teacher', 'student'];

const routes = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { path: '/auth/login', element: LoginPage, title: 'Login' },
  {
    path: '/auth/forgot-password',
    element: ForgotPasswordPage,
    title: 'Forgot Password',
  },
  {
    path: '/auth/reset-password',
    element: ResetPasswordPage,
    title: 'Reset Password',
  },
  {
    path: '/auth/verify-email',
    element: VerifyEmailPage,
    title: 'Verify Email',
  },

  // ── Profile ───────────────────────────────────────────────────────────────
  {
    path: '/profile',
    element: UserProfile,
    protected: true,
    allowedRoles: ALL,
    title: 'My Profile',
  },

  // ── Dashboards ────────────────────────────────────────────────────────────
  {
    path: '/super-admin/dashboard',
    element: SuperAdminDashboard,
    protected: true,
    allowedRoles: SA,
    title: 'Super Admin Dashboard',
  },
  {
    path: '/admin/dashboard',
    element: AdminDashboard,
    protected: true,
    allowedRoles: SA_A,
    title: 'Admin Dashboard',
  },
  {
    path: '/teacher/dashboard',
    element: TeacherDashboard,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Teacher Dashboard',
  },
  {
    path: '/student/dashboard',
    element: StudentDashboard,
    protected: true,
    allowedRoles: ['student'],
    title: 'Student Dashboard',
  },

  // ── User Management ───────────────────────────────────────────────────────
  {
    path: '/super-admin/users/groups',
    element: UserGroupList,
    protected: true,
    allowedRoles: SA,
    title: 'User Group List',
  },
  {
    path: '/super-admin/users/roles',
    element: UserRoleGroupManagement,
    protected: true,
    allowedRoles: SA,
    title: 'Role & Permissions',
  },
  {
    path: '/super-admin/users',
    element: AllUsers,
    protected: true,
    allowedRoles: SA,
    title: 'All Users',
  },

  // ── System Management ─────────────────────────────────────────────────────
  {
    path: '/super-admin/system/tasks',
    element: SystemTasks,
    protected: true,
    allowedRoles: SA,
    title: 'System Tasks',
  },
  {
    path: '/super-admin/system/users',
    element: SystemUsers,
    protected: true,
    allowedRoles: SA,
    title: 'System Users',
  },

  // ── Institute Setup ───────────────────────────────────────────────────────
  {
    path: '/super-admin/institute/profile',
    element: ProfileSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Profile Setup',
  },
  {
    path: '/super-admin/institute/campus',
    element: CampusSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Campus Setup',
  },
  {
    path: '/super-admin/institute/shift',
    element: ShiftSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Shift Setup',
  },
  {
    path: '/super-admin/institute/medium',
    element: MediumSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Medium Setup',
  },
  {
    path: '/super-admin/institute/education-level',
    element: EducationLevelSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Education Level Setup',
  },
  {
    path: '/super-admin/institute/departments',
    element: DepartmentSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Department Setup',
  },
  {
    path: '/super-admin/institute/class',
    element: ClassSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Class Setup',
  },
  {
    path: '/super-admin/institute/section',
    element: SectionSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Section Setup',
  },
  {
    path: '/super-admin/institute/subject',
    element: SubjectSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Subject Setup',
  },
  {
    path: '/super-admin/institute/session',
    element: SessionSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Session Setup',
  },
  {
    path: '/super-admin/institute/subject-sub-type',
    element: SubjectSubType,
    protected: true,
    allowedRoles: SA,
    title: 'Subject Sub Type',
  },
  {
    path: '/super-admin/institute/class-subjects',
    element: ClassSubjects,
    protected: true,
    allowedRoles: SA,
    title: 'Class Subjects',
  },
  {
    path: '/super-admin/institute/background',
    element: BackgroundUpload,
    protected: true,
    allowedRoles: SA,
    title: 'Background Upload',
  },
  {
    path: '/super-admin/institute/designation',
    element: DesignationSetup,
    protected: true,
    allowedRoles: SA,
    title: 'Designation Setup',
  },
  {
    path: '/super-admin/institute/payment-gateway',
    element: PaymentGatewayAPI,
    protected: true,
    allowedRoles: SA,
    title: 'Payment Gateway API',
  },
  {
    path: '/super-admin/institute/payment-charge',
    element: PaymentGatewayCharge,
    protected: true,
    allowedRoles: SA,
    title: 'Payment Gateway Charge',
  },

  // ── Global Settings / Cache ───────────────────────────────────────────────
  {
    path: '/super-admin/settings/global',
    element: GlobalSettings,
    protected: true,
    allowedRoles: SA,
    title: 'Global Settings',
  },
  {
    path: '/super-admin/clear-cache',
    element: ClearCache,
    protected: true,
    allowedRoles: SA,
    title: 'Clear Cache',
  },

  // ── Accounts › Configurations ─────────────────────────────────────────────
  {
    path: '/super-admin/accounts/config/transaction-types',
    element: TransactionTypes,
    protected: true,
    allowedRoles: SA,
    title: 'Transaction Types',
  },
  {
    path: '/super-admin/accounts/config/transaction-head',
    element: TransactionHead,
    protected: true,
    allowedRoles: SA,
    title: 'Transaction Head',
  },
  {
    path: '/super-admin/accounts/config/fee-template',
    element: FeeCollectionTemplate,
    protected: true,
    allowedRoles: SA,
    title: 'Fee Collection Template',
  },
  {
    path: '/super-admin/accounts/config/invoice',
    element: InvoiceConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Invoice Config',
  },
  {
    path: '/super-admin/accounts/config/discount',
    element: DiscountConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Discount Config',
  },
  {
    path: '/super-admin/accounts/config/closing',
    element: AccountClosing,
    protected: true,
    allowedRoles: SA,
    title: 'Account Closing',
  },
  {
    path: '/super-admin/accounts/config/fine',
    element: StudentFineConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Student Fine Config',
  },
  {
    path: '/super-admin/accounts/config/previous-due',
    element: PreviousDue,
    protected: true,
    allowedRoles: SA,
    title: 'Previous Due',
  },

  // ── Accounts › Income ─────────────────────────────────────────────────────
  {
    path: '/super-admin/accounts/income/manual-fee',
    element: ManualFeeCollection,
    protected: true,
    allowedRoles: SA,
    title: 'Manual Fee Collection',
  },
  {
    path: '/super-admin/accounts/income/other',
    element: OtherIncome,
    protected: true,
    allowedRoles: SA,
    title: 'Other Income',
  },
  {
    path: '/super-admin/accounts/income/extra-fee',
    element: ExtraFeeCollection,
    protected: true,
    allowedRoles: SA,
    title: 'Extra Fee Collection',
  },
  {
    path: '/super-admin/accounts/income/bank-fee',
    element: BankFeeCollection,
    protected: true,
    allowedRoles: SA,
    title: 'Bank Fee Collection',
  },
  {
    path: '/super-admin/accounts/income/add',
    element: AddIncome,
    protected: true,
    allowedRoles: SA,
    title: 'Add Income',
  },

  // ── Accounts › Expenses ───────────────────────────────────────────────────
  {
    path: '/super-admin/accounts/expenses/salary',
    element: TeacherSalary,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher Salary',
  },
  {
    path: '/super-admin/accounts/expenses/other',
    element: OtherExpenses,
    protected: true,
    allowedRoles: SA,
    title: 'Other Expenses',
  },

  // ── Accounts › Reports ────────────────────────────────────────────────────
  {
    path: '/super-admin/accounts/reports/invoice-list',
    element: InvoiceList,
    protected: true,
    allowedRoles: SA,
    title: 'Invoice List',
  },
  {
    path: '/super-admin/accounts/reports/invoice-details',
    element: InvoiceListDetails,
    protected: true,
    allowedRoles: SA,
    title: 'Invoice List Details',
  },
  {
    path: '/super-admin/accounts/reports/total-collection',
    element: TotalCollection,
    protected: true,
    allowedRoles: SA,
    title: 'Total Collection Report',
  },
  {
    path: '/super-admin/accounts/reports/monthly-fee',
    element: MonthlyFeeReport,
    protected: true,
    allowedRoles: SA,
    title: 'Monthly Fee Report',
  },
  {
    path: '/super-admin/accounts/reports/balance-sheet',
    element: BalanceSheet,
    protected: true,
    allowedRoles: SA,
    title: 'Monthly Balance Sheet',
  },
  {
    path: '/super-admin/accounts/reports/student-balance',
    element: StudentBalanceSheet,
    protected: true,
    allowedRoles: SA,
    title: 'Student Balance Sheet',
  },
  {
    path: '/super-admin/accounts/reports/paid-unpaid',
    element: PaidUnpaidReport,
    protected: true,
    allowedRoles: SA,
    title: 'Paid Unpaid Report',
  },
  {
    path: '/super-admin/accounts/reports/online-payment-list',
    element: OnlinePaymentList,
    protected: true,
    allowedRoles: SA,
    title: 'Online Payment List',
  },
  {
    path: '/super-admin/accounts/reports/admission-payment-report',
    element: AdmissionPaymentReport,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Payment Report',
  },
  {
    path: '/super-admin/accounts/reports/admission-payment-summary',
    element: AdmissionPaymentSummary,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Payment Summary',
  },
  {
    path: '/super-admin/accounts/reports/admission-payment-summary-details',
    element: AdmissionPaymentSummaryDetails,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Payment Summary Details',
  },
  {
    path: '/super-admin/accounts/reports/admission-payment-summary-collection',
    element: AdmissionPaymentSummaryCollection,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Payment Summary Collection',
  },
  {
    path: '/super-admin/accounts/reports/admission-payment-transaction',
    element: AdmissionPaymentTransaction,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Payment Transaction',
  },
  {
    path: '/super-admin/accounts/reports/apply-for-admission',
    element: ApplyForAdmission,
    protected: true,
    allowedRoles: SA,
    title: 'Apply For Admission',
  },
  {
    path: '/super-admin/accounts/reports/online-payment-list',
    element: OnlinePaymentList,
    protected: true,
    allowedRoles: SA,
    title: 'Online Payment List',
  },
  {
    path: '/super-admin/accounts/reports/student-payment-details',
    element: StudentPaymentDetails,
    protected: true,
    allowedRoles: SA,
    title: 'Student Payment Details',
  },
  {
    path: '/super-admin/accounts/reports/student-payment-histories',
    element: StudentPaymentHistories,
    protected: true,
    allowedRoles: SA,
    title: 'Student Payment Histories',
  },
  {
    path: '/super-admin/accounts/reports/transaction-summary',
    element: TransactionSummaryReport,
    protected: true,
    allowedRoles: SA,
    title: 'Transaction Summary Report',
  },

  // ── Teacher & Staff ───────────────────────────────────────────────────────
  {
    path: '/super-admin/teachers/add',
    element: AddTeacher,
    protected: true,
    allowedRoles: SA,
    title: 'Add Teacher',
  },
  {
    path: '/super-admin/teachers/bulk-upload',
    element: BulkTeacherUpload,
    protected: true,
    allowedRoles: SA,
    title: 'Bulk Teacher Upload',
  },
  {
    path: '/super-admin/teachers/bulk-update',
    element: BulkTeacherUpdate,
    protected: true,
    allowedRoles: SA,
    title: 'Bulk Teacher Update',
  },
  {
    path: '/super-admin/teachers',
    element: TeacherList,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher List',
  },
  {
    path: '/super-admin/teachers/departmental-head',
    element: DepartmentalHead,
    protected: true,
    allowedRoles: SA,
    title: 'Departmental Head',
  },
  {
    path: '/super-admin/teachers/course-advising',
    element: TeacherCourseAdvising,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher Course Advising',
  },
  {
    path: '/super-admin/teachers/id-card',
    element: TeacherIDCard,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher ID Card Print',
  },

  // ── Student Setup ─────────────────────────────────────────────────────────
  {
    path: '/super-admin/students/add',
    element: AddSingleStudent,
    protected: true,
    allowedRoles: SA,
    title: 'Add Student',
  },
  {
    path: '/super-admin/students',
    element: StudentList,
    protected: true,
    allowedRoles: SA,
    title: 'Students List',
  },
  {
    path: '/super-admin/students/bulk-upload',
    element: StudentBulkUpload,
    protected: true,
    allowedRoles: SA,
    title: 'Student Bulk Upload',
  },
  {
    path: '/super-admin/students/categories',
    element: StudentCategories,
    protected: true,
    allowedRoles: SA,
    title: 'Student Categories',
  },
  {
    path: '/super-admin/students/promotion',
    element: StudentPromotion,
    protected: true,
    allowedRoles: SA,
    title: 'Student Promotion',
  },
  {
    path: '/super-admin/students/migration',
    element: StudentMigration,
    protected: true,
    allowedRoles: SA,
    title: 'Student Migration',
  },
  {
    path: '/super-admin/students/archive',
    element: ArchiveStudents,
    protected: true,
    allowedRoles: SA,
    title: 'Archive Students',
  },
  {
    path: '/super-admin/students/remove-duplicates',
    element: RemoveDuplicateStudent,
    protected: true,
    allowedRoles: SA,
    title: 'Remove Duplicate Students',
  },
  {
    path: '/super-admin/students/roll-prefix',
    element: StudentRollPrefix,
    protected: true,
    allowedRoles: SA,
    title: 'Student Roll Prefix',
  },
  {
    path: '/super-admin/students/id-card',
    element: StudentIDCard,
    protected: true,
    allowedRoles: SA,
    title: 'Student ID Card Print',
  },
  {
    path: '/super-admin/students/show-all',
    element: ShowAllStudent,
    protected: true,
    allowedRoles: SA,
    title: 'Show All Student',
  },
  {
    path: '/super-admin/students/bulk-update',
    element: BulkStudentUpdate,
    protected: true,
    allowedRoles: SA,
    title: 'Bulk Student Update',
  },
  {
    path: '/super-admin/students/bulk-course-advising',
    element: BulkCourseAdvising,
    protected: true,
    allowedRoles: SA,
    title: 'Bulk Course Advising',
  },
  {
    path: '/super-admin/students/list-print',
    element: StudentListPrint,
    protected: true,
    allowedRoles: SA,
    title: 'Student List Print',
  },
  {
    path: '/super-admin/students/list-with-category',
    element: StudentListWithCategory,
    protected: true,
    allowedRoles: SA,
    title: 'Student List With Category',
  },
  {
    path: '/super-admin/students/count-report',
    element: StudentCountReport,
    protected: true,
    allowedRoles: SA,
    title: 'Student Count Report',
  },
  {
    path: '/super-admin/students/image-download',
    element: StudentImageDownload,
    protected: true,
    allowedRoles: SA,
    title: 'Student Image Download',
  },
  {
    path: '/super-admin/students/taught-list',
    element: StudentToughtList,
    protected: true,
    allowedRoles: SA,
    title: 'Student Taught List',
  },
  {
    path: '/super-admin/students/subject-wise',
    element: SubjectWiseStudents,
    protected: true,
    allowedRoles: SA,
    title: 'Subject Wise Students',
  },

  // ── SMS Setup ─────────────────────────────────────────────────────────────
  {
    path: '/super-admin/sms/config',
    element: SMSAPIConfig,
    protected: true,
    allowedRoles: SA,
    title: 'SMS API Config',
  },
  {
    path: '/super-admin/sms/templates',
    element: SMSTemplateSetup,
    protected: true,
    allowedRoles: SA,
    title: 'SMS Template Setup',
  },
  {
    path: '/super-admin/sms/student-bulk',
    element: StudentBulkSMS,
    protected: true,
    allowedRoles: SA,
    title: 'Student Bulk SMS',
  },
  {
    path: '/super-admin/sms/teacher-bulk',
    element: TeacherBulkSMS,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher Bulk SMS',
  },
  {
    path: '/super-admin/sms/bulk-mixed',
    element: BulkSMSMixed,
    protected: true,
    allowedRoles: SA,
    title: 'Bulk SMS Mixed',
  },
  {
    path: '/super-admin/sms/reports',
    element: SMSSentReports,
    protected: true,
    allowedRoles: SA,
    title: 'SMS Sent Reports',
  },

  // ── Candidates ────────────────────────────────────────────────────────────
  {
    path: '/super-admin/candidates/applicants',
    element: ApplicantList,
    protected: true,
    allowedRoles: SA,
    title: 'Applicant List',
  },
  {
    path: '/super-admin/candidates/admission-applicable',
    element: AdmissionApplicable,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Applicable Candidates',
  },

  // ── Calendar ──────────────────────────────────────────────────────────────
  {
    path: '/super-admin/calendar/academic',
    element: AcademicCalendar,
    protected: true,
    allowedRoles: SA,
    title: 'Academic Calendar',
  },
  {
    path: '/super-admin/calendar/events',
    element: EventCalendar,
    protected: true,
    allowedRoles: SA,
    title: 'Event Calendar',
  },

  // ── Class Routine ─────────────────────────────────────────────────────────
  {
    path: '/super-admin/routine/periods',
    element: ClassPeriod,
    protected: true,
    allowedRoles: SA,
    title: 'Class Period',
  },
  {
    path: '/super-admin/routine/schedule',
    element: RoutineSchedule,
    protected: true,
    allowedRoles: SA,
    title: 'Class Routine',
  },

  // ── Exam › Setup ──────────────────────────────────────────────────────────
  {
    path: '/super-admin/exam/setup/template',
    element: ExamTemplate,
    protected: true,
    allowedRoles: SA,
    title: 'Exam Template',
  },
  {
    path: '/super-admin/exam/setup/list',
    element: ExamList,
    protected: true,
    allowedRoles: SA,
    title: 'Exam List',
  },
  {
    path: '/super-admin/exam/setup/sub-subject',
    element: SubSubjectList,
    protected: true,
    allowedRoles: SA,
    title: 'Sub Subject List',
  },

  // ── Exam › Result Setup ───────────────────────────────────────────────────
  {
    path: '/super-admin/exam/result/pass-config',
    element: PassConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Pass Config',
  },
  {
    path: '/super-admin/exam/result/config',
    element: ResultConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Result Config',
  },
  {
    path: '/super-admin/exam/result/merit-config',
    element: MeritConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Merit Config',
  },
  {
    path: '/super-admin/exam/result/grade-point',
    element: GradePoint,
    protected: true,
    allowedRoles: SA,
    title: 'Grade Point',
  },
  {
    path: '/super-admin/exam/result/comment',
    element: CommentSetting,
    protected: true,
    allowedRoles: SA,
    title: 'Comment Setting',
  },

  // ── Exam › Mark Entry ─────────────────────────────────────────────────────
  {
    path: '/super-admin/exam/marks/entry',
    element: MarkEntry,
    protected: true,
    allowedRoles: SA,
    title: 'Mark Entry',
  },
  {
    path: '/super-admin/exam/marks/format',
    element: MarkEntryFormat,
    protected: true,
    allowedRoles: SA,
    title: 'Mark Entry Format',
  },
  {
    path: '/super-admin/exam/marks/teacher-entry',
    element: TeacherMarkEntry,
    protected: true,
    allowedRoles: SA,
    title: 'Teacher Mark Entry',
  },

  // ── Exam › Result Process ─────────────────────────────────────────────────
  {
    path: '/super-admin/exam/process/result',
    element: ProcessResult,
    protected: true,
    allowedRoles: SA,
    title: 'Process Result',
  },
  {
    path: '/super-admin/exam/process/list',
    element: ProcessedExamList,
    protected: true,
    allowedRoles: SA,
    title: 'Processed Exam List',
  },
  {
    path: '/super-admin/exam/process/archive',
    element: ResultArchive,
    protected: true,
    allowedRoles: SA,
    title: 'Result Archive',
  },

  // ── Exam › Reports ────────────────────────────────────────────────────────
  {
    path: '/super-admin/exam/reports/admit-card-qr',
    element: AdmitCardQR,
    protected: true,
    allowedRoles: SA,
    title: 'Admit Card With QR',
  },
  {
    path: '/super-admin/exam/reports/admit-card',
    element: ExamAdmitCard,
    protected: true,
    allowedRoles: SA,
    title: 'Exam Admit Card',
  },
  {
    path: '/super-admin/exam/reports/marksheet',
    element: Marksheet,
    protected: true,
    allowedRoles: SA,
    title: 'Marksheets',
  },
  {
    path: '/super-admin/exam/reports/summary',
    element: ResultSummary,
    protected: true,
    allowedRoles: SA,
    title: 'Result Summary',
  },
  {
    path: '/super-admin/exam/reports/tabulation',
    element: TabulationSheet,
    protected: true,
    allowedRoles: SA,
    title: 'Tabulation Sheet',
  },

  // ── Attendance ────────────────────────────────────────────────────────────
  {
    path: '/super-admin/attendance/student-config',
    element: StudentAttConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Student Att. Config',
  },
  {
    path: '/super-admin/attendance/employee-config',
    element: EmployeeAttConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Employee Att. Config',
  },
  {
    path: '/super-admin/attendance/student-manual',
    element: StudentManualAttendance,
    protected: true,
    allowedRoles: SA,
    title: 'Student Manual Attendance',
  },
  {
    path: '/super-admin/attendance/holiday',
    element: SpecialHoliday,
    protected: true,
    allowedRoles: SA,
    title: 'Special Holiday',
  },

  // ── Library ───────────────────────────────────────────────────────────────
  {
    path: '/super-admin/library/building',
    element: BuildingEntry,
    protected: true,
    allowedRoles: SA,
    title: 'Building Entry',
  },
  {
    path: '/super-admin/library/category',
    element: BookCategory,
    protected: true,
    allowedRoles: SA,
    title: 'Book Category',
  },
  {
    path: '/super-admin/library/books',
    element: BookEntry,
    protected: true,
    allowedRoles: SA,
    title: 'Book Entry',
  },
  {
    path: '/super-admin/library/allocation',
    element: BookAllocation,
    protected: true,
    allowedRoles: SA,
    title: 'Book Allocation',
  },

  // ── Hostel ────────────────────────────────────────────────────────────────
  {
    path: '/super-admin/hostel/rooms',
    element: HostelRoom,
    protected: true,
    allowedRoles: SA,
    title: 'Hostel Rooms',
  },
  {
    path: '/super-admin/hostel/allocation',
    element: HostelAllocation,
    protected: true,
    allowedRoles: SA,
    title: 'Hostel Allocation',
  },

  // ── Certificates ──────────────────────────────────────────────────────────
  {
    path: '/super-admin/certificates/transfer',
    element: TransferCertificate,
    protected: true,
    allowedRoles: SA,
    title: 'Transfer Certificate',
  },
  {
    path: '/super-admin/certificates/study',
    element: StudyCertificate,
    protected: true,
    allowedRoles: SA,
    title: 'Study Certificate',
  },
  {
    path: '/super-admin/certificates/testimonial',
    element: ManualTestimonial,
    protected: true,
    allowedRoles: SA,
    title: 'Manual Testimonial',
  },

  // ── Reports ───────────────────────────────────────────────────────────────
  {
    path: '/super-admin/reports/attendance',
    element: AttendanceReports,
    protected: true,
    allowedRoles: SA,
    title: 'Attendance Reports',
  },
  {
    path: '/super-admin/reports/students',
    element: StudentReports,
    protected: true,
    allowedRoles: SA,
    title: 'Student Reports',
  },
  {
    path: '/super-admin/reports/financial',
    element: FinancialReports,
    protected: true,
    allowedRoles: SA,
    title: 'Financial Reports',
  },
  {
    path: '/super-admin/reports/sms',
    element: SMSReports,
    protected: true,
    allowedRoles: SA,
    title: 'SMS Sending Reports',
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  {
    path: '/super-admin/settings/payment-collection',
    element: PaymentCollectionConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Payment Collection Config',
  },
  {
    path: '/super-admin/settings/admission',
    element: AdmissionConfig,
    protected: true,
    allowedRoles: SA,
    title: 'Admission Config',
  },
  {
    path: '/super-admin/settings/general',
    element: GeneralSettings,
    protected: true,
    allowedRoles: SA,
    title: 'General Settings',
  },

  // ── Admin pages ───────────────────────────────────────────────────────────
  {
    path: '/admin/students',
    element: AdminStudentList,
    protected: true,
    allowedRoles: SA_A,
    title: 'Student List',
  },
  {
    path: '/admin/students/add',
    element: AdminAddStudent,
    protected: true,
    allowedRoles: SA_A,
    title: 'Add Student',
  },
  {
    path: '/admin/teachers',
    element: AdminTeacherList,
    protected: true,
    allowedRoles: SA_A,
    title: 'Teacher List',
  },
  {
    path: '/admin/accounts/fee-collection',
    element: AdminFeeCollection,
    protected: true,
    allowedRoles: SA_A,
    title: 'Fee Collection',
  },
  {
    path: '/admin/accounts/reports',
    element: AdminReports,
    protected: true,
    allowedRoles: SA_A,
    title: 'Account Reports',
  },
  {
    path: '/admin/reports',
    element: AdminAllReports,
    protected: true,
    allowedRoles: SA_A,
    title: 'Reports',
  },

  // ── Teacher pages ─────────────────────────────────────────────────────────
  {
    path: '/teacher/classes',
    element: TeacherClasses,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'My Classes',
  },
  {
    path: '/teacher/students',
    element: TeacherStudents,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Students',
  },
  {
    path: '/teacher/exams/mark-entry',
    element: TeacherExamMarkEntry,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Mark Entry',
  },
  {
    path: '/teacher/exams',
    element: TeacherExamList,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Exam List',
  },
  {
    path: '/teacher/attendance',
    element: TeacherAttendance,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Attendance',
  },
  {
    path: '/teacher/lesson-plan',
    element: LessonPlan,
    protected: true,
    allowedRoles: ['teacher'],
    title: 'Lesson Plan',
  },

  // ── Student pages ─────────────────────────────────────────────────────────
  {
    path: '/student/profile',
    element: StudentProfilePage,
    protected: true,
    allowedRoles: ['student'],
    title: 'My Profile',
  },
  {
    path: '/student/results',
    element: StudentResults,
    protected: true,
    allowedRoles: ['student'],
    title: 'My Results',
  },
  {
    path: '/student/attendance',
    element: StudentAttendance,
    protected: true,
    allowedRoles: ['student'],
    title: 'My Attendance',
  },
  {
    path: '/student/fees/history',
    element: StudentPayHistory,
    protected: true,
    allowedRoles: ['student'],
    title: 'Payment History',
  },
  {
    path: '/student/fees/pending',
    element: StudentPendingFees,
    protected: true,
    allowedRoles: ['student'],
    title: 'Pending Fees',
  },
  {
    path: '/student/library',
    element: StudentLibrary,
    protected: true,
    allowedRoles: ['student'],
    title: 'Library',
  },
  {
    path: '/student/assignments',
    element: StudentAssignments,
    protected: true,
    allowedRoles: ['student'],
    title: 'Assignments',
  },
];

export default routes;
