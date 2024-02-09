export function collideRectPoly(rect, polygon, interior) {

    const vertices = polygon.vertices;
    const rx = rect.x;
    const ry = rect.y;
    const rw = rect.width;
    const rh = rect.height;

    if (interior == undefined){
        interior = true;
      }
    
      var next = 0;
      for (var current=0; current<vertices.length; current++) {
    
        next = current+1;
        if (next === vertices.length) next = 0;
    
        var vc = vertices[current];    // c for "current"
        var vn = vertices[next];       // n for "next"

        var collision = this.collideLineRect((vc.x + polygon.x),(vc.y + polygon.y),(vn.x + polygon.y),(vn.y + polygon.y), rx,ry,rw,rh);
        if (collision) return true;
    
        if(interior === true){
          var inside = this.collidePointPoly(rx,ry, polygon);
          if (inside) return true;
        }
      }
    
      return false;
}