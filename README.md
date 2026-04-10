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
- **Real-time Map**: Global visualization of disaster events using Leaflet.
- **Spike Detection Engine**: Python-based Z-score analysis for stock price anomalies.
- **Live Intelligence Feed**: Real-time alerts via WebSockets.
- **Sector Mapping**: Intelligent mapping of disaster types (Hurricanes, Earthquakes) to relevant stock sectors (Energy, Logistics, Insurance).

## 🗃️ Database Schema
The system uses PostgreSQL for structured data:
- `events`: Disaster records.
- `watchlists`: Ticker-to-disaster mappings.
- `stock_prices`: Time-series market data.
- `anomalies`: Flagged market movements.

## 🎨 UI/UX
Designed with a Bloomberg-style dark theme for high-signal data density and clarity.
