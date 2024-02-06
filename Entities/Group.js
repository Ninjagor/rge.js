import { Entity } from "./Entity.js";

export class Group extends Entity {
    constructor(x, y, entities = []) {
        super(x, y);
        this.entities = entities;
        this.offsets = [];
    }

    addEntity(entity, offsetX = 0, offsetY = 0) {
        this.entities.push(entity);
        this.offsets.push({ x: offsetX, y: offsetY });
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            this.offsets.splice(index, 1);
        }
    }

    update(x, y) {
        this.x = x;
        this.y = y;
        this.entities.forEach((entity, index) => {
            const offsetX = this.offsets[index].x;
            const offsetY = this.offsets[index].y;
            entity.update(x + offsetX, y + offsetY);
        });
    }

    render(context) {
        this.entities.forEach(entity => {
            entity.render(context);
        });
    }

    hitTest(pointX, pointY) {
        for (const entity of this.entities) {
            if (entity.hitTest(pointX, pointY)) {
                return true;
            }
        }
        return false;
    }
}
