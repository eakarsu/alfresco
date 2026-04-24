'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
  emailVerified: boolean;
  emailVerifiedDate: string | null;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmDialog {
  title: string;
  message: string;
  onConfirm: () => void;
}

// ──────────────────────────────────────────────
// Hardcoded Data (15+ users)
// ──────────────────────────────────────────────
const USERS_DATA: User[] = [
  { id: 1, username: 'admin', email: 'admin@alfresco.com', firstName: 'System', lastName: 'Administrator', role: 'Administrator', department: 'IT', status: 'Active', lastLogin: '2026-02-13 09:15', emailVerified: true, emailVerifiedDate: '2024-01-10', createdAt: '2024-01-01' },
  { id: 2, username: 'john.doe', email: 'john.doe@alfresco.com', firstName: 'John', lastName: 'Doe', role: 'Editor', department: 'Engineering', status: 'Active', lastLogin: '2026-02-12 14:30', emailVerified: true, emailVerifiedDate: '2024-02-15', createdAt: '2024-02-10' },
  { id: 3, username: 'jane.smith', email: 'jane.smith@alfresco.com', firstName: 'Jane', lastName: 'Smith', role: 'Viewer', department: 'Marketing', status: 'Active', lastLogin: '2026-02-11 10:00', emailVerified: true, emailVerifiedDate: '2024-03-05', createdAt: '2024-03-01' },
  { id: 4, username: 'bob.wilson', email: 'bob.wilson@alfresco.com', firstName: 'Bob', lastName: 'Wilson', role: 'Editor', department: 'Sales', status: 'Inactive', lastLogin: '2026-01-20 16:45', emailVerified: false, emailVerifiedDate: null, createdAt: '2024-03-15' },
  { id: 5, username: 'alice.jones', email: 'alice.jones@alfresco.com', firstName: 'Alice', lastName: 'Jones', role: 'Administrator', department: 'IT', status: 'Active', lastLogin: '2026-02-13 08:00', emailVerified: true, emailVerifiedDate: '2024-04-01', createdAt: '2024-03-25' },
  { id: 6, username: 'charlie.brown', email: 'charlie.brown@alfresco.com', firstName: 'Charlie', lastName: 'Brown', role: 'Viewer', department: 'HR', status: 'Active', lastLogin: '2026-02-10 11:20', emailVerified: false, emailVerifiedDate: null, createdAt: '2024-04-10' },
  { id: 7, username: 'diana.prince', email: 'diana.prince@alfresco.com', firstName: 'Diana', lastName: 'Prince', role: 'Editor', department: 'Legal', status: 'Active', lastLogin: '2026-02-09 09:30', emailVerified: true, emailVerifiedDate: '2024-05-20', createdAt: '2024-05-15' },
  { id: 8, username: 'edward.clark', email: 'edward.clark@alfresco.com', firstName: 'Edward', lastName: 'Clark', role: 'Viewer', department: 'Finance', status: 'Suspended', lastLogin: '2026-01-05 13:00', emailVerified: true, emailVerifiedDate: '2024-06-10', createdAt: '2024-06-01' },
  { id: 9, username: 'fiona.green', email: 'fiona.green@alfresco.com', firstName: 'Fiona', lastName: 'Green', role: 'Editor', department: 'Engineering', status: 'Active', lastLogin: '2026-02-12 17:45', emailVerified: true, emailVerifiedDate: '2024-06-25', createdAt: '2024-06-20' },
  { id: 10, username: 'george.harris', email: 'george.harris@alfresco.com', firstName: 'George', lastName: 'Harris', role: 'Viewer', department: 'Operations', status: 'Active', lastLogin: '2026-02-08 15:10', emailVerified: false, emailVerifiedDate: null, createdAt: '2024-07-05' },
  { id: 11, username: 'hannah.lee', email: 'hannah.lee@alfresco.com', firstName: 'Hannah', lastName: 'Lee', role: 'Administrator', department: 'IT', status: 'Active', lastLogin: '2026-02-13 07:55', emailVerified: true, emailVerifiedDate: '2024-07-20', createdAt: '2024-07-15' },
  { id: 12, username: 'ivan.petrov', email: 'ivan.petrov@alfresco.com', firstName: 'Ivan', lastName: 'Petrov', role: 'Editor', department: 'Engineering', status: 'Inactive', lastLogin: '2025-12-15 10:30', emailVerified: true, emailVerifiedDate: '2024-08-10', createdAt: '2024-08-01' },
  { id: 13, username: 'julia.martinez', email: 'julia.martinez@alfresco.com', firstName: 'Julia', lastName: 'Martinez', role: 'Viewer', department: 'Marketing', status: 'Active', lastLogin: '2026-02-11 12:00', emailVerified: false, emailVerifiedDate: null, createdAt: '2024-08-20' },
  { id: 14, username: 'kevin.wright', email: 'kevin.wright@alfresco.com', firstName: 'Kevin', lastName: 'Wright', role: 'Editor', department: 'Sales', status: 'Active', lastLogin: '2026-02-07 09:15', emailVerified: true, emailVerifiedDate: '2024-09-05', createdAt: '2024-09-01' },
  { id: 15, username: 'laura.chen', email: 'laura.chen@alfresco.com', firstName: 'Laura', lastName: 'Chen', role: 'Viewer', department: 'Finance', status: 'Active', lastLogin: '2026-02-06 14:20', emailVerified: true, emailVerifiedDate: '2024-09-25', createdAt: '2024-09-20' },
  { id: 16, username: 'mike.taylor', email: 'mike.taylor@alfresco.com', firstName: 'Mike', lastName: 'Taylor', role: 'Editor', department: 'HR', status: 'Suspended', lastLogin: '2025-11-30 16:00', emailVerified: false, emailVerifiedDate: null, createdAt: '2024-10-10' },
  { id: 17, username: 'nancy.adams', email: 'nancy.adams@alfresco.com', firstName: 'Nancy', lastName: 'Adams', role: 'Viewer', department: 'Legal', status: 'Active', lastLogin: '2026-02-05 11:45', emailVerified: true, emailVerifiedDate: '2024-10-30', createdAt: '2024-10-25' },
  { id: 18, username: 'oscar.rivera', email: 'oscar.rivera@alfresco.com', firstName: 'Oscar', lastName: 'Rivera', role: 'Editor', department: 'Operations', status: 'Active', lastLogin: '2026-02-04 08:30', emailVerified: true, emailVerifiedDate: '2024-11-15', createdAt: '2024-11-10' },
];

const TABS = ['users', 'registration', 'password-reset', 'change-password', 'email-verify', 'export', 'bulk-ops', 'system', 'security'] as const;
type TabType = typeof TABS[number];

const TAB_LABELS: Record<TabType, string> = {
  'users': 'Users',
  'registration': 'Registration',
  'password-reset': 'Password Reset',
  'change-password': 'Change Password',
  'email-verify': 'Email Verify',
  'export': 'Export',
  'bulk-ops': 'Bulk Ops',
  'system': 'System',
  'security': 'Security',
};

const ROLES = ['Administrator', 'Editor', 'Viewer', 'Contributor'];
const DEPARTMENTS = ['IT', 'Engineering', 'Marketing', 'Sales', 'HR', 'Legal', 'Finance', 'Operations'];

// ──────────────────────────────────────────────
// Password Strength Utility
// ──────────────────────────────────────────────
function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: { level: number; label: string; color: string }[] = [
    { level: 0, label: 'Very Weak', color: '#d32f2f' },
    { level: 1, label: 'Weak', color: '#f57c00' },
    { level: 2, label: 'Fair', color: '#fbc02d' },
    { level: 3, label: 'Good', color: '#7cb342' },
    { level: 4, label: 'Strong', color: '#388e3c' },
    { level: 5, label: 'Very Strong', color: '#1b5e20' },
  ];
  return map[score];
}

function getPasswordChecks(pw: string) {
  return [
    { label: 'At least 8 characters', pass: pw.length >= 8 },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(pw) },
    { label: 'Contains lowercase letter', pass: /[a-z]/.test(pw) },
    { label: 'Contains a number', pass: /[0-9]/.test(pw) },
    { label: 'Contains special character', pass: /[^A-Za-z0-9]/.test(pw) },
  ];
}

// ──────────────────────────────────────────────
// Inner component that uses useSearchParams
// ──────────────────────────────────────────────
function AdminPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as TabType | null;
  const activeTab: TabType = tabParam && TABS.includes(tabParam) ? tabParam : 'users';

  const setActiveTab = useCallback((tab: TabType) => {
    router.push(`/admin?tab=${tab}`);
  }, [router]);

  // ── Global state ──
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Toast system ──
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // ── Users tab state ──
  const [userSearch, setUserSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const showingFrom = filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, filteredUsers.length);

  const allPageSelected = pagedUsers.length > 0 && pagedUsers.every(u => selectedUserIds.has(u.id));
  const someSelected = selectedUserIds.size > 0;

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedUserIds(prev => {
        const next = new Set(prev);
        pagedUsers.forEach(u => next.delete(u.id));
        return next;
      });
    } else {
      setSelectedUserIds(prev => {
        const next = new Set(prev);
        pagedUsers.forEach(u => next.add(u.id));
        return next;
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDeleteSelected = () => {
    setConfirmDialog({
      title: 'Delete Selected Users',
      message: `Are you sure you want to delete ${selectedUserIds.size} selected user(s)? This action cannot be undone.`,
      onConfirm: () => {
        setUsers(prev => prev.filter(u => !selectedUserIds.has(u.id)));
        addToast(`${selectedUserIds.size} user(s) deleted successfully.`);
        setSelectedUserIds(new Set());
        setConfirmDialog(null);
      },
    });
  };

  const handleExportSelectedCSV = () => {
    const selected = users.filter(u => selectedUserIds.has(u.id));
    const header = 'Username,Email,Full Name,Role,Status,Last Login\n';
    const rows = selected.map(u => `${u.username},${u.email},${u.firstName} ${u.lastName},${u.role},${u.status},${u.lastLogin}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'selected_users.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('CSV exported for selected users.');
  };

  const handleDeleteUser = (user: User) => {
    setConfirmDialog({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setDetailUser(null);
        addToast(`User "${user.username}" deleted.`);
        setConfirmDialog(null);
      },
    });
  };

  const handleSaveEdit = () => {
    if (!detailUser) return;
    setUsers(prev => prev.map(u => u.id === detailUser.id ? { ...u, ...editForm } : u));
    setDetailUser(prev => prev ? { ...prev, ...editForm } : null);
    setIsEditingDetail(false);
    addToast(`User "${detailUser.username}" updated.`);
  };

  // ── Registration tab state ──
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: '', department: '' });
  const [regTouched, setRegTouched] = useState<Record<string, boolean>>({});

  const regValidation = useMemo(() => {
    const errors: Record<string, string> = {};
    if (regTouched.username) {
      if (!regForm.username) errors.username = 'Username is required';
      else if (regForm.username.length < 3) errors.username = 'Min 3 characters';
      else if (!/^[a-zA-Z0-9_.]+$/.test(regForm.username)) errors.username = 'Only alphanumeric, underscore, dot';
    }
    if (regTouched.email) {
      if (!regForm.email) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) errors.email = 'Invalid email format';
    }
    if (regTouched.password) {
      if (!regForm.password) errors.password = 'Password is required';
      else if (regForm.password.length < 8) errors.password = 'Min 8 characters';
      else if (!/[A-Z]/.test(regForm.password)) errors.password = 'Needs uppercase letter';
      else if (!/[a-z]/.test(regForm.password)) errors.password = 'Needs lowercase letter';
      else if (!/[0-9]/.test(regForm.password)) errors.password = 'Needs a number';
      else if (!/[^A-Za-z0-9]/.test(regForm.password)) errors.password = 'Needs special character';
    }
    if (regTouched.confirmPassword) {
      if (regForm.confirmPassword !== regForm.password) errors.confirmPassword = 'Passwords do not match';
    }
    if (regTouched.firstName && !regForm.firstName) errors.firstName = 'First name is required';
    if (regTouched.lastName && !regForm.lastName) errors.lastName = 'Last name is required';
    if (regTouched.role && !regForm.role) errors.role = 'Role is required';
    if (regTouched.department && !regForm.department) errors.department = 'Department is required';
    return errors;
  }, [regForm, regTouched]);

  const regAllTouched = ['username', 'email', 'password', 'confirmPassword', 'firstName', 'lastName', 'role', 'department'].every(k => regTouched[k]);
  const regValid = regAllTouched && Object.keys(regValidation).length === 0
    && regForm.username.length >= 3 && /^[a-zA-Z0-9_.]+$/.test(regForm.username)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)
    && regForm.password.length >= 8 && /[A-Z]/.test(regForm.password) && /[a-z]/.test(regForm.password) && /[0-9]/.test(regForm.password) && /[^A-Za-z0-9]/.test(regForm.password)
    && regForm.confirmPassword === regForm.password
    && regForm.firstName && regForm.lastName && regForm.role && regForm.department;

  const handleRegSubmit = () => {
    const newUser: User = {
      id: Date.now(),
      username: regForm.username,
      email: regForm.email,
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      role: regForm.role,
      department: regForm.department,
      status: 'Active',
      lastLogin: 'Never',
      emailVerified: false,
      emailVerifiedDate: null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    addToast(`User "${regForm.username}" registered successfully!`);
    setRegForm({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: '', department: '' });
    setRegTouched({});
  };

  // ── Password Reset tab state ──
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailTouched, setResetEmailTouched] = useState(false);
  const resetEmailError = resetEmailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail) ? 'Invalid email format' : '';

  // ── Change Password tab state ──
  const [cpUser, setCpUser] = useState('');
  const [cpCurrent, setCpCurrent] = useState('');
  const [cpNew, setCpNew] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [cpTouched, setCpTouched] = useState<Record<string, boolean>>({});
  const cpErrors: Record<string, string> = {};
  if (cpTouched.user && !cpUser) cpErrors.user = 'Select a user';
  if (cpTouched.current && !cpCurrent) cpErrors.current = 'Current password is required';
  if (cpTouched.newPw) {
    if (!cpNew) cpErrors.newPw = 'New password is required';
    else if (cpNew.length < 8) cpErrors.newPw = 'Min 8 characters';
    else if (!/[A-Z]/.test(cpNew)) cpErrors.newPw = 'Needs uppercase';
    else if (!/[a-z]/.test(cpNew)) cpErrors.newPw = 'Needs lowercase';
    else if (!/[0-9]/.test(cpNew)) cpErrors.newPw = 'Needs number';
    else if (!/[^A-Za-z0-9]/.test(cpNew)) cpErrors.newPw = 'Needs special char';
  }
  if (cpTouched.confirm && cpConfirm !== cpNew) cpErrors.confirm = 'Passwords do not match';
  const cpAllValid = cpUser && cpCurrent && cpNew.length >= 8 && /[A-Z]/.test(cpNew) && /[a-z]/.test(cpNew) && /[0-9]/.test(cpNew) && /[^A-Za-z0-9]/.test(cpNew) && cpConfirm === cpNew;

  // ── Export tab state ──
  const [exportType, setExportType] = useState('Users');
  const [exportDateFrom, setExportDateFrom] = useState('2024-01-01');
  const [exportDateTo, setExportDateTo] = useState('2026-02-13');

  const exportPreview = useMemo(() => {
    if (exportType === 'Users') return users.slice(0, 5).map(u => ({ Name: u.firstName + ' ' + u.lastName, Email: u.email, Role: u.role, Status: u.status }));
    if (exportType === 'Documents') return [
      { Name: 'Q4 Report.pdf', Type: 'PDF', Size: '2.4MB', Modified: '2026-02-10' },
      { Name: 'Budget 2026.xlsx', Type: 'Spreadsheet', Size: '890KB', Modified: '2026-02-08' },
      { Name: 'Onboarding Guide.docx', Type: 'Document', Size: '1.1MB', Modified: '2026-01-30' },
      { Name: 'Logo.png', Type: 'Image', Size: '340KB', Modified: '2025-12-15' },
      { Name: 'Contract Template.pdf', Type: 'PDF', Size: '520KB', Modified: '2025-11-20' },
    ];
    if (exportType === 'Workflows') return [
      { Name: 'Invoice Approval', Status: 'Active', Instances: 42, Created: '2025-06-10' },
      { Name: 'Document Review', Status: 'Active', Instances: 18, Created: '2025-07-01' },
      { Name: 'Contract Sign-off', Status: 'Paused', Instances: 5, Created: '2025-08-15' },
      { Name: 'Employee Onboarding', Status: 'Active', Instances: 12, Created: '2025-09-20' },
      { Name: 'Expense Claim', Status: 'Active', Instances: 67, Created: '2025-10-05' },
    ];
    return [
      { Action: 'User Login', User: 'admin', Timestamp: '2026-02-13 09:15', IP: '192.168.1.10' },
      { Action: 'Document Upload', User: 'john.doe', Timestamp: '2026-02-12 14:30', IP: '192.168.1.22' },
      { Action: 'Permission Change', User: 'admin', Timestamp: '2026-02-12 11:00', IP: '192.168.1.10' },
      { Action: 'User Created', User: 'admin', Timestamp: '2026-02-11 16:00', IP: '192.168.1.10' },
      { Action: 'Document Delete', User: 'jane.smith', Timestamp: '2026-02-11 09:45', IP: '192.168.1.34' },
    ];
  }, [exportType, users]);

  const handleExportCSV = () => {
    const rows = exportPreview as Record<string, unknown>[];
    if (rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = keys.join(',') + '\n' + rows.map(r => keys.map(k => String(r[k])).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${exportType.toLowerCase()}_export.csv`; a.click();
    URL.revokeObjectURL(url);
    addToast(`${exportType} CSV downloaded.`);
  };

  const handleExportPDF = () => {
    addToast(`${exportType} PDF export initiated. (PDF generation requires server-side processing.)`, 'info');
  };

  // ── Bulk Ops tab state ──
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<number>>(new Set());
  const [bulkField, setBulkField] = useState('role');
  const [bulkValue, setBulkValue] = useState('');

  const bulkAllSelected = users.length > 0 && users.every(u => bulkSelectedIds.has(u.id));
  const toggleBulkSelect = (id: number) => {
    setBulkSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleBulkAll = () => {
    if (bulkAllSelected) setBulkSelectedIds(new Set());
    else setBulkSelectedIds(new Set(users.map(u => u.id)));
  };

  const handleBulkDelete = () => {
    if (bulkSelectedIds.size === 0) { addToast('No users selected.', 'error'); return; }
    setConfirmDialog({
      title: 'Bulk Delete',
      message: `Delete ${bulkSelectedIds.size} user(s)?`,
      onConfirm: () => {
        setUsers(prev => prev.filter(u => !bulkSelectedIds.has(u.id)));
        addToast(`${bulkSelectedIds.size} user(s) deleted.`);
        setBulkSelectedIds(new Set());
        setConfirmDialog(null);
      },
    });
  };

  const handleBulkUpdate = () => {
    if (bulkSelectedIds.size === 0) { addToast('No users selected.', 'error'); return; }
    if (!bulkValue) { addToast('Please enter a new value.', 'error'); return; }
    setConfirmDialog({
      title: 'Bulk Update',
      message: `Update "${bulkField}" to "${bulkValue}" for ${bulkSelectedIds.size} user(s)?`,
      onConfirm: () => {
        setUsers(prev => prev.map(u => bulkSelectedIds.has(u.id) ? { ...u, [bulkField]: bulkValue } : u));
        addToast(`${bulkSelectedIds.size} user(s) updated: ${bulkField} set to "${bulkValue}".`);
        setBulkSelectedIds(new Set());
        setBulkValue('');
        setConfirmDialog(null);
      },
    });
  };

  // ── Email Verify tab state ──
  const [evDetailUser, setEvDetailUser] = useState<User | null>(null);

  // ── System tab state ──
  const [twoFA, setTwoFA] = useState(true);
  const [pwComplexity, setPwComplexity] = useState(true);
  const [auditLog, setAuditLog] = useState(true);

  // ──────────────────────────────────────────────
  // Shared style helpers
  // ──────────────────────────────────────────────
  const inputStyle = (hasError: boolean, isValid: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: `2px solid ${hasError ? '#d32f2f' : isValid ? '#388e3c' : '#ccc'}`,
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const btnPrimary: React.CSSProperties = { padding: '0.7rem 1.5rem', backgroundColor: '#0052CC', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 };
  const btnDanger: React.CSSProperties = { ...btnPrimary, backgroundColor: '#d32f2f' };
  const btnSuccess: React.CSSProperties = { ...btnPrimary, backgroundColor: '#388e3c' };
  const btnSecondary: React.CSSProperties = { ...btnPrimary, backgroundColor: '#666' };

  // ──────────────────────────────────────────────
  // Render helpers
  // ──────────────────────────────────────────────
  const renderPasswordStrength = (pw: string) => {
    if (!pw) return null;
    const s = getPasswordStrength(pw);
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: i <= s.level - 1 ? s.color : '#e0e0e0', transition: 'background-color 0.3s' }} />
          ))}
        </div>
        <span style={{ fontSize: '0.8rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
      </div>
    );
  };

  const renderPasswordChecklist = (pw: string) => {
    const checks = getPasswordChecks(pw);
    return (
      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {checks.map(c => (
          <div key={c.label} style={{ fontSize: '0.82rem', color: c.pass ? '#388e3c' : '#d32f2f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 'bold', width: '16px' }}>{c.pass ? '\u2713' : '\u2717'}</span>{c.label}
          </div>
        ))}
      </div>
    );
  };

  const renderFormField = (label: string, name: string, value: string, onChange: (v: string) => void, onBlur: () => void, error?: string, touched?: boolean, type = 'text', options?: string[]) => {
    const hasError = !!error && !!touched;
    const isValid = !!touched && !error && value.length > 0;
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>{label}</label>
        {options ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            style={inputStyle(hasError, isValid)}
          >
            <option value="">Select {label}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            style={inputStyle(hasError, isValid)}
          />
        )}
        {hasError && <div style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '3px' }}>{error}</div>}
      </div>
    );
  };

  const renderSkeleton = (rows: number) => (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: '44px', marginBottom: '8px', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; fg: string }> = {
      Active: { bg: '#E8F5E9', fg: '#2E7D32' },
      Inactive: { bg: '#FFF3E0', fg: '#E65100' },
      Suspended: { bg: '#FFEBEE', fg: '#C62828' },
    };
    const c = colors[status] || { bg: '#eee', fg: '#333' };
    return <span style={{ padding: '3px 10px', backgroundColor: c.bg, color: c.fg, borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>{status}</span>;
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1a1a1a' }}>

      {/* ── Toast Notifications ── */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '380px' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '8px',
            backgroundColor: t.type === 'success' ? '#388e3c' : t.type === 'error' ? '#d32f2f' : '#0052CC',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            fontSize: '0.9rem',
            animation: 'slideInRight 0.3s ease',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontWeight: 'bold' }}>{t.type === 'success' ? '\u2713' : t.type === 'error' ? '\u2717' : 'i'}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem', padding: 0 }}>{'\u00D7'}</button>
          </div>
        ))}
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      </div>

      {/* ── Confirm Dialog ── */}
      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '440px', width: '90%', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem' }}>{confirmDialog.title}</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#555', lineHeight: 1.5 }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDialog(null)} style={btnSecondary}>Cancel</button>
              <button onClick={confirmDialog.onConfirm} style={btnDanger}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Panel (slide from right) ── */}
      {detailUser && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', backgroundColor: '#fff', zIndex: 9998, boxShadow: '-4px 0 30px rgba(0,0,0,0.2)', animation: 'slidePanel 0.3s ease', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>User Details</h2>
            <button onClick={() => { setDetailUser(null); setIsEditingDetail(false); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>{'\u00D7'}</button>
          </div>
          <div style={{ padding: '1.5rem', flex: 1 }}>
            {isEditingDetail ? (
              <div>
                {renderFormField('Username', 'username', editForm.username || '', v => setEditForm(p => ({ ...p, username: v })), () => {}, undefined, false)}
                {renderFormField('Email', 'email', editForm.email || '', v => setEditForm(p => ({ ...p, email: v })), () => {}, undefined, false)}
                {renderFormField('First Name', 'firstName', editForm.firstName || '', v => setEditForm(p => ({ ...p, firstName: v })), () => {}, undefined, false)}
                {renderFormField('Last Name', 'lastName', editForm.lastName || '', v => setEditForm(p => ({ ...p, lastName: v })), () => {}, undefined, false)}
                {renderFormField('Role', 'role', editForm.role || '', v => setEditForm(p => ({ ...p, role: v })), () => {}, undefined, false, 'text', ROLES)}
                {renderFormField('Department', 'department', editForm.department || '', v => setEditForm(p => ({ ...p, department: v })), () => {}, undefined, false, 'text', DEPARTMENTS)}
                {renderFormField('Status', 'status', editForm.status || '', v => setEditForm(p => ({ ...p, status: v })), () => {}, undefined, false, 'text', ['Active', 'Inactive', 'Suspended'])}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button onClick={handleSaveEdit} style={btnPrimary}>Save Changes</button>
                  <button onClick={() => setIsEditingDetail(false)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {[
                  ['Username', detailUser.username],
                  ['Email', detailUser.email],
                  ['Full Name', `${detailUser.firstName} ${detailUser.lastName}`],
                  ['Role', detailUser.role],
                  ['Department', detailUser.department],
                  ['Status', detailUser.status],
                  ['Last Login', detailUser.lastLogin],
                  ['Email Verified', detailUser.emailVerified ? 'Yes' : 'No'],
                  ['Created', detailUser.createdAt],
                ].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => { setIsEditingDetail(true); setEditForm({ ...detailUser }); }} style={btnPrimary}>Edit</button>
                  <button onClick={() => handleDeleteUser(detailUser)} style={btnDanger}>Delete</button>
                </div>
              </div>
            )}
          </div>
          <style>{`@keyframes slidePanel { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </div>
      )}

      {/* ── Email Verify Detail Panel ── */}
      {evDetailUser && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', backgroundColor: '#fff', zIndex: 9998, boxShadow: '-4px 0 30px rgba(0,0,0,0.2)', animation: 'slidePanel 0.3s ease', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Verification Details</h2>
            <button onClick={() => setEvDetailUser(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>{'\u00D7'}</button>
          </div>
          <div style={{ padding: '1.5rem', flex: 1 }}>
            {[
              ['Username', evDetailUser.username],
              ['Email', evDetailUser.email],
              ['Full Name', `${evDetailUser.firstName} ${evDetailUser.lastName}`],
              ['Verified', evDetailUser.emailVerified ? 'Yes' : 'No'],
              ['Verified Date', evDetailUser.emailVerifiedDate || 'N/A'],
              ['Created', evDetailUser.createdAt],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 700 }}>Administration Console</h1>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e0e0e0', marginBottom: '2rem', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: activeTab === tab ? '#0052CC' : 'transparent',
              color: activeTab === tab ? '#fff' : '#555',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: USERS                                    */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>User Management</h2>

          {/* Search */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={userSearch}
              onChange={e => { setUserSearch(e.target.value); setCurrentPage(1); }}
              style={{ padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem', width: '320px', maxWidth: '100%' }}
            />
            <span style={{ fontSize: '0.85rem', color: '#888' }}>{filteredUsers.length} user(s) found</span>
          </div>

          {/* Bulk action bar */}
          {someSelected && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#E3F2FD', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedUserIds.size} selected</span>
              <button onClick={handleBulkDeleteSelected} style={{ ...btnDanger, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Delete Selected</button>
              <button onClick={() => { addToast(`Updating ${selectedUserIds.size} user(s)...`, 'info'); }} style={{ ...btnPrimary, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Update Selected</button>
              <button onClick={handleExportSelectedCSV} style={{ ...btnSuccess, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Export CSV</button>
              <button onClick={() => addToast('PDF export initiated for selected users.', 'info')} style={{ ...btnPrimary, padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: '#7b1fa2' }}>Export PDF</button>
              <button onClick={() => setSelectedUserIds(new Set())} style={{ ...btnSecondary, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Clear</button>
            </div>
          )}

          {isLoading ? renderSkeleton(8) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f7fa' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #ddd', width: '40px' }}>
                        <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} />
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Full Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Last Login</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map(user => (
                      <tr
                        key={user.id}
                        onClick={() => { setDetailUser(user); setIsEditingDetail(false); }}
                        style={{ borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedUserIds.has(user.id) ? '#E3F2FD' : 'transparent', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => { if (!selectedUserIds.has(user.id)) (e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = selectedUserIds.has(user.id) ? '#E3F2FD' : 'transparent'; }}
                      >
                        <td style={{ padding: '0.75rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => toggleSelect(user.id)} />
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 500 }}>{user.username}</td>
                        <td style={{ padding: '0.75rem' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem' }}>{user.firstName} {user.lastName}</td>
                        <td style={{ padding: '0.75rem' }}>{user.role}</td>
                        <td style={{ padding: '0.75rem' }}>{statusBadge(user.status)}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>{user.lastLogin}</td>
                        <td style={{ padding: '0.75rem' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => { setDetailUser(user); setIsEditingDetail(true); setEditForm({ ...user }); }}
                            style={{ padding: '0.35rem 0.75rem', marginRight: '0.4rem', backgroundColor: '#0052CC', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            style={{ padding: '0.35rem 0.75rem', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pagedUsers.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  Showing {showingFrom} to {showingTo} of {filteredUsers.length}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#666' }}>Page size:</label>
                  <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  >
                    {[10, 25, 50].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={{ padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '0.85rem' }}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{ padding: '0.4rem 0.7rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: p === currentPage ? '#0052CC' : '#fff', color: p === currentPage ? '#fff' : '#333', cursor: 'pointer', fontWeight: p === currentPage ? 700 : 400, fontSize: '0.85rem' }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={{ padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff', cursor: currentPage === totalPages ? 'default' : 'pointer', fontSize: '0.85rem' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: REGISTRATION                             */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'registration' && (
        <div style={{ maxWidth: '560px' }}>
          <h2 style={{ marginBottom: '1.25rem' }}>Register New User</h2>

          {renderFormField('Username', 'username', regForm.username, v => setRegForm(p => ({ ...p, username: v })), () => setRegTouched(p => ({ ...p, username: true })), regValidation.username, regTouched.username)}
          {renderFormField('Email', 'email', regForm.email, v => setRegForm(p => ({ ...p, email: v })), () => setRegTouched(p => ({ ...p, email: true })), regValidation.email, regTouched.email)}

          {renderFormField('Password', 'password', regForm.password, v => setRegForm(p => ({ ...p, password: v })), () => setRegTouched(p => ({ ...p, password: true })), regValidation.password, regTouched.password, 'password')}
          {regForm.password && renderPasswordStrength(regForm.password)}
          {regForm.password && renderPasswordChecklist(regForm.password)}

          <div style={{ marginTop: '0.5rem' }} />
          {renderFormField('Confirm Password', 'confirmPassword', regForm.confirmPassword, v => setRegForm(p => ({ ...p, confirmPassword: v })), () => setRegTouched(p => ({ ...p, confirmPassword: true })), regValidation.confirmPassword, regTouched.confirmPassword, 'password')}

          {renderFormField('First Name', 'firstName', regForm.firstName, v => setRegForm(p => ({ ...p, firstName: v })), () => setRegTouched(p => ({ ...p, firstName: true })), regValidation.firstName, regTouched.firstName)}
          {renderFormField('Last Name', 'lastName', regForm.lastName, v => setRegForm(p => ({ ...p, lastName: v })), () => setRegTouched(p => ({ ...p, lastName: true })), regValidation.lastName, regTouched.lastName)}

          {renderFormField('Role', 'role', regForm.role, v => setRegForm(p => ({ ...p, role: v })), () => setRegTouched(p => ({ ...p, role: true })), regValidation.role, regTouched.role, 'text', ROLES)}
          {renderFormField('Department', 'department', regForm.department, v => setRegForm(p => ({ ...p, department: v })), () => setRegTouched(p => ({ ...p, department: true })), regValidation.department, regTouched.department, 'text', DEPARTMENTS)}

          <button
            disabled={!regValid}
            onClick={handleRegSubmit}
            style={{ ...btnPrimary, opacity: regValid ? 1 : 0.5, cursor: regValid ? 'pointer' : 'not-allowed', marginTop: '0.5rem' }}
          >
            Register User
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: PASSWORD RESET                           */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'password-reset' && (
        <div style={{ maxWidth: '480px' }}>
          <h2 style={{ marginBottom: '1.25rem' }}>Password Reset</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>Enter the user&apos;s email address to send a password reset link.</p>

          {renderFormField('Email Address', 'resetEmail', resetEmail, setResetEmail, () => setResetEmailTouched(true), resetEmailError, resetEmailTouched)}

          <button
            disabled={!resetEmail || !!resetEmailError || !resetEmailTouched}
            onClick={() => {
              addToast(`Password reset link sent to ${resetEmail}.`);
              setResetEmail('');
              setResetEmailTouched(false);
            }}
            style={{ ...btnPrimary, opacity: (!resetEmail || !!resetEmailError) ? 0.5 : 1, cursor: (!resetEmail || !!resetEmailError) ? 'not-allowed' : 'pointer' }}
          >
            Send Reset Link
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: CHANGE PASSWORD                          */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'change-password' && (
        <div style={{ maxWidth: '520px' }}>
          <h2 style={{ marginBottom: '1.25rem' }}>Change Password</h2>

          {renderFormField('Username', 'user', cpUser, setCpUser, () => setCpTouched(p => ({ ...p, user: true })), cpErrors.user, cpTouched.user, 'text', users.map(u => u.username))}
          {renderFormField('Current Password', 'current', cpCurrent, setCpCurrent, () => setCpTouched(p => ({ ...p, current: true })), cpErrors.current, cpTouched.current, 'password')}

          {renderFormField('New Password', 'newPw', cpNew, setCpNew, () => setCpTouched(p => ({ ...p, newPw: true })), cpErrors.newPw, cpTouched.newPw, 'password')}
          {cpNew && renderPasswordStrength(cpNew)}
          {cpNew && renderPasswordChecklist(cpNew)}

          <div style={{ marginTop: '0.5rem' }} />
          {renderFormField('Confirm New Password', 'confirm', cpConfirm, setCpConfirm, () => setCpTouched(p => ({ ...p, confirm: true })), cpErrors.confirm, cpTouched.confirm, 'password')}

          <button
            disabled={!cpAllValid}
            onClick={() => {
              addToast(`Password changed for "${cpUser}".`);
              setCpUser(''); setCpCurrent(''); setCpNew(''); setCpConfirm(''); setCpTouched({});
            }}
            style={{ ...btnPrimary, opacity: cpAllValid ? 1 : 0.5, cursor: cpAllValid ? 'pointer' : 'not-allowed' }}
          >
            Change Password
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: EMAIL VERIFY                             */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'email-verify' && (
        <div>
          <h2 style={{ marginBottom: '1.25rem' }}>Email Verification Status</h2>
          {isLoading ? renderSkeleton(8) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f7fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Verified</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Verified Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                      onClick={() => setEvDetailUser(user)}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{user.username}</td>
                      <td style={{ padding: '0.75rem' }}>{user.email}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.2rem', color: user.emailVerified ? '#388e3c' : '#d32f2f' }}>
                          {user.emailVerified ? '\u2713' : '\u2717'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.85rem' }}>{user.emailVerifiedDate || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }} onClick={e => e.stopPropagation()}>
                        {user.emailVerified ? (
                          <button
                            onClick={() => addToast(`Verification email resent to ${user.email}.`)}
                            style={{ padding: '0.35rem 0.75rem', backgroundColor: '#0052CC', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Resend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUsers(prev => prev.map(u => u.id === user.id ? { ...u, emailVerified: true, emailVerifiedDate: new Date().toISOString().split('T')[0] } : u));
                              addToast(`Verification email sent to ${user.email}.`);
                            }}
                            style={{ padding: '0.35rem 0.75rem', backgroundColor: '#388e3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Send Verification
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: EXPORT                                   */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'export' && (
        <div>
          <h2 style={{ marginBottom: '1.25rem' }}>Export Data</h2>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Export Type</label>
              <select value={exportType} onChange={e => setExportType(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem', minWidth: '180px' }}>
                {['Users', 'Documents', 'Workflows', 'Audit Log'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Date From</label>
              <input type="date" value={exportDateFrom} onChange={e => setExportDateFrom(e.target.value)} style={{ padding: '0.6rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Date To</label>
              <input type="date" value={exportDateTo} onChange={e => setExportDateTo(e.target.value)} style={{ padding: '0.6rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem' }} />
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Preview (first 5 rows)</h3>
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f7fa' }}>
                  {Object.keys(exportPreview[0] || {}).map(k => (
                    <th key={k} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(exportPreview as Record<string, unknown>[]).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} style={{ padding: '0.6rem 0.75rem' }}>{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleExportCSV} style={btnSuccess}>Download CSV</button>
            <button onClick={handleExportPDF} style={{ ...btnPrimary, backgroundColor: '#7b1fa2' }}>Download PDF</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: BULK OPS                                 */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'bulk-ops' && (
        <div>
          <h2 style={{ marginBottom: '1.25rem' }}>Bulk Operations</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Bulk Delete Section */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#d32f2f' }}>Bulk Delete</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Select users below, then click delete.</p>
              <button onClick={handleBulkDelete} disabled={bulkSelectedIds.size === 0} style={{ ...btnDanger, opacity: bulkSelectedIds.size === 0 ? 0.5 : 1, cursor: bulkSelectedIds.size === 0 ? 'not-allowed' : 'pointer', marginBottom: '1rem' }}>
                Delete {bulkSelectedIds.size > 0 ? `(${bulkSelectedIds.size})` : ''} Selected
              </button>
            </div>

            {/* Bulk Update Section */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#0052CC' }}>Bulk Update</h3>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Field to Update</label>
                <select value={bulkField} onChange={e => setBulkField(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}>
                  <option value="role">Role</option>
                  <option value="status">Status</option>
                  <option value="department">Department</option>
                </select>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>New Value</label>
                {bulkField === 'role' ? (
                  <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}>
                    <option value="">Select...</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                ) : bulkField === 'status' ? (
                  <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}>
                    <option value="">Select...</option>
                    {['Active', 'Inactive', 'Suspended'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}>
                    <option value="">Select...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              </div>
              <button onClick={handleBulkUpdate} disabled={bulkSelectedIds.size === 0 || !bulkValue} style={{ ...btnPrimary, opacity: (bulkSelectedIds.size === 0 || !bulkValue) ? 0.5 : 1, cursor: (bulkSelectedIds.size === 0 || !bulkValue) ? 'not-allowed' : 'pointer' }}>
                Apply Update ({bulkSelectedIds.size})
              </button>
            </div>
          </div>

          {/* User selection table for bulk ops */}
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f7fa' }}>
                  <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #ddd', width: '40px' }}>
                    <input type="checkbox" checked={bulkAllSelected} onChange={toggleBulkAll} />
                  </th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                  <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Department</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee', backgroundColor: bulkSelectedIds.has(u.id) ? '#E3F2FD' : 'transparent' }}>
                    <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                      <input type="checkbox" checked={bulkSelectedIds.has(u.id)} onChange={() => toggleBulkSelect(u.id)} />
                    </td>
                    <td style={{ padding: '0.6rem', fontWeight: 500 }}>{u.username}</td>
                    <td style={{ padding: '0.6rem' }}>{u.email}</td>
                    <td style={{ padding: '0.6rem' }}>{u.role}</td>
                    <td style={{ padding: '0.6rem' }}>{statusBadge(u.status)}</td>
                    <td style={{ padding: '0.6rem' }}>{u.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: SYSTEM                                   */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'system' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>System Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Server Information</h3>
              <p style={{ margin: '0.4rem 0' }}>Version: 7.3.0</p>
              <p style={{ margin: '0.4rem 0' }}>Database: PostgreSQL 14.2</p>
              <p style={{ margin: '0.4rem 0' }}>Memory: 16GB / 32GB</p>
              <p style={{ margin: '0.4rem 0' }}>Storage: 250GB / 1TB</p>
              <button
                onClick={() => addToast('System logs opened.', 'info')}
                style={{ marginTop: '1rem', ...btnPrimary }}
              >
                View Logs
              </button>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Performance</h3>
              <p style={{ margin: '0.4rem 0' }}>CPU Usage: 45%</p>
              <p style={{ margin: '0.4rem 0' }}>Active Sessions: 127</p>
              <p style={{ margin: '0.4rem 0' }}>Response Time: 120ms</p>
              <p style={{ margin: '0.4rem 0' }}>Uptime: 45 days</p>
              <button
                onClick={() => addToast('Performance monitor opened.', 'info')}
                style={{ marginTop: '1rem', ...btnSuccess }}
              >
                Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: SECURITY                                 */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'security' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Security Settings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '560px' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} />
                <span style={{ fontWeight: 500 }}>Enable Two-Factor Authentication</span>
              </label>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={pwComplexity} onChange={e => setPwComplexity(e.target.checked)} />
                <span style={{ fontWeight: 500 }}>Enforce Password Complexity</span>
              </label>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={auditLog} onChange={e => setAuditLog(e.target.checked)} />
                <span style={{ fontWeight: 500 }}>Enable Audit Logging</span>
              </label>
            </div>
            <button
              onClick={() => addToast('Security settings saved successfully!')}
              style={{ ...btnSuccess, alignSelf: 'flex-start', marginTop: '0.5rem' }}
            >
              Save Security Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Wrapper with Suspense for useSearchParams
// ──────────────────────────────────────────────
export default function AdminPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 700 }}>Administration Console</h1>
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e0e0e0', marginBottom: '2rem' }}>
          {TABS.map(tab => (
            <div key={tab} style={{ padding: '0.75rem 1.25rem', backgroundColor: '#f0f0f0', borderRadius: '6px 6px 0 0', marginRight: '2px', fontSize: '0.9rem', color: '#999' }}>
              {TAB_LABELS[tab]}
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: '44px', marginBottom: '8px', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
          <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        </div>
      </div>
    }>
      <AdminPageInner />
    </Suspense>
  );
}
