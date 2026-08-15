const bouton = document.getElementById("calculer");

// --- EVENT ----
bouton.addEventListener("click", function () {
    const data = recupererValeurs();
    sauvegarder(data);

    if (!data) return;

    const surface = calculSurface(data);

    if (surface <= 0) {
        afficherErreur("La surface calculée est invalide.");
        return;
    }

    const peinture = calculPeinture(surface);
    const tapisserie = calculTapisserie(surface, data.tapisserieActive);
    const prix = calculPrix(peinture, tapisserie);

    afficherResultats(surface, peinture, tapisserie, prix);
});

// Récupérer les valeurs des champs de saisie
function recupererValeurs() {
    const longueur = Number(document.querySelector("#longueur").value);
    const largeur = Number(document.querySelector("#largeur").value);
    const hauteur = Number(document.querySelector("#hauteur").value);
    const nbPortes = Number(document.querySelector("#portes").value);
    const nbFenetres = Number(document.querySelector("#fenetres").value);
    const tapisserieActive = document.querySelector("#tapisserie").checked;

    if (!longueur || !largeur || !hauteur) {
        afficherErreur("Veuillez remplir tous les champs.");
        return null;
    }

    return { longueur, largeur, hauteur, nbPortes, nbFenetres, tapisserieActive };
}

// Calculer la surface
function calculSurface(data) {
    const surfaceBrute = 2 * (data.longueur + data.largeur) * data.hauteur;
    const surfaceOuvertures = (data.nbPortes * 2) + (data.nbFenetres * 1.5);
    return surfaceBrute - surfaceOuvertures;
}

// Calculer la peinture
function calculPeinture(surface) {
    const litres = Math.ceil(surface / 10);
    return litres;
}

// Calculer la tapisserie
function calculTapisserie(surface, active) {
    if (!active) return 0;

    const rouleaux = Math.ceil(surface / 5);
    return rouleaux;
}

// Prix 
function calculPrix(litres, rouleaux) {
    const prixPeinture = litres * 15; // 15€ par litre
    const prixTapisserie = rouleaux * 20; // 20€ par rouleau
    return { peinture: prixPeinture, tapisserie: prixTapisserie, total: prixPeinture + prixTapisserie };
}

// Afficher les résultats
function afficherResultats(surface, litres, rouleaux, prix) {

    document.querySelector("#resultat").textContent =
        "Surface : " + surface.toFixed(2) + " m²";

    document.querySelector("#calculeLitre").textContent =
        litres + " L de peinture";

    document.querySelector("#resultatTapisserie").textContent =
        rouleaux > 0
            ? rouleaux + " rouleaux"
            : "Pas de tapisserie";

    document.querySelector("#prixPeinture").textContent =
        "Peinture : " + prix.peinture + " €";

    document.querySelector("#prixTapisserie").textContent =
        "Tapisserie : " + prix.tapisserie + " €";

    document.querySelector("#prixTotal").textContent =
        "Total : " + prix.total + " €";
}

// Afficher les erreurs
function afficherErreur(message) {
    document.querySelector("#resultat").textContent = message;
}

// Sauvegarder les données dans le localStorage
function sauvegarder(data) {
    localStorage.setItem("calculM2", JSON.stringify(data));
}

charger(); // Charger les données sauvegardées au chargement de la page

// fonction pour charger les données sauvegardées dans le localStorage et les afficher dans les champs de saisie
function charger() {

    const data = localStorage.getItem("calculM2");

    if (!data) return;

    const valeurs = JSON.parse(data);

    document.querySelector("#longueur").value = valeurs.longueur;
    document.querySelector("#largeur").value = valeurs.largeur;
    document.querySelector("#hauteur").value = valeurs.hauteur;
    document.querySelector("#portes").value = valeurs.nbPortes;
    document.querySelector("#fenetres").value = valeurs.nbFenetres;
    document.querySelector("#tapisserie").checked = valeurs.tapisserieActive;
}

// --- RESET ---
const boutonReset = document.getElementById("reset");

boutonReset.addEventListener("click", function () {
    localStorage.removeItem("calculM2");
    location.reload();
});