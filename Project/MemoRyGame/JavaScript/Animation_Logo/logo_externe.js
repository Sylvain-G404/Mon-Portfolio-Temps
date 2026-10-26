function dessinerLogoExterne(contexte) {

    // ==================================================
    // POSITIONNEMENT DU LOGO
    // ==================================================

    const centreX = 256;
    const centreY = 256;


    // ==================================================
    // GÉOMÉTRIE DES REPÈRES
    // ==================================================

    // Distance entre le centre et les repères
    const distance = 220;

    // Décalage des repères secondaires
    const decalageRepere = 0;

    // Décalage des repères principaux
    const decalageReperePrincipal = -5;


    // ==================================================
    // NOMBRE ET DIMENSIONS DES REPÈRES
    // ==================================================

    // Nombre total de repères autour du cadran
    const nombreDeReperes = 12;

    // Dimensions des repères secondaires
    const longueurRepere = 30 * 1.5;
    const largeurRepere = 6 * 1.5;

    // Dimensions des repères principaux
    const longueurReperePrincipal = 40 * 1.5;
    const largeurReperePrincipal = 8 * 1.5;


    // ==================================================
    // CALCUL DES ANGLES
    // ==================================================

    // Angle entre chaque repère
    const angleEntreReperes = (Math.PI * 2) / nombreDeReperes;

    // Position du premier repère : 12 h
    const angleDeDepart = -Math.PI / 2;


    // ==================================================
    // STYLE DU LOGO
    // ==================================================

    contexte.fillStyle = "#ffffff";


    // ==================================================
    // DESSIN DES 12 REPÈRES
    // ==================================================

    for (let i = 0; i < nombreDeReperes; i++) {

        // Angle de position du repère actuel
        const anglePosition = angleDeDepart + i * angleEntreReperes;

        // Angle de rotation du repère
        const angleRotation = anglePosition + Math.PI / 2;


        // ==================================================
        // VALEURS PAR DÉFAUT DU REPÈRE
        // ==================================================

        let longueurActuelle = longueurRepere;
        let largeurActuelle = largeurRepere;
        let decalageActuel = decalageRepere;


        // ==================================================
        // REPÈRES PRINCIPAUX
        // ==================================================

        switch (i) {

            // --------------------------------------------------
            // 12 h
            // --------------------------------------------------

            case 0:

                longueurActuelle = longueurReperePrincipal;
                largeurActuelle = largeurReperePrincipal;
                decalageActuel = decalageReperePrincipal;

                break;


            // --------------------------------------------------
            // 3 h
            // --------------------------------------------------

            case 3:

                longueurActuelle = longueurReperePrincipal;
                largeurActuelle = largeurReperePrincipal;
                decalageActuel = decalageReperePrincipal;

                break;


            // --------------------------------------------------
            // 6 h
            // --------------------------------------------------

            case 6:

                longueurActuelle = longueurReperePrincipal;
                largeurActuelle = largeurReperePrincipal;
                decalageActuel = decalageReperePrincipal;

                break;


            // --------------------------------------------------
            // 9 h
            // --------------------------------------------------

            case 9:

                longueurActuelle = longueurReperePrincipal;
                largeurActuelle = largeurReperePrincipal;
                decalageActuel = decalageReperePrincipal;

                break;


            // --------------------------------------------------
            // REPÈRES SECONDAIRES
            // --------------------------------------------------

            default:

                longueurActuelle = longueurRepere;
                largeurActuelle = largeurRepere;
                decalageActuel = decalageRepere;

                break;
        }


        // ==================================================
        // CALCUL DE LA POSITION DU REPÈRE
        // ==================================================

        const distanceRepere = distance + decalageActuel;

        const x = centreX + Math.cos(anglePosition) * distanceRepere;

        const y = centreY + Math.sin(anglePosition) * distanceRepere;


        // ==================================================
        // DESSIN DU REPÈRE
        // ==================================================

        contexte.save();

        contexte.translate(x, y);
        contexte.rotate(angleRotation);


        // --------------------------------------------------
        // FORME DU REPÈRE
        // --------------------------------------------------

        contexte.beginPath();

        contexte.roundRect(
            -largeurActuelle / 2,
            -longueurActuelle / 2,
            largeurActuelle,
            longueurActuelle,
            largeurActuelle / 2
        );

        contexte.fill();

        contexte.restore();
    }
}

function testerGeometrieLogoExterne(contexte) {

    // ==================================================
    // POSITIONNEMENT DU TEST
    // ==================================================

    const centreX = 256;
    const centreY = 256;


    // ==================================================
    // GÉOMÉTRIE DU LOGO EXTERNE
    // ==================================================

    const distance = 220;
    const nombreDeReperes = 12;

    const rayonPoint = 3;


    // ==================================================
    // COULEURS DU TEST
    // ==================================================

    const couleurCentre = "#ff0000";
    const couleurReperePrincipal = "#00ff00";
    const couleurRepereSecondaire = "#0088ff";


    // ==================================================
    // CALCUL DES ANGLES
    // ==================================================

    const angleEntreReperes = (Math.PI * 2) / nombreDeReperes;

    const angleDeDepart = -Math.PI / 2;


    // ==================================================
    // POSITIONNEMENT DU TEST
    // ==================================================

    contexte.save();

    contexte.translate(centreX, centreY);


    // ==================================================
    // POINT CENTRAL
    // ==================================================

    contexte.fillStyle = couleurCentre;

    contexte.beginPath();

    contexte.arc(
        0,
        0,
        rayonPoint,
        0,
        Math.PI * 2
    );

    contexte.fill();


    // ==================================================
    // POINTS DES 12 REPÈRES
    // ==================================================

    for (let i = 0; i < nombreDeReperes; i++) {

        // --------------------------------------------------
        // CALCUL DE L'ANGLE DU REPÈRE
        // --------------------------------------------------

        const anglePosition = angleDeDepart + i * angleEntreReperes;


        // --------------------------------------------------
        // CALCUL DE LA POSITION DU POINT
        // --------------------------------------------------

        const x = Math.cos(anglePosition) * distance;

        const y = Math.sin(anglePosition) * distance;


        // ==================================================
        // COULEUR DU POINT
        // ==================================================

        // 12 h, 3 h, 6 h et 9 h
        if (
            i === 0 ||
            i === 3 ||
            i === 6 ||
            i === 9
        ) {

            contexte.fillStyle = couleurReperePrincipal;

        } else {

            contexte.fillStyle = couleurRepereSecondaire;
        }


        // ==================================================
        // DESSIN DU POINT
        // ==================================================

        contexte.beginPath();

        contexte.arc(
            x,
            y,
            rayonPoint,
            0,
            Math.PI * 2
        );

        contexte.fill();
    }


    // ==================================================
    // FIN DU TEST
    // ==================================================

    contexte.restore();
}