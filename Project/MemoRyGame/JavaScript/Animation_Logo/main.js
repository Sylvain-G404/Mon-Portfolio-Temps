// ==================================================
// INITIALISATION DU CANVAS VIRTUEL (EN MÉMOIRE)
// ==================================================

// On crée le canvas dans la mémoire du navigateur sans l'ajouter au DOM
const canvas = document.createElement("canvas");
const contexte = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

// Variables globales pour la gestion de la physique thermique
let intensiteVibration = 0;
let chaleurCible = 0;
let chaleurActuelle = 0;

// Tracé de la toute première frame statique
contexte.save();
dessinerLogoExterne(contexte);
dessinerLogoInterne(contexte);
dessinerLettresPseudo(contexte);
contexte.restore();
