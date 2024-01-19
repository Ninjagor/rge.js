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

export function initMouseTracking(event) {
    if (this.renderingOrigin == "topleft") {
        this.mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
        this.mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
    } else {
        const parentRect = this.canvas.parentElement.getBoundingClientRect();
        this.mouseX = event.clientX - parentRect.left - parentRect.width / 2;
        this.mouseY = event.clientY - parentRect.top - parentRect.height / 2;
    }
}