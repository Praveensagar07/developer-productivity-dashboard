import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Activity,
  Settings,
  Flame,
  X,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, projects, tasks } = useData();

  const totalProjects = projects.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: totalProjects,
    },
    {
      to: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasks,
    },
    {
      to: '/activity',
      label: 'Activity',
      icon: Activity,
      badge: undefined,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main Navigation"
      >
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
            <NavLink
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white text-lg tracking-tight group"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="leading-none font-extrabold text-base tracking-tight">DevPulse</span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  Productivity Hub
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Sidebar links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Productivity Summary Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{user.stats.streakDays}-day streak</span>
              <span className="ml-auto text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {user.stats.productivityScore}% Score
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, user.stats.productivityScore)}%` }}
              />
            </div>
          </div>

          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user.role}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
