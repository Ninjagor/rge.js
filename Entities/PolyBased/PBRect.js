import { Entity } from "../Entity.js";
import { RGE } from "../../core/index.js";
import { Polygon } from "../Polygon.js";

export class PBRect extends Entity {
    constructor(x, y, data) {
        super(x, y);

        const { EngineRef, width, height, rotation = 0, fillColor = "red", borderWidth = 0, borderColor = "black" } = data;

        if (!EngineRef || !(EngineRef instanceof RGE)) {
            throw new Error("EngineRef is required as instance of Engine.");
        }
        if (!width || !height) {
            throw new Error("`width` and `height` are mandatory fields.");
        }

        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.fillColor = fillColor;
        this.EngineRef = EngineRef;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
        this.polyrectRef = null;

        this.generatePoly();
    }

    getRef() {
        return this.polyrectRef;
    }

    generatePoly() {
        const rotatedRectVertices = this.calculateRotatedRectVertices(this.x, this.y, this.width, this.height, this.rotation);

        const rotatedRectPolygon = new Polygon(this.x, this.y, rotatedRectVertices, this.fillColor, {
            borderWidth: this.borderWidth,
            borderColor: this.borderColor
        });
        this.polyrectRef = rotatedRectPolygon;
        this.EngineRef.entities.push(rotatedRectPolygon);
        // this.EngineRef.debugEntity(rotatedRectPolygon);
    }

    calculateRotatedRectVertices(x, y, width, height, angle) {
        x = 1;
        y = 1;
        const radians = angle * Math.PI / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        const x1 = x - width / 2;
        const y1 = y - height / 2;
        const x2 = x + width / 2;
        const y2 = y - height / 2;
        const x3 = x + width / 2;
        const y3 = y + height / 2;
        const x4 = x - width / 2;
        const y4 = y + height / 2;
        
        const rotatedX1 = x + (x1 - x) * cos - (y1 - y) * sin;
        const rotatedY1 = y + (x1 - x) * sin + (y1 - y) * cos;
        const rotatedX2 = x + (x2 - x) * cos - (y2 - y) * sin;
        const rotatedY2 = y + (x2 - x) * sin + (y2 - y) * cos;
        const rotatedX3 = x + (x3 - x) * cos - (y3 - y) * sin;
        const rotatedY3 = y + (x3 - x) * sin + (y3 - y) * cos;
        const rotatedX4 = x + (x4 - x) * cos - (y4 - y) * sin;
        const rotatedY4 = y + (x4 - x) * sin + (y4 - y) * cos;
        
        return [
            { x: rotatedX1, y: rotatedY1 },
            { x: rotatedX2, y: rotatedY2 },
            { x: rotatedX3, y: rotatedY3 },
            { x: rotatedX4, y: rotatedY4 }
        ];
    }
    
    
    

    update(x, y, data) {
        const { width = this.width, height = this.height, rotation = this.rotation, fillColor = this.fillColor } = data || {};
    
        if (this.polyrectRef) {
            this.polyrectRef.update(x, y);
            const rotatedRectVertices = this.calculateRotatedRectVertices(this.polyrectRef.x, this.polyrectRef.y, width, height, rotation);
            // console.log(rotatedRectVertices)
            this.polyrectRef.vertices = rotatedRectVertices;
            this.polyrectRef.fillColor = fillColor;
        }
    }
}
