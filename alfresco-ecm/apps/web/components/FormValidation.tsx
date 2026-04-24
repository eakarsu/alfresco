'use client';

import React, { useState, useCallback, useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ValidatorFn = (value: string) => string | null;

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message: string };
  custom?: ValidatorFn;
}

export interface FieldConfig {
  [fieldName: string]: ValidationRule;
}

export interface UseFormValidationReturn {
  values: Record<string, string>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  setFieldValue: (field: string, value: string) => void;
  validate: () => boolean;
  reset: () => void;
  isValid: boolean;
}

export interface ValidatedInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | null;
  touched: boolean;
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  disabled?: boolean;
  autoComplete?: string;
}

export interface ValidatedFormProps {
  onSubmit: (values: Record<string, string>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Email regex
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Validate a single field
// ---------------------------------------------------------------------------

function validateField(value: string, rule: ValidationRule): string | null {
  if (rule.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }

  if (value && rule.email && !EMAIL_REGEX.test(value)) {
    return 'Please enter a valid email address';
  }

  if (value && rule.minLength !== undefined && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  if (value && rule.maxLength !== undefined && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  if (value && rule.pattern && !rule.pattern.regex.test(value)) {
    return rule.pattern.message;
  }

  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

// ---------------------------------------------------------------------------
// useFormValidation hook
// ---------------------------------------------------------------------------

export function useFormValidation(
  fieldConfigs: FieldConfig,
  initialValues: Record<string, string> = {},
): UseFormValidationReturn {
  const fieldNames = useMemo(() => Object.keys(fieldConfigs), [fieldConfigs]);

  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const name of fieldNames) {
      v[name] = initialValues[name] ?? '';
    }
    return v;
  });

  const [errors, setErrors] = useState<Record<string, string | null>>(() => {
    const e: Record<string, string | null> = {};
    for (const name of fieldNames) e[name] = null;
    return e;
  });

  const [touched, setTouched] = useState<Record<string, boolean>>(() => {
    const t: Record<string, boolean> = {};
    for (const name of fieldNames) t[name] = false;
    return t;
  });

  const handleChange = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Real-time validation only if already touched
      setTouched((prev) => {
        if (prev[field]) {
          const rule = fieldConfigs[field];
          if (rule) {
            const err = validateField(value, rule);
            setErrors((prevErrors) => ({ ...prevErrors, [field]: err }));
          }
        }
        return prev;
      });
    },
    [fieldConfigs],
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const rule = fieldConfigs[field];
      if (rule) {
        setValues((prev) => {
          const err = validateField(prev[field] ?? '', rule);
          setErrors((prevErrors) => ({ ...prevErrors, [field]: err }));
          return prev;
        });
      }
    },
    [fieldConfigs],
  );

  const setFieldValue = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {};
    const newTouched: Record<string, boolean> = {};
    let allValid = true;

    for (const name of fieldNames) {
      newTouched[name] = true;
      const rule = fieldConfigs[name];
      const err = rule ? validateField(values[name] ?? '', rule) : null;
      newErrors[name] = err;
      if (err) allValid = false;
    }

    setErrors(newErrors);
    setTouched(newTouched);
    return allValid;
  }, [fieldConfigs, fieldNames, values]);

  const reset = useCallback(() => {
    const v: Record<string, string> = {};
    const e: Record<string, string | null> = {};
    const t: Record<string, boolean> = {};
    for (const name of fieldNames) {
      v[name] = initialValues[name] ?? '';
      e[name] = null;
      t[name] = false;
    }
    setValues(v);
    setErrors(e);
    setTouched(t);
  }, [fieldNames, initialValues]);

  const isValid = useMemo(() => {
    return fieldNames.every((name) => !errors[name]);
  }, [fieldNames, errors]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validate,
    reset,
    isValid,
  };
}

// ---------------------------------------------------------------------------
// ValidatedInput component
// ---------------------------------------------------------------------------

export function ValidatedInput({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
  autoComplete,
}: ValidatedInputProps) {
  const showError = touched && error;

  return (
    <div
      data-testid={`field-${name}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        marginBottom: '1rem',
      }}
    >
      <label
        htmlFor={`input-${name}`}
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#172B4D',
        }}
      >
        {label}
      </label>

      <input
        id={`input-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        disabled={disabled}
        autoComplete={autoComplete}
        data-testid={`input-${name}`}
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          border: `1px solid ${showError ? '#FF5630' : '#DFE1E6'}`,
          borderRadius: '4px',
          backgroundColor: disabled ? '#F4F5F7' : '#FFFFFF',
          color: '#172B4D',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => {
          if (!showError) {
            e.currentTarget.style.borderColor = '#0052CC';
          }
        }}
        onBlurCapture={(e) => {
          if (!showError) {
            e.currentTarget.style.borderColor = '#DFE1E6';
          }
        }}
      />

      {showError && (
        <span
          data-testid={`error-${name}`}
          style={{
            fontSize: '0.75rem',
            color: '#FF5630',
            lineHeight: 1.4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ValidatedForm component
// ---------------------------------------------------------------------------

export function ValidatedForm({ onSubmit, children, style }: ValidatedFormProps) {
  return (
    <form
      data-testid="validated-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values: Record<string, string> = {};
        formData.forEach((val, key) => {
          values[key] = val as string;
        });
        onSubmit(values);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {children}
    </form>
  );
}
