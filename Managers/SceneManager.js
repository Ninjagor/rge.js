import { Scene } from "./Scene.js";

export class SceneManager {
    constructor() {
        this.scenes = {

        };
        this.currentScene = null;
        this.currentEngine = null;
    }

    addScene(sceneName, scene, configuration) {
        if (!(scene instanceof Scene)) {
            throw new Error("Add scene expects type Scene");
        }
        if (this.scenes[sceneName]) {
            throw new Error("Scene with that name already exists");
        }
        this.scenes[sceneName] = [scene, configuration];
        this.scenes[sceneName][0].configure(this.scenes[sceneName][1]);

        this.currentEngine = this.scenes[sceneName][0].engine;
    }

    setScene(sceneName) {
        if (!(this.scenes[sceneName])) {
            throw new Error("Scene with that name does not exist");
        }
        this.currentScene = this.scenes[sceneName];
        this.currentEngine = this.currentScene[0].engine;
        this.startScene();
    }

    startScene() {
        if (this.currentScene) {
            this.currentScene[0].configure(this.currentScene[1]);
            this.currentScene[0].start();
        }
    }
}