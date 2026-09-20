export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface UserStats {
  streakDays: number;
  completedTasksToday: number;
  weeklyHoursLogged: number;
  productivityScore: number;
  weeklyTargetTasks: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  github: string;
  bio: string;
  stats: UserStats;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  repositoryUrl?: string;
  lead: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: Assignee;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  estimatedHours?: number;
}

export type ActivityType =
  | 'task_created'
  | 'task_completed'
  | 'task_status_changed'
  | 'task_priority_changed'
  | 'project_created'
  | 'project_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  targetType: 'task' | 'project' | 'general';
  targetId?: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface TaskFilterState {
  search: string;
  status: string; // 'all' | TaskStatus
  priority: string; // 'all' | TaskPriority
  projectId: string; // 'all' | string
}

export interface ProjectFilterState {
  search: string;
  status: string; // 'all' | ProjectStatus
  priority: string; // 'all' | ProjectPriority
}

export type Theme = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}
