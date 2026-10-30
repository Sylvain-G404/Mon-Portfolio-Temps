/* --------------------------------------------------------- */
/* ANIMATION SOURIS : ÉTOILES FILANTES & SUIVI DU REGARD      */
/* --------------------------------------------------------- */

// Variables pour stocker la position actuelle de la souris
let sourisX = 0;
let sourisY = 0;

window.addEventListener('mousemove', (e) => {
    // Stockage des coordonnées globales pour le moteur de scroll
    sourisX = e.clientX;
    sourisY = e.clientY;

    // 1. Ton effet existant : génération des étoiles filantes
    creerEtoile(e.clientX, e.clientY);

    // 2. Si l'œil molette est actif, on oriente les pupilles vers le curseur
    if (oeilActif && elementOeil) {
        const pupilles = elementOeil.querySelectorAll('.pupille');
        
        pupilles.forEach(pupille => {
            // Trouver le centre géométrique exact du globe oculaire sur l'écran
            const rect = pupille.parentElement.getBoundingClientRect();
            const oeilX = rect.left + rect.width / 2;
            const oeilY = rect.top + rect.height / 2;

            // Calculer la distance entre l'œil et le curseur
            const deltaX = e.clientX - oeilX;
            const deltaY = e.clientY - oeilY;
            
            // Calculer l'angle précis en radians grâce à la trigonométrie
            const angle = Math.atan2(deltaY, deltaX);

            // Course maximale de la pupille en pixels pour éviter qu'elle ne sorte de l'œil
            const distanceMax = 10; 

            // Convertir l'angle en déplacements X et Y applicables en CSS
            const deplX = Math.cos(angle) * distanceMax;
            const deplY = Math.sin(angle) * distanceMax;

            // Injecter la transformation physique sur la pupille
            pupille.style.transform = `translate(${deplX}px, ${deplY}px)`;
        });
    }
});

function creerEtoile(x, y) {
    const etoile = document.createElement('div');
    etoile.classList.add('etoile-filante');
    
    etoile.style.left = `${x}px`;
    etoile.style.top = `${y}px`;
    
    const taille = Math.random() * 10 + 15; 
    etoile.style.width = `${taille}px`;
    etoile.style.height = `${taille}px`;

    document.body.appendChild(etoile);

    setTimeout(() => {
        etoile.remove();
    }, 600);
}

/* --------------------------------------------------------- */
/* GESTION DE L'ŒIL MOLETTE : APPARITION / DISPARITION       */
/* --------------------------------------------------------- */

let oeilActif = false; // Variable d'état : false = fermé, true = ouvert
let elementOeil = null; // Va stocker l'élément HTML de notre œil
let oeilOrigineX = 0; // Coordonnée X du clic d'apparition
let oeilOrigineY = 0; // Coordonnée Y du clic d'apparition

window.addEventListener('mousedown', (e) => {
    if (e.button === 1) {
        e.preventDefault(); 
        
        if (oeilActif) {
            fermerOeil();
        } else {
            ouvrirOeil(e.clientX, e.clientY);
        }
    }
    else if (e.button === 0 && oeilActif) {
        fermerOeil();
    }
});

function ouvrirOeil(x, y) {
    oeilActif = true;
    oeilOrigineX = x;
    oeilOrigineY = y;

    elementOeil = document.createElement('div');
    elementOeil.classList.add('paire-yeux-conteneur');
    elementOeil.style.left = `${x}px`;
    elementOeil.style.top = `${y}px`;

    for (let i = 0; i < 2; i++) {
        const globe = document.createElement('div');
        globe.classList.add('globe-oculaire');

        const pupille = document.createElement('span');
        pupille.classList.add('pupille');

        globe.appendChild(pupille);
        elementOeil.appendChild(globe);
    }

    document.body.appendChild(elementOeil);

    // Lancement de la boucle d'auto-scroll continue
    boucleAutoScroll();
}

function fermerOeil() {
    oeilActif = false;
    if (elementOeil) {
        elementOeil.remove();
        elementOeil = null;
    }
}

/* --------------------------------------------------------- */
/* MOTEUR D'AUTO-SCROLL CONTINU                              */
/* --------------------------------------------------------- */

function boucleAutoScroll() {
    // Si l'œil a été fermé entre-temps, on arrête net la boucle d'animation
    if (!oeilActif) return;

    // Calcul de l'écart vertical entre l'œil fixe et le curseur actuel
    const distanceY = sourisY - oeilOrigineY;

    // Zone neutre : si la souris est à moins de 20px de l'œil, on ne scrolle pas
    if (Math.abs(distanceY) > 20) {
        // Sensibilité du scroll : plus on s'éloigne, plus la vitesse augmente
        // On divise par 2 pour garder un défilement contrôlable et fluide
        const vitesseScroll = distanceY / 2;

        // Déplacement physique de la fenêtre de navigation
        window.scrollBy(0, vitesseScroll);
    }

    // Rappelle la fonction au prochain rafraîchissement d'écran (60fps+)
    window.requestAnimationFrame(boucleAutoScroll);
}
