import os
import requests
import time
from threading import Lock
from dotenv import load_dotenv

load_dotenv()

class SentinelAuth:
    def __init__(self):
        self.client_id = os.getenv("SENTINEL_CLIENT_ID")
        self.client_secret = os.getenv("SENTINEL_CLIENT_SECRET")
        self.token_url = "https://services.sentinel-hub.com/oauth/token"
        self._token = None
        self._expiry_time = 0
        self._lock = Lock()

    def get_token(self):
        with self._lock:
            # Check if token is still valid (with a 1-minute buffer)
            if self._token and time.time() < self._expiry_time - 60:
                return self._token

            return self._refresh_token()

    def _refresh_token(self):
        if not self.client_id or not self.client_secret:
            # If not in env, we might be in a dev environment where they aren't provided yet
            # but we should still raise an error if we try to use it.
            raise ValueError("SENTINEL_CLIENT_ID and SENTINEL_CLIENT_SECRET must be set in environment variables")

        payload = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }

        try:
            response = requests.post(self.token_url, data=payload, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            self._token = data.get("access_token")
            # expires_in is usually in seconds
            expires_in = data.get("expires_in", 3600)
            self._expiry_time = time.time() + expires_in
            
            return self._token
        except Exception as e:
            print(f"Error fetching Sentinel Hub token: {e}")
            raise

# Singleton instance
sentinel_auth = SentinelAuth()
