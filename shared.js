// shared.js
// Centralisation des variables globales et des fonctions partagées

// Initialisation du canvas et du contexte (déclaration unique)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables globales
const scaleFactor = 4 / 6;
let numberOfStars = 100;
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;

// Initialisation des variables globales partagées
let rocket, obstacles, stars, planet, moon, currentPlanet, bonusHeart, lives, highScores, score;
let elapsedTime = 0, elapsedTimeLevel1 = 0, elapsedTimeLevel2 = 0;
let touchActive = false, touchX = 0, touchY = 0;

// Définir initialRocket et initialiser rocket (déclaration unique)
const initialRocket = {
    x: canvas.width / 2 - (25 * scaleFactor),
    y: canvas.height - (150 * scaleFactor),
    width: 50 * scaleFactor,
    height: 100 * scaleFactor,
    dx: 0,
    dy: 0,
    acceleration: 1.5 * scaleFactor,
    maxSpeed: 15 * scaleFactor,
    friction: 0.93
};

// Initialiser la fusée avec la position initiale
rocket = { ...initialRocket };

// Chargement des images (déclaration unique)
const rocketImage = new Image();
rocketImage.src = "rocket.png";

const planetImage = new Image();
planetImage.src = "planet.png";

const moonImage = new Image();
moonImage.src = "lune.png";

const heartImage = new Image();
heartImage.src = "coeur.png";

// Images des planètes pour le niveau 2
const venusImage = new Image();
venusImage.src = "venus.png";

const marsImage = new Image();
marsImage.src = "mars.png";

const mercuryImage = new Image();
mercuryImage.src = "mercury.png";

// Initialisation des planètes (après déclaration des images)
const planets = [venusImage, marsImage, mercuryImage];

// Chargement des sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Initialisation des obstacles (après déclaration de toutes les images)
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png", "yaourt.png", "tarte.png", "soupe.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Fonctions partagées
function generateStars() {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        const size = (Math.random() * 3 + 1) * scaleFactor;
        const speed = size / 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        stars.push({ x, y, size, speed });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Autres fonctions partagées (génération et mise à jour des obstacles, planètes, etc.)
