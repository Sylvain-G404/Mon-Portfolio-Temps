/* ==========================================================================
   1. BOÎTE À OUTILS & GENERATEURS ALEATOIRES
   ========================================================================== */

// Génère une couleur RGBA aléatoire
function genererCouleurAleatoire() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * 0.8 + 0.2).toFixed(2); 
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Crée un dégradé linéaire aléatoire dans une zone donnée
function genererDegradeAleatoire(ctx, x, y, largeur, hauteur) {
    const direction = Math.floor(Math.random() * 3);
    let degrade;

    if (direction === 0) {
        degrade = ctx.createLinearGradient(x, y, x + largeur, y + hauteur);
    } else if (direction === 1) {
        degrade = ctx.createLinearGradient(x, y, x + largeur, y);
    } else {
        degrade = ctx.createLinearGradient(x, y, x, y + hauteur);
    }

    degrade.addColorStop(0, genererCouleurAleatoire());
    degrade.addColorStop(1, genererCouleurAleatoire());

    return degrade;
}

/* ==========================================================================
   2. PILOTE PRINCIPAL DU CHAOS
   ========================================================================== */
function genererLeChaos(canvas, ctx) {
    ctx.shadowBlur = 0; 
    ctx.shadowColor = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const quantitéAlea = Math.floor(Math.random() * 10) + 3;

    // Lancement des générateurs (les tailles vont s'adapter au canvas)
    dessinerRectanglesAleatoires(canvas, ctx, quantitéAlea);
    dessinerCerclesAleatoires(canvas, ctx, quantitéAlea);
    dessinerTrianglesAleatoires(canvas, ctx, quantitéAlea);
    dessinerLignesAleatoires(canvas, ctx, quantitéAlea * 1.5); 
}

/* ==========================================================================
   3. FONCTIONS DE DESSIN INDIVIDUELLES RESPONSIVE
   ========================================================================== */

// 1. Rectangles proportionnels
function dessinerRectanglesAleatoires(canvas, ctx, nombre) {
    // La taille max s'adapte : 15% de la largeur du canvas
    const tailleMax = canvas.width * 0.15; 

    for (let i = 0; i < nombre; i++) {
        const largeur = Math.random() * tailleMax + (canvas.width * 0.03);
        const hauteur = Math.random() * tailleMax + (canvas.width * 0.03);
        const x = Math.random() * (canvas.width - largeur);
        const y = Math.random() * (canvas.height - hauteur);

        ctx.shadowColor = genererCouleurAleatoire();
        ctx.shadowBlur = Math.floor(Math.random() * 15) + 5;

        ctx.fillStyle = genererDegradeAleatoire(ctx, x, y, largeur, hauteur);
        ctx.fillRect(x, y, largeur, hauteur);
        
        ctx.shadowBlur = 0; 
    }
}

// 2. Cercles proportionnels
function dessinerCerclesAleatoires(canvas, ctx, nombre) {
    // Rayon max : 8% de la largeur du canvas
    const rayonMax = canvas.width * 0.08;

    for (let i = 0; i < nombre; i++) {
        const rayon = Math.random() * rayonMax + (canvas.width * 0.02);
        const x = Math.random() * (canvas.width - rayon * 2) + rayon;
        const y = Math.random() * (canvas.height - rayon * 2) + rayon;

        ctx.beginPath();
        ctx.arc(x, y, rayon, 0, 2 * Math.PI);
        
        ctx.shadowColor = genererCouleurAleatoire();
        ctx.shadowBlur = Math.floor(Math.random() * 15) + 5;

        ctx.fillStyle = genererDegradeAleatoire(ctx, x - rayon, y - rayon, rayon * 2, rayon * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// 3. Triangles proportionnels et homogènes
function dessinerTrianglesAleatoires(canvas, ctx, nombre) {
    // Zone du triangle : 15% de la largeur du canvas
    const zoneMax = canvas.width * 0.15;

    for (let i = 0; i < nombre; i++) {
        const x1 = Math.random() * (canvas.width - zoneMax);
        const y1 = Math.random() * (canvas.height - zoneMax);
        const x2 = x1 + (Math.random() * zoneMax);
        const y2 = y1 + (Math.random() * zoneMax);
        const x3 = x1 + (Math.random() * zoneMax);
        const y3 = y1 + (Math.random() * zoneMax);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath(); 

        ctx.shadowColor = genererCouleurAleatoire();
        ctx.shadowBlur = Math.floor(Math.random() * 15) + 5;

        ctx.fillStyle = genererDegradeAleatoire(ctx, x1, y1, zoneMax, zoneMax);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// 4. Lignes fluides
function dessinerLignesAleatoires(canvas, ctx, nombre) {
    for (let i = 0; i < nombre; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        
        ctx.strokeStyle = genererCouleurAleatoire();
        // L'épaisseur de la ligne s'adapte aussi légèrement à la taille de l'écran
        ctx.lineWidth = Math.random() * (canvas.width * 0.01) + 1;
        ctx.stroke();
    }
}
