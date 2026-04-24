'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  variant?: ConfirmDialogVariant;
}

// ---------------------------------------------------------------------------
// Variant colours
// ---------------------------------------------------------------------------

const VARIANT_STYLES: Record<
  ConfirmDialogVariant,
  { confirmBg: string; confirmHover: string; headerColor: string; iconColor: string; icon: string }
> = {
  danger: {
    confirmBg: '#FF5630',
    confirmHover: '#DE350B',
    headerColor: '#BF2600',
    iconColor: '#FF5630',
    icon: '\u26A0',
  },
  warning: {
    confirmBg: '#FFAB00',
    confirmHover: '#FF8B00',
    headerColor: '#FF8B00',
    iconColor: '#FFAB00',
    icon: '\u26A0',
  },
  info: {
    confirmBg: '#0065FF',
    confirmHover: '#0052CC',
    headerColor: '#0747A6',
    iconColor: '#0065FF',
    icon: '\u2139',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  variant = 'info',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const vs = VARIANT_STYLES[variant];

  // ---- Focus trap ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableEls = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableEls.length === 0) return;

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onCancel],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Focus the cancel button on open
    cancelBtnRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="confirm-dialog-overlay"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        data-testid="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              color: vs.iconColor,
              lineHeight: 1,
            }}
          >
            {vs.icon}
          </span>
          <h2
            id="confirm-dialog-title"
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: vs.headerColor,
            }}
          >
            {title}
          </h2>
        </div>

        {/* Body */}
        <p
          id="confirm-dialog-message"
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.9375rem',
            color: '#42526E',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button
            ref={cancelBtnRef}
            data-testid="confirm-dialog-cancel"
            onClick={onCancel}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: '#F4F5F7',
              color: '#42526E',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EBECF0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F4F5F7';
            }}
          >
            {cancelLabel}
          </button>

          <button
            data-testid="confirm-dialog-confirm"
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: vs.confirmBg,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = vs.confirmHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = vs.confirmBg;
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
