import React from 'react';
import { mapRoads, routePoints } from '../data/route';

function toPoints(pts) {
  return pts.map((p) => p.join(',')).join(' ');
}

export default function MapView({ pos, searching }) {
  const dest = routePoints.at(-1);
  return (
    <div className="map">
      <div className="pattern" />
      {mapRoads.map((road, i) => (
        <svg className="roads" key={i}>
          <polyline points={toPoints(road.points)} fill="none" stroke="#fff" strokeWidth={road.width} vectorEffect="non-scaling-stroke" />
          <polyline points={toPoints(road.points)} fill="none" stroke="#cbd5cf" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
      <svg className="route">
        <polyline
          points={routePoints.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="#00b14f" strokeWidth="1.2"
          strokeDasharray="2 1" vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="marker destination" style={{ left: dest.x + '%', top: dest.y + '%' }}>
        <span>♥</span><small>Kamu</small>
      </div>
      <div className={`marker driver${searching ? ' searching' : ''}`} style={{ left: pos.x + '%', top: pos.y + '%' }}>
        <span>♥</span><small>Cintaku</small>
      </div>
    </div>
  );
}
