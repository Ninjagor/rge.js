export function collideLineEllipse(x1, y1, x2, y2, cx, cy, diameter) {
    let inside1 = this.collidePointEllipse(x1,y1, cx,cy,diameter);
    let inside2 = this.collidePointEllipse(x2,y2, cx,cy,diameter);
    if (inside1 || inside2) return true;

    // get length of the line
    let distX = x1 - x2;
    let distY = y1 - y2;
    let len = Math.sqrt( (distX*distX) + (distY*distY) );

    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
    if (!onSegment) return false;

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );

    if (distance <= diameter/2) {
        return true;
    }
    return false;
}