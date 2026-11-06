export class CountdownView {
    constructor(canvasWidth, canvasHeight, difficulty) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.difficulty = difficulty || 'Moyen';
        
        // Notre chrono interne de 5 secondes
        this.timer = 5.0;
        this.isFinished = false;
    }

    update(deltaTime) {
        if (this.isFinished) return;

        // Le chrono descend seconde par seconde
        this.timer -= deltaTime;

        // Fin de l'animation après le FIGHT (on laisse 0.5s de rab à la fin)
        if (this.timer <= -0.5) {
            this.isFinished = true;
        }
    }

    draw(ctx) {
        if (this.isFinished) return;

        // Base géométrique centrale du terrain
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        
        // --- LE SECRET DU REHAUSSEMENT PRO ---
        // Le HUD et les textes sont remontés à 30% de la hauteur au lieu de 50% (Plein centre décalé)
        const hudY = this.canvasHeight * 0.3; 

        // Tailles proportionnelles AAA de l'affichage
        const boxWidth = Math.floor(this.canvasWidth * 0.35); 
        const boxHeight = Math.floor(this.canvasHeight * 0.12); 

        // ==========================================
        // PHASE 1 : ANNONCE DU MODE (De 5.0s à 3.0s)
        // ==========================================
        if (this.timer > 3.0) {
            const isHardcore = this.difficulty.toLowerCase() === 'difficile';

            let isFlashOn = true;
            if (isHardcore) {
                isFlashOn = Math.floor(this.timer * 5) % 2 === 0;
            }

            let neonColor = '#00f3ff'; 
            if (isHardcore && isFlashOn) {
                neonColor = '#ff0033'; 
            }

            ctx.save();
            ctx.strokeStyle = neonColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = neonColor;

            // On remplace 'centerY' par notre nouveau 'hudY' surélevé !
            ctx.strokeRect(centerX - boxWidth / 2, hudY - boxHeight / 2, boxWidth, boxHeight);

            const cornerSize = 15;
            ctx.beginPath();
            ctx.moveTo(centerX - boxWidth / 2 - 10, hudY - boxHeight / 2 + cornerSize);
            ctx.lineTo(centerX - boxWidth / 2 - 10, hudY - boxHeight / 2 - 10);
            ctx.lineTo(centerX - boxWidth / 2 + cornerSize, hudY - boxHeight / 2 - 10);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX + boxWidth / 2 + 10, hudY - boxHeight / 2 + cornerSize);
            ctx.lineTo(centerX + boxWidth / 2 + 10, hudY - boxHeight / 2 - 10);
            ctx.lineTo(centerX + boxWidth / 2 - cornerSize, hudY - boxHeight / 2 - 10);
            ctx.stroke();
            ctx.restore(); 

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = '#558899';
            ctx.font = `bold ${Math.floor(this.canvasHeight * 0.022)}px 'Courier New', Courier, monospace`;
            ctx.fillText(">> CHARGEMENT FLUX <<", centerX, hudY - 20); // Utilise hudY

            ctx.fillStyle = isHardcore ? '#ff0033' : '#ffffff';
            ctx.font = `bold italic ${Math.floor(this.canvasHeight * 0.035)}px 'Courier New', Courier, monospace`;
            
            const txtMode = isHardcore ? `MODE: ${this.difficulty.toUpperCase()}` : `MODE: ${this.difficulty}`;
            ctx.fillText(txtMode, centerX, hudY + 20); // Utilise hudY
        }

        // ==========================================
        // PHASE 2 : LE DECOMPTE PULSATION (De 3.0s à 0.0s)
        // ==========================================
        else if (this.timer > 0.0) {
            const currentSecond = Math.ceil(this.timer); 
            const fraction = this.timer - (currentSecond - 1);
            const scaleFactor = 1.0 + (fraction * 1.5); 
            const baseFontSize = Math.floor(this.canvasHeight * 0.08); 
            const dynamicFontSize = Math.floor(baseFontSize * scaleFactor);

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.strokeStyle = `rgba(255, 102, 0, ${fraction * 0.5})`; 
            ctx.lineWidth = 4;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff6600';
            
            const radius = Math.floor(this.canvasHeight * 0.08) * scaleFactor;

            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i;
                // Le cercle de pulsation se fait lui aussi autour de hudY !
                const x = centerX + Math.cos(angle) * radius;
                const y = hudY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.font = `bold ${dynamicFontSize}px 'Courier New', Courier, monospace`;
            ctx.fillText(currentSecond, centerX, hudY); // Affiché sur hudY
            
            ctx.restore();
        }

        // ==========================================
        // PHASE 3 : L'EXPLOSION FINALE (De 0.0s à -0.5s)
        // ==========================================
        else {
            const alpha = 1.0 - (Math.abs(this.timer) / 0.5); 
            
            ctx.save();
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#00ff66'; 
            ctx.font = `bold italic ${Math.floor(this.canvasHeight * 0.1)}px 'Courier New', Courier, monospace`;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00ff66';
            
            // Le FIGHT reste plein centre (centerY) car c'est le signal d'action global !
            ctx.fillText("FIGHT !", centerX, centerY); 
            ctx.restore();
        }
    }
}
