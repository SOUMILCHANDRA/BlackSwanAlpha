import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Leaderboard = ({ stocks = [] }) => {
  return (
    <div className="bg-card border border-white/10 rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Market Impact Leaderboard</h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {stocks.length === 0 && <p className="text-white/30 text-center py-4">No active movements detected</p>}
        {stocks.map((stock) => (
          <div key={stock.ticker} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-transparent hover:border-accent/30 transition-all cursor-pointer">
            <div className="flex flex-col">
              <span className="font-bold text-white">{stock.ticker}</span>
              <span className="text-xs text-white/40">{stock.company}</span>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end font-mono font-bold ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {stock.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {stock.change > 0 ? '+' : ''}{stock.change}%
              </div>
              <div className="text-[10px] text-white/30">Z-Score: {stock.zScore}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
