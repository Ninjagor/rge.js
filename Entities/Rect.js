import { Entity } from "./Entity.js"

/**
 * Class representing a rectangular entity, extending the base Entity obj.
 * @extends Entity
 */
export class Rect extends Entity {
    /**
     * Creates an instance of the Rect class.
     * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
     * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} [fillColor="blue"] - The fill color of the rectangle (default is "blue").
     */
    constructor(x, y, width, height, fillColor = "blue") {
        super(x, y);

        /**
         * The width of the rectangle.
         * @type {number}
         */
        this.width = width;

        /**
         * The height of the rectangle.
         * @type {number}
         */
        this.height = height;

        /**
         * The fill color of the rectangle.
         * @type {string}
         */
        this.fillColor = fillColor;
    }

    /**
     * Updates the position and fill color of the rectangle.
     * @param {number} x - The new x-coordinate of the top-left corner of the rectangle.
     * @param {number} y - The new y-coordinate of the top-left corner of the rectangle.
     * @param {string} [fillColor=this.fillColor] - The new fill color of the rectangle.
     */
    update(x, y, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
    }

    /**
     * Renders the rectangle on the canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if a point (x, y) is within the rectangle.
     * @param {number} pointX - The x-coordinate of the point.
     * @param {number} pointY - The y-coordinate of the point.
     * @returns {boolean} - True if the point is inside the rectangle, false otherwise.
     */
    hitTest(pointX, pointY) {
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    /**
     * Performs collision logic with another rectangular entity.
     * @param {Rect} otherRect - The other rectangular entity for collision detection.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    collisionLogic(otherRect) {
        return !(
            this.x + this.width < otherRect.x ||
            this.x > otherRect.x + otherRect.width ||
            this.y + this.height < otherRect.y ||
            this.y > otherRect.y + otherRect.height
        );
    }
}