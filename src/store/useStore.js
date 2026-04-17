import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as chrono from 'chrono-node';

export const useStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      activeView: 'list', // 'list', 'kanban', 'matrix', 'calendar'
      isAddModalOpen: false,
      isDetailModalOpen: false,
      selectedDetailTask: null,
      
      setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
  openDetailModal: (task) => set({ isDetailModalOpen: true, selectedDetailTask: task }),
  closeDetailModal: () => set({ isDetailModalOpen: false, selectedDetailTask: null }),

  addTaskDetailed: ({ title, dueDate, weight, priority, timeEstimate }) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      weight, 
      priority: priority || 'Menengah',
      timeEstimate: timeEstimate || 25, // Default 25 menit
      context: [], 
      subtasks: [],
      dependencies: [], 
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'todo', 
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  addSmartTask: (input) => {
    const parsedDate = chrono.parseDate(input);
    let title = input;
    let dueDate = null;

    if (parsedDate) {
      const parseResult = chrono.parse(input)[0];
      if (parseResult) {
        title = input.replace(parseResult.text, '').trim();
      }
      dueDate = parsedDate.toISOString();
    }

    const newTask = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      weight: 'Sedang',
      context: [],
      subtasks: [],
      dependencies: [],
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'todo',
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  toggleTaskCompletion: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  },

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  deleteCompletedTasks: () =>
    set((state) => ({
      tasks: state.tasks.filter((t) => !t.completed),
    })),

  setActiveView: (view) => set({ activeView: view })
    }),
    {
      name: 'zenhq-storage',
      partialize: (state) => ({ tasks: state.tasks }), // Only persist tasks
    }
  )
);
