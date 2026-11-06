import { playBeep } from '../Engine/sound.js';

export class CreditsState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    exit() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Backspace') {
            playBeep(400, 0.05);
            this.stateManager.changeState('menu'); // Retour au menu principal
        }
    }

    update(deltaTime) {}

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.06);   // ~60px pour 1000 de haut
        const roleSize = Math.floor(canvas.height * 0.03);   // ~25px
        const nameSize = Math.floor(canvas.height * 0.04);   // ~40px
        const helpSize = Math.floor(canvas.height * 0.022);   // ~22px

        const centerY = canvas.height / 2;

        // 2. Titre Principal Lumineux
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PROGRAMME PRINCIPAL', canvas.width / 2, centerY - (canvas.height * 0.2));

        // 3. Section DÉVELOPPEMENT
        ctx.fillStyle = '#558899';
        ctx.font = `${roleSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('--- LEAD CODE & ART ---', canvas.width / 2, centerY - (canvas.height * 0.06));

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${nameSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('Ki->ir->rA', canvas.width / 2, centerY - (canvas.height * 0.01));

        // 4. Section MUSIQUE
        ctx.fillStyle = '#558899';
        ctx.font = `${roleSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('--- ORIGINAL SOUNDTRACK ---', canvas.width / 2, centerY + (canvas.height * 0.08));

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${nameSize}px 'Courier New', Courier, monospace`;
        ctx.fillText("Chris_art'Tattoo", canvas.width / 2, centerY + (canvas.height * 0.13));

        // 5. Message d'aide de navigation en bas
        ctx.fillStyle = '#336677';
        ctx.font = `${helpSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('Appuyez sur ÉCHAP pour revenir au menu', canvas.width / 2, canvas.height - (canvas.height * 0.06));
    }


}
