import { RGE } from "../core/index.js";

export class StateManager {
    constructor() {
        this.states = {

        };
    }

    addState(key, value) {
        this.states[key] = value;
    }

    getState(key) {
        if (this.states[key]) {
            return this.states[key];
        }
        return null;
    }

    removeState(key) {
        this.states[key] = null;
    }

    watchState(key, engineRef, callback) {
        if (!(engineRef instanceof RGE)) {
            throw new Error("Expected engineRef to be instance of Engine.");
        }
        engineRef.watch(callback, [() => this.states[key]])
    }
}