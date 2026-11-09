/**
 * KanbanColumn Component
 * ============================================================================
 * Renders an individual column within the Kanban board (e.g. Backlog, In Progress,
 * Code Review, Done).
 * 
 * Responsibilities:
 * 1. Droppable Zone: Registers as a drop target via @dnd-kit's `useDroppable`.
 * 2. Header: Displays column title, status accent color bar, task count, and "+ Add" button.
 * 3. Sortable Context: Wraps task cards in `SortableContext` with `verticalListSortingStrategy`.
 * 4. Empty State / Drop Indicators: Provides visual cues when hovered over or empty.
 * ============================================================================
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

/**
 * KanbanColumn Component
 * 
 * @param {Object} props
 * @param {Object} props.column - Column metadata ({ id: string, title: string, color: string }).
 * @param {Array<Object>} [props.tasks=[]] - Filtered task objects matching this column's status.
 * @param {Function} props.onAddTask - Handler triggered when clicking the column's "+ Add" button.
 * @param {Function} props.onEditTask - Handler triggered when selecting a task card to edit.
 * @param {Function} props.onDeleteTask - Handler triggered when deleting a task card.
 * @returns {JSX.Element}
 */
export default function KanbanColumn({ column, tasks = [], onAddTask, onEditTask, onDeleteTask }) {
  // Registers container as a droppable target within @dnd-kit
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    // Droppable container ref with dynamic highlight when dragged over
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-96 rounded-xl p-4 border border-surface-border bg-dark-900 transition ${
        isOver ? 'bg-dark-800 border-blue-500/50' : ''
      }`}
    >
      {/* Column Header: Color Bar, Title, Count & Add Button */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          {/* Vertical status color accent */}
          <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: column.color }} />
          <div>
            <h3 className="text-sm font-semibold text-white">{column.title}</h3>
            <span className="text-xs text-gray-400">{tasks.length} tasks</span>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={() => onAddTask(column.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2 text-sm text-white hover:bg-surface-raised/90 transition"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* SortableContext enables vertical drag-and-drop reordering within this column */}
      <SortableContext items={(tasks || []).map((task) => task._id || task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            // Render sorted task cards
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : isOver ? (
            // Visual drop indicator when dragging over an empty column
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/50 text-blue-400 text-sm">
              Drop tasks here
            </div>
          ) : (
            // Idle empty state placeholder
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-surface-border text-gray-500 text-sm">
              No tasks in this column yet
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
