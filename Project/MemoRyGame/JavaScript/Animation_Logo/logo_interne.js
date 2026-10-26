function dessinerLogoInterne(contexte) {

    const centreX = 256;
    const centreY = 256;

    // ==================================================
    // GÉOMÉTRIE DU DOUBLE K (Agrandie de 40%)
    // ==================================================
    const longueur = 100 * 1.8;
    const largeur = 8 * 1.8;

    const positionBarre = 0;
    const decalageBranche = 10 * 1.8;
    const positionDepartBranche = 15 * 1.8;

    const longueurBranche = 45 * 1.8;
    const hauteurBranche = 45 * 1.8;

    contexte.lineCap = "round";
    contexte.lineWidth = largeur;
    contexte.strokeStyle = "#ffffff";

    // ==================================================
    // POSITIONNEMENT DU LOGO
    // ==================================================

    contexte.save();

    contexte.translate(centreX, centreY);


    // ==================================================
    // PREMIER K
    // ==================================================


    // --------------------------------------------------
    // BARRE VERTICALE
    // --------------------------------------------------

    contexte.beginPath();

    contexte.moveTo(positionBarre, -longueur / 2);
    contexte.lineTo(positionBarre, longueur / 2);

    contexte.stroke();


    // --------------------------------------------------
    // BRANCHE SUPÉRIEURE
    // --------------------------------------------------

    contexte.beginPath();

    contexte.moveTo(positionBarre, positionDepartBranche);
    contexte.lineTo(longueurBranche, -hauteurBranche);

    contexte.stroke();


    // --------------------------------------------------
    // BRANCHE INFÉRIEURE
    // --------------------------------------------------

    contexte.beginPath();

    contexte.moveTo(decalageBranche, decalageBranche);
    contexte.lineTo(longueurBranche, longueurBranche);

    contexte.stroke();


    // ==================================================
    // DEUXIÈME K INVERSÉ
    // ==================================================

    contexte.save();

    // Rotation de 180° pour inverser le K
    contexte.rotate(Math.PI);

    // --------------------------------------------------
    // BRANCHE SUPÉRIEURE
    // --------------------------------------------------

    contexte.beginPath();

    contexte.moveTo(positionBarre, positionDepartBranche);
    contexte.lineTo(longueurBranche, -hauteurBranche);

    contexte.stroke();


    // --------------------------------------------------
    // BRANCHE INFÉRIEURE
    // --------------------------------------------------

    contexte.beginPath();

    contexte.moveTo(decalageBranche, decalageBranche);
    contexte.lineTo(longueurBranche, longueurBranche);

    contexte.stroke();


    // Fin du deuxième K
    contexte.restore();
    
    // ==================================================
    // FIN DU LOGO INTERNE
    // ==================================================

    contexte.restore();


    // ==================================================
    // TEST DE GÉOMÉTRIE
    // ==================================================

    // testerGeometrieDoubleK(contexte);
}

function testerGeometrieDoubleK(contexte) {

    // ==================================================
    // GÉOMÉTRIE DU DOUBLE K
    // ==================================================

    const positionBarre = 0;
    const decalageBranche = 10;
    const positionDepartBranche = 15;

    const longueurBranche = 45;
    const hauteurBranche = 45;


    // ==================================================
    // STYLE DES POINTS DE TEST
    // ==================================================

    const rayonPoint = 3;

    const couleurPremierK = "#ff0000";
    const couleurDeuxiemeK = "#00ff00";


    // ==================================================
    // POSITIONNEMENT DU TEST
    // ==================================================

    contexte.save();

    contexte.translate(256, 256);


    // ==================================================
    // PREMIER K
    // ==================================================

    contexte.fillStyle = couleurPremierK;

    // --------------------------------------------------
    // Point de départ de la barre verticale
    // --------------------------------------------------

    contexte.beginPath();

    contexte.arc(
        positionBarre,
        0,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    // --------------------------------------------------
    // Point de départ de la branche supérieure
    // --------------------------------------------------

    contexte.beginPath();

    contexte.arc(
        positionBarre,
        positionDepartBranche,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    // --------------------------------------------------
    // Point de départ de la branche inférieure
    // --------------------------------------------------

    contexte.beginPath();

    contexte.arc(
        decalageBranche,
        decalageBranche,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    // ==================================================
    // DEUXIÈME K INVERSÉ
    // ==================================================

    contexte.save();

    // Rotation de 180° pour inverser le K
    contexte.rotate(Math.PI);

    contexte.fillStyle = couleurDeuxiemeK;


    // --------------------------------------------------
    // Point de départ de la branche supérieure
    // --------------------------------------------------

    contexte.beginPath();

    contexte.arc(
        positionBarre,
        positionDepartBranche,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    // --------------------------------------------------
    // Point de départ de la branche inférieure
    // --------------------------------------------------

    contexte.beginPath();

    contexte.arc(
        decalageBranche,
        decalageBranche,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    contexte.restore();


    // ==================================================
    // FIN DU TEST
    // ==================================================

    contexte.restore();
}