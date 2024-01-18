import { Ellipse } from "./Ellipse.js";
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
     * Adds a texture to the rectangle.
     * @param {string} textureUrl - The URL of the texture image.
     * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
     */
    setTexture(textureUrl, fillMode = "stretched") {
        const textureImage = new Image();
        textureImage.src = textureUrl;

        // Set up an onload event to ensure the image is loaded before rendering
        textureImage.onload = () => {
            this.texture = textureImage;
            this.fillMode = fillMode;
            this.renderTexture = true;
        };
    }

    /**
     * Renders the rectangle on the canvas with optional texture.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        if (this.renderTexture && this.texture) {
            if (this.fillMode === "cover") {
                this.renderCover(context);
            } else {
                this.renderStretched(context);
            }
        } else {
            context.fillStyle = this.fillColor;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Renders the rectangle with texture using the "stretched" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderStretched(context) {
        context.drawImage(this.texture, this.x, this.y, this.width, this.height);
    }

    /**
     * Renders the rectangle with texture using the "cover" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderCover(context) {
        const aspectRatio = this.texture.width / this.texture.height;
        const targetWidth = this.width;
        const targetHeight = this.width / aspectRatio;

        // Center the texture and cut off the overflow
        const offsetX = this.x;
        const offsetY = this.y + (this.height - targetHeight) / 2;

        context.drawImage(this.texture, offsetX, offsetY, targetWidth, targetHeight);
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

    collisionLogic(otherEntity) {
        if (otherEntity instanceof Ellipse) {
            return this.collisionRectEllipse(this, otherEntity)
        } else if (otherEntity instanceof Rect) {
            return this.collisionRectRect(this, otherEntity);
        }

        // Add more cases for other shapes if needed

        return false;
    }

    /**
     * Checks collision between two rectangles.
     * @param {Rect} rect1 - The first rectangle entity.
     * @param {Rect} rect2 - The second rectangle entity.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    collisionRectRect(rect1, rect2) {
        const overlapX = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));

        const overlapY = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));

        return overlapX > 0 && overlapY > 0;
    }

    /**
     * Checks collision between a rectangle and an ellipse.
     * @param {Rect} rect - The rectangle entity.
     * @param {Ellipse} ellipse - The ellipse entity.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    collisionRectEllipse(rect, ellipse) {
        const overlapX = Math.max(0, Math.min(rect.x + rect.width, ellipse.x + ellipse.radius) - Math.max(rect.x, ellipse.x - ellipse.radius));

    // Check for overlap on the Y-axis
        const overlapY = Math.max(0, Math.min(rect.y + rect.height, ellipse.y + ellipse.radius) - Math.max(rect.y, ellipse.y - ellipse.radius));

        // If there is overlap on both axes, a collision occurs
        return overlapX > 0 && overlapY > 0;
    }

    
}