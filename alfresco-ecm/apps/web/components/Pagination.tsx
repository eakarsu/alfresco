'use client';

import React, { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a list of page numbers / ellipses to render.
 * On small screens (maxVisible <= 5) we show fewer buttons.
 */
function buildPageRange(
  current: number,
  total: number,
  maxVisible: number = 7,
): (number | '...')[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const half = Math.floor((maxVisible - 2) / 2);

  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // Adjust when near edges
  if (current - half <= 2) {
    end = Math.min(total - 1, maxVisible - 2);
  }
  if (current + half >= total - 1) {
    start = Math.max(2, total - maxVisible + 3);
  }

  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}

// ---------------------------------------------------------------------------
// Shared button styles
// ---------------------------------------------------------------------------

const baseBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '36px',
  height: '36px',
  padding: '0 0.5rem',
  fontSize: '0.8125rem',
  fontWeight: 500,
  border: '1px solid #DFE1E6',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#FFFFFF',
  color: '#42526E',
  transition: 'all 0.15s',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pages = useMemo(
    () => buildPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div
      data-testid="pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 0',
        fontFamily: 'inherit',
      }}
    >
      {/* Left: item range info */}
      <div
        data-testid="pagination-info"
        style={{ fontSize: '0.8125rem', color: '#6B778C', whiteSpace: 'nowrap' }}
      >
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Center: page buttons */}
      <div
        data-testid="pagination-buttons"
        style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}
      >
        {/* First */}
        <button
          data-testid="pagination-first"
          onClick={() => onPageChange(1)}
          disabled={isFirst}
          style={{
            ...baseBtnStyle,
            ...(isFirst ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
          }}
          aria-label="First page"
          onMouseEnter={(e) => {
            if (!isFirst) e.currentTarget.style.backgroundColor = '#F4F5F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          &laquo;
        </button>

        {/* Prev */}
        <button
          data-testid="pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          style={{
            ...baseBtnStyle,
            ...(isFirst ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
          }}
          aria-label="Previous page"
          onMouseEnter={(e) => {
            if (!isFirst) e.currentTarget.style.backgroundColor = '#F4F5F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          &lsaquo;
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '36px',
                height: '36px',
                fontSize: '0.8125rem',
                color: '#6B778C',
              }}
            >
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              data-testid={`pagination-page-${p}`}
              onClick={() => onPageChange(p)}
              style={{
                ...baseBtnStyle,
                ...(p === currentPage
                  ? {
                      backgroundColor: '#0052CC',
                      color: '#FFFFFF',
                      borderColor: '#0052CC',
                    }
                  : {}),
              }}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              onMouseEnter={(e) => {
                if (p !== currentPage) e.currentTarget.style.backgroundColor = '#F4F5F7';
              }}
              onMouseLeave={(e) => {
                if (p !== currentPage) e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          data-testid="pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          style={{
            ...baseBtnStyle,
            ...(isLast ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
          }}
          aria-label="Next page"
          onMouseEnter={(e) => {
            if (!isLast) e.currentTarget.style.backgroundColor = '#F4F5F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          &rsaquo;
        </button>

        {/* Last */}
        <button
          data-testid="pagination-last"
          onClick={() => onPageChange(totalPages)}
          disabled={isLast}
          style={{
            ...baseBtnStyle,
            ...(isLast ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
          }}
          aria-label="Last page"
          onMouseEnter={(e) => {
            if (!isLast) e.currentTarget.style.backgroundColor = '#F4F5F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          &raquo;
        </button>
      </div>

      {/* Right: page size selector */}
      {onPageSizeChange && (
        <div
          data-testid="pagination-page-size"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            color: '#6B778C',
          }}
        >
          <label htmlFor="page-size-select">Rows per page:</label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.8125rem',
              border: '1px solid #DFE1E6',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              color: '#172B4D',
              cursor: 'pointer',
            }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
