import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, ArrowLeft, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FocusHub() {
  const focusTask = useStore(state => state.focusTask);
  const setActiveView = useStore(state => state.setActiveView);
  
  // Set default to task's required time if available, or 25 mins.
  const initialTime = focusTask?.timeEstimate ? focusTask.timeEstimate * 60 : 25 * 60;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  // Sync initial time when focusTask changes
  useEffect(() => {
    if (focusTask) {
      setTimeLeft(initialTime);
      setIsActive(false);
    }
  }, [focusTask]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(initialTime); };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressTotal = 283;
  const progressOffset = progressTotal - (progressTotal * (timeLeft / initialTime));

  const progressStyle = {
    strokeDasharray: "283",
    strokeDashoffset: isNaN(progressOffset) ? "0" : progressOffset.toString()
  };

  return (
    <AnimatePresence>
      <motion.div 
        key="focushub"
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 overflow-hidden bg-zen-bg/80"
      >
        {/* Dynamic Breathing Background */}
        <motion.div 
          animate={{ 
            scale: isActive ? [1, 1.05, 1] : 1,
            opacity: isActive ? [0.4, 0.6, 0.4] : 0.2
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-[-1] pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-zen-accent/10 to-transparent blur-3xl rounded-full" />
        </motion.div>

        <button 
          onClick={() => setActiveView('list')}
          className="absolute top-8 left-8 flex items-center gap-2 text-zen-text/60 hover:text-zen-text transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/50 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5"/> Keluar Mode Fokus
        </button>

        {focusTask ? (
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 20 }}
            className="text-center w-full flex flex-col items-center"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white max-w-2xl px-12 py-10 rounded-[40px] shadow-[0_32px_96px_rgba(0,0,0,0.08)] flex flex-col items-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA]/80 rounded-full border border-zen-muted shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-zen-accent animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider uppercase text-zen-text/60">Target Saat Ini</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-zen-text to-zen-text/70 leading-tight tracking-tight mb-14 text-center max-w-[90%]">
                {focusTask.title}
              </h2>
              
              {/* Pomodoro Timer Premium SVG */}
              <div className="relative w-72 h-72 mx-auto mb-16 flex items-center justify-center group pointer-events-auto">
                {/* Glowing ring backdrop layer */}
                <div className={cn("absolute inset-0 rounded-full bg-zen-accent/5 blur-xl transition-opacity duration-1000", isActive ? "opacity-100" : "opacity-0")} />
                
                <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-xl" viewBox="0 0 100 100">
                  {/* Subtle track background */}
                  <circle cx="50" cy="50" r="45" className="stroke-zen-muted/30 fill-none" strokeWidth="2" />
                  
                  {/* Active progress */}
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    className="stroke-zen-accent fill-none transition-all duration-1000 ease-linear" 
                    strokeWidth="3.5"
                    style={progressStyle}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center justify-center z-20">
                  <div className={cn(
                    "text-6xl font-black tracking-tighter tabular-nums transition-colors duration-500",
                    isActive ? "text-zen-accent" : "text-zen-text"
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm font-medium text-zen-text/40 mt-1 uppercase tracking-widest">
                    {isActive ? "Progress" : "Tersisa"}
                  </div>
                </div>
                
                <div className="absolute -bottom-10 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-30">
                  <button onClick={toggleTimer} className="p-4 rounded-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)] text-zen-text hover:text-white hover:bg-zen-accent transition-all hover:scale-105 active:scale-95 border border-white">
                    {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                  </button>
                  <button onClick={resetTimer} className="p-4 rounded-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)] text-zen-text hover:text-white hover:bg-black transition-all hover:scale-105 active:scale-95 border border-white">
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <button className="group mt-4 flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-zen-text/10 text-zen-text/50 hover:text-zen-text hover:border-zen-text/20 transition-all bg-white/40 shadow-sm hover:shadow-md hover:bg-white">
                <Volume2 className="w-5 h-5 group-hover:animate-pulse text-zen-accent" />
                <span className="text-sm font-semibold tracking-wide">Suara Latar: Hujan Tropis</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-zen-text/50 text-xl font-medium flex items-center gap-3 bg-white/50 px-8 py-6 rounded-3xl border border-white shadow-xl backdrop-blur-md">
            <Target className="w-6 h-6 text-zen-accent" />
            Pilih mahakarya Anda dari Daftar Tugas terlebih dahulu.
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
