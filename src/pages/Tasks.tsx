import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTaskFilters } from '../hooks/useFilters';
import { filterTasks } from '../utils/filters';
import { TaskRow } from '../components/tasks/TaskRow';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { EmptyState } from '../components/states/EmptyState';
import { NewTaskModal } from '../components/tasks/NewTaskModal';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  X,
  LayoutList,
  Columns3,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface OutletContextType {
  onSelectTask: (id: string) => void;
}

export const Tasks: React.FC = () => {
  const { tasks, projects } = useData();
  const { onSelectTask } = useOutletContext<OutletContextType>();
  const { filters, setFilter, resetFilters, hasActiveFilters, activeFilterCount } =
    useTaskFilters();

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // Combined Multi-Criteria Filtering (AND condition)
  const filteredTasks = filterTasks(tasks, filters);

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  // Counts for pills
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & New Task Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sprint Backlog & Tasks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage granular work items, cross-project dependencies, and assignees
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle: List vs Kanban Board */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="List view"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="Kanban board view"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewTaskOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search tasks, descriptions, tags, assignees..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-8 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => setFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={filters.projectId}
              onChange={(e) => setFilter('projectId', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter by project"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="todo">To Do ({todoCount})</option>
              <option value="in_progress">In Progress ({inProgressCount})</option>
              <option value="done">Done ({doneCount})</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilter('priority', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Quick Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>

            <button
              onClick={() => setFilter('status', 'all')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                filters.status === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              onClick={() => setFilter('status', 'todo')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                filters.status === 'todo'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              To Do ({todoCount})
            </button>

            <button
              onClick={() => setFilter('status', 'in_progress')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                filters.status === 'in_progress'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              In Progress ({inProgressCount})
            </button>

            <button
              onClick={() => setFilter('status', 'done')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                filters.status === 'done'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Done ({doneCount})
            </button>
          </div>

          {/* Active Filter Chips & Reset */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Showing <strong className="text-slate-800 dark:text-slate-200">{filteredTasks.length}</strong> of {tasks.length} tasks
            </span>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                icon={<RotateCcw className="w-3 h-3" />}
              >
                Reset ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task Content: Empty State vs List vs Board */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          type="tasks"
          title="No tasks matching current filters"
          description={`No tasks match your combined filter criteria (Search: "${filters.search || 'None'}", Status: "${filters.status}", Priority: "${filters.priority}", Project: "${filters.projectId !== 'all' ? projectMap.get(filters.projectId)?.name : 'All'}").`}
          actionLabel={hasActiveFilters ? 'Clear All Filters' : 'Create New Task'}
          onAction={hasActiveFilters ? resetFilters : () => setIsNewTaskOpen(true)}
        />
      ) : viewMode === 'board' ? (
        <TaskBoard
          tasks={filteredTasks}
          projects={projects}
          onSelectTask={onSelectTask}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Task & Project</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tags</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Due Date</th>
                  <th className="py-3.5 px-4">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
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
      )}

      {/* Create New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        defaultProjectId={filters.projectId !== 'all' ? filters.projectId : undefined}
      />
    </div>
  );
};
