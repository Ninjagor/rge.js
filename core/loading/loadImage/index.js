export function loadImage(imageUrl) {
    if (this.preloadExecuted) {
        throw new Error("loadImage can only be used in preload()");
        return;
    }
    const image = new Image();
    image.src = imageUrl;
    // Extracting the image name from the URL as a key
    const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    this.preloadedImages[imageName] = image;
    return image;
}