import { RGE } from "../../core/index.js";
import { Ellipse } from "../../Entities/index.js";

export function ellipse(engine, x, y, r, fc) {
	if (!(engine instanceof RGE)) {
		throw new Error("Invalid engine ref passed to rect constructor")
	}
	const e = new Ellipse(x, y, r, fc);
	engine.addEntity(e);
	return e;
}
