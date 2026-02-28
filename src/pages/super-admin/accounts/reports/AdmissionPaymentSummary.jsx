import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  ChevronRight,
  Eye,
  Users,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Printer,
  ArrowLeft,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const summaryData = [
  { id: 1, department: 'Bachelor of Business Studies (BBS)', totalCandidate: 19, totalAmount: 160930 },
  { id: 2, department: 'Bachelor of Arts (B.A.)', totalCandidate: 44, totalAmount: 372680 },
  { id: 3, department: 'Bachelor of Social Science (B.S.S)', totalCandidate: 21, totalAmount: 177870 },
];

const formatMoney = (amount) =>
  Number(amount).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span className={i === items.length - 1 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'hover:text-blue-500 cursor-pointer'}>
          {item}
        </span>
        {i < items.length - 1 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
      </React.Fragment>
    ))}
  </nav>
);

const AdmissionPaymentSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const totalCandidate = useMemo(() => summaryData.reduce((s, r) => s + r.totalCandidate, 0), []);
  const totalAmount = useMemo(() => summaryData.reduce((s, r) => s + r.totalAmount, 0), []);
  const avgAmount = useMemo(() => (totalCandidate > 0 ? totalAmount / totalCandidate : 0), [totalAmount, totalCandidate]);

  const handlePrint = () => window.print();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Admission Payment Report', 'Payment Summary']} />
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={22} className="text-green-500" /> Payment Summary
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Printer size={13} /> Print
              </button>
            </div>
          </div>
        </div>

        {/* Institute Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center py-6 px-5 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 shadow-sm">
              <img
                src="/profile.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <GraduationCap size={28} className="text-indigo-500 hidden" />
            </div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">College Code: N/A</p>
            <div className="mt-2 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 text-center">
                Degree Admission | Session 2024–2025 (BA • BSS • BBS)
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
            {[
              { label: 'Total Departments', value: summaryData.length, Icon: FileText, color: 'text-indigo-500' },
              { label: 'Total Candidates', value: totalCandidate, Icon: Users, color: 'text-blue-500' },
              { label: 'Avg. per Candidate', value: `৳${formatMoney(avgAmount)}`, Icon: TrendingUp, color: 'text-green-500' },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="flex flex-col items-center py-4 px-3">
                <Icon size={16} className={`${color} mb-1`} />
                <p className="text-base font-bold text-gray-800 dark:text-white">{value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {['Department Name', 'Total Candidate', 'Total Amount (৳)', 'Action'].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${
                        h === 'Action' || h === 'Total Candidate' ? 'text-center' : 'text-left'
                      } ${h === 'Total Amount (৳)' ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {summaryData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={13} className="text-indigo-500" />
                        </div>
                        {row.department}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-sm font-bold text-blue-700 dark:text-blue-400">
                        {row.totalCandidate}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-green-700 dark:text-green-400">
                      ৳{formatMoney(row.totalAmount)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => navigate(`/admissionPaymentReport/paymentSummary/view/${row.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Eye size={12} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-green-200 dark:border-green-900/30">
                  <td className="px-5 py-4 text-sm font-bold text-gray-700 dark:text-gray-200">Total</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-bold text-blue-700 dark:text-blue-400">
                      {totalCandidate}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-bold text-green-700 dark:text-green-400">
                    ৳{formatMoney(totalAmount)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => navigate(`/admissionPaymentReport/paymentSummary/totalview/${id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Eye size={12} /> View All
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdmissionPaymentSummary;