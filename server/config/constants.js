/**
 * Application Constants
 * ============================================================================
 * Centralized enumerations and configuration constants used across models,
 * controllers, and services.
 * 
 * Maintaining centralized constants establishes a Single Source of Truth (SSOT),
 * preventing bugs caused by magic strings, typos, or casing inconsistencies
 * in database queries and validations, while offering reliable IDE autocomplete.
 * ============================================================================
 */

/**
 * Valid lifecycle states for a Project.
 */
const PROJECT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

/**
 * Valid workflow columns/states for Kanban tasks.
 */
const TASK_STATUS = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  CODE_REVIEW: 'Code Review',
  DONE: 'Done',
};

/**
 * Algorithmic complexity annotations for engineering tasks.
 */
const COMPLEXITY = {
  O_1: 'O(1)',
  O_LOG_N: 'O(log n)',
  O_N: 'O(n)',
  O_N_LOG_N: 'O(n log n)',
  O_N_2: 'O(n²)',
};

/**
 * Priority levels for task triage and execution order.
 */
const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

module.exports = {
  PROJECT_STATUS,
  TASK_STATUS,
  COMPLEXITY,
  PRIORITY,
};
