import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";

/**
 * Class representing an elliptical entity, extending the base Entity class.
 * @extends Entity
 */
export class Ellipse extends Entity {
    /**
     * Creates an instance of the Ellipse class.
     * @param {number} x - The x-coordinate of the center of the ellipse.
     * @param {number} y - The y-coordinate of the center of the ellipse.
     * @param {number} radius - The radius of the ellipse.
     * @param {string} [fillColor="red"] - The fill color of the ellipse (default is "red").
     */
    constructor(x, y, radius, fillColor = "red") {
        super(x, y);

        /**
         * The radius of the ellipse.
         * @type {number}
         */
        this.radius = radius;

        /**
         * The fill color of the ellipse.
         * @type {string}
         */
        this.fillColor = fillColor;
    }

    /**
     * Updates the position, radius, and fill color of the ellipse.
     * @param {number} x - The new x-coordinate of the center of the ellipse.
     * @param {number} y - The new y-coordinate of the center of the ellipse.
     * @param {number} [radius=this.radius] - The new radius of the ellipse.
     * @param {string} [fillColor=this.fillColor] - The new fill color of the ellipse.
     */
    update(x, y, radius = this.radius, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fillColor = fillColor;
    }

    /**
     * Renders the ellipse on the canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        context.fillStyle = this.fillColor;
        context.beginPath();
        context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        context.fill();
    }

    /**
     * Checks if a point (x, y) is within the ellipse.
     * @param {number} pointX - The x-coordinate of the point.
     * @param {number} pointY - The y-coordinate of the point.
     * @returns {boolean} - True if the point is inside the ellipse, false otherwise.
     */
    hitTest(pointX, pointY) {
        const distance = Math.sqrt((pointX - this.x) ** 2 + (pointY - this.y) ** 2);
        return distance <= this.radius;
    }

    /**
     * Performs collision logic with another entity.
     * @param {Entity} otherEntity - The other entity for collision detection.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    collisionLogic(otherEntity) {
        if (otherEntity instanceof Ellipse) {
            return this.collisionEllipseEllipse(otherEntity);
        } else if (otherEntity instanceof Rect) {
            return this.collisionEllipseRect(otherEntity);
        }
        
        return false;
    }

    collisionEllipseEllipse(otherEntity) {
        const distance = Math.sqrt((this.x - otherEntity.x) ** 2 + (this.y - otherEntity.y) ** 2);
        return distance <= this.radius + otherEntity.radius;
    }

    collisionEllipseRect(rect) {
        const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));
        const distanceX = this.x - closestX;
        const distanceY = this.y - closestY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        return distance <= this.radius;
    }
}
