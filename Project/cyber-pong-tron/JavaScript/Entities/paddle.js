// JavaScript/Entities/paddle.js

export class Paddle {
    constructor(type, x, y, width, height, color, canvasWidth, canvasHeight) {
        this.type = type; // 'left' ou 'right'
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || "#00f0ff";

        // Stockage sécurisé des dimensions de l'arène
        this.canvasWidth = canvasWidth || 1600;
        this.canvasHeight = canvasHeight || 1000;

        // --- VITESSE ADAPTATIVE AAA ---
        // La raquette traverse la hauteur du terrain en 1.25 seconde
        this.speed = Math.floor(this.canvasHeight * 0.8); 
    }

    update(deltaTime, input, canvasWidth, canvasHeight) {
        // --- MOUVEMENTS UNIQUEMENT VERTICAUX (SUR Y) ---
        if (this.type === 'left') {
            if (input.isPressed('KeyW')) this.y -= this.speed * deltaTime;
            if (input.isPressed('KeyS')) this.y += this.speed * deltaTime;
        }

        if (this.type === 'right') {
            if (input.isPressed('ArrowUp')) this.y -= this.speed * deltaTime;
            if (input.isPressed('ArrowDown')) this.y += this.speed * deltaTime;
        }

        // Sécurité commune pour bloquer la raquette dans l'arène
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    render(ctx) {
        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // --- ARRONDI ADAPTATIF ---
        const borderRadius = Math.floor(this.height * 0.0625); 

        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, borderRadius); 
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}
