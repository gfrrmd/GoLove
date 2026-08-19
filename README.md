# GoLove 💚

Website gombal interaktif bergaya Grab. Kirim cintamu seperti memesan ojek online!

## Fitur

- 🔍 Animasi mencari cinta (radar)
- 🗺️ Peta ilustrasi dengan rute berbelok
- ♥ Marker cinta bergerak selama 10 detik
- 📱 Responsif, bottom sheet, tidak perlu scroll
- 🚀 Siap deploy ke Railway

## Jalankan Lokal

```bash
npm install
npm run dev
```

## Deploy ke Railway

1. Fork / push repo ini ke GitHub.
2. Railway → **New Project** → **Deploy from GitHub Repo**.
3. Pilih repo `GoLove`.
4. Railway otomatis menjalankan `npm run build` dan `npm run start`.
5. Setelah selesai buka **Settings → Networking → Generate Domain**.

## Deploy via Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
