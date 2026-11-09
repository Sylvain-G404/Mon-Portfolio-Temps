let audioContext = null;
let menuMusic = null;
let gameMusic = null; // 🎵 Ajout pour la musique de jeu
let endSound = null;  // 🔊 Ajout pour le son de victoire/défaite

// Variable pour gérer l'intervalle du battement de cœur
let heartInterval = null;

// ==========================================
// 🎛️ RÉGLAGE DU VOLUME DES EFFETS ET ALARMES
// ==========================================
const BEEP_VOLUME = 0.1;   // Volume des impacts et du compte à rebours
const ALARM_VOLUME = 0.015;  // Volume de l'alarme battement de cœur

// 1. Les bips d'impacts (Raquettes, Murs, Buts, Compte à rebours)
export function playAdvancedBeep(frequency, duration, type = 'square', customVolume = BEEP_VOLUME) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(customVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

export function playBeep(frequency, duration) {
    playAdvancedBeep(frequency, duration, 'square', BEEP_VOLUME);
}

// 2. L'alarme "BATTEMENT DE CŒUR" DYNAMIQUE
export function startDangerAlarm(type) {
    if (heartInterval) return;

    let intervalTime = 600; 
    let frequency = 80;

    if (type === 'joueur') {
        intervalTime = 250;
        frequency = 110; 
    }

    heartInterval = setInterval(() => {
        playAdvancedBeep(frequency, 0.15, 'sawtooth', ALARM_VOLUME);
    }, intervalTime);
}

export function stopDangerAlarm() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

// ==========================================
// 🎶 GESTION DES MUSIQUES ET ÉVÉNEMENTS (MP3)
// ==========================================

// Musique du Menu Principal
export function startMenuMusic() {
    if (!menuMusic) {
        menuMusic = new Audio('Assets/Son/menu_theme.mp3');
        menuMusic.loop = true;
        menuMusic.volume = 0.05;
    }
    if (menuMusic.paused) {
        menuMusic.play().catch(err => console.log("Audio bloqué : attend une interaction.", err));
    }
}

export function stopMenuMusic() {
    if (menuMusic) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }
}

// Musique de la partie (game_theme.mp3)
export function startGameMusic() {
    if (!gameMusic) {
        gameMusic = new Audio('Assets/Son/game_theme.mp3');
        gameMusic.loop = true;
        gameMusic.volume = 0.05; // Ajuste selon tes préférences
    }
    if (gameMusic.paused) {
        gameMusic.play().catch(err => console.log("Audio de jeu bloqué.", err));
    }
}

export function stopGameMusic() {
    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }
}

// Sons de fin de partie (Victoire / Défaite selon la difficulté)
// 'victory' ou 'defeat' | 'eazy', 'hard', 'hardcore'
export function playEndSound(status, difficulty) {
    // On arrête d'abord un éventuel son de fin déjà en cours
    stopEndSound(); 
    
    const filePath = `Assets/Son/${status}_${difficulty}.mp3`;
    endSound = new Audio(filePath);
    endSound.volume = 0.1;
    
    endSound.play().catch(err => console.log("Erreur lecture son de fin.", err));
}

export function stopEndSound() {
    if (endSound) {
        endSound.pause();
        endSound.currentTime = 0;
        endSound = null;
    }
}

// 3. Arrêt total révisé pour tout nettoyer d'un coup
export function stopAmbientMusic() {
    stopDangerAlarm();
    stopMenuMusic();
    stopGameMusic();
    stopEndSound();
}
