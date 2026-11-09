/**
 * TaskCard Component
 * ============================================================================
 * Renders an individual draggable task card within a Kanban column.
 * Integrates with @dnd-kit/sortable to support drag interactions, animations,
 * and visual states. Displays task metadata including priority badge, complexity,
 * due date, labels, estimated hours, and edit/delete actions.
 * ============================================================================
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Tag, GripVertical, Trash2, ChevronRight } from 'lucide-react';

/**
 * TaskCard Component
 * 
 * @param {Object} props
 * @param {Object} props.task - Task record details.
 * @param {Function} props.onEdit - Callback invoked when clicking the title or edit action.
 * @param {Function} props.onDelete - Callback invoked when clicking the delete button.
 * @returns {JSX.Element|null}
 */
export default function TaskCard({ task, onEdit, onDelete }) {
  const taskId = task?._id || task?.id || 'temp-id';
  
  // Sortable hook supplies drag listeners, refs, transform styles, and dragging state
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: taskId,
  });

  // Dynamic CSS transform and reduced opacity during active drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!task) return null;

  /**
   * Resolve color palette and label for task priority levels.
   * 
   * @param {string} priority - Priority value ('critical', 'high', 'medium', 'low').
   * @returns {{ bg: string, text: string, label: string }}
   */
  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Critical' },
      high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'High' },
      medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Medium' },
      low: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Low' },
    };
    return configs[priority?.toLowerCase()] || configs.medium;
  };

  /**
   * Resolve styling badge colors for Big-O algorithmic complexity values.
   * 
   * @param {string} complexity - Complexity value (e.g., 'O(1)', 'O(n)').
   * @returns {{ bg: string, text: string }|null}
   */
  const getComplexityConfig = (complexity) => {
    const configs = {
      'O(1)': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
      'O(log n)': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
      'O(n)': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      'O(n log n)': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
      'O(n²)': { bg: 'bg-red-500/10', text: 'text-red-400' },
    };
    return configs[complexity] || null;
  };

  /**
   * Format ISO date string into human-friendly representation ('Today', 'Tomorrow', or 'MMM DD').
   * 
   * @param {string} date - ISO date string.
   * @returns {string} Formatted date label.
   */
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  // Determine if the task's due date has already passed
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const priorityConfig = getPriorityConfig(task.priority);
  const complexityConfig = task.complexity ? getComplexityConfig(task.complexity) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card cursor-grab group transition-all ${isDragging ? 'shadow-glow z-50' : ''}`}
    >
      {/* Top Row: Drag Handle, Priority Badge, and Delete Button */}
      <div className="flex items-start justify-between mb-3">
        {/* Drag handle button with @dnd-kit listeners attached */}
        <button
          type="button"
          {...listeners}
          className="text-gray-500 hover:text-blue-400 transition cursor-grab active:cursor-grabbing"
          aria-label="Drag task"
        >
          <GripVertical size={16} />
        </button>

        <div className="flex items-center gap-2">
          <div className={`badge ${priorityConfig.bg} ${priorityConfig.text}`}>
            {priorityConfig.label}
          </div>

          {/* Delete Action Button */}
          <button
            type="button"
            onClick={() => onDelete(task._id || task.id)}
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Task Title - Clicking triggers edit modal */}
      <h3
        className="text-sm font-medium text-white cursor-pointer hover:text-blue-400 transition"
        onClick={() => onEdit(task)}
      >
        {task.title || 'Untitled Task'}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{task.description}</p>
      )}

      {/* Algorithmic Complexity Badge */}
      {complexityConfig && (
        <div className="mt-2">
          <span className={`badge text-xs ${complexityConfig.bg} ${complexityConfig.text}`}>
            {task.complexity}
          </span>
        </div>
      )}

      {/* Labels / Tags */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label) => (
            <span key={label} className="badge bg-surface-raised text-gray-300 text-xs">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Metadata: Due Date, Estimated Hours, and Edit Chevron */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border text-xs text-gray-400">
        <div className="flex items-center gap-2">
          {/* Due Date Indicator */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              <Clock size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Estimated Hours */}
          {task.estimatedHours && (
            <div className="flex items-center gap-1">
              <Tag size={12} />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
        </div>

        {/* Edit Action Chevron */}
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-blue-400 hover:text-blue-300 transition"
          aria-label="Edit task details"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
