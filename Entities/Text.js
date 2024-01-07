import { Entity } from "./Entity.js";

export class Text extends Entity {
    constructor(x, y, text, fontSize = 16, fillStyle = "black") {
        super(x, y);
        this.text = text;
        this.fontSize = fontSize;
        this.font = "Arial";
        this.fillStyle = fillStyle;
    }

    update(x, y, text = this.text, fontSize = this.fontSize, font = this.font) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
        this.font = font;
    }

    render(context) {
        context.font = `${this.fontSize}px ${this.font}`;
        context.fillStyle = this.fillStyle;
        context.fillText(this.text, this.x, this.y);
    }

    collisionLogic(otherEntity) {
        // Text entities don't participate in collisions
        return false;
    }
}
