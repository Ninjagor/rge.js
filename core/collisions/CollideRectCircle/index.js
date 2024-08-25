/**
     * Checks if the rect collides with another rect.
     * @param {Rect} rect
     * @param {Circle} ellipse
     * @returns {boolean} - True if a collision occurs, false otherwise.
*/
export function collideRectCircle(rect, ellipse) {
    const cx = ellipse.x;
    const cy = ellipse.y;
    const rx = rect.x;
    const ry = rect.y;
    const rw = rect.width;
    const rh = rect.height;
    const diameter = ellipse.radius*2
    let testX = cx;
    let testY = cy;

    // which edge is closest?
    if (cx < rx){         testX = rx       // left edge
    }else if (cx > rx+rw){ testX = rx+rw  }   // right edge

    if (cy < ry){         testY = ry       // top edge
    }else if (cy > ry+rh){ testY = ry+rh }   // bottom edge

    // // get distance from closest edges
    const distance = this.findDistance(cx,cy,testX,testY)

    // if the distance is less than the radius, collision!
    if (distance <= diameter/2) {
        return true;
    }
    return false;
}