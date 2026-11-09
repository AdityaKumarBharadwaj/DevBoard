/**
 * TaskFormModal Component
 * ============================================================================
 * Modal dialog for creating new tasks or editing existing tasks.
 * Manages form state, input validation, label parsing, type coercions,
 * and asynchronous submission with loading and error feedback.
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { X, Plus, Save, Loader2, AlertCircle } from 'lucide-react';

/**
 * TaskFormModal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal dialog is visible.
 * @param {Function} props.onClose - Callback invoked to dismiss the modal.
 * @param {Function} props.onSubmit - Asynchronous submission callback receiving task payload.
 * @param {Object|null} props.initialData - Task data when in edit mode; null for new task.
 * @param {string} props.defaultStatus - Initial status column to assign when creating a task.
 * @param {Array<Object>} [props.sprints=[]] - Available sprints for sprint assignment dropdown.
 * @returns {JSX.Element|null}
 */
export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStatus,
  sprints,
}) {
  // Form input field state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'Backlog',
    priority: 'Medium',
    complexity: '',
    estimatedHours: '',
    dueDate: '',
    labels: '',
    sprintId: '',
  });

  // Submission loading indicator
  const [loading, setLoading] = useState(false);

  // Validation or API error state
  const [error, setError] = useState(null);

  /**
   * Pre-fill form fields when editing an existing task.
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || defaultStatus || 'Backlog',
        priority: initialData.priority || 'Medium',
        complexity: initialData.complexity || '',
        estimatedHours: initialData.estimatedHours || '',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        labels: initialData.labels ? initialData.labels.join(', ') : '',
        sprintId: initialData.sprintId || '',
      });
      setError(null);
    }
  }, [initialData, defaultStatus]);

  /**
   * Reset form fields to defaults when modal closes or switching to create mode.
   */
  useEffect(() => {
    if (!isOpen && !initialData) {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus || 'Backlog',
        priority: 'Medium',
        complexity: '',
        estimatedHours: '',
        dueDate: '',
        labels: '',
        sprintId: '',
      });
      setError(null);
    }
  }, [isOpen, initialData, defaultStatus]);

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  /**
   * Update form state on input change and clear any active error.
   * 
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  /**
   * Handle form submission: validate required fields, transform labels into array,
   * coerce numeric fields, invoke onSubmit callback, and close modal.
   * 
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const labelArray = formData.labels
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      labels: labelArray,
      sprintId: formData.sprintId || undefined,
    };

    setLoading(true);
    try {
      await onSubmit(payload);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err || 'Failed to save task');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-2xl shadow-card border border-surface-border">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEditMode ? 'Edit Task' : 'New Task'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          {/* Left Column: Title, Description, Labels */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input"
                placeholder="Task details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Labels</label>
              <input
                type="text"
                name="labels"
                value={formData.labels}
                onChange={handleChange}
                className="input"
                placeholder="bug, feature, refactor"
              />
              <p className="text-xs text-gray-400 mt-1">Comma separated</p>
            </div>
          </div>

          {/* Right Column: Status, Priority, Complexity, Hours, Date, Sprint */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input">
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Code Review">Code Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
              <select name="complexity" value={formData.complexity} onChange={handleChange} className="input">
                <option value="">Select complexity</option>
                <option value="O(1)">O(1)</option>
                <option value="O(log n)">O(log n)</option>
                <option value="O(n)">O(n)</option>
                <option value="O(n log n)">O(n log n)</option>
                <option value="O(n²)">O(n²)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
              <input
                type="number"
                min="0"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sprint</label>
              <select name="sprintId" value={formData.sprintId} onChange={handleChange} className="input">
                <option value="">No sprint</option>
                {sprints?.map((sprint) => (
                  <option key={sprint._id || sprint.id} value={sprint._id || sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="col-span-full flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="col-span-full flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditMode ? 'Save Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
