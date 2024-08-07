import { Entity } from "./Entity.js";

/**
 * Class representing a text entity, extending the base Entity class.
 * @extends Entity
 */
export class Text extends Entity {
    /**
     * Creates an instance of the Text class.
     * @param {number} x - The x-coordinate of the text position.
     * @param {number} y - The y-coordinate of the text position.
     * @param {string} text - The text content.
     * @param {number} [fontSize=16] - The font size (default is 16).
     * @param {string} [fillStyle="black"] - The fill style for the text (default is "black").
     * @param {number} [rotation=0] - Rotation
     * */
    constructor(x, y, text, fontSize = 16, fillStyle = "black", fontFamily = "Arial", rotation = 0) {
        super(x, y);

        /**
         * The text content.
         * @type {string}
         */
        this.text = text;

        /**
         * The font size.
         * @type {number}
         */
        this.fontSize = fontSize;

        /**
         * The font family.
         * @type {string}
         */
        this.font = fontFamily;

        /**
         * The fill style for the text.
         * @type {string}
         */
        this.fillStyle = fillStyle;

        this.rotation = rotation;

    }

    /**
     * Updates the position, text content, font size, and font family of the text.
     * @param {number} x - The new x-coordinate of the text position.
     * @param {number} y - The new y-coordinate of the text position.
     * @param {string} [text=this.text] - The new text content.
     * @param {number} [fontSize=this.fontSize] - The new font size.
     * @param {string} [font=this.font] - The new font family.
     */
    update(x, y, text = this.text, fontSize = this.fontSize, font = this.font, rotation = this.rotation) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
        this.font = font;
        this.rotation = rotation;
    }

    getWidth(context) {
        context.font = `${this.fontSize}px ${this.font}`;
        return context.measureText(this.text).width;
    }

    getHeight(context) {
        context.font = `${this.fontSize}px ${this.font}`;

        const textMetrics = context.measureText(this.text);

        return textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    }

    /**
     * Renders the text on the canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation * (Math.PI / 180));
        context.font = `${this.fontSize}px ${this.font}`;
        context.fillStyle = this.fillStyle;
        context.fillText(this.text, 0, 0);
        context.restore();
    }

    /**
     * Performs collision logic with another entity.
     * Text entities don't participate in collisions, so this method always returns false.
     * @param {Entity} otherEntity - The other entity for collision detection.
     * @returns {boolean} - Always false for Text entities.
     */
    collisionLogic(otherEntity) {
        // Text entities don't participate in collisions
        return false;
    }
}
