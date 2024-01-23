/**
 * Base class representing an entity.
 * @class
 */
export class Entity {
    /**
     * Creates an instance of the Entity class.
     * @param {number} x - The x-coordinate of the entity.
     * @param {number} y - The y-coordinate of the entity.
     */
    constructor(x, y, zIndex = 0) {
        /**
         * The x-coordinate of the entity.
         * @type {number}
         */
        this.x = x;

        /**
         * The y-coordinate of the entity.
         * @type {number}
         */
        this.y = y;

        /**
         * The z-Index of the entity
         * @type {number} default 0
         */
        this.zIndex = zIndex;

        /**
         * Indicates whether the entity is destroyed.
         * @type {boolean}
         */
        this.isDestroyed = false;

        /**
         * Callback function to be executed on entity click.
         * @type {?function}
         */
        this.onClick = null;
    }

    /**
     * Abstract method to be overridden by subclasses for updating the entity.
     * @abstract
     */
    update() {
        throw new Error('Method "update" must be implemented by subclasses');
    }

    addId(id) {
        this.id = id;
    }

    removeId(id) {
        this.id = null;
    }

    modifyId(id) {
        this.id = id;
    }

    /**
     * Abstract method to be overridden by subclasses for rendering the entity.
     * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
     * @abstract
     */
    render(context) {
        throw new Error('Method "render" must be implemented by subclasses');
    }

    /**
     * Checks if the entity collides with another entity.
     * @param {Entity} otherEntity - The other entity to check collision with.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    // collidesWith(otherEntity) {
    //     if (this.isDestroyed || otherEntity.isDestroyed) {
    //         return false;
    //     }

    //     return this.collisionLogic(otherEntity);
    // }

    /**
     * Abstract method to be overridden by subclasses for specific collision logic.
     * @param {Entity} otherEntity - The other entity involved in the collision.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     * @abstract
     */
    collisionLogic(otherEntity) {
        // Subclasses should implement this method for their specific collision logic
        throw new Error("Method 'collisionLogic' must be implemented by subclasses.");
    }

    /**
     * Marks the entity as destroyed.
     */
    destroy() {
        this.isDestroyed = true;
    }

    /**
     * Executes the onClick callback if defined.
     */
    onClickHandler() {
        if (this.onClick) {
            this.onClick();
        }
    }
}
