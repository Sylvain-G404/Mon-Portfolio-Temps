// --- STRUCTURE ET PARAMÈTRES DU STICKMAN ---
const player = {
    x: 100,
    y: 400,
    size: 90,
    tailleInitiale: 90, // On stocke la taille normale
    accroupi: false,
    color: '#000000',
    etat: 'idle',
    direction: 1,
    animationTimer: 0,
    
    // VARIABLES PHYSIQUES
    velocityY: 0,
    gravite: 0.6,
    forceSaut: -12,
    auSol: false,
     auSol: false,
    sautBoutonRelâché: true,
    // --- NOUVEAU ---
    score: 0 // Nombre de pièces collectées
};

function dessinerStickman(ctx, p, enMarche) {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.fillStyle = p.color;

    const headRadius = p.size * 0.15;
    const bodyHeight = p.size * 0.35;
    
    const headX = p.x - camera.x;
    const headY = p.y - p.size + headRadius;

    // Tête
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Regard
    const eyeOffsetX = headX + (headRadius * 0.4 * p.direction);
    const eyeOffsetY = headY - (headRadius * 0.1);
    const eyeRadius = 2.5;
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Tronc
    const neckY = headY + headRadius;
    const pelvisY = neckY + bodyHeight;
    ctx.beginPath();
    ctx.moveTo(headX, neckY);
    ctx.lineTo(headX, pelvisY);
    ctx.stroke();

    ctx.beginPath();

    if (!p.auSol) {
        // En l'air
        const inclinaisonBras = p.velocityY * 2; 
        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX - (25 * p.direction), neckY - 10 + inclinaisonBras);
        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX + (20 * p.direction), neckY - 15 + inclinaisonBras);

        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX - (10 * p.direction), pelvisY + 15);
        ctx.lineTo(headX - (5 * p.direction), p.y - 10);
        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX + (10 * p.direction), pelvisY + 12);
        ctx.lineTo(headX + (15 * p.direction), p.y - 5);

    } else if (p.accroupi) {
        // Accroupi (Marche ou Statique)
        const oscillationAccroupi = enMarche ? Math.sin(p.animationTimer * 0.2) * 4 : 0;

        ctx.moveTo(headX, neckY + 3);
        ctx.lineTo(headX - (8 * p.direction), pelvisY - 2);
        ctx.moveTo(headX, neckY + 3);
        ctx.lineTo(headX + (8 * p.direction), pelvisY - 2);

        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX - (12 * p.direction) + (oscillationAccroupi * p.direction), pelvisY + 8);
        ctx.lineTo(headX - (4 * p.direction), p.y);
        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX + (12 * p.direction) - (oscillationAccroupi * p.direction), pelvisY + 8);
        ctx.lineTo(headX + (4 * p.direction), p.y);

    } else if (p.etat === 'idle') {
        // Statique debout
        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX - (15 * p.direction), neckY + 25);
        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX + (15 * p.direction), neckY + 28);

        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX - 18, p.y);
        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX + 18, p.y);

    } else if (p.etat === 'walk') {
        // Marche debout
        const oscillation = Math.sin(p.animationTimer * 0.15); 
        const amplitudeJambes = 25; 
        const amplitudeBras = 22;   

        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX + (oscillation * amplitudeJambes * p.direction), p.y);
        ctx.moveTo(headX, pelvisY);
        ctx.lineTo(headX - (oscillation * amplitudeJambes * p.direction), p.y);

        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX - (oscillation * amplitudeBras * p.direction), neckY + 25);
        ctx.moveTo(headX, neckY + 5);
        ctx.lineTo(headX + (oscillation * amplitudeBras * p.direction), neckY + 25);
    }

    ctx.stroke();
}

