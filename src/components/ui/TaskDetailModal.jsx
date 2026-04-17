import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { X, Clock, Calendar, Zap, Target, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Tag } from './Tag';
import { cn } from '../../lib/utils';

export function TaskDetailModal() {
  const isDetailModalOpen = useStore(state => state.isDetailModalOpen);
  const closeDetailModal = useStore(state => state.closeDetailModal);
  const selectedDetailTask = useStore(state => state.selectedDetailTask);
  const deleteTask = useStore(state => state.deleteTask);

  if (!isDetailModalOpen || !selectedDetailTask) return null;

  const t = selectedDetailTask;

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTask(t.id);
    closeDetailModal();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zen-text/10 backdrop-blur-sm"
        onClick={closeDetailModal}
      >
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] w-full max-w-lg overflow-hidden border border-[#E5E5E5] relative"
        >
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-zen-accent via-[#A9C1B5] to-zen-bg opacity-80" />

          <div className="flex justify-between items-start p-6 pb-2">
            <h2 className="text-2xl font-semibold text-zen-text leading-tight pr-8">{t.title}</h2>
            <button onClick={closeDetailModal} className="text-zen-text/40 hover:text-zen-text rounded-full p-1.5 hover:bg-zen-bg transition-colors absolute top-5 right-5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#F0F0F0]">
                <div className="flex items-center gap-2 text-zen-text/50 mb-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Dibuat Pada</span>
                </div>
                <div className="text-sm font-medium text-zen-text">
                  {format(new Date(t.createdAt), "d MMMM yyyy, HH:mm", { locale: idLocale })}
                </div>
              </div>
              
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#F0F0F0]">
                <div className="flex items-center gap-2 text-zen-text/50 mb-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Tenggat Waktu</span>
                </div>
                <div className="text-sm font-medium text-zen-text">
                  {t.dueDate ? format(new Date(t.dueDate), "d MMMM yyyy, HH:mm", { locale: idLocale }) : "Tanpa Batas"}
                </div>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#F0F0F0]">
                <div className="flex items-center gap-2 text-zen-text/50 mb-1.5">
                  <Target className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Estimasi Waktu</span>
                </div>
                <div className="text-sm font-medium text-zen-text">
                  {t.timeEstimate || 25} Menit
                </div>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#F0F0F0]">
                <div className="flex items-center gap-2 text-zen-text/50 mb-1.5">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Beban</span>
                </div>
                <div className="mt-1">
                  <Tag type={`energy${t.weight === 'Ringan' ? 'Low' : t.weight === 'Sedang' ? 'Medium' : 'High'}`}>{t.weight || 'Sedang'}</Tag>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!t.completed && (
              <div className="pt-3 flex justify-end">
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500/60 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Permanen
                </button>
              </div>
            )}
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
