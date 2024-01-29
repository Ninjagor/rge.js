export function configure(configuration = {}) {
    const { preload, setup, tick, centeredOrigin } = configuration;
    if (preload) {
        this.setPreload(preload)
    }
    if (setup) {
        this.setupFunction(setup)
    }
    if (tick) {
        this.setTickFunction(tick)
    }
    if (centeredOrigin===true) {
        this.setCenterOrigin()
    }
}