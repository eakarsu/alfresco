'use client';

import { useState, useEffect, useCallback } from 'react';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  type: 'danger' | 'warning' | 'info';
}

const typeColors: Record<string, { primary: string; hover: string; light: string }> = {
  danger: { primary: '#FF5252', hover: '#E04848', light: '#FFF5F5' },
  warning: { primary: '#FF9800', hover: '#E68A00', light: '#FFF8E1' },
  info: { primary: '#2196F3', hover: '#1976D2', light: '#E3F2FD' },
};

export default function ConfirmDemoPage() {
  const [dialog, setDialog] = useState<ConfirmDialogConfig | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const openDialog = (config: ConfirmDialogConfig) => {
    setDialog(config);
  };

  const handleConfirm = () => {
    if (dialog) {
      setResults(prev => [`[${new Date().toLocaleTimeString()}] "${dialog.title}" - Confirmed`, ...prev]);
    }
    setDialog(null);
  };

  const handleCancel = () => {
    if (dialog) {
      setResults(prev => [`[${new Date().toLocaleTimeString()}] "${dialog.title}" - Cancelled`, ...prev]);
    }
    setDialog(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && dialog) {
      handleCancel();
    }
  }, [dialog]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const colors = dialog ? typeColors[dialog.type] : typeColors.info;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Confirmation Dialog Demo
        </h1>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          Click the buttons below to trigger custom confirmation dialogs. The result (confirmed or cancelled) appears below.
        </p>
      </header>

      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#333' }}>Trigger Dialogs</h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => openDialog({
              title: 'Delete Document',
              message: 'Are you sure you want to permanently delete this document? This action cannot be undone and all versions will be lost.',
              confirmLabel: 'Delete',
              cancelLabel: 'Cancel',
              type: 'danger',
            })}
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
            Delete Confirmation
          </button>
          <button
            onClick={() => openDialog({
              title: 'Update Workflow',
              message: 'Updating this workflow will affect 12 active instances. Running tasks will be migrated to the new version. Do you want to proceed?',
              confirmLabel: 'Update',
              cancelLabel: 'Cancel',
              type: 'warning',
            })}
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
            Update Confirmation
          </button>
          <button
            onClick={() => openDialog({
              title: 'Share Document',
              message: 'This will share the document with all members of the Engineering team. They will receive a notification and can view and comment on the document.',
              confirmLabel: 'Share',
              cancelLabel: 'Cancel',
              type: 'info',
            })}
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
            Info Confirmation
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#333', margin: 0 }}>Results</h2>
          {results.length > 0 && (
            <button
              onClick={() => setResults([])}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No actions recorded yet. Trigger a dialog above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: result.includes('Confirmed') ? '#E8F5E9' : '#FFF3E0',
                  border: `1px solid ${result.includes('Confirmed') ? '#A5D6A7' : '#FFE0B2'}`,
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#333',
                  fontFamily: 'monospace',
                }}
              >
                {result.includes('Confirmed') ? '\u2713 ' : '\u2717 '}{result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>Dialog Features</h2>
        <ul style={{ lineHeight: '2', color: '#555', paddingLeft: '1.5rem' }}>
          <li>Modal overlay dims the background</li>
          <li>Dialog is centered both horizontally and vertically</li>
          <li>Press <strong>Escape</strong> key to close the dialog</li>
          <li>Click the overlay (outside the dialog) to close</li>
          <li>Three types: Danger (red), Warning (orange), Info (blue)</li>
          <li>Result of each action is recorded with a timestamp</li>
        </ul>
      </div>

      {/* Confirmation Dialog Modal */}
      {dialog && (
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Dialog Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: colors.light,
              borderBottom: `2px solid ${colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                {dialog.type === 'danger' ? '!' : dialog.type === 'warning' ? '!' : 'i'}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{dialog.title}</h3>
            </div>

            {/* Dialog Body */}
            <div style={{ padding: '1.5rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {dialog.message}
            </div>

            {/* Dialog Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderTop: '1px solid #eee',
              backgroundColor: '#fafafa',
            }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {dialog.cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
