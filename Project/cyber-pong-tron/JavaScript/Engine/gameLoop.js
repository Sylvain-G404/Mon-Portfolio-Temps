// JavaScript/Engine/gameLoop.js

export class GameLoop {
    constructor(updateCallback, renderCallback) {
        this.update = updateCallback; // Fonction de mise à jour reçue du gestionnaire
        this.render = renderCallback; // Fonction de dessin reçue du gestionnaire
        
        this.lastTime = 0;            // Stocke le temps de la frame précédente
        this.accumulatedTime = 0;     // Temps accumulé pour stabiliser la boucle si besoin
        this.isLooping = false;       // État de la boucle (marche/arrêt)
    }

    // Démarre la boucle principale
    start() {
        if (this.isLooping) return;
        this.isLooping = true;
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.loop(timestamp));
        console.log("Moteur de jeu (GameLoop) démarré !");
    }

    // Arrête la boucle principale
    stop() {
        this.isLooping = false;
        console.log("Moteur de jeu (GameLoop) arrêté.");
    }

    // Boucle d'animation synchronisée avec l'écran
    loop(timestamp) {
        if (!this.isLooping) return;

        // Calcul du temps écoulé en secondes (ex: 0.016 pour 60 FPS)
        let deltaTime = (timestamp - this.lastTime) / 1000;
        
        // Sécurité anti-gros lag (si l'utilisateur change d'onglet par exemple)
        if (deltaTime > 0.1) deltaTime = 0.1;

        this.lastTime = timestamp;

        // 1. On met à jour la logique du jeu (mouvements, collisions)
        this.update(deltaTime);

        // 2. On dessine le résultat sur le Canvas
        this.render();

        // On demande au navigateur de rappeler cette fonction à la prochaine image
        requestAnimationFrame((timestamp) => this.loop(timestamp));
    }
}
