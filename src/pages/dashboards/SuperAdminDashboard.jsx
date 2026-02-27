// src/pages/dashboards/SuperAdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CardSkeleton from '../../components/common/CardSkeleton';
import {
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  Settings,
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Call API to get dashboard statistics
      // const response = await dashboardService.getSuperAdminStats();

      // For now, using dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData({
        stats: {
          totalUsers: 1234,
          totalStudents: 856,
          totalTeachers: 124,
          totalAdmins: 15,
          activeUsers: 1089,
          inactiveUsers: 145,
          monthlyRevenue: 485000,
          pendingTasks: 23,
        },
        recentActivities: [
          {
            id: 1,
            type: 'user_created',
            message: 'New student registered: John Doe (STU000234)',
            time: '5 minutes ago',
            icon: 'user',
          },
          {
            id: 2,
            type: 'payment',
            message: 'Fee payment received: ৳5,000 from STU000123',
            time: '15 minutes ago',
            icon: 'dollar',
          },
          {
            id: 3,
            type: 'teacher_added',
            message: 'New teacher added: Sarah Smith (TCH000045)',
            time: '1 hour ago',
            icon: 'teacher',
          },
          {
            id: 4,
            type: 'exam_scheduled',
            message: 'Mid-term exam scheduled for Class 10',
            time: '2 hours ago',
            icon: 'calendar',
          },
        ],
        upcomingEvents: [
          {
            id: 1,
            title: 'Parent-Teacher Meeting',
            date: '2024-02-15',
            time: '10:00 AM',
            type: 'meeting',
          },
          {
            id: 2,
            title: 'Annual Sports Day',
            date: '2024-02-20',
            time: '9:00 AM',
            type: 'event',
          },
          {
            id: 3,
            title: 'Final Exam Starts',
            date: '2024-03-01',
            time: '8:00 AM',
            type: 'exam',
          },
        ],
        systemHealth: {
          serverStatus: 'healthy',
          databaseStatus: 'healthy',
          apiStatus: 'healthy',
          backupStatus: 'completed',
          lastBackup: '2024-01-30 02:00 AM',
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics Cards Data
  const statsCards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: dashboardData?.stats.totalUsers || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true,
      description: 'from last month',
    },

    {
      id: 'total-students',
      title: 'Total Students',
      value: dashboardData?.stats.totalStudents || 0,
      icon: GraduationCap,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      trend: '+8%',
      trendUp: true,
      description: 'from last month',
    },
    {
      id: 'total-teachers',
      title: 'Total Teachers',
      value: dashboardData?.stats.totalTeachers || 0,
      icon: UserCheck,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      trend: '+5%',
      trendUp: true,
      description: 'from last month',
    },
    {
      id: 'monthly-revenue',
      title: 'Monthly Revenue',
      value: `৳${(dashboardData?.stats.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      trend: '+15%',
      trendUp: true,
      description: 'from last month',
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Register new student',
      icon: GraduationCap,
      color: 'bg-green-600',
      action: () => navigate('/super-admin/students/add'),
    },
    {
      id: 'add-teacher',
      title: 'Add Teacher',
      description: 'Add new teacher',
      icon: UserCheck,
      color: 'bg-purple-600',
      action: () => navigate('/super-admin/teachers/add'),
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'View all users',
      icon: Users,
      color: 'bg-blue-600',
      action: () => navigate('/super-admin/users/roles'),
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Generate reports',
      icon: Activity,
      color: 'bg-orange-600',
      action: () => navigate('/super-admin/reports/students'),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <CardSkeleton count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Welcome back, {user?.name}! Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              icon={Settings}
              onClick={() => navigate('/super-admin/settings')}
            >
              System Settings
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

            return (
              <Card
                key={stat.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendIcon
                        className={`h-4 w-4 ${
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.trend}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-8 w-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {dashboardData?.stats.activeUsers || 0}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Inactive Users
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-600">
                  {dashboardData?.stats.inactiveUsers || 0}
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-gray-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Tasks
                </p>
                <p className="mt-1 text-2xl font-bold text-orange-600">
                  {dashboardData?.stats.pendingTasks || 0}
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    <ActionIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card title="Recent Activities" padding="none">
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/super-admin/activities')}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                View All Activities
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card title="Upcoming Events" padding="none">
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        at {event.time}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/super-admin/events')}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                View All Events
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* System Health Status */}
        <Card title="System Health Status">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Server
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardData?.systemHealth.serverStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Database
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardData?.systemHealth.databaseStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  API
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardData?.systemHealth.apiStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Last Backup
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardData?.systemHealth.lastBackup}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
