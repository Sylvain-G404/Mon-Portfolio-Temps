const soleil = document.querySelector('.soleil');

// Configuration des positions et tailles du soleil
const morning = { right: -100, y: -50, size: 25 };
const noon    = { right: 200,  y: 50,  size: 100 };
const evening = { right: -100, y: 105, size: 35 };

// Tableau des couleurs de fond pour le cycle de la journée
const colors = [
    { position: 0,    background: '#10182F' },
    { position: 0.10, background: '#4F86C6' },
    { position: 0.5,  background: '#87BCE8' },
    { position: 0.80, background: '#3F6FAD' },
    { position: 0.85, background: '#3F6FAD' },
    { position: 1,    background: '#10182F' }
];

// Outil d'interpolation linéaire (LERP)
function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

// Calcule la transition de couleur entre deux codes Hexadécimaux
function interpolateColor(color1, color2, progress) {
    const a = color1.match(/\w\w/g).map(value => parseInt(value, 16));
    const b = color2.match(/\w\w/g).map(value => parseInt(value, 16));

    const result = a.map((value, index) => {
        return Math.round(lerp(value, b[index], progress));
    });

    return `rgb(${result.join(', ')})`;
}

// Détermine la couleur exacte du fond selon le pourcentage de scroll
function getBackgroundColor(progress) {
    for (let i = 0; i < colors.length - 1; i++) {
        const current = colors[i];
        const next = colors[i + 1];

        if (progress >= current.position && progress <= next.position) {
            const localProgress = (progress - current.position) / (next.position - current.position);
            return interpolateColor(current.background, next.background, localProgress);
        }
    }
    return colors[colors.length - 1].background;
}

// Analyse la clarté du fond pour adapter la couleur du texte automatiquement (Luminance)
function updateTextColor() {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    const rgb = bg.match(/\d+/g).map(Number);
    
    // Formule mathématique basée sur la perception de l'œil humain
    const luminance = (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
    
    // Si le fond est clair, texte noir. Sinon, texte blanc.
    document.body.style.color = luminance > 128 ? '#171717' : '#F8F5EE';
}

// Gère les mouvements du soleil et applique la couleur du ciel
function updateSun() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    // Sécurité au cas où la page n'a pas de défilement (hauteur trop petite)
    const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;

    let right, y, size;

    if (progress <= 0.5) {
        const localProgress = progress / 0.5;
        right = lerp(morning.right, noon.right, localProgress);
        y     = lerp(morning.y, noon.y, localProgress);
        size  = lerp(morning.size, noon.size, localProgress);
    } else {
        const localProgress = (progress - 0.5) / 0.5;
        right = lerp(noon.right, evening.right, localProgress);
        y     = lerp(noon.y, evening.y, localProgress);
        size  = lerp(noon.size, evening.size, localProgress);
    }

    // Application des styles au soleil
    soleil.style.right = `${right}px`;
    soleil.style.top = `${y}%`;
    soleil.style.width = `${size}px`;
    soleil.style.height = `${size}px`;

    // Application de la couleur du ciel
    document.body.style.backgroundColor = getBackgroundColor(progress);

    // Ajustement automatique de la couleur de police
    updateTextColor();
}

// Écouteur de défilement optimisé (Zéro lag / Anti-alerte Firefox)
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateSun();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Initialisation au chargement de la page
updateSun();

/* --------------------------------------------------------- */
/* ANIMATION SOURIS : ÉTOILES FILANTES                      */
/* --------------------------------------------------------- */

window.addEventListener('mousemove', (e) => {
    creerEtoile(e.clientX, e.clientY);
});

function creerEtoile(x, y) {
    const etoile = document.createElement('div');
    etoile.classList.add('etoile-filante');
    
    etoile.style.left = `${x}px`;
    etoile.style.top = `${y}px`;
    
    // Taille aléatoire entre 15px et 25px
    const taille = Math.random() * 10 + 15; 
    etoile.style.width = `${taille}px`;
    etoile.style.height = `${taille}px`;

    document.body.appendChild(etoile);

    // Nettoyage automatique du DOM après l'animation CSS (0.6s)
    setTimeout(() => {
        etoile.remove();
    }, 600);
}
