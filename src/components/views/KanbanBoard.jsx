import React from 'react';
import { useStore } from '../../store/useStore';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from '../TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 999,
  } : undefined;
  
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`touch-none ${isDragging ? 'opacity-50 scale-[1.02] shadow-2xl relative' : ''}`}>
      <div className="pointer-events-auto">
        <TaskItem task={task} />
      </div>
    </div>
  );
}

function DroppableColumn({ id, title, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} className={`flex-1 flex flex-col bg-[#FAFAFA] rounded-[32px] p-6 border transition-all duration-300 min-h-0 h-full ${isOver ? 'border-zen-accent bg-zen-accent/5 ring-4 ring-zen-accent/5' : 'border-[#E5E5E5]'}`}>
      <div className="flex justify-between items-center mb-6 px-2 shrink-0">
        <h3 className="text-sm font-bold text-zen-text/50 uppercase tracking-widest">{title}</h3>
        <span className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-[#E5E5E5] text-zen-text/50">{tasks.length}</span>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        <AnimatePresence>
          {tasks.map(t => (
            <motion.div key={t.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <DraggableTask task={t} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, toggleTaskCompletion } = useStore();
  
  const columns = [
    { id: 'todo', title: 'Belum Selesai' },
    { id: 'done', title: 'Selesai' }
  ];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id && columns.find(c => c.id === over.id)) {
      const task = tasks.find(t => t.id === active.id);
      const isDroppingToDone = over.id === 'done';
      
      if (task && task.completed !== isDroppingToDone) {
        toggleTaskCompletion(active.id);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-8 md:p-12 max-w-6xl mx-auto w-full">
      <div className="mb-10 w-full shrink-0">
        <h2 className="text-3xl font-bold text-zen-text tracking-tight">Papan Kanban Terpusat</h2>
        <p className="text-zen-text/50 mt-2 font-medium">Geser dan lempar tugas ke kotak "Selesai" untuk menandainya.</p>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 md:gap-8 flex-1 min-h-0 overflow-hidden w-full">
          {columns.map(col => {
            const colTasks = col.id === 'done' ? tasks.filter(t => t.completed) : tasks.filter(t => !t.completed);
            return <DroppableColumn key={col.id} id={col.id} title={col.title} tasks={colTasks} />
          })}
        </div>
      </DndContext>
    </div>
  );
}
