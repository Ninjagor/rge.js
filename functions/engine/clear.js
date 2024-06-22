import { RGE } from "../../core/index.js";

export function clear(engine) {
	if (!(engine instanceof RGE)) {
		throw new Error("Invalid engine ref passed to clear")
	}
	for (const e of engine.entities) {
		engine.destroyEntity(e);
	}
}
