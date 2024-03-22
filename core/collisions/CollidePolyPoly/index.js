export function collidePolyPoly(poly1, poly2) {
  const p1 = poly1.vertices;
  const p2 = poly2.vertices;

  let collision = false;

  for (let i = 0; i < p1.length; i++) {
    console.log('testing collision: ', p1[i].x, p1[i].y, poly2)
    if (this.collidePointPoly(p1[i].x+poly1.x, p1[i].y+poly1.y, poly2)) {

      collision = true;
      break;
    }
  }

  for (let i = 0; i < p2.length; i++) {
    if (this.collidePointPoly(p2[i].x+poly2.x, p2[i].y+poly2.y, poly1)) {  
      collision = true;
      break;
    }
  }

  return collision;
}