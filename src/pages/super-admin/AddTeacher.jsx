// src/pages/super-admin/AddTeacher.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AddTeacher = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', subject: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('New teacher added', form);
    setLoading(false);
    navigate('/super-admin/teachers');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add New Teacher
        </h2>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />

            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Teacher'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddTeacher;
