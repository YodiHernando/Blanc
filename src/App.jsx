import React, { useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { HistoryView } from './components/views/HistoryView';
import { AddTaskModal } from './components/ui/AddTaskModal';
import { TaskDetailModal } from './components/ui/TaskDetailModal';
import { useStore } from './store/useStore';

function App() {
  const activeView = useStore(state => state.activeView);
  const addSmartTask = useStore(state => state.addSmartTask);
  const tasks = useStore(state => state.tasks);



  return (
    <div className="flex h-screen bg-zen-bg overflow-hidden font-sans text-zen-text antialiased selection:bg-zen-accent/20">
      <Sidebar />
      
      <main className="flex-1 ml-64 h-full overflow-y-auto relative bg-[#FAFAFA]">
        {activeView === 'list' && <ListView />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'history' && <HistoryView />}
      </main>

      <AddTaskModal />
      <TaskDetailModal />
    </div>
  );
}

export default App;
