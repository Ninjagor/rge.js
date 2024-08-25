export function collidePointCircle(x, y, cx, cy, d) {
    if( this.findDistance(x,y,cx,cy) <= d/2 ){
        return true;
      }
    return false;
}