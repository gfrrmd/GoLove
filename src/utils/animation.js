export function interpolateRoute(points, t) {
  if (t <= 0) return points[0];
  if (t >= 1) return points.at(-1);
  const n = points.length - 1;
  const x = t * n;
  const i = Math.floor(x);
  const q = x - i;
  const a = points[i];
  const b = points[i + 1];
  return { x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q };
}
