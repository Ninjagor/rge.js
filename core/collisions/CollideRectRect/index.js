/**
     * Checks if the rect collides with another rect.
     * @param {Rect} rect1
     * @param {Rect} rect2
     * @returns {boolean} - True if a collision occurs, false otherwise.
*/
export function collideRectRect(rect1, rect2) {
    if (rect1.isDestroyed || rect2.isDestroyed) {
        return false;
    }

    const overlapX = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));

    const overlapY = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));

    return overlapX > 0 && overlapY > 0;
}