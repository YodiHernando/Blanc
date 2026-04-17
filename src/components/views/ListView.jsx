import React from 'react';
import { useStore } from '../../store/useStore';
import { TaskItem } from '../TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

export function ListView() {
  const tasks = useStore(state => state.tasks);
  
  const incompleteTasks = tasks.filter(t => !t.completed);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto py-12 px-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-zen-text tracking-tight">Halo! Siap beraksi?</h1>
        <p className="text-zen-text/50 mt-1.5 font-medium text-[15px]">Terdapat <strong className="text-zen-text/80">{incompleteTasks.length} tugas</strong> riil yang menunggu eksekusi hari ini.</p>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {incompleteTasks.map((task, i) => (
            <motion.div 
              key={task.id} 
              layout
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ 
                duration: 0.3, 
                delay: i * 0.05, 
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <TaskItem task={task} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {incompleteTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="py-14 mt-8 flex flex-col items-center justify-center border-2 border-dashed border-[#E5E5E5] rounded-[24px] text-zen-text/40 shadow-sm bg-white"
          >
            <span className="text-4xl mb-3">☕</span>
            <p className="text-lg font-bold text-zen-text/60">Papan tugas Anda bersih kilap.</p>
            <p className="text-sm font-medium">Beri hadiah pada diri sendiri dan nikmati momen *Zen* Anda.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
