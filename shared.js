// shared.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scaleFactor = 4 / 6; 

// Variables globales
let numberOfStars = 100; 
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let initialRocket = { x: canvas.width / 2 - (25 * scaleFactor), y: canvas.height - (150 * scaleFactor), width: 50 * scaleFactor, height: 100 * scaleFactor, dx: 0, dy: 0, acceleration: 1.5 * scaleFactor, maxSpeed: 15 * scaleFactor, friction: 0.93 };
let rocket = { ...initialRocket };
let obstacles = [];
let stars = [];
let venusImage = new Image();
let marsImage = new Image();
let mercuryImage = new Image();
venusImage.src = "venus.png";
marsImage.src = "mars.png";
mercuryImage.src = "mercury.png";

// Gestion des interactions tactiles
let touchActive = false;
let touchX = 0;
let touchY = 0;

// Gestion des événements tactiles
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

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

// Ajouter d'autres fonctions comme generateStars, loadHighScores, etc.
