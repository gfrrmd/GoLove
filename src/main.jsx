import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { START } from './data/route';
import { fetchRoute } from './utils/routing';
import { interpolateRoute, remainingRoute } from './utils/animation';
import MapView from './components/MapView';
import BottomSheet from './components/BottomSheet';
import PostReward from './components/PostReward';

const TRACKING_DURATION = 15000;

function App() {
  const [phase, setPhase]         = useState('idle');
  const [progress, setProgress]   = useState(0);
  const [route, setRoute]         = useState(null);
  const [pos, setPos]             = useState(START);
  const [remaining, setRemaining] = useState(null);
  const [error, setError]         = useState('');
  const [postReward, setPostReward] = useState(false);

  useEffect(() => {
    if (phase !== 'searching') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setError('');
        const points = await fetchRoute();
        if (cancelled) return;
        setRoute(points); setRemaining(points); setPos(points[0]);
        setPhase('tracking');
      } catch (e) {
        if (!cancelled) { setError('Gagal mengambil rute. Coba lagi.'); setPhase('idle'); }
      }
    }, 5000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'tracking' || !route?.length) return;
    const startTime = performance.now();
    let id;
    function animate(now) {
      const t = Math.min((now - startTime) / TRACKING_DURATION, 1);
      setProgress(t);
      setPos(interpolateRoute(route, t));
      if (t < 1) { setRemaining(remainingRoute(route, t)); id = requestAnimationFrame(animate); }
      else { setRemaining([]); setPos(route.at(-1)); setPhase('arrived'); }
    }
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [phase, route]);

  function reset() {
    setProgress(0); setRoute(null); setRemaining(null);
    setPos(START); setError(''); setPostReward(false);
  }

  // Saat onAccept dipanggil dari BottomSheet → tampilkan PostReward
  function handleAccept() { setPostReward(true); }

  // Setelah PostReward selesai → reset ke idle
  function handleFinish() { reset(); setPhase('idle'); }

  // PostReward tampil full screen menggantikan segalanya
  if (postReward) return <PostReward onFinish={handleFinish} />;

  return (
    <main className="app">
      <MapView pos={pos} searching={phase==='searching'} route={route} remaining={remaining} phase={phase} />
      <div className="brand">💚 GoLove</div>
      {error && <div className="toast">{error}</div>}
      <BottomSheet
        phase={phase} progress={progress}
        onStart={() => { reset(); setPhase('searching'); }}
        onCancel={() => { reset(); setPhase('idle'); }}
        onAccept={handleAccept}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
