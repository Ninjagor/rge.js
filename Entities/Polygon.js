import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";
import { Ellipse } from "./Ellipse.js";

export class Polygon extends Entity {
    constructor(x, y, vertices, fillColor = "green") {
        super(x, y);
        this.vertices = vertices;
        this.fillColor = fillColor;
    }

    update(x, y, vertices = this.vertices, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.vertices = vertices;
        this.fillColor = fillColor;
    }

    render(context) {
        context.fillStyle = this.fillColor;
        context.beginPath();
        context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);

        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        }

        context.closePath();
        context.fill();
    }

    hitTest(pointX, pointY) {
        let inside = false;

        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            const xi = this.vertices[i].x + this.x;
            const yi = this.vertices[i].y + this.y;
            const xj = this.vertices[j].x + this.x;
            const yj = this.vertices[j].y + this.y;

            const intersect = ((yi > pointY) !== (yj > pointY)) &&
                (pointX < ((xj - xi) * (pointY - yi)) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    collisionLogic(otherEntity) {
        

        // Add more cases for other shapes if needed

        return false;
    }
}
