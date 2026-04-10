import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const StockCard = ({ stock }) => {
  const isPositive = stock.change >= 0;

  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-accent/40 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">{stock.ticker}</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Info size={12} className="text-white/30" />
            </div>
          </div>
          <span className="text-[10px] text-white/40 block uppercase tracking-tighter">{stock.company}</span>
        </div>
        <div className="text-right">
          <div className={`flex items-center justify-end font-mono font-bold text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {isPositive ? '+' : ''}{stock.change}%
          </div>
          <div className="text-[10px] text-white/30 font-mono">Z: {stock.zScore}</div>
        </div>
      </div>

      <div className="h-12 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.sparkline || []}>
            <defs>
              <linearGradient id={`grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              fillOpacity={1} 
              fill={`url(#grad-${stock.ticker})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-1 h-3 rounded-full ${i <= stock.consistency ? 'bg-accent' : 'bg-white/10'}`} />
          ))}
        </div>
        <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Consistency</span>
      </div>
    </div>
  );
};

export default StockCard;
