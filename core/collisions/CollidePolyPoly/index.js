export function collidePolyPoly(polygon1, polygon2, interior) {
    const p1 = polygon1.vertices;
    const p2 = polygon2.vertices;
    if (interior === undefined){
      interior = true;
    }
  
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current=0; current<p1.length; current++) {
  
      // get next vertex in list, if we've hit the end, wrap around to 0
      next = current+1;
      if (next === p1.length) next = 0;

      let collision;
  
      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = p1[current];    // c for "current"
      var vn = p1[next];       // n for "next"
  
      // use these two points (a line) to compare to the other polygon's vertices using polyLine()
      collision = this.collideLinePoly(vc.x,vc.y,vn.x,vn.y,p2);
      if (collision) {
        console.log("Edge collision")
        return true
      };
  
      //check if the either polygon is INSIDE the other
      if(interior === true){
        collision = this.collidePointPoly(p2[0].x, p2[0].y, polygon1);
        if (collision) return true;
        collision = this.collidePointPoly(p1[0].x, p1[0].y, polygon2);
        if (collision) return true;
      }
    }
  
    return false;
}