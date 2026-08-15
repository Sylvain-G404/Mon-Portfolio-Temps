const bouton = document.getElementById("calculer");

const longueurInput = document.querySelector("#longueur");
const largeurInput = document.querySelector("#largeur");
const hauteurInput = document.querySelector("#hauteur");

const porteInput = document.querySelector("#portes");
const fenetreInput = document.querySelector("#fenetres");

const tapisserieInput = document.querySelector("#tapisserie");

const resultatTapisserie = document.querySelector("#resultatTapisserie");

const resultat = document.querySelector("#resultat");

const calculeLitre = document.querySelector("#calculeLitre");

const prixPeintureAffichage = document.querySelector("#prixPeinture");
const prixTapisserieAffichage = document.querySelector("#prixTapisserie");
const prixTotalAffichage = document.querySelector("#prixTotal");


bouton.addEventListener("click", function () {
    const longueur = Number(longueurInput.value);
    const largeur = Number(largeurInput.value);
    const hauteur = Number(hauteurInput.value);

    const nbPortes = Number(porteInput.value);
    const nbFenetres = Number(fenetreInput.value);

    const surfacePortes = nbPortes * 2; // Surface d'une porte = 2 m²
    const surfaceFenetres = nbFenetres * 1.5; // Surface d'une fenêtre = 1.5 m²

    const surfaceTotaleOuvertures = surfacePortes + surfaceFenetres;

    const surfaceBrute = 2 * (longueur + largeur) * hauteur;
    const surfaceMurs = surfaceBrute - surfaceTotaleOuvertures;

    const tapisserieActive = tapisserieInput.checked;

    const litresPeinture = Math.ceil(surfaceMurs / 10);

    // Calcul du prix de la tapisserie
    const prixRouleau = 20;

    let prixTapisserie = 0;

    // Calcul de la tapisserie
    if (tapisserieActive) {
        const surfaceCouverture = 5; // 1 rouleau = 5 m²
        const rouleaux = Math.ceil(surfaceMurs / surfaceCouverture);
        resultatTapisserie.textContent = rouleaux + " Rouleaux vous seront nécessaires";
        prixTapisserie = rouleaux * prixRouleau;
    } else {
        resultatTapisserie.textContent = "Tapisserie désactivée";
    }

    // gere les erreurs de saisie
    if (!longueur || !largeur || !hauteur) {
        resultat.textContent = "Veuillez remplir tous les champs.";
        return;
    }
    // gere les erreurs de saisie pour la surface des murs
    if (surfaceMurs <= 0) {
        resultat.textContent = "La surface des murs doit être supérieure à 0 m². Veuillez vérifier les dimensions et le nombre de portes/fenêtres.";
        resultatTapisserie.textContent = "Erreur de calcul";
        return;
    }

    calculeLitre.textContent = "Litres de peinture nécessaires : " + litresPeinture + " L";

    resultat.textContent = "Surface des murs : " + surfaceMurs + " m²";

    // Calcul du prix de la peinture
    const prixLitre = 15;

    const prixPeinture = litresPeinture * prixLitre;


    // Calcul du prix total
    const prixTotal = prixPeinture + prixTapisserie;
    prixTotalAffichage.textContent = "Prix total estimé : " + prixTotal.toFixed(2) + "€";

});