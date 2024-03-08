export async function loadImage(imageUrl) {
    if (this.preloadExecuted) {
        throw new Error("loadImage can only be used in preload()");
        return;
    }

    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        // Extracting the image name from the URL as a key
        const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        this.preloadedImages[imageName] = image;
        return image;
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
}
