import StockCard from './StockCard';

const Leaderboard = ({ stocks = [] }) => {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5 h-full overflow-hidden flex flex-col border-l-accent/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Market Intelligence</h2>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        {stocks.length === 0 && <p className="text-white/20 text-center py-8 text-xs italic">No active anomalies detected...</p>}
        {stocks.map((stock) => (
          <StockCard key={stock.ticker} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
