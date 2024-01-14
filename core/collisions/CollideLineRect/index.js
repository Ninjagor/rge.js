export function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
    let left, right, top, bottom, intersection;

  if(calcIntersection){
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,true);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,true);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,true);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,true);
     intersection = {
        "left" : left,
        "right" : right,
        "top" : top,
        "bottom" : bottom
    }
  }else{
    //return booleans
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
  }

  // if ANY of the above are true, the line has hit the rectangle
  if (left || right || top || bottom) {
    if(calcIntersection){
      return intersection;
    }
    return true;
  }
  return false;
}