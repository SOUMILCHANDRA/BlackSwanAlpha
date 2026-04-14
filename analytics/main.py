from fastapi import FastAPI, HTTPException
import numpy as np
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel
import yfinance as yf

app = FastAPI(title="Disaster Alpha Analytics Engine")

class PricePoint(BaseModel):
    ticker: str
    price: float
    timestamp: str

class DetectionRequest(BaseModel):
    ticker: str
    current_price: float
    historical_prices: List[float]

class SpikeResult(BaseModel):
    ticker: str
    change_percent: float
    z_score: float
    is_anomaly: bool

@app.get("/market/price/{ticker}")
async def get_market_price(ticker: str):
    try:
        # Fetch 2 days of hourly data for recent context
        data = yf.download(ticker, period="2d", interval="1h")
        if data.empty:
            raise HTTPException(status_code=404, detail="Ticker not found or no data available")
        
        # Get the most recent closing price
        current_price = float(data['Close'].iloc[-1])
        # Convert historical prices to list
        historical_prices = data['Close'].values.tolist()
        
        return {
            "ticker": ticker,
            "current_price": current_price,
            "historical_prices": historical_prices,
            "timestamp": str(data.index[-1])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "analyzing"}

@app.post("/analyze/spike", response_model=SpikeResult)
def detect_spike(data: DetectionRequest):
    if len(data.historical_prices) < 2:
        raise HTTPException(status_code=400, detail="Not enough historical data for Z-score")
    
    historical = np.array(data.historical_prices)
    mean = np.mean(historical)
    std = np.std(historical)
    
    if std == 0:
        z_score = 0
    else:
        z_score = (data.current_price - mean) / std
    
    change_percent = ((data.current_price - historical[-1]) / historical[-1]) * 100
    
    return SpikeResult(
        ticker=data.ticker,
        change_percent=round(change_percent, 2),
        z_score=round(z_score, 2),
        is_anomaly=abs(z_score) > 2.0
    )

@app.get("/ingest/emdat")
async def ingest_emdat(file_path: str):
    try:
        # Load EMDAT Excel file
        xl = pd.ExcelFile(file_path)
        df = None
        
        # Try to find the data sheet (often has many columns or specific keywords)
        for sheet_name in xl.sheet_names:
            temp_df = xl.parse(sheet_name)
            if 'Dis No' in temp_df.columns or 'Disaster Type' in temp_df.columns:
                df = temp_df
                break
        
        if df is None:
            # Fallback to first sheet if keywords not found
            df = xl.parse(xl.sheet_names[0])
        
        # Skip header rows if necessary (EMDAT often has a few rows of metadata at top)
        # We look for the row where 'Dis No' appears
        if 'Dis No' not in df.columns:
            # Search in first few rows
            for i in range(10):
                if 'Dis No' in df.iloc[i].values:
                    df.columns = df.iloc[i]
                    df = df.iloc[i+1:].reset_index(drop=True)
                    break

        required_cols = ['Dis No', 'Year', 'Disaster Type', 'Country']
        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing required column: {col}")
        
        events = []
        # Filter for rows with coordinates
        geo_df = df.dropna(subset=['Latitude', 'Longitude'])
        
        for _, row in geo_df.iterrows():
            # Create a timestamp from Year/Month/Day if possible, else just use Year
            month = int(row['Month']) if not pd.isna(row.get('Month')) else 1
            day = int(row['Day']) if not pd.isna(row.get('Day')) else 1
            
            try:
                timestamp = f"{int(row['Year'])}-{month:02d}-{day:02d}T00:00:00Z"
            except:
                timestamp = f"{int(row['Year'])}-01-01T00:00:00Z"

            events.append({
                "external_id": str(row['Dis No']),
                "type": str(row['Disaster Type']).lower(),
                "latitude": float(row['Latitude']),
                "longitude": float(row['Longitude']),
                "region": f"{row['Location']}, {row['Country']}" if not pd.isna(row.get('Location')) else str(row['Country']),
                "timestamp": timestamp,
                "magnitude": float(row['Magnitude']) if not pd.isna(row.get('Magnitude')) else 0.0
            })
            
        return {"status": "success", "count": len(events), "events": events[:100]} # Limit for sanity
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
