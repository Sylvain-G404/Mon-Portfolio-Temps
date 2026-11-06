// JavaScript/States/stateManager.js

export class StateManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        
        this.states = {};       // Stocke tous nos écrans (Menu, Jeu, Game Over)
        this.currentState = null; // L'écran actuellement affiché

        this.currentDifficulty = 'Facile'; // Difficulté de base du jeu
    }

    // Enregistre un nouvel écran dans le gestionnaire
    addState(name, stateInstance) {
        this.states[name] = stateInstance;
    }

    // Change d'écran dynamiquement (ex: de 'menu' à 'game')
    changeState(name) {
        if (!this.states[name]) {
            console.error(`L'état "${name}" n'existe pas !`);
            return;
        }

        // Si un écran était déjà actif, on peut lui dire de se couper proprement
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }

        this.currentState = this.states[name];

        // On initialise le nouvel écran
        if (this.currentState && this.currentState.enter) {
            this.currentState.enter();
        }

        console.log(`Bascule vers l'écran : ${name.toUpperCase()}`);
    }

    // Transmet la mise à jour physique à l'écran actuel
    update(deltaTime) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(deltaTime);
        }
    }

    // Transmet l'ordre de dessin à l'écran actuel
    render() {
        // Sécurité : On nettoie TOUJOURS le canvas complet avant de redessiner
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Appel de la méthode d'affichage standardisée du contenu de l'écran
        if (this.currentState && this.currentState.draw) {
            this.currentState.draw(this.ctx, this.canvas);
        }
    }

}
