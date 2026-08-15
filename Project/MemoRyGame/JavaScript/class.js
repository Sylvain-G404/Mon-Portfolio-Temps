class Carte {
    constructor(valeur, couleur) {
        this.valeur = valeur; // Valeur de la carte (ex: "As", "2", "3", ..., "Roi")
        this.couleur = couleur.toLowerCase(); // Couleur de la carte (ex: "Coeur", "Carreau", "Trèfle", "Pique")

        this.famille = (this.couleur === "coeur" || this.couleur === "carreau")
            ? "rouge"
            : "noir";
    }

    estMemeValeur(autre) {
        return this.valeur === autre.valeur;
    }

    estMemeFamille(autre) {
        return this.famille === autre.famille;
    }

    estMatch(autre) {
        return this.estMemeValeur(autre) && this.estMemeFamille(autre);
    }

    getSymbol() {
        const symbols = {
            "coeur": "♥",
            "carreau": "♦",
            "trefle": "♣",
            "pique": "♠"
        };
        return symbols[this.couleur]; // Retourne le symbole correspondant à la couleur
    }

     getValueRank() {
        const ordre = {
            "2": 2, "3": 3, "4": 4, "5": 5,
            "6": 6, "7": 7, "8": 8, "9": 9,
            "10": 10, "V": 11, "D": 12, "R": 13, "A": 14
        };

        return ordre[this.valeur];
    }

    getColorRank() {
        const ordre = {
            "trefle": 1,
            "coeur": 2,
            "pique": 3,
            "carreau": 4
        };

        return ordre[this.couleur];
    }

    getHTML() {
        return `
            <div class="carte-inner">
                <div class="carte-front">
                    <div class="corner top-left">
                        ${this.valeur} ${this.getSymbol()}
                    </div>

                    <div class="center">
                        ${this.getSymbol()}
                    </div>

                    <div class="corner bottom-right">
                        ${this.valeur} ${this.getSymbol()}
                    </div>
                </div>

                <div class="carte-back">
                    <img src="../../Assets/Favicon/Favicon.K.sf.png" alt="logo">
                </div>
            </div>
        `;
    }
}

class Deck {
    constructor() {
        this.cartes = [];
        this.creerDeck();
        this.trier();
    }

    creerDeck() {
        const valeurs = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R", "A"];
        const couleurs = ["coeur", "carreau", "trefle", "pique"];

        for (let v of valeurs) {
            for (let c of couleurs) {
                this.cartes.push(new Carte(v, c));
            }
        }
    }

    trier() {
        this.cartes.sort((a, b) => {
            const colorDiff = a.getColorRank() - b.getColorRank();
            if (colorDiff !== 0) return colorDiff;

            return b.getValueRank() - a.getValueRank();
        });
    }

    // mélanger le deck
    shuffle() {
        for (let i = this.cartes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartes[i], this.cartes[j]] = [this.cartes[j], this.cartes[i]];
        }
    }
}