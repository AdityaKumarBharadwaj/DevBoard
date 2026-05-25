import { useState, useEffect } from 'react';
import { X, Plus, Loader2, FolderPlus, AlertCircle } from 'lucide-react';

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  onSubmit,
  initialData = null,
  submitLabel = 'Create Project',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        status: 'active',
      });
      setError(null);
      return;
    }

    if (initialData) {
      setFormData({
        title: initialData.title || initialData.name || '',
        description: initialData.description || '',
        techStack: (initialData.techStack || []).join(', '),
        githubLink: initialData.githubLink || '',
        status: initialData.status || 'active',
      });
      setError(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    const techStackArray = formData.techStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: techStackArray,
      githubLink: formData.githubLink || null,
      status: formData.status,
    };

    setLoading(true);
    try {
      const submitCallback = onSubmit || onCreate;
      if (!submitCallback) {
        throw new Error('Submit callback is required');
      }

      await submitCallback(payload);

      setFormData({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        status: 'active',
      });
      onClose();
    } catch (err) {
      setError(err?.message || err || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-lg shadow-card border border-surface-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600/20 p-2 text-indigo-400">
              <FolderPlus size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {initialData ? 'Edit Project' : 'New Project'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project name"
              className="input"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows="3"
              className="input"
            />
          </div>

          {/* Tech Stack Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tech Stack
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="input"
            />
            <p className="text-xs text-gray-400 mt-1">Comma separated</p>
          </div>

          {/* GitHub Link Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="input"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <AlertCircle className="mt-0.5 text-red-500 flex-shrink-0" size={18} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {submitLabel}...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
