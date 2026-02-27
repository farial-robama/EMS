// src/pages/admin/studentSetup/StudentList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import {
  ChevronRight,
  Search,
  Pencil,
  Eye,
  Plus,
  Zap,
  Download,
  Users,
  ChevronLeft,
  SlidersHorizontal,
  X,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

/* ── Constants ───────────────────────────────────────────────────────────── */
const EDU_LEVELS = ['School', 'College'];
const DEPARTMENTS = ['Science', 'Humanities', 'Business Studies', 'Default'];
const CLASSES = ['Eight', 'Nine', 'Ten'];
const SECTIONS = ['A', 'B', 'C'];
const SESSIONS = ['2024-2025', '2025'];

const STUDENT_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  studentId: `24020${i.toString().padStart(3, '0')}`,
  regNo: `REG${i + 1}`,
  session: i % 2 === 0 ? '2024-2025' : '2025',
  image: `https://i.pravatar.cc/80?img=${i + 1}`,
  name: `Student ${i + 1}`,
  roll: 70 + i,
  medium: 'Bangla',
  shift: 'Day',
  className: CLASSES[i % 3],
  department: DEPARTMENTS[i % 4],
  section: SECTIONS[i % 3],
  contact: `0170000${(i + 1000).toString().slice(-7)}`,
  formData: {
    fullNameBangla: 'নাম',
    birthRegNo: '1234567890',
    dob: '2008-01-01',
    nationality: 'Bangladeshi',
    country: 'Bangladesh',
    religion: 'Islam',
    bloodGroup: 'A+',
    gender: 'Male',
    maritalStatus: 'Unmarried',
    email: `student${i + 1}@email.com`,
    fatherName: 'Father Name',
    fatherPhone: '01711111111',
    motherName: 'Mother Name',
    motherPhone: '01722222222',
    guardianName: 'Guardian Name',
    guardianPhone: '01733333333',
    roll: 70 + i,
    session: i % 2 === 0 ? '2024-2025' : '2025',
    hostel: 'Magura Hostel',
    hostelRoom: '101',
    hostelType: 'Boys',
    hostelFee: 5000,
    paymentStatus: 'Paid',
    busNo: 'Bus 12',
    roadNo: 'Road 5',
    pickupPoint: 'Stop A',
    dropPoint: 'Stop B',
    transportType: 'Bus',
    driverName: 'Driver Name',
    driverContact: '01755555555',
    transportFee: 3000,
    transportPaymentStatus: 'Paid',
  },
}));

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const inp = `w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600
  bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none transition-all
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30`;

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-semibold'
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

/* ── PDF Generation ──────────────────────────────────────────────────────── */
async function generatePDF(student) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const { formData } = student;
  const W = doc.internal.pageSize.getWidth();
  let y = 40;

  // Title
  doc.setFontSize(20).setTextColor('#1D4ED8');
  doc.text('Student Detailed Profile', W / 2, y, { align: 'center' });
  y += 10;
  doc.setFontSize(10).setTextColor('#64748B');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, W / 2, y + 10, {
    align: 'center',
  });
  y += 30;

  // Avatar
  try {
    doc.addImage(student.image, 'JPEG', W - 110, 30, 70, 70);
  } catch {}

  const header = (title) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }
    doc.setFillColor('#DBEAFE').setDrawColor('#2563EB');
    doc.rect(20, y, W - 40, 22, 'FD');
    doc
      .setFontSize(13)
      .setTextColor('#1D4ED8')
      .text(title, 26, y + 16);
    y += 32;
  };
  const field = (label, value) => {
    if (y > 740) {
      doc.addPage();
      y = 40;
    }
    doc.setFontSize(11).setTextColor('#374151').text(`${label}:`, 26, y);
    doc.setTextColor('#111827').text(String(value || '—'), 155, y);
    y += 17;
  };

  header('Personal Information');
  field('Student ID', student.studentId);
  field('Name', student.name);
  field('Name (Bangla)', formData.fullNameBangla);
  field('Date of Birth', formData.dob);
  field('Religion', formData.religion);
  field('Blood Group', formData.bloodGroup);
  field('Gender', formData.gender);
  field('Email', formData.email);

  header('Family Information');
  field('Father Name', formData.fatherName);
  field('Father Phone', formData.fatherPhone);
  field('Mother Name', formData.motherName);
  field('Mother Phone', formData.motherPhone);
  field('Guardian Name', formData.guardianName);

  header('Academic Information');
  autoTable(doc, {
    startY: y,
    head: [['Class', 'Department', 'Shift', 'Medium', 'Roll', 'Session']],
    body: [
      [
        student.className,
        student.department,
        student.shift,
        student.medium,
        formData.roll,
        formData.session,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: '#DBEAFE',
      textColor: '#1D4ED8',
      fontStyle: 'bold',
    },
    styles: { fontSize: 10 },
    didDrawPage: (d) => {
      y = d.cursor.y + 20;
    },
  });

  header('Hostel & Transport');
  autoTable(doc, {
    startY: y,
    head: [['Hostel', 'Room', 'Fee', 'Bus No', 'Transport Fee']],
    body: [
      [
        formData.hostel,
        formData.hostelRoom,
        formData.hostelFee,
        formData.busNo,
        formData.transportFee,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: '#DBEAFE',
      textColor: '#1D4ED8',
      fontStyle: 'bold',
    },
    styles: { fontSize: 10 },
    didDrawPage: (d) => {
      y = d.cursor.y + 20;
    },
  });

  // QR Code
  try {
    const qr = await QRCode.toDataURL(
      `https://ems.system/student/${student.studentId}`
    );
    if (y + 90 > 820) {
      doc.addPage();
      y = 40;
    }
    doc.addImage(qr, 'PNG', W - 110, y, 80, 80);
    doc
      .setFontSize(8)
      .setTextColor('#9CA3AF')
      .text('Scan to verify', W - 110 + 40, y + 88, { align: 'center' });
  } catch {}

  doc
    .setFontSize(9)
    .setTextColor('#9CA3AF')
    .text('Generated by EMS System', W / 2, 820, { align: 'center' });
  window.open(doc.output('bloburl'));
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function StudentList() {
  const navigate = useNavigate();
  const [students] = useState(STUDENT_DATA);
  const [filters, setFilters] = useState({
    eduLevel: '',
    department: '',
    className: '',
    section: '',
    session: '',
    shift: '',
    medium: '',
  });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pdfLoading, setPdfLoading] = useState(null); // student id

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({
      eduLevel: '',
      department: '',
      className: '',
      section: '',
      session: '',
      shift: '',
      medium: '',
    });
    setSearch('');
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (!filters.department || s.department === filters.department) &&
          (!filters.className || s.className === filters.className) &&
          (!filters.section || s.section === filters.section) &&
          (!filters.session || s.session === filters.session) &&
          (!filters.shift || s.shift === filters.shift) &&
          (!filters.medium || s.medium === filters.medium) &&
          (!search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.studentId.includes(search) ||
            s.roll.toString().includes(search))
      ),
    [students, filters, search]
  );

  useEffect(() => {
    setPage(1);
  }, [filtered.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handleViewPDF = async (student) => {
    setPdfLoading(student.id);
    await generatePDF(student);
    setPdfLoading(null);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumb
              items={['Dashboard', 'Student Setup', 'Student List']}
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Student List
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/quickAddStudent')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 rounded-xl transition-colors"
            >
              <Zap size={14} /> Quick Add
            </button>
            <button
              onClick={() => navigate('/addSingleStudent')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              <Plus size={14} /> Add Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Students',
              value: students.length,
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
            },
            {
              label: 'Filtered',
              value: filtered.length,
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              ic: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
            },
            {
              label: 'This Page',
              value: paged.length,
              bg: 'bg-green-50 dark:bg-green-900/20',
              ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
            },
            {
              label: 'Active Filters',
              value: activeFilterCount,
              bg:
                activeFilterCount > 0
                  ? 'bg-orange-50 dark:bg-orange-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/30',
              ic:
                activeFilterCount > 0
                  ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${s.bg}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.ic}`}
              >
                <Users size={16} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800 dark:text-white leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <SlidersHorizontal
                  size={14}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X size={11} /> Clear all
                </button>
              )}
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${filtersOpen ? 'rotate-90' : ''}`}
              />
            </div>
          </button>
          {filtersOpen && (
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {[
                  { label: 'Shift', name: 'shift', opts: ['Day', 'Morning'] },
                  {
                    label: 'Medium',
                    name: 'medium',
                    opts: ['Bangla', 'English'],
                  },
                  { label: 'Edu. Level', name: 'eduLevel', opts: EDU_LEVELS },
                  {
                    label: 'Department',
                    name: 'department',
                    opts: DEPARTMENTS,
                  },
                  { label: 'Class', name: 'className', opts: CLASSES },
                  { label: 'Section', name: 'section', opts: SECTIONS },
                  { label: 'Session', name: 'session', opts: SESSIONS },
                ].map((f) => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {f.label}
                    </label>
                    <select
                      name={f.name}
                      value={filters[f.name]}
                      onChange={handleFilterChange}
                      className={inp}
                    >
                      <option value="">All</option>
                      {f.opts.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Show
              </span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(+e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 transition-all"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                entries
              </span>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search name, ID, roll…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-56 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {[
                    '#',
                    'Student ID',
                    'Reg. No',
                    'Photo',
                    'Name',
                    'Roll',
                    'Shift',
                    'Medium',
                    'Department',
                    'Class',
                    'Section',
                    'Session',
                    'Contact',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h === 'Actions' ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-5 py-14 text-center">
                      <Users
                        size={40}
                        className="mx-auto text-gray-200 dark:text-gray-600 mb-3"
                      />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        No students match your criteria
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Try adjusting the filters or search term.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paged.map((s, i) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm text-gray-400 dark:text-gray-500">
                        {(safePage - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">
                          {s.studentId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {s.regNo}
                      </td>
                      <td className="px-4 py-3.5">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-9 h-9 rounded-xl object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-mono text-gray-700 dark:text-gray-300">
                        {s.roll}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                        {s.shift}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                        {s.medium}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-lg">
                          {s.department}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                        {s.className}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                        {s.section}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                        {s.session}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-gray-400">
                        {s.contact}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewPDF(s)}
                            disabled={pdfLoading === s.id}
                            className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-all border border-blue-100 dark:border-blue-900"
                            title="View PDF"
                          >
                            {pdfLoading === s.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileText size={13} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              navigate('/addSingleStudent', {
                                state: { student: s },
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center transition-all border border-amber-100 dark:border-amber-900"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}
              –{Math.min(safePage * perPage, filtered.length)} of{' '}
              {filtered.length} entries
              {activeFilterCount > 0 && (
                <span className="ml-1 text-blue-500">
                  (filtered from {students.length} total)
                </span>
              )}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all text-xs font-bold"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === 'string' ? (
                    <span
                      key={i}
                      className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all
                      ${
                        safePage === p
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-all text-xs font-bold"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
