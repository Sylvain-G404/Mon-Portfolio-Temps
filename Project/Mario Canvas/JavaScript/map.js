// --- CONFIGURATION DES NIVEAUX ---
const monde = {
    niveauActuel: 0,
    niveaux: [
        {
            nom: "Niveau 1 : Les Plaines",
            largeurTotale: 3000,
            couleurFond: "#70c5ce",
            sol: {
                hauteur: 80,
                couleur: "#5c8a35"
            },
            // Ajout d'obstacles fixes pour casser l'effet de vide !
            plateformes: [
                { x: 300, y: 420, l: 150, h: 20, couleur: "#8B4513" }, 
                { x: 600, y: 320, l: 200, h: 20, couleur: "#8B4513" }, 
                { x: 1000, y: 450, l: 80, h: 70, couleur: "#707070" }, 
                { x: 1500, y: 410, l: 100, h: 20, couleur: "#8B4513" },
                { x: 1700, y: 350, l: 100, h: 20, couleur: "#8B4513" },
                { x: 1900, y: 300, l: 100, h: 20, couleur: "#8B4513" },
                { x: 2200, y: 300, l: 120, h: 20, couleur: "#FFD700" }  
            ],
            // --- PIÈCES DORÉES ---
            pieces: [
                { x: 375, y: 390, rayon: 10, ramassée: false },
                { x: 375, y: 490, rayon: 10, ramassée: false },
                { x: 510, y: 200, rayon: 10, ramassée: false },
                { x: 700, y: 290, rayon: 10, ramassée: false },
                { x: 700, y: 390, rayon: 10, ramassée: false },
                { x: 1750, y: 320, rayon: 10, ramassée: false },
                { x: 1950, y: 250, rayon: 10, ramassée: false },
                { x: 2230, y: 270, rayon: 10, ramassée: false },
                { x: 2260, y: 270, rayon: 10, ramassée: false },
                { x: 2290, y: 270, rayon: 10, ramassée: false }
            ], // La virgule ici est obligatoire !
            
            // --- NUAGES EN ARRIÈRE-PLAN (Intégrés au bon endroit dans l'objet) ---
            nuages: [
                { x: 100, y: 80, l: 120, h: 40, vitessePropre: 0.2 },
                { x: 500, y: 120, l: 80, h: 30, vitessePropre: 0.1 },
                { x: 900, y: 60, l: 150, h: 45, vitessePropre: 0.25 },
                { x: 1400, y: 100, l: 100, h: 35, vitessePropre: 0.15 },
                { x: 1900, y: 70, l: 130, h: 40, vitessePropre: 0.2 },
                { x: 2400, y: 110, l: 90, h: 30, vitessePropre: 0.12 },
                { x: 2800, y: 65, l: 160, h: 50, vitessePropre: 0.25 }
            ]
        }
    ]
};

// --- SYSTÈME DE CAMÉRA GLOBAL ---
const camera = {
    x: 0
};

// Variable globale pour l'animation de rotation des pièces
let anglePiece = 0;

// --- FONCTION DE DESSIN DU DÉCOR ---
function dessinerMap(ctx, canvas, m) {
    const config = m.niveaux[m.niveauActuel];

    // 1. Ciel
    ctx.fillStyle = config.couleurFond;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 2. DESSIN ET ANIMATION DES NUAGES (AVEC PARALLAXE) ---
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)"; // Blanc doux transparent
    
    config.nuages.forEach(nuage => {
        // Le nuage avance tout seul vers la gauche
        nuage.x -= nuage.vitessePropre;

        // S'il sort complètement du cadre à gauche, il revient à droite
        if (nuage.x + nuage.l < 0) {
            nuage.x = config.largeurTotale;
        }

        // Parallaxe : Défilement 3x plus lent que la caméra du sol
        const nuageCamX = nuage.x - (camera.x / 3);

        // Dessin de la forme avec coins arrondis
        ctx.beginPath();
        ctx.roundRect(nuageCamX, nuage.y, nuage.l, nuage.h, 20);
        ctx.fill();
    });

    // 3. LE SOL (VERSION CORRIGÉE ET STABLE)
    ctx.fillStyle = config.sol.couleur;
    const solY = 520; 
    ctx.fillRect(0 - camera.x, solY, config.largeurTotale, canvas.height - solY);

    // 4. Plateformes
    config.plateformes.forEach(plat => {
        ctx.fillStyle = plat.couleur;
        ctx.fillRect(plat.x - camera.x, plat.y, plat.l, plat.h);
    });

    // 5. DESSIN DES PIÈCES DORÉES AVEC EFFET DE ROTATION
    anglePiece += 0.05; 
    const scaleX = Math.abs(Math.sin(anglePiece)); 

    config.pieces.forEach(piece => {
        if (!piece.ramassée) {
            ctx.save();
            ctx.translate(piece.x - camera.x, piece.y);
            ctx.scale(scaleX, 1); 

            ctx.beginPath();
            ctx.arc(0, 0, piece.rayon, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700"; 
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#DAA520"; 
            ctx.stroke();
            
            ctx.restore();
        }
    });

    // 6. INTERFACE UTILISATEUR (HUD)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    
    ctx.fillText(`🪙 Pièces : ${player.score}`, 20, 40);
    
    ctx.shadowBlur = 0;
}
