import React from 'react';
import { Trophy, Award, BarChart3 } from 'lucide-react';

const InsightsPanel = () => {
  const consistentWinners = [
    { ticker: 'CAT', event: 'Earthquake', freq: '92%', avgReturn: '+4.2%' },
    { ticker: 'HD', event: 'Hurricane', freq: '88%', avgReturn: '+3.8%' },
    { ticker: 'POWI', event: 'Wildfire', freq: '74%', avgReturn: '-5.1%' },
  ];

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5 flex flex-col h-full overflow-hidden border-t-accent/30 border-t-2">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-2">
        <Trophy size={14} /> Historical Consistency
      </h2>
      
      <div className="space-y-4 flex-1 overflow-y-auto">
        {consistentWinners.map((w, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm tracking-tight group-hover:text-accent transition-colors">{w.ticker}</span>
              <span className={`text-xs font-mono font-bold ${w.avgReturn.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                {w.avgReturn}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/30 uppercase font-bold tracking-widest">
              <span>{w.event} Correlation</span>
              <span className="text-white/60">{w.freq} Freq</span>
            </div>
            <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${w.avgReturn.startsWith('+') ? 'bg-success/40' : 'bg-danger/40'}`} 
                style={{ width: w.freq }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer group">
          <BarChart3 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Full Correlation Matrix</span>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
