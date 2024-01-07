export function addMouseClickHandler(handler) {
    this.mouseClickHandlers.push(handler);
}

export function handleMouseClick(event) {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    for (const entity of this.entities) {
        if (entity.hitTest && entity.hitTest(mouseX, mouseY)) {
            entity.onClickHandler();
            for (const handler of this.mouseClickHandlers) {
                handler(entity);
            }
        }
    }
}