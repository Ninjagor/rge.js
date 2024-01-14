/**
     * Checks if the rect collides with another rect.
     * @param {number} px
     * @param {number} py
     * @param {Polygon} polyon
     * @returns {boolean} - True if a collision occurs, false otherwise.
*/
export function collidePointPoly(px, py, polygon) {
    const vertices = polygon.vertices;
    let collision = false;

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {
  
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current+1;
      if (next === vertices.length) next = 0;
  
      // get the PVectors at our current position this makes our if statement a little cleaner
      let vc = vertices[current];    // c for "current"
      let vn = vertices[next];       // n for "next"    
  
      // compare position, flip 'collision' letiable back and forth
      if (((vc.y + polygon.y >= py && vn.y + polygon.y < py) || (vc.y + polygon.y < py && vn.y + polygon.y >= py)) &&
           (px < ((vn.x + polygon.x)-(vc.x + polygon.x))*(py-(vc.y + polygon.y)) / ((vn.y + polygon.y)-(vc.y + polygon.y))+(vc.x+ + polygon.x))) {
              collision = !collision;
      }
    }
    return collision;
}