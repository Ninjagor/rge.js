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
    constructor(x, y, width, height, fillColor = "blue", centered = true) {
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

        if (centered) {
            this.enableCentered();
        } else {
            this.disableCentered();
        }

    }
    
    enableCentered() {
        this.centered = true;
        this.x = this.x-this.width/2
        this.y = this.y-this.height/2
    }

    disableCentered() {
        this.centered = false;
        this.x = this.x
        this.y = this.y
    }

    /**
     * Updates the position and fill color of the rectangle.
     * @param {number} x - The new x-coordinate of the top-left corner of the rectangle.
     * @param {number} y - The new y-coordinate of the top-left corner of the rectangle.
     * @param {string} [fillColor=this.fillColor] - The new fill color of the rectangle.
     */
    update(x, y, fillColor = this.fillColor) {
        if (this.centered) {
            this.x = x-this.width/2
            this.y = y-this.height/2
        } else {
            this.x = x;
            this.y = y;
        }
        this.fillColor = fillColor;
    }

    /**
     * Adds a texture to the rectangle.
     * @param {string} textureUrl - The URL of the texture image.
     * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
     */
    setTexture(textureImage, fillMode = "stretched") {
        // Set up an onload event to ensure the image is loaded before rendering
        this.texture = textureImage;
        this.fillMode = fillMode;
        this.renderTexture = true;
    }

    /**
     * Renders the rectangle on the canvas with optional texture.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    render(context) {
        if (this.texture) {
            if (this.texture.complete) {
                if (this.fillMode === "cover") {
                    this.renderCover(context);
                } else {
                    this.renderStretched(context);
                }
            } else {
                // Texture is still loading, render a gray background
                this.renderLoadingBackground(context);
            }
        } else {
            context.fillStyle = this.fillColor;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Renders a gray loading background while the texture is loading.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderLoadingBackground(context) {
        const loadingBackgroundColor = "gray";
        context.fillStyle = loadingBackgroundColor;
        context.fillRect(this.x, this.y, this.width, this.height);
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
}