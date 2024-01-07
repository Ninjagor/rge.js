export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDestroyed = false;
        this.onClick = null;
    }

    // Abstract method to be overridden by subclasses
    update() {
        throw new Error('Method "update" must be implemented by subclasses');
    }

    // Abstract method to be overridden by subclasses
    render(context) {
        throw new Error('Method "render" must be implemented by subclasses');
    }

    collidesWith(otherEntity) {
        if (this.isDestroyed || otherEntity.isDestroyed) {
            return false;
        }

        return this.collisionLogic(otherEntity);
    }

    collisionLogic(otherEntity) {
        // Subclasses should implement this method for their specific collision logic
        throw new Error("Method 'additionalCollisionLogic' must be implemented by subclasses.");
    }

    destroy() {
        this.isDestroyed = true;
    }

    onClickHandler() {
        if (this.onClick) {
            this.onClick();
        }
    }
}