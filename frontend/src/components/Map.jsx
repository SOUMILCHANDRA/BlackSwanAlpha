import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DisasterMap = ({ events = [] }) => {
  const center = [20, 0]; // Default world view

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%', background: '#0a0a0c' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <Marker position={[event.latitude, event.longitude]}>
              <Popup>
                <div className="text-black">
                  <h3 className="font-bold">{event.type.toUpperCase()}</h3>
                  <p>{event.region}</p>
                  <p className="text-sm">Mag: {event.magnitude}</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[event.latitude, event.longitude]} 
              radius={event.magnitude * 50000}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
