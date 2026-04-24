'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const toastConfig: Record<string, { bg: string; icon: string }> = {
  success: { bg: '#4CAF50', icon: '\u2713' },
  error: { bg: '#FF5252', icon: '\u2717' },
  warning: { bg: '#FF9800', icon: '\u26A0' },
  info: { bg: '#2196F3', icon: '\u2139' },
};

export default function ToastDemoPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Toast Container - Top Right */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '380px',
      }}>
        {toasts.map(toast => {
          const config = toastConfig[toast.type];
          return (
            <div
              key={toast.id}
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: config.bg,
                color: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '300px',
                animation: 'toastSlideIn 0.3s ease-out',
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                {config.icon}
              </span>
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 0.25rem',
                  lineHeight: '1',
                  opacity: 0.8,
                  flexShrink: 0,
                }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Toast Notifications Demo
        </h1>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          Click the buttons below to trigger different types of toast notifications. Toasts appear in the top-right corner, stack vertically, and auto-dismiss after 3 seconds.
        </p>
      </header>

      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#333' }}>Trigger Toasts</h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => addToast('Operation completed successfully!', 'success')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Success Toast
          </button>
          <button
            onClick={() => addToast('Something went wrong. Please try again.', 'error')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF5252',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Error Toast
          </button>
          <button
            onClick={() => addToast('Please review the changes before proceeding.', 'warning')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Warning Toast
          </button>
          <button
            onClick={() => addToast('New document version is available.', 'info')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Info Toast
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            onClick={() => {
              addToast('File uploaded successfully!', 'success');
              setTimeout(() => addToast('Processing document...', 'info'), 200);
              setTimeout(() => addToast('Indexing may take a moment.', 'warning'), 400);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6554C0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Multiple Toasts (3)
          </button>
          <button
            onClick={clearAll}
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
            Clear All
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Behavior Notes</h2>
        <ul style={{ lineHeight: '2', color: '#555', paddingLeft: '1.5rem' }}>
          <li>Toasts appear in the top-right corner of the screen</li>
          <li>Multiple toasts stack vertically</li>
          <li>Each toast auto-dismisses after 3 seconds</li>
          <li>Each toast has a close button (x) for immediate dismissal</li>
          <li>Toasts slide in from the right with animation</li>
          <li>Active toasts count: <strong>{toasts.length}</strong></li>
        </ul>
      </div>
    </div>
  );
}
