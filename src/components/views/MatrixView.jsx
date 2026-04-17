import React from 'react';
import { useStore } from '../../store/useStore';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from '../TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: CSS.Translate.toString(transform), zIndex: 999 } : undefined;
  
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`touch-none ${isDragging ? 'opacity-50 scale-[1.02] shadow-2xl relative' : ''}`}>
      <div className="pointer-events-auto">
        <TaskItem task={task} />
      </div>
    </div>
  );
}

function MatrixQuadrant({ id, title, subtitle, color, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[260px] xl:min-w-0 flex flex-col bg-white rounded-[32px] p-6 border hover:shadow-md transition-all duration-300 min-h-0 h-full ${isOver ? 'border-zen-accent bg-zen-accent/5 ring-4 ring-zen-accent/5' : 'border-[#F0F0F0] shadow-sm'}`}>
      <div className="mb-6 flex justify-between items-start px-1 shrink-0">
        <div>
          <h3 className={`text-[12px] xl:text-[13px] font-bold uppercase tracking-widest ${color}`}>{title}</h3>
          <p className="text-xs text-zen-text/40 mt-1.5 font-medium">{subtitle}</p>
        </div>
        <span className="w-8 h-8 rounded-full bg-zen-bg flex justify-center items-center text-xs font-bold text-zen-text/50 border border-[#E5E5E5] shrink-0 ml-2">{tasks.length}</span>
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

export function MatrixView() {
  const { tasks, updateTask } = useStore();
  
  const quadrants = [
    { id: 'q2', title: 'Jadwalkan', subtitle: 'Penting, Tdk Mendesak', color: 'text-blue-500' },
    { id: 'q1', title: 'Ekseskusi', subtitle: 'Penting & Mendesak', color: 'text-red-500' },
    { id: 'q3', title: 'Delegasikan', subtitle: 'Tdk Penting, Mendesak', color: 'text-orange-500' },
    { id: 'q4', title: 'Tunda/Hapus', subtitle: 'Tdk Penting, Tdk Mendesak', color: 'text-zen-text/40' }
  ];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id && quadrants.find(q => q.id === over.id)) {
      updateTask(active.id, { matrix: over.id });
    }
  };

  return (
    <div className="h-full flex flex-col p-8 md:p-12 w-full max-w-[1600px] mx-auto">
      <div className="mb-10 w-full shrink-0">
        <h2 className="text-3xl font-bold text-zen-text tracking-tight">Matriks Eisenhower Horizontal</h2>
        <p className="text-zen-text/50 mt-2 font-medium">Susun ke dalam 4 kolom berdampingan untuk melihat semuanya selayang pandang.</p>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start min-w-max xl:min-w-full">
            {quadrants.map(q => (
              <MatrixQuadrant 
                key={q.id} id={q.id} title={q.title} subtitle={q.subtitle} color={q.color}
                tasks={tasks.filter(t => t.matrix === q.id || (!t.matrix && q.id === 'q2'))} 
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
