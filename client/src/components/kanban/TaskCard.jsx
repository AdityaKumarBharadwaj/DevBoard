import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Tag, AlertCircle, GripVertical, Trash2, ChevronRight } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id || task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get priority badge config
  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Critical' },
      high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'High' },
      medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Medium' },
      low: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Low' },
    };
    return configs[priority?.toLowerCase()] || configs.medium;
  };

  // Get complexity badge config
  const getComplexityConfig = (complexity) => {
    const configs = {
      'O(1)': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
      'O(log n)': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
      'O(n)': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      'O(n log n)': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
      'O(n²)': { bg: 'bg-red-500/10', text: 'text-red-400' },
    };
    return configs[complexity] || null;
  };

  // Format due date
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

  // Check if due date is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const priorityConfig = getPriorityConfig(task.priority);
  const complexityConfig = task.complexity ? getComplexityConfig(task.complexity) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card cursor-grab group transition-all ${isDragging ? 'shadow-glow z-50' : ''}`}
    >
      {/* Top Row: Drag Handle and Priority */}
      <div className="flex items-start justify-between mb-3">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="text-gray-500 hover:text-indigo-400 transition cursor-grab active:cursor-grabbing"
          aria-label="Drag handle"
        >
          <GripVertical size={16} />
        </button>

        <div className="flex items-center gap-2">
          <div className={`badge ${priorityConfig.bg} ${priorityConfig.text}`}>
            {priorityConfig.label}
          </div>

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

      {/* Title */}
      <h3
        className="text-sm font-medium text-white cursor-pointer hover:text-indigo-400 transition"
        onClick={() => onEdit(task)}
      >
        {task.title || 'Untitled Task'}
      </h3>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{task.description}</p>
      )}

      {/* Complexity Badge */}
      {complexityConfig && (
        <div className="mt-2">
          <span className={`badge text-xs ${complexityConfig.bg} ${complexityConfig.text}`}>
            {task.complexity}
          </span>
        </div>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label) => (
            <span key={label} className="badge bg-surface-raised text-gray-300 text-xs">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row: Metadata */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border text-xs text-gray-400">
        <div className="flex items-center gap-2">
          {/* Due Date */}
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

        {/* Chevron Arrow */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="text-indigo-400 hover:text-indigo-300 transition"
            aria-label="Open task details"
          >
            <ChevronRight size={14} />
          </button>
        </div>
    </div>
  );
}
