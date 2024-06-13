import { Entity } from "./Entity.js";
import { RGE } from "../core/index.js";


export class Group extends Entity {
    constructor(x, y, entities = [], rge) {
        super(x, y);
        this.entities = entities;
        this.offsets = [];

        if (rge && rge instanceof RGE) {
            rge.watch(() => {
                this.entities.forEach((entity, index) => {
                    const offsetX = this.offsets[index].x;
                    const offsetY = this.offsets[index].y;
                    entity.update(x + offsetX, y + offsetY);
                });
            }, [() => this.x, () => this.y])
        }
    }

    addEntity(entity, offsetX = 0, offsetY = 0) {
        this.entities.push(entity);
        this.offsets.push({ x: offsetX, y: offsetY });
        this.update(this.x, this.y)
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
}
