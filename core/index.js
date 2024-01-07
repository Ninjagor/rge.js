import { addKeyPressAction, handleKeyPress, handleKeyUp, addMouseClickHandler, handleMouseClick } from "./inputs/index.js";

export class RGE {
    canvas;
    context;
    tickFunction;
    targetFps;
    targetFrameTime;
    lastTimestamp;
    deltaAccumulator;
    keyPressActions;
    pressedKeys;
    addKeyPressAction;
    handleKeyPress;
    handleKeyUp;
    addMouseClickHandler;
    handleMouseClick;
    mouseClickHandlers;
    constructor(canvasId, targetFps = 60) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.entities = [];
        this.tickFunction = () => {};

        this.targetFps = targetFps;
        this.targetFrameTime = 1000 / targetFps;

        this.lastTimestamp = 0;
        this.deltaAccumulator = 0;

        this.keyPressActions = {};
        this.pressedKeys = {};

        this.addKeyPressAction = addKeyPressAction.bind(this);
        this.handleKeyPress = handleKeyPress.bind(this);
        this.handleKeyUp = handleKeyUp.bind(this);

        this.addMouseClickHandler = addMouseClickHandler.bind(this);
        this.handleMouseClick = handleMouseClick.bind(this);

        this.mouseClickHandlers = [];
        this.canvas.addEventListener("click", this.handleMouseClick.bind(this));
    }

    start() {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    

    addEntity(entity) {
        this.entities.push(entity);
    }

    setTickFunction(tickFunction) {
        this.tickFunction = tickFunction;
    }

    gameLoop(timestamp) {
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }

        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.deltaAccumulator += deltaTime;

        while (this.deltaAccumulator >= this.targetFrameTime) {
            this.tickFunction();
            this.clearCanvas();
            this.renderEntities();
            this.deltaAccumulator -= this.targetFrameTime;
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }


    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroyEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            entity.destroy()
        }
    }

    renderEntities() {
        for (const entity of this.entities) {
            entity.render(this.context);
        }
    }
}
