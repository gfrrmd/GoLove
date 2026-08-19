import React, { useState, useEffect } from 'react';

const MESSAGES = [
  { id: 1, text: 'Hey Mick 👋' },
  { id: 2, text: "I'm here anw" },
  { id: 3, text: 'Jangan cuek-cuek gitu dong 🥺' },
  { id: 4, text: 'Nanti kesepian akunya haha.' },
];

function ChatBubble({ text, show }) {
  return (
    <div style={{ transition:'opacity .4s,transform .4s', opacity:show?1:0, transform:show?'translateY(0)':'translateY(10px)', pointerEvents:show?'auto':'none' }}>
      <div className="bubble">{text}</div>
    </div>
  );
}

function RatingStars({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map((n) => (
        <button key={n} className={`star${value >= n ? ' filled' : ''}`} onClick={() => onChange(n)}>
          💚
        </button>
      ))}
    </div>
  );
}

function Confetti() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    const COLORS = ['#00b14f','#34d399','#6ee7b7','#fbbf24','#f472b6','#a78bfa','#ffffff','#fbcfe8'];
    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random()*canvas.width, y: Math.random()*-canvas.height,
      w: 7+Math.random()*9, h: 4+Math.random()*6,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      speed: 1.5+Math.random()*2.5, angle: Math.random()*Math.PI*2,
      spin: (Math.random()-.5)*.12, drift: (Math.random()-.5)*1,
    }));
    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach((p) => {
        ctx.save(); ctx.translate(p.x+p.w/2,p.y+p.h/2); ctx.rotate(p.angle);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
        p.y+=p.speed; p.x+=p.drift; p.angle+=p.spin;
        if (p.y>canvas.height+p.h) { p.y=-p.h*2; p.x=Math.random()*canvas.width; }
      });
      requestAnimationFrame(draw);
    }
    draw();
    return () => { running=false; window.removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={ref} className="confetti-canvas" />;
}

function LoveVoucher({ rating }) {
  return (
    <div className="voucher">
      <div className="voucher-top">
        <span className="voucher-icon">💌</span>
        <div>
          <div className="voucher-brand">GoLove • Hadiah Spesial</div>
          <div className="voucher-title">Surat Cinta Untukmu</div>
        </div>
      </div>
      <div className="voucher-divider">
        <div className="notch left" /><div className="dashes" /><div className="notch right" />
      </div>
      <div className="voucher-body">
        <p className="voucher-msg">“Makasih ya, Mic, udah hadir di hidupku. Aku nggak tahu ke depannya kita bakal ngelewatin apa aja, tapi aku berharap semoga kita bisa terus saling nemenin, saling ngerti, dan saling jaga. Semoga apa pun yang nanti kita jalanin, bisa jadi sesuatu yang indah buat kita berdua. I’m really glad I met you, and I hope this is just the beginning of something good for us. 💘”</p>
        <ul className="voucher-terms">
          <li>✓ Satu ciuman gratis</li>
          <li>✓ Berlaku selamanya ∞</li>
          <li>✓ Tidak bisa dipindahtangankan</li>
        </ul>
        <div className="voucher-rating">
          <span>{'💚'.repeat(rating)}</span>
          <small>Rasa cinta yang kamu berikan</small>
        </div>
      </div>
    </div>
  );
}

export default function BottomSheet({ phase, progress, onStart, onCancel, onAccept }) {
  const remaining = Math.max(0, Math.ceil(15 - progress * 15));
  const [chatOpen, setChatOpen]   = useState(false);
  const [shown, setShown]         = useState(0);
  const [rating, setRating]       = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (phase === 'idle') { setChatOpen(false); setShown(0); setRating(0); setSubmitted(false); }
  }, [phase]);

  useEffect(() => {
    if (!chatOpen || shown >= MESSAGES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 2000);
    return () => clearTimeout(t);
  }, [chatOpen, shown]);

  if (phase === 'searching') return (
    <section className="sheet center">
      <div className="handle" />
      <div className="radar"><span className="radar-heart">💚</span></div>
      <h2>Mencari cinta...</h2>
      <p>Sedang mencari jalan terbaik untuk mengantarkan rasa sayangku.</p>
      <div className="dots">● ● ●</div>
    </section>
  );

  if (phase === 'tracking') return (
    <section className="sheet">
      <div className="handle" />
      <label>CINTA DITEMUKAN</label>
      <div className="head"><h2>Menuju ke tempatmu</h2><div className="eta">{remaining}<small>detik lagi</small></div></div>
      <div className="card"><i className="avatar">💚</i><div><strong>Cintaku</strong><small>Perjalanan khusus untukmu</small></div></div>
      <div className="progress"><div style={{ width: progress * 100 + '%' }} /></div>
      <div className="summary"><span>Hatiku</span><span>Hatimu</span></div>
      <button className="secondary" onClick={onCancel}>Batalkan perjalanan</button>
    </section>
  );

  if (phase === 'arrived' && !chatOpen) return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">💚</div>
      <label>CINTA SUDAH SAMPAI</label>
      <h2>Ada pesan untukmu 💌</h2>
      <p>Seseorang mau bilang sesuatu. Mau dibuka?</p>
      <button onClick={() => { setChatOpen(true); setShown(1); }}>Buka pesan</button>
    </section>
  );

  if (phase === 'arrived' && chatOpen && !submitted) return (
    <section className="sheet sheet--chat">
      <div className="chat-header">
        <div className="chat-avatar">💚</div>
        <div><strong>Rama</strong><small>Online • sekarang</small></div>
      </div>
      <div className="chat">
        {MESSAGES.map((m, i) => <ChatBubble key={m.id} text={m.text} show={shown > i} />)}
      </div>
      {shown >= MESSAGES.length && (
        <div className="rating-wrap">
          <p className="rating-label">Beri rasa cintamu 💚</p>
          <RatingStars value={rating} onChange={setRating} />
          <button disabled={rating === 0} onClick={() => setSubmitted(true)}>
            Kirim cinta {rating > 0 ? '💚'.repeat(rating) : ''}
          </button>
        </div>
      )}
    </section>
  );

  if (submitted) return (
    <section className="sheet sheet--reward">
      <Confetti />
      <div className="reward-inner">
        <div className="reward-title">🎉 Cinta diterima!</div>
        <LoveVoucher rating={rating} />
        <button className="btn-close" onClick={onAccept}>Simpan kenangan ini 💚</button>
      </div>
    </section>
  );

  return (
    <section className="sheet">
      <div className="handle" />
      <label>GOLOVE</label>
      <h1>Kirim cintamu sekarang</h1>
      <div className="loc"><i /><div><small>Dari</small><strong>Hati Rama</strong></div></div>
      <div className="line" />
      <div className="loc"><i className="red" /><div><small>Menuju Hati Mic</small><strong>Tempat dia berada</strong></div></div>
      <div className="fare"><span>Biaya perjalanan</span><b>[PROMO] 1 Kiss Only</b></div>
      <button onClick={onStart}>Cari cinta</button>
    </section>
  );
}
