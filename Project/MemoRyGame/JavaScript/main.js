const table = document.getElementById("table");

let soundEnabled = false;

let premiereCarte = null;
let deuxiemeCarte = null;
let bloque = false;

const toggle = document.getElementById("soundToggle");


// ==================== SON ====================

document.body.addEventListener("click", () => {
    soundEnabled = true;
    toggle.classList.remove("off");
    toggle.textContent = "🔊";
}, { once: true });


toggle.addEventListener("click", (e) => {
    e.stopPropagation();

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

            // Carte déjà trouvée
            if (div.classList.contains("matched")) return;

            // Deux cartes déjà en attente de comparaison
            if (bloque) return;

            // Empêche de cliquer deux fois sur la même carte
            if (premiereCarte && premiereCarte.div === div) return;


            // =========================
            // SON
            // =========================

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

                // Retourne la carte
                div.classList.add("flip");

                // Agrandit la carte
                div.classList.add("zoom");


                // On garde une référence indépendante
                const cartePremiere = premiereCarte;


                // Après 2 secondes :
                // la carte redevient petite
                // MAIS reste face visible
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

            // Retourne la deuxième carte
            div.classList.add("flip");

            // Agrandit la deuxième carte
            div.classList.add("zoom");


            // IMPORTANT :
            // on mémorise les références AVANT le timer
            const cartePremiere = premiereCarte;
            const carteDeuxieme = deuxiemeCarte;


            // =========================
            // 2 SECONDES POUR MÉMORISER
            // =========================

            setTimeout(() => {

                // La deuxième carte reprend
                // sa taille normale
                carteDeuxieme.div.classList.remove("zoom");


                // =========================
                // COMPARAISON
                // =========================

                if (
                    cartePremiere.carte.estMatch(
                        carteDeuxieme.carte
                    )
                ) {

                    // ✔ MATCH

                    updateCombo(true);

                    cartePremiere.div.classList.add("matched");
                    carteDeuxieme.div.classList.add("matched");

                    cartePremiere.div.style.pointerEvents = "none";
                    carteDeuxieme.div.style.pointerEvents = "none";

                } else {

                    // ❌ PAS MATCH

                    updateCombo(false);

                    cartePremiere.div.classList.remove("flip");
                    carteDeuxieme.div.classList.remove("flip");
                }


                // On peut recommencer
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