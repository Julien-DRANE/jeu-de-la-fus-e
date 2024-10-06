// shared.js
// Centralisation des images, sons, variables globales, et fonctions partagées

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

const rocketImage = new Image();
rocketImage.src = "rocket.png";
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images des objets
const planetImage = new Image();
planetImage.src = "planet.png";
const moonImage = new Image();
moonImage.src = "lune.png";
const heartImage = new Image();
heartImage.src = "coeur.png";

// Charger les sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Fonction pour dessiner la fusée
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Fonction pour dessiner les obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

// Détection de collision
function detectCollision(obj1, obj2) {
    if (!obj2) return false;

    const obj1CenterX = obj1.x + obj1.width / 2;
    const obj1CenterY = obj1.y + obj1.height / 2;
    const obj2CenterX = obj2.x + obj2.size / 2;
    const obj2CenterY = obj2.y + obj2.size / 2;

    const deltaX = obj1CenterX - obj2CenterX;
    const deltaY = obj1CenterY - obj2CenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const collisionThreshold = (obj1.width / 2) + (obj2.size / 2) + (30 * scaleFactor);

    return distance < collisionThreshold;
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

// Gérer les événements tactiles
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

let touchActive = false;
let touchX = 0;
let touchY = 0;

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchActive = true;
    touchX = touch.clientX;
    touchY = touch.clientY;
    e.preventDefault();
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    e.preventDefault();
}

function handleTouchEnd(e) {
    touchActive = false;
}

// Fonction pour mettre à jour la position de la fusée vers le doigt
function updateRocketPosition() {
    const centerX = rocket.x + rocket.width / 2;
    const centerY = rocket.y + rocket.height / 2;

    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const deadZone = 10 * scaleFactor;

    if (distance > deadZone) {
        const angle = Math.atan2(deltaY, deltaX);
        const moveX = Math.cos(angle) * followSpeed;
        const moveY = Math.sin(angle) * followSpeed;

        rocket.x += moveX;
        rocket.y += moveY;
    }
}
