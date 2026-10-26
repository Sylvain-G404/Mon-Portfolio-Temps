// ==================================================
// ANIMATION DU LOGO (Compteur indépendant)
// ==================================================

// Identifiant de la boucle d'animation
let identifiantAnimation = null;

// Notre horloge interne (indépendante de la vraie heure)
let tempsEcoule = 0;

// Vitesse de l'animation par frame (à 60 FPS, 1/60ème de seconde par image)
const vitesseTemps = 1 / 60; 


// ==================================================
// ROTATION DU CADRAN EXTERNE
// ==================================================

function animerRotationLogoExterne(contexte) {

    const secondesFictives = Math.floor(tempsEcoule);
    const angleParSeconde = (Math.PI * 2) / 48;
    const angleRotation = -secondesFictives * angleParSeconde;

    contexte.save();

    // 1. VIBRATION FLUIDE
    if (intensiteVibration > 0.05) { // Évite les micro-calculs inutiles si c'est presque à 0
        const vibrationX = (Math.random() - 0.5) * intensiteVibration;
        const vibrationY = (Math.random() - 0.5) * intensiteVibration;
        contexte.translate(256 + vibrationX, 256 + vibrationY);
    } else {
        contexte.translate(256, 256);
    }

    contexte.rotate(angleRotation);
    contexte.translate(-256, -256);

    // 2. DESSIN DU CADRAN BLANC (Reste 100% opaque et net)
    dessinerLogoExterne(contexte);

    // 3. COUCHE THERMIQUE PROGRESSIVE
    if (chaleurActuelle > 0.01) {
        // "source-atop" dessine PAR-DESSUS le blanc sans le rendre transparent
        contexte.globalCompositeOperation = "source-atop";

        // Dégradé de couleur : plus ça chauffe, plus l'orange vire au rouge vif
        const rouge = 255;
        const vert = Math.floor(100 * (1 - chaleurActuelle)); // Le vert descend à 0 au centre (donc pur rouge)
        const bleu = 0;

        contexte.fillStyle = `rgba(${rouge}, ${vert}, ${bleu}, ${chaleurActuelle * 0.9})`;
        contexte.fillRect(0, 0, canvas.width, canvas.height);
    }

    contexte.restore(); // Remet le mode normal pour le reste du logo
}



// ==================================================
// ROTATION DU LOGO INTERNE (DOUBLE K)
// ==================================================

function animerRotationLogoInterne(contexte) {

    // Même logique de secondes entières pour le tic-tac synchrone
    const secondesFictives = Math.floor(tempsEcoule);

    const angleParSeconde = (Math.PI * 2) / 48;
    const angleRotation = secondesFictives * angleParSeconde;

    contexte.save();
    contexte.translate(256, 256);
    contexte.rotate(angleRotation);
    contexte.translate(-256, -256);

    dessinerLogoInterne(contexte);

    contexte.restore();
}


// ==================================================
// BOUCLE D'ANIMATION (Gestionnaire de la logique)
// ==================================================

function boucleAnimation() {

    contexte.clearRect(0, 0, canvas.width, canvas.height);

    tempsEcoule += vitesseTemps;

    chaleurActuelle += (chaleurCible - chaleurActuelle) * 0.1;
    intensiteVibration = chaleurActuelle * 15;

    // 1. Les rotations et dessins des logos existants
    animerRotationLogoExterne(contexte);
    animerRotationLogoInterne(contexte);

    // 2. --- LOGIQUE DU MODE GHOST SCANNER ---
    const secondesFictives = Math.floor(tempsEcoule);
    const rotationActuelleDegres = (secondesFictives * 7.5) % 360; // Base 48 = 7.5° par sec

    const anglesLettresFixes = [0, 45, 135, 180, 225, 315];
    const anglesBranchesOrigine = [0, 45, 135, 180, 225, 315];
    
    // On prépare le tableau des 6 opacités à envoyer au dessin
    let opacitesCalculees = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05]; // Base Ghost par défaut

    // Pour chaque lettre fixe, on regarde si une branche en mouvement la survole
    for (let i = 0; i < anglesLettresFixes.length; i++) {
        for (let j = 0; j < anglesBranchesOrigine.length; j++) {
            
            // Remplace le bloc des lignes 116 à 121 par celui-ci pour un effet "scanner" parfait :
            const positionBrancheActive = (anglesBranchesOrigine[j] + rotationActuelleDegres) % 360;

            // On calcule l'écart absolu en degrés entre la branche et la lettre
            const ecart = Math.abs(positionBrancheActive - anglesLettresFixes[i]);

            // Si l'aiguille est très proche (marge de moins de 15° pour capter le passage proprement)
            if (ecart < 1 || ecart > 359) { 
                opacitesCalculees[i] = 1.0;
            }
        }
    }

    // 3. ENVOI DES PARAMÈTRES AU DESSIN PUR
    dessinerLettresPseudo(contexte, opacitesCalculees);

    // 4. --- EXTRACTEUR MAGIQUE POUR LE DOS DES CARTES ---
    // On convertit le rendu du canvas en image au format WebP ultra-léger
    const imageFrame = canvas.toDataURL("image/webp");
    
    // On l'injecte directement dans la racine CSS du site
    document.documentElement.style.setProperty("--logo-anime-image", `url(${imageFrame})`);

    identifiantAnimation = requestAnimationFrame(boucleAnimation);
}


// ==================================================
// DÉMARRER L'ANIMATION
// ==================================================

function demarrerAnimation() {

    if (identifiantAnimation !== null) {
        return;
    }

    identifiantAnimation = requestAnimationFrame(boucleAnimation);
}


// ==================================================
// ARRÊTER L'ANIMATION
// ==================================================

function arreterAnimation() {

    if (identifiantAnimation === null) {
        return;
    }

    cancelAnimationFrame(identifiantAnimation);

    identifiantAnimation = null;
}
