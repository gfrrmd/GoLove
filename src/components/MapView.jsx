import React from 'react';
import { mapRoads, routePoints, buildings } from '../data/route';

const VB_W = 400;
const VB_H = 700;

export default function MapView({ pos, searching, rotation }) {
  const dest = routePoints.at(-1);

  // Konversi koordinat SVG → persen untuk posisi marker div
  const toPercent = (p) => ({
    left: (p.x / VB_W) * 100 + '%',
    top:  (p.y / VB_H) * 100 + '%',
  });

  return (
    <div className="map">
      {/* Layer SVG: jalan + rute */}
      <svg
        className="map-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width={VB_W} height={VB_H} fill="#f2f3f0" />

        {/* Blok bangunan */}
        {buildings.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#e0e4dd" stroke="#d0d5cd" strokeWidth="0.5" />
            <rect x={b.x+4} y={b.y+4} width={b.w-8} height={b.h-8} rx="2" fill="#dde2d9" />
          </g>
        ))}

        {/* Jalan (border luar abu) */}
        {mapRoads.map((r, i) => (
          <polyline
            key={'border-' + i}
            points={r.points.map(p => p.join(',')).join(' ')}
            fill="none"
            stroke="#c8cdc5"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Jalan (isi putih) */}
        {mapRoads.map((r, i) => (
          <polyline
            key={'road-' + i}
            points={r.points.map(p => p.join(',')).join(' ')}
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Label nama jalan */}
        {mapRoads.filter(r => r.label).map((r, i) => {
          const mid = Math.floor(r.points.length / 2);
          const [x, y] = r.points[mid];
          const isHoriz = r.points[0][1] === r.points[1][1];
          return (
            <text
              key={'label-' + i}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fill="#9da8a0"
              transform={isHoriz ? '' : `rotate(-90, ${x}, ${y})`}
            >
              {r.label}
            </text>
          );
        })}

        {/* Rute yang dilalui cintaku – garis hijau tebal */}
        <polyline
          points={routePoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#00b14f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Rute sudah dilalui – lebih terang */}
        <polyline
          points={routePoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#b2eacb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Marker: Tujuan (Kamu) */}
      <div className="marker destination" style={toPercent(dest)}>
        <div className="pin red">
          <span>♥</span>
        </div>
        <small>Kamu</small>
      </div>

      {/* Marker: Cintaku (bergerak) */}
      <div
        className={`marker driver${searching ? ' searching' : ''}`}
        style={toPercent(pos)}
      >
        <div
          className="car-icon"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          ♥
        </div>
        <small>Cintaku</small>
      </div>
    </div>
  );
}
