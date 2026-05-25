import { useState } from 'react';
import SprintCard from './SprintCard';
import CreateSprintModal from './CreateSprintModal';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Plus, Zap } from 'lucide-react';

export default function SprintsList({ sprints, loading, tasks, onAdd, onActivate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSprint = sprints.find((sprint) => sprint.isActive);

  const taskCountForSprint = (sprintId) =>
    tasks.filter((task) => task.sprintId === sprintId).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sprints</h2>
          <p className="text-sm text-gray-400">Manage sprint progress and timelines.</p>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} />
          New Sprint
        </button>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : sprints.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No sprints yet"
          description="Create a sprint to organize goals and tasks for your project."
          actionLabel="Create Sprint"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {activeSprint && (
            <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">🟢 Current Sprint</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{activeSprint.name}</h3>
                  {activeSprint.goal && <p className="mt-2 text-sm text-gray-300">{activeSprint.goal}</p>}
                </div>
                <div className="text-sm text-gray-300">{taskCountForSprint(activeSprint._id)} tasks</div>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint._id}
                sprint={sprint}
                onActivate={onActivate}
                onDelete={onDelete}
                taskCount={taskCountForSprint(sprint._id)}
              />
            ))}
          </div>
        </div>
      )}

      <CreateSprintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={onAdd} />
    </div>
  );
}
