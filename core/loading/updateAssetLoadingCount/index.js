export function updateAssetLoadingCount() {
    let i = 0;
    const interval = setInterval(() => {
        this.canvasLoadingView()
        this.loadedAssetsCount += 1;

        if (!(i < Object.keys(this.preloadedImages).length)) {
            clearInterval(interval)
        }
        i++
    }, (this.textureLoadingTime/(Object.keys(this.preloadedImages).length)))
}