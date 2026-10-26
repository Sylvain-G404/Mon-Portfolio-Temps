const table = document.getElementById("table");

let soundEnabled = false;

let premiereCarte = null;
let deuxiemeCarte = null;
let bloque = false;

const toggle = document.getElementById("soundToggle");


// ==================== SON ====================

// ==================== SON ====================

// Premier clic n'importe où sur la page : débloque l'autorisation audio du navigateur
// de manière totalement invisible, SANS forcer l'activation du son du jeu.
document.body.addEventListener("click", () => {
    // On crée un contexte audio temporaire juste pour dire au navigateur "c'est bon, l'utilisateur a interagi"
    const contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
    if (contexteAudio.state === 'suspended') {
        contexteAudio.resume();
    }
}, { once: true });


// Gestionnaire du clic EXCLUSIF sur le bouton de son
toggle.addEventListener("click", (e) => {
    e.stopPropagation();

    // On inverse l'état réel du son uniquement ici
    soundEnabled = !soundEnabled;
    Sound.enabled = soundEnabled;

    if (soundEnabled) {
        toggle.textContent = "🔊";
        toggle.classList.remove("off");
    } else {
        toggle.textContent = "🔇";
        toggle.classList.add("off");
    }
});


// ==================== AFFICHAGE DU DECK ====================

function afficherDeck(deck) {
    table.innerHTML = "";

    deck.cartes.forEach(carte => {
        const div = document.createElement("div");

        div.classList.add("carte", carte.couleur);
        div.innerHTML = carte.getHTML();

        div.addEventListener("click", () => {

            if (div.classList.contains("matched")) return;
            if (bloque) return;
            if (premiereCarte && premiereCarte.div === div) return;

            if (soundEnabled) {
                Sound.playFlip();
            }

            // =========================
            // PREMIÈRE CARTE
            // =========================
            if (!premiereCarte) {
                premiereCarte = {
                    div: div,
                    carte: carte
                };

                div.classList.add("flip");
                div.classList.add("zoom");

                const cartePremiere = premiereCarte;

                setTimeout(() => {
                    cartePremiere.div.classList.remove("zoom");
                }, 2000);

                return;
            }

            // =========================
            // DEUXIÈME CARTE
            // =========================
            deuxiemeCarte = {
                div: div,
                carte: carte
            };

            bloque = true;

            div.classList.add("flip");
            div.classList.add("zoom");

            const cartePremiere = premiereCarte;
            const carteDeuxieme = deuxiemeCarte;

            // =========================
            // 2 SECONDES POUR MÉMORISER
            // =========================
            setTimeout(() => {
                carteDeuxieme.div.classList.remove("zoom");

                // =========================
                // COMPARAISON
                // =========================
                if (cartePremiere.carte.estMatch(carteDeuxieme.carte)) {
                    updateCombo(true);
                    cartePremiere.div.classList.add("matched");
                    carteDeuxieme.div.classList.add("matched");
                    cartePremiere.div.style.pointerEvents = "none";
                    carteDeuxieme.div.style.pointerEvents = "none";
                } else {
                    updateCombo(false);
                    cartePremiere.div.classList.remove("flip");
                    carteDeuxieme.div.classList.remove("flip");
                }

                resetSelection();
            }, 2000);
        });

        table.appendChild(div);
    });
}


// ==================== RESET ====================

function resetSelection() {
    premiereCarte = null;
    deuxiemeCarte = null;
    bloque = false;
}


// ==================== DECK ====================

const deck = new Deck();
deck.shuffle();
afficherDeck(deck);
Sound.init();


// ==================== SCORE ====================

const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");

let score = 0;
let combo = 0;

function updateScore(value) {
    score += value;
    scoreElement.textContent = `Score : ${score}`;
}

function updateCombo(isMatch) {
    if (!isMatch) {
        combo = 0;
        updateScore(1);
    } else {
        combo++;
        if (combo >= 2) {
            updateScore(-1);
        }
    }
    comboElement.textContent = `Combo : x${combo}`;
}


// ==================================================
// AUTOMATISATION DU DOS DES CARTES ANIMÉ
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    // Lance la boucle infinie de l'animation du logo en arrière-plan
    demarrerAnimation();
});
