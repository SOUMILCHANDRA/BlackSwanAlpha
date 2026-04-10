import React from 'react';
import { AlertTriangle, Info, Zap } from 'lucide-react';

const AlertsFeed = ({ alerts = [] }) => {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5 h-full overflow-hidden flex flex-col border-r-accent/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 flex items-center">
          <Zap size={14} className="mr-2 text-accent animate-pulse" /> Intelligence Stream
        </h2>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/30 font-mono">LIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        {alerts.length === 0 && <p className="text-white/20 text-center py-8 text-xs italic">Awaiting predictive signals...</p>}
        {alerts.map((alert, i) => (
          <div 
            key={i} 
            onClick={() => onAlertClick && onAlertClick(alert)}
            className={`p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/[0.04] active:scale-[0.98] ${
            alert.severity === 'high' ? 'bg-danger/5 border-danger/20' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex gap-3">
              <div className={`mt-0.5 ${alert.severity === 'high' ? 'text-danger' : 'text-accent'}`}>
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-white/90 leading-[1.4] font-medium tracking-tight">
                  {alert.message}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {alert.impactedTickers?.map(t => (
                      <span key={t} className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded text-accent tracking-tighter">{t}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{alert.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsFeed;
