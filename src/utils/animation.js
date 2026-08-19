export function interpolateRoute(points, t) {
  if (t <= 0) return points[0];
  if (t >= 1) return points.at(-1);

  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    lengths.push(len);
    total += len;
  }

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
