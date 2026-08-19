import React from 'react';
import { mapRoads, routePoints, blocks } from '../data/route';

const W = 400, H = 700;

export default function MapView({ pos, searching }) {
  const dest = routePoints.at(-1);
  const toP = (p) => ({ left: (p.x / W * 100) + '%', top: (p.y / H * 100) + '%' });

  return (
    <div className="map">
      <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        {/* Latar */}
        <rect width={W} height={H} fill="#f0f2ee" />

        {/* Blok bangunan — warna flat, tanpa border ramai */}
        {blocks.map((b, i) => (
          <rect key={i} x={b.x+2} y={b.y+2} width={b.w-4} height={b.h-4} rx="4" fill="#e4e8e0" />
        ))}

        {/* Jalan: shadow */}
        {mapRoads.map((r, i) => (
          <polyline key={'s'+i} points={r.points.map(p=>p.join(',')).join(' ')}
            fill="none" stroke="#c6ccc2" strokeWidth="13"
            strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* Jalan: permukaan putih */}
        {mapRoads.map((r, i) => (
          <polyline key={'r'+i} points={r.points.map(p=>p.join(',')).join(' ')}
            fill="none" stroke="#ffffff" strokeWidth="9"
            strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* Rute cintaku — garis hijau di atas jalan */}
        <polyline
          points={routePoints.map(p=>`${p.x},${p.y}`).join(' ')}
          fill="none" stroke="#00b14f" strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Titik-titik belokan rute */}
        {routePoints.slice(1, -1).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00b14f" opacity="0.5" />
        ))}
      </svg>

      {/* Marker tujuan */}
      <div className="marker destination" style={toP(dest)}>
        <div className="pin">♥</div>
        <small>Kamu</small>
      </div>

      {/* Marker cintaku */}
      <div className={`marker driver${searching ? ' searching' : ''}`} style={toP(pos)}>
        <div className="car">♥</div>
        <small>Cintaku</small>
      </div>
    </div>
  );
}
