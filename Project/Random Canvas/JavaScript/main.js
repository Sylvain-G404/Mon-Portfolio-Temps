/* ==========================================================================
   1. SÉLECTION DES ÉLÉMENTS DU DOM & INITIALISATION
   ========================================================================== */

// Récupération du Canvas et de son contexte de dessin
const canvas = document.getElementById('monCanvas');
const ctx = canvas.getContext('2d');

// Configuration de la grille interne pour s'aligner sur le CSS sans flou
canvas.width = 800;
canvas.height = 400;

// Récupération des boutons et contrôles de l'interface
const btnRandom = document.getElementById('btnRandom');
const btnTelecharger = document.getElementById('btnTelecharger');
const checkTransparent = document.getElementById('checkTransparent');


/* ==========================================================================
   2. ÉCOUTEURS D'ÉVÉNEMENTS (INTERACTIONS UTILISATEUR)
   ========================================================================== */

/**
 * Génération du dessin
 * Ajuste la taille interne du canvas au format réel de l'écran puis lance le chaos
 */
btnRandom.addEventListener('click', () => {
    // Étape magique : on synchronise les pixels internes avec la taille d'affichage CSS réelle
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Maintenant on peut lancer le dessin sans aucun flou ni déformation !
    genererLeChaos(canvas, ctx);
});


/**
 * Gestion en temps réel du fond visuel de l'application
 * Alterne entre la couleur par défaut et le damier de transparence
 */
checkTransparent.addEventListener('change', () => {
    if (checkTransparent.checked) {
        canvas.classList.add('transparent'); // Active le damier CSS
    } else {
        canvas.classList.remove('transparent'); // Retour au fond sombre natif
    }
});


/* ==========================================================================
   3. GESTION DE L'EXPORTATION & TÉLÉCHARGEMENT
   ========================================================================== */

/**
 * Capture l'état du Canvas pour générer un fichier PNG local
 * Fusionne intelligemment le dessin sur un fond opaque si la case est décochée
 */
btnTelecharger.addEventListener('click', () => {
    let imageURL;

    // Cas 1 : Exportation avec fond transparent (Sticker)
    if (checkTransparent.checked) {
        imageURL = canvas.toDataURL('image/png');
    } 
    // Cas 2 : Fusion sur fond noir opaque pour l'exportation
    else {
        // Création d'une zone de dessin virtuelle temporaire
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Remplissage du fond en pixels opaques
        tempCtx.fillStyle = "#111111";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Duplication du chef-d'œuvre actuel par-dessus le fond noir
        tempCtx.drawImage(canvas, 0, 0);

        // Extraction de l'image finale combinée
        imageURL = tempCanvas.toDataURL('image/png');
    }

    // Déclenchement automatique du téléchargement par le navigateur
    const lienVirtuel = document.createElement('a');
    lienVirtuel.href = imageURL;
    lienVirtuel.download = checkTransparent.checked ? 'chaos-art-transparent.png' : 'chaos-art-opaque.png';
    lienVirtuel.click();
});
