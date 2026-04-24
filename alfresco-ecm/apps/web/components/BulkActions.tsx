'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete?: () => void;
  onBulkUpdate?: () => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onClearSelection: () => void;
}

// ---------------------------------------------------------------------------
// Shared button styles
// ---------------------------------------------------------------------------

const actionBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.5rem 1rem',
  fontSize: '0.8125rem',
  fontWeight: 500,
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.15s, opacity 0.15s',
  whiteSpace: 'nowrap',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BulkActions({
  selectedCount,
  onBulkDelete,
  onBulkUpdate,
  onExportCSV,
  onExportPDF,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      data-testid="bulk-actions-toolbar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        backgroundColor: '#172B4D',
        color: '#FFFFFF',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Selected count */}
        <div
          data-testid="bulk-actions-count"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              height: '28px',
              padding: '0 0.5rem',
              backgroundColor: '#0065FF',
              borderRadius: '14px',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            {selectedCount}
          </span>
          <span>
            item{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onBulkDelete && (
            <button
              data-testid="bulk-delete"
              onClick={onBulkDelete}
              style={{
                ...actionBtnBase,
                backgroundColor: '#FF5630',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DE350B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF5630';
              }}
            >
              Delete Selected
            </button>
          )}

          {onBulkUpdate && (
            <button
              data-testid="bulk-update"
              onClick={onBulkUpdate}
              style={{
                ...actionBtnBase,
                backgroundColor: '#0052CC',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0065FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0052CC';
              }}
            >
              Update Selected
            </button>
          )}

          {onExportCSV && (
            <button
              data-testid="bulk-export-csv"
              onClick={onExportCSV}
              style={{
                ...actionBtnBase,
                backgroundColor: '#36B37E',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00875A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#36B37E';
              }}
            >
              Export CSV
            </button>
          )}

          {onExportPDF && (
            <button
              data-testid="bulk-export-pdf"
              onClick={onExportPDF}
              style={{
                ...actionBtnBase,
                backgroundColor: '#6554C0',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5243AA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6554C0';
              }}
            >
              Export PDF
            </button>
          )}

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              margin: '0 0.25rem',
            }}
          />

          <button
            data-testid="bulk-clear-selection"
            onClick={onClearSelection}
            style={{
              ...actionBtnBase,
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}
