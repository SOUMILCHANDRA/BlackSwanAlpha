import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useStore from '../store/useStore';

const DisasterMap = ({ events = [] }) => {
  const center = [20, 0];
  const { setSelectedEvent, activeFilter } = useStore();

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(e => e.type === activeFilter);

  return (
    <div className="h-full w-full relative group">
      <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%', background: '#0a0a0c' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        {filteredEvents.map((event) => (
          <React.Fragment key={event.id}>
            <Marker 
              position={[event.latitude, event.longitude]}
              eventHandlers={{
                click: () => setSelectedEvent(event),
              }}
            >
              <Popup>
                <div className="text-black font-sans">
                  <h3 className="font-bold border-b border-black/10 pb-1 mb-1">{event.type.toUpperCase()}</h3>
                  <p className="text-xs">{event.region}</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[event.latitude, event.longitude]} 
              radius={event.magnitude * 50000 || 100000}
              pathOptions={{ 
                color: event.type === 'earthquake' ? '#ef4444' : '#3b82f6', 
                fillColor: event.type === 'earthquake' ? '#ef4444' : '#3b82f6', 
                fillOpacity: 0.1,
                weight: 1
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
