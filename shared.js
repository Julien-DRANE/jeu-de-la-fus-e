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
let elapsedTime = 0;
let score = 0;
let lives = 3;
let highScores = [];
let bonusHeart = null;

// Variables pour la gestion tactile
let touchActive = false;
let touchX = 0;
let touchY = 0;

// Charger les images
const rocketImage = new Image();
rocketImage.src = "rocket.png";
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png", "yaourt.png", "tarte.png", "soupe.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});
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
const heartImage = new Image();
heartImage.src = "coeur.png";

// Charger les sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

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

// Générer des étoiles aléatoires
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

// Mettre à jour la position des étoiles
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Dessiner les étoiles
function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Déplacer la fusée
function moveRocket() {
    if (!touchActive) {
        rocket.dx *= rocket.friction;
        rocket.dy *= rocket.friction;

        if (rocket.dx > rocket.maxSpeed) rocket.dx = rocket.maxSpeed;
        if (rocket.dx < -rocket.maxSpeed) rocket.dx = -rocket.maxSpeed;
        if (rocket.dy > rocket.maxSpeed) rocket.dy = rocket.maxSpeed;
        if (rocket.dy < -rocket.maxSpeed) rocket.dy = -rocket.maxSpeed;

        rocket.x += rocket.dx;
        rocket.y += rocket.dy;
    }

    if (rocket.x < 0) rocket.x = 0;
    if (rocket.x + rocket.width > canvas.width) rocket.x = canvas.width - rocket.width;
    if (rocket.y < 0) rocket.y = 0;
    if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
}

// Dessiner la fusée
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Générer des obstacles
function generateObstacle() {
    const size = (Math.random() * 50 + 30) * scaleFactor;
    const x = Math.random() * (canvas.width - size);
    const speed = (Math.random() * 3 + 2) * obstacleSpeedMultiplier * scaleFactor;
    const imageIndex = Math.floor(Math.random() * obstacleImages.length);
    obstacles.push({ x, y: -size, size, speed, image: obstacleImages[imageIndex] });
}

// Mettre à jour les obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            continue;
        }
        if (detectCollision(rocket, obstacle)) {
            obstacles.splice(i, 1);
            lives -= 1;

            collisionSound.currentTime = 0;
            collisionSound.play();

            if (lives <= 0) {
                score = elapsedTime / 10;
                displayGameOver();
                break;
            }
        }
    }
}

// Dessiner les obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

// Détecter les collisions entre la fusée et les obstacles
function detectCollision(obj1, obj2) {
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

// Charger les meilleurs scores depuis le localStorage
function loadHighScores() {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
}

// Enregistrer les meilleurs scores dans le localStorage
function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Afficher l'écran de fin de jeu
function displayGameOver() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(difficultyInterval);
    clearInterval(timerInterval);
    clearInterval(bonusHeartInterval);
    clearTimeout(obstacleGenerationTimeout);

    canvas.style.display = "none";
    document.getElementById("startButton").style.display = "none";

    const gameOverScreen = document.getElementById("gameOverScreen");
    const scoreDisplay = document.getElementById("scoreDisplay");
    gameOverScreen.style.display = "block";
    scoreDisplay.innerText = `Votre score : ${score.toFixed(1)}s`;

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    document.getElementById("restartButton").style.display = "none";

    document.getElementById("submitScoreButton").onclick = submitScore;

    document.getElementById("restartButton").onclick = function() {
        gameOverScreen.style.display = "none";
        startGame();
    };
}
