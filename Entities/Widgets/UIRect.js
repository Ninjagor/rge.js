import { Rect } from "../Rect.js";

export class UIRect extends Rect {
    constructor(x, y, width, height, fillColor = "blue", centered = true, borderRadius = 0, borderWidth = 0, borderColor = "blue") {
        super(x, y, width, height, fillColor, centered);
        this.borderRadius = borderRadius;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
    }

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
            if (this.borderRadius > 0) {
                this.renderRoundedRect(context, this.x, this.y, this.width, this.height, this.borderRadius, this.fillColor);
            } else {
                context.fillStyle = this.fillColor;
                context.fillRect(this.x, this.y, this.width, this.height);
            }

        }
        if (this.borderWidth >= 1) {
            this.renderBorder(context, this.borderRadius)
        }
    }

    renderRoundedRect(context, x, y, width, height, borderRadius, fillColor) {
        // Save the current context state
        context.save();
    
        // Begin a new path to draw the rounded rectangle
        context.beginPath();
    
        // Draw the rounded rectangle path
        context.moveTo(x + borderRadius, y);
        context.arcTo(x + width, y, x + width, y + height, borderRadius);
        context.arcTo(x + width, y + height, x, y + height, borderRadius);
        context.arcTo(x, y + height, x, y, borderRadius);
        context.arcTo(x, y, x + width, y, borderRadius);
        context.closePath();
    
        // Fill the rounded rectangle with the specified color
        context.fillStyle = fillColor;
        context.fill();
    
        // Restore the context state
        context.restore();
    }

    renderBorder(context, borderRadius = 0) {
        const borderColor = this.borderColor;
        context.strokeStyle = borderColor;
        context.lineWidth = this.borderWidth;
        
        if (borderRadius > 0) {
            context.save();
            context.beginPath();
            context.moveTo(this.x + borderRadius, this.y);
            context.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, borderRadius);
            context.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, borderRadius);
            context.arcTo(this.x, this.y + this.height, this.x, this.y, borderRadius);
            context.arcTo(this.x, this.y, this.x + this.width, this.y, borderRadius);
            context.closePath();
            context.stroke();
            context.restore();
        } else {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
