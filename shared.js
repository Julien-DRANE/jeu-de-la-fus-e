// shared.js
// Centralisation des variables globales et des fonctions partagées

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

// Déclaration des variables globales avec `let` pour éviter les conflits
let rocket, obstacles, stars, planet, moon, currentPlanet, bonusHeart, lives, highScores, score;
let elapsedTime = 0, elapsedTimeLevel1 = 0, elapsedTimeLevel2 = 0;
let touchActive = false, touchX = 0, touchY = 0;

// Déclaration des images (assurez-vous que ces fichiers sont dans le même répertoire)
const rocketImage = new Image();
rocketImage.src = "rocket.png";

const planetImage = new Image();
planetImage.src = "planet.png";

const moonImage = new Image();
moonImage.src = "lune.png";

const heartImage = new Image();
heartImage.src = "coeur.png";

const venusImage = new Image();
venusImage.src = "venus.png";

const marsImage = new Image();
marsImage.src = "mars.png";

const mercuryImage = new Image();
mercuryImage.src = "mercury.png";

const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png", "yaourt.png", "tarte.png", "soupe.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Tableau des planètes pour le niveau 2 (après l'initialisation des images)
const planets = [venusImage, marsImage, mercuryImage];

// Chargement des sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Générer des étoiles aléatoires pour les niveaux 1 et 2
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

// Mettre à jour les positions des étoiles
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

// Générer la planète du niveau 1
function generatePlanet() {
    const width = 400 * scaleFactor;
    const height = 400 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    planet = {
        x: x,
        y: -800 * scaleFactor,
        width: width,
        height: height,
        speed: 0.5 * scaleFactor
    };
}

// Mettre à jour la position de la planète du niveau 1
function updatePlanet() {
    if (planet) {
        planet.y += planet.speed;
        if (planet.y > canvas.height) {
            planet = null;
        }
    } else {
        if (Math.random() < 0.002) {
            generatePlanet();
        }
    }
}

// Dessiner la planète du niveau 1
function drawPlanet() {
    if (planet) {
        ctx.drawImage(planetImage, planet.x, planet.y, planet.width, planet.height);
    }
}

// Mettre à jour la position de la lune
function updateMoon() {
    if (moon) {
        moon.y += moon.speed;
        if (moon.y > canvas.height) {
            moon = null;
        }
    }
}

// Déclarer les autres fonctions spécifiques du niveau 2 (comme `generatePlanetLevel2`, `updatePlanetLevel2`, etc.)
// Générer une planète pour le niveau 2
function generatePlanetLevel2() {
    const width = 400 * scaleFactor;
    const height = 400 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    currentPlanet = {
        image: planets[Math.floor(Math.random() * planets.length)], // Sélectionner une planète aléatoire
        x: x,
        y: -800 * scaleFactor, // Positionner la planète hors de l'écran
        width: width,
        height: height,
        speed: 0.5 * scaleFactor
    };
}

// Mettre à jour la position de la planète du niveau 2
function updatePlanetLevel2() {
    if (currentPlanet) {
        currentPlanet.y += currentPlanet.speed;
        if (currentPlanet.y > canvas.height) {
            currentPlanet = null;
        }
    } else {
        if (Math.random() < 0.002) {
            generatePlanetLevel2();
        }
    }
}

// Dessiner la planète du niveau 2
function drawPlanetLevel2() {
    if (currentPlanet) {
        ctx.drawImage(currentPlanet.image, currentPlanet.x, currentPlanet.y, currentPlanet.width, currentPlanet.height);
    }
}

// Générer les obstacles
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
