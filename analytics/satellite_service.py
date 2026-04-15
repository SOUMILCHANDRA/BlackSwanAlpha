import requests
import json
import logging
from sentinel_auth import sentinel_auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

STATISTICS_URL = "https://services.sentinel-hub.com/api/v1/statistics"

def get_ndvi_statistics(bbox, from_date, to_date):
    """
    Fetches NDVI statistics for a given bounding box and time range from Sentinel Hub.
    
    Args:
        bbox (list): [min_lon, min_lat, max_lon, max_lat]
        from_date (str): Start date in ISO format, e.g., '2024-01-01T00:00:00Z'
        to_date (str): End date in ISO format, e.g., '2024-01-02T00:00:00Z'
        
    Returns:
        dict: The statistics JSON response from Sentinel Hub.
    """
    try:
        token = sentinel_auth.get_token()
    except Exception as e:
        logger.error(f"Failed to obtain Sentinel token: {e}")
        raise

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    body = {
        "input": {
            "bounds": {
                "bbox": bbox
            },
            "data": [{
                "type": "sentinel-2-l2a"
            }]
        },
        "aggregation": {
            "timeRange": {
                "from": from_date,
                "to": to_date
            },
            "aggregationInterval": {
                "of": "P1D"
            }
        },
        "evalscript": """
        // NDVI calculation
        // NDVI = (NIR - RED) / (NIR + RED)
        // Sentinel-2: B08 is NIR, B04 is RED
        return [ (B08 - B04) / (B08 + B04) ];
        """
    }

    try:
        response = requests.post(STATISTICS_URL, headers=headers, json=body, timeout=30)
        
        # If token expired unexpectedly, try refreshing once
        if response.status_code == 401:
            logger.warning("Token expired or invalid, attempting to refresh...")
            token = sentinel_auth._refresh_token()
            headers["Authorization"] = f"Bearer {token}"
            response = requests.post(STATISTICS_URL, headers=headers, json=body, timeout=30)
            
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sentinel API error: {response.text}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error calling Sentinel Hub API: {e}")
        raise

if __name__ == "__main__":
    # Quick test if run directly (requires env vars)
    try:
        test_bbox = [77.5, 18.5, 78.5, 19.5]
        test_from = "2024-01-01T00:00:00Z"
        test_to = "2024-01-02T00:00:00Z"
        stats = get_ndvi_statistics(test_bbox, test_from, test_to)
        print("Success!")
        print(json.dumps(stats, indent=2))
    except Exception as e:
        print(f"Test failed: {e}")
