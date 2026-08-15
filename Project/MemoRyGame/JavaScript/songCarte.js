const Sound = {
    flip: new Audio("Sounds/flipcard.mp3"),
    enabled: false,
    lastPlay: 0,

    init() {
        this.flip.volume = 0.5;
    },


    playFlip() {
        if (!Sound.enabled) return;

        const now = Date.now();
        if (now - Sound.lastPlay < 150) return;

        Sound.flip.pause();
        Sound.flip.currentTime = 0;
        Sound.flip.play();

        Sound.lastPlay = now;
    }
};