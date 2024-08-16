/**
 * @typedef {Object} Entity
 * @property {function} render - Function to render the entity.
 * @property {function} destroy - Function to destroy the entity.
 */


import { addKeyPressAction, addMouseClickHandler, handleMouseClick, initMouseTracking } from "./inputs/index.js";

import { collideRectRect, collideRectEllipse, twoPointDist, collidePointPoly, collideLineEllipse, collidePointEllipse, collidePointLine, collideEllipsePoly, collideLineLine, collideLineRect, collideRectPoly, collideEllipseEllipse, collideLinePoly, collidePolyPoly } from "./collisions/index.js";

import { Text } from "../Entities/index.js";
import { Group } from "../Entities/index.js";
import { Error } from "../Entities/Widgets/Error.js";

import * as rendering from "./rendering/index.js"
import * as entities from "../Entities/index.js";
import * as loading from "./loading/index.js";
import * as localdata from "./localdata/index.js";
// import * as eventbus from "./eventbus/index.js"
import { EventBus } from "./eventbus/index.js";

/**
 * Main class representing the game engine.
 * @class
 */
export class RGE {
    /**
     * Initializes a new instance of the RGE class, representing the game engine.
     * 
     * @param {string} canvasId - The ID of the canvas element to render the game on.
     * @param {number} [targetFps=60] - The target frames per second for the game.
     * @param {object} [data={}] - Additional data to initialize the game engine with.
     * @param {boolean} [data.isEmbedded=false] - Whether the game engine is embedded in another application.
     * @param {boolean} [data.__fcm__=false] - Whether to ignore the raw Engine instantiation warning.
     * @param {number} [data.maxEntities=500] - The maximum number of entities allowed in the game.
     * @param {boolean} [data.webGLMode=false] - Whether to use WebGL mode for rendering.
     */
    constructor(canvasId, targetFps = 60, data = {}) {
        const { isEmbedded = false, __fcm__ = false, maxEntities = 500, webGLMode = false } = data;
        this.isEmbedded = isEmbedded;
        this.canvas = document.getElementById(canvasId);
        if (this.isEmbedded) {
            this.canvas.setAttribute('data-entities', JSON.stringify([]));
        }
        if (!__fcm__) {
            console.warn("Your code contains a raw Engine instantiation, which is not recommended for larger scale projects. Use SceneManager instead. To ignore, set __fcm__ to true in your Engine instantiation.")
        }
        this.maxEntities = maxEntities;
        this.canvasId = canvasId;
        if (webGLMode) {
            this.context = this.canvas.getContext('webgl');
        } else {
            this.context = this.canvas.getContext('2d');
        }

        this.webGLMode = webGLMode;
        this.entities = [];
        this.tickFunction = () => { };
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
        this.initMouseTracking = initMouseTracking.bind(this)
        this.canvas.addEventListener("mousemove", this.initMouseTracking.bind(this));
        this.collideLineEllipse = collideLineEllipse.bind(this);
        this.collidePointEllipse = collidePointEllipse.bind(this);
        this.collidePointLine = collidePointLine.bind(this);
        this.collideEllipsePoly = collideEllipsePoly.bind(this);
        this.collideLineLine = collideLineLine.bind(this);
        this.collideLineRect = collideLineRect.bind(this);
        this.collideRectPoly = collideRectPoly.bind(this);
        this.collideEllipseEllipse = collideEllipseEllipse.bind(this);
        this.collideLinePoly = collideLinePoly.bind(this);
        this.collidePolyPoly = collidePolyPoly.bind(this);
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
        /**
         * Preloads the game by executing the custom preload function and sets the preloadExecuted flag to true.
         *
         * @return {Promise<void>} A promise that resolves when the preload is complete.
         */
        this.preload = async () => {
            await this.customPreload()
            this.preloadExecuted = true;
        }
        this.customPreload = async () => { }
        this.preloadedImages = {};
        this.preloadedFonts = {};
        this.customPreloadFunction = null;
        this.setupExecuted = false;
        this.customSetup = () => { }
        this.loadedAssetsCount = 0;
        this.textureLoadingTime = 0;
        /**
         * Executes the custom setup function and marks the setup as executed.
         *
         * @return {void} No return value.
         */
        this.setup = () => {
            this.customSetup()
            this.setupExecuted = true;
        }
        this.renderEntities = rendering.renderEntities.bind(this)
        this.start = rendering.start.bind(this)
        this.configure = rendering.configure.bind(this);
        this.loadImage = loading.loadImage.bind(this);
        this.loadFont = loading.loadFont.bind(this);
        this.loadGoogleFont = loading.loadGoogleFont.bind(this);
        this.canvasLoadingView = loading.canvasLoadingView.bind(this);
        this.updateAssetLoadingCount = loading.updateAssetLoadingCount.bind(this);

        this.watchedVariables = [];
        this.debugWatchedEntities = [];
        this.debugWatchedEntitiesBackup = [];

        this.loggingDevMode = false;

        this.localdata = localdata;
        // this.eventbus = eventbus;
        this.EventBus = EventBus;

        this.isStopped = false;

        this.camx = 0;
        this.camy = 0;

        this.canvas.style.imageRendering = 'pixelated';
    }

    /**
     * Disables image sharpening on the canvas.
     *
     * @return {void} No return value.
     */
    disableSharpen() {
        this.canvas.style.imageRendering = 'auto';

    }

    /**
     * Prints output to the console based on the specified type.
     *
     * @param {string} output - The message to be printed.
     * @param {string} [type="log"] - The type of message (error, warn, log).
     * @return {void} No return value.
     */
    print(output, type = "log") {
        if (type == "error") {
            console.error(output);
        } else if (type == "warn") {
            console.warn(output);
        } else {
            console.log(output);
        }
    }

    /**
     * Sets the custom preload function.
     *
     * @param {function} preloadFunction - The function to be executed during preload.
     * @return {void} No return value.
     */
    setPreload(preloadFunction) {
        this.customPreload = preloadFunction;
    }

    /**
     * Checks if two arrays are equal by comparing their lengths and elements.
     *
     * @param {array} a - The first array to compare.
     * @param {array} b - The second array to compare.
     * @return {boolean} True if the arrays are equal, false otherwise.
     */
    arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    /**
     * Watches for changes in the specified dependencies and calls the callback function when they change.
     *
     * @param {function} callback - The function to be called when the dependencies change.
     * @param {Array<function>} dependencies - An array of functions that represent the dependencies to watch. Each function should return the value of the dependency.
     * @throws {Error} If the dependencies parameter is not an array of functions.
     */
    watch(callback, dependencies) {
        if (!(Array.isArray(dependencies))) {
            new Error("Dependency Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${dependencies}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
            const error = new Error("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
            error.name = "";
            throw error;
        }
        this.watchedVariables.push({ dependencies, callback, lastValues: dependencies.map(dep => (typeof dep === 'function' ? dep() : dep)) });
    }

    /**
     * Checks and updates the watched variables.
     *
     * Iterates through the watched variables, checks if the dependencies have changed,
     * and calls the callback function if they have. Also updates the last values of
     * the watched variables.
     *
     * @return {void} No return value.
     */
    checkWatchedVariables() {
        for (const watchItem of this.watchedVariables) {
            const { dependencies, callback } = watchItem;
            if (!(Array.isArray(dependencies))) {
                new Error("Dependecy Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${dependencies}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
                const error = new Error("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
                error.name = "";
                throw error;
            }
            const currentValues = dependencies.map(dep => (typeof dep === 'function' ? dep() : dep));
            if (!Array.isArray(dependencies) || dependencies.some(dep => typeof dep !== 'function')) {
                new Error("Dependecy Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${JSON.stringify(dependencies)}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
                const error = new Error("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
                error.name = "";
                throw error;
            }
            // console.log(currentValues, watchItem.lastValues)
            if (!this.arraysEqual(currentValues, watchItem.lastValues)) {
                callback();
                watchItem.lastValues = currentValues;
            }
        }
    }



    /**
     * Enables the development mode for the engine.
     *
     * This function enables the development mode, which may cause certain security features to be disabled and may result in unexpected errors.
     * It also allows for logging of development mode information if the loggingDevMode parameter is set to true.
     *
     * @param {boolean} loggingDevMode - Whether to enable logging of development mode information. Defaults to false.
     * @return {void} No return value.
     */
    enableDevMode(loggingDevMode = false) {
        console.warn("Dev mode is enabled. This may cause certain security features to be disabled, and may result in unexpected errors. In order to properly utilize devMode, make sure you call it at the TOP of your file (or right after you define `rge`).")
        if (loggingDevMode) {
            try {
                this.loggingDevMode = true;
            } catch (error) {
                console.error(error);
            }
        }
        this.textureLoadingTime = 0;
    }

    /**
     * Resizes the canvas element to match the dimensions of its parent element.
     *
     * This function updates the width and height properties of the canvas element
     * to match the clientWidth and clientHeight properties of its parent element.
     *
     * @return {void} This function does not return anything.
     */
    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    /**
     * Returns the width of the canvas element, doubled.
     *
     * @return {number} The doubled width of the canvas element.
     */
    getWidth() {
        return this.canvas.width * 2;
    }

    /**
     * Returns the height of the canvas element, doubled.
     *
     * @return {number} The doubled height of the canvas element.
     */
    getHeight() {
        return this.canvas.height * 2;
    }

    /**
     * Debugs an entity by adding a debug text and center marker to the canvas.
     *
     * @param {Entity} entity - The entity to be debugged.
     * @param {number} [offsetY=10] - The vertical offset of the debug text.
     * @return {void}
     */
    debugEntity(entity, offsetY = 10) {
        const debugText = new Text(entity.x, entity.y, entity.id ? entity.id : "unnamed_entity", 13, "green");
        this.addEntity(debugText);

        entity.isCurrentlyBeingDebugged = true;

        debugText.zIndex = 100;

        const centerMarker = new entities.Ellipse(entity.x, entity.y, 3, "black");
        this.addEntity(centerMarker);

        try {
            entity.debugMode();
        } catch (error) {
            console.warn("Entity does not implement a debug border. If this is a Text entity, Group Entity, or a custom entity, ignore.")
        }


        centerMarker.zIndex = 100;

        this.debugWatchedEntities.push({
            text: debugText,
            entity: entity,
            centerMarker: centerMarker,
            offsetY: offsetY
        })
    }

    /**
     * Disables all entity debugs by clearing the debugWatchedEntities array.
     *
     * @return {void}
     */
    disableAllEntityDebugs() {
        this.debugWatchedEntitiesBackup = this.debugWatchedEntities;
        this.debugWatchedEntities = [];
    }

    /**
     * Re-enables all entity debugs by restoring the debugWatchedEntities array from its backup.
     *
     * @return {void}
     */
    reEnableAllEntityDebugs() {
        this.debugWatchedEntities = this.debugWatchedEntitiesBackup;
    }

    handleResize = () => {
        this.resizeCanvas();
    };

    /**
     * Stops the execution of the function and resets all relevant properties.
     *
     * This function sets the `isStopped` property to `true` to indicate that the execution has stopped.
     * It then clears the `entities`, `keyPressActions`, `pressedKeys`, and `mouseClickHandlers` arrays.
     * Additionally, it resets the `tickFunction` to an empty arrow function and cancels the animation frame request.
     *
     * @return {void}
     */
    stop() {
        this.isStopped = true;

        this.entities = [];
        this.keyPressActions = {};
        this.pressedKeys = {};
        this.mouseClickHandlers = [];
        // console.warn(this.tickFunction)
        this.tickFunction = () => { };
        // console.warn(this.tickFunction)
        // console.warn(this.animationFrameId)
        cancelAnimationFrame(this.animationFrameId);
    }

    /**
     * Adds a new entity to the engine's entities array.
     *
     * @param {Entity} entity - The entity to be added.
     * @throws {Error} If the number of entities exceeds the maximum allowed limit.
     * @return {void}
     */
    addEntity(entity) {
        if (this.entities.length + 1 > this.maxEntities) {
            new Error("Entity Overflow Error", `The current engine is currently holding <br><br> ${this.entities.length} <br><br> entities, which is the set limit. In order to increase the limit, please add <br><br>
            maxEntities: (desiredMax) <br><br> to the constructor of the engine OR, add <br><br>
            (engine).maxEntities = (desiredMax) <br><br> to your code. If you would like to remove this limit, please set maxEntities to Infinity.`, this.canvasId, "addEntity()");
            const error = new Error("Entity Overflow Error: Entities array has reached its limit. Modify the engine maxEntities value.");
            error.name = "";
            throw error;
        }
        this.entities.push(entity);
    }

    /**
     * Sets the tick function for the engine.
     *
     * @param {function} tickFunction - The function to be executed on each tick.
     * @return {void}
     */
    setTickFunction(tickFunction) {
        this.tickFunction = tickFunction;
    }

    /**
     * Executes the custom setup function and marks the setup as executed.
     *
     * @param {function} setupFunc - The custom setup function to be executed.
     * @return {void} No return value.
     */
    setupFunction(setupFunc) {
        this.customSetup = setupFunc;
    }

    /**
     * The main game loop function, responsible for updating and rendering the game state.
     *
     * @param {number} timestamp - The current timestamp, used for calculating the delta time.
     * @return {void} No return value.
     */
    gameLoop(timestamp) {
        if (this.isStopped) {
            this.clearCanvas();
            return;
        } else {
            if (this.preloadExecuted && this.setupExecuted) {
                if (!this.lastTimestamp) {
                    this.lastTimestamp = timestamp;
                }

                // Embedded Engine Logic
                if (this.isEmbedded) {
                    const entityData = JSON.stringify(this.entities);
                    this.canvas.setAttribute('data-entities', entityData);
                }

                const deltaTime = timestamp - this.lastTimestamp;
                this.lastTimestamp = timestamp;

                this.deltaAccumulator += deltaTime;
                if (this.isStopped) {
                    return
                }
                while (this.deltaAccumulator >= this.targetFrameTime) {
                    this.tickFunction();
                    // console.log("i ran tick func.")
                    // console.log(this.tickFunction)
                    this.clearCanvas();
                    this.renderEntities();
                    this.checkWatchedVariables()
                    for (const i in this.debugWatchedEntities) {
                        let currIndex = this.debugWatchedEntities[i];
                        if (currIndex.isDestroyed == true) {
                            // console.log('ya')
                            this.debugWatchedEntities.pop(i)
                            break;
                        }
                        try {
                            currIndex.text.update(currIndex.entity.x - currIndex.text.getWidth(this.context) / 2, currIndex.entity.y - currIndex.offsetY, (currIndex.entity.id ? currIndex.entity.id : "unnamed_entity") + ` x: ${Math.round(currIndex.entity.x)}, y: ${Math.round(currIndex.entity.y)}; ${currIndex.entity instanceof Group ? `children: ${currIndex.entity.entities.length}` : ""}`, 13, "monospace");
                            currIndex.centerMarker.update(currIndex.entity.x, currIndex.entity.y);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    this.deltaAccumulator -= this.targetFrameTime;
                }

                this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
            }
        }

    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Removes the specified entity from the list of entities and calls its destroy method.
     *
     * @param {Entity} entity - The entity to be destroyed.
     * @return {void}
     */
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

    /**
     * Sets the background of the canvas based on the provided options.
     *
     * @param {Object} options - An object containing background options.
     * @param {string} options.color - The background color.
     * @param {string} options.image - The background image URL.
     * @param {string} options.repeat - The background repeat style.
     * @return {void}
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
}
