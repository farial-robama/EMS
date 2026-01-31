// src/pages/super-admin/Reports.jsx

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Reports
        </h2>

        <Card>
          <p className="text-sm text-gray-600 mb-4">
            Generate and download reports for students, financials, attendance,
            and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="primary">Student Report</Button>
            <Button variant="outline">Financial Report</Button>
            <Button variant="outline">Attendance Report</Button>
            <Button variant="outline">Export All</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
