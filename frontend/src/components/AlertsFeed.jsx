import React from 'react';
import { AlertTriangle, Info, Zap } from 'lucide-react';

const AlertsFeed = ({ alerts = [] }) => {
  return (
    <div className="bg-card border border-white/10 rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center">
        <Zap size={14} className="mr-2 text-accent" /> Live Intelligence Feed
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts.length === 0 && <p className="text-white/30 text-center py-4">Waiting for incoming data...</p>}
        {alerts.map((alert, i) => (
          <div key={i} className={`p-3 rounded-lg border flex gap-3 ${
            alert.severity === 'high' ? 'bg-danger/10 border-danger/30' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`mt-1 ${alert.severity === 'high' ? 'text-danger' : 'text-accent'}`}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm text-white/90 leading-tight">{alert.message}</p>
              <span className="text-[10px] text-white/30 uppercase mt-1 inline-block">{alert.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsFeed;
