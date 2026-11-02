// --- ÉTAT DES TOUCHES (Indépendant de la disposition AZERTY/QWERTY) ---
const touches = {
    haut: false,   // Touche W (QWERTY) ou Z (AZERTY)
    gauche: false, // Touche A (QWERTY) ou Q (AZERTY)
    bas: false,    // Touche S
    droite: false  // Touche D
};

// ==========================================
// 1. ÉCOUTEURS CLAVIER (PC)
// ==========================================

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': touches.haut = true; break;
        case 'KeyA': touches.gauche = true; break;
        case 'KeyS': touches.bas = true; break;
        case 'KeyD': touches.droite = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': touches.haut = false; break;
        case 'KeyA': touches.gauche = false; break;
        case 'KeyS': touches.bas = false; break;
        case 'KeyD': touches.droite = false; break;
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
        e.preventDefault(); // Bloque le comportement natif du navigateur mobile
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

// On applique la logique sur nos 4 boutons HTML
document.addEventListener("DOMContentLoaded", () => {
    lierBoutonTactile('touch-left', 'gauche');
    lierBoutonTactile('touch-right', 'droite');
    lierBoutonTactile('touch-up', 'haut');
    lierBoutonTactile('touch-down', 'bas');
});
