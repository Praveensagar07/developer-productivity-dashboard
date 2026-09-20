import { Task, Project, Activity, TaskFilterState, ProjectFilterState } from '../types';

/**
 * Filter tasks across search query, status, priority, and project ID.
 * All active criteria are combined with logical AND.
 */
export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const query = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    // Search query check
    if (query) {
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description.toLowerCase().includes(query);
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(query));
      const matchAssignee = task.assignee.name.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchTags && !matchAssignee) {
        return false;
      }
    }

    // Status check
    if (filters.status && filters.status !== 'all') {
      if (task.status !== filters.status) {
        return false;
      }
    }

    // Priority check
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) {
        return false;
      }
    }

    // Project check
    if (filters.projectId && filters.projectId !== 'all') {
      if (task.projectId !== filters.projectId) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter projects across search query, status, and priority.
 */
export function filterProjects(projects: Project[], filters: ProjectFilterState): Project[] {
  const query = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    // Search query check
    if (query) {
      const matchName = project.name.toLowerCase().includes(query);
      const matchDesc = project.description.toLowerCase().includes(query);
      const matchCategory = project.category.toLowerCase().includes(query);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(query));
      const matchLead = project.lead.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCategory && !matchTags && !matchLead) {
        return false;
      }
    }

    // Status check
    if (filters.status && filters.status !== 'all') {
      if (project.status !== filters.status) {
        return false;
      }
    }

    // Priority check
    if (filters.priority && filters.priority !== 'all') {
      if (project.priority !== filters.priority) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter activities by activity type.
 */
export function filterActivities(
  activities: Activity[],
  typeFilter: string,
  searchQuery: string = ''
): Activity[] {
  const query = searchQuery.trim().toLowerCase();

  return activities.filter((act) => {
    if (typeFilter && typeFilter !== 'all') {
      if (act.type !== typeFilter) {
        return false;
      }
    }

    if (query) {
      const matchTitle = act.title.toLowerCase().includes(query);
      const matchDesc = act.description.toLowerCase().includes(query);
      const matchUser = act.user.name.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchUser) {
        return false;
      }
    }

    return true;
  });
}
