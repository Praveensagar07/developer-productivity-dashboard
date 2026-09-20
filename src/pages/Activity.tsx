import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { filterActivities } from '../utils/filters';
import { formatRelativeTime, formatDate } from '../utils/date';
import { EmptyState } from '../components/states/EmptyState';
import {
  CheckCircle2,
  CircleDot,
  FolderKanban,
  Flame,
  PlusCircle,
  Search,
  Activity as ActivityIcon,
} from 'lucide-react';

export const Activity: React.FC = () => {
  const { activities } = useData();
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = filterActivities(activities, typeFilter, searchQuery);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'task_status_changed':
        return <CircleDot className="w-4 h-4 text-brand-500" />;
      case 'task_created':
        return <PlusCircle className="w-4 h-4 text-indigo-500" />;
      case 'task_priority_changed':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'project_created':
      case 'project_updated':
        return <FolderKanban className="w-4 h-4 text-amber-500" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Audit Log & Activity
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time developer events, status changes, task closures, and project updates
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter activity by user or keyword..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter events by type"
            >
              <option value="all">All Events ({activities.length})</option>
              <option value="task_completed">Tasks Completed</option>
              <option value="task_status_changed">Status Changes</option>
              <option value="task_priority_changed">Priority Updates</option>
              <option value="task_created">New Tasks</option>
              <option value="project_created">Project Initializations</option>
              <option value="project_updated">Project Updates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Feed */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          type="activity"
          title="No activities found"
          description="No event records match your current search and type filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setTypeFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center -translate-x-1/2 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-slate-800">
                        {getEventIcon(act.type)}
                      </div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {act.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
                      <span>{formatRelativeTime(act.timestamp)}</span>
                      <span>•</span>
                      <span>{formatDate(act.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 text-xs text-slate-500">
                    <img
                      src={act.user.avatar}
                      alt={act.user.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {act.user.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
