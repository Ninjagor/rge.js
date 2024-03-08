export async function start() {
    this.isStopped = false;
    this.canvasLoadingView()
    if (!this.preloadExecuted) {
        await this.preload();
    }
    if (!this.setupExecuted) {
        this.setup();
    }

    this.updateAssetLoadingCount();
    // for (const i in this.entities) {
    //     if (!this.entities[i].isCurrentlyBeingDebugged) {
    //         this.debugEntity(this.entities[i]);
    //     } else {
    //         console.log("BEING DEBUGGED ALR")
    //         console.log(this.entities[i])
    //     }
    // }
    setTimeout(() => {
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }, (Object.keys(this.preloadedImages).length)*(this.textureLoadingTime/(Object.keys(this.preloadedImages).length)))
}