// JavaScript/main.js

// Importation de nos modules d'architecture
import { GameLoop } from './Engine/gameLoop.js';
import { Input } from './Engine/input.js';
import { StateManager } from './States/stateManager.js';
import { MenuState } from './States/menuState.js';
import { GameState } from './States/gameState.js';
import { EndState } from './States/endState.js';
import { CreditsState } from './States/creditsState.js';
import { OptionsState } from './States/optionsState.js';

// Récupération du Canvas et de son contexte de dessin
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. Instanciation du Gestionnaire d'États (Le Cerveau)
const stateManager = new StateManager(ctx, canvas);
const input = new Input(); 

// 2. Instanciation de la Boucle de Jeu (Le Cœur)
const gameLoop = new GameLoop(
    (deltaTime) => stateManager.update(deltaTime),
    () => stateManager.render()
);

// Fonction pour adapter le canvas à la taille de la fenêtre
function resizeCanvas() {
    // 1. La RÉSOLUTION LOGIQUE INTERNE (Immuable - Ne change jamais)
    // Vos calculs de vitesse, de position de balle et d'IA se baseront TOUJOURS sur ce rectangle fixe.
    canvas.width = 1600;
    canvas.height = 1000;

    // 2. Le RATIO d'aspect recherché (16:10 ou 16:9 selon tes préférences)
    const TARGET_RATIO = canvas.width / canvas.height;

    // 3. Calcul de la taille d'affichage CSS dynamique
    let viewWidth = window.innerWidth * 0.85;
    let viewHeight = window.innerHeight * 0.85;

    if (viewWidth / viewHeight > TARGET_RATIO) {
        viewWidth = viewHeight * TARGET_RATIO;
    } else {
        viewHeight = viewWidth / TARGET_RATIO;
    }

    // 4. On applique la taille calculée uniquement sur le style d'affichage CSS
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;

    // On force le gestionnaire à rafraîchir l'affichage
    stateManager.render();
}


// Initialisation globale au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
    // Configuration de la taille initiale du Canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3. Enregistrement des différents écrans du jeu (Tous reliés au StateManager et à l'Input)
    stateManager.addState('menu', new MenuState(stateManager, input));
    stateManager.addState('game', new GameState(stateManager, input));
    stateManager.addState('end', new EndState(stateManager, input));
    stateManager.addState('credits', new CreditsState(stateManager, input));
    stateManager.addState('options', new OptionsState(stateManager, input));

    // 4. On définit l'écran de départ sur le MENU principal
    stateManager.changeState('menu');

    // 5. FEU ! On démarre la boucle principale du jeu
    gameLoop.start();
});
