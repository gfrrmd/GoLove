import React, { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  { id: 1, text: 'Hey Mick 👋' },
  { id: 2, text: "I'm here 💚" },
  { id: 3, text: 'Jangan cuek-cuek gitu dong 🥺' },
  { id: 4, text: 'Nanti kesepian akunya 😢' },
];

function ChatBubble({ text, show }) {
  return (
    <div style={{
      transition: 'opacity .4s, transform .4s',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(10px)',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div className="bubble">{text}</div>
    </div>
  );
}

function RatingStars({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map((n) => (
        <button key={n} className={`star${value >= n ? ' filled' : ''}`}
          onClick={() => onChange(n)} aria-label={`${n}`}>
          💚
        </button>
      ))}
    </div>
  );
}

// Konfeti canvas
function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const COLORS = ['#00b14f','#34d399','#6ee7b7','#fbbf24','#f472b6','#a78bfa','#fff'];
    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - .5) * .15,
      drift: (Math.random() - .5) * 1.2,
    }));

    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y > canvas.height) {
          p.y = -p.h;
          p.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
    const stop = setTimeout(() => { running = false; }, 4000);
    return () => { running = false; clearTimeout(stop); };
  }, []);

  return <canvas ref={ref} className="confetti-canvas" />;
}

// Voucher / Surat Cinta
function LoveVoucher({ rating }) {
  const lines = [
    'Satu pelukan gratis',
    'Berlaku selamanya ∞',
    'Tidak bisa dipindahtangankan',
  ];
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
        <div className="notch left" />
        <div className="dashes" />
        <div className="notch right" />
      </div>
      <div className="voucher-body">
        <p className="voucher-msg">
          “Makasih ya Mick, udah mau nerima cinta aku.
          Semoga hari kamu seindah senyum kamu.”
        </p>
        <ul className="voucher-terms">
          {lines.map((l, i) => <li key={i}>✓ {l}</li>)}
        </ul>
        <div className="voucher-rating">
          {'&zwj;'}
          <span style={{letterSpacing:2}}>{'&#128154;'.repeat ? '💚'.repeat(rating) : ''}</span>
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
    if (phase === 'idle') {
      setChatOpen(false); setShown(0); setRating(0); setSubmitted(false);
    }
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
      <h2>Mencari cintaku...</h2>
      <p>Sedang mencari jalan terbaik untuk mengantarkan rasa sayangmu.</p>
      <div className="dots">● ● ●</div>
    </section>
  );

  if (phase === 'tracking') return (
    <section className="sheet">
      <div className="handle" />
      <label>CINTAKU DITEMUKAN</label>
      <div className="head">
        <h2>Menuju ke tempatmu</h2>
        <div className="eta">{remaining}<small>detik lagi</small></div>
      </div>
      <div className="card">
        <i className="avatar">💚</i>
        <div><strong>Cintaku</strong><small>Perjalanan khusus untukmu</small></div>
      </div>
      <div className="progress"><div style={{ width: progress * 100 + '%' }} /></div>
      <div className="summary"><span>Hatiku</span><span>Tempatmu</span></div>
      <button className="secondary" onClick={onCancel}>Batalkan perjalanan</button>
    </section>
  );

  if (phase === 'arrived' && !chatOpen) return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">💚</div>
      <label>CINTAKU SUDAH SAMPAI</label>
      <h2>Ada pesan untukmu 💌</h2>
      <p>Cintaku mau bilang sesuatu. Mau dibuka?</p>
      <button onClick={() => { setChatOpen(true); setShown(1); }}>Buka pesan</button>
    </section>
  );

  if (phase === 'arrived' && chatOpen && !submitted) return (
    <section className="sheet sheet--chat">
      <div className="chat-header">
        <div className="chat-avatar">💚</div>
        <div><strong>Cintaku</strong><small>Online • sekarang</small></div>
      </div>
      <div className="chat">
        {MESSAGES.map((m, i) => (
          <ChatBubble key={m.id} text={m.text} show={shown > i} />
        ))}
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

  // Submitted: konfeti + voucher
  if (submitted) return (
    <section className="sheet sheet--reward">
      <Confetti />
      <div className="reward-inner">
        <div className="reward-title">🎉 Cintamu diterima!</div>
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
      <div className="loc"><i /><div><small>Dari</small><strong>Hatimu</strong></div></div>
      <div className="line" />
      <div className="loc"><i className="red" /><div><small>Menuju</small><strong>Tempat dia berada</strong></div></div>
      <div className="fare"><span>Biaya perjalanan</span><b>1 pelukan 🤗</b></div>
      <button onClick={onStart}>Cari cintaku 💌</button>
    </section>
  );
}
