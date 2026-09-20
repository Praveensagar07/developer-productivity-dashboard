import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import {
  Search,
  FolderKanban,
  CheckSquare,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';

interface CommandPaletteProps {
  onSelectTask?: (taskId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelectTask }) => {
  const { isSearchOpen, setIsSearchOpen, projects, tasks } = useData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Register Ctrl+K and Cmd+K to open
  useKeyboardShortcut('k', () => setIsSearchOpen(!isSearchOpen), 'ctrl');

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Default routes if empty
    const routes = [
      { id: 'nav-dash', type: 'page', title: 'Dashboard', subtitle: 'Overview & telemetry KPIs', path: '/' },
      { id: 'nav-proj', type: 'page', title: 'Projects', subtitle: 'All active and planning projects', path: '/projects' },
      { id: 'nav-task', type: 'page', title: 'Tasks', subtitle: 'Task backlog, sprint items & filters', path: '/tasks' },
      { id: 'nav-act', type: 'page', title: 'Activity', subtitle: 'Audit log & developer events', path: '/activity' },
      { id: 'nav-set', type: 'page', title: 'Settings', subtitle: 'Appearance & profile configuration', path: '/settings' },
    ];

    if (!q) {
      return routes.slice(0, 4);
    }

    const matchedRoutes = routes.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    );

    const matchedProjects = projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.name,
        subtitle: `${p.category} • ${p.status}`,
        project: p,
      }));

    const matchedTasks = tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .map((t) => ({
        id: t.id,
        type: 'task' as const,
        title: t.title,
        subtitle: t.status.replace('_', ' '),
        task: t,
      }));

    return [...matchedRoutes, ...matchedProjects, ...matchedTasks].slice(0, 10);
  }, [query, projects, tasks]);

  const handleSelect = (item: (typeof results)[0]) => {
    setIsSearchOpen(false);
    if (item.type === 'page' && 'path' in item) {
      navigate(item.path);
    } else if (item.type === 'project') {
      navigate('/projects');
    } else if (item.type === 'task') {
      if (onSelectTask && 'task' in item) {
        onSelectTask(item.task.id);
      } else {
        navigate('/tasks');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col animate-slide-up">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, tasks, tags, or jump to page... (Esc to close)"
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base focus:outline-none"
            aria-label="Global search command palette"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No matching results found for "{query}"
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "AI", "Vector", "Portfolio", or "Sprint"
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50/80 text-brand-900 dark:bg-brand-950/40 dark:text-brand-100'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          item.type === 'project'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : item.type === 'task'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.type === 'project' ? (
                          <FolderKanban className="w-4 h-4" />
                        ) : item.type === 'task' ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Compass className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{item.title}</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.type === 'task' && 'task' in item && (
                        <div className="hidden sm:flex items-center gap-2">
                          <StatusBadge status={item.task.status} size="sm" />
                          <PriorityBadge priority={item.task.priority} size="sm" />
                        </div>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px] mr-1">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px] mr-1">
                ↓
              </kbd>
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px] mr-1">
                ↵
              </kbd>
              to select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-500" />
            <span className="font-medium">DevPulse Global Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
