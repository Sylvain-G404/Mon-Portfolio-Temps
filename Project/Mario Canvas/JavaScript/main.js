const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const positionSolY = 520; // Ajusté à 520 pour s'aligner sur la hauteur fixe de 576px

function redimensionnerCanvas() {
    canvas.width = 1024;
    canvas.height = 576;
}
redimensionnerCanvas();

const configNiveau = monde.niveaux[monde.niveauActuel];

player.x = 100;
player.y = positionSolY; 
player.vitesse = 5;

// Variables pour l'état de fin de jeu et les boutons
let demoTerminee = false;
const boutonsFin = {
    recommencer: { x: 362, y: 320, l: 300, h: 50 },
    portfolio: { x: 362, y: 390, l: 300, h: 50 }
};

// Fonction pour réinitialiser la démo
function reinitialiserDemo() {
    player.score = 0;
    player.x = 100;
    player.y = positionSolY;
    player.velocityY = 0;
    player.auSol = true;
    configNiveau.pieces.forEach(p => p.ramassée = false);
    demoTerminee = false;
    update();
}

// Écouteur de clic pour les boutons de fin
canvas.addEventListener('click', (e) => {
    if (!demoTerminee) return;

    // Calcul des coordonnées du clic relatives au canvas fixe
    const rect = canvas.getBoundingClientRect();
    const clicX = e.clientX - rect.left;
    const clicY = e.clientY - rect.top;

    // Clic sur Recommencer
    if (clicX >= boutonsFin.recommencer.x && clicX <= boutonsFin.recommencer.x + boutonsFin.recommencer.l &&
        clicY >= boutonsFin.recommencer.y && clicY <= boutonsFin.recommencer.y + boutonsFin.recommencer.h) {
        reinitialiserDemo();
    }

    // Clic sur Retour Portfolio
    if (clicX >= boutonsFin.portfolio.x && clicX <= boutonsFin.portfolio.x + boutonsFin.portfolio.l &&
        clicY >= boutonsFin.portfolio.y && clicY <= boutonsFin.portfolio.y + boutonsFin.portfolio.h) {
        window.location.href = "https://sylvain-g404.github.io/Mon-Portfolio-Temps/";
    }
});

function update() {
    // Si le score atteint 10, on bascule en mode fin de démo
    if (player.score >= 10 && !demoTerminee) {
        demoTerminee = true;
    }

    if (demoTerminee) {
        dessinerEcranFin();
        return; // Coupe la boucle d'animation normale du jeu
    }

    let enMarche = false;

    // 1. GESTION DE L'ACCROUPISSEMENT
    if (touches.bas && player.auSol) {
        player.accroupi = true;
        player.size = player.tailleInitiale * 0.6; 
        player.vitesse = 2; 
    } else {
        player.accroupi = false;
        player.size = player.tailleInitiale; 
        player.vitesse = 5; 
    }

    // 2. DÉPLACEMENTS HORIZONTAUX
    if (touches.gauche) {
        player.x -= player.vitesse;
        player.direction = -1;
        enMarche = true;
    }
    if (touches.droite) {
        player.x += player.vitesse;
        player.direction = 1;
        enMarche = true;
    }

    // 3. INITIALISATION DU SAUT (AVEC VERROU ANTI-CONTINU)
    if (touches.haut) {
        if (player.auSol && !player.accroupi && player.sautBoutonRelâché) {
            player.velocityY = player.forceSaut;
            player.auSol = false;
            player.sautBoutonRelâché = false;
        }
    } else {
        player.sautBoutonRelâché = true;
    }

    // 4. PHYSIQUE VERTICALE
    player.velocityY += player.gravite;
    player.y += player.velocityY;

    // 5. COLLISIONS ROBUSTES
    let toucheUnePlateforme = false;
    const largeurIirra = 15;
    const hauteurIirra = player.size; 

    configNiveau.plateformes.forEach(plat => {
        const pLeft = player.x - largeurIirra;
        const pRight = player.x + largeurIirra;
        const pTop = player.y - hauteurIirra;
        const pBottom = player.y;

        const bLeft = plat.x;
        const bRight = plat.x + plat.l;
        const bTop = plat.y;
        const bBottom = plat.y + plat.h;

        if (pRight > bLeft && pLeft < bRight && pBottom > bTop && pTop < bBottom) {
            const overlapX1 = pRight - bLeft;  
            const overlapX2 = bRight - pLeft;  
            const overlapY1 = pBottom - bTop;  
            const overlapY2 = bBottom - pTop;  

            const minOverlapX = Math.min(overlapX1, overlapX2);
            const minOverlapY = Math.min(overlapY1, overlapY2);

            if (minOverlapX < minOverlapY) {
                if (overlapX1 < overlapX2) {
                    player.x -= overlapX1; 
                } else {
                    player.x += overlapX2; 
                }
            } else {
                if (overlapY1 < overlapY2) {
                    player.y -= overlapY1; 
                    player.velocityY = 0;
                    player.auSol = true;
                    toucheUnePlateforme = true;
                } else {
                    player.y += overlapY2; 
                    if (player.velocityY < 0) {
                        player.velocityY = 0; 
                    }
                }
            }
        }
    });

    if (!toucheUnePlateforme && player.y >= positionSolY) {
        player.y = positionSolY;
        player.velocityY = 0;
        player.auSol = true;
    }

    // 6. RAMASSAGE DES PIÈCES
    configNiveau.pieces.forEach(piece => {
        if (!piece.ramassée) {
            const centreIirraY = player.y - (player.size / 2);
            const dx = player.x - piece.x;
            const dy = centreIirraY - piece.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < piece.rayon + 25) {
                piece.ramassée = true;
                player.score += 1;
            }
        }
    });

    // 7. ÉTATS D'ANIMATION
    if (!player.auSol) {
        player.etat = 'idle'; 
    } else if (enMarche) {
        player.etat = 'walk';
        player.animationTimer += 1;
    } else {
        player.etat = 'idle';
        player.animationTimer = 0;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > configNiveau.largeurTotale) player.x = configNiveau.largeurTotale;

    // 8. SUIVI CAMÉRA
    camera.x = player.x - canvas.width / 2;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > configNiveau.largeurTotale - canvas.width) {
        camera.x = configNiveau.largeurTotale - canvas.width;
    }

    dessinerMap(ctx, canvas, monde);
    dessinerStickman(ctx, player, enMarche);

    requestAnimationFrame(update);
}

// Fonction de rendu graphique pour l'écran de félicitations
function dessinerEcranFin() {
    // Filtre de fond semi-transparent sombre
    ctx.fillStyle = "rgba(15, 15, 26, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titre principal
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🎉 CONGRATULATIONS ! 🎉", canvas.width / 2, 180);

    // Sous-titre
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("Démo pratique terminée avec succès (10/10 pièces).", canvas.width / 2, 240);

    // Dessin du bouton : RECOMMENCER
    ctx.fillStyle = "#5c8a35";
    ctx.fillRect(boutonsFin.recommencer.x, boutonsFin.recommencer.y, boutonsFin.recommencer.l, boutonsFin.recommencer.h);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(boutonsFin.recommencer.x, boutonsFin.recommencer.y, boutonsFin.recommencer.l, boutonsFin.recommencer.h);
    
    // Dessin du bouton : RETOUR PORTFOLIO
    ctx.fillStyle = "#4A4A4A";
    ctx.fillRect(boutonsFin.portfolio.x, boutonsFin.portfolio.y, boutonsFin.portfolio.l, boutonsFin.portfolio.h);
    ctx.strokeRect(boutonsFin.portfolio.x, boutonsFin.portfolio.y, boutonsFin.portfolio.l, boutonsFin.portfolio.h);

    // Textes des boutons
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Recommencer la démo", canvas.width / 2, boutonsFin.recommencer.y + 32);
    ctx.fillText("Retour au Portfolio", canvas.width / 2, boutonsFin.portfolio.y + 32);
    
    // Reset de l'alignement pour ne pas casser le HUD au restart
    ctx.textAlign = "left";
}

update();
