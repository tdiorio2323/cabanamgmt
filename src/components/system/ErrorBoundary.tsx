'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import LiquidButton from '@/components/ui/LiquidButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, this would be sent to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <GlassCard className="max-w-lg w-full p-8 text-center">
            <h1 className="text-2xl font-display font-bold mb-4 text-ink">
              Something went wrong
            </h1>
            <p className="text-ink/70 mb-6">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-red-50 rounded-lg">
                <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <LiquidButton onClick={this.handleReset}>Try Again</LiquidButton>
              <LiquidButton onClick={() => (window.location.href = '/')}>
                Go Home
              </LiquidButton>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
