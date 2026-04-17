import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TaskItem } from '../TaskItem';
import { AnimatePresence, motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tag } from '../ui/Tag';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useStore(state => state.tasks);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); 
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get tasks that were CREATED on this date or have a DUE DATE on this date
  const selectedTasks = tasks.filter(task => {
    const isCreatedToday = isSameDay(new Date(task.createdAt), selectedDate);
    const isDueToday = task.dueDate ? isSameDay(new Date(task.dueDate), selectedDate) : false;
    return isCreatedToday || isDueToday;
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 flex flex-col lg:flex-row gap-10">
      
      {/* Calendar Area */}
      <div className="flex-1 max-w-2xl bg-white p-8 rounded-3xl shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-[#F0F0F0]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-zen-text capitalize tracking-tight">
            {format(currentDate, dateFormat, { locale: id })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2.5 rounded-full border border-[#E5E5E5] hover:bg-zen-bg text-zen-text/50 hover:text-zen-text transition-colors shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2.5 rounded-full border border-[#E5E5E5] hover:bg-zen-bg text-zen-text/50 hover:text-zen-text transition-colors shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-6 gap-x-2 mb-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-center font-bold text-xs text-zen-text/30 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3 gap-x-2">
          {days.map((day, i) => {
            // Visualize task drops (Created vs Due)
            const createdHere = tasks.some(t => isSameDay(new Date(t.createdAt), day));
            const dueHere = tasks.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day) && !t.completed);
            
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            return (
              <div key={day.toString()} className="flex justify-center flex-col items-center">
                <button
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[15px] font-semibold transition-all relative",
                    !isCurrentMonth && "text-zen-text/20",
                    isCurrentMonth && !isSelected && "text-zen-text hover:bg-zen-bg hover:scale-105 border border-transparent",
                    isSelected && "bg-zen-accent text-white shadow-[0_8px_20px_rgba(138,163,153,0.3)] transform scale-105",
                    isDayToday && !isSelected && "border border-zen-accent/30 text-zen-accent bg-zen-accent/5"
                  )}
                >
                  <span className="mb-1">{format(day, 'd')}</span>
                  <div className="flex gap-1 absolute bottom-1.5">
                    {createdHere && <span className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white/80" : "bg-blue-400")} title="Tugas Dibuat"></span>}
                    {dueHere && <span className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-red-400")} title="Tenggat Waktu"></span>}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#F0F0F0] text-xs font-medium text-zen-text/50">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Tugas dibuat di hari ini</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> Tenggat Waktu (Deadline)</div>
        </div>
      </div>

      {/* Daily Tasks Focus Area */}
      <div className="w-full lg:w-[420px] flex flex-col">
        <h3 className="text-2xl font-bold text-zen-text mb-1 tracking-tight">
          Sorotan Harian
        </h3>
        <p className="text-zen-text/50 text-sm mb-8 capitalize font-medium">
          {format(selectedDate, "eeee, d MMMM yyyy", { locale: id })}
        </p>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-10">
          <AnimatePresence mode="popLayout">
            {selectedTasks.length > 0 ? (
              selectedTasks.map(task => {
                const isCreatedToday = isSameDay(new Date(task.createdAt), selectedDate);
                const isDueToday = task.dueDate ? isSameDay(new Date(task.dueDate), selectedDate) : false;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={task.id} 
                    className="bg-white rounded-2xl p-5 border border-[#F0F0F0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {isDueToday && <div className="absolute top-0 left-0 w-1 h-full bg-red-400" />}
                    {!isDueToday && isCreatedToday && <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />}
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <h4 className={cn("font-medium text-[15px] text-zen-text leading-tight", task.completed && "line-through text-zen-text/40")}>
                        {task.title}
                      </h4>
                      <Tag type={`energy${task.weight === 'Ringan' ? 'Low' : task.weight === 'Sedang' ? 'Medium' : 'High'}`}>{task.weight}</Tag>
                    </div>

                    <div className="flex flex-col gap-1.5 pl-2 text-xs font-medium">
                      <div className="flex items-center gap-2 text-zen-text/40">
                        <Info className="w-3.5 h-3.5" /> 
                        Dibuat: Pukul {format(new Date(task.createdAt), "HH:mm")}
                      </div>
                      {task.dueDate && (
                        <div className={cn("flex items-center gap-2", isDueToday ? "text-red-500" : "text-zen-text/50")}>
                          <Clock className="w-3.5 h-3.5" /> 
                          Deadline: {format(new Date(task.dueDate), "d MMM yyyy, HH:mm", { locale: id })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-12 bg-[#FAFAFA] text-center border-2 border-dashed border-[#E5E5E5] rounded-3xl text-zen-text/40 text-sm font-medium"
              >
                Tidak ada agenda yang jatuh atau <br/> dibuat pada tanggal ini. ✨
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
