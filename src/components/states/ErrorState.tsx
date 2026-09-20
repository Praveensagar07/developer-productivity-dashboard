import React from 'react';
import { AlertOctagon, RotateCw, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while synchronizing developer telemetry data. This could be due to a temporary network blip or service interruption.',
  onRetry,
  onDismiss,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 shadow-sm">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-rose-950 dark:text-rose-200 max-w-sm">
        {title}
      </h3>
      <p className="text-sm text-rose-700/80 dark:text-rose-300/80 mt-2 max-w-md">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {onRetry && (
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            icon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            icon={<Check className="w-3.5 h-3.5" />}
          >
            Dismiss Alert
          </Button>
        )}
      </div>
    </div>
  );
};
