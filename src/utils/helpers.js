// src/utils/helpers.js

import { toast } from 'react-toastify';

export const formatUserRole = (role) => {
  const roleMap = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    student: 'Student',
    teacher: 'Teacher',
  };
  return roleMap[role] || 'Unknown Role';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy to clipboard');
    console.error('Failed to copy: ', err);
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
