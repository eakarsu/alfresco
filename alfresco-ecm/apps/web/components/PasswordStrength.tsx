'use client';

import React, { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PasswordStrengthProps {
  password: string;
  onChange: (password: string) => void;
  showChecklist?: boolean;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong' | 'very strong';

interface ChecklistItem {
  label: string;
  met: boolean;
}

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  weak: '#FF5630',
  fair: '#FF8B00',
  good: '#FFAB00',
  strong: '#36B37E',
  'very strong': '#006644',
};

const STRENGTH_WIDTHS: Record<StrengthLevel, string> = {
  weak: '20%',
  fair: '40%',
  good: '60%',
  strong: '80%',
  'very strong': '100%',
};

// ---------------------------------------------------------------------------
// Evaluate password
// ---------------------------------------------------------------------------

function evaluatePassword(password: string): {
  level: StrengthLevel;
  score: number;
  checklist: ChecklistItem[];
} {
  const checks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const checklist: ChecklistItem[] = [
    { label: 'At least 8 characters', met: checks.minLength },
    { label: 'At least one uppercase letter', met: checks.uppercase },
    { label: 'At least one lowercase letter', met: checks.lowercase },
    { label: 'At least one number', met: checks.number },
    { label: 'At least one special character', met: checks.special },
  ];

  const score = Object.values(checks).filter(Boolean).length;

  let level: StrengthLevel;
  if (password.length === 0) {
    level = 'weak';
  } else if (score <= 1) {
    level = 'weak';
  } else if (score === 2) {
    level = 'fair';
  } else if (score === 3) {
    level = 'good';
  } else if (score === 4) {
    level = 'strong';
  } else {
    level = 'very strong';
  }

  return { level, score, checklist };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PasswordStrength({
  password,
  onChange,
  showChecklist = true,
}: PasswordStrengthProps) {
  const { level, checklist } = useMemo(() => evaluatePassword(password), [password]);

  const color = STRENGTH_COLORS[level];
  const width = password.length === 0 ? '0%' : STRENGTH_WIDTHS[level];

  return (
    <div
      data-testid="password-strength"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {/* Password input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <label
          htmlFor="password-strength-input"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#172B4D',
          }}
        >
          Password
        </label>
        <input
          id="password-strength-input"
          type="password"
          value={password}
          onChange={(e) => onChange(e.target.value)}
          data-testid="password-input"
          placeholder="Enter your password"
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #DFE1E6',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: '#172B4D',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#0052CC';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#DFE1E6';
          }}
        />
      </div>

      {/* Strength bar */}
      <div>
        <div
          data-testid="strength-bar-track"
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#DFE1E6',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            data-testid="strength-bar-fill"
            style={{
              width,
              height: '100%',
              backgroundColor: color,
              borderRadius: '3px',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        </div>

        {/* Label */}
        {password.length > 0 && (
          <div
            data-testid="strength-label"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '0.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color,
                textTransform: 'capitalize',
              }}
            >
              {level}
            </span>
          </div>
        )}
      </div>

      {/* Checklist */}
      {showChecklist && (
        <ul
          data-testid="password-checklist"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          {checklist.map((item) => (
            <li
              key={item.label}
              data-testid={`checklist-${item.met ? 'pass' : 'fail'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: item.met ? '#36B37E' : '#6B778C',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: item.met ? '#E3FCEF' : '#F4F5F7',
                  color: item.met ? '#006644' : '#97A0AF',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.met ? '\u2713' : '\u2022'}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
