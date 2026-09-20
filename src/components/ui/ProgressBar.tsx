import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  className = '',
  animate = true,
}) => {
  // Clamp value between 0 and 100
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  // Dynamic color tone based on completion stage
  const getFillColor = (value: number) => {
    if (value === 100) return 'bg-emerald-500 dark:bg-emerald-400';
    if (value >= 60) return 'bg-brand-500 dark:bg-brand-400';
    if (value >= 25) return 'bg-indigo-500 dark:bg-indigo-400';
    return 'bg-amber-500 dark:bg-amber-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-medium text-slate-600 dark:text-slate-400">Progress</span>
          <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
            {clamped}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${clamped}%`}
        className={`w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses}`}
      >
        <div
          className={`${heightClasses} rounded-full ${getFillColor(
            clamped
          )} ${animate ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
