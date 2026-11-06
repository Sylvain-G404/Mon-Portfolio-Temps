let audioContext = null;
let menuMusic = null;

// Variable pour gérer l'intervalle du battement de cœur
let heartInterval = null;

// ==========================================
// 🎛️ RÉGLAGE DU VOLUME DES EFFETS ET ALARMES
// ==========================================
const BEEP_VOLUME = 0.1;   // Volume des impacts et du compte à rebours (ex-0.1)
const ALARM_VOLUME = 0.015;  // Volume de l'alarme battement de cœur (ex-0.1)


// 1. Les bips d'impacts (Raquettes, Murs, Buts, Compte à rebours)
export function playAdvancedBeep(frequency, duration, type = 'square', customVolume = BEEP_VOLUME) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Application du volume choisi
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

    // Par défaut : rythme de l'IA (lent = 600ms)
    let intervalTime = 600; 
    let frequency = 80;

    // Si c'est le joueur qui est en danger, on passe en mode panique (rapide = 250ms)
    if (type === 'joueur') {
        intervalTime = 250;
        frequency = 110; // Fréquence légèrement plus haute pour la panique
    }

    heartInterval = setInterval(() => {
        // On passe ALARM_VOLUME ici pour contrôler la puissance du battement
        playAdvancedBeep(frequency, 0.15, 'sawtooth', ALARM_VOLUME);
    }, intervalTime);
}

export function stopDangerAlarm() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

// 3. Arrêt total
export function stopAmbientMusic() {
    stopDangerAlarm();
}

// 4. Musique du Menu Principal
export function startMenuMusic() {
    // Si la musique n'est pas encore créée, on l'instancie
    if (!menuMusic) {
        menuMusic = new Audio('Assets/Son/menu_theme.mp3');
        menuMusic.loop = true; // Permet de rejouer la musique en boucle
        menuMusic.volume = 0.05; // Volume à 5% pour ne pas exploser les oreilles du joueur
    }
    
    // On la lance uniquement si elle est en pause
    if (menuMusic.paused) {
        menuMusic.play().catch(error => {
            console.log("Lecture audio bloquée par le navigateur. Attend une interaction joueur.", error);
        });
    }
}

export function stopMenuMusic() {
    if (menuMusic) {
        menuMusic.pause();
        menuMusic.currentTime = 0; // On remet la musique au début
    }
}
