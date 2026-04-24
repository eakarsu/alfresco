'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log to console (replace with your logging service in production)
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          data-testid="error-boundary-fallback"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'inherit',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFEBE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                fontSize: '2rem',
                lineHeight: 1,
                color: '#FF5630',
              }}
            >
              !
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#172B4D',
            }}
          >
            Something went wrong
          </h2>

          <p
            style={{
              margin: '0 0 1.5rem 0',
              fontSize: '0.9375rem',
              color: '#6B778C',
              maxWidth: '480px',
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>

          {/* Error details (collapsed) */}
          {this.state.errorInfo && (
            <details
              style={{
                marginBottom: '1.5rem',
                width: '100%',
                maxWidth: '600px',
                textAlign: 'left',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: '#6B778C',
                  marginBottom: '0.5rem',
                }}
              >
                Error details
              </summary>
              <pre
                style={{
                  backgroundColor: '#F4F5F7',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#172B4D',
                  overflow: 'auto',
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error?.stack}
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          {/* Retry button */}
          <button
            data-testid="error-boundary-retry"
            onClick={this.handleRetry}
            style={{
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
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
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
