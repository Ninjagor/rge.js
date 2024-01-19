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
     */
    constructor(x, y, text, fontSize = 16, fillStyle = "black") {
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
        this.font = "Arial";

        /**
         * The fill style for the text.
         * @type {string}
         */
        this.fillStyle = fillStyle;
    }

    /**
     * Updates the position, text content, font size, and font family of the text.
     * @param {number} x - The new x-coordinate of the text position.
     * @param {number} y - The new y-coordinate of the text position.
     * @param {string} [text=this.text] - The new text content.
     * @param {number} [fontSize=this.fontSize] - The new font size.
     * @param {string} [font=this.font] - The new font family.
     */
    update(x, y, text = this.text, fontSize = this.fontSize, font = this.font) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
        this.font = font;
    }

    getWidth(context) {
        context.font = `${this.fontSize}px ${this.font}`;
        return context.measureText(this.text).width;
    } 

    /**
     * Renders the text on the canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        context.font = `${this.fontSize}px ${this.font}`;
        context.fillStyle = this.fillStyle;
        context.fillText(this.text, this.x, this.y);
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
