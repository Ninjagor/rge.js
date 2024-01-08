/**
 * @typedef {Object} Entity
 * @property {function} render - Function to render the entity.
 * @property {function} destroy - Function to destroy the entity.
 */


import { addKeyPressAction, handleKeyPress, handleKeyUp, addMouseClickHandler, handleMouseClick } from "./inputs/index.js";


/**
 * Main class representing the game engine.
 * @class
 */
export class RGE {
     /**
     * @type {HTMLCanvasElement} - The game canvas.
     */
    canvas;

    /**
     * @type {CanvasRenderingContext2D} - The rendering context of the canvas.
     */
    context;

    /**
     * @type {function} - The function to be executed on each game tick.
     */
    tickFunction;

    /**
     * @type {number} - Target frames per second for the game.
     */
    targetFps;

    /**
     * @type {number} - Target frame time in milliseconds.
     */
    targetFrameTime;

    /**
     * @type {number} - Timestamp of the last frame.
     */
    lastTimestamp;

    /**
     * @type {number} - Accumulated time difference between frames.
     */
    deltaAccumulator;

    /**
     * @type {Object.<string, KeyPressAction>} - Map of key press actions.
     */
    keyPressActions;

    /**
     * @type {Object.<string, boolean>} - Map of pressed keys.
     */
    pressedKeys;

    /**
     * @type {function} - Function to add key press actions.
     */
    addKeyPressAction;

    /**
     * @type {function} - Function to handle key press events.
     */
    handleKeyPress;

    /**
     * @type {function} - Function to handle key up events.
     */
    handleKeyUp;

    /**
     * @type {function} - Function to add mouse click handlers.
     */
    addMouseClickHandler;

    /**
     * @type {function} - Function to handle mouse click events.
     */
    handleMouseClick;

    /**
     * @type {MouseClickHandler[]} - Array of mouse click handlers.
     */
    mouseClickHandlers;

    /**
     * Creates an instance of RGE.
     * @param {string} canvasId - The ID of the HTML canvas element.
     * @param {number} [targetFps=60] - Target frames per second (default is 60).
     */
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

     /**
     * Starts the game loop.
     */
    start() {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**
     * Adds an entity to the game.
     * @param {Entity} entity - The entity to be added.
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

     /**
     * Sets the function to be executed on each game tick.
     * @param {function} tickFunction - The tick function.
     */
    setTickFunction(tickFunction) {
        this.tickFunction = tickFunction;
    }

    /**
     * The main game loop.
     * @param {number} timestamp - The current timestamp.
     */
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

     /**
     * Clears the game canvas.
     */
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Destroys an entity in the game.
     * @param {Entity} entity - The entity to be destroyed.
     */
    destroyEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            entity.destroy()
        }
    }

    /**
     * Renders all registered entities
     */
    renderEntities() {
        for (const entity of this.entities) {
            entity.render(this.context);
        }
    }
}