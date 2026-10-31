// --- ÉTAT DES TOUCHES (Indépendant de la disposition AZERTY/QWERTY) ---
const touches = {
    haut: false,   // Touche W (QWERTY) ou Z (AZERTY)
    gauche: false, // Touche A (QWERTY) ou Q (AZERTY)
    bas: false,    // Touche S
    droite: false  // Touche D
};

// --- DANS TON FICHIER DE TOUCHES ---

window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft")  touches.gauche = true;
    if (e.key === "ArrowRight") touches.droite = true;
    if (e.key === "ArrowUp")    touches.haut = true;
    if (e.key === "ArrowDown")  touches.bas = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft")  touches.gauche = false;
    if (e.key === "ArrowRight") touches.droite = false;
    if (e.key === "ArrowUp")    touches.haut = false;
    if (e.key === "ArrowDown")  touches.bas = false;
});
