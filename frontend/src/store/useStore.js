import { create } from 'zustand';

const useStore = create((set) => ({
  selectedEvent: null,
  activeFilter: 'all',
  timeWindow: '24h',
  
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setTimeWindow: (window) => set({ timeWindow: window }),
}));

export default useStore;
