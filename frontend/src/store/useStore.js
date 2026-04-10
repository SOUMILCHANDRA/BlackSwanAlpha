import { create } from 'zustand';

const useStore = create((set) => ({
  // Navigation & UI State
  selectedEvent: null,
  activeFilter: 'all',
  timeWindow: '24h',
  searchQuery: '',
  isPanelOpen: false,

  // Data State
  events: [],
  filteredEvents: [],
  leaderboardData: [],
  
  // Actions
  setSelectedEvent: (event) => set({ 
    selectedEvent: event, 
    isPanelOpen: !!event 
  }),
  
  setActiveFilter: (filter) => set((state) => ({ 
    activeFilter: filter,
    selectedEvent: state.selectedEvent?.type === filter || filter === 'all' ? state.selectedEvent : null
  })),
  
  setTimeWindow: (window) => set({ timeWindow: window }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setEvents: (events) => set({ events }),
  
  setLeaderboardData: (data) => set({ leaderboardData: data }),

  togglePanel: (open) => set({ isPanelOpen: open }),
}));

export default useStore;
