import { Entity } from "./Entity.js"

export class Rect extends Entity {
    constructor(x, y, width, height, fillColor = "blue") {
        super(x, y);
        this.width = width;
        this.height = height;
        this.fillColor = fillColor
    }

    update(x, y, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.fillColor = fillColor
    }

    render(context) {
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    hitTest(pointX, pointY) {
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    collisionLogic(otherRect) {
        return !(
            this.x + this.width < otherRect.x ||
            this.x > otherRect.x + otherRect.width ||
            this.y + this.height < otherRect.y ||
            this.y > otherRect.y + otherRect.height
        );
    }
}
