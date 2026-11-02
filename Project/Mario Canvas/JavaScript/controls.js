// --- ÉTAT DES TOUCHES ---
const touches = {
    haut: false,   // Flèche Haut / Touch-up
    gauche: false, // Flèche Gauche / Touch-left
    bas: false,    // Flèche Bas / Touch-down
    droite: false  // Flèche Droite / Touch-right
};

// ==========================================
// 1. ÉCOUTEURS CLAVIER (PC - Flèches directionnelles)
// ==========================================

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            touches.haut = true;
            break;
        case 'ArrowLeft':
            touches.gauche = true;
            break;
        case 'ArrowDown':
            touches.bas = true;
            break;
        case 'ArrowRight':
            touches.droite = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            touches.haut = false;
            break;
        case 'ArrowLeft':
            touches.gauche = false;
            break;
        case 'ArrowDown':
            touches.bas = false;
            break;
        case 'ArrowRight':
            touches.droite = false;
            break;
    }
});

// ==========================================
// 2. ÉCOUTEURS TACTILES (MOBILE)
// ==========================================

// Fonction utilitaire pour lier un bouton tactile à une propriété de l'objet 'touches'
function lierBoutonTactile(idElement, proprieteTouche) {
    const bouton = document.getElementById(idElement);
    if (!bouton) return;

    // Quand on pose le doigt
    bouton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Bloque le comportement natif du navigateur mobile (zoom/scroll)
        touches[proprieteTouche] = true;
    });

    // Quand on retire le doigt
    bouton.addEventListener('touchend', (e) => {
        e.preventDefault();
        touches[proprieteTouche] = false;
    });

    // Sécurité : si le doigt glisse en dehors du bouton
    bouton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        touches[proprieteTouche] = false;
    });
}

// On applique la logique sur nos 4 boutons HTML une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
    lierBoutonTactile('touch-left', 'gauche');
    lierBoutonTactile('touch-right', 'droite');
    lierBoutonTactile('touch-up', 'haut');
    lierBoutonTactile('touch-down', 'bas');
});
