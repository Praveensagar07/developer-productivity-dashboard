import React from 'react';
import { TaskStatus, TaskPriority, ProjectStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  CircleDot,
  AlertCircle,
  Flame,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus | ProjectStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  switch (status) {
    case 'done':
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{status === 'done' ? 'Done' : 'Completed'}</span>
        </span>
      );
    case 'in_progress':
    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50 ${sizeClasses}`}
        >
          <CircleDot className="w-3.5 h-3.5 animate-pulse" />
          <span>{status === 'in_progress' ? 'In Progress' : 'Active'}</span>
        </span>
      );
    case 'todo':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>To Do</span>
        </span>
      );
    case 'planning':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50 ${sizeClasses}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planning</span>
        </span>
      );
    case 'on_hold':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50 ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>On Hold</span>
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  switch (priority) {
    case 'critical':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 ${sizeClasses}`}
        >
          <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Critical</span>
        </span>
      );
    case 'high':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50 ${sizeClasses}`}
        >
          <ArrowUp className="w-3 h-3 text-orange-600 dark:text-orange-400" />
          <span>High</span>
        </span>
      );
    case 'medium':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50 ${sizeClasses}`}
        >
          <ArrowRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Medium</span>
        </span>
      );
    case 'low':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 ${sizeClasses}`}
        >
          <ArrowDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span>Low</span>
        </span>
      );
    default:
      return null;
  }
};

interface TagBadgeProps {
  label: string;
  onClick?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ label, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center text-[11px] font-medium font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/80 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700' : ''
      }`}
    >
      #{label}
    </span>
  );
};
