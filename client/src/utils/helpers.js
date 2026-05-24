/**
 * Format a date to a readable string such as "Jan 15, 2025".
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(date);
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date relative to now.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return 'just now';
  const parsed = new Date(date);
  const diff = Date.now() - parsed.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;
  return formatDate(parsed);
}

/**
 * Get initials from a full name.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Truncate text to a maximum length and append ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Format a tech stack array into a comma-separated string.
 * @param {string[]} techStackArray
 * @returns {string}
 */
export function formatTechStack(techStackArray) {
  if (!Array.isArray(techStackArray) || techStackArray.length === 0) {
    return 'None';
  }
  return techStackArray.join(', ');
}

/**
 * Determine whether a due date is overdue.
 * @param {Date|string|number} dueDate
 * @returns {boolean}
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

/**
 * Get the number of days remaining until an end date.
 * @param {Date|string|number} endDate
 * @returns {number}
 */
export function getDaysRemaining(endDate) {
  if (!endDate) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / msPerDay);
}

/**
 * Get the Tailwind color class for a complexity tag.
 * @param {string} complexity
 * @returns {string}
 */
export function getComplexityColor(complexity) {
  switch ((complexity || '').toLowerCase()) {
    case 'low':
      return 'bg-green-500/10 text-green-300';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-300';
    case 'high':
      return 'bg-red-500/10 text-red-300';
    default:
      return 'bg-surface-raised text-gray-300';
  }
}

/**
 * Get the Tailwind color class for a priority tag.
 * @param {string} priority
 * @returns {string}
 */
export function getPriorityColor(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'low':
      return 'bg-slate-500/10 text-slate-300';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-300';
    case 'high':
      return 'bg-orange-500/10 text-orange-300';
    case 'urgent':
      return 'bg-red-500/10 text-red-300';
    default:
      return 'bg-surface-raised text-gray-300';
  }
}

/**
 * Get the Tailwind color class for a project status.
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return 'bg-green-500/10 text-green-300';
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-300';
    case 'completed':
      return 'bg-indigo-500/10 text-indigo-300';
    default:
      return 'bg-gray-700 text-gray-300';
  }
}
