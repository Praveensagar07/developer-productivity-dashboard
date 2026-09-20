import React from 'react';
import { Project, Task } from '../../types';
import { calculateProjectStats } from '../../utils/calculations';
import { formatDate, isOverdue } from '../../utils/date';
import { StatusBadge, PriorityBadge, TagBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Calendar, CheckCircle, ListTodo, GitBranch } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onSelectProject?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  onSelectProject,
}) => {
  // Dynamically calculate progress metrics from task data
  const stats = calculateProjectStats(project.id, tasks);
  const projectOverdue = isOverdue(project.dueDate) && project.status !== 'completed';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-800/80 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} size="sm" />
            <PriorityBadge priority={project.priority} size="sm" />
          </div>
        </div>

        {/* Project Title */}
        <h3
          onClick={() => onSelectProject && onSelectProject(project.id)}
          className={`text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors ${
            onSelectProject ? 'cursor-pointer' : ''
          }`}
        >
          {project.name}
        </h3>

        {/* Project Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Dynamic Progress Metric Section */}
        <div className="mt-5 space-y-2 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {stats.completedTasks} of {stats.totalTasks} tasks complete
              </span>
            </div>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-100">
              {stats.progressPercentage}%
            </span>
          </div>

          <ProgressBar progress={stats.progressPercentage} size="md" />

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            <span>{stats.inProgressTasks} in progress</span>
            <span>{stats.todoTasks} todo</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
          {project.tags.length > 4 && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center">
              +{project.tags.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={projectOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}>
            Due {formatDate(project.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
              title="View Git Repository"
              aria-label={`View ${project.name} Git repository`}
            >
              <GitBranch className="w-4 h-4" />
            </a>
          )}
          {onSelectProject && (
            <button
              onClick={() => onSelectProject(project.id)}
              className="font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
