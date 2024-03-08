import * as entities from "../../../Entities/index.js";

export function canvasLoadingView() {
    this.clearCanvas();
    // const entity = new entities.Text(0, 0, `Loading assets (${this.loadedAssetsCount}) of ${Object.keys(this.preloadedImages).length}`, 30, "black")
    const entity = new entities.Text(0, 0, `Loading assets...`, 30, "black")
    // console.log(entity.getWidth(this.context))
    entity.update(0-(entity.getWidth(this.context)/2), 0)
    this.context.save(); // Save the current state of the context
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2); // Translate to the center
    entity.render(this.context);
    this.context.restore();
}