import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if ((this as any).state.hasError) {
      let errorMessage = 'Something went wrong.';
      try {
        const parsedError = JSON.parse((this as any).state.error?.message || '');
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} during ${parsedError.operationType} at ${parsedError.path}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0c] text-white p-8 text-center">
          <h2 className="text-2xl font-black mb-4">Application Error</h2>
          <p className="text-white/60 text-sm mb-8">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs"
          >
            Reload App
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
