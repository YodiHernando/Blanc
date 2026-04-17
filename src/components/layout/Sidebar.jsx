import React from 'react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { ListTodo, History, Grid, CalendarDays, Plus } from 'lucide-react';

export function Sidebar() {
  const { activeView, setActiveView, setAddModalOpen, tasks } = useStore();

  const navItems = [
    { id: 'list', icon: ListTodo, label: 'Daftar Tugas' },
    { id: 'calendar', icon: CalendarDays, label: 'Kalender' },
    { id: 'history', icon: History, label: 'Riwayat Selesai' },
  ];

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completionRate = totalTasksCount === 0 ? 0 : Math.round((completedTasksCount / totalTasksCount) * 100);

  return (
    <div className="w-64 h-screen bg-zen-bg border-r border-[#E5E5E5] p-6 flex flex-col gap-6 fixed left-0 top-0">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveView('list')}
          className="flex items-center gap-2 px-2 cursor-pointer hover:opacity-80 transition-opacity outline-none"
        >
          <img src="/blanc.png" alt="Blanc Logo" className="w-8 h-8 rounded-[8px] object-cover shadow-sm border border-[#E5E5E5] bg-white" />
          <span className="font-semibold text-zen-text text-lg tracking-tight">Blanc</span>
        </button>
      </div>

      <div className="my-2">
        <button 
          onClick={() => setAddModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-zen-text text-white py-3.5 rounded-xl font-semibold shadow-sm hover:bg-black transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Tugas
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 mt-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              activeView === item.id 
                ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-zen-text border border-[#E5E5E5]" 
                : "text-zen-text/60 border border-transparent hover:text-zen-text hover:bg-black/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Analytics Stats */}
      <div className="mt-auto pt-6 border-t border-[#E5E5E5]">
        <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#F0F0F0]">
          <h4 className="text-[11px] font-bold text-zen-text/40 uppercase tracking-widest mb-3">Statistik Resolusi</h4>
          <div className="flex justify-between items-end mb-2">
            <div className="text-xs font-semibold text-zen-text">
              {completedTasksCount} dari {totalTasksCount} Selesai
            </div>
            <div className="text-xs font-bold text-zen-accent">{completionRate}%</div>
          </div>
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
            <div className="bg-zen-accent h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
