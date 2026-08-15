# 🔢 Algorithme de Kaprekar

Ce projet est une application web qui simule l’algorithme de Kaprekar (6174) sur des nombres à 4 chiffres.

## 📌 Principe

- L’utilisateur saisit un nombre à 4 chiffres
- Les chiffres sont triés :
  - ordre décroissant → nombre fort
  - ordre croissant → nombre faible
- On effectue : **fort - faible**
- Le processus est répété jusqu’à atteindre **6174** ou une condition d’arrêt

## 🧪 Exemple

9812 - 1289 = 8523  
8532 - 2358 = 6174

## 🚀 Fonctionnalités

- Saisie d’un nombre à 4 chiffres
- Validation des entrées :
  - exactement 4 chiffres
  - uniquement des caractères numériques
- Calcul automatique de l’algorithme de Kaprekar
- Affichage des étapes dans un tableau HTML
- Détection des cas spéciaux :
  - chiffres identiques
  - convergence vers 6174
  - limite de sécurité (20 itérations)

## 🛠️ Technologies

- HTML
- CSS
- JavaScript (Vanilla)

## 📂 Structure

/index.html  
/Style/main.css  
/JavaScript/main.js
/ScreenCite

## 🎯 Objectif pédagogique

Ce projet permet de comprendre :

- les conditions (`if`, `switch`)
- les boucles (`while`)
- la manipulation des chaînes (`split`, `padStart`)
- les tableaux (`sort`, `map`)
- la logique algorithmique
- la manipulation du DOM

## ⚠️ Règles

- Entrée obligatoire : 4 chiffres
- Les caractères non numériques sont refusés
- Certains cas ne convergent pas vers 6174
- Sécurité : maximum 20 itérations

## 👨‍💻 Auteur KiirrA

Projet réalisé dans le cadre de l’apprentissage JavaScript.
