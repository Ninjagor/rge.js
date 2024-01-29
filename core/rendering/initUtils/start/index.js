export function start() {
    if (!this.preloadExecuted) {
        this.preload();
    }
    if (!this.setupExecuted) {
        this.setup();
    }
    // this.canvasLoadingView()
    this.canvasLoadingView()
    this.updateAssetLoadingCount();
    setTimeout(() => {
       // console.log("Began gameloop")
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }, (Object.keys(this.preloadedImages).length)*(this.textureLoadingTime/(Object.keys(this.preloadedImages).length)))
}