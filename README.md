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

### 🌍 Data Ingestion Layer
The platform aggregates data from a diverse ecosystem of high-fidelity sources:

- **🚨 Disaster Alerts**:
  - **USGS**: Magnitude 3.0+ seismic event monitoring.
  - **GDACS**: Global Disaster Alert and Coordination System (RSS).
  - **NASA FIRMS**: VIIRS thermal anomaly (wildfire) detection.
  - **NOAA**: Active severe weather and hurricane alerts.

- **⛅ Meteorological Data**:
  - **Open-Meteo**: ERA5 historical weather reanalysis and high-resolution global forecasts (Temperature, Wind Speed, Humidity).

- **🛰️ Geospatial & Satellite**:
  - **Sentinel Hub (Copernicus)**: STAC-compliant Catalog API and Statistical API for ground-truth satellite verification.
  - **Position-API**: Advanced geographic positioning and spatial intelligence.

- **✈️ Transportation & Logistics**:
  - **OpenSky Network**: Real-time ADS-B state vectors for monitoring airspace and supply chain disruptions.

- **🗞️ News & Sentiment**:
  - **GDELT Project**: Global news monitoring (2.0 APIs), television archives, and contextual analysis.
  - **SerpApi**: Google Trends integration for public interest tracking.

- **💹 Market Data**:
  - **Yahoo Finance**: High-frequency price data for quantitative alpha analysis.

- **🛠️ Infrastructure & Monetization**:
  - **Massive SDK**: Intent-based resource sharing and value exchange (Planned).

## 🔌 API Integration Reference

These snippets serve as technical blueprints for expanding the data ingestion layer.

### Meteorological Analytics (Open-Meteo)
Get real-time and historical weather data for disaster zones:
```bash
# Current & Hourly Forecast
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
```

### Satellite Intelligence (Sentinel Hub)
Search for multi-spectral imagery via the STAC-compliant Catalog API:
```python
data = {
    "bbox": [13, 45, 14, 46],
    "datetime": "2019-12-10T00:00:00Z/2019-12-10T23:59:59Z",
    "collections": ["sentinel-1-grd"],
    "limit": 5,
}
url = "https://sh.dataspace.copernicus.eu/catalog/v1/search"
```

### Airspace Monitoring (OpenSky Network)
Retrieve live state vectors for aircraft to monitor supply chain disruptions:
```json
{
  "time": 1458987225,
  "states": [
    ["c0ffee", "CONAIR", "Germany", 1458987224, 1458987224, 1.28, 51.89, 11500, false, 230, 30, 0, null, 11500, "1234", false, 0]
  ]
}
```

## 🗃️ Database Schema
The system uses PostgreSQL for structured data:
- `events`: Disaster records (USGS, NASA, GDACS, GDELT).
- `watchlists`: Ticker-to-disaster mappings.
- `stock_prices`: Time-series market data.
- `anomalies`: Flagged market movements.

## 📜 Citations & Acknowledgments

This project utilizes data from various academic and open-source sources. We gratefully acknowledge:

### OpenSky Network
If using this data for publications, please cite:
> Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
> "Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
> In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.

### Open-Meteo
Weather data provided under Creative Commons Attribution 4.0 International License (CC BY 4.0).

---
*Disclaimer: Disaster Alpha is for educational and research purposes only. Alpha predictions are based on historical correlations and do not constitute financial advice.*

