import React from 'react';
import { Filter, Flame, Globe, Wind, Zap } from 'lucide-react';
import useStore from '../store/useStore';

const FiltersBar = () => {
  const { activeFilter, setActiveFilter } = useStore();

  const filters = [
    { id: 'all', label: 'All Events', icon: Globe },
    { id: 'earthquake', label: 'Earthquake', icon: Zap },
    { id: 'wildfire', label: 'Wildfire', icon: Flame },
    { id: 'hurricane', label: 'Hurricane', icon: Wind },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => setActiveFilter(f.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeFilter === f.id 
            ? 'bg-accent text-white shadow-lg shadow-accent/20' 
            : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <f.icon size={14} />
          {f.label}
        </button>
      ))}
      <div className="w-px h-6 bg-white/10 mx-2" />
      <button className="p-2 text-white/20 hover:text-white transition-colors">
        <Filter size={16} />
      </button>
    </div>
  );
};

export default FiltersBar;
