export class Sound {
    constructor(path, loop = false) {
        this.audio = new Audio(path);
        this.loop = loop;
        this.volume = 1; // Default volume is set to 100%

        this.audio.volume = this.volume;

        if (loop) {
            this.audio.loop = true;
            this.audio.play();
        } else {
            this.audio.addEventListener('ended', () => {
                this.stopSound();
            });
        }
    }

    playSound() {
        if (!this.loop) {
            this.stopSound();
            this.audio.play();
        }
    }

    stopSound() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    pauseSound() {
        this.audio.pause();
    }

    beginLoop() {
        try {
            const enableLoop = true;
            if (enableLoop) {
                this.audio.loop = true;
                this.audio.play();
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    setVolume(volume) {
        // Ensure volume is between 0 and 1
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
    }
}
