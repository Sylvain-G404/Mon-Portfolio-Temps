// JavaScript/States/gameState.js

import { Board } from '../Entities/board.js';
import { Paddle } from '../Entities/paddle.js';
import { Ball } from '../Entities/ball.js';
import { CountdownView } from '../Entities/countdownView.js';
import { playBeep, playAdvancedBeep, startDangerAlarm, stopDangerAlarm, stopAmbientMusic, stopMenuMusic } from '../Engine/sound.js';

export class GameState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.board = null;
        this.paddleLeftOrTop = null;
        this.paddleRightOrBottom = null;

        // --- MURS DE DANGER TRON UNIVERSELS ---
        this.wallDangerJoueur = false; 
        this.wallDangerIA = false;     

        this.countdownAnimation = null;

        // --- PROPRIÉTÉS DE DIFFICULTÉ IA DYNAMIQUES ---
        this.aiSpeed = 400;
        this.aiReactionTimer = 0;
        this.aiTargetPos = undefined; 
    }

    async enter() {
        console.log("Le match commence !");
        stopMenuMusic();
        const canvas = this.stateManager.canvas;

        this.wallDangerJoueur = false;
        this.wallDangerIA = false;
        this.countdownAnimation = new CountdownView(canvas.width, canvas.height, this.stateManager.currentDifficulty);
        this.aiTargetPos = undefined;

        // 1. Détermination de la clé en minuscules
        const diffKey = (this.stateManager.currentDifficulty || 'Moyen').toLowerCase();

        // 2. Chargement de la configuration de l'IA
        try {
            const response = await fetch('Data/aiConfig.json');
            const config = await response.json();
            const aiSettings = config[diffKey] || config['moyen'];

            this.aiSpeed = aiSettings.speed;
            this.aiReactionInterval = aiSettings.reactionTime; 
            this.aiErrorMargin = aiSettings.errorMargin;       

            console.log(`[IA CONFIG] Mode ${diffKey} appliqué : Vitesse=${this.aiSpeed}, Réaction=${this.aiErrorMargin}px`);
        } catch (error) {
            console.error("Impossible de charger la configuration de l'IA, valeurs de secours appliquées :", error);
            this.aiSpeed = 400;
            this.aiReactionInterval = 0.15;
            this.aiErrorMargin = 40;
        }

        // 3. Initialisation des entités (Arène paysage)
        this.board = new Board(canvas);
        this.ball = new Ball(canvas.width, canvas.height);

        const pWidth = 15;
        const pHeight = canvas.height * 0.2; 
        
        this.paddleLeftOrTop = new Paddle(
            'left', 
            20, 
            canvas.height / 2 - pHeight / 2,
            pWidth, pHeight, "#00ff66",
            canvas.width, canvas.height
        );
        this.paddleRightOrBottom = new Paddle(
            'right', 
            canvas.width - 20 - pWidth, 
            canvas.height / 2 - pHeight / 2,
            pWidth, pHeight, "#ff0077",
            canvas.width, canvas.height
        );
    }

    update(deltaTime) {
        const canvas = this.stateManager.canvas;

        // 1. Mise à jour de la raquette Joueur (Gauche)
        if (this.paddleLeftOrTop) {
            this.paddleLeftOrTop.update(deltaTime, this.input, canvas.width, canvas.height);
        }

        // 2. LE PILOTAGE AUTOMATIQUE DE L'IA ADAPTATIF UNIVERSEL (PC/PAYSAGE)
        if (this.paddleRightOrBottom && this.ball) {
            if (!this.aiReactionTimer) this.aiReactionTimer = 0;
            this.aiReactionTimer += deltaTime;

            // Si le temps de réaction est écoulé, l'IA recalcule sa cible sur l'axe Y
            if (this.aiReactionTimer >= this.aiReactionInterval) {
                this.aiReactionTimer = 0; 
                const error = (Math.random() - 0.5) * 2 * this.aiErrorMargin;
                this.aiTargetPos = this.ball.y + error; 
            }

            if (this.aiTargetPos === undefined) {
                this.aiTargetPos = this.ball.y;
            }

            // Déplacement fluide de la raquette IA vers l'objectif Y
            let paddleCenter = this.paddleRightOrBottom.y + this.paddleRightOrBottom.height / 2;

            if (this.aiTargetPos < paddleCenter - 5) {
                this.paddleRightOrBottom.y -= this.aiSpeed * deltaTime;
            } else if (this.aiTargetPos > paddleCenter + 5) {
                this.paddleRightOrBottom.y += this.aiSpeed * deltaTime;
            }

            // Sécurité des bords d'arène pour l'IA
            if (this.paddleRightOrBottom.y < 0) this.paddleRightOrBottom.y = 0;
            if (this.paddleRightOrBottom.y + this.paddleRightOrBottom.height > canvas.height) {
                this.paddleRightOrBottom.y = canvas.height - this.paddleRightOrBottom.height;
            }
        }

        // --- GESTION DU DÉCOMPTE V2 (ANIMATION ISOLÉE) ---
        if (this.countdownAnimation && !this.countdownAnimation.isFinished) {

            // On sauvegarde le temps avant et après l'update pour détecter les bips à la seconde exacte
            const prevTimer = this.countdownAnimation.timer;
            this.countdownAnimation.update(deltaTime);
            const currentTimer = this.countdownAnimation.timer;

            // Détection du passage des secondes pour les effets sonores d'arcade
            const prevFloor = Math.ceil(prevTimer);
            const currentFloor = Math.ceil(currentTimer);

            if (prevFloor !== currentFloor && currentFloor >= 0) {
                if (currentFloor === 0) {
                    playAdvancedBeep(880, 0.3, 'sawtooth'); // Le bip strident du FIGHT !
                } else if (currentFloor <= 3) {
                    playBeep(300, 0.08); // Les bips des chiffres 3, 2, 1
                } else {
                    playBeep(200, 0.05); // Petit clic mécanique pour l'annonce MODE / HARDCORE
                }
            }
        } else if (this.ball && this.board) {
            // Mise à jour de la balle (On passe 'false' car ce n'est plus un terrain vertical)
            this.ball.update(deltaTime, false);

            // --- PHYSIQUE UNIVERSELLE ISSUE DU CROQUIS : RAQUETTE JOUEUR GAUCHE ---
            if (this.checkCollision(this.ball, this.paddleLeftOrTop)) {
                playAdvancedBeep(650, 0.06, 'sine'); 

                let relativeIntersectY = this.ball.y - (this.paddleLeftOrTop.y + this.paddleLeftOrTop.height / 2);
                let normalizedIntersectY = relativeIntersectY / (this.paddleLeftOrTop.height / 2);
                let absIntersect = Math.abs(normalizedIntersectY);

                let speedMultiplier = 1.05; 
                if (absIntersect > 0.75) {
                    speedMultiplier = 1.08; 
                } else if (absIntersect > 0.3) {
                    speedMultiplier = 1.06 + (absIntersect - 0.3) * 0.022; 
                }

                this.ball.currentSpeed *= speedMultiplier;

                if (absIntersect <= 0.3) {
                    this.ball.vy = 0; 
                } else {
                    this.ball.vy = normalizedIntersectY * (this.ball.currentSpeed * 0.75); 
                }

                this.ball.vx = Math.sqrt(Math.pow(this.ball.currentSpeed, 2) - Math.pow(this.ball.vy, 2));
                this.ball.x = this.paddleLeftOrTop.x + this.paddleLeftOrTop.width + this.ball.radius;
            }

            // --- PHYSIQUE UNIVERSELLE ISSUE DU CROQUIS : RAQUETTE IA DROITE ---
            if (this.checkCollision(this.ball, this.paddleRightOrBottom)) {
                playAdvancedBeep(520, 0.08, 'triangle'); 

                let relativeIntersectY = this.ball.y - (this.paddleRightOrBottom.y + this.paddleRightOrBottom.height / 2);
                let normalizedIntersectY = relativeIntersectY / (this.paddleRightOrBottom.height / 2);
                let absIntersect = Math.abs(normalizedIntersectY);

                let speedMultiplier = 1.05;
                if (absIntersect > 0.75) {
                    speedMultiplier = 1.08;
                } else if (absIntersect > 0.3) {
                    speedMultiplier = 1.06 + (absIntersect - 0.3) * 0.022;
                }

                this.ball.currentSpeed *= speedMultiplier;

                if (absIntersect <= 0.3) {
                    this.ball.vy = 0; 
                } else {
                    this.ball.vy = normalizedIntersectY * (this.ball.currentSpeed * 0.75);
                }

                this.ball.vx = -Math.sqrt(Math.pow(this.ball.currentSpeed, 2) - Math.pow(this.ball.vy, 2));
                this.ball.x = this.paddleRightOrBottom.x - this.ball.radius;
            }

            // --- CONDITIONS DE COMPTAGE DU SCORE (BUTS ENCAISSÉS) ---
            // Si la balle dépasse la GAUCHE (Le joueur encaisse)
            if (this.ball.x - this.ball.radius <= 0 && this.ball.vx < 0) {
                this.ball.x = this.ball.radius + 15;
                this.ball.vx = Math.abs(this.ball.vx);
                this.ball.penalize();
                playBeep(180, 0.2); 
                stopDangerAlarm(); 

                if (this.wallDangerIA) {
                    this.wallDangerIA = false;
                } else if (this.wallDangerJoueur) {
                    console.log("%c💀 GAME OVER !", "color: #ff0000; font-weight: bold;");
                    this.stateManager.states['end'].setResult('gameover');
                    this.stateManager.changeState('end');
                } else {
                    this.wallDangerJoueur = true;
                }
            }
            // Si la balle dépasse la DROITE (l'IA encaisse)
            if (this.ball.x + this.ball.radius >= canvas.width && this.ball.vx > 0) {
                this.ball.x = canvas.width - this.ball.radius - 15;
                this.ball.vx = -Math.abs(this.ball.vx);
                this.ball.penalize();
                playBeep(180, 0.2); 
                stopDangerAlarm(); 

                if (this.wallDangerJoueur) {
                    this.wallDangerJoueur = false;
                } else if (this.wallDangerIA) {
                    console.log("%c🏆 VICTOIRE DU JOUEUR !", "color: #00ff00; font-weight: bold;");
                    this.stateManager.states['end'].setResult('victory');
                    this.stateManager.changeState('end');
                } else {
                    this.wallDangerIA = true;
                }
            }
        }

        // --- GESTION AUDIO DE L'ALARME DE DANGER DYNAMIQUE ---
        if (this.wallDangerJoueur) {
            startDangerAlarm('joueur');
        } else if (this.wallDangerIA) {
            startDangerAlarm('ia');
        } else {
            stopDangerAlarm();
        }
    }

    draw(ctx, canvas) {
        // 1. Dessin de l'arrière-plan du terrain
        if (this.board) this.board.render(ctx);

        // 2. Affichage néon rouge des murs de danger (Géré à 100% sur les côtés gauche/droite)
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0000";

        if (this.wallDangerJoueur) ctx.fillRect(0, 0, 15, canvas.height); // Gauche rouge
        if (this.wallDangerIA) ctx.fillRect(canvas.width - 15, 0, 15, canvas.height); // Droite rouge

        ctx.shadowBlur = 0; 

        // 3. Dessin des entités (Raquettes et balle)
        if (this.paddleLeftOrTop) this.paddleLeftOrTop.render(ctx);
        if (this.paddleRightOrBottom) this.paddleRightOrBottom.render(ctx);
        if (this.ball) this.ball.render(ctx);

        // 4. Dessin de l'animation de démarrage cyberpunk
        if (this.countdownAnimation && !this.countdownAnimation.isFinished) {
            this.countdownAnimation.draw(ctx);
        }
    }

    checkCollision(ball, paddle) {
        return ball.x + ball.radius > paddle.x &&
               ball.x - ball.radius < paddle.x + paddle.width &&
               ball.y + ball.radius > paddle.y &&
               ball.y - ball.radius < paddle.y + paddle.height;
    }

    exit() {
        console.log("Fin du match : destruction des alarmes");
        this.wallDangerJoueur = false;
        this.wallDangerIA = false;
        stopDangerAlarm();
        stopAmbientMusic();
    }
}
