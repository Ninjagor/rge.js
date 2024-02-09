export function collideLinePoly(x1, y1, x2, y2, vertices) {
  for (let i = 0; i < vertices.length; i++) {
      const x3 = vertices[i].x;
      const y3 = vertices[i].y;
      const x4 = vertices[(i + 1) % vertices.length].x;
      const y4 = vertices[(i + 1) % vertices.length].y;

      if (doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
          return true;
      }
  }
  return false;
}

function doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const det1 = determinant(x1, y1, x2, y2, x3, y3);
  const det2 = determinant(x1, y1, x2, y2, x4, y4);
  const det3 = determinant(x3, y3, x4, y4, x1, y1);
  const det4 = determinant(x3, y3, x4, y4, x2, y2);

  return (
      (det1 > 0 && det2 < 0 || det1 < 0 && det2 > 0) &&
      (det3 > 0 && det4 < 0 || det3 < 0 && det4 > 0)
  );
}

function determinant(x1, y1, x2, y2, x3, y3) {
  return (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
}
