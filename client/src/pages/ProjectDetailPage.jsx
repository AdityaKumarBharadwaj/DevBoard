/**
 * ProjectDetailPage Component
 * ============================================================================
 * Detail page for a specific project.
 * Features:
 * 1. Project header displaying title, status, repository link, and tech stack tags.
 * 2. Tab navigation for switching between Kanban Board (tasks), Project Notes,
 *    and Sprint management.
 * 3. Drag-and-drop order synchronization: combines optimistic local state updates
 *    with background persistence to MongoDB.
 * 4. Project settings modal for editing project details.
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useNotes from '../hooks/useNotes';
import useSprints from '../hooks/useSprints';

import KanbanBoard from '../components/kanban/KanbanBoard';
import NotesList from '../components/notes/NotesList';
import SprintsList from '../components/sprints/SprintsList';
import CreateProjectModal from '../components/projects/CreateProjectModal';

import { ArrowLeft, GitBranch, Settings, Zap, FileText, KanbanSquare } from 'lucide-react';

/**
 * ProjectDetailPage Component
 * 
 * @returns {JSX.Element}
 */
export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Active view tab ('kanban' | 'notes' | 'sprints')
  const [activeTab, setActiveTab] = useState('kanban');

  // Currently resolved project record
  const [project, setProject] = useState(null);

  const { projects, editProject } = useProjects();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Hook integrations scoped to the active project ID
  const {
    tasks,
    loading,
    addTask,
    editTask,
    removeTask,
    reorderTasksLocally,
    syncTaskOrder,
  } = useTasks(id);

  const {
    notes,
    loading: loadingNotes,
    addNote,
    editNote,
    removeNote,
  } = useNotes(id);

  const {
    sprints,
    loading: loadingSprints,
    addSprint,
    activateSprint,
    removeSprint,
  } = useSprints(id);

  // Synchronize active project from projects collection
  useEffect(() => {
    const found = projects.find((item) => item._id === id || item.id === id);
    setProject(found || null);
  }, [projects, id]);

  /**
   * Resolve Tailwind CSS styling classes based on project status.
   * 
   * @param {string} status - Project status ('active', 'paused', 'completed').
   * @returns {string} Tailwind CSS class string.
   */
  const statusBadgeClass = (status) => {
    const map = {
      active: 'bg-green-500/10 text-green-400',
      paused: 'bg-yellow-500/10 text-yellow-400',
      completed: 'bg-blue-500/10 text-blue-400',
    };
    return map[status] || 'bg-gray-700 text-gray-200';
  };

  /**
   * Handle updates submitted from the project settings modal.
   * 
   * @param {Object} data - Updated project metadata.
   */
  const handleUpdateProject = async (data) => {
    if (!project) return;
    await editProject(project._id || project.id, data);
    setIsSettingsOpen(false);
  };

  /**
   * Handle task reordering from drag-and-drop interactions.
   * Merges partial updates with full task records to preserve metadata,
   * optimistically updates local UI state, and persists changes to the backend.
   * 
   * @param {Array<{ _id: string, order: number, status: string }>} updatedTasks - Reordered minimal task descriptors.
   */
  const handleReorder = async (updatedTasks) => {
    // Preserve existing task details (title, description, tags, etc.) while applying updated order and status
    const merged = tasks.map((t) => {
      const u = updatedTasks.find((ut) => ut._id === t._id || ut._id === t.id);
      return u ? { ...t, ...u } : t;
    });

    // Optimistic UI update for immediate visual feedback
    reorderTasksLocally(merged);

    // Persist new ordering and column assignments to backend
    try {
      await syncTaskOrder(updatedTasks);
    } catch (err) {
      console.error('Failed to sync task order', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar: Navigation & Action Controls */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-dark-900 px-4 py-2 text-sm text-gray-300 hover:bg-dark-850 transition"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-surface-raised px-4 py-2 text-sm text-white hover:bg-surface-raised/90 transition"
          >
            <Settings size={16} />
            Project settings
          </button>
        </div>
      </div>

      {/* Project Header: Title, Status, Repository, Tags & Counters */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {project?.title || project?.name || 'Project details'}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {project?.status && (
                <span className={`badge ${statusBadgeClass(project.status)}`}>
                  {project.status}
                </span>
              )}
              {project?.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2 text-sm text-gray-200 hover:text-blue-400 transition"
                >
                  <GitBranch size={16} />
                  View repo
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Badges */}
          {project?.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="badge bg-surface-raised text-blue-400">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Quick Stats: View Pill, Notes Count, Sprints Count */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-surface-border bg-dark-900 p-4">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/10 px-3 py-2 text-blue-400">
              <KanbanSquare size={18} />
              <span className="text-sm">Kanban</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-surface-raised px-3 py-2 text-sm text-gray-300">
              <FileText size={18} />
              <span>{project?.notesCount ?? 0} notes</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-surface-raised px-3 py-2 text-sm text-gray-300">
              <Zap size={18} />
              <span>{project?.sprintsCount ?? 0} sprints</span>
            </div>
          </div>
        </div>

        {/* Project Description Sidebar */}
        <div className="grid gap-4">
          {project?.description && (
            <div className="card bg-dark-900 p-5">
              <h2 className="text-sm font-semibold text-white">Overview</h2>
              <p className="mt-3 text-sm text-gray-400">{project.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-surface-border pb-3">
        {[
          { id: 'kanban', label: 'Kanban', icon: KanbanSquare },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'sprints', label: 'Sprints', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 pb-3 text-sm font-medium transition ${
                active
                  ? 'border-b-2 border-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Kanban Board View */}
      {activeTab === 'kanban' && (
        <KanbanBoard
          tasks={tasks}
          loading={loading}
          onAddTask={addTask}
          onEditTask={editTask}
          onDeleteTask={removeTask}
          onReorder={handleReorder}
          sprints={sprints}
        />
      )}

      {/* Tab 2: Notes List View */}
      {activeTab === 'notes' && (
        <NotesList
          notes={notes}
          loading={loadingNotes}
          onAdd={addNote}
          onEdit={editNote}
          onDelete={removeNote}
        />
      )}

      {/* Tab 3: Sprints List View */}
      {activeTab === 'sprints' && (
        <SprintsList
          sprints={sprints}
          loading={loadingSprints}
          tasks={tasks}
          onAdd={addSprint}
          onActivate={activateSprint}
          onDelete={removeSprint}
        />
      )}

      {/* Project Settings Modal */}
      <CreateProjectModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialData={project}
        onSubmit={handleUpdateProject}
        submitLabel="Update Project"
      />
    </div>
  );
}
