// src/components/layout/menus.js
import {
  Home,
  Users,
  Settings,
  BookOpen,
  Clock,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Calendar,
  MessageSquare,
  FileText,
  BarChart,
  DollarSign,
  Shield,
  Layers,
  ShieldCheck,
  Globe,
  Briefcase, // ✅ Replaces UserTie (not available in all versions)
  Cog,
  Table,
  Award,
  Smartphone,
  CheckSquare,
  Book,
  Bed,
  Plane,
  Download,
  IdCard,
  School,
  CreditCard,
  TrendingUp,
  FileSpreadsheet,
  Building,
} from 'lucide-react';

// ==================== SUPER ADMIN MENU ====================
export const superAdminMenu = [
  // Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/super-admin/dashboard',
    permission: 'dashboard.view',
  },

  // User Management
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    permission: 'users.view',
    submenus: [
      {
        id: 'user-group-list',
        label: 'User Group List',
        path: '/super-admin/users/groups',
        permission: 'users.groups.view',
      },
      {
        id: 'user-role-group-management',
        label: 'User Role Group Management',
        path: '/super-admin/users/roles',
        permission: 'users.roles.view',
      },
      {
        id: 'all-users',
        label: 'All Users',
        path: '/super-admin/users',
        permission: 'users.view',
      },
    ],
  },

  // System Management
  {
    id: 'system-management',
    label: 'System Management',
    icon: Cog,
    permission: 'system.view',
    submenus: [
      {
        id: 'tasks',
        label: 'Task',
        path: '/super-admin/system/tasks',
        permission: 'system.tasks.view',
      },
      {
        id: 'users-system',
        label: 'Users',
        path: '/super-admin/system/users',
        permission: 'system.users.view',
      },
    ],
  },

  // Global Configurations
  {
    id: 'global-configurations',
    label: 'Global Configurations',
    icon: Globe,
    permission: 'global.view',
    submenus: [
      // Institute Setup (nested submenu)
      {
        id: 'institute-setup',
        label: 'Institute Setup',
        permission: 'institute.view',
        isNested: true,
        submenus: [
          {
            id: 'profile-setup',
            label: 'Profile Setup',
            path: '/super-admin/institute/profile',
            permission: 'institute.profile.view',
          },
          {
            id: 'campus-setup',
            label: 'Campus Setup',
            path: '/super-admin/institute/campus',
            permission: 'institute.campus.view',
          },
          {
            id: 'shift-setup',
            label: 'Shift Setup',
            path: '/super-admin/institute/shift',
            permission: 'institute.shift.view',
          },
          {
            id: 'medium-setup',
            label: 'Medium Setup',
            path: '/super-admin/institute/medium',
            permission: 'institute.medium.view',
          },
          {
            id: 'education-level',
            label: 'Education Level Setup',
            path: '/super-admin/institute/education-level',
            permission: 'institute.education.view',
          },
          {
            id: 'department-setup',
            label: 'Department Setup',
            path: '/super-admin/institute/departments',
            permission: 'institute.department.view',
          },
          {
            id: 'class-setup',
            label: 'Class Setup',
            path: '/super-admin/institute/class',
            permission: 'institute.class.view',
          },
          {
            id: 'section-setup',
            label: 'Section Setup',
            path: '/super-admin/institute/section',
            permission: 'institute.section.view',
          },
          {
            id: 'subject-setup',
            label: 'Subject Setup',
            path: '/super-admin/institute/subject',
            permission: 'institute.subject.view',
          },
          {
            id: 'session-setup',
            label: 'Session Setup',
            path: '/super-admin/institute/session',
            permission: 'institute.session.view',
          },
          {
            id: 'subject-sub-type',
            label: 'Subject Sub Type',
            path: '/super-admin/institute/subject-sub-type',
            permission: 'institute.subject-type.view',
          },
          {
            id: 'class-subjects',
            label: 'Class Subjects',
            path: '/super-admin/institute/class-subjects',
            permission: 'institute.class-subjects.view',
          },
          {
            id: 'background-upload',
            label: 'Background Upload',
            path: '/super-admin/institute/background',
            permission: 'institute.background.view',
          },
          {
            id: 'designation-setup',
            label: 'Designation Setup',
            path: '/super-admin/institute/designation',
            permission: 'institute.designation.view',
          },
          {
            id: 'payment-gateway-api',
            label: 'Payment Gateway API',
            path: '/super-admin/institute/payment-gateway',
            permission: 'institute.payment.view',
          },
          {
            id: 'payment-gateway-charge',
            label: 'Payment Gateway Charge',
            path: '/super-admin/institute/payment-charge',
            permission: 'institute.payment-charge.view',
          },
        ],
      },
      {
        id: 'global-settings',
        label: 'Global Settings',
        path: '/super-admin/settings/global',
        permission: 'settings.global.view',
      },
      {
        id: 'clear-cache',
        label: 'Clear Cache',
        path: '/super-admin/clear-cache',
        permission: 'system.cache.clear',
        isAction: true,
      },
    ],
  },

  // Accounts
  {
    id: 'accounts',
    label: 'Accounts',
    icon: DollarSign,
    permission: 'accounts.view',
    submenus: [
      // Configurations
      {
        id: 'accounts-configurations',
        label: 'Configurations',
        permission: 'accounts.config.view',
        isNested: true,
        submenus: [
          {
            id: 'transaction-types',
            label: 'Transaction Types',
            path: '/super-admin/accounts/config/transaction-types',
            permission: 'accounts.transaction-types.view',
          },
          {
            id: 'transaction-head',
            label: 'Transaction Head',
            path: '/super-admin/accounts/config/transaction-head',
            permission: 'accounts.transaction-head.view',
          },
          {
            id: 'fee-collection-template',
            label: 'Fee Collection Template',
            path: '/super-admin/accounts/config/fee-template',
            permission: 'accounts.fee-template.view',
          },
          {
            id: 'invoice-configuration',
            label: 'Invoice Config.',
            path: '/super-admin/accounts/config/invoice',
            permission: 'accounts.invoice.view',
          },
          {
            id: 'discount-config',
            label: 'Discount Config.',
            path: '/super-admin/accounts/config/discount',
            permission: 'accounts.discount.view',
          },
          {
            id: 'account-closing',
            label: 'Account Closing',
            path: '/super-admin/accounts/config/closing',
            permission: 'accounts.closing.view',
          },
          {
            id: 'student-fine-config',
            label: 'Student Fine Config.',
            path: '/super-admin/accounts/config/fine',
            permission: 'accounts.fine.view',
          },
          {
            id: 'previous-due',
            label: 'Previous Due',
            path: '/super-admin/accounts/config/previous-due',
            permission: 'accounts.due.view',
          },
        ],
      },
      // Income
      {
        id: 'income',
        label: 'Income',
        permission: 'accounts.income.view',
        isNested: true,
        submenus: [
          {
            id: 'manual-fee-collection',
            label: 'Manual Fee Collection',
            path: '/super-admin/accounts/income/manual-fee',
            permission: 'accounts.manual-fee.view',
          },
          {
            id: 'other-income',
            label: 'Other Income',
            path: '/super-admin/accounts/income/other',
            permission: 'accounts.other-income.view',
          },
          {
            id: 'extra-fee-collection',
            label: 'Extra Fee Collection',
            path: '/super-admin/accounts/income/extra-fee',
            permission: 'accounts.extra-fee.view',
          },
          {
            id: 'bank-fee-collection',
            label: 'Bank Fee Collection',
            path: '/super-admin/accounts/income/bank-fee',
            permission: 'accounts.bank-fee.view',
          },
          {
            id: 'add-income',
            label: 'Add Income',
            path: '/super-admin/accounts/income/add',
            permission: 'accounts.income.create',
          },
        ],
      },
      // Expenses
      {
        id: 'expenses',
        label: 'Expenses',
        permission: 'accounts.expenses.view',
        isNested: true,
        submenus: [
          {
            id: 'teacher-salary',
            label: 'Teacher Salary',
            path: '/super-admin/accounts/expenses/salary',
            permission: 'accounts.salary.view',
          },
          {
            id: 'other-expenses',
            label: 'Other Expenses',
            path: '/super-admin/accounts/expenses/other',
            permission: 'accounts.other-expenses.view',
          },
        ],
      },
      // Reports
      {
        id: 'accounts-reports',
        label: 'Reports',
        permission: 'accounts.reports.view',
        isNested: true,
        submenus: [
          {
            id: 'invoice-list',
            label: 'Invoice List',
            path: '/super-admin/accounts/reports/invoice-list',
            permission: 'accounts.invoice-list.view',
          },
          {
            id: 'invoice-list-details',
            label: 'Invoice List Details',
            path: '/super-admin/accounts/reports/invoice-details',
            permission: 'accounts.invoice-details.view',
          },
          {
            id: 'total-collection',
            label: 'Total Collection Report',
            path: '/super-admin/accounts/reports/total-collection',
            permission: 'accounts.collection.view',
          },
          {
            id: 'monthly-fee-report',
            label: 'Monthly Fee Report',
            path: '/super-admin/accounts/reports/monthly-fee',
            permission: 'accounts.monthly-fee.view',
          },
          {
            id: 'balance-sheet',
            label: 'Monthly Balance Sheet',
            path: '/super-admin/accounts/reports/balance-sheet',
            permission: 'accounts.balance-sheet.view',
          },
          {
            id: 'student-balance-sheet',
            label: 'Student Balance Sheet',
            path: '/super-admin/accounts/reports/student-balance',
            permission: 'accounts.student-balance.view',
          },
          {
            id: 'paid-unpaid-report',
            label: 'Paid Unpaid Report',
            path: '/super-admin/accounts/reports/paid-unpaid',
            permission: 'accounts.paid-unpaid.view',
          },
        ],
      },
    ],
  },

  // Teacher & Staff
  {
    id: 'teacher-staff',
    label: 'Teacher & Staff',
    icon: Briefcase, // ✅ Fixed: was UserTie
    permission: 'teachers.view',
    submenus: [
      {
        id: 'add-teacher',
        label: 'Add Teacher',
        path: '/super-admin/teachers/add',
        permission: 'teachers.create',
      },
      {
        id: 'bulk-teacher-upload',
        label: 'Bulk Teacher Upload',
        path: '/super-admin/teachers/bulk-upload',
        permission: 'teachers.bulk-upload',
      },
      {
        id: 'bulk-teacher-update',
        label: 'Bulk Teacher Update',
        path: '/super-admin/teachers/bulk-update',
        permission: 'teachers.bulk-update',
      },
      {
        id: 'teacher-list',
        label: 'Teacher List',
        path: '/super-admin/teachers',
        permission: 'teachers.view',
      },
      {
        id: 'departmental-head',
        label: 'Departmental Head',
        path: '/super-admin/teachers/departmental-head',
        permission: 'teachers.head.view',
      },
      {
        id: 'teacher-course-advising',
        label: 'Teacher Course Advising',
        path: '/super-admin/teachers/course-advising',
        permission: 'teachers.advising.view',
      },
      {
        id: 'teacher-id-card',
        label: 'Teacher ID Card Print',
        path: '/super-admin/teachers/id-card',
        permission: 'teachers.id-card.view',
      },
    ],
  },

  // Student Setup
  {
    id: 'student-setup',
    label: 'Student Setup',
    icon: GraduationCap,
    permission: 'students.view',
    submenus: [
      {
        id: 'add-single-student',
        label: 'Add Single Student',
        path: '/super-admin/students/add',
        permission: 'students.create',
      },
      {
        id: 'student-list',
        label: 'Students List',
        path: '/super-admin/students',
        permission: 'students.view',
      },
      {
        id: 'student-bulk-upload',
        label: 'Student Bulk Upload',
        path: '/super-admin/students/bulk-upload',
        permission: 'students.bulk-upload',
      },
      {
        id: 'student-categories',
        label: 'Student Categories',
        path: '/super-admin/students/categories',
        permission: 'students.categories.view',
      },
      {
        id: 'student-promotion',
        label: 'Student Promotion',
        path: '/super-admin/students/promotion',
        permission: 'students.promotion.view',
      },
      {
        id: 'student-migration',
        label: 'Student Migration',
        path: '/super-admin/students/migration',
        permission: 'students.migration.view',
      },
      {
        id: 'remove-duplicate-students',
        label: 'Remove Duplicate Students',
        path: '/super-admin/students/remove-duplicates',
        permission: 'students.remove-duplicates.view',
      },
      {
        id: 'student-roll-prefix',
        label: 'Student Roll Prefix',
        path: '/super-admin/students/roll-prefix',
        permission: 'students.roll-prefix.view',
      },
      {
        id: 'archive-students',
        label: 'Archive Students',
        path: '/super-admin/students/archive',
        permission: 'students.archive.view',
      },
      {
        id: 'student-id-card',
        label: 'Student ID Card Print',
        path: '/super-admin/students/id-card',
        permission: 'students.id-card.view',
      },
    ],
  },

  // SMS Setup
  {
    id: 'sms-setup',
    label: 'SMS Setup',
    icon: Smartphone,
    permission: 'sms.view',
    submenus: [
      {
        id: 'sms-api-config',
        label: 'SMS API Config.',
        path: '/super-admin/sms/config',
        permission: 'sms.config.view',
      },
      {
        id: 'sms-template-setup',
        label: 'SMS Template Setup',
        path: '/super-admin/sms/templates',
        permission: 'sms.templates.view',
      },
      {
        id: 'student-bulk-sms',
        label: 'Student Bulk SMS',
        path: '/super-admin/sms/student-bulk',
        permission: 'sms.student.send',
      },
      {
        id: 'teacher-bulk-sms',
        label: 'Teacher Bulk SMS',
        path: '/super-admin/sms/teacher-bulk',
        permission: 'sms.teacher.send',
      },
      {
        id: 'bulk-sms-mixed',
        label: 'Bulk SMS Mixed',
        path: '/super-admin/sms/bulk-mixed',
        permission: 'sms.mixed.send',
      },
      {
        id: 'sms-sent-reports',
        label: 'SMS Sent Reports',
        path: '/super-admin/sms/reports',
        permission: 'sms.reports.view',
      },
    ],
  },

  // Candidates
  {
    id: 'candidates',
    label: 'Candidates',
    icon: Users,
    permission: 'candidates.view',
    submenus: [
      {
        id: 'applicant-list',
        label: 'Applicant List',
        path: '/super-admin/candidates/applicants',
        permission: 'candidates.applicants.view',
      },
      {
        id: 'admission-applicable',
        label: 'Admission Applicable Candidates',
        path: '/super-admin/candidates/admission-applicable',
        permission: 'candidates.admission.view',
      },
    ],
  },

  // Calendar View
  {
    id: 'calendar-view',
    label: 'Calendar View',
    icon: Calendar,
    permission: 'calendar.view',
    submenus: [
      {
        id: 'academic-calendar',
        label: 'Academic Calendar',
        path: '/super-admin/calendar/academic',
        permission: 'calendar.academic.view',
      },
      {
        id: 'event-calendar',
        label: 'Event Calendar',
        path: '/super-admin/calendar/events',
        permission: 'calendar.events.view',
      },
    ],
  },

  // Class Routine
  {
    id: 'class-routine',
    label: 'Class Routine',
    icon: Table,
    permission: 'routine.view',
    submenus: [
      {
        id: 'class-period',
        label: 'Class Period',
        path: '/super-admin/routine/periods',
        permission: 'routine.periods.view',
      },
      {
        id: 'routine-schedule',
        label: 'Class Routine',
        path: '/super-admin/routine/schedule',
        permission: 'routine.schedule.view',
      },
    ],
  },

  // Exam & Result
  {
    id: 'exam-result',
    label: 'Exam & Result',
    icon: Award,
    permission: 'exam.view',
    submenus: [
      // Exam Setup
      {
        id: 'exam-setup',
        label: 'Exam Setup',
        permission: 'exam.setup.view',
        isNested: true,
        submenus: [
          {
            id: 'exam-template',
            label: 'Exam Template',
            path: '/super-admin/exam/setup/template',
            permission: 'exam.template.view',
          },
          {
            id: 'exam-list',
            label: 'Exam List',
            path: '/super-admin/exam/setup/list',
            permission: 'exam.list.view',
          },
          {
            id: 'sub-subject-list',
            label: 'Sub Subject List',
            path: '/super-admin/exam/setup/sub-subject',
            permission: 'exam.sub-subject.view',
          },
        ],
      },
      // Result Setup
      {
        id: 'result-setup',
        label: 'Result Setup',
        permission: 'result.setup.view',
        isNested: true,
        submenus: [
          {
            id: 'pass-config',
            label: 'Pass Config.',
            path: '/super-admin/exam/result/pass-config',
            permission: 'result.pass-config.view',
          },
          {
            id: 'result-config',
            label: 'Result Config.',
            path: '/super-admin/exam/result/config',
            permission: 'result.config.view',
          },
          {
            id: 'merit-config',
            label: 'Merit Config.',
            path: '/super-admin/exam/result/merit-config',
            permission: 'result.merit-config.view',
          },
          {
            id: 'grade-point',
            label: 'Grade Point',
            path: '/super-admin/exam/result/grade-point',
            permission: 'result.grade-point.view',
          },
          {
            id: 'comment-setting',
            label: 'Comment Setting',
            path: '/super-admin/exam/result/comment',
            permission: 'result.comment.view',
          },
        ],
      },
      // Mark Entry System
      {
        id: 'mark-entry-system',
        label: 'Mark Entry System',
        permission: 'marks.entry.view',
        isNested: true,
        submenus: [
          {
            id: 'mark-entry',
            label: 'Mark Entry',
            path: '/super-admin/exam/marks/entry',
            permission: 'marks.entry.create',
          },
          {
            id: 'mark-entry-format',
            label: 'Mark Entry Format',
            path: '/super-admin/exam/marks/format',
            permission: 'marks.format.view',
          },
          {
            id: 'teacher-mark-entry',
            label: 'Teacher Mark Entry',
            path: '/super-admin/exam/marks/teacher-entry',
            permission: 'marks.teacher.view',
          },
        ],
      },
      // Result Process
      {
        id: 'result-process',
        label: 'Result Process',
        permission: 'result.process.view',
        isNested: true,
        submenus: [
          {
            id: 'process-result',
            label: 'Process Result',
            path: '/super-admin/exam/process/result',
            permission: 'result.process.create',
          },
          {
            id: 'processed-exam-list',
            label: 'Processed Exam List',
            path: '/super-admin/exam/process/list',
            permission: 'result.processed.view',
          },
          {
            id: 'result-archive',
            label: 'Result Archive',
            path: '/super-admin/exam/process/archive',
            permission: 'result.archive.view',
          },
        ],
      },
      // Exam Reports
      {
        id: 'exam-reports',
        label: 'Exam Reports',
        permission: 'exam.reports.view',
        isNested: true,
        submenus: [
          {
            id: 'admit-card-qr',
            label: 'Admit Card With QR',
            path: '/super-admin/exam/reports/admit-card-qr',
            permission: 'exam.admit-card.view',
          },
          {
            id: 'exam-admit-card',
            label: 'Exam Admit Card',
            path: '/super-admin/exam/reports/admit-card',
            permission: 'exam.admit-card.view',
          },
          {
            id: 'marksheet',
            label: 'Marksheets',
            path: '/super-admin/exam/reports/marksheet',
            permission: 'exam.marksheet.view',
          },
          {
            id: 'result-summary',
            label: 'Result Summary',
            path: '/super-admin/exam/reports/summary',
            permission: 'exam.summary.view',
          },
          {
            id: 'tabulation-sheet',
            label: 'Tabulation Sheet',
            path: '/super-admin/exam/reports/tabulation',
            permission: 'exam.tabulation.view',
          },
        ],
      },
    ],
  },

  // Attendance
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CheckSquare,
    permission: 'attendance.view',
    submenus: [
      {
        id: 'student-att-config',
        label: 'Student Att. Time & Config.',
        path: '/super-admin/attendance/student-config',
        permission: 'attendance.student-config.view',
      },
      {
        id: 'employee-att-config',
        label: 'Employee Att. Time & Config.',
        path: '/super-admin/attendance/employee-config',
        permission: 'attendance.employee-config.view',
      },
      {
        id: 'student-manual-attendance',
        label: 'Student Manual Attendance',
        path: '/super-admin/attendance/student-manual',
        permission: 'attendance.student-manual.view',
      },
      {
        id: 'special-holiday',
        label: 'Special Holiday Section',
        path: '/super-admin/attendance/holiday',
        permission: 'attendance.holiday.view',
      },
    ],
  },

  // Library
  {
    id: 'library',
    label: 'Library',
    icon: Book,
    permission: 'library.view',
    submenus: [
      {
        id: 'building-entry',
        label: 'Building Entry',
        path: '/super-admin/library/building',
        permission: 'library.building.view',
      },
      {
        id: 'book-category',
        label: 'Book Category Entry',
        path: '/super-admin/library/category',
        permission: 'library.category.view',
      },
      {
        id: 'book-entry',
        label: 'Book Entry',
        path: '/super-admin/library/books',
        permission: 'library.books.view',
      },
      {
        id: 'book-allocation',
        label: 'Book Allocation',
        path: '/super-admin/library/allocation',
        permission: 'library.allocation.view',
      },
    ],
  },

  // Hostel
  {
    id: 'hostel',
    label: 'Hostel',
    icon: Bed,
    permission: 'hostel.view',
    submenus: [
      {
        id: 'hostel-room',
        label: 'Room',
        path: '/super-admin/hostel/rooms',
        permission: 'hostel.rooms.view',
      },
      {
        id: 'hostel-allocation',
        label: 'Allocation',
        path: '/super-admin/hostel/allocation',
        permission: 'hostel.allocation.view',
      },
    ],
  },

  // Certificates
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    permission: 'certificates.view',
    submenus: [
      {
        id: 'transfer-certificate',
        label: 'Transfer Certificate',
        path: '/super-admin/certificates/transfer',
        permission: 'certificates.transfer.view',
      },
      {
        id: 'study-certificate',
        label: 'Study Certificate',
        path: '/super-admin/certificates/study',
        permission: 'certificates.study.view',
      },
      {
        id: 'manual-testimonial',
        label: 'Manual Testimonial',
        path: '/super-admin/certificates/testimonial',
        permission: 'certificates.testimonial.view',
      },
    ],
  },

  // Reports
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart,
    permission: 'reports.view',
    submenus: [
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        path: '/super-admin/reports/attendance',
        permission: 'reports.attendance.view',
      },
      {
        id: 'student-reports',
        label: 'Student Reports',
        path: '/super-admin/reports/students',
        permission: 'reports.students.view',
      },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        path: '/super-admin/reports/financial',
        permission: 'reports.financial.view',
      },
      {
        id: 'sms-reports',
        label: 'SMS Sending Reports',
        path: '/super-admin/reports/sms',
        permission: 'reports.sms.view',
      },
    ],
  },

  // Settings
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    permission: 'settings.view',
    submenus: [
      {
        id: 'payment-collection-config',
        label: 'Payment Collection Config.',
        path: '/super-admin/settings/payment-collection',
        permission: 'settings.payment.view',
      },
      {
        id: 'admission-config',
        label: 'Admission Config.',
        path: '/super-admin/settings/admission',
        permission: 'settings.admission.view',
      },
      {
        id: 'general-settings',
        label: 'General Settings',
        path: '/super-admin/settings/general',
        permission: 'settings.general.view',
      },
    ],
  },
];

// ==================== ADMIN MENU ====================
export const adminMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/admin/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    permission: 'students.view',
    submenus: [
      {
        id: 'student-list',
        label: 'Student List',
        path: '/admin/students',
        permission: 'students.view',
      },
      {
        id: 'add-student',
        label: 'Add Student',
        path: '/admin/students/add',
        permission: 'students.create',
      },
    ],
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: UserCheck,
    permission: 'teachers.view',
    submenus: [
      {
        id: 'teacher-list',
        label: 'Teacher List',
        path: '/admin/teachers',
        permission: 'teachers.view',
      },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: DollarSign,
    permission: 'accounts.view',
    submenus: [
      {
        id: 'fee-collection',
        label: 'Fee Collection',
        path: '/admin/accounts/fee-collection',
        permission: 'accounts.fee.view',
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/admin/accounts/reports',
        permission: 'accounts.reports.view',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart,
    path: '/admin/reports',
    permission: 'reports.view',
  },
];

// ==================== TEACHER MENU ====================
export const teacherMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/teacher/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'classes',
    label: 'My Classes',
    icon: BookOpen,
    path: '/teacher/classes',
    permission: 'classes.view',
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    path: '/teacher/students',
    permission: 'students.view',
  },
  {
    id: 'exams',
    label: 'Exams',
    icon: ClipboardList,
    permission: 'exam.view',
    submenus: [
      {
        id: 'mark-entry',
        label: 'Mark Entry',
        path: '/teacher/exams/mark-entry',
        permission: 'marks.entry.create',
      },
      {
        id: 'exam-list',
        label: 'Exam List',
        path: '/teacher/exams',
        permission: 'exam.list.view',
      },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Calendar,
    path: '/teacher/attendance',
    permission: 'attendance.view',
  },
  {
    id: 'lesson-plan',
    label: 'Lesson Plan',
    icon: FileText,
    path: '/teacher/lesson-plan',
    permission: 'lesson-plan.view',
  },
];

// ==================== STUDENT MENU ====================
export const studentMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/student/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'my-profile',
    label: 'My Profile',
    icon: Users,
    path: '/student/profile',
    permission: 'profile.view',
  },
  {
    id: 'results',
    label: 'My Results',
    icon: FileText,
    path: '/student/results',
    permission: 'results.view',
  },
  {
    id: 'attendance',
    label: 'My Attendance',
    icon: Clock,
    path: '/student/attendance',
    permission: 'attendance.view',
  },
  {
    id: 'fees',
    label: 'Fees & Payments',
    icon: DollarSign,
    permission: 'fees.view',
    submenus: [
      {
        id: 'payment-history',
        label: 'Payment History',
        path: '/student/fees/history',
        permission: 'fees.history.view',
      },
      {
        id: 'pending-fees',
        label: 'Pending Fees',
        path: '/student/fees/pending',
        permission: 'fees.pending.view',
      },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    path: '/student/library',
    permission: 'library.view',
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: ClipboardList,
    path: '/student/assignments',
    permission: 'assignments.view',
  },
];
