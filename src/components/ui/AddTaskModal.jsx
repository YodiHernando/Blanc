import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { X, Calendar as CalendarIcon, Zap, Timer, AlertCircle, Bookmark } from 'lucide-react';

export function AddTaskModal() {
  const { isAddModalOpen, setAddModalOpen, addTaskDetailed } = useStore();
  
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [weight, setWeight] = useState('Sedang'); 
  const [priority, setPriority] = useState('Menengah'); 
  const [timeEstimate, setTimeEstimate] = useState(25);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAddModalOpen) return null;

  // Prevent past dates in UI
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDateTime = today.toISOString().slice(0, 16);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title.trim()) return;

    if (dueDate && new Date(dueDate) < new Date()) {
      setErrorMsg('Tenggat waktu (deadline) tidak boleh di masa lalu!');
      return;
    }

    addTaskDetailed({
      title,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      weight,
      priority,
      timeEstimate: parseInt(timeEstimate) || 25,
    });

    setTitle('');
    setDueDate('');
    setWeight('Sedang');
    setPriority('Menengah');
    setTimeEstimate(25);
    setAddModalOpen(false);
  };

  const weights = [
    { id: 'Ringan', color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' },
    { id: 'Sedang', color: 'bg-yellow-50 text-yellow-600 border-yellow-300 hover:bg-yellow-100' },
    { id: 'Berat', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' }
  ];

  const priorities = [
    { id: 'Aman', color: 'bg-[#FAFAFA] text-zen-text/60 border-[#E5E5E5] hover:bg-[#F0F0F0]' },
    { id: 'Menengah', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' },
    { id: 'Tinggi', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zen-text/20 backdrop-blur-[2px]"
        onClick={() => setAddModalOpen(false)}
      >
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md overflow-hidden border border-[#E5E5E5]"
        >
          <div className="flex justify-between items-center p-6 border-b border-[#F0F0F0] bg-[#FAFAFA]/50">
            <h2 className="text-lg font-bold text-zen-text tracking-tight">Tambah Tugas Baru</h2>
            <button onClick={() => setAddModalOpen(false)} className="text-zen-text/40 hover:text-zen-text hover:bg-zen-text/5 rounded-full p-2 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {errorMsg && (
              <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zen-text/70 block uppercase tracking-wider">Nama Tugas</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Misal: Selesaikan laporan Q1..."
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] font-medium text-zen-text placeholder:text-zen-text/30 focus:outline-none focus:ring-2 focus:ring-zen-accent/30 focus:border-zen-accent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zen-text/70 block flex items-center gap-1.5 uppercase tracking-wider">
                  <CalendarIcon className="w-3.5 h-3.5" /> Tenggat Waktu
                </label>
                <input 
                  type="datetime-local"
                  min={minDateTime}
                  value={dueDate}
                  onChange={e => { setDueDate(e.target.value); setErrorMsg(''); }}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-3 text-sm font-medium text-zen-text focus:outline-none focus:ring-2 focus:ring-zen-accent/30 focus:border-zen-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zen-text/70 block flex items-center gap-1.5 uppercase tracking-wider">
                  <Timer className="w-3.5 h-3.5" /> Estimasi (Menit)
                </label>
                <input 
                  type="number"
                  min="1"
                  value={timeEstimate}
                  onChange={e => setTimeEstimate(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm font-medium text-zen-text focus:outline-none focus:ring-2 focus:ring-zen-accent/30 focus:border-zen-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-zen-text/70 block flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Tingkat Kesulitan
              </label>
              <div className="flex gap-3">
                {weights.map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeight(w.id)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border text-[13px] font-bold transition-all",
                      weight === w.id 
                        ? w.color + " ring-2 ring-offset-1 ring-zen-text/10 shadow-sm transform scale-[1.02]" 
                        : "bg-[#FAFAFA] border-[#E5E5E5] text-zen-text/50 hover:bg-white hover:border-zen-text/20"
                    )}
                  >
                    {w.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-zen-text/70 block flex items-center gap-1.5 uppercase tracking-wider">
                <Bookmark className="w-3.5 h-3.5" /> Tingkat Prioritas
              </label>
              <div className="flex gap-3">
                {priorities.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border text-[13px] font-bold transition-all",
                      priority === p.id 
                        ? p.color + " ring-2 ring-offset-1 ring-zen-text/10 shadow-sm transform scale-[1.02]" 
                        : "bg-[#FAFAFA] border-[#E5E5E5] text-zen-text/50 hover:bg-white hover:border-zen-text/20"
                    )}
                  >
                    {p.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={!title.trim()}
                className="w-full bg-zen-text hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
              >
                Simpan Tugas
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
