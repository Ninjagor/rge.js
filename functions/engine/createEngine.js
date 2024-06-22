import { RGE } from "../../core/index.js";

export function createEngine(canvasId, fps = 60) {
	return new RGE(canvasId, fps);
}
