// JavaScript/Engine/input.js

export class Input {
    constructor() {
        // Un objet "dictionnaire" pour stocker l'état des touches (true = enfoncée, false = relâchée)
        this.keys = {};

        // On écoute quand le joueur appuie sur une touche
        window.addEventListener('keydown', (e) => {
            // Sécurité pour éviter que la barre ESPACE ou les flèches fassent défiler la page web
            if (["Space", "ArrowUp", "ArrowDown", "KeyW", "KeyS"].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        // On écoute quand le joueur relâche la touche
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    // Une fonction bien pratique pour vérifier n'importe où si une touche précise est enfoncée
    // Exemple : input.isPressed('Space') ou input.isPressed('KeyW')
    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}
