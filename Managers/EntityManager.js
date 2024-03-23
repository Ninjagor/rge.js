import { RGE } from "../core/index.js";

export class EntityManager {
    constructor(engineRef = null) {
        this.engineRef = engineRef;
        if (!engineRef instanceof RGE) {
            throw new Error("Expected engine ref to be of type Engine.");
        }

        this.entity = null;
        this.hitbox = null;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    setHitbox(hitbox) {
        this.hitbox = hitbox;
        if (this.entity) {
            this.engineRef.watch(() => {
                this.hitbox.x = this.entity.x;
                this.hitbox.y = this.entity.y;
            }, [() => this.entity.x, () => this.entity.y])
        }
    }

    render() {
        if (this.entity) {
            this.engineRef.addEntity(this.entity);
        }
        if (this.hitbox) {
            this.engineRef.addEntity(this.hitbox);
        }
    }

    destroy() {
        if (this.entity) {
            this.engineRef.destroyEntity(this.entity);
        }
        if (this.hitbox) {
            this.engineRef.destroyEntity(this.hitbox);
        }
    }
}