/**
 * @typedef {Object} Entity
 * @property {function} render - Function to render the entity.
 * @property {function} destroy - Function to destroy the entity.
 */


import { addKeyPressAction, addMouseClickHandler, handleMouseClick, initMouseTracking } from "./inputs/index.js";

import { collideRectRect, collideRectEllipse, twoPointDist, collidePointPoly, collideLineEllipse, collidePointEllipse, collidePointLine, collideEllipsePoly, collideLineLine, collideLineRect, collideRectPoly, collideEllipseEllipse } from "./collisions/index.js";

import * as entities from "../Entities/index.js";


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

    keyStates;

    collideRectRect;

    collideRectEllipse;

    collidePointPoly;

    findDistance;

    mouseX;

    mouseY;

    /**
     * @type {string} - Background color of the canvas.
     */
    backgroundColor;

    /**
     * @type {string} - URL of the background image.
     */
    backgroundImage;

    preloadExecuted;

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

        this.mouseX = 0;
        this.mouseY = 0;

        this.addKeyPressAction = addKeyPressAction.bind(this);

        this.addMouseClickHandler = addMouseClickHandler.bind(this);
        this.handleMouseClick = handleMouseClick.bind(this);

        this.keyStates = {}

        this.mouseClickHandlers = [];
        this.canvas.addEventListener("mousedown", this.handleMouseClick.bind(this));

        this.collideRectRect = collideRectRect.bind(this);
        this.collideRectEllipse = collideRectEllipse.bind(this);
        this.collidePointPoly = collidePointPoly.bind(this);

        this.findDistance = twoPointDist.bind(this);

        this.initMouseTracking  = initMouseTracking.bind(this)

        this.canvas.addEventListener("mousemove", this.initMouseTracking.bind(this));

        this.collideLineEllipse = collideLineEllipse.bind(this);
        this.collidePointEllipse = collidePointEllipse.bind(this);
        this.collidePointLine = collidePointLine.bind(this);
        this.collideEllipsePoly = collideEllipsePoly.bind(this);

        this.collideLineLine = collideLineLine.bind(this);
        this.collideLineRect = collideLineRect.bind(this);
        this.collideRectPoly = collideRectPoly.bind(this);

        this.collideEllipseEllipse = collideEllipseEllipse.bind(this);

        this.animationFrameId = null;

        window.addEventListener('resize', this.handleResize);

        // Initial canvas resize
        this.resizeCanvas();

        this.renderingOrigin = "topleft";

        this.customZSort = () => {

        }

        this.canvas.addEventListener("mousedown", () => {
            this.isMouseDown = true;
        });

        this.canvas.addEventListener("mouseup", () => {
            this.isMouseDown = false;
        });

        this.backgroundColor = null;
        this.backgroundImage = null;
        this.backgroundRepeat = null; // Default is no repeat
        this.backgroundSize = null;

        this.preloadExecuted = false;
        this.preload = () => {
            this.customPreload()
            this.preloadExecuted = true; 
        }
        this.customPreload = () => {}

        this.preloadedImages = {};
        this.customPreloadFunction = null;

        this.setupExecuted = false;
        this.customSetup = () => {}

        this.loadedAssetsCount = 0;

        this.setup = () => {
            // setTimeout(() => {
            //     this.customSetup()
            //     this.setupExecuted = true;
            // })
            this.customSetup()
                this.setupExecuted = true;
        }
    }

     /**
     * Starts the game loop.
     */
     start() {
        if (!this.preloadExecuted) {
            this.preload();
        }
        if (!this.setupExecuted) {
            this.setup();
        }
        // this.canvasLoadingView()
        this.canvasLoadingView()
        this.updateAssetLoadingCount();
        setTimeout(() => {
           // console.log("Began gameloop")
            this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }, (Object.keys(this.preloadedImages).length)*(1500/(Object.keys(this.preloadedImages).length)))

    }

    setPreload(preloadFunction) {
        this.customPreload = preloadFunction;
    }

    updateAssetLoadingCount() {
            let i = 0;
            const interval = setInterval(() => {
                // console.log("hi there")
                this.canvasLoadingView()
                this.loadedAssetsCount += 1;

                if (!(i < Object.keys(this.preloadedImages).length)) {
                    clearInterval(interval)
                }
                i++
            }, (1500/(Object.keys(this.preloadedImages).length)))
    }

    canvasLoadingView() {
        this.clearCanvas();
        const entity = new entities.Text(0, 0, `Loading assets (${this.loadedAssetsCount}) of ${Object.keys(this.preloadedImages).length}`, 30, "black")
        // console.log(entity.getWidth(this.context))
        entity.update(0-(entity.getWidth(this.context)/2), 0)
        this.context.save(); // Save the current state of the context
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2); // Translate to the center
        entity.render(this.context);
        this.context.restore();
    }

     /**
     * Resizes the game canvas based on its parent's size.
     */
     resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    /**
     * Handles the window resize event and resizes the canvas.
     */
    handleResize = () => {
        this.resizeCanvas();
        // Additional logic to redraw content if needed
    };

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.entities = [];
        this.keyPressActions = {};
        this.pressedKeys = {};
        this.mouseClickHandlers = [];
        this.tickFunction = () => {};
    }

    returnPressedKeys() {
        // console.log("Pressed Keys:")
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

    setupFunction(setupFunc) {
        this.customSetup = setupFunc;
    }

    /**
     * The main game loop.
     * @param {number} timestamp - The current timestamp.
     */
    gameLoop(timestamp) {
        if (this.preloadExecuted && this.setupExecuted) {
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
     * Loads an image and saves it to the preloaded images map.
     * @param {string} imageUrl - URL of the image.
     * @returns {HTMLImageElement} - Loaded image.
     */
    loadImage(imageUrl) {
        if (this.preloadExecuted) {
            throw new Error("loadImage can only be used in preload()");
            return;
        }
        const image = new Image();
        image.src = imageUrl;
        // Extracting the image name from the URL as a key
        const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        this.preloadedImages[imageName] = image;
        return image;
    }

    setCenterOrigin() {
        this.renderingOrigin = "center"
    }

    resetOrigin() {
        this.renderingOrigin = "topleft"
    }
    
    customZSort() {
        // Empty func to be optionally configured by the game dev.
    }

    /**
     * Abstract method to set the background of the canvas.
     * @param {Object} options - Background options.
     * @param {string} options.color - Background color (CSS color string).
     * @param {string} options.image - URL of the background image.
     * @param {string} options.repeat - Background repeat mode (CSS 'background-repeat' property).
     * @param {string} options.size - Background fill mode (CSS 'background-size' property).
     */
    setBackground(options = {}) {
        const { color = null, image = null, repeat = null } = options;
    
        this.backgroundColor = color;
        this.backgroundImage = image;
        this.backgroundRepeat = repeat;
    
        if (color) {
            this.canvas.style.backgroundColor = color;
        } else if (image) {
            let backgroundStyle = `url(${image})`;
    
            if (repeat) {
                backgroundStyle += ` ${repeat}`;
            }
    
            backgroundStyle += ` / 100% 100%`; // Set backgroundSize statically
    
            this.canvas.style.background = backgroundStyle;
        } else {
            // No background options provided, clear the background
            this.canvas.style.backgroundColor = null;
            this.canvas.style.background = null;
        }
    }
    
    

    /**
     * Renders all registered entities
     */
    renderEntities() {
        // const entitiesList = this.entities;
        // entitiesList.sort((a, b) => {
        //     return a.zIndex - b.zIndex
        // })
        this.entities.sort((a, b) => {
            return a.zIndex - b.zIndex
        })
        this.customZSort();
        if (this.renderingOrigin == "topleft") {
            for (const entity of this.entities) {
                entity.render(this.context);
            }
        } else {
            for (const entity of this.entities) {
                this.context.save(); // Save the current state of the context
                this.context.translate(this.canvas.width / 2, this.canvas.height / 2); // Translate to the center
                entity.render(this.context);
                this.context.restore(); // Restore the context to its previous state
            }
        }
    }
}