import { startMenuMusic } from '../Engine/sound.js';
import { playBeep } from '../Engine/sound.js'; // Pour le petit son de navigation

export class MenuState {
    constructor(stateManager) {
        this.stateManager = stateManager;

        // Configuration du menu interactif
        this.options = ['Jouer', 'Options', 'Crédits'];
        this.selectedIndex = 0; // 0 = Jouer, 1 = Options, 2 = Crédits
        
        // Liaison du contexte pour les événements clavier
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() {
        startMenuMusic();
        // On écoute les touches du clavier dès qu'on entre dans le menu
        window.addEventListener('keydown', this.handleKeyDown);
    }

    exit() {
        // TRÈS IMPORTANT : On retire l'écouteur pour éviter les fuites de mémoire et les conflits d'inputs
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'z':
            case 'Z':
                // On monte dans le menu (avec sécurité pour ne pas dépasser le haut)
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    playBeep(400, 0.05); // Petit bip de navigation mécanique
                }
                break;

            case 'ArrowDown':
            case 's':
            case 'S':
                // On descend dans le menu (avec sécurité pour ne pas dépasser le bas)
                if (this.selectedIndex < this.options.length - 1) {
                    this.selectedIndex++;
                    playBeep(400, 0.05);
                }
                break;

            case 'Enter':
            case ' ':
                playBeep(600, 0.08); // Bip de validation plus aigu
                this.selectOption();
                break;
        }
    }

    selectOption() {
        // Redirection AAA basée sur l'index sélectionné
        if (this.selectedIndex === 0) {
            this.stateManager.changeState('game');
        } else if (this.selectedIndex === 1) {
            this.stateManager.changeState('options');
        } else if (this.selectedIndex === 2) {
            this.stateManager.changeState('credits');
        }
    }

    update(deltaTime) {
        // Le menu principal est statique pour le moment (pas d'animations complexes nécessaires ici)
    }

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.075); // 7.5% de la hauteur (Ex: 75px en résolution 1000)
        const optionSize = Math.floor(canvas.height * 0.04); // 4% de la hauteur (Ex: 40px en résolution 1000)
        const spacing = Math.floor(canvas.height * 0.09);    // 9% d'espacement (Ex: 90px)

        // 2. Titre du jeu principal
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CYBER PONG TRON', canvas.width / 2, canvas.height / 2 - (spacing * 1.2));

        // 3. Rendu dynamique des options du menu
        const startY = canvas.height / 2 + (spacing * 0.3);

        this.options.forEach((option, index) => {
            if (index === this.selectedIndex) {
                // Style Option Sélectionnée (Blanc brillant avec curseurs)
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`> ${option} <`, canvas.width / 2, startY + (index * spacing));
            } else {
                // Style Options Inactives (Cyan éteint/grisé)
                ctx.fillStyle = '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(option, canvas.width / 2, startY + (index * spacing));
            }
        });

        // ==========================================
        // HUD DISCRET : GUIDE DES COMMANDES (TUTO) ACCORDE AU DESIGN AAA
        // ==========================================
        ctx.save();

        // Calcul de la taille de police proportionnelle (2.5% de la hauteur)
        const helpSize = Math.floor(ctx.canvas.height * 0.025); 
        ctx.font = helpSize + "px 'Courier New', Courier, monospace";
        ctx.textAlign = "center";

        // Couleur cyan néon avec opacité réduite (0.4) pour rester très discret
        ctx.fillStyle = "rgba(0, 243, 255, 0.4)";

        // Positionnement dynamique centré et calé tout en bas (à 90% de la hauteur)
        const hudX = ctx.canvas.width / 2; 
        const hudY = ctx.canvas.height * 0.90; 

        // Dessin du texte de contrôle
        ctx.fillText(
            "[ Navigation ]  Haut : Z / ⬆  |  Bas : S / ⬇  |  Validation : Entrée / Espace", 
            hudX, 
            hudY
        );

        ctx.restore();

    }
}
