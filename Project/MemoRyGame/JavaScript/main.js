const table = document.getElementById('table');

let soundEnabled = false;

let premiereCarte = null;
let deuxiemeCarte = null;
let bloque = false;

const toggle = document.getElementById("soundToggle");

document.body.addEventListener("click", () => {
    soundEnabled = true;
    toggle.classList.remove("off");
    toggle.textContent = "🔊";
}, { once: true });

toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // évite double trigger

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

function afficherDeck(deck) {
    table.innerHTML = "";

    deck.cartes.forEach(carte => {
        const div = document.createElement('div');
        div.classList.add("carte", carte.couleur);
        div.innerHTML = carte.getHTML();

        div.addEventListener("click", () => {
            if (div.classList.contains("matched")) return;
            if (bloque) return;
            // éviter double clic même carte
            if (premiereCarte && premiereCarte.div === div) return;
            // son flip
            if (soundEnabled) {
                Sound.playFlip();
            }
            // 1er clic
            if (!premiereCarte) {
                premiereCarte = { div, carte };
                div.classList.add("flip");
                return;
            } 
            // 2eme clic
            deuxiemeCarte = { div, carte };
            bloque = true;

            div.classList.add("flip");

            // 👉 COMPARAISON
            const memeValeur = premiereCarte.carte.valeur === deuxiemeCarte.carte.valeur;

            const memeCouleur = premiereCarte.carte.couleur === deuxiemeCarte.carte.couleur;

            if (premiereCarte.carte.estMatch(deuxiemeCarte.carte)) {
                // ✔ MATCH
                updateCombo(true);

                premiereCarte.div.classList.add("matched");
                deuxiemeCarte.div.classList.add("matched");

                premiereCarte.div.style.pointerEvents = "none";
                deuxiemeCarte.div.style.pointerEvents = "none";

                resetSelection();

            } else {
                // ❌ PAS MATCH
                updateCombo(false);

                setTimeout(() => {
                    if (premiereCarte) premiereCarte.div.classList.remove("flip");
                    if (deuxiemeCarte) deuxiemeCarte.div.classList.remove("flip");
                    resetSelection();
                }, 1000); // controle du temps pour voir les cartes avant de les retourner
            }

        });

        table.appendChild(div);
    });
}

function resetSelection() {
    premiereCarte = null;
    deuxiemeCarte = null;
    bloque = false;
}

const deck = new Deck();
// carte mélange
deck.shuffle();
afficherDeck(deck);

Sound.init();

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