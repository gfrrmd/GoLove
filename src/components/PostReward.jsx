import React, { useState, useEffect, useRef } from 'react';

// ─── FASE 1: Salah Kirim ───────────────────────────────────────────
const TWIST_MESSAGES = [
  { id: 1, text: 'Eh wait...' },
  { id: 2, text: 'Tapi bohong 🤭' },
  { id: 3, text: 'Emang dari awal buat kamu kok 💚' },
];

function TwistBubble({ text, show }) {
  return (
    <div style={{
      transition: 'opacity .5s, transform .5s',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(10px)',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div className="bubble">{text}</div>
    </div>
  );
}

function SalahKirim({ onKeep }) {
  const [shake, setShake]       = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [shown, setShown]       = useState(0);

  function handleKeep() {
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setShowChat(true);
      setShown(1);
    }, 600);
  }

  // Tiap bubble muncul dengan jeda 2.5 detik agar terbaca
  useEffect(() => {
    if (!showChat || shown >= TWIST_MESSAGES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 2500);
    return () => clearTimeout(t);
  }, [showChat, shown]);

  // Lanjut setelah pesan terakhir dibaca (3 detik)
  useEffect(() => {
    if (shown < TWIST_MESSAGES.length) return;
    const t = setTimeout(onKeep, 3000);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="pr-screen pr-light">
      {!showChat && (
        <div className={`pr-card-light${shake ? ' shake' : ''}`}>
          <div className="pr-icon">⚠️</div>
          <div className="pr-tag-light">NOTIFIKASI SISTEM</div>
          <h2 className="pr-title-light">Maaf, terjadi kesalahan</h2>
          <p className="pr-sub-light">
            Sistem mendeteksi cinta ini <strong>salah kirim</strong>.<br />
            Seharusnya tidak berakhir di sini.
          </p>
          <button className="pr-btn-light" onClick={handleKeep}>Tetap terima</button>
        </div>
      )}
      {showChat && (
        <div className="twist-chat">
          <div className="twist-header">
            <div className="chat-avatar">💚</div>
            <div><strong>Rama</strong><small>Online • sekarang</small></div>
          </div>
          <div className="twist-bubbles">
            {TWIST_MESSAGES.map((m, i) => (
              <TwistBubble key={m.id} text={m.text} show={shown > i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FASE 2: Jangan Dibuka ─────────────────────────────────────────
function JanganDibuka({ onOpen }) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    // Tunggu 3 detik agar pesan terbaca sebelum lanjut
    setTimeout(() => { onOpen(); }, 3200);
  }

  return (
    <div className="pr-screen pr-dark">
      <div className="pr-forbidden">

        {/* Amplop pakai emoji besar, animasi saat dibuka */}
        <div className={`env-emoji${opened ? ' env-open' : ''}`}>
          {opened ? '💚' : '💌'}
        </div>

        {!opened && (
          <>
            <div className="pr-tag" style={{marginTop: 20}}>PERINGATAN</div>
            <h2 className="pr-title">Jangan dibuka.</h2>
            <p className="pr-sub">Ini bukan untukmu.<br />Jangan penasaran.</p>
            <button className="pr-btn dim" onClick={handleOpen}>Buka anyway</button>
          </>
        )}

        {opened && (
          <div className="pr-reveal">
            <p className="pr-reveal-msg">
              Udah dibilang jangan dibuka.
            </p>
            <p className="pr-reveal-msg" style={{marginTop: 10}}>
              Tapi karena udah terlanjur...
            </p>
            <p className="pr-reveal-msg" style={{marginTop: 10}}>
              <strong>I Love U Mic 😵‍💫💖</strong>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── FASE 3: Make a Wish ───────────────────────────────────────────
function MakeAWish({ onDone }) {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    starsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: .5 + Math.random() * 1.8,
      a: Math.random(), da: .005 + Math.random() * .01,
      fall: false, vy: 0,
    }));

    let shoot = { active: false, x:0, y:0, vx:0, vy:0, life:0 };
    let shootTimer = setTimeout(launch, 1200);
    function launch() {
      shoot = { active:true, x: Math.random()*canvas.width*.5, y:0, vx:3+Math.random()*3, vy:2+Math.random()*2, life:1 };
      shootTimer = setTimeout(launch, 3500 + Math.random()*2000);
    }

    let running = true;
    function draw() {
      if (!running) return;
      const g = ctx.createLinearGradient(0,0,0,canvas.height);
      g.addColorStop(0,'#0a0e1a'); g.addColorStop(1,'#0d1f2d');
      ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
      starsRef.current.forEach((s) => {
        s.a += s.da; if (s.a>1||s.a<0) s.da*=-1;
        if (s.fall) { s.y+=s.vy; s.vy+=.15; }
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${s.a})`; ctx.fill();
      });
      if (shoot.active) {
        shoot.x+=shoot.vx; shoot.y+=shoot.vy; shoot.life-=.018;
        if(shoot.life<=0) shoot.active=false;
        ctx.save(); ctx.globalAlpha=shoot.life; ctx.strokeStyle='#a7f3d0'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(shoot.x,shoot.y);
        ctx.lineTo(shoot.x-shoot.vx*12,shoot.y-shoot.vy*12);
        ctx.stroke(); ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
    return () => { running=false; clearTimeout(shootTimer); window.removeEventListener('resize',resize); };
  }, []);

  function handleWish() {
    if (wished) return;
    setWished(true);
    starsRef.current.forEach((s) => { s.fall=true; s.vy=Math.random()*2; });
    setTimeout(onDone, 3200);
  }

  return (
    <div className="pr-screen" style={{background:'#0a0e1a'}} onClick={!wished ? handleWish : undefined}>
      <canvas ref={canvasRef} className="wish-canvas" />
      <div className="wish-overlay">
        {!wished ? (
          <>
            <div className="wish-star-icon">✨</div>
            <h2 className="pr-title light">Kamu punya 1 permintaan.</h2>
            <p className="pr-sub light">Tutup mata, pikirkan,<br />lalu ketuk layar.</p>
          </>
        ) : (
          <div className="wish-reveal">
            <div className="wish-star-icon big">💚</div>
            <h2 className="pr-title light">Permintaanmu...</h2>
            <p className="pr-sub light">sudah aku dengar duluan. 💚</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONTROLLER ───────────────────────────────────────────────────
export default function PostReward({ onFinish }) {
  const [step, setStep] = useState(0);
  if (step === 0) return <SalahKirim onKeep={() => setStep(1)} />;
  if (step === 1) return <JanganDibuka onOpen={() => setStep(2)} />;
  if (step === 2) return <MakeAWish onDone={onFinish} />;
  return null;
}
