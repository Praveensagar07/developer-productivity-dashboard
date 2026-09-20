import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useProjectFilters } from '../hooks/useFilters';
import { filterProjects } from '../utils/filters';
import { ProjectCard } from '../components/projects/ProjectCard';
import { EmptyState } from '../components/states/EmptyState';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  Filter,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects, tasks } = useData();
  const { filters, setFilter, resetFilters, hasActiveFilters, activeFilterCount } =
    useProjectFilters();

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Multi-criteria filtered projects
  const filteredProjects = filterProjects(projects, filters);

  // Status counts for filter chips
  const totalCount = projects.length;
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const planningCount = projects.filter((p) => p.status === 'planning').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & New Project Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Projects Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track milestones, development progress, and health metrics across active initiatives
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewProjectOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search projects by name, description, tags, or lead..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
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

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter by project status"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="active">Active ({activeCount})</option>
              <option value="planning">Planning ({planningCount})</option>
              <option value="completed">Completed ({completedCount})</option>
              <option value="on_hold">On Hold</option>
            </select>

            {/* Priority Dropdown */}
            <select
              value={filters.priority}
              onChange={(e) => setFilter('priority', e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              aria-label="Filter by project priority"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Clear ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Quick:</span>
          </span>

          <button
            onClick={() => setFilter('status', 'all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filters.status === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setFilter('status', 'active')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filters.status === 'active'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setFilter('status', 'planning')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filters.status === 'planning'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Planning ({planningCount})
          </button>

          <button
            onClick={() => setFilter('status', 'completed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filters.status === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Projects Results Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          type="projects"
          title="No projects match your filter"
          description={`No projects found matching "${filters.search || filters.status}". Try adjusting your filters or initialize a new project.`}
          actionLabel={hasActiveFilters ? 'Clear All Filters' : 'Initialize New Project'}
          onAction={hasActiveFilters ? resetFilters : () => setIsNewProjectOpen(true)}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              onSelectProject={() => {}}
            />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
    </div>
  );
};
