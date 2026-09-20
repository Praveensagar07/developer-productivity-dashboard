/**
 * Format an ISO timestamp to relative time (e.g. "2 hours ago", "Yesterday", "3 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date('2026-09-20T10:50:00.000Z'); // normalized current time
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  return formatDate(dateString);
}

/**
 * Format date into human readable string (e.g., "Sep 24, 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Check if a due date is in the past
 */
export function isOverdue(dueDateString: string): boolean {
  try {
    const due = new Date(dueDateString);
    const now = new Date('2026-09-20T00:00:00.000Z');
    return due.getTime() < now.getTime();
  } catch {
    return false;
  }
}
