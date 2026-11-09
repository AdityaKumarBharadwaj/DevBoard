/**
 * KanbanBoard Component
 * ============================================================================
 * Renders a full-featured, multi-column Kanban board powered by @dnd-kit.
 * Handles drag-and-drop interactions across columns (status transitions)
 * and within columns (reordering sequence).
 * Coordinates task creation, editing, deletion, and order synchronization modals.
 * ============================================================================
 */

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Kanban column definitions: identifiers, display titles, and accent colors.
 */
const COLUMNS = [
  { id: 'Backlog', title: 'Backlog', color: '#2563eb' },
  { id: 'In Progress', title: 'In Progress', color: '#eab308' },
  { id: 'Code Review', title: 'Code Review', color: '#ef4444' },
  { id: 'Done', title: 'Done', color: '#10b981' },
];

/**
 * KanbanBoard Component
 * 
 * @param {Object} props
 * @param {Array<Object>} props.tasks - All task records belonging to the current project.
 * @param {boolean} props.loading - Indicates if tasks are currently loading.
 * @param {Function} props.onAddTask - Callback invoked when submitting a new task.
 * @param {Function} props.onEditTask - Callback invoked when editing an existing task.
 * @param {Function} props.onDeleteTask - Callback invoked when deleting a task.
 * @param {Function} props.onReorder - Callback invoked with reordered task arrays after drag-and-drop.
 * @param {Array<Object>} props.sprints - Available sprint options for task association.
 * @returns {JSX.Element}
 */
export default function KanbanBoard({
  tasks,
  loading,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onReorder,
  sprints,
}) {
  // Holds the task currently being dragged to render inside DragOverlay
  const [activeTask, setActiveTask] = useState(null);

  // Modal display state for task creation / edition
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Holds task data when editing an existing task; null when creating a new task
  const [editingTask, setEditingTask] = useState(null);

  // Default status pre-selected when opening task modal from a specific column button
  const [defaultStatus, setDefaultStatus] = useState('Backlog');

  /**
   * Configure pointer sensor with an 8px activation threshold
   * to avoid triggering drag actions during simple clicks.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  /**
   * Find a task by its unique identifier (_id or id).
   * 
   * @param {string} id - The task identifier.
   * @returns {Object|undefined} The matched task object, if found.
   */
  const taskById = (id) => (tasks || []).find((task) => task._id === id || task.id === id);

  /**
   * Build minimal payload array [{ _id, order, status }] based on an ordered task array.
   * 
   * @param {Array<Object>} updatedTasks - Tasks in their new sequence.
   * @returns {Array<{ _id: string, order: number, status: string }>} Minimal update payload.
   */
  const buildOrderedUpdates = (updatedTasks) => {
    return updatedTasks.map((task, index) => ({
      _id: task._id || task.id,
      order: index,
      status: task.status,
    }));
  };

  /**
   * Retrieve and sort tasks for a specific column in ascending order by their `order` index.
   * 
   * @param {string} columnId - The column identifier (status value).
   * @returns {Array<Object>} Sorted list of tasks for the specified column.
   */
  const getColumnTasks = (columnId) => {
    return (tasks || [])
      .filter((task) => task.status === columnId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  /**
   * Drag start event handler.
   * Captures the active task being dragged and sets it in local state for DragOverlay preview.
   * 
   * @param {Object} event - Drag start event from DndContext.
   */
  const handleDragStart = (event) => {
    const activeId = event.active.id;
    const task = taskById(activeId);
    setActiveTask(task || null);
  };

  /**
   * Drag end event handler.
   * Handles both inter-column status transitions and intra-column reordering.
   * Calculates new order indices and triggers the `onReorder` callback with the updated payload.
   * 
   * @param {Object} event - Drag end event from DndContext containing active and over targets.
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Dropped outside any droppable target - cancel drag
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const draggedTask = taskById(activeId);

    // If dragged task data cannot be resolved, abort
    if (!draggedTask) {
      setActiveTask(null);
      return;
    }

    const activeColumn = draggedTask.status;
    let targetColumn = activeColumn;

    // Check if dropped directly onto a column container
    if (COLUMNS.some((column) => column.id === overId)) {
      targetColumn = overId;
    } else {
      // Otherwise dropped on top of another task card; inherit its column status
      const overTask = taskById(overId);
      if (overTask) {
        targetColumn = overTask.status;
      }
    }

    // SCENARIO 1: Moved to a different column (status change)
    if (targetColumn !== activeColumn) {
      const targetTasks = getColumnTasks(targetColumn);
      const movedTask = { ...draggedTask, status: targetColumn };
      const reorderedTargetTasks = [...targetTasks, movedTask];

      const updates = buildOrderedUpdates(reorderedTargetTasks);
      onReorder(updates);
    } 
    // SCENARIO 2: Reordered within the same column
    else if (activeId !== overId) {
      const columnTasks = getColumnTasks(activeColumn);
      const oldIndex = columnTasks.findIndex((task) => task._id === activeId || task.id === activeId);
      const newIndex = columnTasks.findIndex((task) => task._id === overId || task.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const sorted = arrayMove(columnTasks, oldIndex, newIndex);
        const updates = buildOrderedUpdates(sorted);
        onReorder(updates);
      }
    }

    // Reset floating drag preview
    setActiveTask(null);
  };

  /**
   * Open the task modal to create a new task in the specified column.
   * 
   * @param {string} columnId - The column identifier to use as default status.
   */
  const handleAddTask = (columnId) => {
    setDefaultStatus(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  /**
   * Open the task modal to edit an existing task.
   * 
   * @param {Object} task - The task record to edit.
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setDefaultStatus(task.status || 'Backlog');
    setIsModalOpen(true);
  };

  /**
   * Handle modal form submission.
   * Delegates to `onEditTask` if modifying an existing task, or `onAddTask` if creating a new one.
   * 
   * @param {Object} formData - Form submission payload.
   */
  const handleSubmitTask = async (formData) => {
    if (editingTask) {
      await onEditTask(editingTask._id || editingTask.id, formData);
      setEditingTask(null);
    } else {
      await onAddTask({ ...formData, status: defaultStatus });
    }
    setIsModalOpen(false);
  };

  // Render loading state spinner while fetching tasks
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" fullScreen={false} />
      </div>
    );
  }

  return (
    // DndContext coordinates all drag-and-drop events and collision detection
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Horizontally scrollable container for Kanban columns */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {COLUMNS.map((column) => (
          <div key={column.id} className="min-w-[320px] flex-1">
            <KanbanColumn
              column={column}
              tasks={getColumnTasks(column.id)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={onDeleteTask}
            />
          </div>
        ))}
      </div>

      {/* Elevated preview overlay rendered directly under cursor during drag */}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
      </DragOverlay>

      {/* Task creation and editing modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        defaultStatus={defaultStatus}
        sprints={sprints}
      />
    </DndContext>
  );
}
