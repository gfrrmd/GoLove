/**
 * Interpolasi linear antara dua koordinat [lat, lng]
 * t = 0..1
 */
export function interpolateLatLng(start, end, t) {
  if (t <= 0) return start;
  if (t >= 1) return end;
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
  ];
}
