import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { START } from './data/route';
import { fetchRoute } from './utils/routing';
import { interpolateRoute, remainingRoute } from './utils/animation';
import MapView from './components/MapView';
import BottomSheet from './components/BottomSheet';

function App() {
  const [phase, setPhase]         = useState('idle');
  const [progress, setProgress]   = useState(0);
  const [route, setRoute]         = useState(null);      // semua titik rute OSRM
  const [pos, setPos]             = useState(START);     // posisi marker saat ini
  const [remaining, setRemaining] = useState(null);      // sisa rute (memendek)
  const [error, setError]         = useState('');

  // ─── Searching: fetch rute OSRM, lalu mulai tracking ───
  useEffect(() => {
    if (phase !== 'searching') return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setError('');
        const points = await fetchRoute();
        if (cancelled) return;
        setRoute(points);
        setRemaining(points);   // mula-mula garis penuh
        setPos(points[0]);
        setPhase('tracking');
      } catch (e) {
        if (!cancelled) {
          setError('Gagal mengambil rute. Coba lagi.');
          setPhase('idle');
        }
      }
    }, 5000);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [phase]);

  // ─── Tracking: animasi 10 detik, garis memendek ───
  useEffect(() => {
    if (phase !== 'tracking' || !route?.length) return;

    const startTime = performance.now();
    let id;

    function animate(now) {
      const t = Math.min((now - startTime) / 10000, 1);
      setProgress(t);
      setPos(interpolateRoute(route, t));
      setRemaining(remainingRoute(route, t));   // potong garis dari posisi sekarang

      if (t < 1) id = requestAnimationFrame(animate);
      else setPhase('arrived');
    }

    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [phase, route]);

  function reset() {
    setProgress(0);
    setRoute(null);
    setRemaining(null);
    setPos(START);
    setError('');
  }

  return (
    <main className="app">
      <MapView
        pos={pos}
        searching={phase === 'searching'}
        route={route}
        remaining={remaining}
      />

      <div className="brand">♥ GoLove</div>

      {error && <div className="toast">{error}</div>}

      <BottomSheet
        phase={phase}
        progress={progress}
        onStart={() => { reset(); setPhase('searching'); }}
        onCancel={() => { reset(); setPhase('idle'); }}
        onAccept={() => setPhase('accepted')}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
