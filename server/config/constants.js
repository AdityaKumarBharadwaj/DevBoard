/**
 * Application constants for enums and configuration
 * Centralized definitions used across models and controllers
 */

// Project status values
const PROJECT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

// Task status values (workflow states)
const TASK_STATUS = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  CODE_REVIEW: 'Code Review',
  DONE: 'Done',
};

// Task complexity values
const COMPLEXITY = {
  O_1: 'O(1)',
  O_LOG_N: 'O(log n)',
  O_N: 'O(n)',
  O_N_LOG_N: 'O(n log n)',
  O_N_2: 'O(n²)',
};

// Task priority values
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