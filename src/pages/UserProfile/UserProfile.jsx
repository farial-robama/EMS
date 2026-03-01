// src/pages/UserProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Lock,
  X,
  Save,
  Eye,
  EyeOff,
  Camera,
  Shield,
  IdCard,
  UserCircle,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Check,
  Clock,
  KeyRound,
  ImageIcon,
  Activity,
  LogIn,
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';

// ── Helpers ──────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const inp =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30';
const inpErr =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-red-400 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none';

// ── Sub-components ────────────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
    {items.map((item, i) => (
      <React.Fragment key={`${item}-${i}`}>
        <span
          className={
            i === items.length - 1
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'hover:text-blue-500 cursor-pointer transition-colors'
          }
        >
          {item}
        </span>
        {i < items.length - 1 && (
          <ChevronRight
            size={12}
            className="text-gray-300 dark:text-gray-600"
          />
        )}
      </React.Fragment>
    ))}
  </nav>
);

function F({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const RoleBadge = ({ role }) => {
  const map = {
    SUPER_ADMIN:
      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40',
    ADMIN:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40',
    TEACHER:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40',
    STUDENT:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40',
  };
  const cls =
    map[role?.toUpperCase().replace(/\s+/g, '_')] ||
    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      <Shield size={11} />
      {role?.replace(/_/g, ' ').toUpperCase() || 'USER'}
    </span>
  );
};

// Modal wrapper — same pattern as UserRoleGroupManagement
function Modal({
  title,
  headerClass,
  iconEl,
  onClose,
  footerBtn,
  children,
  maxW = 'max-w-xl',
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative w-full ${maxW} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${headerClass}`}
        >
          <div className="flex items-center gap-2.5">
            {iconEl}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 transition-all"
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          {footerBtn}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const UserProfile = () => {
  const { user, token, updateUserProfile, updateProfileImage } = useAuth();

  const [modal, setModal] = useState(null); // 'edit' | 'password' | 'avatar'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // Edit form
  const [editForm, setEditForm] = useState({});
  // Password form
  const [pwForm, setPwForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      });
      setAvatarPreview(user.profileImage || null);
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setErrors({});
  };

  // ── Validate ────────────────────────────────────────────────────────────────
  const validateEdit = () => {
    const e = {};
    if (!editForm.firstName?.trim()) e.firstName = 'First name is required.';
    if (!editForm.lastName?.trim()) e.lastName = 'Last name is required.';
    if (!editForm.email?.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(editForm.email))
      e.email = 'Invalid email format.';
    if (editForm.phone && !/^[\d+\s()-]+$/.test(editForm.phone))
      e.phone = 'Invalid phone number.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.oldPassword) e.oldPassword = 'Current password is required.';
    if (!pwForm.newPassword) e.newPassword = 'New password is required.';
    else if (pwForm.newPassword.length < 6)
      e.newPassword = 'Minimum 6 characters.';
    if (pwForm.newPassword !== pwForm.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.info('Image must be under 5 MB.');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) {
      toast.info('Please select an image first.');
      return;
    }
    setLoading(true);
    try {
      // Optimistic update with base64 — replace with Cloudinary in production
      updateProfileImage(avatarPreview);
      updateUserProfile({ profileImage: avatarPreview });
      toast.success('Profile photo updated!');
      setAvatarFile(null);
      closeModal();
    } catch (err) {
      toast.error('Failed to update photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;
    setLoading(true);
    try {
      /* Uncomment when API ready:
      const res = await fetch(`${API_BASE_URL}/user/${user._id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update');
      */
      updateUserProfile(editForm);
      toast.success('Profile updated successfully!');
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePw()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || 'Failed');
      toast.success('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Display helpers ─────────────────────────────────────────────────────────
  const getDisplayName = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || 'User';
  const getInitials = () => {
    const p = getDisplayName().split(' ');
    return p.length >= 2
      ? `${p[0][0]}${p[1][0]}`.toUpperCase()
      : p[0][0].toUpperCase();
  };
  const getJoined = () =>
    user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'N/A';

  const infoCards = [
    {
      label: 'First Name',
      value: user?.firstName,
      Icon: User,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Last Name',
      value: user?.lastName,
      Icon: User,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Email',
      value: user?.email,
      Icon: Mail,
      color:
        'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Phone',
      value: user?.phone,
      Icon: Phone,
      color:
        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'User ID',
      value: user?.userId,
      Icon: IdCard,
      color:
        'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Role',
      value: user?.role?.replace(/_/g, ' ').toUpperCase(),
      Icon: Shield,
      color:
        'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Location',
      value: user?.location,
      Icon: MapPin,
      color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Joined',
      value: getJoined(),
      Icon: Calendar,
      color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Bio',
      value: user?.bio,
      Icon: UserCircle,
      color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400',
      full: true,
    },
  ];

  const stats = [
    {
      label: 'Account Status',
      value: user?.verified ? 'Verified' : 'Unverified',
      bg: 'bg-green-50 dark:bg-green-900/20',
      ic: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
      Icon: CheckCircle,
    },
    {
      label: 'Role',
      value: user?.role?.replace(/_/g, ' ').toUpperCase() || 'N/A',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      ic: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
      Icon: Shield,
    },
    {
      label: 'Member Since',
      value: user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      ic: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300',
      Icon: Clock,
    },
  ];

  // ── PW strength ─────────────────────────────────────────────────────────────
  const pwStrength = (() => {
    const p = pwForm.newPassword;
    if (!p) return { level: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (s <= 3) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    if (s <= 4) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  })();

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb + Title */}
        <div className="space-y-1">
          <Breadcrumb items={['Dashboard', 'Account', 'My Profile']} />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <UserCircle size={22} className="text-indigo-500" /> My Profile
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setModal('edit')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200"
              >
                <Edit size={14} /> Edit Profile
              </button>
              <button
                onClick={() => setModal('password')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <KeyRound size={14} /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, bg, ic, Icon }) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 ${bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ic}`}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="text-base font-bold text-gray-800 dark:text-white leading-none">
                  {value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile hero card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Cover banner */}
          <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar + Info row */}
            <div className="-mt-12 mb-4">
              {/* Avatar alone overlaps the banner */}
              <div className="relative w-24 h-24 mb-3">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                  {avatarPreview || user?.profileImage ? (
                    <img
                      src={avatarPreview || user?.profileImage}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials()}</span>
                  )}
                </div>
                {/* Online dot */}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
                {/* Camera btn */}
                <button
                  onClick={() => setModal('avatar')}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-colors"
                  title="Change photo"
                >
                  <Camera size={13} />
                </button>
              </div>

              {/* Name + badges + bio — all below the banner */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {getDisplayName()}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <RoleBadge role={user?.role} />
                  {user?.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/40">
                      <CheckCircle size={10} /> Verified
                    </span>
                  )}
                  {user?.userId && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                      <IdCard size={10} /> {user.userId}
                    </span>
                  )}
                </div>
                {user?.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-md">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700 mb-5" />

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {infoCards
                .filter((c) => !c.full)
                .map(({ label, value, Icon, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {value || '—'}
                      </p>
                    </div>
                  </div>
                ))}
              {/* Bio — full width */}
              {infoCards
                .filter((c) => c.full)
                .map(({ label, value, Icon, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 sm:col-span-2 lg:col-span-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}
                    >
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                        {value || '—'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Change Avatar
      ══════════════════════════════════════════════════════════════════════ */}
      {modal === 'avatar' && (
        <Modal
          title="Change Profile Photo"
          maxW="max-w-sm"
          headerClass="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30"
          iconEl={
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ImageIcon size={14} />
            </div>
          }
          onClose={closeModal}
          footerBtn={
            <button
              onClick={handleSaveAvatar}
              disabled={loading || !avatarFile}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                ${loading || !avatarFile ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check size={13} />
                  Save Photo
                </>
              )}
            </button>
          }
        >
          <div className="flex flex-col items-center gap-4">
            {/* Preview */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              {avatarFile && (
                <button
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(user?.profileImage || null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Upload zone */}
            <label
              htmlFor="avatar-upload"
              className="w-full flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                <Camera size={18} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Click to upload photo
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, WEBP — Max 5 MB
                </p>
              </div>
              <input
                id="avatar-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {avatarFile && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle size={12} /> {avatarFile.name}
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Edit Profile
      ══════════════════════════════════════════════════════════════════════ */}
      {modal === 'edit' && (
        <Modal
          title="Edit Profile"
          headerClass="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
          iconEl={
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Edit size={14} />
            </div>
          }
          onClose={closeModal}
          footerBtn={
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Changes
                </>
              )}
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <F label="First Name" required error={errors.firstName}>
              <input
                type="text"
                value={editForm.firstName || ''}
                onChange={(e) => {
                  setEditForm((p) => ({ ...p, firstName: e.target.value }));
                  setErrors((p) => ({ ...p, firstName: '' }));
                }}
                placeholder="First name"
                className={errors.firstName ? inpErr : inp}
              />
            </F>
            <F label="Last Name" required error={errors.lastName}>
              <input
                type="text"
                value={editForm.lastName || ''}
                onChange={(e) => {
                  setEditForm((p) => ({ ...p, lastName: e.target.value }));
                  setErrors((p) => ({ ...p, lastName: '' }));
                }}
                placeholder="Last name"
                className={errors.lastName ? inpErr : inp}
              />
            </F>
            <F label="Email" required error={errors.email}>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => {
                  setEditForm((p) => ({ ...p, email: e.target.value }));
                  setErrors((p) => ({ ...p, email: '' }));
                }}
                placeholder="email@example.com"
                className={errors.email ? inpErr : inp}
              />
            </F>
            <F label="Phone" error={errors.phone}>
              <input
                type="text"
                value={editForm.phone || ''}
                onChange={(e) => {
                  setEditForm((p) => ({ ...p, phone: e.target.value }));
                  setErrors((p) => ({ ...p, phone: '' }));
                }}
                placeholder="01XXXXXXXXX"
                className={errors.phone ? inpErr : inp}
              />
            </F>
            <F label="Location">
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="Dhaka, Bangladesh"
                className={inp}
              />
            </F>
          </div>
          <F label="Bio">
            <textarea
              rows={3}
              value={editForm.bio || ''}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, bio: e.target.value }))
              }
              placeholder="Write something about yourself…"
              className={`${inp} resize-none`}
            />
          </F>

          {/* Read-only info */}
          <div className="mt-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Read-only Fields
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'User ID', value: user?.userId },
                {
                  label: 'Role',
                  value: user?.role?.replace(/_/g, ' ').toUpperCase(),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Change Password
      ══════════════════════════════════════════════════════════════════════ */}
      {modal === 'password' && (
        <Modal
          title="Change Password"
          maxW="max-w-md"
          headerClass="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
          iconEl={
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound size={14} />
            </div>
          }
          onClose={closeModal}
          footerBtn={
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm
                ${loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <Lock size={13} />
                  Update Password
                </>
              )}
            </button>
          }
        >
          {/* Current password */}
          <F label="Current Password" required error={errors.oldPassword}>
            <div className="relative">
              <input
                type={showPw.old ? 'text' : 'password'}
                value={pwForm.oldPassword}
                onChange={(e) => {
                  setPwForm((p) => ({ ...p, oldPassword: e.target.value }));
                  setErrors((p) => ({ ...p, oldPassword: '' }));
                }}
                placeholder="Enter current password"
                className={`${errors.oldPassword ? inpErr : inp} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => ({ ...p, old: !p.old }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPw.old ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </F>

          {/* New password */}
          <F label="New Password" required error={errors.newPassword}>
            <div className="relative">
              <input
                type={showPw.new ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={(e) => {
                  setPwForm((p) => ({ ...p, newPassword: e.target.value }));
                  setErrors((p) => ({ ...p, newPassword: '' }));
                }}
                placeholder="Enter new password"
                className={`${errors.newPassword ? inpErr : inp} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPw.new ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength bar */}
            {pwForm.newPassword && (
              <div className="mt-1.5 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength.level ? pwStrength.color : 'bg-gray-200 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${
                    pwStrength.level === 1
                      ? 'text-red-500'
                      : pwStrength.level === 2
                        ? 'text-amber-500'
                        : pwStrength.level === 3
                          ? 'text-blue-500'
                          : 'text-green-500'
                  }`}
                >
                  {pwStrength.label} password
                </p>
              </div>
            )}
          </F>

          {/* Confirm password */}
          <F
            label="Confirm New Password"
            required
            error={errors.confirmPassword}
          >
            <div className="relative">
              <input
                type={showPw.confirm ? 'text' : 'password'}
                value={pwForm.confirmPassword}
                onChange={(e) => {
                  setPwForm((p) => ({ ...p, confirmPassword: e.target.value }));
                  setErrors((p) => ({ ...p, confirmPassword: '' }));
                }}
                placeholder="Re-enter new password"
                className={`${errors.confirmPassword ? inpErr : inp} pr-10`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPw.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {pwForm.confirmPassword &&
              pwForm.newPassword === pwForm.confirmPassword && (
                <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
                  <CheckCircle size={11} /> Passwords match
                </p>
              )}
          </F>

          {/* Tips box */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
              Password Requirements
            </p>
            {[
              'At least 6 characters',
              'Mix of uppercase & lowercase',
              'Include numbers or symbols for strength',
            ].map((tip) => (
              <p
                key={tip}
                className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mt-0.5"
              >
                <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {tip}
              </p>
            ))}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default UserProfile;
