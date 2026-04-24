'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Colour palette per type
// ---------------------------------------------------------------------------

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#E3FCEF', border: '#36B37E', icon: '#006644' },
  error:   { bg: '#FFEBE6', border: '#FF5630', icon: '#BF2600' },
  warning: { bg: '#FFFAE6', border: '#FFAB00', icon: '#FF8B00' },
  info:    { bg: '#DEEBFF', border: '#0065FF', icon: '#0747A6' },
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '\u2713',
  error:   '\u2717',
  warning: '\u26A0',
  info:    '\u2139',
};

// ---------------------------------------------------------------------------
// Keyframes injected once
// ---------------------------------------------------------------------------

let stylesInjected = false;
function injectKeyframes() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes alfresco-toast-slide-in {
      from { transform: translateX(120%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes alfresco-toast-slide-out {
      from { transform: translateX(0);    opacity: 1; }
      to   { transform: translateX(120%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Single Toast component
// ---------------------------------------------------------------------------

function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration]);

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(onClose, 300);
      return () => clearTimeout(t);
    }
  }, [exiting, onClose]);

  const colors = TOAST_COLORS[type];

  return (
    <div
      role="alert"
      data-testid={`toast-${type}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        marginBottom: '0.5rem',
        minWidth: '320px',
        maxWidth: '420px',
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: exiting
          ? 'alfresco-toast-slide-out 0.3s ease-in forwards'
          : 'alfresco-toast-slide-in 0.3s ease-out forwards',
        fontFamily: 'inherit',
      }}
    >
      <span
        style={{
          fontSize: '1.25rem',
          lineHeight: 1,
          color: colors.icon,
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {TOAST_ICONS[type]}
      </span>

      <span
        style={{
          flex: 1,
          fontSize: '0.875rem',
          color: '#172B4D',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {message}
      </span>

      <button
        data-testid="toast-close"
        onClick={() => setExiting(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          lineHeight: 1,
          color: '#6B778C',
          padding: '0',
          flexShrink: 0,
          marginTop: '2px',
        }}
        aria-label="Close notification"
      >
        {'\u2715'}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = `toast-${++idCounter}-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast container - top-right, stacked */}
      <div
        data-testid="toast-container"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast
              message={t.message}
              type={t.type}
              duration={t.duration}
              onClose={() => removeToast(t.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

export default Toast;
