import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CENTER, START, END } from '../data/route';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeIcon = (bg, emoji, label) => L.divIcon({
  className: '',
  iconAnchor: [20, 50],
  html: `<div style="display:flex;flex-direction:column;align-items:center">
    <div style="width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:${bg};display:grid;place-items:center;color:#fff;font-size:18px;
      box-shadow:0 4px 14px rgba(0,0,0,.28)">
      <span style="transform:rotate(45deg)">${emoji}</span>
    </div>
    <div style="margin-top:6px;padding:3px 9px;background:#fff;border-radius:7px;
      font-size:10px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.15);white-space:nowrap">
      ${label}
    </div>
  </div>`,
});

const iconDriver = makeIcon('#00b14f', '\u2665', 'Cintaku');
const iconSearch = makeIcon('#f59e0b', '\u2665', 'Mencari...');
const iconDest   = makeIcon('#e5484d', '\u2665', 'Kamu');

function MovingMarker({ pos, searching }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.setLatLng(pos); }, [pos]);
  return <Marker ref={ref} position={pos} icon={searching ? iconSearch : iconDriver} />;
}

// Fit bounds dengan offset bawah agar tidak tertutup bottom sheet
function FitRoute({ route, phase }) {
  const map = useMap();

  useEffect(() => {
    if (phase === 'idle' || phase === 'searching') {
      // Sebelum rute datang: tampilkan kedua marker saja,
      // dengan paddingBottom besar agar tidak tertutup sheet
      map.fitBounds([START, END], {
        paddingTopLeft: [40, 60],
        paddingBottomRight: [40, 320],
      });
    }
  }, [phase]);

  useEffect(() => {
    if (route?.length >= 2) {
      // Setelah rute OSRM datang: fit ke seluruh rute
      map.fitBounds(route, {
        paddingTopLeft: [40, 60],
        paddingBottomRight: [40, 280],
      });
    }
  }, [route]);

  return null;
}

export default function MapView({ pos, searching, route, remaining, phase }) {
  // Garis hijau:
  // - idle / searching            : tidak ada garis (rute belum diketahui)
  // - tracking                    : garis memendek (remaining)
  // - arrived / accepted          : tidak ada garis (sudah selesai)
  const showLine = phase === 'tracking' && remaining?.length >= 2;

  return (
    <MapContainer center={CENTER} zoom={14} className="map" zoomControl={false}
      attributionControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitRoute route={route} phase={phase} />

      {/* Garis rute memendek hanya saat tracking */}
      {showLine && (
        <Polyline
          positions={remaining}
          pathOptions={{
            color: '#00b14f',
            weight: 6,
            opacity: 0.88,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {/* Marker tujuan */}
      <Marker position={END} icon={iconDest} />

      {/* Marker cintaku */}
      {pos && <MovingMarker pos={pos} searching={searching} />}
    </MapContainer>
  );
}
