// Semua koordinat dalam satuan SVG viewBox 0 0 400 700
// Titik rute utama yang dilalui marker cintaku
export const routePoints = [
  { x: 60,  y: 580 },
  { x: 60,  y: 480 },
  { x: 120, y: 480 },
  { x: 120, y: 380 },
  { x: 200, y: 380 },
  { x: 200, y: 260 },
  { x: 300, y: 260 },
  { x: 300, y: 160 },
  { x: 340, y: 160 },
];

// Jaringan jalan di peta (menyerupai grid kota)
export const mapRoads = [
  // Jalan horizontal
  { points: [[0,160],[400,160]], label: 'Jl. Kenangan' },
  { points: [[0,260],[400,260]], label: 'Jl. Rindu' },
  { points: [[0,380],[400,380]], label: 'Jl. Cinta' },
  { points: [[0,480],[400,480]], label: 'Jl. Sayang' },
  { points: [[0,580],[400,580]], label: 'Jl. Kasih' },
  // Jalan vertikal
  { points: [[60,0],[60,700]],   label: 'Jl. Setia' },
  { points: [[120,0],[120,700]], label: 'Jl. Tulus' },
  { points: [[200,0],[200,700]], label: 'Jl. Jujur' },
  { points: [[300,0],[300,700]], label: 'Jl. Abadi' },
  { points: [[340,0],[340,700]], label: 'Jl. Selamanya' },
  // Jalan diagonal / minor
  { points: [[0,320],[80,260]],  label: '' },
  { points: [[150,480],[200,380]], label: '' },
  { points: [[300,380],[360,320],[400,320]], label: '' },
  { points: [[0,440],[60,380]], label: '' },
  { points: [[200,480],[300,380]], label: '' },
];

// Blok bangunan (kotak abu-abu seperti Google Maps)
export const buildings = [
  { x: 70,  y: 170, w: 40, h: 80 },
  { x: 130, y: 170, w: 60, h: 80 },
  { x: 210, y: 170, w: 80, h: 80 },
  { x: 70,  y: 270, w: 40, h: 100 },
  { x: 130, y: 270, w: 60, h: 100 },
  { x: 210, y: 270, w: 80, h: 100 },
  { x: 310, y: 270, w: 20, h: 100 },
  { x: 70,  y: 390, w: 40, h: 80 },
  { x: 130, y: 390, w: 60, h: 80 },
  { x: 210, y: 390, w: 80, h: 80 },
  { x: 310, y: 390, w: 20, h: 80 },
  { x: 70,  y: 490, w: 40, h: 80 },
  { x: 130, y: 490, w: 60, h: 80 },
  { x: 210, y: 490, w: 80, h: 80 },
  { x: 310, y: 490, w: 20, h: 80 },
];
