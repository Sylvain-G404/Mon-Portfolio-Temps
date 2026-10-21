// ==========================================
// 1. CONFIGURATION ET VARIABLES DE LA GRILLE
// ==========================================
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

let gridSettings = {
    columns: 20,       
    rows: 20,          
    perfectSquares: false,
    colorMode: 'rainbow',
    colorBehavior: 'flexible',
    globalBrightness: 100, 
    
    customPalette: [
        { h: 0, s: 100, l: 50 },   // Échantillon 1 : Rouge
        { h: 120, s: 100, l: 50 }, // Échantillon 2 : Vert
        { h: 240, s: 100, l: 50 }  // Échantillon 3 : Bleu
    ]
};

let pixelGrid = [];

function initPixelGrid() {
    pixelGrid = []; 

    for (let r = 0; r < gridSettings.rows; r++) {
        for (let c = 0; c < gridSettings.columns; c++) {
            const randomSwatchIndex = Math.floor(Math.random() * 3);
            const sizeVariation = Math.random() * 20 - 10; 

            pixelGrid.push({
                row: r,
                col: c,
                swatchIndex: randomSwatchIndex,
                satOffset: sizeVariation,
                lightOffset: sizeVariation,

                // Pulsation de lumière
                time: Math.random() * Math.PI * 2, 
                pulseSpeed: 0.02 + Math.random() * 0.04, 

                // 4 phases et 4 vitesses pour CHAQUE coin du pixel
                shapeTimeTL: Math.random() * Math.PI * 2, 
                shapeTimeTR: Math.random() * Math.PI * 2, 
                shapeTimeBR: Math.random() * Math.PI * 2, 
                shapeTimeBL: Math.random() * Math.PI * 2, 
                
                shapeSpeedTL: 0.01 + Math.random() * 0.02,
                shapeSpeedTR: 0.01 + Math.random() * 0.02,
                shapeSpeedBR: 0.01 + Math.random() * 0.02,
                shapeSpeedBL: 0.01 + Math.random() * 0.02,
                
                speed: 0.5 + Math.random() * 1.5,
                hue: Math.random() * 360 
            });
        }
    }
}

// Synchro au chargement du DOM
window.addEventListener('DOMContentLoaded', syncHUDWithSettings);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

initPixelGrid();

// ==========================================
// 2. BOUCLE D'ANIMATION (60 FPS STABLE)
// ==========================================
let lastTime = 0;

function animationLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / gridSettings.columns;
    const cellHeight = canvas.height / gridSettings.rows;

    pixelGrid.forEach(pixel => {
        let finalHue, finalSaturation, finalLightness;

        // Gestion de la couleur selon le mode sélectionné
        if (gridSettings.colorMode === 'rainbow') {
            pixel.hue += pixel.speed;
            if (pixel.hue >= 360) pixel.hue = 0;
            
            finalHue = pixel.hue;
            finalSaturation = 95;
            finalLightness = 55;
            pixel.opacity = 0.50;
        } else {
            const baseColor = gridSettings.customPalette[pixel.swatchIndex];
            finalHue = baseColor.h;
            finalSaturation = baseColor.s;
            finalLightness = baseColor.l;

            pixel.time += pixel.pulseSpeed;
            let targetOpacity = (Math.sin(pixel.time) + 1) / 2;
            pixel.opacity = targetOpacity * 0.85; 
        }

        const x = pixel.col * cellWidth;
        const y = pixel.row * cellHeight;

        // Application de la luminosité Jour / Nuit
        finalLightness = finalLightness * (gridSettings.globalBrightness / 100);
        finalLightness = Math.max(0, Math.min(100, finalLightness));

        // Progression de l'animation des 4 coins indépendamment
        pixel.shapeTimeTL += pixel.shapeSpeedTL;
        pixel.shapeTimeTR += pixel.shapeSpeedTR;
        pixel.shapeTimeBR += pixel.shapeSpeedBR;
        pixel.shapeTimeBL += pixel.shapeSpeedBL;
        
        const maxRadius = Math.min(cellWidth, cellHeight) / 2; 

        // Calcul des 4 rayons uniques
        const radiusTL = maxRadius * ((Math.sin(pixel.shapeTimeTL) + 1) / 2);
        const radiusTR = maxRadius * ((Math.sin(pixel.shapeTimeTR) + 1) / 2);
        const radiusBR = maxRadius * ((Math.sin(pixel.shapeTimeBR) + 1) / 2);
        const radiusBL = maxRadius * ((Math.sin(pixel.shapeTimeBL) + 1) / 2);

        const borderRadiusArray = [radiusTL, radiusTR, radiusBR, radiusBL];
        const borderInnerArray = borderRadiusArray.map(r => r > 1 ? r - 1 : 0);

        // 1. DESSIN DU CONTOUR ASYMÉTRIQUE
        ctx.strokeStyle = `hsla(${finalHue}, ${finalSaturation}%, 30%, ${pixel.opacity * 0.5})`; 
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, cellWidth, cellHeight, borderRadiusArray);
        ctx.stroke();

        // 2. DESSIN DU FOND ASYMÉTRIQUE
        ctx.fillStyle = `hsla(${finalHue}, ${finalSaturation}%, ${finalLightness}%, ${pixel.opacity})`;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2, borderInnerArray);
        ctx.fill();
    });

    requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);

// ==========================================
// 3. GESTION DU HUD (MENU INTERACTIF)
// ==========================================
const hud = document.getElementById('hud');
window.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
        hud.classList.toggle('visual-hidden');
    }
});

// ==========================================
// 4. INTERCONNEXION DU HUD ET DE LA GRILLE
// ==========================================
const columnsInput = document.getElementById('columnsInput');
const columnsVal = document.getElementById('columnsVal');
const rowsInput = document.getElementById('rowsInput');
const rowsVal = document.getElementById('rowsVal');
const perfectSquaresInput = document.getElementById('perfectSquaresInput');

const colorModeSelect = document.getElementById('colorModeSelect');
const colorBehaviorSelect = document.getElementById('colorBehaviorSelect');
const pickerContainer = document.getElementById('pickerContainer');

// Curseurs Sliders de dimension
columnsInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    gridSettings.columns = val;
    columnsVal.textContent = val;

    if (gridSettings.perfectSquares) {
        const screenRatio = window.innerWidth / window.innerHeight;
        const idealRows = Math.round(val / screenRatio);
        
        gridSettings.rows = idealRows;
        rowsInput.value = idealRows;
        rowsVal.textContent = idealRows;
    }
    initPixelGrid();
});

rowsInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    gridSettings.rows = val;
    rowsVal.textContent = val;

    if (gridSettings.perfectSquares) {
        const screenRatio = window.innerWidth / window.innerHeight;
        const idealCols = Math.round(val * screenRatio);
        
        gridSettings.columns = idealCols;
        columnsInput.value = idealCols;
        columnsVal.textContent = idealCols;
    }
    initPixelGrid();
});

perfectSquaresInput.addEventListener('change', (e) => {
    gridSettings.perfectSquares = e.target.checked;
    
    if (gridSettings.perfectSquares) {
        const screenRatio = window.innerWidth / window.innerHeight;
        const idealRows = Math.round(gridSettings.columns / screenRatio);
        
        gridSettings.rows = idealRows;
        rowsInput.value = idealRows;
        rowsVal.textContent = idealRows;
    }
    initPixelGrid();
});

// Menus déroulants (Palette et Style)
colorModeSelect.addEventListener('change', (e) => {
    gridSettings.colorMode = e.target.value;
    
    if (gridSettings.colorMode === 'custom') {
        pickerContainer.classList.remove('visual-hidden');
    } else {
        pickerContainer.classList.add('visual-hidden');
    }
    initPixelGrid();
});

colorBehaviorSelect.addEventListener('change', (e) => {
    gridSettings.colorBehavior = e.target.value;
    initPixelGrid();
});

// Curseur Ambiance Jour / Nuit
const brightnessInput = document.getElementById('brightnessInput');
const brightnessVal = document.getElementById('brightnessVal');

brightnessInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    gridSettings.globalBrightness = val;
    brightnessVal.textContent = val + "%";
});


// ==========================================
// 5. INITIALISATION DU SÉLECTEUR IRO.JS & DES ÉCHANTILLONS
// ==========================================
let activeSwatchIndex = 0;

const swatches = [
    document.getElementById('swatch1'),
    document.getElementById('swatch2'),
    document.getElementById('swatch3')
];

let colorPicker = new iro.ColorPicker("#iroPicker", {
    width: 180,
    color: "hsl(0, 100%, 50%)", 
});

// Sélection des carrés
swatches.forEach((swatch, index) => {
    swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        activeSwatchIndex = index;
        
        const savedColor = gridSettings.customPalette[index];
        colorPicker.color.set(`hsl(${savedColor.h}, ${savedColor.s}%, ${savedColor.l}%)`);
    });
});

// Liaison avec la roue
colorPicker.on('color:change', function(color) {
    const currentHue = color.hsl.h;
    const currentSat = color.hsl.s;
    const currentLight = color.hsl.l;

    gridSettings.customPalette[activeSwatchIndex] = {
        h: currentHue,
        s: currentSat,
        l: currentLight
    };

    swatches[activeSwatchIndex].style.backgroundColor = color.hexString;

    if (gridSettings.colorMode === 'custom') {
        initPixelGrid();
    }
});

// ==========================================
// 6. SYNCHRONISATION INITIALE DU NAVIGATEUR
// ==========================================
function syncHUDWithSettings() {
    const screenRatio = window.innerWidth / window.innerHeight;

    gridSettings.perfectSquares = perfectSquaresInput.checked;

    const savedCols = parseInt(columnsInput.value);
    gridSettings.columns = savedCols;
    columnsVal.textContent = savedCols;

    if (gridSettings.perfectSquares) {
        const idealRows = Math.round(savedCols / screenRatio);
        gridSettings.rows = idealRows;
        rowsInput.value = idealRows;
        rowsVal.textContent = idealRows;
    } else {
        const savedRows = parseInt(rowsInput.value);
        gridSettings.rows = savedRows;
        rowsVal.textContent = savedRows;
    }

    gridSettings.colorBehavior = colorBehaviorSelect.value;

    const savedBrightness = parseInt(brightnessInput.value);
    gridSettings.globalBrightness = savedBrightness;
    brightnessVal.textContent = savedBrightness + "%";

    initPixelGrid();
    console.log("Structure et contrôles synchronisés à 100% !");
}
