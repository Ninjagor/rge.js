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
            entity.render(this.context);
        }
    } else {
        for (const entity of this.entities) {
            this.context.save();
            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            entity.render(this.context);
            this.context.restore();
        }
    }
}