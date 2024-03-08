export function addMouseClickHandler(handler) {
    this.mouseClickHandlers.push(handler);
}

export function handleMouseClick(event) {
    let mouseX;
    let mouseY
    if (this.renderingOrigin == "topleft") {
        mouseX = event.clientX - this.canvas.getBoundingClientRect().left + this.camx;
        mouseY = event.clientY - this.canvas.getBoundingClientRect().top - this.camy;
    } else {
        const parentRect = this.canvas.parentElement.getBoundingClientRect();
        mouseX = event.clientX - parentRect.left - parentRect.width / 2 + this.camx;
        mouseY = event.clientY - parentRect.top - parentRect.height / 2 - this.camy;
    }
    

    for (const entity of this.entities) {
        if (entity.hitTest && entity.hitTest(mouseX, mouseY)) {
            entity.onClickHandler();
            // for (const handler of this.mouseClickHandlers) {
            //     handler(entity);
            // }
        }
    }
}

export function initMouseTracking(event) {
    if (this.renderingOrigin == "topleft") {
        this.mouseX = event.clientX - this.canvas.getBoundingClientRect().left + this.camx;
        this.mouseY = event.clientY - this.canvas.getBoundingClientRect().top - this.camy;
    } else {
        const parentRect = this.canvas.parentElement.getBoundingClientRect();
        this.mouseX = event.clientX - parentRect.left - parentRect.width / 2 + this.camx;
        this.mouseY = event.clientY - parentRect.top - parentRect.height / 2 - this.camy;
    }
}