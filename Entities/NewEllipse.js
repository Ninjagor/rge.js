import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";

/**
 * Class representing an elliptical entity, extending the base Entity class.
 * @extends Entity
 */
export class NewEllipse extends Entity {
    /**
     * Creates an instance of the Ellipse class.
     * @param {number} x - The x-coordinate of the center of the ellipse.
     * @param {number} y - The y-coordinate of the center of the ellipse.
     * @param {number} radius - The radius of the ellipse.
     * @param {string} [fillColor="red"] - The fill color of the ellipse (default is "red").
     */
    constructor(x, y, width, height, fillColor = "red") {
        super(x, y);

        /**
         * The radius of the ellipse.
         * @type {number}
         */
        this.width = width;

        this.height = height;

        /**
         * The fill color of the ellipse.
         * @type {string}
         */
        this.fillColor = fillColor;

        this.debug = false;
    }

    renderDebugBorder(context) {
        const debugBorderColor = "lime";
        context.strokeStyle = debugBorderColor;
        context.lineWidth = 2;
        context.beginPath();
        context.ellipse(this.x, this.y, this.width, this.height, 0, 0, 2 * Math.PI);
        context.stroke();
    }

    update(x, y, width = this.width, height = this.height, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    debugMode() {
        this.debug = true;
    }

    /**
     * Renders the ellipse on the canvas with optional texture.
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
            context.beginPath();
            context.ellipse(this.x, this.y, this.width, this.height, 0, 0, 2 * Math.PI);
            context.fill();
        }

        if (this.debug) {
            this.renderDebugBorder(context);
        }
    }

    renderLoadingBackground(context) {
        const loadingBackgroundColor = "gray";
        context.fillStyle = loadingBackgroundColor;
        context.beginPath();
        context.ellipse(this.x, this.y, this.width, this.height, 0, 0, 2 * Math.PI);
        context.fill();
    }

    /**
     * Renders the ellipse with texture using the "stretched" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderStretched(context) {
        context.save();
        context.beginPath();
        context.ellipse(this.x, this.y, this.width, this.height, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(this.texture, this.x - this.width, this.y - this.height, 2 * this.width, 2 * this.height);
        context.restore();
    }

    /**
     * Renders the ellipse with texture using the "cover" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderCover(context) {
        const aspectRatio = this.texture.width / this.texture.height;
        // const targetRadius = this.radius;

        // Center the texture and cut off the overflow
        const offsetX = this.x - targetRadius;
        const offsetY = this.y - targetRadius;
        
        context.save();
        context.beginPath();
        context.ellipse(this.x, this.y, this.width, this.height, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(this.texture, offsetX, offsetY, 2 * this.width * aspectRatio, 2 * this.height);
        context.restore();
    }

    /**
     * Checks if a point (x, y) is within the ellipse.
     * @param {number} pointX - The x-coordinate of the point.
     * @param {number} pointY - The y-coordinate of the point.
     * @returns {boolean} - True if the point is inside the ellipse, false otherwise.
     */
    hitTest(pointX, pointY) {
        const dx = (pointX - this.x) / (this.width / 2);
        const dy = (pointY - this.y) / (this.height / 2);
        return (dx ** 2 + dy ** 2) <= 1;
    }

    
}
