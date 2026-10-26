// ==================================================
// DESSIN DES LETTRES DU PSEUDO (CALÉES SUR LE K)
// ==================================================

function dessinerLettresPseudo(contexte, opacites = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) {

    const centreX = 256;
    const centreY = 256;
    const rayonLettres = 150; // Réduit un poil pour être plus proche du K si besoin

    const pseudo = ["I", "I", "R", "R", "A", "K"];

    // Tableau des angles précis du Double K convertis en radians
    // 0° = Haut, 45° = Branche sup droite, 135° = Branche inf droite, etc.
    const anglesDegres = [0, 45, 135, 180, 225, 315];

    contexte.save();

    contexte.font = "bold 26px monospace"; 
    contexte.textAlign = "center";
    contexte.textBaseline = "middle";

    for (let i = 0; i < pseudo.length; i++) {

        contexte.fillStyle = `rgba(255, 255, 255, ${opacites[i]})`;
        // Conversion des degrés en radians, avec le décalage de -90° (Math.PI / 2) 
        // pour que le 0° commence bien tout en haut.
        const angleLettre = (anglesDegres[i] * Math.PI / 180) - (Math.PI / 2);

        const lettreX = centreX + Math.cos(angleLettre) * rayonLettres;
        const lettreY = centreY + Math.sin(angleLettre) * rayonLettres;

        contexte.fillText(pseudo[i], lettreX, lettreY);
    }

    contexte.restore();
}
