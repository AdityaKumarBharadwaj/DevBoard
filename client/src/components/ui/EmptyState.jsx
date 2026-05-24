import { Plus } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-center">
      <div className="border border-dashed border-surface-border rounded-2xl p-12 flex flex-col items-center text-center">
        {/* Icon Circle */}
        {Icon && (
          <div className="rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-4 mb-4">
            <Icon size={64} className="text-white" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-400 text-center max-w-sm mb-6">{description}</p>
        )}

        {/* Action Button */}
        {actionLabel && onAction && (
          <button type="button" onClick={onAction} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
