import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  BookOpen,
  Users,
  CheckSquare,
  Calendar,
  Clipboard,
} from 'lucide-react';

const TeacherDashboard = () => {
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
    { id: 1, icon: BookOpen, value: '4', label: 'My Classes' },
    { id: 2, icon: Users, value: '120', label: 'Total Students' },
    { id: 3, icon: CheckSquare, value: '8', label: 'Pending Grading' },
    { id: 4, icon: Calendar, value: '3', label: 'Upcoming Classes' },
  ];

  const actions = [
    { id: 'attendance', label: 'Take Attendance', icon: Clipboard },
    { id: 'grade', label: 'Grade Assignment', icon: CheckSquare },
    { id: 'add-assignment', label: 'Add Assignment', icon: BookOpen },
    { id: 'view-schedule', label: 'View Schedule', icon: Calendar },
  ];

  const recent = [
    {
      id: 1,
      text: 'Submission received: Biology Lab',
      time: '4h ago',
      icon: Clipboard,
    },
    {
      id: 2,
      text: 'Attendance recorded for Chemistry 201',
      time: '1d ago',
      icon: CheckSquare,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              {greeting}, {user?.name || 'Teacher'}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                TEACHER
              </span>
              <time className="text-sm text-gray-500 dark:text-gray-400">
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
                  <div className="p-3 rounded-md bg-amber-50 text-amber-600">
                    <s.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {s.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {s.label}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
            Quick Actions
          </h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {actions.map((a) => (
              <button
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-700 border dark:border-gray-700 hover:border-amber-100 transition"
              >
                <div className="p-2 rounded-md bg-amber-100 text-amber-700">
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
                className="flex items-start gap-3 p-3 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700"
              >
                <div className="p-2 rounded-md bg-amber-50 text-amber-600">
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

export default TeacherDashboard;
