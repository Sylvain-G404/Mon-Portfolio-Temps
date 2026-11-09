import { playBeep, stopAmbientMusic } from '../Engine/sound.js'; // Suppression des anciens imports de bips
import { playEndSound } from '../Engine/sound.js'; // 🔊 Import de la gestion des MP3

export class EndState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.result = 'none'; // Reçoit 'victory' ou 'gameover'

        // Configuration du menu interactif de fin
        this.options = ['Rejouer', 'Retour au Menu'];
        this.selectedIndex = 0; // 0 = Rejouer, 1 = Retour au Menu
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    // On récupère le résultat envoyé par le GameState au moment de basculer
    setResult(resultType) {
        this.result = resultType;
    }

    enter() {
        stopAmbientMusic(); // Sécurité supplémentaire
        this.selectedIndex = 0; // On remet toujours le curseur sur Rejouer par défaut

        // 🟢 AJOUTE CES DEUX LIGNES DE LOG ICI POUR VÉRIFIER :
        console.log("Difficulté actuelle dans le manager :", this.stateManager.currentDifficulty);
        console.log("Résultat du match :", this.result);

        // On écoute les touches de manière événementielle pour le menu
        window.addEventListener('keydown', this.handleKeyDown);

        const soundStatus = this.result === 'victory' ? 'victory' : 'defeat';

        // --- SONS DE FIN DE PARTIE CYBERPUNK (MP3 COHÉRENTS) ---
        // Conversion du nom de la difficulté pour correspondre à tes fichiers (eazy, hard, hardcore)
        let diffName = (this.stateManager.currentDifficulty || 'Facile').toLowerCase();
        if (diffName === 'facile') diffName = 'eazy'; // Correction pour correspondre à "defeat_eazy.mp3"
        if (diffName === 'difficile') diffName = 'hard';

        if (diffName === 'facile' || diffName === 'moyen') {
            diffName = 'eazy'; // On utilise les sons "eazy" pour Facile ET Moyen
        } else if (diffName === 'difficile') {
            diffName = 'hard';
        } else if (diffName === 'hardcore') {
            diffName = 'hardcore';
        }

        playEndSound(soundStatus, diffName);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'z':
            case 'Z':
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    playBeep(400, 0.05); // Petit bip mécanique
                }
                break;

            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.selectedIndex < this.options.length - 1) {
                    this.selectedIndex++;
                    playBeep(400, 0.05);
                }
                break;

            case 'Enter':
            case ' ':
                playBeep(600, 0.08); // Bip de validation
                this.selectOption();
                break;

            case 'Escape':
                playBeep(400, 0.05);
                this.stateManager.changeState('menu'); // Raccourci Échap direct
                break;
        }
    }

    selectOption() {
        if (this.selectedIndex === 0) {
            this.stateManager.changeState('game'); // Relance le match
        } else if (this.selectedIndex === 1) {
            this.stateManager.changeState('menu'); // Retour écran titre
        }
    }

    update(deltaTime) {
        // La gestion des touches se fait maintenant de manière isolée dans handleKeyDown(event)
    }

    draw(ctx, canvas) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.075); 
        const optionSize = Math.floor(canvas.height * 0.04);  
        const spacing = Math.floor(canvas.height * 0.09);     

        // Rendu du Titre avec effet de Halo néon
        if (this.result === 'victory') {
            ctx.fillStyle = "#00ff00"; // Vert néon Victoire
            ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00ff00";
            ctx.fillText("🏆 VICTOIRE TRON 🏆", canvas.width / 2, canvas.height / 2 - (spacing * 1.5));
        } else {
            ctx.fillStyle = "#ff0000"; // Rouge néon Défaite
            ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff0000";
            ctx.fillText("💀 GAME OVER 💀", canvas.width / 2, canvas.height / 2 - (spacing * 1.5));
        }

        ctx.shadowBlur = 0; // On coupe le glow pour que le menu de sélection reste ultra-net

        // Rendu dynamique du sous-menu sélectionnable
        const startY = canvas.height / 2 + (spacing * 0.2);

        this.options.forEach((option, index) => {
            if (index === this.selectedIndex) {
                // Option Sélectionnée (Blanc éclatant avec curseurs)
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`> ${option} <`, canvas.width / 2, startY + (index * spacing));
            } else {
                // Options Inactives (Gris/Cyan discret)
                ctx.fillStyle = '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(option, canvas.width / 2, startY + (index * spacing));
            }
        });
    }

    exit() {
        window.removeEventListener('keydown', this.handleKeyDown);
        console.log("Fermeture de l'écran de fin");
    }
}