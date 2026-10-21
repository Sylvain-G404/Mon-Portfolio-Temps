# Objectif du Projet : Fond d'écran Pixel Dynamique (Application de Bureau)

L'objectif est de créer une application de bureau interactive et immersive servant de fond d'écran ou d'économiseur d'écran animé, offrant un rendu visuel fluide axé sur des transitions de couleurs géométriques et des motifs pixélisés (style Matrix moderne/chill).

## 🛠️ Stack Technique & Architecture

- **Moteur Graphique :** Canvas HTML5 (JavaScript Vanilla / pur) piloté par une boucle d'animation haute performance (`requestAnimationFrame`) pour garantir du 60 FPS constant sans saturer le processeur.
- **Encapsulation Desktop :** **Tauri** (Framework basé sur Rust utilisant Edge WebView2) pour compiler le code web dans un exécutable Windows (`.exe`) ultra-léger (environ 4-5 Mo) et optimisé pour tourner en arrière-plan.
- **Interface utilisateur (UI) :** HTML5 / CSS3 natif pour le panneau de contrôle, utilisant des fonctionnalités modernes comme `backdrop-filter: blur()` pour créer un menu escamotable au design épuré et semi-transparent.
- **Librairie Tierce (Design) :** **Iro.js** pour intégrer une roue chromatique (Color Picker circulaire) multi-sélections avancée.

## 🎛️ Fonctionnalités & Logique Algorithmique

### 1. Contrôle de la Grille (3 Modes de Rendu Indépendants)

L'utilisateur doit pouvoir modifier la structure de la grille via l'interface selon trois curseurs (inputs) bien distincts :

- **Axe des Colonnes :** Un curseur pour modifier le nombre de colonnes de manière totalement indépendante (permet de créer de grandes bandes verticales si le nombre de lignes est au minimum).
- **Axe des Lignes :** Un curseur pour modifier le nombre de lignes de manière totalement indépendante (permet de créer des bandes horizontales si le nombre de colonnes est au minimum).
- **Mode Carrés Parfaits :** Un curseur unique qui lie les deux axes en même temps. Si l'utilisateur choisit "30", le script applique automatiquement 30 lignes ET 30 colonnes, garantissant que le motif reste composé de carrés parfaits.

### 2. Système Avancé de Gestion des Couleurs (Format HSL requis)

La gestion des couleurs utilisera obligatoirement le format **HSL** (Hue, Saturation, Lightness) pour assurer des transitions fluides.

- **Mode Global :** Mode arc-en-ciel / transition automatique sur les 360 degrés de la teinte (Hue).
- **Sélection personnalisée :** Possibilité de cocher/sélectionner plusieurs teintes spécifiques via la roue chromatique Iro.js pour restreindre la palette.
- **Option "Couleur Fixe" vs "Couleur Flexible" :**
  - _Fixe :_ Les carrés adoptent scrupuleusement la ou les valeurs sélectionnées par l'utilisateur.
  - _Flexible :_ Le script applique une variation aléatoire contrôlée (ex: +/- 20%) sur les paramètres de _Luminosité_ (Lightness) ou de _Saturation_ de la teinte choisie, créant un dégradé de nuances vivantes et texturées sans déborder sur les autres couleurs.

### 3. Ergonomie & HUD Masqué (Mode Immersif)

- **Comportement par défaut :** Au lancement, l'application est en plein écran et le HUD (panneau de paramètres) est totalement invisible pour laisser le visuel occuper 100% de l'espace.
- **Contrôle Clavier :** L'ouverture et la fermeture (en fondu ou glissement de panneau CSS) de l'interface des paramètres sont déclenchées par l'écoute d'une touche dédiée du clavier, par exemple la touche **`P`** ou **`Échap`**.

---

# 🪐 NeoMatrix Engine

Un moteur graphique interactif et futuriste développé en **Canvas HTML5 / JavaScript**, propulsé sous forme d'application de bureau native Windows grâce à **Tauri 2** et **Rust**.

![Version](https://shields.io)
![Platform](https://shields.io)
![Framework](https://shields.io)

## 🚀 Fonctionnalités

- **Rendu Canvas Haute Performance :** Gestion fluide des structures de lignes et de formes dynamiques.
- **HUD de Configuration :** Panneau de contrôle latéral permettant d'ajuster en temps réel les dimensions et les axes d'affichage.
- **Autonome & Léger :** Grâce à Tauri, l'exécutable final pèse moins de 2 Mo et fonctionne sans aucune connexion internet.

## 🛠️ Structure du Projet

- `ui/` : Contient l'intégralité de l'interface utilisateur web (HTML, CSS, JavaScript et assets graphiques).
- `src-tauri/` : Configuration du moteur Rust et des paramètres de compilation pour l'application de bureau.

## 💻 Développement Local

### Prérequis

- [Rust & Cargo](https://rust-lang.org)
- Outils de compilation C++ (Visual Studio Build Tools)

### Lancer en mode développement

```cmd
cargo tauri dev
```

### Compiler l'installateur Windows (.exe)

```cmd
cargo tauri build
```

Les fichiers d'installation (.exe et .msi) seront générés automatiquement dans le dossier `src-tauri/target/release/bundle/`.
