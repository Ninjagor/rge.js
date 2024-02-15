import { UIRect } from "./UIRect.js";
import { Text } from "../Text.js";
import { Group } from "../Group.js";
import { Entity } from "../Entity.js";
import { RGE } from "../../core/index.js";

export class Button extends Entity {
    constructor(x, y, data) {
        super(x, y);
        const { EngineRef, buttonColor = "red", borderRadius = 0, borderWidth = 0, borderColor = "black", text, textSize = 16, textColor = "black", font = "Arial", onClick } = data;

        this.EngineRef = EngineRef;
        this.checkWrongTypeError();
        this.text = text;
        this.textSize = textSize;
        this.textColor = textColor;
        this.font = font;

        this.fillColor = buttonColor;
        this.br = borderRadius;
        this.bw = borderWidth;
        this.bc = borderColor;

        this.onClick = onClick;
        this.groupWrapper = null;
        this.textRef = null;

        this.createEntities();

    }

    checkWrongTypeError(error = null) {
        if (!(this.EngineRef instanceof RGE)) {
            this.alertWrongTypeError();
        } else {
            if (error != null || error != undefined) {
                throw new Error(error);
            }
        }
    }

    alertWrongTypeError() {
        throw new Error(`EngineRef is not of type \`Engine\`. Expected type \`Engine\`. Recieved type \`${typeof(this.EngineRef)}\``);
    }

    createEntities() {
        try {
            const group = new Group(this.x, this.y);
            // this.EngineRef.debugEntity(group, 30);
            this.EngineRef.entities.push(group);

            const text = new Text(this.x, this.y, this.text, this.textSize, this.textColor, this.font);
            this.EngineRef.entities.push(text);
            text.zIndex = 10;

            const textWidth = text.getWidth(this.EngineRef.context);
            const textHeight = text.getHeight(this.EngineRef.context)
            // text.update(text.x - (textWidth/2), text.y + (textHeight / 3) + (textHeight / 10));


            

            const rect = new UIRect(this.x, this.y, textWidth + (textWidth*0.5), textHeight + (textHeight*2), this.fillColor, true, this.br, this.bw, this.bc);
            rect.zIndex = 0;
            this.EngineRef.entities.push(rect);

            rect.onClick = this.onClick;
            this.EngineRef.addMouseClickHandler(rect);

                  // text.update(text.x - (textWidth/2), text.y + (textHeight / 3) + (textHeight / 10));

            group.addEntity(text);
            group.addEntity(rect);

            text.x = text.x - (textWidth/2)
            text.y = text.y + (textHeight / 3) + (textHeight / 10)


            this.groupWrapper = group;
            this.textRef = text;
        } catch(error) {
            this.checkWrongTypeError(error);
        }
    }

    update(x, y) {
        this.x = x;
        this.y = y;

        if (this.groupWrapper) {
            this.groupWrapper.update(x, y);

            if (this.textRef) {
                const textWidth = this.textRef.getWidth(this.EngineRef.context);
                const textHeight = this.textRef.getHeight(this.EngineRef.context)
                this.textRef.update(x - (textWidth/2), y + (textHeight / 3) + (textHeight / 10))
            }
        }
    }

    // No render needed, as the Button Widget simply renders and manages entities, it (by nature) is not a true Entity.
    render(context) { }
}
