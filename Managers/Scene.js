import { RGE as Engine } from "../core/index.js";

export class Scene {
    constructor(canvasId, fps = 120) {
        this.engine = new Engine(canvasId, fps, {
            __fcm__: true
        });
    }

    configure(configuration = {}) {
        const { preload = () => {}, setup = () => {}, tick = () => {}, centeredOrigin = false, maxEntities = 500, webGLMode = false } = configuration;
        if (webGLMode) {
            this.engine.webGLMode = true;
            this.engine.context = this.engine.canvas.getContext('webgl');
        }
        this.engine.maxEntities = maxEntities;
        this.engine.configure({
            preload: preload,
            setup: setup,
            tick: tick,
            centeredOrigin: centeredOrigin,
        })
    }

    start() {
        this.engine.start();
    }

    stop() {
        console.log(this.engine);
        // this.engine.tickFunction = () => {

        // };
        // console.log(this.engine);
        // this.engine.isStopped = true;
        this.engine.tickFunction = () => {
            console.warn("WSP FAM")
        };
        console.log(this.engine);
    }
}