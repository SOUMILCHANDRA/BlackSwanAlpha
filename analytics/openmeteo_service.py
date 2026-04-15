import requests
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

OPENSKY_URL = "https://opensky-network.org/api/states/all"
OPENMETEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

def get_weather_context(lat, lon, timestamp):
    """
    Fetches historical weather context from Open-Meteo for a specific event.
    
    Args:
        lat (float): Latitude
        lon (float): Longitude
        timestamp (str): ISO timestamp, e.g., '2024-01-01T12:00:00Z'
        
    Returns:
        dict: Weather summary including temperature, wind speed, and precipitation.
    """
    try:
        # Extract date from timestamp
        date_str = timestamp.split('T')[0]
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": date_str,
            "end_date": date_str,
            "hourly": "temperature_2m,wind_speed_10m,precipitation,relative_humidity_2m",
            "timezone": "UTC"
        }
        
        response = requests.get(OPENMETEO_ARCHIVE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'hourly' not in data:
            return {"error": "No weather data found for this location/time"}
            
        # Get mean values for the day as a simple context
        hourly = data['hourly']
        summary = {
            "avg_temp": sum(hourly['temperature_2m']) / len(hourly['temperature_2m']),
            "max_wind_speed": max(hourly['wind_speed_10m']),
            "total_precipitation": sum(hourly['precipitation']),
            "unit": "metric"
        }
        
        return summary
    except Exception as e:
        logger.error(f"Failed to fetch Open-Meteo data: {e}")
        return {"error": str(e)}

def get_airspace_density(bbox):
    """
    Checks airspace density using OpenSky Network (Bonus integration mentioned in README).
    bbox: [min_lon, min_lat, max_lon, max_lat]
    """
    try:
        # OpenSky uses [lamin, lomin, lamax, lomax]
        params = {
            "lamin": bbox[1],
            "lomin": bbox[0],
            "lamax": bbox[3],
            "lomax": bbox[2]
        }
        response = requests.get(OPENSKY_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        states = data.get('states', [])
        return {
            "aircraft_count": len(states) if states else 0,
            "timestamp": data.get('time')
        }
    except Exception as e:
        logger.error(f"Failed to fetch OpenSky data: {e}")
        return {"error": str(e)}
