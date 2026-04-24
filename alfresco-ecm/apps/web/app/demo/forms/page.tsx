'use client';

import { useState, useCallback } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
}

interface FormTouched {
  username: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  department: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function validateField(name: keyof FormData, value: string, formData: FormData): string | undefined {
  switch (name) {
    case 'username':
      if (!value.trim()) return 'Username is required';
      if (value.length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Username must be alphanumeric only';
      return undefined;
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
      return undefined;
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must include a number';
      if (!/[^A-Za-z0-9]/.test(value)) return 'Password must include a special character';
      return undefined;
    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return undefined;
    case 'firstName':
      if (!value.trim()) return 'First name is required';
      return undefined;
    case 'lastName':
      if (!value.trim()) return 'Last name is required';
      return undefined;
    case 'phone':
      if (value && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/.test(value)) return 'Please enter a valid phone number';
      return undefined;
    case 'department':
      if (!value) return 'Please select a department';
      return undefined;
    default:
      return undefined;
  }
}

export default function FormsDemoPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    phone: false,
    department: false,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const handleChange = (name: keyof FormData, value: string) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (touched[name]) {
      const error = validateField(name, value, newFormData);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Re-validate confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name], formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = (): boolean => {
    const allFields: (keyof FormData)[] = ['username', 'email', 'password', 'confirmPassword', 'firstName', 'lastName', 'department'];
    for (const field of allFields) {
      if (validateField(field, formData[field], formData)) return false;
    }
    if (formData.phone && validateField('phone', formData.phone, formData)) return false;
    return true;
  };

  const handleSubmit = () => {
    // Touch all fields
    const allTouched: FormTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true,
      phone: true,
      department: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(field => {
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      addToast('Registration submitted successfully!', 'success');
      setSubmitted(true);
    } else {
      addToast('Please fix the form errors before submitting.', 'error');
    }
  };

  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      department: '',
    });
    setErrors({});
    setTouched({
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
      firstName: false,
      lastName: false,
      phone: false,
      department: false,
    });
    setSubmitted(false);
  };

  const getFieldStyle = (name: keyof FormData): React.CSSProperties => {
    const isTouched = touched[name];
    const hasError = errors[name];
    const hasValue = formData[name].trim();

    let borderColor = '#ddd';
    if (isTouched && hasError) borderColor = '#FF5252';
    else if (isTouched && hasValue && !hasError) borderColor = '#4CAF50';

    return {
      width: '100%',
      padding: '0.75rem',
      border: `2px solid ${borderColor}`,
      borderRadius: '4px',
      fontSize: '1rem',
      backgroundColor: '#fff',
      color: '#333',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    };
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
    fontSize: '0.9rem',
  };

  const errorStyle: React.CSSProperties = {
    color: '#FF5252',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  };

  const passwordStrengthChecks = [
    { label: 'Min 8 characters', met: formData.password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Number', met: /[0-9]/.test(formData.password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Toast Container */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: toast.type === 'success' ? '#4CAF50' : '#FF5252',
              color: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '300px',
              animation: 'toastIn 0.3s ease-out',
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', padding: '0', lineHeight: '1' }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Advanced Form Validation Demo
        </h1>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          A registration-style form with real-time field validation on blur and change. Red borders indicate errors, green borders indicate valid fields.
        </p>
      </header>

      {submitted ? (
        <div style={{
          backgroundColor: '#E8F5E9',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{'\u2713'}</div>
          <h2 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Registration Successful!</h2>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>
            Welcome, <strong>{formData.firstName} {formData.lastName}</strong>! Your account ({formData.username}) has been created.
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#0052CC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Register Another User
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#333' }}>User Registration</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* First Name */}
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                placeholder="John"
                style={getFieldStyle('firstName')}
              />
              {touched.firstName && errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
            </div>

            {/* Last Name */}
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                placeholder="Doe"
                style={getFieldStyle('lastName')}
              />
              {touched.lastName && errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Username */}
            <div>
              <label style={labelStyle}>Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                placeholder="johndoe"
                style={getFieldStyle('username')}
              />
              {touched.username && errors.username && <div style={errorStyle}>{errors.username}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="john@example.com"
                style={getFieldStyle('email')}
              />
              {touched.email && errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Password */}
            <div>
              <label style={labelStyle}>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter password"
                style={getFieldStyle('password')}
              />
              {touched.password && errors.password && <div style={errorStyle}>{errors.password}</div>}

              {/* Password strength checklist */}
              {formData.password && (
                <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.15rem' }}>
                  {passwordStrengthChecks.map(check => (
                    <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: check.met ? '#4CAF50' : '#999' }}>
                      <span>{check.met ? '\u2713' : '\u2717'}</span>
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm password"
                style={getFieldStyle('confirmPassword')}
              />
              {touched.confirmPassword && errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone (optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+1 (555) 123-4567"
                style={getFieldStyle('phone')}
              />
              {touched.phone && errors.phone && <div style={errorStyle}>{errors.phone}</div>}
            </div>

            {/* Department */}
            <div>
              <label style={labelStyle}>Department *</label>
              <select
                value={formData.department}
                onChange={e => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                style={getFieldStyle('department')}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
              </select>
              {touched.department && errors.department && <div style={errorStyle}>{errors.department}</div>}
            </div>
          </div>

          {/* Submit / Reset */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              style={{
                padding: '0.75rem 2.5rem',
                backgroundColor: isFormValid() ? '#0052CC' : '#b0bec5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isFormValid() ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: '600',
                opacity: isFormValid() ? 1 : 0.7,
              }}
            >
              Register
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Reset Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
