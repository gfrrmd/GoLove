import { START, END } from '../data/route';

const OSRM = 'https://router.project-osrm.org/route/v1/driving';

export async function fetchRoute() {
  const coords = [
    `${START[1]},${START[0]}`,
    `${END[1]},${END[0]}`,
  ].join(';');

  const res = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson`);
  if (!res.ok) throw new Error('OSRM tidak bisa dihubungi');

  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('Rute tidak ditemukan');

  // OSRM mengembalikan [lng, lat] — kita balik ke [lat, lng] untuk Leaflet
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}
