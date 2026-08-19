import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CENTER, START, END } from '../data/route';
import 'leaflet/dist/leaflet.css';

// Fix default icon leaflet di Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icon kustom HTML
const makeIcon = (bg, emoji, label) => L.divIcon({
  className: '',
  iconAnchor: [20, 44],
  popupAnchor: [0, -44],
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        width:40px;height:40px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${bg};
        display:grid;place-items:center;
        box-shadow:0 4px 12px rgba(0,0,0,.25);
        color:#fff;font-size:18px;
      ">
        <span style="transform:rotate(45deg);display:inline-block">${emoji}</span>
      </div>
      <div style="
        margin-top:6px;padding:3px 8px;
        background:#fff;border-radius:7px;
        font-size:10px;font-weight:800;
        box-shadow:0 2px 6px rgba(0,0,0,.15);
        white-space:nowrap;
      ">${label}</div>
    </div>
  `,
});

const driverIcon  = makeIcon('#00b14f', '♥', 'Cintaku');
const destIcon    = makeIcon('#e5484d', '♥', 'Kamu');
const searchIcon  = makeIcon('#00b14f', '♥', 'Mencari...');

// Komponen untuk update posisi marker tanpa re-render map
function MovingMarker({ pos, searching }) {
  const markerRef = useRef(null);
  const icon = searching ? searchIcon : driverIcon;

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(pos);
    }
  }, [pos]);

  return <Marker ref={markerRef} position={pos} icon={icon} />;
}

// Auto-fit bounds saat pertama load
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([START, END], { padding: [60, 60] });
  }, []);
  return null;
}

export default function MapView({ pos, searching }) {
  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      className="map"
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds />

      {/* Garis rute */}
      <Polyline
        positions={[START, END]}
        pathOptions={{ color: '#00b14f', weight: 5, opacity: 0.8, dashArray: '10 6' }}
      />

      {/* Marker tujuan */}
      <Marker position={END} icon={destIcon} />

      {/* Marker cintaku (bergerak) */}
      <MovingMarker pos={pos} searching={searching} />
    </MapContainer>
  );
}
