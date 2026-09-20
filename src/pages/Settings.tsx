import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  User as UserIcon,
  RotateCcw,
  Zap,
  Check,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const {
    user,
    updateUser,
    triggerSimulatedLoading,
    triggerSimulatedError,
    resetToDefaultData,
  } = useData();
  const { addToast } = useToast();

  // Local form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [github, setGithub] = useState(user.github);
  const [bio, setBio] = useState(user.bio);

  // Notification toggles
  const [taskReminders, setTaskReminders] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      github: github.trim(),
      bio: bio.trim(),
    });
  };

  const handleSaveNotifications = () => {
    addToast({
      type: 'success',
      title: 'Preferences Updated',
      message: 'Notification preferences saved to local profile.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings & Workspace Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize interface appearance, notifications, profile details, and developer tooling
        </p>
      </div>

      {/* 1. Appearance Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred color scheme. Works automatically with system preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all text-center ${
              theme === 'light'
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/20 text-brand-900 dark:text-brand-100'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Light</p>
              <p className="text-xs text-slate-500 mt-0.5">High contrast daytime theme</p>
            </div>
            {theme === 'light' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            )}
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all text-center ${
              theme === 'dark'
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/20 text-brand-900 dark:text-brand-100'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Dark</p>
              <p className="text-xs text-slate-500 mt-0.5">Deep slate developer dark mode</p>
            </div>
            {theme === 'dark' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            )}
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all text-center ${
              theme === 'system'
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/20 text-brand-900 dark:text-brand-100'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">System</p>
              <p className="text-xs text-slate-500 mt-0.5">Match operating system preference</p>
            </div>
            {theme === 'system' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 2. Profile Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
              User Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update developer display name, internship role, and contact email
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h4>
              <p className="text-xs text-slate-500">{user.role}</p>
              <span className="inline-block mt-1 text-[11px] font-mono text-brand-600 dark:text-brand-400">
                GitHub: @{user.github}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                GitHub Handle
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Profile
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Notifications Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure activity alerts and task reminders
            </p>
          </div>
        </div>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          <label className="flex items-center justify-between pt-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Task Reminders
              </p>
              <p className="text-xs text-slate-500">
                Receive notifications when assigned task deadlines approach
              </p>
            </div>
            <input
              type="checkbox"
              checked={taskReminders}
              onChange={(e) => setTaskReminders(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="flex items-center justify-between pt-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Project Updates
              </p>
              <p className="text-xs text-slate-500">
                Notify when project milestone percentages update or change status
              </p>
            </div>
            <input
              type="checkbox"
              checked={projectUpdates}
              onChange={(e) => setProjectUpdates(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="flex items-center justify-between pt-3 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Weekly Summary Digest
              </p>
              <p className="text-xs text-slate-500">
                Send weekly sprint velocity report and velocity graphs
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>

        <div className="flex justify-end pt-3">
          <Button variant="secondary" size="sm" onClick={handleSaveNotifications}>
            Save Preferences
          </Button>
        </div>
      </section>

      {/* 4. Evaluator & Developer State Simulation Tools */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
              Interactive State Evaluation Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly trigger and verify application loading skeletons, error states, and reset data
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerSimulatedLoading(2500)}
            icon={<RotateCcw className="w-3.5 h-3.5 text-brand-500" />}
          >
            Trigger 2.5s Loading Skeleton
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              triggerSimulatedError(
                'Simulated API Service Outage: The developer telemetry proxy failed to reach the database upstream.'
              )
            }
            icon={<Zap className="w-3.5 h-3.5 text-rose-500" />}
          >
            Trigger Error State
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={resetToDefaultData}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Workspace Data
          </Button>
        </div>
      </section>
    </div>
  );
};
