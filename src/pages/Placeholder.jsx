// src/pages/Placeholder.jsx
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Construction } from 'lucide-react';

export default function Placeholder({ title = 'Page' }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <Construction size={40} />
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm">This page is under construction.</p>
      </div>
    </DashboardLayout>
  );
}