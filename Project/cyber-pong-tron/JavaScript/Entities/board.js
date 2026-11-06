// JavaScript/Entities/board.js

export class Board {
    constructor(canvas) {
        this.canvas = canvas;
    }

    render(ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // ==========================================
        // 1. LA GRILLE CYBER QUADRILLÉE (STYLE SÉCURISÉ AAA)
        // ==========================================
        ctx.save();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.07)"; // Un poil plus discret (7%) pour ne pas fatiguer les yeux
        ctx.lineWidth = 1;

        // A. Les lignes verticales régulières (Pas de perspective, espacement fixe !)
        const stepX = 80; // Largeur de chaque carré de la grille
        for (let x = 0; x <= w; x += stepX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // B. Les lignes horizontales régulières (Espacement fixe !)
        const stepY = 80; // Hauteur de chaque carré de la grille
        for (let y = 0; y <= h; y += stepY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        ctx.restore();

        // ==========================================
        // 2. LE FILET CENTRAL CLASSIQUE
        // ==========================================
        ctx.save();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.4)"; 
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]); // On remet tes super pointillés rétro !

        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.restore();
    }
}
