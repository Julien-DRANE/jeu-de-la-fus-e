// shared.js

// Initialisation du canvas et du contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables globales
const scaleFactor = 4 / 6;
let numberOfStars = 100;
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let initialRocket = {
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
let rocket = { ...initialRocket };
let obstacles = [];
let stars = [];
let planet = null;
let moon = null;
let score = 0;
let lives = 3;
let highScores = [];
let bonusHeart = null;
let elapsedTimeLevel1 = 0;  // Variable globale pour le niveau 1
let elapsedTimeLevel2 = 0;  // Variable globale pour le niveau 2

// Variables pour la gestion tactile
let touchActive = false;
let touchX = 0;
let touchY = 0;

// Charger les images
const rocketImage = new Image();
rocketImage.src = "rocket.png";

// Charger les images des obstacles
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png", "yaourt.png", "tarte.png", "soupe.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images du décor
const planetImage = new Image();
planetImage.src = "planet.png";

const moonImage = new Image();
moonImage.src = "lune.png";

const venusImage = new Image();
venusImage.src = "venus.png";
const marsImage = new Image();
marsImage.src = "mars.png";
const mercuryImage = new Image();
mercuryImage.src = "mercury.png";

// Charger les images des vies
const heartImage = new Image();
heartImage.src = "coeur.png";

// Charger les sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Fonctions partagées : Déplacement, génération et dessin des éléments, etc.

function moveRocket() {
    // Code de déplacement de la fusée
}

function drawRocket() {
    // Code de dessin de la fusée
}

function generateObstacle() {
    // Code de génération des obstacles
}

function updateObstacles() {
    // Code de mise à jour des obstacles
}

function drawObstacles() {
    // Code de dessin des obstacles
}

function detectCollision(obj1, obj2) {
    // Code de détection de collision
}

function generateStars() {
    // Code de génération des étoiles
}

function updateStars() {
    // Code de mise à jour des étoiles
}

function drawStars() {
    // Code de dessin des étoiles
}

// Autres fonctions supplémentaires pour la gestion des bonus, des vies, etc.
