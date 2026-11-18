import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let message = error.message || 'An unexpected error occurred.';
    try {
      const parsed = JSON.parse(message) as { error?: string; path?: string };
      if (parsed.error) {
        message = `${parsed.error}${parsed.path ? ` (${parsed.path})` : ''}`;
      }
    } catch {
      // Plain error message
    }
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Workspace Error</span>
            </div>
            <h1 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Something interrupted your session
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
