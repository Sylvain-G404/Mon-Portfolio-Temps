const bouton = document.getElementById("calculer");

// --- EVENT ----
bouton.addEventListener("click", function () {
    const data = recupererValeurs();

    if (!data) return; // Sécurité : On s'arrête immédiatement si les données sont invalides

    sauvegarder(data); // Sécurité : On ne sauvegarde QUE si les données sont validées et propres !

    const surface = calculSurface(data);

    if (surface <= 0) {
        afficherErreur("La surface calculée est invalide (inférieure ou égale à 0 m²).");
        return;
    }

    const peinture = calculPeinture(surface);
    const tapisserie = calculTapisserie(surface, data.tapisserieActive);
    const prix = calculPrix(peinture, tapisserie);

    afficherResultats(surface, peinture, tapisserie, prix);
});

// Récupérer et valider strictement les valeurs des champs de saisie
function recupererValeurs() {
    // Utilisation de || 0 pour forcer une valeur numérique si le champ est vide ou buggé
    const longueur = Number(document.querySelector("#longueur").value) || 0;
    const largeur = Number(document.querySelector("#largeur").value) || 0;
    const hauteur = Number(document.querySelector("#hauteur").value) || 0;
    const nbPortes = Number(document.querySelector("#portes").value) || 0;
    const nbFenetres = Number(document.querySelector("#fenetres").value) || 0;
    const tapisserieActive = document.querySelector("#tapisserie").checked;

    // 1. Vérification des champs obligatoires manquants ou égaux à zéro
    if (longueur === 0 || largeur === 0 || hauteur === 0) {
        afficherErreur("Veuillez remplir tous les champs obligatoires avec des valeurs supérieures à 0.");
        return null;
    }

    // 2. Sécurité stricte : Limites industrielles géantes (Format Hangar XXL / SpaceX)
    if (
        isNaN(longueur) || longueur < 0 || longueur > 1000 ||    // Max 1 km de long
        isNaN(largeur) || largeur < 0 || largeur > 1000 ||      // Max 1 km de large
        isNaN(hauteur) || hauteur < 0 || hauteur > 100 ||       // Max 100 m de haut (Hangar fusée)
        isNaN(nbPortes) || nbPortes < 0 || nbPortes > 10 ||     // Max 10 portes (ex: grands quais)
        isNaN(nbFenetres) || nbFenetres < 0 || nbFenetres > 20   // Max 20 fenêtres
    ) {
        afficherErreur("Erreur : Limites maximales dépassées (Max : L/l 1000m, H 100m, 10 portes, 20 fenêtres).");
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
        "Surface des murs : " + surface.toFixed(2) + " m²";

    document.querySelector("#calculeLitre").textContent =
        litres + " litre(s) vous seront nécessaires";

    document.querySelector("#resultatTapisserie").textContent =
        rouleaux > 0
            ? rouleaux + " rouleau(x) nécessaire(s)"
            : "Tapisserie désactivée";

    document.querySelector("#prixPeinture").textContent =
        "Prix de la peinture : " + prix.peinture + " €";

    document.querySelector("#prixTapisserie").textContent =
        "Prix de la tapisserie : " + prix.tapisserie + " €";

    document.querySelector("#prixTotal").textContent =
        "Prix total estimé : " + prix.total.toFixed(2) + " €";
}

// Afficher les erreurs
function afficherErreur(message) {
    document.querySelector("#resultat").textContent = message;
    // Nettoyage optionnel des autres champs pour éviter les données incohérentes en cas d'erreur
    document.querySelector("#calculeLitre").textContent = "0 litre";
    document.querySelector("#resultatTapisserie").textContent = "Calcul impossible";
    document.querySelector("#prixTotal").textContent = "0.00 €";
}

// Sauvegarder les données dans le localStorage
function sauvegarder(data) {
    localStorage.setItem("calculM2", JSON.stringify(data));
}

charger(); // Charger les données sauvegardées au chargement de la page

// Fonction pour charger les données sauvegardées
function charger() {
    const data = localStorage.getItem("calculM2");

    // Protection essentielle si la clé existe mais est vide ou corrompue
    if (!data || data === "null") return;

    try {
        const valeurs = JSON.parse(data);
        if (!valeurs) return;

        document.querySelector("#longueur").value = valeurs.longueur || "";
        document.querySelector("#largeur").value = valeurs.largeur || "";
        document.querySelector("#hauteur").value = valeurs.hauteur || "";
        document.querySelector("#portes").value = valeurs.nbPortes || 0;
        document.querySelector("#fenetres").value = valeurs.nbFenetres || 0;
        document.querySelector("#tapisserie").checked = valeurs.tapisserieActive || false;
    } catch (e) {
        // En cas d'erreur de parsing JSON, on nettoie pour éviter de bloquer le site
        localStorage.removeItem("calculM2");
    }
}

// --- RESET ---
const boutonReset = document.getElementById("reset");

boutonReset.addEventListener("click", function () {
    localStorage.removeItem("calculM2");
    location.reload();
});
