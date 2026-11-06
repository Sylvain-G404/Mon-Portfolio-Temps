import { playBeep } from '../Engine/sound.js';

export class OptionsState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;

        // Configuration des choix de difficulté
        this.difficulties = ['Facile', 'Moyen', 'Difficile', 'Hardcore'];
        this.selectedIndex = 1; // Positionné sur 'Moyen' par défaut

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() { window.addEventListener('keydown', this.handleKeyDown); }
    exit() { window.removeEventListener('keydown', this.handleKeyDown); }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'z':
            case 'Z':
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    playBeep(400, 0.05); // Bip de navigation
                }
                break;

            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.selectedIndex < this.difficulties.length - 1) {
                    this.selectedIndex++;
                    playBeep(400, 0.05); // Bip de navigation
                }
                break;

            case 'Enter':
            case ' ':
                playBeep(600, 0.08); // Bip aigu de validation
                
                // On enregistre textuellement la difficulté dans notre manager global ('Facile', 'Moyen' ou 'Difficile')
                this.stateManager.currentDifficulty = this.difficulties[this.selectedIndex];

                this.stateManager.changeState('menu'); // Retour auto au menu
                break;

            case 'Escape':
                playBeep(400, 0.05);
                this.stateManager.changeState('menu'); // Retour sans valider
                break;
        }
    }

    update(deltaTime) {}

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.075); // ~75px pour 1000 de haut
        const optionSize = Math.floor(canvas.height * 0.04);  // ~40px
        const helpSize = Math.floor(canvas.height * 0.022);   // ~22px
        const spacing = Math.floor(canvas.height * 0.09);     // ~90px

        // 2. Titre de l'écran
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DIFFICULTÉ IA', canvas.width / 2, canvas.height / 2 - (spacing * 1.2));

        // 3. Rendu dynamique des niveaux de difficulté
        const startY = canvas.height / 2 + (spacing * 0.3);

        this.difficulties.forEach((diff, index) => {
            if (index === this.selectedIndex) {
                // Style Difficultée sélectionnée (Blanc brillant avec indicateur)
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`> ${diff} <`, canvas.width / 2, startY + (index * spacing));
            } else {
                // Style Difficultées inactives (Cyan éteint)
                ctx.fillStyle = '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(diff, canvas.width / 2, startY + (index * spacing));
            }
        });

        // 4. Petit message d'aide en bas
        ctx.fillStyle = '#336677';
        ctx.font = `${helpSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('ENTRÉE pour valider - ÉCHAP pour quitter', canvas.width / 2, canvas.height - (canvas.height * 0.06));
    }
}
