import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background text-foreground">
          <div className="max-w-md p-8 glass rounded-2xl border border-red-500/30 bg-red-500/5">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Nimadir xato ketdi.</h1>
            <p className="text-foreground/70 mb-6">
              Kechirasiz, saytda kutilmagan xatolik yuz berdi. Iltimos, sahifani yangilang yoki Bosh sahifaga qayting.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="solid" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Yangilash
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Bosh sahifa
              </Button>
            </div>
            {/* Show error details only in development */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 text-left p-4 bg-black/50 rounded-lg overflow-x-auto text-red-400 text-xs font-mono">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
