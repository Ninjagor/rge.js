/**
 * @typedef {Object} Entity
 * @property {function} render - Function to render the entity.
 * @property {function} destroy - Function to destroy the entity.
 */


import { addKeyPressAction, addMouseClickHandler, handleMouseClick, initMouseTracking } from "./inputs/index.js";

import { collideRectRect, collideRectEllipse, twoPointDist, collidePointPoly, collideLineEllipse, collidePointEllipse, collidePointLine, collideEllipsePoly, collideLineLine, collideLineRect, collideRectPoly, collideEllipseEllipse } from "./collisions/index.js";

import * as rendering from "./rendering/index.js"
import * as entities from "../Entities/index.js";
import * as loading from "./loading/index.js";


/**
 * Main class representing the game engine.
 * @class
 */
export class RGE {
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
        this.customZSort = () => { }
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
        this.textureLoadingTime = 1200;
        this.setup = () => {
            this.customSetup()
            this.setupExecuted = true;
        }
        this.renderEntities = rendering.renderEntities.bind(this)
        this.start = rendering.start.bind(this)
        this.configure = rendering.configure.bind(this);
        this.loadImage = loading.loadImage.bind(this);
        this.canvasLoadingView = loading.canvasLoadingView.bind(this);
        this.updateAssetLoadingCount = loading.updateAssetLoadingCount.bind(this);
    }

    setPreload(preloadFunction) {
        this.customPreload = preloadFunction;
    }

    enableDevMode() {
        console.warn("Dev mode is enabled. This may cause certain security features to be disabled, and may result in unexpected errors. In order to properly utilize devMode, make sure you call it at the TOP of your file (or right after you define `rge`).")
        this.textureLoadingTime = 0;
    }

     resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    handleResize = () => {
        this.resizeCanvas();
    };

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.entities = [];
        this.keyPressActions = {};
        this.pressedKeys = {};
        this.mouseClickHandlers = [];
        this.tickFunction = () => {};
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

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

    setCenterOrigin() {
        this.renderingOrigin = "center"
    }

    resetOrigin() {
        this.renderingOrigin = "topleft"
    }
    
    customZSort() { }

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
}