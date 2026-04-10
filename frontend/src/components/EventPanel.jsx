import React from 'react';
import { X, MapPin, Calendar, Activity, BarChart2, ShieldCheck, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import StockCard from './StockCard';

const EventPanel = () => {
  const { selectedEvent, setSelectedEvent } = useStore();

  if (!selectedEvent) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-[450px] bg-card border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${selectedEvent.type === 'earthquake' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'}`}>
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize">{selectedEvent.type}</h2>
              <p className="text-xs text-white/40 font-mono italic">REF: {selectedEvent.id}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Magnitude / Severity</span>
              <span className="text-lg font-bold font-mono text-accent">{selectedEvent.magnitude || 'N/A'}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Certainty Rate</span>
              <span className="text-lg font-bold font-mono text-success">98.4%</span>
            </div>
          </div>

          {/* Location & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <MapPin size={16} className="text-accent" />
              <span>{selectedEvent.region}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Calendar size={16} className="text-accent" />
              <span>{selectedEvent.timestamp}</span>
            </div>
          </div>

          {/* Affected Stocks */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Affected Assets</h3>
              <span className="text-[10px] text-accent hover:underline cursor-pointer">View Watchlist</span>
            </div>
            <div className="space-y-3">
              {(selectedEvent.affectedStocks || [
                { ticker: 'CAT', company: 'Caterpillar Inc.', change: 2.1, zScore: 2.8, consistency: 3, sparkline: Array.from({length: 20}, (_, i) => ({val: Math.random() * 10 + 5})) },
                { ticker: 'URI', company: 'United Rentals', change: 1.5, zScore: 1.9, consistency: 2, sparkline: Array.from({length: 20}, (_, i) => ({val: Math.random() * 10 + 5})) }
              ]).map(stock => (
                <StockCard key={stock.ticker} stock={stock} />
              ))}
            </div>
          </div>

          {/* Prediction Block */}
          <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} />
            </div>
            <h3 className="text-accent font-bold text-sm mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> ALPHA PREDICTION
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-white/80 leading-relaxed italic">
                "Historical analysis of {selectedEvent.type}s in this region suggests a median 
                <span className="text-success font-bold"> +3.1% appreciation </span> 
                in heavy equipment sectors within 72 hours."
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-accent/10">
                <div className="text-center">
                  <div className="text-xl font-bold font-mono text-white">74%</div>
                  <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold font-mono text-white">48H</div>
                  <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Horizon</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold font-mono text-white">HIGH</div>
                  <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Volatility</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Insight */}
        <div className="p-6 bg-white/2 border-t border-white/5">
          <div className="flex gap-4 items-start">
            <div className="mt-1"><Target size={18} className="text-white/20" /></div>
            <p className="text-xs text-white/40 italic">
              Why this matters: Earthquake repairs drive immediate demand for industrial rental fleets (URI) and construction machinery (CAT).
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventPanel;
