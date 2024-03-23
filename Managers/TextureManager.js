export class TextureManager {
    constructor(entity) {
        this.entity = entity;
        this.currentTexture = 0;
        this.textures = [];
    }

    addTexture(texture) {
        this.textures.push(texture);
    }

    applyTexture(textureNumber) {
        this.currentTexture = textureNumber;
        this.entity.setTexture(this.textures[textureNumber]);
    }

    removeTexture() {
        this.entity.setTexture(null);
    }

    nextTexture() {
        if (this.currentTexture < this.textures.length - 1) {
            this.currentTexture += 1;
        } else {
            this.currentTexture = 0;
        }
        this.applyTexture(this.currentTexture);
    }
    
    prevTexture() {
        if (this.currentTexture > 0) {
            this.currentTexture -= 1;
        } else {
            this.currentTexture = 0;
        }
        this.applyTexture(this.currentTexture);
    }
}