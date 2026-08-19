import React, { useState, useEffect } from 'react';

const MESSAGES = [
  { id: 1, text: 'Hey Mick! 👋' },
  { id: 2, text: "I'm here ♥" },
  { id: 3, text: 'Jangan dicuekin gitu dong 🥺' },
];

function ChatBubble({ text, show }) {
  return (
    <div
      style={{
        transition: 'opacity .4s, transform .4s',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <div className="bubble">{text}</div>
    </div>
  );
}

function RatingStars({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          className={`star${value >= n ? ' filled' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} bintang`}
        >
          ♥
        </button>
      ))}
    </div>
  );
}

export default function BottomSheet({ phase, progress, onStart, onCancel, onAccept }) {
  const remaining = Math.max(0, Math.ceil(15 - progress * 15));

  // ----- Arrived: chat + rating -----
  const [chatOpen, setChatOpen]   = useState(false);
  const [shown, setShown]         = useState(0);   // berapa bubble yang terlihat
  const [rating, setRating]       = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Reset saat phase kembali ke idle
  useEffect(() => {
    if (phase === 'idle') {
      setChatOpen(false);
      setShown(0);
      setRating(0);
      setSubmitted(false);
    }
  }, [phase]);

  // Tampilkan bubble satu per satu tiap 2 detik
  useEffect(() => {
    if (!chatOpen) return;
    if (shown >= MESSAGES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 2000);
    return () => clearTimeout(t);
  }, [chatOpen, shown]);

  // ----- Fase searching -----
  if (phase === 'searching') return (
    <section className="sheet center">
      <div className="handle" />
      <div className="radar"><span className="radar-heart">♥</span></div>
      <h2>Mencari cintaku...</h2>
      <p>Sedang mencari jalan terbaik untuk mengantarkan rasa sayangmu.</p>
      <div className="dots">● ● ●</div>
    </section>
  );

  // ----- Fase tracking -----
  if (phase === 'tracking') return (
    <section className="sheet">
      <div className="handle" />
      <label>CINTAKU DITEMUKAN</label>
      <div className="head">
        <h2>Menuju ke tempatmu</h2>
        <div className="eta">{remaining}<small>detik lagi</small></div>
      </div>
      <div className="card">
        <i className="avatar">♥</i>
        <div><strong>Cintaku</strong><small>Perjalanan khusus untukmu</small></div>
      </div>
      <div className="progress"><div style={{ width: progress * 100 + '%' }} /></div>
      <div className="summary"><span>Hatiku</span><span>Tempatmu</span></div>
      <button className="secondary" onClick={onCancel}>Batalkan perjalanan</button>
    </section>
  );

  // ----- Fase arrived: notif pesan -----
  if (phase === 'arrived' && !chatOpen) return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">♥</div>
      <label>CINTAKU SUDAH SAMPAI</label>
      <h2>Ada pesan untukmu 💌</h2>
      <p>Cintaku mau bilang sesuatu. Mau dibuka?</p>
      <button onClick={() => { setChatOpen(true); setShown(1); }}>
        Buka pesan
      </button>
    </section>
  );

  // ----- Chat terbuka -----
  if (phase === 'arrived' && chatOpen && !submitted) return (
    <section className="sheet">
      <div className="handle" />
      <label>PESAN DARI CINTAMU</label>

      <div className="chat">
        {MESSAGES.map((m, i) => (
          <ChatBubble key={m.id} text={m.text} show={shown > i} />
        ))}
      </div>

      {/* Tombol rating muncul setelah semua pesan tampil */}
      {shown >= MESSAGES.length && (
        <div className="rating-wrap">
          <p className="rating-label">Beri rasa cintamu</p>
          <RatingStars value={rating} onChange={setRating} />
          <button
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
          >
            Kirim cinta {rating > 0 ? '♥'.repeat(rating) : ''}
          </button>
        </div>
      )}
    </section>
  );

  // ----- Submitted rating -----
  if (submitted) return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">✓</div>
      <label>TERIMA KASIH</label>
      <h2>Cintamu diterima! {'♥'.repeat(rating)}</h2>
      <p>Semoga harimu menjadi lebih manis hari ini 😊</p>
      <button onClick={onAccept}>Tutup</button>
    </section>
  );

  // ----- Fase idle -----
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
