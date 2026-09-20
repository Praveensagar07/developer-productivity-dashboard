import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Project,
  Task,
  Activity,
  TaskStatus,
  TaskPriority,
} from '../types';
import { initialUser, initialProjects, initialTasks, initialActivities } from '../data/mockData';
import { useToast } from './ToastContext';

interface DataContextType {
  user: User;
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateTaskPriority: (taskId: string, newPriority: TaskPriority) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  createTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => Task;
  deleteTask: (taskId: string) => void;
  createProject: (newProject: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateUser: (updatedUser: Partial<User>) => void;
  resetToDefaultData: () => void;
  triggerSimulatedLoading: (durationMs?: number) => void;
  triggerSimulatedError: (message?: string) => void;
  clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'devpulse_user_data_v1',
  PROJECTS: 'devpulse_projects_data_v1',
  TASKS: 'devpulse_tasks_data_v1',
  ACTIVITIES: 'devpulse_activities_data_v1',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  const addActivity = useCallback((newAct: Omit<Activity, 'id' | 'timestamp' | 'user'>) => {
    const act: Activity = {
      ...newAct,
      id: 'act-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      user: {
        name: user.name,
        avatar: user.avatar,
      },
    };
    setActivities((prev) => [act, ...prev]);
  }, [user.name, user.avatar]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;

      const previousStatus = task.status;
      if (previousStatus === newStatus) return prev;

      const updated = prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      
      const statusLabel =
        newStatus === 'done'
          ? 'Completed'
          : newStatus === 'in_progress'
          ? 'In Progress'
          : 'To Do';

      addActivity({
        type: newStatus === 'done' ? 'task_completed' : 'task_status_changed',
        title: newStatus === 'done' ? 'Task Completed' : `Task Moved to ${statusLabel}`,
        description: `"${task.title}" updated from ${previousStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`,
        targetType: 'task',
        targetId: task.id,
      });

      addToast({
        type: newStatus === 'done' ? 'success' : 'info',
        title: `Task Status Updated`,
        message: `"${task.title}" is now ${statusLabel}`,
      });

      // Update user today's completed stats if moved to done
      if (newStatus === 'done' && previousStatus !== 'done') {
        setUser((u) => ({
          ...u,
          stats: {
            ...u.stats,
            completedTasksToday: u.stats.completedTasksToday + 1,
          },
        }));
      }

      return updated;
    });
  }, [addActivity, addToast]);

  const updateTaskPriority = useCallback((taskId: string, newPriority: TaskPriority) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task || task.priority === newPriority) return prev;

      const updated = prev.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t));

      addActivity({
        type: 'task_priority_changed',
        title: 'Priority Updated',
        description: `Changed priority of "${task.title}" to ${newPriority.toUpperCase()}`,
        targetType: 'task',
        targetId: task.id,
      });

      addToast({
        type: 'info',
        title: 'Priority Changed',
        message: `Task priority set to ${newPriority.toUpperCase()}`,
      });

      return updated;
    });
  }, [addActivity, addToast]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const updatedSubtasks = task.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        return { ...task, subtasks: updatedSubtasks };
      })
    );
  }, []);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    addActivity({
      type: 'task_created',
      title: 'New Task Created',
      description: `Added "${newTask.title}"`,
      targetType: 'task',
      targetId: newTask.id,
    });

    addToast({
      type: 'success',
      title: 'Task Created Successfully',
      message: `"${newTask.title}" added to your workspace`,
    });

    return newTask;
  }, [addActivity, addToast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;
      addToast({
        type: 'info',
        title: 'Task Deleted',
        message: `"${task.title}" was removed`,
      });
      return prev.filter((t) => t.id !== taskId);
    });
  }, [addToast]);

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    addActivity({
      type: 'project_created',
      title: 'New Project Initialized',
      description: `Created project "${newProject.name}"`,
      targetType: 'project',
      targetId: newProject.id,
    });

    addToast({
      type: 'success',
      title: 'Project Initialized',
      message: `Project "${newProject.name}" is now active`,
    });

    return newProject;
  }, [addActivity, addToast]);

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => ({
      ...prev,
      ...updated,
      stats: {
        ...prev.stats,
        ...(updated.stats || {}),
      },
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your developer profile preferences have been saved.',
    });
  }, [addToast]);

  const resetToDefaultData = useCallback(() => {
    setUser(initialUser);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setActivities(initialActivities);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Workspace data restored to default demo state.',
    });
  }, [addToast]);

  const triggerSimulatedLoading = useCallback((durationMs: number = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'info',
        title: 'Loading Finished',
        message: 'Data refreshed from telemetry cache.',
      });
    }, durationMs);
  }, [addToast]);

  const triggerSimulatedError = useCallback((message: string = 'Failed to synchronize with telemetry worker. Upstream connection timed out.') => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    addToast({
      type: 'success',
      title: 'Connection Restored',
      message: 'Reconnected to developer workspace services.',
    });
  }, [addToast]);

  return (
    <DataContext.Provider
      value={{
        user,
        projects,
        tasks,
        activities,
        isLoading,
        error,
        isSearchOpen,
        setIsSearchOpen,
        updateTaskStatus,
        updateTaskPriority,
        toggleSubtask,
        createTask,
        deleteTask,
        createProject,
        updateUser,
        resetToDefaultData,
        triggerSimulatedLoading,
        triggerSimulatedError,
        clearError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
