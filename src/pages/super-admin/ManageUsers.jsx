// src/pages/super-admin/ManageUsers.jsx

import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const MOCK_USERS = [
  { id: 1, name: 'John Doe', role: 'student', email: 'john@student.com' },
  { id: 2, name: 'Jane Smith', role: 'teacher', email: 'jane@teacher.com' },
  { id: 3, name: 'Admin User', role: 'admin', email: 'admin@sys.com' },
];

const ManageUsers = () => {
  const [query, setQuery] = useState('');

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Manage Users
        </h2>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Input
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="primary">Search</Button>
            <Button variant="outline">Export</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {u.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" className="ml-2">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
