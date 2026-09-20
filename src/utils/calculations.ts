import { Project, Task } from '../types';

export interface ProjectCalculatedStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  progressPercentage: number;
}

export interface DashboardCalculatedStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  planningProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  criticalTasks: number;
  highPriorityTasks: number;
  completionRatio: number;
  productivityScore: number;
  weeklyVelocityHours: number;
}

/**
 * Dynamically calculate project task progress metrics based on real task state.
 * Never hardcodes completion percentages.
 */
export function calculateProjectStats(projectId: string, tasks: Task[]): ProjectCalculatedStats {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const totalTasks = projectTasks.length;

  if (totalTasks === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      progressPercentage: 0,
    };
  }

  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = projectTasks.filter((t) => t.status === 'todo').length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    progressPercentage,
  };
}

/**
 * Calculate aggregate KPI metrics dynamically from the live dataset.
 */
export function calculateDashboardStats(
  projects: Project[],
  tasks: Task[],
  baseStreakDays: number = 6
): DashboardCalculatedStats {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const planningProjects = projects.filter((p) => p.status === 'planning').length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const criticalTasks = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;

  const completionRatio = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate dynamic productivity score (0-100) based on ratio, active streak, and task volume
  const ratioWeight = completionRatio * 0.6;
  const streakWeight = Math.min(baseStreakDays * 4, 25);
  const volumeBonus = Math.min(completedTasks * 1.5, 15);
  const productivityScore = Math.min(100, Math.round(ratioWeight + streakWeight + volumeBonus));

  const weeklyVelocityHours = tasks
    .filter((t) => t.status === 'done')
    .reduce((acc, t) => acc + (t.estimatedHours || 6), 0);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    planningProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    criticalTasks,
    highPriorityTasks,
    completionRatio,
    productivityScore,
    weeklyVelocityHours,
  };
}
