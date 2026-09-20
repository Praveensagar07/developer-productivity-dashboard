import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '../ui/CommandPalette';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { ErrorState } from '../states/ErrorState';
import { DashboardSkeleton } from '../states/LoadingSkeletons';
import { useData } from '../../context/DataContext';

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { isLoading, error, clearError, triggerSimulatedLoading } = useData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main App Canvas */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Simulated Error State view */}
          {error ? (
            <div className="py-8">
              <ErrorState
                title="Telemetry Pipeline Disrupted"
                message={error}
                onRetry={() => {
                  clearError();
                  triggerSimulatedLoading(1000);
                }}
                onDismiss={clearError}
              />
            </div>
          ) : isLoading ? (
            /* Global Loading State preview */
            <div className="py-4">
              <DashboardSkeleton />
            </div>
          ) : (
            /* Standard View Content */
            <Outlet context={{ onSelectTask: (id: string) => setSelectedTaskId(id) }} />
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette onSelectTask={(id) => setSelectedTaskId(id)} />

      {/* Global Task Details Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
};
