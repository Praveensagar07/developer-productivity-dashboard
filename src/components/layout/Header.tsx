import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  Sparkles,
  RotateCw,
  AlertOctagon,
  Check,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const {
    user,
    activities,
    setIsSearchOpen,
    triggerSimulatedLoading,
    triggerSimulatedError,
    error,
    clearError,
  } = useData();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (devRef.current && !devRef.current.contains(e.target as Node)) {
        setShowDevMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute page title from route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/projects':
        return 'Projects';
      case '/tasks':
        return 'Tasks';
      case '/activity':
        return 'Recent Activity';
      case '/settings':
        return 'Settings';
      default:
        return 'Developer Productivity';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Nav Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center/Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-brand-400 dark:hover:border-brand-600 transition-all shadow-inner"
            aria-label="Search dashboard"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search projects, tasks, tags...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open global search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dev Demo State Switcher */}
          <div className="relative" ref={devRef}>
            <button
              onClick={() => setShowDevMenu(!showDevMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
              title="Test simulated states"
              aria-label="Open developer state tools"
            >
              <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline">Demo States</span>
            </button>

            {showDevMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span>Interactive States</span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowDevMenu(false);
                      triggerSimulatedLoading(2000);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <RotateCw className="w-4 h-4 text-brand-500" />
                    <span>Simulate Loading State (2s)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDevMenu(false);
                      if (error) {
                        clearError();
                      } else {
                        triggerSimulatedError(
                          'Telemetry Worker Failure: Unable to fetch live pipeline events from the upstream service.'
                        );
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    <span>{error ? 'Clear Error State' : 'Simulate Error State'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Notifications
                  </h3>
                  <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recent events
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
