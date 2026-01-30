import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { BookOpen, FileText, Star, Clock, CheckSquare } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const stats = [
    { id: 1, icon: BookOpen, value: '5', label: 'Enrolled Courses' },
    { id: 2, icon: FileText, value: '2', label: 'Pending Assignments' },
    { id: 3, icon: Star, value: '3.8', label: 'Current GPA' },
    { id: 4, icon: Clock, value: '92%', label: 'Attendance Rate' },
  ];

  const actions = [
    { id: 'view-courses', label: 'View Courses', icon: BookOpen },
    { id: 'submit-assignment', label: 'Submit Assignment', icon: FileText },
    { id: 'check-grades', label: 'Check Grades', icon: Star },
    { id: 'view-schedule', label: 'View Schedule', icon: Clock },
  ];

  const recent = [
    {
      id: 1,
      text: 'Assignment posted: Research Essay',
      time: '5h ago',
      icon: FileText,
    },
    { id: 2, text: 'Grade updated: Math 101', time: '2d ago', icon: Star },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-sky-800">
              {greeting}, {user?.name || 'Student'}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
                STUDENT
              </span>
              <time className="text-sm text-gray-500">
                {now.toLocaleString()}
              </time>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-md bg-sky-50 text-sky-600">
                    <s.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {s.value}
                    </div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Quick Actions
          </h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {actions.map((a) => (
              <button
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-sky-50 border hover:border-sky-100 transition"
              >
                <div className="p-2 rounded-md bg-sky-100 text-sky-700">
                  <a.icon size={18} />
                </div>
                <span className="font-medium text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Recent Activity
          </h2>
          <div className="space-y-2">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 p-3 rounded-md bg-white border"
              >
                <div className="p-2 rounded-md bg-sky-50 text-sky-600">
                  <r.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{r.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{r.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
