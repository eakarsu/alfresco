'use client';

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';

// ============================================================
// Inline ErrorBoundary class component
// ============================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          backgroundColor: '#FFF5F5',
          border: '2px solid #FF5252',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          {/* Error Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FF5252',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem',
          }}>
            !
          </div>

          <h3 style={{ color: '#D32F2F', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
            Something went wrong
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {this.props.fallbackTitle || 'An unexpected error occurred in this section.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              onClick={this.resetError}
              style={{
                padding: '0.6rem 1.25rem',
                backgroundColor: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.toggleDetails}
              style={{
                padding: '0.6rem 1.25rem',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              {this.state.showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {/* Collapsible Error Details */}
          {this.state.showDetails && this.state.error && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fff',
              border: '1px solid #ffcdd2',
              borderRadius: '6px',
              textAlign: 'left',
              overflowX: 'auto',
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#D32F2F' }}>Error: </strong>
                <span style={{ color: '#333' }}>{this.state.error.message}</span>
              </div>
              {this.state.error.stack && (
                <pre style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#666',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  padding: '0.75rem',
                  borderRadius: '4px',
                }}>
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================
// Buggy components that crash on demand
// ============================================================

function BuggyCounter({ label }: { label: string }) {
  const [count, setCount] = useState(0);

  if (count === 3) {
    throw new Error(`${label} crashed! The counter reached 3, which is an invalid state. This is a simulated runtime error to demonstrate ErrorBoundary behavior.`);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#333' }}>{count}</p>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Click 3 times to trigger an error</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '0.6rem 1.25rem',
          backgroundColor: '#0052CC',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Count: {count} (click me)
      </button>
    </div>
  );
}

function BuggyButton() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('BuggyButton crashed! The user clicked the "Crash" button. This simulates an unhandled exception in a child component.');
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Click the button below to cause this section to crash</p>
      <button
        onClick={() => setShouldCrash(true)}
        style={{
          padding: '0.6rem 1.25rem',
          backgroundColor: '#FF5252',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
        }}
      >
        Crash This Section
      </button>
    </div>
  );
}

function BuggyDataLoader() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate a data parsing error
      throw new Error('BuggyDataLoader crashed! Failed to parse API response: unexpected token "<" at position 0. The server returned HTML instead of JSON.');
    }, 500);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
        Simulates a data loading failure that throws during render
      </p>
      {loading ? (
        <p style={{ color: '#0052CC' }}>Loading data...</p>
      ) : data ? (
        <p>{data}</p>
      ) : (
        <button
          onClick={loadData}
          style={{
            padding: '0.6rem 1.25rem',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Load Data (will crash)
        </button>
      )}
    </div>
  );
}

function StableComponent() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
        This component works normally and is not affected by crashes in other sections.
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50', margin: '0.5rem 0' }}>{count}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '0.6rem 1.25rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Increment (safe)
      </button>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function ErrorsDemoPage() {
  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e0e0e0',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Error Boundary Demo
        </h1>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          Each section below is wrapped in its own ErrorBoundary. When a component crashes, only that section shows the error fallback UI. Other sections remain unaffected.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Section 1: Counter crash */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Counter (crashes at 3)</h3>
          <ErrorBoundary fallbackTitle="The counter component encountered an error at count 3.">
            <BuggyCounter label="Counter A" />
          </ErrorBoundary>
        </div>

        {/* Section 2: Button crash */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Crash Button</h3>
          <ErrorBoundary fallbackTitle="The button component threw an intentional error.">
            <BuggyButton />
          </ErrorBoundary>
        </div>

        {/* Section 3: Data loader crash */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Data Loader (async crash)</h3>
          <ErrorBoundary fallbackTitle="The data loader failed to parse the API response.">
            <BuggyDataLoader />
          </ErrorBoundary>
        </div>

        {/* Section 4: Stable component */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Stable Component (no crash)</h3>
          <ErrorBoundary fallbackTitle="Something unexpected happened.">
            <StableComponent />
          </ErrorBoundary>
        </div>
      </div>

      {/* Info Section */}
      <div style={{
        backgroundColor: '#E3F2FD',
        border: '1px solid #90CAF9',
        borderRadius: '8px',
        padding: '1.5rem',
      }}>
        <h3 style={{ color: '#1565C0', marginBottom: '0.75rem', fontSize: '1.1rem' }}>How It Works</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '1.5rem', margin: 0 }}>
          <li>Each section is wrapped in an independent <code style={{ backgroundColor: '#fff', padding: '0.15rem 0.4rem', borderRadius: '3px', fontSize: '0.85rem' }}>ErrorBoundary</code> component</li>
          <li>When a child component throws an error, only that section&apos;s ErrorBoundary catches it</li>
          <li>The fallback UI shows an error icon, message, and collapsible error details</li>
          <li>Clicking &quot;Try Again&quot; resets the boundary and re-mounts the child component</li>
          <li>Other sections remain fully functional and interactive</li>
          <li>The &quot;Stable Component&quot; section demonstrates that unrelated components are unaffected</li>
        </ul>
      </div>
    </div>
  );
}
