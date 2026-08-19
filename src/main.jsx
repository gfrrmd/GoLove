import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { START, END } from './data/route';
import { interpolateLatLng } from './utils/animation';
import MapView from './components/MapView';
import BottomSheet from './components/BottomSheet';

function App() {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [driverPos, setDriverPos] = useState(START);

  // Searching: 5 detik
  useEffect(() => {
    if (phase !== 'searching') return;
    const t = setTimeout(() => setPhase('tracking'), 5000);
    return () => clearTimeout(t);
  }, [phase]);

  // Tracking: 10 detik
  useEffect(() => {
    if (phase !== 'tracking') return;
    setDriverPos(START);
    const start = performance.now();
    let id;
    const animate = (now) => {
      const p = Math.min((now - start) / 10000, 1);
      setProgress(p);
      setDriverPos(interpolateLatLng(START, END, p));
      if (p < 1) id = requestAnimationFrame(animate);
      else setPhase('arrived');
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [phase]);

  return (
    <main className="app">
      <MapView pos={driverPos} searching={phase === 'searching'} />
      <div className="brand">♥ GoLove</div>
      <BottomSheet
        phase={phase}
        progress={progress}
        onStart={() => { setProgress(0); setDriverPos(START); setPhase('searching'); }}
        onCancel={() => { setProgress(0); setDriverPos(START); setPhase('idle'); }}
        onAccept={() => setPhase('accepted')}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
