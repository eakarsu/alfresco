'use client';

import React, { useEffect } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkeletonVariant = 'table' | 'card' | 'detail' | 'form';

export interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  rows?: number;
  columns?: number;
}

// ---------------------------------------------------------------------------
// Keyframes injected once
// ---------------------------------------------------------------------------

let shimmerInjected = false;
function injectShimmer() {
  if (shimmerInjected || typeof document === 'undefined') return;
  shimmerInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes alfresco-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0;  }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #F4F5F7 25%, #EBECF0 37%, #F4F5F7 63%)',
  backgroundSize: '600px 100%',
  animation: 'alfresco-shimmer 1.4s ease infinite',
  borderRadius: '4px',
};

function SkeletonBox({
  width = '100%',
  height = '16px',
  borderRadius,
  style,
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-testid="skeleton-box"
      style={{
        ...shimmerStyle,
        width,
        height,
        ...(borderRadius ? { borderRadius } : {}),
        ...style,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Table variant
// ---------------------------------------------------------------------------

function TableSkeleton({ rows = 5, columns = 4 }: { rows: number; columns: number }) {
  return (
    <div data-testid="skeleton-table" style={{ width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
          padding: '0.875rem 1rem',
          borderBottom: '2px solid #DFE1E6',
        }}
      >
        {Array.from({ length: columns }).map((_, ci) => (
          <SkeletonBox key={ci} height="14px" width="70%" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div
          key={ri}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
            padding: '0.875rem 1rem',
            borderBottom: '1px solid #F4F5F7',
          }}
        >
          {Array.from({ length: columns }).map((_, ci) => (
            <SkeletonBox
              key={ci}
              height="14px"
              width={ci === 0 ? '90%' : `${55 + ((ci * 13) % 30)}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card variant
// ---------------------------------------------------------------------------

function CardSkeleton({ rows = 2, columns = 3 }: { rows: number; columns: number }) {
  return (
    <div
      data-testid="skeleton-card"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {Array.from({ length: rows * columns }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRadius: '8px',
            border: '1px solid #DFE1E6',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <SkeletonBox height="120px" borderRadius="4px" />
          <SkeletonBox height="16px" width="70%" />
          <SkeletonBox height="12px" width="50%" />
          <SkeletonBox height="12px" width="85%" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail variant
// ---------------------------------------------------------------------------

function DetailSkeleton({ rows = 6 }: { rows: number }) {
  return (
    <div data-testid="skeleton-detail" style={{ width: '100%', maxWidth: '640px' }}>
      {/* Title */}
      <SkeletonBox height="28px" width="45%" style={{ marginBottom: '0.5rem' }} />
      <SkeletonBox height="14px" width="25%" style={{ marginBottom: '2rem' }} />

      {/* Key-value pairs */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '0.875rem 0',
            borderBottom: '1px solid #F4F5F7',
          }}
        >
          <SkeletonBox height="14px" width="120px" />
          <SkeletonBox height="14px" width={`${40 + ((i * 17) % 35)}%`} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form variant
// ---------------------------------------------------------------------------

function FormSkeleton({ rows = 4 }: { rows: number }) {
  return (
    <div
      data-testid="skeleton-form"
      style={{
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonBox height="12px" width="100px" />
          <SkeletonBox height="38px" width="100%" borderRadius="4px" />
        </div>
      ))}

      {/* Submit button area */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <SkeletonBox height="38px" width="120px" borderRadius="4px" />
        <SkeletonBox height="38px" width="90px" borderRadius="4px" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LoadingSkeleton({
  variant = 'table',
  rows = 5,
  columns = 4,
}: LoadingSkeletonProps) {
  useEffect(() => {
    injectShimmer();
  }, []);

  switch (variant) {
    case 'table':
      return <TableSkeleton rows={rows} columns={columns} />;
    case 'card':
      return <CardSkeleton rows={rows} columns={columns} />;
    case 'detail':
      return <DetailSkeleton rows={rows} />;
    case 'form':
      return <FormSkeleton rows={rows} />;
    default:
      return <TableSkeleton rows={rows} columns={columns} />;
  }
}
