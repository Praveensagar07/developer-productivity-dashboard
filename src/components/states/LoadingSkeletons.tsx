import React from 'react';

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
    </div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6" />
    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full mb-3" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="space-y-3 w-1/2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
          </div>
        ))}
      </div>

      {/* 2-Column Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-36 mb-2" />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/80 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
};
