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
     * Adds a texture to the ellipse.
     * @param {string} textureUrl - The URL of the texture image.
     * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
     */
     setTexture(textureImage, fillMode = "stretched") {
        // const textureImage = new Image();
        // textureImage.src = textureUrl;

        // Set up an onload event to ensure the image is loaded before rendering
        // textureImage.onload = () => {
        //     this.texture = textureImage;
        //     this.fillMode = fillMode;
        //     this.renderTexture = true;
        // };
        this.texture = textureImage;
        this.fillMode = fillMode;
        this.renderTexture = true;
    }

    /**
     * Renders the ellipse on the canvas with optional texture.
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
            context.beginPath();
            context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
            context.fill();
        }
    }

    /**
     * Renders the ellipse with texture using the "stretched" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderStretched(context) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(this.texture, this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
        context.restore();
    }

    /**
     * Renders the ellipse with texture using the "cover" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderCover(context) {
        const aspectRatio = this.texture.width / this.texture.height;
        const targetRadius = this.radius;

        // Center the texture and cut off the overflow
        const offsetX = this.x - targetRadius;
        const offsetY = this.y - targetRadius;
        
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(this.texture, offsetX, offsetY, 2 * targetRadius * aspectRatio, 2 * targetRadius);
        context.restore();
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

    
}
