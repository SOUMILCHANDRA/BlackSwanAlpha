import React, { useState, useEffect } from 'react';
import { Globe, BarChart3, Bell, History, Settings, User, Search, Cpu } from 'lucide-react';
import Map from './components/Map';
import Leaderboard from './components/Leaderboard';
import AlertsFeed from './components/AlertsFeed';
import EventPanel from './components/EventPanel';
import FiltersBar from './components/FiltersBar';
import InsightsPanel from './components/InsightsPanel';
import useStore from './store/useStore';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const { setSelectedEvent } = useStore();
  const [events, setEvents] = useState([
    { id: '1', type: 'earthquake', magnitude: 7.4, latitude: 35.6895, longitude: 139.6917, region: 'Tokyo, Japan', timestamp: '10m ago' },
    { id: '2', type: 'wildfire', magnitude: 342, latitude: 34.0522, longitude: -118.2437, region: 'Los Angeles, USA', timestamp: '25m ago' },
  ]);

  const [stocks, setStocks] = useState([
    { 
      ticker: 'CAT', 
      company: 'Caterpillar Inc.', 
      change: 2.45, 
      zScore: 3.1, 
      consistency: 3, 
      sparkline: Array.from({length: 20}, (_, i) => ({val: 5 + Math.sin(i) * 2 + Math.random()})) 
    },
    { 
      ticker: 'URI', 
      company: 'United Rentals', 
      change: 1.82, 
      zScore: 2.4, 
      consistency: 2, 
      sparkline: Array.from({length: 20}, (_, i) => ({val: 8 + Math.cos(i) * 1.5 + Math.random()})) 
    },
    { 
      ticker: 'HD', 
      company: 'Home Depot', 
      change: -0.65, 
      zScore: -1.2, 
      consistency: 3, 
      sparkline: Array.from({length: 20}, (_, i) => ({val: 12 - i * 0.2 + Math.random()})) 
    },
    { 
      ticker: 'ALL', 
      company: 'Allstate Corp', 
      change: -3.21, 
      zScore: -4.5, 
      consistency: 1, 
      sparkline: Array.from({length: 20}, (_, i) => ({val: 10 - Math.sin(i) * 3 + Math.random()})) 
    },
  ]);

  const [alerts, setAlerts] = useState([
    { 
      message: 'Critical: 7.4 Earthquake in Tokyo. Industrial equipment sectors historically surge +4% within 48h repair window.', 
      severity: 'high', 
      timestamp: '10:45 PM',
      impactedTickers: ['CAT', 'URI']
    },
    { 
      message: 'Wildfire alert in SoCal. Energy infrastructure exposed; monitoring NEE and POWI for short-term volatility.', 
      severity: 'medium', 
      timestamp: '10:30 PM',
      impactedTickers: ['NEE', 'POWI']
    },
  ]);

  useEffect(() => {
    socket.on('new_disaster', (event) => {
      setEvents(prev => [event, ...prev]);
    });

    socket.on('stock_anomaly', (anomaly) => {
      setAlerts(prev => [{
        message: `Intelligence: ${anomaly.ticker} movement detected (${anomaly.change}%). Historically correlated with recent ${anomaly.event_type} event.`,
        severity: anomaly.z_score > 2 ? 'high' : 'medium',
        timestamp: new Date().toLocaleTimeString(),
        impactedTickers: [anomaly.ticker]
      }, ...prev]);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="flex bg-background h-screen text-white overflow-hidden font-sans selection:bg-accent/30">
      {/* Sidebar - Bloomberg Inspired */}
      <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-8 bg-card/80 backdrop-blur-xl z-10">
        <div className="p-2 bg-accent rounded-lg mb-6 shadow-lg shadow-accent/20 cursor-pointer hover:scale-105 transition-transform">
          <Globe size={24} />
        </div>
        <div className="flex flex-col gap-6 text-white/30">
          <div className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all cursor-pointer"><BarChart3 size={20} /></div>
          <div className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all cursor-pointer"><Bell size={20} /></div>
          <div className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all cursor-pointer"><Cpu size={20} /></div>
          <div className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all cursor-pointer"><History size={20} /></div>
        </div>
        <div className="mt-auto flex flex-col gap-6 text-white/30">
          <Settings size={18} className="hover:text-white cursor-pointer" />
          <User size={18} className="hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Superior Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-black tracking-[-0.05em] flex items-center gap-2">
              BLACKSWAN <span className="text-accent italic font-light tracking-tighter text-xl">ALPHA</span>
            </h1>
            <div className="h-4 w-px bg-white/10" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input 
                type="text" 
                placeholder="Search events, tickers, or coords..." 
                className="bg-white/5 border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:border-accent/40 transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-success/10 text-success rounded-full border border-success/20 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Live Ingestion Active
            </div>
          </div>
        </header>

        {/* Dynamic Grid Layout */}
        <main className="flex-1 p-4 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden bg-white/[0.01]">
          {/* Filtering Bar */}
          <div className="col-span-12 row-span-1 flex items-center justify-between gap-4">
             <FiltersBar />
             <div className="flex gap-2">
                {['1H', '6H', '24H', '48H'].map(t => (
                  <button key={t} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${t === '24H' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}>
                    {t}
                  </button>
                ))}
             </div>
          </div>

          {/* Core Visualizer */}
          <div className="col-span-12 xl:col-span-8 row-span-5 grid grid-rows-5 gap-4">
            <div className="row-span-4 bg-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative border-t-accent/20">
              <Map events={events} />
            </div>
            
            {/* Metric Strip */}
            <div className="row-span-1 grid grid-cols-4 gap-4">
              {[
                { label: 'Active Disasters', value: events.length, color: 'text-white' },
                { label: 'Anomalies (24h)', value: '07', color: 'text-danger' },
                { label: 'Alpha Signal', value: 'Strong', color: 'text-accent' },
                { label: 'System Confidence', value: '94.2%', color: 'text-success' },
              ].map((stat, i) => (
                <div key={i} className="bg-card/40 hover:bg-card/60 rounded-2xl border border-white/5 p-4 flex flex-col justify-center transition-colors">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{stat.label}</span>
                  <div className="text-xl font-bold font-mono tracking-tighter"><span className={stat.color}>{stat.value}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Intelligence Column */}
          <div className="col-span-12 xl:col-span-4 row-span-5 grid grid-rows-12 gap-4">
            <div className="row-span-5">
              <Leaderboard stocks={stocks} />
            </div>
            <div className="row-span-4">
              <AlertsFeed alerts={alerts} />
            </div>
            <div className="row-span-3">
              <InsightsPanel />
            </div>
          </div>
        </main>
      </div>

      {/* Side Slide-in Panel */}
      <EventPanel />
    </div>
  );
}

export default App;
