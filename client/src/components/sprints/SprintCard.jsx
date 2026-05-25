import { Calendar, Target, Zap, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function SprintCard({ sprint, onActivate, onDelete, taskCount }) {
  const getDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getDaysRemaining = (end) => {
    const now = new Date();
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Sprint ended';
    return `${diff} days left`;
  };

  const isActive = sprint.isActive;
  const ended = sprint.endDate && new Date(sprint.endDate) < new Date();

  return (
    <div className={`card border-l-4 rounded-2xl p-4 transition ${isActive ? 'border-l-indigo-500 shadow-glow' : 'border-l-surface-border'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-raised px-3 py-1 text-xs text-gray-300">
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(sprint._id)}
          className="opacity-0 transition hover:text-red-300 group-hover:opacity-100 text-red-400"
          aria-label="Delete sprint"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {sprint.goal && (
        <div className="mt-4 flex items-start gap-2 text-sm text-gray-400">
          <Target size={16} className="mt-0.5 text-indigo-400" />
          <p className="italic">{sprint.goal}</p>
        </div>
      )}

      <div className="mt-4 grid gap-3 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{getDateRange(sprint.startDate, sprint.endDate)}</span>
        </div>
        <div className={`flex items-center gap-2 ${ended ? 'text-red-400' : 'text-yellow-300'}`}>
          <Clock size={16} />
          <span>{ended ? 'Sprint ended' : getDaysRemaining(sprint.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Zap size={16} />
          <span>{taskCount ?? 0} tasks</span>
        </div>
      </div>

      <div className="mt-5">
        {isActive ? (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <CheckCircle size={16} />
            Currently Active
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onActivate(sprint._id)}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <CheckCircle size={16} />
            Set as Active
          </button>
        )}
      </div>
    </div>
  );
}
