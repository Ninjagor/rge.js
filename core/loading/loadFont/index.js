export async function loadFont(fontUrl, fontName) {
    if (this.preloadExecuted) {
        throw new Error("loadFont can only be used in preload()");
        return;
    }

    try {
        const response = await fetch(fontUrl);
        console.log(response)
        const fontBlob = await response.blob();
        console.log(fontBlob)
        const fontFace = new FontFace(fontName, fontBlob);

        await fontFace.load();
        document.fonts.add(fontFace);

        this.preloadedFonts[fontName] = fontFace;
        return fontFace;
    } catch (error) {
        console.error('Error loading font:', error);
        return null;
    }
}

export async function loadGoogleFont(fontUrl, fontName) {
    if (this.preloadExecuted) {
        throw new Error("loadFont can only be used in preload()");
        return;
    }

    try {
        const response = await fetch(fontUrl);
        const cssText = await response.text();

        const fontUrlMatch = cssText.match(/url\(([^)]+)\)/);
        if (!fontUrlMatch || fontUrlMatch.length < 2) {
            throw new Error("Font URL not found in CSS");
        }
        const actualFontUrl = fontUrlMatch[1].replace(/['"]/g, '');

        const fontFace = new FontFace(fontName, `url(${actualFontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        this.preloadedFonts[fontName] = fontFace;

        return fontFace;
    } catch (error) {
        console.error('Error loading font:', error);
        return null;
    }
}
