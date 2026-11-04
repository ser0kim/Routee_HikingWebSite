/* Clip terrain at the camera plane instead of dropping a whole crossing tile. */
var RouteeGeometry = (() => {
  function clipNear(points, project, near = 45) {
    if (!points.length || points[0].depth === undefined || points.every(p => p.depth >= near)) return points;
    const clipped = [];
    let previous = points[points.length - 1];
    for (const point of points) {
      const inside = point.depth >= near, wasInside = previous.depth >= near;
      if (inside !== wasInside) {
        const t = (near - previous.depth) / (point.depth - previous.depth);
        clipped.push(project(previous.viewX + (point.viewX - previous.viewX) * t,
          previous.viewY + (point.viewY - previous.viewY) * t, near));
      }
      if (inside) clipped.push(point);
      previous = point;
    }
    return clipped;
  }
  return { clipNear };
})();
