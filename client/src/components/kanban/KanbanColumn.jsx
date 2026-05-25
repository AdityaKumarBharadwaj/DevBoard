import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-96 rounded-xl p-4 border border-surface-border bg-dark-900 transition ${
        isOver ? 'bg-dark-800 border-indigo-500/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: column.color }} />
          <div>
            <h3 className="text-sm font-semibold text-white">{column.title}</h3>
            <span className="text-xs text-gray-400">{tasks.length} tasks</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(column.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2 text-sm text-white hover:bg-surface-raised/90 transition"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : isOver ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-indigo-500/50 text-indigo-300 text-sm">
              Drop tasks here
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-surface-border text-gray-500 text-sm">
              No tasks in this column yet
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
