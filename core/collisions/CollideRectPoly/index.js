export function collideRectPoly(rect, polygon, interior) {

    const vertices = polygon.vertices;
    const rx = rect.x;
    const ry = rect.y;
    const rw = rect.width;
    const rh = rect.height;

    if (interior == undefined){
        interior = true;
      }
    
      // go through each of the vertices, plus the next vertex in the list
      var next = 0;
      for (var current=0; current<vertices.length; current++) {
    
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current+1;
        if (next === vertices.length) next = 0;
    
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current];    // c for "current"
        var vn = vertices[next];       // n for "next"
    
        // check against all four sides of the rectangle
        var collision = this.collideLineRect((vc.x + polygon.x),(vc.y + polygon.y),(vn.x + polygon.y),(vn.y + polygon.y), rx,ry,rw,rh);
        if (collision) return true;
    
        // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
        if(interior === true){
          var inside = this.collidePointPoly(rx,ry, polygon);
          if (inside) return true;
        }
      }
    
      return false;
}