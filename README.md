# Projet Bootcamp Fisheye - Site Web pour Photographes Indépendants

## Introduction  
FishEye est un site web permettant aux photographes indépendants de présenter leurs travaux. Le client souhaite une refonte du site pour le moderniser, tout en mettant l'accent sur l'accessibilité. Ton objectif est de développer un prototype fonctionnel en HTML, CSS et JavaScript, avec une priorité sur l'accessibilité.

## Objectifs du Projet
- **Créer un prototype fonctionnel** pour FishEye, utilisant HTML, CSS et JavaScript.
- **Mettre en place des pages dynamiques** pour les photographes, chargées avec des données JSON.
- **Assurer l'accessibilité du site**, en permettant une navigation au clavier et une compatibilité avec les lecteurs d'écran.
- **Utiliser un pattern Factory Method** pour distinguer la gestion des médias (photos et vidéos).

## Fonctionnalités
- **Page d'accueil** : Liste des photographes avec un aperçu de leurs travaux (photos et vidéos).
- **Page de photographe** : Affiche les informations détaillées de chaque photographe (nom, portfolio, description) en utilisant des données JSON.
- **Accessibilité** : Navigation optimisée pour les lecteurs d'écran et utilisation complète du clavier.
- **Gestion des médias** : Utilisation d'un pattern **Factory Method** pour gérer la création d'objets médias (photos et vidéos).

## Structure du Projet
Le projet est organisé comme suit :
- `index.html` : Page principale contenant la liste des photographes.
- `photographer.html` : Page dynamique générée pour chaque photographe.
- `css/` : Dossier contenant les fichiers CSS pour le style global du site.
- `js/` : Dossier contenant les fichiers JavaScript pour la logique dynamique et la gestion des données JSON.
- `data/` : Fichier JSON contenant les informations des photographes (nom, portfolio, etc.).
- `images/` : Dossier avec les images et vidéos utilisées sur le site.

## Technologies Utilisées
- **HTML5** : Pour structurer le contenu des pages.
- **SC** : Pour le style et la mise en page responsive.
- **JavaScript (ES6)** : Pour rendre les pages dynamiques et charger les données JSON.
- **Pattern Factory Method** : Utilisé pour gérer la création des objets médias (photos et vidéos).
- **WCAG (Web Content Accessibility Guidelines)** : Respect des directives d'accessibilité pour une meilleure expérience utilisateur.


## Installation

Décrivez les étapes nécessaires pour installer votre projet. Par exemple :

1. Clonez ce dépôt : `git clone https://github.com/Vanda89/Fisheye.git`
2. Installez les dépendances : `npm install`
3. Lancez le projet : `npm start`


