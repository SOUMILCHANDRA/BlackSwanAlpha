# Disaster Alpha 🌍📈

**Disaster Alpha** is a production-grade real-time intelligence platform that tracks natural disasters globally and analyzes their impact on stock market movements.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local dev)
- Python 3.10+ (for analytics dev)

### Quick Start (Docker)
Run the entire stack with one command:
```bash
docker-compose up --build
```

### Manual Setup

#### 1. Backend (Node.js)
```bash
cd backend
npm install
npm run seed  # Populate with initial data
npm run dev
```

#### 2. Analytics (Python)
```bash
cd analytics
pip install -r requirements.txt
python main.py
```

#### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Features

### Bloomberg-Style Intelligence
- **Event Drill-Down**: Interactive slide-in panels provides deep-dive analytics on specific disaster events.
- **Alpha Predictions**: Quantitative estimates of stock movement based on historical correlation.
- **Sparkline Visuals**: Real-time trend charts for all tracked assets.
- **Consistency Tracking**: Intelligence-driven ranking of companies that frequently react to specific disaster types.
- **Smart Stream**: Notifications that explain *why* an event matters to specific sectors.

### 🌍 Real-Time Ingestion
- **USGS**: Magnitude 3.0+ seismic event monitoring.
- **NASA FIRMS**: VIIRS thermal anomaly (wildfire) detection.
- **NOAA**: Active severe weather and hurricane alerts.
- **Yahoo Finance**: High-frequency price data for quantitative analysis.

## 🗃️ Database Schema
The system uses PostgreSQL for structured data:
- `events`: Disaster records.
- `watchlists`: Ticker-to-disaster mappings.
- `stock_prices`: Time-series market data.
- `anomalies`: Flagged market movements.

## 🎨 UI/UX
Designed with a Bloomberg-style dark theme for high-signal data density and clarity.
