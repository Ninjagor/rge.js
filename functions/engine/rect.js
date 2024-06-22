import { RGE } from "../../core/index.js";
import { Rect } from "../../Entities/index.js";

export function rect(engine, x, y, w, h, fc) {
	if (!(engine instanceof RGE)) {
		throw new Error("Invalid engine ref passed to rect constructor")
	}
	const r = new Rect(x, y, w, h, fc);
	engine.addEntity(r);
	return r;
}
