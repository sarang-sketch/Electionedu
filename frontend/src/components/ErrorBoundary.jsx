/**
 * @fileoverview React Error Boundary Component
 * @description Catches JavaScript errors in child component tree and displays
 * a fallback UI. Logs errors to Firebase Analytics for monitoring.
 * @author sarang-sketch
 */

import React from 'react';
import { trackEvent } from '../firebase';

/**
 * ErrorBoundary component that catches rendering errors in child components.
 * Prevents the entire app from crashing and provides a user-friendly fallback.
 * 
 * @extends React.Component
 * @example
 * <ErrorBoundary>
 *   <Quiz />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    trackEvent('error_caught', {
      error_message: error?.message || 'Unknown error',
      component_stack: errorInfo?.componentStack?.slice(0, 500) || '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Something went wrong</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            className="btn"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
