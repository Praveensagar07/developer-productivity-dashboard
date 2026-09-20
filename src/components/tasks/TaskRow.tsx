import React from 'react';
import { Task, Project, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge, TagBadge } from '../ui/Badge';
import { formatDate, isOverdue } from '../../utils/date';
import { useData } from '../../context/DataContext';
import { CheckCircle2, Circle, Clock, CheckSquare } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  project?: Project;
  onClick: () => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, project, onClick }) => {
  const { updateTaskStatus } = useData();
  const taskOverdue = isOverdue(task.dueDate) && task.status !== 'done';
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    updateTaskStatus(task.id, nextStatus);
  };

  return (
    <tr
      onClick={onClick}
      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/80 last:border-b-0"
    >
      {/* Quick completion toggle & Title */}
      <td className="py-3.5 px-4">
        <div className="flex items-start gap-3 min-w-[220px]">
          <button
            onClick={handleToggleDone}
            className="mt-0.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex-shrink-0"
            aria-label={task.status === 'done' ? 'Mark task todo' : 'Mark task done'}
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : task.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-indigo-500" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-400" />
            )}
          </button>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold truncate ${
                task.status === 'done'
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors'
              }`}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {project?.name}
              </span>
              {task.subtasks.length > 0 && (
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {completedSubtasks}/{task.subtasks.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <StatusBadge status={task.status} />
      </td>

      {/* Priority Badge */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Tags */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {task.tags.slice(0, 2).map((t) => (
            <TagBadge key={t} label={t} />
          ))}
          {task.tags.length > 2 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Due Date */}
      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">
        <span className={taskOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}>
          {formatDate(task.dueDate)}
        </span>
      </td>

      {/* Assignee */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <span className="text-xs text-slate-700 dark:text-slate-300 hidden lg:inline-block">
            {task.assignee.name}
          </span>
        </div>
      </td>
    </tr>
  );
};
