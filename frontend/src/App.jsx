import React, { useState, useEffect } from 'react';
import { Globe, BarChart3, Bell, History, Settings, User } from 'lucide-react';
import Map from './components/Map';
import Leaderboard from './components/Leaderboard';
import AlertsFeed from './components/AlertsFeed';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [events, setEvents] = useState([
    { id: '1', type: 'earthquake', magnitude: 6.8, latitude: 35.6895, longitude: 139.6917, region: 'Tokyo, Japan', timestamp: '10m ago' },
    { id: '2', type: 'wildfire', magnitude: 5.2, latitude: 34.0522, longitude: -118.2437, region: 'Los Angeles, USA', timestamp: '25m ago' },
  ]);

  const [stocks, setStocks] = useState([
    { ticker: 'CAT', company: 'Caterpillar Inc.', change: 2.45, zScore: 3.1 },
    { ticker: 'URI', company: 'United Rentals', change: 1.82, zScore: 2.4 },
    { ticker: 'HD', company: 'Home Depot', change: -0.65, zScore: -1.2 },
    { ticker: 'ALL', company: 'Allstate Corp', change: -3.21, zScore: -4.5 },
  ]);

  const [alerts, setAlerts] = useState([
    { message: '6.8 Magnitude Earthquake detected near Tokyo. Historical data suggests impact on Manufacturing indices.', severity: 'high', timestamp: '10:45 PM' },
    { message: 'Wildfire alert in Southern California. Monitoring NEE and POWI for volatility.', severity: 'medium', timestamp: '10:30 PM' },
  ]);

  useEffect(() => {
    socket.on('new_disaster', (event) => {
      setEvents(prev => [event, ...prev]);
    });

    socket.on('stock_anomaly', (anomaly) => {
      setAlerts(prev => [{
        message: `High Volatility: ${anomaly.ticker} moved ${anomaly.change}% (Z-Score: ${anomaly.z_score})`,
        severity: 'high',
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="flex bg-background h-screen text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-8 bg-card/50">
        <div className="p-2 bg-accent rounded-lg mb-4">
          <Globe size={24} />
        </div>
        <div className="flex flex-col gap-6 text-white/40">
          <BarChart3 size={20} className="hover:text-white cursor-pointer transition-colors" />
          <Bell size={20} className="hover:text-white cursor-pointer transition-colors" />
          <History size={20} className="hover:text-white cursor-pointer transition-colors" />
          <div className="mt-auto flex flex-col gap-6">
            <Settings size={20} className="hover:text-white cursor-pointer transition-colors" />
            <User size={20} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tighter">DISASTER <span className="text-accent italic text-2xl">ALPHA</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full border border-success/20 text-xs font-mono">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              SYSTEM OPERATIONAL
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <span className="font-mono">LIVE FEED:</span>
              <span className="text-white">USGS | NASA FIRMS | NOAA</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Map Section */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-6 overflow-hidden">
            <div className="flex-1 min-h-0 bg-card rounded-xl border border-white/10 relative overflow-hidden">
              <Map events={events} />
            </div>
            
            <div className="h-48 grid grid-cols-3 gap-6">
              {[
                { label: 'Events Today', value: '42', delta: '+12%' },
                { label: 'Major Anomalies', value: '07', delta: 'Active' },
                { label: 'Confidence Score', value: '94.2%', delta: 'High' },
              ].map((stat, i) => (
                <div key={i} className="bg-card/40 rounded-xl border border-white/5 p-4 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{stat.label}</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold font-mono">{stat.value}</span>
                    <span className="text-[10px] text-success font-mono">{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="col-span-12 xl:col-span-4 grid grid-rows-2 gap-6 overflow-hidden">
            <Leaderboard stocks={stocks} />
            <AlertsFeed alerts={alerts} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
