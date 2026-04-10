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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
