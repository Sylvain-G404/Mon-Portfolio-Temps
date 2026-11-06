export class CountdownView {
    constructor(canvasWidth, canvasHeight, difficulty) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.difficulty = difficulty || 'Facile';

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
            const currentDiffLower = (this.difficulty || '').toLowerCase();
            const isHard = currentDiffLower === 'difficile';
            const isHardcore = currentDiffLower === 'hardcore';

            // Clignotement de la boîte : identique pour le difficile et le hardcore
            let isFlashOn = true;
            if (isHard || isHardcore) {
                isFlashOn = Math.floor(this.timer * 5) % 2 === 0;
            }

            let neonColor = '#00f3ff'; 
            if ((isHard || isHardcore) && isFlashOn) {
                neonColor = '#ff0033'; 
            }

            ctx.save();
            ctx.strokeStyle = neonColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = neonColor;

            // Dessin de l'encadré principal (Inchangé)
            ctx.strokeRect(centerX - boxWidth / 2, hudY - boxHeight / 2, boxWidth, boxHeight);
            ctx.restore();

            // --- RE-DESSIN ET DOUBLAGE DES CORNERS D'ANGLE ---
            ctx.save();
            ctx.strokeStyle = '#ff0033'; // Toujours clignotant en rouge pur
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0033';

            const cornerSize = 15;

            // Fonction locale pour tracer les crochets selon un décalage (offset)
            const drawCorners = (offset) => {
                // Haut-Gauche
                ctx.beginPath();
                ctx.moveTo(centerX - boxWidth / 2 - offset, hudY - boxHeight / 2 - offset + cornerSize);
                ctx.lineTo(centerX - boxWidth / 2 - offset, hudY - boxHeight / 2 - offset);
                ctx.lineTo(centerX - boxWidth / 2 - offset + cornerSize, hudY - boxHeight / 2 - offset);
                ctx.stroke();

                // Haut-Droite
                ctx.beginPath();
                ctx.moveTo(centerX + boxWidth / 2 + offset, hudY - boxHeight / 2 - offset + cornerSize);
                ctx.lineTo(centerX + boxWidth / 2 + offset, hudY - boxHeight / 2 - offset);
                ctx.lineTo(centerX + boxWidth / 2 + offset - cornerSize, hudY - boxHeight / 2 - offset);
                ctx.stroke();
            };

            // 1. Première couche de crochets du haut (Présente en Difficile ET Hardcore, décalée de 10px)
            if (isHard || isHardcore) {
                drawCorners(10);
            }

            // 2. EFFET EXCLUSIF AU MODE HARDCORE
            if (isHardcore) {
                // Effet de battement fluide (Pulsation de taille de 18px à 26px qui tourne en boucle)
                const pulseOffset = 22 + Math.sin(Date.now() * 0.008) * 4;

                // On trace la deuxième couche de crochets (Double crochet) avec l'effet de battement
                drawCorners(pulseOffset);

                // On rajoute également les petits crochets en BAS pour le style Hardcore complet !
                ctx.beginPath();
                ctx.moveTo(centerX - boxWidth / 2 - 10, hudY + boxHeight / 2 + 10 - cornerSize);
                ctx.lineTo(centerX - boxWidth / 2 - 10, hudY + boxHeight / 2 + 10);
                ctx.lineTo(centerX - boxWidth / 2 - 10 + cornerSize, hudY + boxHeight / 2 + 10);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(centerX + boxWidth / 2 + 10, hudY + boxHeight / 2 + 10 - cornerSize);
                ctx.lineTo(centerX + boxWidth / 2 + 10, hudY + boxHeight / 2 + 10);
                ctx.lineTo(centerX + boxWidth / 2 + 10 - cornerSize, hudY + boxHeight / 2 + 10);
                ctx.stroke();

                // Double crochet du bas qui bat lui aussi la mesure !
                ctx.beginPath();
                ctx.moveTo(centerX - boxWidth / 2 - pulseOffset, hudY + boxHeight / 2 + pulseOffset - cornerSize);
                ctx.lineTo(centerX - boxWidth / 2 - pulseOffset, hudY + boxHeight / 2 + pulseOffset);
                ctx.lineTo(centerX - boxWidth / 2 - pulseOffset + cornerSize, hudY + boxHeight / 2 + pulseOffset);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(centerX + boxWidth / 2 + pulseOffset, hudY + boxHeight / 2 + pulseOffset - cornerSize);
                ctx.lineTo(centerX + boxWidth / 2 + pulseOffset, hudY + boxHeight / 2 + pulseOffset);
                ctx.lineTo(centerX + boxWidth / 2 + pulseOffset - cornerSize, hudY + boxHeight / 2 + pulseOffset);
                ctx.stroke();
            }

            ctx.restore(); 

            // --- RENDU DES TEXTES ET TITRES ---
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = '#558899';
            ctx.font = `bold ${Math.floor(this.canvasHeight * 0.022)}px 'Courier New', Courier, monospace`;
            ctx.fillText(">> CHARGEMENT FLUX <<", centerX, hudY - 20);

            const isWarningText = isHard || isHardcore;
            ctx.fillStyle = isWarningText ? '#ff0033' : '#ffffff';
            ctx.font = `bold italic ${Math.floor(this.canvasHeight * 0.035)}px 'Courier New', Courier, monospace`;

            const txtMode = isWarningText ? `MODE: ${this.difficulty.toUpperCase()}` : `MODE: ${this.difficulty}`;
            ctx.fillText(txtMode, centerX, hudY + 20);
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
