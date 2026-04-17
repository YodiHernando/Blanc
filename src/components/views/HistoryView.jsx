import React from 'react';
import { useStore } from '../../store/useStore';
import { TaskItem } from '../TaskItem';
import { Archive, CheckCircle2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export function HistoryView() {
  const tasks = useStore(state => state.tasks);
  const deleteCompletedTasks = useStore(state => state.deleteCompletedTasks);

  // Ambil hanya tugas yang sudah completed, urutkan dari yang paling baru
  const completedTasks = tasks.filter(t => t.completed);
  completedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Mengelompokkan tugas yang selesai berdasarkan format "Bulan Tahun" (Contoh: "Maret 2026")
  const groupedTasks = completedTasks.reduce((acc, task) => {
    const monthYear = format(new Date(task.createdAt), 'MMMM yyyy', { locale: idLocale });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(task);
    return acc;
  }, {});

  return (
    <div className="h-full p-8 md:p-12 w-full max-w-4xl mx-auto flex flex-col">
      <div className="mb-12 w-full shrink-0 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zen-text tracking-tight flex items-center gap-4">
            <Archive className="w-8 h-8 text-zen-text/70" strokeWidth={2.5} />
            Riwayat Resolusi
          </h2>
          <p className="text-zen-text/50 mt-3 font-medium text-[15px]">Rekam jejak dan bukti produktivitas masa lampau Anda, terpeta berdasarkan bulan.</p>
        </div>
        
        {completedTasks.length > 0 && (
          <button 
            onClick={() => {
              if(window.confirm("Peringatan: Seluruh riwayat tugas Anda akan dihapus permanen. Lanjutkan?")) {
                deleteCompletedTasks();
              }
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 font-bold uppercase tracking-wider text-xs"
          >
            <Trash2 className="w-4 h-4" /> Bersihkan Papan
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-16">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="mt-20 text-center flex flex-col items-center justify-center opacity-60">
            <CheckCircle2 className="w-20 h-20 text-zen-muted mb-6" strokeWidth={1} />
            <p className="text-xl font-bold text-zen-text mb-2">Papan Riwayat Masih Kosong</p>
            <p className="text-sm font-medium text-zen-text/60 max-w-sm">
              Tugas apappun yang Anda centang selesai (✅) di aplikasi ini akan diarsipkan ke sini secara otomatis selamanya.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {Object.entries(groupedTasks).map(([month, monthTasks]) => (
              <motion.div 
                key={month} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-14"
              >
                {/* Grup Tanggal Sticky (Akan nyantol di atas saat discroll) */}
                <div className="flex items-center gap-4 mb-6 sticky top-[-1px] bg-[#FAFAFA] shadow-[0_10px_30px_#FAFAFA] py-4 z-50 border-b border-[#E5E5E5] pr-4">
                  <h3 className="text-2xl font-bold text-zen-text capitalize tracking-tight">{month}</h3>
                  <div className="px-4 py-1.5 rounded-full bg-zen-accent/15 border border-zen-accent/30 text-zen-text font-extrabold text-[11px] tracking-widest uppercase shadow-sm">
                    {monthTasks.length} Selesai
                  </div>
                </div>
                
                <div className="space-y-4 pl-1">
                  <AnimatePresence>
                    {monthTasks.map(t => (
                      <TaskItem key={t.id} task={t} isHistoryView />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
