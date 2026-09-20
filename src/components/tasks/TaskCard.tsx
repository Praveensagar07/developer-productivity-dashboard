import React from 'react';
import { Task, Project } from '../../types';
import { StatusBadge, PriorityBadge, TagBadge } from '../ui/Badge';
import { formatDate, isOverdue } from '../../utils/date';
import { Calendar, CheckSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, project, onClick }) => {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const taskOverdue = isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-800/80 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
            {project?.name || 'Project'}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <PriorityBadge priority={task.priority} size="sm" />
            <StatusBadge status={task.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
          {task.title}
        </h4>

        {/* Short summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
          {task.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {/* Subtasks pill */}
          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <CheckSquare className="w-3.5 h-3.5 text-brand-500" />
              <span>
                {completedSubtasks}/{task.subtasks.length}
              </span>
            </div>
          )}

          {/* Due date */}
          <div
            className={`flex items-center gap-1 ${
              taskOverdue ? 'text-rose-600 dark:text-rose-400 font-medium' : ''
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>

        {/* Assignee Avatar */}
        <img
          src={task.assignee.avatar}
          alt={task.assignee.name}
          title={task.assignee.name}
          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
        />
      </div>
    </div>
  );
};
