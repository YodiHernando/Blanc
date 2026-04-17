import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Tag } from './ui/Tag';

function getRelativeTime(dueDate) {
  const now = new Date();
  const target = new Date(dueDate);
  
  if (target < now) return "Melebihi Tenggat!";
  
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  
  if (days > 0) return `${days} Hari ${hours} Jam`;
  if (hours > 0) return `${hours} Jam ${minutes} Mnt`;
  return `${minutes} Menit`;
}

export function TaskItem({ task, isHistoryView }) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleTaskCompletion = useStore(state => state.toggleTaskCompletion);
  const tasks = useStore(state => state.tasks);
  const openDetailModal = useStore(state => state.openDetailModal);
  const deleteTask = useStore(state => state.deleteTask);

  const isLocked = task.dependencies.some(depId => {
    const dep = tasks.find(t => t.id === depId);
    return dep && !dep.completed;
  });

  const priorityLabels = {
    'Tinggi': { text: '🚨 Prioritas Tinggi', color: 'bg-red-50 text-red-600 border-red-200' },
    'Menengah': { text: '⚡ Menengah', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    'Aman': { text: '☕ Aman', color: 'bg-[#FAFAFA] text-zen-text/60 border-[#E5E5E5]' }
  };

  return (
    <motion.div
      layout
      onClick={() => openDetailModal(task)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer group bg-white border border-[#E5E5E5] rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[80px]"
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm text-[11px] font-bold uppercase tracking-wider text-zen-text/50 flex items-center gap-2 border border-[#E5E5E5]">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            Menunggu Tugas Lain
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 relative z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
          className={cn(
            "mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white",
            task.completed 
              ? "bg-zen-accent border-zen-accent text-white" 
              : "border-[#E5E5E5] text-transparent hover:border-zen-accent hover:bg-zen-accent/5 backdrop-blur-sm"
          )}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn(
              "font-semibold text-[15px] leading-tight transition-colors pr-2",
              task.completed ? "text-zen-text/40 line-through" : "text-zen-text"
            )}>
              {task.title}
            </h3>
            
            {isHistoryView && (
              <button 
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                className="shrink-0 p-2 text-red-500/40 hover:text-white hover:bg-red-500 rounded-full transition-all border border-transparent hover:shadow-md"
                title="Hapus Murni"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {task.dueDate && !task.completed && (
              <div className={cn(
                "shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm tracking-wide uppercase",
                new Date(task.dueDate) < new Date() ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-zen-text/60 border-[#E5E5E5]"
              )}>
                <Clock className="w-3.5 h-3.5" />
                {getRelativeTime(task.dueDate)}
              </div>
            )}
          </div>

          {(task.context.length > 0 || task.weight || task.priority) && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {task.weight && (
                <Tag type={`energy${task.weight === 'Ringan' ? 'Low' : task.weight === 'Sedang' ? 'Medium' : 'High'}`}>Beban: {task.weight}</Tag>
              )}
              {task.priority && (
                <span className={cn("px-2.5 py-1 text-[11px] font-bold border rounded-full whitespace-nowrap uppercase tracking-wider", priorityLabels[task.priority]?.color)}>
                  {priorityLabels[task.priority]?.text}
                </span>
              )}
              {task.context.map(ctx => (
                <Tag key={ctx} type="context">{ctx}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
