import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Scale,
  ChevronRight,
  Printer,
  Download,
  SlidersHorizontal,
  Search,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

const balanceData = {
  assets: [
    { category: 'Current Assets', items: [
      { label: 'Cash in Hand', amount: 1250000 },
      { label: 'Cash at Bank', amount: 8430000 },
      { label: 'Accounts Receivable', amount: 320000 },
      { label: 'Prepaid Expenses', amount: 85000 },
    ]},
    { category: 'Fixed Assets', items: [
      { label: 'Land & Building', amount: 25000000 },
      { label: 'Furniture & Fixtures', amount: 1800000 },
      { label: 'Computer & Equipment', amount: 950000 },
      { label: 'Library Books', amount: 420000 },
    ]},
  ],
  liabilities: [
    { category: 'Current Liabilities', items: [
      { label: 'Accounts Payable', amount: 210000 },
      { label: 'Accrued Expenses', amount: 95000 },
      { label: 'Advance Fees Received', amount: 630000 },
    ]},
    { category: 'Long-term Liabilities', items: [
      { label: 'Bank Loan', amount: 5000000 },
      { label: 'Deferred Revenue', amount: 180000 },
    ]},
  ],
  equity: [
    { category: 'Capital & Reserves', items: [
      { label: 'Opening Balance', amount: 29640000 },
      { label: 'Surplus for the Year', amount: 2500000 },
    ]},
  ],
};

const YEARS = ['2025', '2024', '2023', '2022'];

const formatMoney = (n) =>
  Number(n).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30';

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

const CategorySection = ({ category, items, color }) => {
  const [open, setOpen] = useState(true);
  const subtotal = items.reduce((s, r) => s + r.amount, 0);
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 ${color} transition-colors`}
      >
        <span className="text-xs font-bold uppercase tracking-wider">{category}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">৳{formatMoney(subtotal)}</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">৳{formatMoney(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BalanceSheet = () => {
  const [year, setYear] = useState('2025');
  const [asOfDate, setAsOfDate] = useState('');
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});

  const totalAssets = useMemo(() =>
    balanceData.assets.flatMap((g) => g.items).reduce((s, r) => s + r.amount, 0), []);
  const totalLiabilities = useMemo(() =>
    balanceData.liabilities.flatMap((g) => g.items).reduce((s, r) => s + r.amount, 0), []);
  const totalEquity = useMemo(() =>
    balanceData.equity.flatMap((g) => g.items).reduce((s, r) => s + r.amount, 0), []);
  const totalLiabilitiesEquity = totalLiabilities + totalEquity;
  const isBalanced = totalAssets === totalLiabilitiesEquity;

  const handleShow = () => {
    setSearched(true);
  };

  const handlePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(14).text('Balance Sheet', 297, 40, { align: 'center' });
    doc.setFontSize(10).text(`Mohammadpur Kendriya College — Year: ${year}`, 297, 58, { align: 'center' });
    let y = 80;
    const addSection = (title, groups, color) => {
      doc.setFontSize(12).setTextColor(color).text(title, 40, y); y += 20;
      groups.forEach((g) => {
        doc.setFontSize(10).setTextColor('#374151').text(g.category, 50, y); y += 15;
        autoTable(doc, {
          startY: y,
          body: g.items.map((item) => [item.label, `৳${formatMoney(item.amount)}`]),
          theme: 'plain',
          styles: { fontSize: 9 },
          columnStyles: { 1: { halign: 'right' } },
          didDrawPage: (d) => { y = d.cursor.y + 5; },
        });
      });
    };
    addSection('ASSETS', balanceData.assets, '#0891B2');
    addSection('LIABILITIES', balanceData.liabilities, '#DC2626');
    addSection('EQUITY', balanceData.equity, '#059669');
    window.open(doc.output('bloburl'));
  };

  const handleExcel = () => {
    const rows = [];
    const addSection = (title, groups) => {
      rows.push({ Section: title, Item: '', Amount: '' });
      groups.forEach((g) => {
        rows.push({ Section: '', Item: g.category, Amount: '' });
        g.items.forEach((item) => rows.push({ Section: '', Item: item.label, Amount: item.amount }));
      });
    };
    addSection('ASSETS', balanceData.assets);
    addSection('LIABILITIES', balanceData.liabilities);
    addSection('EQUITY', balanceData.equity);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BalanceSheet');
    XLSX.writeFile(wb, `Balance_Sheet_${year}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Accounts', 'Financial Reports', 'Balance Sheet']} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Scale size={22} className="text-cyan-500" /> Balance Sheet
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 bg-cyan-50 dark:bg-cyan-900/10 border-b border-cyan-100 dark:border-cyan-900/30">
            <SlidersHorizontal size={15} className="text-cyan-500" />
            <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Report Settings</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Financial Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inp}>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">As of Date</label>
              <input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} className={inp} />
            </div>
            <div className="flex items-end">
              <button onClick={handleShow}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors shadow-sm shadow-cyan-200 dark:shadow-none">
                <Search size={14} /> Generate Report
              </button>
            </div>
          </div>
        </div>

        {searched && (
          <>
            {/* Balance check banner */}
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${isBalanced ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'}`}>
              <Scale size={16} className={isBalanced ? 'text-green-600' : 'text-red-500'} />
              <span className={`text-sm font-semibold ${isBalanced ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isBalanced ? '✓ Balance Sheet is balanced — Assets = Liabilities + Equity' : '⚠ Balance Sheet is not balanced'}
              </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Assets', value: `৳${formatMoney(totalAssets)}`, bg: 'bg-cyan-50 dark:bg-cyan-900/20', ic: 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300', Icon: TrendingUp },
                { label: 'Total Liabilities', value: `৳${formatMoney(totalLiabilities)}`, bg: 'bg-red-50 dark:bg-red-900/20', ic: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300', Icon: TrendingDown },
                { label: 'Total Equity', value: `৳${formatMoney(totalEquity)}`, bg: 'bg-green-50 dark:bg-green-900/20', ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300', Icon: DollarSign },
              ].map(({ label, value, bg, ic, Icon }) => (
                <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${bg}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}><Icon size={16} /></div>
                  <div>
                    <div className="text-base font-bold text-gray-800 dark:text-white leading-none">{value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Balance Sheet */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-5 bg-gradient-to-r from-cyan-50 to-white dark:from-cyan-900/10 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={26} className="text-cyan-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white">Mohammadpur Kendriya College</h2>
                  <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">Balance Sheet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Financial Year: {year}{asOfDate ? ` · As of ${new Date(asOfDate).toLocaleDateString('en-GB')}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 hover:bg-red-100 rounded-lg transition-colors">
                    <Printer size={13} /> PDF
                  </button>
                  <button onClick={handleExcel} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 hover:bg-green-100 rounded-lg transition-colors">
                    <Download size={13} /> Excel
                  </button>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700">
                {/* Assets */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-cyan-500" />
                    <h3 className="text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">Assets</h3>
                  </div>
                  {balanceData.assets.map((g) => (
                    <CategorySection key={g.category} category={g.category} items={g.items}
                      color="bg-cyan-50 dark:bg-cyan-900/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/20" />
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 bg-cyan-600 dark:bg-cyan-700 rounded-xl mt-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Total Assets</span>
                    <span className="text-sm font-bold text-white">৳{formatMoney(totalAssets)}</span>
                  </div>
                </div>

                {/* Liabilities + Equity */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown size={16} className="text-red-500" />
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Liabilities & Equity</h3>
                  </div>
                  {balanceData.liabilities.map((g) => (
                    <CategorySection key={g.category} category={g.category} items={g.items}
                      color="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20" />
                  ))}
                  <div className="my-2 border-t border-dashed border-gray-200 dark:border-gray-600" />
                  {balanceData.equity.map((g) => (
                    <CategorySection key={g.category} category={g.category} items={g.items}
                      color="bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20" />
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 bg-green-600 dark:bg-green-700 rounded-xl mt-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Total Liabilities + Equity</span>
                    <span className="text-sm font-bold text-white">৳{formatMoney(totalLiabilitiesEquity)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BalanceSheet;