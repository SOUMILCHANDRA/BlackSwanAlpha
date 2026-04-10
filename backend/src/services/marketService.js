const axios = require('axios');
const db = require('../config/db');

class MarketService {
  async getWatchlistTickers(disasterType) {
    const { rows } = await db.query(
      'SELECT ticker FROM watchlists WHERE disaster_type = $1',
      [disasterType]
    );
    return rows.map(r => r.ticker);
  }

  async fetchStockPrice(ticker) {
    try {
      const analyticsUrl = `${process.env.ANALYTICS_SERVICE_URL}/market/price/${ticker}`;
      const response = await axios.get(analyticsUrl);
      const { current_price, timestamp } = response.data;

      await db.query(
        'INSERT INTO stock_prices (ticker, price, timestamp) VALUES ($1, $2, $3)',
        [ticker, current_price, new Date(timestamp)]
      );

      return { ticker, price: current_price, timestamp };
    } catch (err) {
      console.error(`Error fetching real price for ${ticker} from analytics:`, err.message);
      // Fallback to mock if needed or just log error
    }
  }

  async trackEventImpact(disasterEvent) {
    const tickers = await this.getWatchlistTickers(disasterEvent.type);
    console.log(`Tracking impact for event ${disasterEvent.id} on tickers: ${tickers.join(', ')}`);
    
    for (const ticker of tickers) {
      await this.fetchStockPrice(ticker);
    }
  }
}

module.exports = new MarketService();
