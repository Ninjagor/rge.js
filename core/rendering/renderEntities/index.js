import { Group } from "../../../Entities/index.js";

export function renderEntities() {
    // Sort via z-index
    this.entities.sort((a, b) => {
        return a.zIndex - b.zIndex
    })
    // Execute custom z-sort defined by user
    this.customZSort();
    
    // render entities based on canvas origin
    if (this.renderingOrigin == "topleft") {
        for (const entity of this.entities) {
            this.context.save();
            this.context.translate(-this.camx, this.camy);
            entity.render(this.context);
            this.context.restore();
        }
    } else {
        for (const entity of this.entities) {
            this.context.save();
            this.context.translate(this.canvas.width / 2 - this.camx, this.canvas.height / 2 + this.camy);
            entity.render(this.context);
            this.context.restore();
        }
    }
}