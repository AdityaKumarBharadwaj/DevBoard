import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import LoadingSpinner from '../ui/LoadingSpinner';

const COLUMNS = [
  { id: 'Backlog', title: 'Backlog', color: '#6366f1' },
  { id: 'In Progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'Code Review', title: 'Code Review', color: '#8b5cf6' },
  { id: 'Done', title: 'Done', color: '#10b981' },
];

export default function KanbanBoard({ tasks, loading, onAddTask, onEditTask, onDeleteTask, onReorder, sprints }) {
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Backlog');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const taskById = (id) => tasks.find((task) => task._id === id || task.id === id);

  const buildOrderedUpdates = (updatedTasks) => {
    return updatedTasks.map((task, index) => ({ _id: task._id || task.id, order: index, status: task.status }));
  };

  const getColumnTasks = (columnId) =>
    tasks
      .filter((task) => task.status === columnId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDragStart = (event) => {
    const activeId = event.active.id;
    const task = taskById(activeId);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const draggedTask = taskById(activeId);
    if (!draggedTask) {
      setActiveTask(null);
      return;
    }

    const activeColumn = draggedTask.status;
    let targetColumn = activeColumn;
    let newOrderTasks = [...tasks];

    if (COLUMNS.some((column) => column.id === overId)) {
      targetColumn = overId;
    } else {
      const overTask = taskById(overId);
      if (overTask) {
        targetColumn = overTask.status;
      }
    }

    if (targetColumn !== activeColumn) {
      const sourceTasks = getColumnTasks(activeColumn).filter((task) => task._id !== draggedTask._id);
      const targetTasks = getColumnTasks(targetColumn);
      const movedTask = { ...draggedTask, status: targetColumn };
      const reorderedTargetTasks = [...targetTasks, movedTask];

      newOrderTasks = tasks
        .filter((task) => task._id !== draggedTask._id)
        .map((task) => ({ ...task }))
        .concat([]);
      newOrderTasks = newOrderTasks.map((task) => {
        if (task._id === movedTask._id) return movedTask;
        return task;
      });

      const orderedTasks = [
        ...sourceTasks,
        ...getColumnTasks(targetColumn).filter((task) => task._id !== movedTask._id),
        movedTask,
      ];
      const updates = buildOrderedUpdates(reorderedTargetTasks);
      onReorder(updates);
    } else if (activeId !== overId) {
      const columnTasks = getColumnTasks(activeColumn);
      const oldIndex = columnTasks.findIndex((task) => task._id === activeId || task.id === activeId);
      const newIndex = columnTasks.findIndex((task) => task._id === overId || task.id === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const sorted = arrayMove(columnTasks, oldIndex, newIndex);
        const updates = buildOrderedUpdates(sorted);
        onReorder(updates);
      }
    }

    setActiveTask(null);
  };

  const handleAddTask = (columnId) => {
    setDefaultStatus(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDefaultStatus(task.status || 'Backlog');
    setIsModalOpen(true);
  };

  const handleSubmitTask = async (formData) => {
    if (editingTask) {
      await onEditTask(editingTask._id || editingTask.id, formData);
      setEditingTask(null);
    } else {
      await onAddTask({ ...formData, status: defaultStatus });
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" fullScreen={false} />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
      </DragOverlay>

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
