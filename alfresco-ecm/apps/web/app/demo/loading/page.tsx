'use client';

import { useState } from 'react';

// ============================================================
// Shimmer keyframes are defined via a <style> tag in the JSX
// ============================================================

function ShimmerBar({ width, height, borderRadius }: { width: string; height: string; borderRadius?: string }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: borderRadius || '4px',
      background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite ease-in-out',
    }} />
  );
}

// ============================================================
// TABLE SKELETON
// ============================================================

function TableSkeleton() {
  return (
    <div>
      {/* Header Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1rem', backgroundColor: '#f5f5f5', borderRadius: '4px 4px 0 0', borderBottom: '2px solid #ddd' }}>
        {[...Array(4)].map((_, i) => (
          <ShimmerBar key={i} width="80%" height="16px" />
        ))}
      </div>
      {/* Data Rows */}
      {[...Array(5)].map((_, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #eee' }}>
          <ShimmerBar width={`${60 + Math.random() * 30}%`} height="14px" />
          <ShimmerBar width={`${50 + Math.random() * 40}%`} height="14px" />
          <ShimmerBar width={`${40 + Math.random() * 40}%`} height="14px" />
          <ShimmerBar width={`${50 + Math.random() * 30}%`} height="14px" />
        </div>
      ))}
    </div>
  );
}

function TableReal() {
  const data = [
    { name: 'Q4 Financial Report.pdf', type: 'PDF', size: '2.4 MB', modified: '2025-01-15' },
    { name: 'Marketing Strategy.docx', type: 'Word', size: '1.1 MB', modified: '2025-01-12' },
    { name: 'Employee Handbook v3.pdf', type: 'PDF', size: '5.6 MB', modified: '2025-01-10' },
    { name: 'Budget 2025.xlsx', type: 'Excel', size: '890 KB', modified: '2025-01-08' },
    { name: 'Product Roadmap.pptx', type: 'PowerPoint', size: '3.2 MB', modified: '2025-01-05' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1rem', backgroundColor: '#f5f5f5', borderRadius: '4px 4px 0 0', borderBottom: '2px solid #ddd', fontWeight: '600', fontSize: '0.85rem', color: '#555' }}>
        <span>Name</span><span>Type</span><span>Size</span><span>Modified</span>
      </div>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #eee', fontSize: '0.9rem', color: '#333' }}>
          <span style={{ color: '#0052CC', fontWeight: '500' }}>{item.name}</span>
          <span>{item.type}</span>
          <span>{item.size}</span>
          <span>{item.modified}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// CARD SKELETON
// ============================================================

function CardSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#fff' }}>
          <ShimmerBar width="100%" height="120px" borderRadius="6px" />
          <div style={{ marginTop: '0.75rem' }}>
            <ShimmerBar width="75%" height="16px" />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <ShimmerBar width="50%" height="12px" />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <ShimmerBar width="60px" height="24px" borderRadius="12px" />
            <ShimmerBar width="50px" height="24px" borderRadius="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CardReal() {
  const cards = [
    { title: 'Engineering Docs', count: '234 files', tags: ['Active', 'Shared'] },
    { title: 'HR Policies', count: '45 files', tags: ['Published'] },
    { title: 'Marketing Assets', count: '1,203 files', tags: ['Active', 'Large'] },
    { title: 'Legal Contracts', count: '89 files', tags: ['Restricted'] },
    { title: 'Finance Reports', count: '567 files', tags: ['Active'] },
    { title: 'Product Specs', count: '123 files', tags: ['Draft', 'Review'] },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {cards.map((card, i) => (
        <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#fff', cursor: 'pointer' }}>
          <div style={{
            width: '100%',
            height: '120px',
            backgroundColor: ['#E3F2FD', '#E8F5E9', '#FFF3E0', '#FCE4EC', '#F3E5F5', '#E0F7FA'][i],
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
          }}>
            {['📁', '📋', '🎨', '📄', '💰', '🔧'][i]}
          </div>
          <h4 style={{ margin: '0.75rem 0 0.25rem', color: '#333' }}>{card.title}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{card.count}</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {card.tags.map(tag => (
              <span key={tag} style={{
                padding: '0.2rem 0.6rem',
                backgroundColor: '#E3F2FD',
                color: '#1565C0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// DETAIL SKELETON
// ============================================================

function DetailSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      {/* Left: thumbnail */}
      <div style={{ flexShrink: 0 }}>
        <ShimmerBar width="180px" height="220px" borderRadius="8px" />
      </div>
      {/* Right: details */}
      <div style={{ flex: 1 }}>
        <ShimmerBar width="60%" height="24px" />
        <div style={{ marginTop: '0.75rem' }}>
          <ShimmerBar width="40%" height="14px" />
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ShimmerBar width="100px" height="14px" />
              <ShimmerBar width={`${40 + Math.random() * 40}%`} height="14px" />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
          <ShimmerBar width="100px" height="36px" borderRadius="4px" />
          <ShimmerBar width="100px" height="36px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
}

function DetailReal() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <div style={{
        width: '180px',
        height: '220px',
        backgroundColor: '#E3F2FD',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        flexShrink: 0,
      }}>
        📄
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', color: '#333' }}>Q4 Financial Report 2024.pdf</h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#666' }}>Version 3.2 - Last updated by Jane Smith</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'Type', value: 'PDF Document' },
            { label: 'Size', value: '2.4 MB' },
            { label: 'Created', value: 'December 15, 2024' },
            { label: 'Modified', value: 'January 15, 2025' },
            { label: 'Owner', value: 'Jane Smith' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
              <span style={{ width: '100px', color: '#666', fontWeight: '500' }}>{item.label}</span>
              <span style={{ color: '#333' }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Download</button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Share</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM SKELETON
// ============================================================

function FormSkeleton() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <ShimmerBar width="30%" height="12px" />
            <div style={{ marginTop: '0.5rem' }}>
              <ShimmerBar width="100%" height="40px" borderRadius="4px" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <ShimmerBar width="20%" height="12px" />
        <div style={{ marginTop: '0.5rem' }}>
          <ShimmerBar width="100%" height="100px" borderRadius="4px" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <ShimmerBar width="120px" height="40px" borderRadius="4px" />
        <ShimmerBar width="100px" height="40px" borderRadius="4px" />
      </div>
    </div>
  );
}

function FormReal() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Document Title', value: 'Q4 Financial Report' },
          { label: 'Author', value: 'Jane Smith' },
          { label: 'Department', value: 'Finance' },
          { label: 'Classification', value: 'Confidential' },
        ].map(field => (
          <div key={field.label}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#555', marginBottom: '0.5rem' }}>{field.label}</label>
            <input
              type="text"
              defaultValue={field.value}
              style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#555', marginBottom: '0.5rem' }}>Description</label>
        <textarea
          defaultValue="Quarterly financial performance report for Q4 2024 including revenue, expenses, and projections."
          rows={4}
          style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={{ padding: '0.6rem 1.25rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Save Changes</button>
        <button style={{ padding: '0.6rem 1.25rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

type SectionKey = 'table' | 'card' | 'detail' | 'form';

export default function LoadingDemoPage() {
  const [loadingState, setLoadingState] = useState<Record<SectionKey, 'idle' | 'loading' | 'loaded'>>({
    table: 'idle',
    card: 'idle',
    detail: 'idle',
    form: 'idle',
  });

  const loadSection = (section: SectionKey) => {
    setLoadingState(prev => ({ ...prev, [section]: 'loading' }));
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, [section]: 'loaded' }));
    }, 2000);
  };

  const resetSection = (section: SectionKey) => {
    setLoadingState(prev => ({ ...prev, [section]: 'idle' }));
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e0e0e0',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Loading Skeleton Demo
        </h1>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          Each section shows a shimmer skeleton animation for 2 seconds before revealing the real content. Click &quot;Load Data&quot; to see the skeleton, then the data loads in.
        </p>
      </header>

      {/* Table Skeleton */}
      <div style={sectionStyle}>
        <div style={headerRowStyle}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#333' }}>Table Skeleton</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {loadingState.table !== 'loading' && (
              <button
                onClick={() => loadSection('table')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {loadingState.table === 'loaded' ? 'Reload' : 'Load Data'}
              </button>
            )}
            {loadingState.table === 'loaded' && (
              <button
                onClick={() => resetSection('table')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reset
              </button>
            )}
            {loadingState.table === 'loading' && (
              <span style={{ fontSize: '0.85rem', color: '#666', padding: '0.5rem 0' }}>Loading...</span>
            )}
          </div>
        </div>
        {loadingState.table === 'idle' && <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Click &quot;Load Data&quot; to see the table skeleton</p>}
        {loadingState.table === 'loading' && <TableSkeleton />}
        {loadingState.table === 'loaded' && <TableReal />}
      </div>

      {/* Card Skeleton */}
      <div style={sectionStyle}>
        <div style={headerRowStyle}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#333' }}>Card Skeleton</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {loadingState.card !== 'loading' && (
              <button
                onClick={() => loadSection('card')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {loadingState.card === 'loaded' ? 'Reload' : 'Load Data'}
              </button>
            )}
            {loadingState.card === 'loaded' && (
              <button
                onClick={() => resetSection('card')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reset
              </button>
            )}
            {loadingState.card === 'loading' && (
              <span style={{ fontSize: '0.85rem', color: '#666', padding: '0.5rem 0' }}>Loading...</span>
            )}
          </div>
        </div>
        {loadingState.card === 'idle' && <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Click &quot;Load Data&quot; to see the card skeleton</p>}
        {loadingState.card === 'loading' && <CardSkeleton />}
        {loadingState.card === 'loaded' && <CardReal />}
      </div>

      {/* Detail Skeleton */}
      <div style={sectionStyle}>
        <div style={headerRowStyle}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#333' }}>Detail Panel Skeleton</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {loadingState.detail !== 'loading' && (
              <button
                onClick={() => loadSection('detail')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {loadingState.detail === 'loaded' ? 'Reload' : 'Load Data'}
              </button>
            )}
            {loadingState.detail === 'loaded' && (
              <button
                onClick={() => resetSection('detail')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reset
              </button>
            )}
            {loadingState.detail === 'loading' && (
              <span style={{ fontSize: '0.85rem', color: '#666', padding: '0.5rem 0' }}>Loading...</span>
            )}
          </div>
        </div>
        {loadingState.detail === 'idle' && <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Click &quot;Load Data&quot; to see the detail skeleton</p>}
        {loadingState.detail === 'loading' && <DetailSkeleton />}
        {loadingState.detail === 'loaded' && <DetailReal />}
      </div>

      {/* Form Skeleton */}
      <div style={sectionStyle}>
        <div style={headerRowStyle}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#333' }}>Form Skeleton</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {loadingState.form !== 'loading' && (
              <button
                onClick={() => loadSection('form')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {loadingState.form === 'loaded' ? 'Reload' : 'Load Data'}
              </button>
            )}
            {loadingState.form === 'loaded' && (
              <button
                onClick={() => resetSection('form')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reset
              </button>
            )}
            {loadingState.form === 'loading' && (
              <span style={{ fontSize: '0.85rem', color: '#666', padding: '0.5rem 0' }}>Loading...</span>
            )}
          </div>
        </div>
        {loadingState.form === 'idle' && <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Click &quot;Load Data&quot; to see the form skeleton</p>}
        {loadingState.form === 'loading' && <FormSkeleton />}
        {loadingState.form === 'loaded' && <FormReal />}
      </div>
    </div>
  );
}
