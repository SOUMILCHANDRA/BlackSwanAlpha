const axios = require('axios');
const db = require('../config/db');

const { parse } = require('csv-parse/sync');

class DisasterService {
  async fetchEarthquakes() {
    try {
      const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      const earthquakes = response.data.features;
      
      for (const quake of earthquakes) {
        const { id, properties, geometry } = quake;
        const [longitude, latitude] = geometry.coordinates;
        const { mag, place, time } = properties;

        if (mag < 3.0) continue;

        const timestamp = new Date(time);

        await db.query(
          `INSERT INTO events (external_id, type, magnitude, latitude, longitude, region, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (external_id) DO NOTHING`,
          [id, 'earthquake', mag, latitude, longitude, place, timestamp]
        );
      }
      console.log(`Synced ${earthquakes.length} earthquakes.`);
    } catch (err) {
      console.error('Error fetching USGS data:', err.message);
    }
  }

  async fetchWildfires() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = `${process.env.NASA_FIRMS_URL}${process.env.NASA_API_KEY}/VIIRS_SNPP_NRT/world/1/${today}`;
      
      const response = await axios.get(url);
      const records = parse(response.data, {
        columns: true,
        skip_empty_lines: true
      });

      for (const record of records) {
        const { latitude, longitude, bright_ti4, acq_date, acq_time } = record;
        const external_id = `firms-${latitude}-${longitude}-${acq_date}`;
        
        // Intensity check (brightness temperature > 330K)
        if (parseFloat(bright_ti4) < 330) continue;

        await db.query(
          `INSERT INTO events (external_id, type, magnitude, latitude, longitude, region, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (external_id) DO NOTHING`,
          [external_id, 'wildfire', parseFloat(bright_ti4), parseFloat(latitude), parseFloat(longitude), 'VIIRS Detection', new Date(`${acq_date}T${acq_time.slice(0,2)}:${acq_time.slice(2,4)}:00Z`)]
        );
      }
      console.log(`Synced ${records.length} wildfires.`);
    } catch (err) {
      console.error('Error fetching NASA FIRMS data:', err.message);
    }
  }

  async fetchWeatherAlerts() {
    try {
      const response = await axios.get('https://api.weather.gov/alerts/active', {
        headers: { 'User-Agent': 'DisasterAlpha (contact@disasteralpha.com)' }
      });
      const alerts = response.data.features;

      for (const alert of alerts) {
        const { id, properties } = alert;
        const { event, severity, areaDesc, onset } = properties;

        // Map to our types if relevant (Hurricane, Flood, etc.)
        let type = 'weather';
        if (event.toLowerCase().includes('hurricane')) type = 'hurricane';
        if (event.toLowerCase().includes('flood')) type = 'flood';

        // Approximate coordinates if geometry is null (simplified)
        const latitude = 0, longitude = 0; 

        await db.query(
          `INSERT INTO events (external_id, type, severity, latitude, longitude, region, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (external_id) DO NOTHING`,
          [id, type, severity, latitude, longitude, areaDesc, new Date(onset)]
        );
      }
      console.log(`Synced ${alerts.length} weather alerts.`);
    } catch (err) {
      console.error('Error fetching NOAA alerts:', err.message);
    }
  }

  startPolling() {
    setInterval(() => {
      this.fetchEarthquakes();
      this.fetchWildfires();
      this.fetchWeatherAlerts();
    }, 5 * 60 * 1000);
    
    this.fetchEarthquakes();
    this.fetchWildfires();
    this.fetchWeatherAlerts();
  }
}

module.exports = new DisasterService();
