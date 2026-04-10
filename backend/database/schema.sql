-- Disaster Alpha Database Schema

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE, -- ID from source API (USGS, etc.)
    type TEXT NOT NULL, -- 'earthquake', 'wildfire', 'hurricane'
    severity TEXT,
    magnitude FLOAT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    region TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Watchlists Table (Disaster Type -> Stocks)
CREATE TABLE IF NOT EXISTS watchlists (
    id SERIAL PRIMARY KEY,
    disaster_type TEXT NOT NULL, -- 'earthquake', etc.
    ticker TEXT NOT NULL,
    company_name TEXT,
    impact_type TEXT, -- 'Direct', 'Positive', 'Negative'
    UNIQUE(disaster_type, ticker)
);

-- 3. Stock Prices Table
CREATE TABLE IF NOT EXISTS stock_prices (
    id BIGSERIAL PRIMARY KEY,
    ticker TEXT NOT NULL,
    price FLOAT NOT NULL,
    volume BIGINT,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Anomalies Table
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    ticker TEXT NOT NULL,
    change_percent FLOAT NOT NULL,
    z_score FLOAT NOT NULL,
    time_window TEXT NOT NULL, -- '1h', '6h', '24h'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Historical Stats Table
CREATE TABLE IF NOT EXISTS historical_stats (
    id SERIAL PRIMARY KEY,
    disaster_type TEXT NOT NULL,
    region TEXT,
    avg_change FLOAT,
    confidence FLOAT,
    sample_size INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_stock_prices_ticker_time ON stock_prices(ticker, timestamp);
CREATE INDEX IF NOT EXISTS idx_anomalies_event ON anomalies(event_id);

-- Initial Data for Watchlists
INSERT INTO watchlists (disaster_type, ticker, company_name, impact_type) VALUES
('hurricane', 'HD', 'Home Depot', 'Positive'),
('hurricane', 'LOW', 'Lowes', 'Positive'),
('hurricane', 'TREX', 'Trex Company', 'Positive'),
('hurricane', 'ALL', 'Allstate', 'Negative'),
('wildfire', 'POWI', 'Power Integrations', 'Negative'),
('wildfire', 'NEE', 'NextEra Energy', 'Negative'),
('wildfire', 'TSLA', 'Tesla', 'Mixed'),
('earthquake', 'CAT', 'Caterpillar', 'Positive'),
('earthquake', 'URI', 'United Rentals', 'Positive')
ON CONFLICT DO NOTHING;
