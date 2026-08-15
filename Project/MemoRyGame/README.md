# 🧠 MemoRyGame

Un jeu de mémoire en JavaScript où le joueur doit retrouver des paires de cartes en minimisant son score.

Le projet a évolué d’une version simple de cartes statiques vers une V2 avec logique de jeu complète, score, combo, animations et gestion du son.

---

## 🎮 Objectif du jeu

Retrouver les paires de cartes en faisant le moins de points possible.

- Chaque clic révèle une carte
- Deux cartes sont comparées
- Si elles correspondent → match
- Sinon → elles se retournent

---

## 🧩 Règles de jeu

### ✔ Match valide

- Même valeur
- Même famille (rouge / noir)

### ❌ Match invalide

- +1 point
- combo reset

---

## 🔥 Système de score

- ❌ Erreur → +1 point
- ✔ Match → combo augmente
- 🔥 Combo ≥ 2 → -1 point par match consécutif
- 💀 Combo reset → retour normal

👉 Objectif : obtenir le score le plus bas possible

---

## 🔊 Système son

- Son de flip sur interaction
- Activation uniquement après interaction utilisateur
- Toggle ON/OFF disponible

---

## 📁 Structure du projet

```bash
MemoRyGame/
│
├── index.html
│
├── Style/
│   ├── style.css
│   ├── main.css
│   ├── table.css
│   └── carte.css
│
├── JavaScript/
│   ├── class.js        # Carte + Deck (logique métier)
│   ├── main.js         # logique du jeu + interaction DOM
│   └── songCarte.js    # gestion du son
│
├── Sounds/
│   └── flipcard.mp3
│
├── ScreenCite/
│   └── captures du jeu / interface
│
└── README.md
```

## 🧠 Architecture

### class.js

Contient la logique métier du jeu :

- `Carte`
  - valeur
  - couleur
  - famille (rouge / noir)
  - méthodes de comparaison :
    - `estMemeValeur()`
    - `estMemeFamille()`
    - `estMatch()`
  - génération HTML de la carte

- `Deck`
  - création du paquet de cartes
  - mélange des cartes (shuffle)

---

### main.js

Contient la logique principale du jeu :

- affichage des cartes dans le DOM
- gestion des clics utilisateur
- sélection des deux cartes (première / deuxième)
- gestion des états :
  - flip
  - matched
  - bloque
- comparaison des cartes
- gestion du score et du combo
- interaction globale avec le DOM

---

### songCarte.js

Contient la gestion du son :

- lecture du son de flip
- activation / désactivation via toggle
- protection anti spam audio
- contrôle de l’état sonore global

---

## 🚀 Évolutions futures (V3 / V4)

- ajout d’un menu options (3 tirets)
- personnalisation du jeu :
  - couleur du fond
  - dos des cartes
  - taille des cartes
- choix de difficulté :
  - facile
  - normal
  - difficile
- refactor du code :
  - séparation game / ui / settings
- amélioration des animations (flip + transitions)
- ajout de modes de jeu

---

## 👨‍💻 Auteur

KiirrA

```

```
"# MemoRyGame" 
