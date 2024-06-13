import { Error } from "../../Entities/Widgets/index.js";

export class EventBus {
    constructor(rge) {
        this.events = [ ]
        this.callbackRegistry = [ ]
        this.canvasId = rge.canvasId;
    }

    emit(event /* string */) {
        this.events.push(event);
    }

    subscribe(subName, subEvent, callback) {
        if (!subName || !subEvent || !callback) {
            throw new Error("invalid subcription to EventBus");
        }
        try {
            this.callbackRegistry.push({ subName, subEvent, callback });
            console.log(this.callbackRegistry);
        } catch(error) {
            console.error(error);
            throw new Error("invalid subcription to EventBus");
        }
    }

    unsubscribe(subName) {
        const registry = [];
        for (const clb of this.callbackRegistry) {
            if (!(clb.subName == subName)) {
                registry.push(clb)
            }
        }
        this.callbackRegistry = registry;
    }

    process() {
        for (const event of this.events) {
            for (const clb of this.callbackRegistry) {
                if (clb.subEvent == event) {
                    try {
                        clb.callback();
                    } catch(error) {
                        new Error("EventBus Callback Error", `The callback provided for subscribed event "${event}" has failed. <br><br> <br> Instigating Callback: <br><br> ${clb.callback}. <br><br> ${error} <br><br><br> Fix this error or remove the instigating callback to remove this message. <br><br>`, this.canvasId, "subscribe()");
                        const _error = new Error("Error: Callback for event in EventBus failed.");
                        _error.name = "";
                        throw _error;
                    }
                }
            }
        }
        this.events = []
    }
}