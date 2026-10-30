import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';

// Function component so the message follows the visitor's language (it was Uzbek-only)
const ErrorFallback = ({ error }: { error?: Error }) => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background text-foreground">
      <div className="max-w-md p-8 glass rounded-2xl border border-red-500/30 bg-red-500/5">
        <h1 className="text-3xl font-bold text-red-500 mb-4">{t('error_title')}</h1>
        <p className="text-foreground/70 mb-6">{t('error_text')}</p>
        <div className="flex gap-4">
          <Button
            variant="solid"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            {t('error_reload')}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            {t('error_home')}
          </Button>
        </div>
        {/* Show error details only in development */}
        {import.meta.env.DEV && error && (
          <div className="mt-6 text-left p-4 bg-black/50 rounded-lg overflow-x-auto text-red-400 text-xs font-mono">
            {error.toString()}
          </div>
        )}
      </div>
    </div>
  );
};

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
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
