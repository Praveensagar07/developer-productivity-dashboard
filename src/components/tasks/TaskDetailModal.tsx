import React from 'react';
import { TaskStatus, TaskPriority } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { StatusBadge, PriorityBadge, TagBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { formatDate, isOverdue } from '../../utils/date';
import {
  Calendar,
  FolderKanban,
  CheckCircle2,
  Trash2,
  Clock,
  CheckSquare,
} from 'lucide-react';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose }) => {
  const { tasks, projects, updateTaskStatus, updateTaskPriority, toggleSubtask, deleteTask } =
    useData();

  if (!taskId) return null;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const subtasksProgress =
    task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;
  const taskOverdue = isOverdue(task.dueDate) && task.status !== 'done';

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={!!taskId}
      onClose={onClose}
      title={task.title}
      size="lg"
      description={`Task in ${project?.name || 'Project'}`}
    >
      <div className="space-y-6">
        {/* Status & Priority Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                aria-label="Change task status"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <StatusBadge status={task.status} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Priority
            </label>
            <div className="flex items-center gap-2">
              <select
                value={task.priority}
                onChange={(e) => updateTaskPriority(task.id, e.target.value as TaskPriority)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                aria-label="Change task priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>

        {/* Task Summary & Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Description
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            {task.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-brand-600 dark:text-brand-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Project</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {project?.name || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div
              className={`p-2 rounded-lg ${
                taskOverdue
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
              <p
                className={`text-sm font-semibold ${
                  taskOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {formatDate(task.dueDate)} {taskOverdue && '(Overdue)'}
              </p>
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assignee</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {task.assignee.name}
              </p>
              <p className="text-[11px] text-slate-400">{task.assignee.role}</p>
            </div>
          </div>

          {/* Estimated Hours */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Time Estimate</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {task.estimatedHours || 6} hours
              </p>
            </div>
          </div>
        </div>

        {/* Subtasks Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Checklist / Subtasks
              </h4>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {completedSubtasks} of {task.subtasks.length} completed
            </span>
          </div>

          {task.subtasks.length > 0 ? (
            <>
              <ProgressBar progress={subtasksProgress} size="sm" />
              <div className="space-y-2 mt-2">
                {task.subtasks.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => toggleSubtask(task.id, sub.id)}
                      className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span
                      className={`text-sm ${
                        sub.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">No subtasks recorded for this task.</p>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <TagBadge key={tag} label={tag} />
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete Task
          </Button>

          <div className="flex items-center gap-2">
            {task.status !== 'done' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  updateTaskStatus(task.id, 'done');
                  onClose();
                }}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark as Done
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
