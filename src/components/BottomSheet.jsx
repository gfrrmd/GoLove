import React from 'react';

export default function BottomSheet({ phase, progress, onStart, onCancel, onAccept }) {
  const remaining = Math.max(0, Math.ceil(10 - progress * 10));

  if (phase === 'searching') return (
    <section className="sheet center">
      <div className="handle" />
      <div className="radar"><span className="radar-heart">♥</span></div>
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
        <i className="avatar">♥</i>
        <div><strong>Cintaku</strong><small>Perjalanan khusus untukmu</small></div>
      </div>
      <div className="progress"><div style={{ width: progress * 100 + '%' }} /></div>
      <div className="summary"><span>Hatiku</span><span>Tempatmu</span></div>
      <button className="secondary" onClick={onCancel}>Batalkan perjalanan</button>
    </section>
  );

  if (phase === 'arrived') return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">♥</div>
      <label>PERJALANAN SELESAI</label>
      <h2>Cintaku sudah sampai 💖</h2>
      <p>Ada rasa sayang yang baru saja tiba di depan hatimu.</p>
      <button onClick={onAccept}>Terima cintaku</button>
    </section>
  );

  if (phase === 'accepted') return (
    <section className="sheet center">
      <div className="handle" />
      <div className="success">✓</div>
      <label>BERHASIL DITERIMA</label>
      <h2>Yeay, cintanya diterima!</h2>
      <p>Semoga hari kamu menjadi lebih manis hari ini 😊</p>
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
