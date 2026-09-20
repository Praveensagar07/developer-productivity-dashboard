import React from 'react';
import { SearchX, FolderKanban, CheckSquare, Activity, LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  type?: 'search' | 'tasks' | 'projects' | 'activity' | 'custom';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'custom',
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  className = '',
}) => {
  // Default presets
  const config = {
    search: {
      icon: SearchX,
      title: 'No search results found',
      description:
        'We couldn’t find any items matching your active search keywords and filters. Try adjusting your filters or search term.',
      actionLabel: 'Reset Filters',
    },
    tasks: {
      icon: CheckSquare,
      title: 'No tasks found',
      description:
        'There are no tasks matching your selected filters or no tasks currently assigned in this category.',
      actionLabel: 'Create New Task',
    },
    projects: {
      icon: FolderKanban,
      title: 'No projects found',
      description:
        'No projects found matching the current criteria. Start a new project or adjust your status filters.',
      actionLabel: 'Initialize Project',
    },
    activity: {
      icon: Activity,
      title: 'No activity recorded yet',
      description:
        'Activity timeline will automatically populate as your team completes tasks, pushes commits, and updates projects.',
      actionLabel: undefined,
    },
    custom: {
      icon: CustomIcon || FolderKanban,
      title: title || 'No items available',
      description: description || 'There is no data to display at this time.',
      actionLabel: actionLabel,
    },
  }[type];

  const IconComponent = CustomIcon || config.icon;
  const finalTitle = title || config.title;
  const finalDesc = description || config.description;
  const finalActionLabel = actionLabel || config.actionLabel;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 max-w-sm">
        {finalTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md">
        {finalDesc}
      </p>
      {finalActionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {finalActionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
