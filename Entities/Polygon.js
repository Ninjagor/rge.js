import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";
import { Ellipse } from "./Ellipse.js";

export class Polygon extends Entity {
    constructor(x, y, vertices, fillColor = "green", data = {}) {
        super(x, y);
        const { borderWidth = 0, borderColor = "black" } = data;
        this.vertices = vertices;
        this.fillColor = fillColor;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
        this.debug = false;
        this.imageRotation = 0;
    }

    debugMode() {
        this.debug = true;
    }

    update(x, y, vertices = this.vertices, fillColor = this.fillColor) {
        this.x = x;
        this.y = y;
        this.vertices = vertices;
        this.fillColor = fillColor;
    }

    getBoundingBox() {
        let minX = this.vertices[0].x + this.x;
        let maxX = this.vertices[0].x + this.x;
        let minY = this.vertices[0].y + this.y;
        let maxY = this.vertices[0].y + this.y;

        for (let i = 1; i < this.vertices.length; i++) {
            const x = this.vertices[i].x + this.x;
            const y = this.vertices[i].y + this.y;

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

     /**
     * Adds a texture to the polygon.
     * @param {string} textureUrl - The URL of the texture image.
     * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
     */
     setTexture(textureImage, rotation = 0, fillMode = "stretched") {
        this.texture = textureImage;
        this.fillMode = fillMode;
        this.renderTexture = true;
        this.imageRotation = rotation;
    }

    /**
     * Renders the polygon on the canvas with optional texture.
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
            context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);

            for (let i = 1; i < this.vertices.length; i++) {
                context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
            }

            this.renderBorder(context)
            context.closePath();
            context.fill();
        }

        if (this.debug) {
            this.renderDebugBorder(context);
        }
    }

    renderDebugBorder(context) {
        const debugBorderColor = "lime";
        context.strokeStyle = debugBorderColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    
        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        }
    
        context.closePath();
        context.stroke();
    }

    renderBorder(context) {
        const borderColor = this.borderColor;
        context.strokeStyle = borderColor;
        context.lineWidth = this.borderWidth;
        context.beginPath();
        context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    
        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        }
    
        context.closePath();
        context.stroke();
    }

    /**
     * Renders the polygon with texture using the "stretched" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderStretched(context) {
        // context.save();
        // context.beginPath();
        // context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
        //
        // for (let i = 1; i < this.vertices.length; i++) {
        //     context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        // }
        //
        // context.closePath();
        // context.clip();
        // context.drawImage(this.texture, this.x, this.y, this.getWidth(), this.getHeight());
        // context.restore();
      this.renderCover(context);
    }

    /**
     * Renders the polygon with texture using the "cover" fill mode.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     */
    renderCover(context) {
const boundingBox = this.getBoundingBox();
        const targetWidth = boundingBox.width;
        const targetHeight = boundingBox.height;

        context.save();
        context.translate(this.x, this.y); // Translate to the center of the polygon
        context.rotate(this.imageRotation * Math.PI / 180); // Apply rotation
        context.translate(-this.x, -this.y); // Translate back

        context.beginPath();
        context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);

        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        }

        context.closePath();
        context.clip();
        context.drawImage(this.texture, boundingBox.x, boundingBox.y, targetWidth, targetHeight);
        context.restore();       context.restore();
    }

    hitTest(pointX, pointY) {
        let inside = false;

        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            const xi = this.vertices[i].x + this.x;
            const yi = this.vertices[i].y + this.y;
            const xj = this.vertices[j].x + this.x;
            const yj = this.vertices[j].y + this.y;

            const intersect = ((yi > pointY) !== (yj > pointY)) &&
                (pointX < ((xj - xi) * (pointY - yi)) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    collisionLogic(otherEntity) {
        

        // Add more cases for other shapes if needed

        return false;
    }
}
