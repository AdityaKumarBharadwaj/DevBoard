import { GitBranch, Clock, Circle, Trash2, ExternalLink, ChevronRight } from 'lucide-react';

export default function ProjectCard({ project, onDelete, onClick }) {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Active' },
      paused: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Paused' },
      completed: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', label: 'Completed' },
    };
    return configs[status] || configs.active;
  };

  const statusConfig = getStatusConfig(project.status);
  const displayTags = project.techStack?.slice(0, 3) || [];
  const remainingTags = Math.max(0, (project.techStack?.length || 0) - 3);

  return (
    <div
      className="card group cursor-pointer hover:scale-[1.02] hover:shadow-glow transition-all duration-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Top Row: Status Badge and Delete Button */}
      <div className="flex items-center justify-between mb-4">
        <div className={`badge ${statusConfig.bg} ${statusConfig.text}`}>
          {statusConfig.label}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete && onDelete(project._id || project.id);
          }}
          className="opacity-100 p-2 text-red-400 hover:text-red-300 transition pointer-events-auto"
          aria-label="Delete project"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Middle: Title and Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {project.title || project.name || 'Untitled Project'}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
          {project.description || 'No description provided'}
        </p>
      </div>

      {/* Tech Stack Tags */}
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayTags.map((tag) => (
            <span key={tag} className="badge bg-surface-raised text-indigo-400">
              {tag}
            </span>
          ))}
          {remainingTags > 0 && (
            <span className="badge bg-surface-raised text-gray-400">
              +{remainingTags} more
            </span>
          )}
        </div>
      )}

      {/* Bottom Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Circle size={14} />
          <span>{project.taskCount || 0} tasks</span>
        </div>

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 hover:text-indigo-400 transition"
            aria-label="View on GitHub"
          >
            <GitBranch size={14} />
            <ExternalLink size={12} />
          </a>
        )}

        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <ChevronRight size={16} className="text-indigo-400" />
      </div>
    </div>
  );
}
