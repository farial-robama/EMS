# 🎓 EMS — Educational Management System

A full-featured, role-based Educational Management System built with **React**, **React Router**, and **Tailwind CSS**. Designed for schools and colleges to manage students, teachers, accounts, exams, attendance, and more.

---

## 🚀 Tech Stack

| Package | Version | Purpose |
|---|---|---|
| react | ^18.2.0 | UI Framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^7.13.0 | Client-side routing |
| tailwindcss | ^3.4.19 | Utility-first styling |
| react-hook-form | ^7.71.1 | Form management |
| react-toastify | ^11.0.5 | Toast notifications |
| lucide-react | ^0.563.0 | Icon library |
| react-icons | ^5.5.0 | Additional icons |
| axios | ^1.13.2 | HTTP client |
| jspdf | ^4.2.0 | PDF generation |
| jspdf-autotable | ^5.0.7 | PDF table support |
| xlsx | ^0.18.5 | Excel file export |
| qrcode | ^1.5.4 | QR code generation |
| react-to-print | ^3.3.0 | Print support |
| prop-types | ^15.8.1 | Runtime prop validation |
| vite | ^7.2.4 | Build tool |
| prettier | ^3.8.1 | Code formatter |
| eslint | ^9.39.1 | Code linter |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Toast.jsx            # Global toast container
│   │   └── LoadingSpinner.jsx   # Loading indicator
│   └── layout/
│       ├── DashboardLayout.jsx  # Main dashboard shell
│       └── menus.js             # Role-based sidebar menus
├── context/
│   └── AuthContext.jsx          # Auth state & logic
├── hooks/
│   └── useTheme.js              # Dark/light mode hook
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── VerifyEmailPage.jsx
│   ├── dashboards/
│   │   ├── SuperAdminDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   └── StudentDashboard.jsx
│   ├── super-admin/             # All super admin pages
│   ├── admin/                   # Admin pages
│   ├── teacher/                 # Teacher pages
│   └── student/                 # Student pages
├── routes/
│   ├── routes.js                # All app routes (lazy-loaded)
│   └── ProtectedRoute.jsx       # Auth + role guard
├── services/
│   ├── api.js                   # Axios instance
│   └── authService.js           # Auth API calls
├── utils/
│   ├── toast.js                 # Toast helpers (showSuccess, showError)
│   └── validation.js            # Form validators
├── App.jsx
├── main.jsx
└── index.css
```

---

## 👥 User Roles

The system supports 4 roles, each with its own dashboard, sidebar menu, and route access:

| Role | Dashboard Route | Description |
|---|---|---|
| `super_admin` | `/super-admin/dashboard` | Full system access |
| `admin` | `/admin/dashboard` | School administration |
| `teacher` | `/teacher/dashboard` | Class & exam management |
| `student` | `/student/dashboard` | Personal academic info |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/advanceitsolutions2025/EMS-Frontend.git
cd ems

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory.

<!-- ```env
VITE_API_BASE_URL=http://localhost:5000/api
``` -->

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

---

## 🔐 Authentication

- JWT-based authentication
- Tokens stored in `localStorage`
- Role is normalized on login (e.g. `superAdmin` → `super_admin`)
- Session is restored automatically on page reload via `checkAuth()`
- Protected routes redirect unauthenticated users to `/auth/login`

### Auth Flow

```
Login → JWT stored → Role detected → Redirect to role dashboard
Logout → State cleared → Navigate to /auth/login with toast notification
```

---

## 🗂️ Sidebar Menus

Each role has its own menu config in `src/components/layout/menus.js`:

- `superAdminMenu` — Full menu with nested 3-level submenus
- `adminMenu` — Simplified admin menu
- `teacherMenu` — Teacher-specific items
- `studentMenu` — Student-facing items

Menus support up to **3 levels of nesting** and are filtered by user permissions automatically.

---

## 🎨 Theming

- **Dark mode** supported via `.dark` class on `<html>` and `<body>`
- Toggled via the `useTheme` hook
- CSS variables defined in `index.css` for all theme tokens
- Smooth transitions on theme change

---

## 📦 Key Features

### Super Admin
- Global configurations (institute, campus, shifts, classes, subjects, sessions)
- User & role management with permissions
- Full accounts module (income, expenses, reports, invoices)
- Student & teacher management with bulk upload
- Exam & result management (templates, mark entry, grade points)
- Attendance, library, hostel, certificates, SMS setup
- Reports & system settings

### Admin
- Student and teacher list management
- Fee collection and account reports

### Teacher
- Class management, student view
- Mark entry and exam list
- Attendance and lesson plans

### Student
- Profile, results, attendance
- Fee history and pending fees
- Library and assignments

---

## 🔔 Toast Notifications

Uses **react-toastify**. The `<Toast />` component (ToastContainer) is mounted globally in `App.jsx`.

```js
import { showSuccess, showError } from '../utils/toast';

showSuccess('Operation successful!');
showError('Something went wrong.');
```

---

## 🛡️ Route Protection

Routes are protected via `ProtectedRoute.jsx`:

```jsx
<ProtectedRoute allowedRoles={['super_admin', 'admin']}>
  <MyPage />
</ProtectedRoute>
```

Unauthorized users are redirected to `/auth/login`. Wrong-role users are redirected to their own dashboard.

---

## 📄 License

© 2026 Advance IT Solutions. All rights reserved.