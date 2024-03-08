import { RGE } from "../core/index.js"; 
import { Camera } from "./Camera.js";

export class CameraManager {
    constructor(engineRef) {
        if (!(engineRef instanceof RGE)) {
            throw new Error("Expected engineRef to be instanceof Engine.");
        }

        this.engineRef = engineRef;
        this.cameras = {

        };
        this.currentCamera = null;
    }

    addCamera(cameraName, camera) {
        if (!(camera instanceof Camera)) {
            throw new Error("addCamera expects type Camera");
        }
        if (this.cameras[cameraName]) {
            throw new Error("Camera with that name already exists");
        }
        this.cameras[cameraName] = camera;
    }

    setCamera(cameraName) {
        if (!(this.cameras[cameraName])) {
            throw new Error("Camera with that name does not exist");
        }
        this.currentCamera = this.cameras[cameraName];

        this.activateCamera();
    }

    updateCamera(cameraName, x = 0, y = 0) {
        if (!(this.cameras[cameraName])) {
            throw new Error("Camera with that name does not exist");
        }
        this.cameras[cameraName].update(x, y);
        this.currentCamera = this.cameras[cameraName];
        this.activateCamera();
        return this.cameras[cameraName];
    }

    activateCamera() {
        try {
            this.engineRef.camx = this.currentCamera.x;
            this.engineRef.camy = this.currentCamera.y;
        } catch(e) {
            console.error(e);
        }
    }
}