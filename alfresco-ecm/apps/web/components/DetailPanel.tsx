'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ---------------------------------------------------------------------------
// Keyframes injected once
// ---------------------------------------------------------------------------

let panelStylesInjected = false;
function injectPanelKeyframes() {
  if (panelStylesInjected || typeof document === 'undefined') return;
  panelStylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes alfresco-panel-slide-in {
      from { transform: translateX(100%); }
      to   { transform: translateX(0);    }
    }
    @keyframes alfresco-panel-slide-out {
      from { transform: translateX(0);    }
      to   { transform: translateX(100%); }
    }
    @keyframes alfresco-panel-overlay-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Value formatter
// ---------------------------------------------------------------------------

function formatValue(value: any): string {
  if (value === null || value === undefined) return '\u2014';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DetailPanel({
  isOpen,
  onClose,
  title,
  data,
  onEdit,
  onDelete,
}: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectPanelKeyframes();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const entries = Object.entries(data);

  return (
    <>
      {/* Overlay */}
      <div
        data-testid="detail-panel-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 30, 66, 0.54)',
          zIndex: 10000,
          animation: 'alfresco-panel-overlay-in 0.2s ease forwards',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid="detail-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '480px',
          maxWidth: '100vw',
          backgroundColor: '#FFFFFF',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          animation: 'alfresco-panel-slide-in 0.3s ease forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #DFE1E6',
            flexShrink: 0,
          }}
        >
          <h2
            data-testid="detail-panel-title"
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#172B4D',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              marginRight: '1rem',
            }}
          >
            {title}
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {onEdit && (
              <button
                data-testid="detail-panel-edit"
                onClick={onEdit}
                style={{
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  backgroundColor: '#0052CC',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0065FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0052CC';
                }}
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                data-testid="detail-panel-delete"
                onClick={onDelete}
                style={{
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  backgroundColor: '#FF5630',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#DE350B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF5630';
                }}
              >
                Delete
              </button>
            )}

            <button
              data-testid="detail-panel-close"
              onClick={onClose}
              style={{
                padding: '0.375rem 0.625rem',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: '#6B778C',
                border: '1px solid #DFE1E6',
                borderRadius: '4px',
                cursor: 'pointer',
                lineHeight: 1,
                transition: 'background-color 0.15s',
              }}
              aria-label="Close panel"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F4F5F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {'\u2715'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          data-testid="detail-panel-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
          }}
        >
          {entries.length === 0 ? (
            <p style={{ color: '#6B778C', fontSize: '0.875rem' }}>No data available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {entries.map(([key, value]) => (
                <div
                  key={key}
                  data-testid={`detail-field-${key}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.875rem 0',
                    borderBottom: '1px solid #F4F5F7',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6B778C',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: '#172B4D',
                      lineHeight: 1.5,
                      whiteSpace: typeof value === 'object' ? 'pre-wrap' : 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
