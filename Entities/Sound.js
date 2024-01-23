export class Sound {
    constructor(path, loop = false) {
        this.audio = new Audio(path);
        this.loop = loop;

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
}
