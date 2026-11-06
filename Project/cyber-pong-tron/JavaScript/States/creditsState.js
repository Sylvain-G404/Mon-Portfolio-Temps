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

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.055);  // Ajusté pour laisser de la place
        const roleSize = Math.floor(canvas.height * 0.028);   
        const nameSize = Math.floor(canvas.height * 0.038);   
        const helpSize = Math.floor(canvas.height * 0.022);   

        const centerY = canvas.height / 2;

        // 2. Titre Principal Lumineux
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PROGRAMME PRINCIPAL', canvas.width / 2, centerY - (canvas.height * 0.28));

        // 3. Section DÉVELOPPEMENT
        ctx.fillStyle = '#558899';
        ctx.font = `${roleSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('--- LEAD CODE & ART ---', canvas.width / 2, centerY - (canvas.height * 0.15));

        // Dégradé Cyber-Néon personnalisé pour Ki->ir->rA
        let gradKiara = ctx.createLinearGradient(canvas.width / 2 - 120, 0, canvas.width / 2 + 120, 0);
        gradKiara.addColorStop(0, '#ff0055'); // Rose/Rouge néon agressif
        gradKiara.addColorStop(1, '#ff6600'); // Cyan électrique
        ctx.fillStyle = gradKiara;
        ctx.font = `bold ${nameSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('Ki->ir->rA', canvas.width / 2, centerY - (canvas.height * 0.10));

        // 4. Section MUSIQUE
        ctx.fillStyle = '#558899';
        ctx.font = `${roleSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('--- ORIGINAL SOUNDTRACK ---', canvas.width / 2, centerY - (canvas.height * 0.01));

        // Dégradé Synthwave personnalisé pour Chris_art'Tattoo
        let gradChris = ctx.createLinearGradient(canvas.width / 2 - 150, 0, canvas.width / 2 + 150, 0);
        gradChris.addColorStop(0, '#88ff00'); // Violet/Magenta profond
        gradChris.addColorStop(1, '#ffaa00'); // Orange Gold incandescent
        ctx.fillStyle = gradChris;
        ctx.font = `bold ${nameSize}px 'Courier New', Courier, monospace`;
        ctx.fillText("Chris_art'Tattoo", canvas.width / 2, centerY + (canvas.height * 0.04));

        // 5. Section CO-PILOTES IA
        ctx.fillStyle = '#558899';
        ctx.font = `${roleSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('--- SYNTHETIC ASSISTANCE ---', canvas.width / 2, centerY + (canvas.height * 0.13));

        // Dégradé équitable pour les IA
        let gradIA = ctx.createLinearGradient(canvas.width / 2 - 180, 0, canvas.width / 2 + 180, 0);
        gradIA.addColorStop(0, '#10a37f');  // Vert ChatGPT
        gradIA.addColorStop(0.5, '#ffffff'); // Transition blanche
        gradIA.addColorStop(1, '#1a73e8');   // Bleu Gemini
        ctx.fillStyle = gradIA;
        ctx.font = `bold ${nameSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('ChatGPT & Gemini', canvas.width / 2, centerY + (canvas.height * 0.18));

        // 6. Message d'aide de navigation en bas
        ctx.fillStyle = '#336677';
        ctx.font = `${helpSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('Appuyez sur ÉCHAP pour revenir au menu', canvas.width / 2, canvas.height - (canvas.height * 0.05));
    }
}
