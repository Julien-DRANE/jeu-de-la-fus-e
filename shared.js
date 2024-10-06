// shared.js
// Centralisation des fonctions et variables globales

// Canvas et contexte
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
let elapsedTime = 0;
let elapsedTimeLevel1 = 0;  // Temps spécifique au niveau 1
let elapsedTimeLevel2 = 0;  // Temps spécifique au niveau 2
let score = 0;
let lives = 3;

// Charger les images
const rocketImage = new Image();
rocketImage.src = "rocket.png";

// Charger les images des obstacles
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images du décor
const planetImage = new Image();
planetImage.src = "planet.png";

const moonImage = new Image();
moonImage.src = "lune.png";

// Charger les sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Fonction pour générer des étoiles aléatoires
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

// Fonction pour mettre à jour les étoiles
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Fonction pour dessiner les étoiles
function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Fonction de déplacement de la fusée
function moveRocket() {
    rocket.dx *= rocket.friction;
    rocket.dy *= rocket.friction;

    if (rocket.dx > rocket.maxSpeed) rocket.dx = rocket.maxSpeed;
    if (rocket.dx < -rocket.maxSpeed) rocket.dx = -rocket.maxSpeed;
    if (rocket.dy > rocket.maxSpeed) rocket.dy = rocket.maxSpeed;
    if (rocket.dy < -rocket.maxSpeed) rocket.dy = -rocket.maxSpeed;

    rocket.x += rocket.dx;
    rocket.y += rocket.dy;

    if (rocket.x < 0) rocket.x = 0;
    if (rocket.x + rocket.width > canvas.width) rocket.x = canvas.width - rocket.width;
    if (rocket.y < 0) rocket.y = 0;
    if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
}

// Autres fonctions de gestion des obstacles, décor et gestion du jeu...
