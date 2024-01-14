export function collideEllipsePoly(ellipse, polygon, interior) {

    const cx = ellipse.x;
    const cy = ellipse.y;
    const diameter = ellipse.radius * 2;
    const vertices = polygon.vertices

    if (interior === undefined){
        interior = true;
    }

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    let vc = vertices[current];    // c for "current"
    let vn = vertices[next];       // n for "next"

    // check for collision between the circle and a line formed between the two vertices
    let collision = this.collideLineEllipse((vc.x + polygon.x),(vc.y + polygon.y), (vn.x + polygon.x),(vn.y + polygon.y), cx,cy,diameter);
    if (collision) return true;
    }

    // test if the center of the circle is inside the polygon
    if(interior === true){
    let centerInside = this.collidePointPoly(cx,cy, polygon);
    if (centerInside) return true;
    }

    // otherwise, after all that, return false
    return false;
}