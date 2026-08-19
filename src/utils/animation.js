function segmentLengths(points) {
  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dlat = points[i][0] - points[i - 1][0];
    const dlng = points[i][1] - points[i - 1][1];
    const len = Math.sqrt(dlat * dlat + dlng * dlng);
    lengths.push(len);
    total += len;
  }
  return { lengths, total };
}

/**
 * Posisi marker pada progress t (0..1)
 */
export function interpolateRoute(points, t) {
  if (!points?.length) return null;
  if (t <= 0) return points[0];
  if (t >= 1) return points.at(-1);

  const { lengths, total } = segmentLengths(points);
  let target = t * total;

  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) {
      const ratio = target / lengths[i];
      const a = points[i];
      const b = points[i + 1];
      return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
    }
    target -= lengths[i];
  }
  return points.at(-1);
}

/**
 * Potong rute: kembalikan hanya titik dari posisi t hingga akhir
 * Digunakan untuk membuat garis memendek seiring perjalanan
 */
export function remainingRoute(points, t) {
  if (!points?.length) return [];
  if (t <= 0) return points;
  if (t >= 1) return [points.at(-1)];

  const { lengths, total } = segmentLengths(points);
  let target = t * total;

  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) {
      const ratio = target / lengths[i];
      const a = points[i];
      const b = points[i + 1];
      const interpolated = [
        a[0] + (b[0] - a[0]) * ratio,
        a[1] + (b[1] - a[1]) * ratio,
      ];
      // Gabung titik interpolasi + sisa rute
      return [interpolated, ...points.slice(i + 1)];
    }
    target -= lengths[i];
  }
  return [points.at(-1)];
}
