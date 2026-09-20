import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { calculateDashboardStats } from '../utils/calculations';
import { ProjectCard } from '../components/projects/ProjectCard';
import { TaskRow } from '../components/tasks/TaskRow';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { formatRelativeTime } from '../utils/date';
import { NewTaskModal } from '../components/tasks/NewTaskModal';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Flame,
  ArrowUpRight,
  Plus,
  Sparkles,
  Zap,
  Clock,
  Target,
  ChevronRight,
  Activity as ActivityIcon,
} from 'lucide-react';

interface OutletContextType {
  onSelectTask: (id: string) => void;
}

export const Dashboard: React.FC = () => {
  const { user, projects, tasks, activities } = useData();
  const { onSelectTask } = useOutletContext<OutletContextType>();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Dynamic calculations directly from current dataset
  const stats = calculateDashboardStats(projects, tasks, user.stats.streakDays);

  // Top active projects (limit 3 for dashboard overview)
  const activeProjects = projects
    .filter((p) => p.status === 'active')
    .slice(0, 3);

  // High priority / urgent tasks for developer focus
  const focusTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* A. Welcome / Profile Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-brand-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Innovation Hacks — Week 1 Sprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name} 👋
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              You have{' '}
              <span className="font-semibold text-white">
                {stats.criticalTasks + stats.highPriorityTasks} urgent items
              </span>{' '}
              requiring engineering attention. Overall sprint velocity is at{' '}
              <span className="font-semibold text-emerald-400">{stats.completionRatio}%</span>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewTaskOpen(true)}
              icon={<Plus className="w-4 h-4 text-brand-600" />}
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-md font-semibold"
            >
              New Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewProjectOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              className="border-slate-600 text-slate-200 hover:bg-slate-800/60"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* B. Dynamic KPI Cards Grid */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Projects */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Projects
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.totalProjects}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span>{stats.planningProjects} in planning phase</span>
              </p>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Projects
              </span>
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.activeProjects}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {stats.completedProjects} completed
                </span>{' '}
                milestones
              </p>
            </div>
          </div>

          {/* Total Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Tasks
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <ListTodo className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.totalTasks}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{stats.inProgressTasks} currently in progress</span>
              </p>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed Tasks
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.completedTasks}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {stats.completionRatio}% overall completion ratio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. Productivity Summary Section */}
      <section
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm"
        aria-label="Productivity Summary"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Productivity & Engineering Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated live from active pull requests, task closures, and streak consistency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold font-mono rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
              {stats.productivityScore}/100 High Velocity
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Target className="w-4 h-4 text-brand-500" />
              <span>Today's Completed</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {user.stats.completedTasksToday}
              </span>
              <span className="text-xs text-slate-400">tasks done today</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Active Streak</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                {user.stats.streakDays}
              </span>
              <span className="text-xs text-slate-400">consecutive days</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Completion Ratio</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.completionRatio}%
              </span>
              <span className="text-xs text-slate-400">of all backlog</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Velocity Hours</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                {stats.weeklyVelocityHours}h
              </span>
              <span className="text-xs text-slate-400">shipped scope</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity mini visualization */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Weekly Task Completion Pace
            </span>
            <span className="font-mono text-slate-500">Goal: 20 tasks / week</span>
          </div>
          <ProgressBar progress={(stats.completedTasks / 20) * 100} size="sm" />
        </div>
      </section>

      {/* C. Project Progress Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Active Project Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progress calculated dynamically from completion ratio of each project's tasks
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({projects.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              onSelectProject={() => {}}
            />
          ))}
        </div>
      </section>

      {/* D & E Split: Focus Task Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D. Task Overview (Focus / Upcoming) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Priority Focus Tasks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest priority tasks pending execution
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Backlog ({stats.totalTasks - stats.completedTasks})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Task & Project</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4 hidden md:table-cell">Tags</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Due</th>
                    <th className="py-3 px-4">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {focusTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      project={projectMap.get(task.projectId)}
                      onClick={() => onSelectTask(task.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* E. Recent Activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Recent Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live team telemetry events
              </p>
            </div>
            <Link
              to="/activity"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Audit Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5 flex-shrink-0">
                    <ActivityIcon className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {act.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block font-mono">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Modals for new task / new project */}
      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
      <NewProjectModal isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)} />
    </div>
  );
};
