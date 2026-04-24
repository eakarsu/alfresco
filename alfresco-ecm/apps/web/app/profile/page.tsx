'use client';

import { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ProfileForm {
  displayName: string;
  email: string;
  phone: string;
  department: string;
  timezone: string;
  locale: string;
  avatar: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  documentUpdates: boolean;
  taskAssignments: boolean;
  workflowAlerts: boolean;
  systemAnnouncements: boolean;
  weeklyDigest: boolean;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  phone?: string;
  department?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#FF5252' };
  if (score === 2) return { score, label: 'Fair', color: '#FF9800' };
  if (score === 3) return { score, label: 'Good', color: '#FFC107' };
  return { score, label: 'Strong', color: '#4CAF50' };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>({
    displayName: 'John Doe',
    email: 'john.doe@alfresco.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    timezone: 'America/New_York',
    locale: 'en-US',
    avatar: '',
  });

  const [passwords, setPasswords] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    documentUpdates: true,
    taskAssignments: true,
    workflowAlerts: false,
    systemAnnouncements: true,
    weeklyDigest: false,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [errors, setErrors] = useState<FormErrors>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const validateProfile = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profile.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!profile.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors, displayName: newErrors.displayName, email: newErrors.email, department: newErrors.department }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswords = (): boolean => {
    const newErrors: FormErrors = {};

    if (showPasswordSection) {
      if (!passwords.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      if (!passwords.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (passwords.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const profileValid = validateProfile();
    const passwordsValid = validatePasswords();

    if (profileValid && passwordsValid) {
      addToast('Profile settings saved successfully!', 'success');
      if (showPasswordSection && passwords.newPassword) {
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        addToast('Password updated successfully!', 'success');
      }
    } else {
      addToast('Please fix the errors before saving.', 'error');
    }
  };

  const handleProfileChange = (field: keyof ProfileForm, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const strength = getPasswordStrength(passwords.newPassword);

  const passwordChecks = [
    { label: 'Minimum 8 characters', met: passwords.newPassword.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(passwords.newPassword) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(passwords.newPassword) },
    { label: 'At least one number', met: /[0-9]/.test(passwords.newPassword) },
    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(passwords.newPassword) },
  ];

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a2e' : '#ffffff';
  const cardBg = isDark ? '#16213e' : '#f9f9f9';
  const textColor = isDark ? '#e0e0e0' : '#333333';
  const borderColor = isDark ? '#2a2a4a' : '#dddddd';
  const inputBg = isDark ? '#0f3460' : '#ffffff';
  const inputText = isDark ? '#e0e0e0' : '#333333';

  const inputStyle = (fieldName?: keyof FormErrors): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${errors[fieldName!] ? '#FF5252' : borderColor}`,
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: inputBg,
    color: inputText,
    boxSizing: 'border-box',
    outline: 'none',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: textColor,
    fontSize: '0.9rem',
  };

  const errorStyle: React.CSSProperties = {
    color: '#FF5252',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  };

  const toastBgMap: Record<string, string> = {
    success: '#4CAF50',
    error: '#FF5252',
    warning: '#FF9800',
    info: '#2196F3',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto', backgroundColor: bgColor, minHeight: '100vh', color: textColor }}>
      {/* Toast Container */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: toastBgMap[toast.type],
              color: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '300px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0',
                lineHeight: '1',
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Profile & Settings
        </h1>
        <p style={{ fontSize: '1rem', color: isDark ? '#aaa' : '#666' }}>
          Manage your profile information, security settings, and preferences
        </p>
      </header>

      {/* User Info Section */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: textColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.75rem' }}>
          User Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Display Name *</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={e => handleProfileChange('displayName', e.target.value)}
              style={inputStyle('displayName')}
            />
            {errors.displayName && <div style={errorStyle}>{errors.displayName}</div>}
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => handleProfileChange('email', e.target.value)}
              style={inputStyle('email')}
            />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => handleProfileChange('phone', e.target.value)}
              style={inputStyle('phone')}
            />
            {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
          </div>
          <div>
            <label style={labelStyle}>Department *</label>
            <select
              value={profile.department}
              onChange={e => handleProfileChange('department', e.target.value)}
              style={inputStyle('department')}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Legal">Legal</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && <div style={errorStyle}>{errors.department}</div>}
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <select
              value={profile.timezone}
              onChange={e => handleProfileChange('timezone', e.target.value)}
              style={inputStyle()}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Europe/Berlin">CET (Berlin)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
              <option value="Australia/Sydney">AEST (Sydney)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Locale</label>
            <select
              value={profile.locale}
              onChange={e => handleProfileChange('locale', e.target.value)}
              style={inputStyle()}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">German</option>
              <option value="fr-FR">French</option>
              <option value="es-ES">Spanish</option>
              <option value="ja-JP">Japanese</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <label style={labelStyle}>Avatar URL</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0052CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              flexShrink: 0,
            }}>
              {profile.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <input
              type="text"
              value={profile.avatar}
              onChange={e => handleProfileChange('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              style={{ ...inputStyle(), flex: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, color: textColor }}>
            Change Password
          </h2>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showPasswordSection ? '#FF5252' : '#0052CC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {showPasswordSection ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordSection && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Current Password *</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                style={inputStyle('currentPassword')}
              />
              {errors.currentPassword && <div style={errorStyle}>{errors.currentPassword}</div>}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>New Password *</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={e => handlePasswordChange('newPassword', e.target.value)}
                style={inputStyle('newPassword')}
              />
              {errors.newPassword && <div style={errorStyle}>{errors.newPassword}</div>}

              {/* Password Strength Indicator */}
              {passwords.newPassword && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1, height: '8px', backgroundColor: isDark ? '#2a2a4a' : '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(strength.score / 5) * 100}%`,
                        height: '100%',
                        backgroundColor: strength.color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease, background-color 0.3s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: strength.color, minWidth: '50px' }}>
                      {strength.label}
                    </span>
                  </div>

                  {/* Password Checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                    {passwordChecks.map(check => (
                      <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: check.met ? '#4CAF50' : (isDark ? '#888' : '#999') }}>
                        <span style={{ fontSize: '0.9rem' }}>{check.met ? '\u2713' : '\u2717'}</span>
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Confirm New Password *</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                style={inputStyle('confirmPassword')}
              />
              {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
              {passwords.confirmPassword && passwords.newPassword && passwords.confirmPassword !== passwords.newPassword && !errors.confirmPassword && (
                <div style={errorStyle}>Passwords do not match</div>
              )}
              {passwords.confirmPassword && passwords.newPassword && passwords.confirmPassword === passwords.newPassword && (
                <div style={{ color: '#4CAF50', fontSize: '0.8rem', marginTop: '0.25rem' }}>Passwords match</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: textColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.75rem' }}>
          Notification Settings
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {([
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'documentUpdates', label: 'Document Updates', desc: 'Get notified when documents you follow are updated' },
            { key: 'taskAssignments', label: 'Task Assignments', desc: 'Get notified when tasks are assigned to you' },
            { key: 'workflowAlerts', label: 'Workflow Alerts', desc: 'Receive workflow status change notifications' },
            { key: 'systemAnnouncements', label: 'System Announcements', desc: 'Receive system-wide announcements' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary of activity' },
          ] as { key: keyof NotificationSettings; label: string; desc: string }[]).map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: isDark ? '#0f3460' : '#fff',
                borderRadius: '6px',
                border: `1px solid ${borderColor}`,
              }}
            >
              <div>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem', color: textColor }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: isDark ? '#999' : '#666' }}>{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: notifications[item.key] ? '#4CAF50' : (isDark ? '#555' : '#ccc'),
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: notifications[item.key] ? '25px' : '3px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: textColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.75rem' }}>
          Theme Settings
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setTheme('light')}
            style={{
              flex: 1,
              padding: '1.5rem',
              border: `2px solid ${theme === 'light' ? '#0052CC' : borderColor}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#9788;</div>
            <div style={{ fontWeight: '600', color: '#333' }}>Light</div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Default light theme</div>
          </button>
          <button
            onClick={() => setTheme('dark')}
            style={{
              flex: 1,
              padding: '1.5rem',
              border: `2px solid ${theme === 'dark' ? '#0052CC' : borderColor}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#1a1a2e',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#9790;</div>
            <div style={{ fontWeight: '600', color: '#e0e0e0' }}>Dark</div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.25rem' }}>Easy on the eyes</div>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
        <button
          onClick={() => {
            setProfile({
              displayName: 'John Doe',
              email: 'john.doe@alfresco.com',
              phone: '+1 (555) 123-4567',
              department: 'Engineering',
              timezone: 'America/New_York',
              locale: 'en-US',
              avatar: '',
            });
            setErrors({});
            addToast('Changes discarded', 'info');
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: isDark ? '#2a2a4a' : '#f5f5f5',
            color: textColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '0.75rem 2.5rem',
            backgroundColor: '#0052CC',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
