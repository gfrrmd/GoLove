/**
 * Interpolasi posisi marker tepat di atas polyline routePoints.
 * Menghitung panjang total lalu memilih segmen yang tepat.
 */
export function interpolateRoute(points, t) {
  if (t <= 0) return points[0];
  if (t >= 1) return points.at(-1);

  // Hitung panjang tiap segmen
  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    lengths.push(len);
    total += len;
  }

  // Cari posisi berdasarkan panjang aktual, bukan index
  let target = t * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) {
      const ratio = target / lengths[i];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * ratio,
        y: points[i].y + (points[i + 1].y - points[i].y) * ratio,
      };
    }
    target -= lengths[i];
  }
  return points.at(-1);
}

/**
 * Hitung sudut rotasi marker berdasarkan arah pergerakan
 */
export function getRotation(points, t) {
  if (t >= 1) return 0;
  const epsilon = 0.01;
  const p1 = interpolateRoute(points, Math.max(0, t - epsilon));
  const p2 = interpolateRoute(points, Math.min(1, t + epsilon));
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}
