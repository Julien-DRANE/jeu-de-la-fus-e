// shared.js
// Fichier centralisé pour les fonctions, variables globales et gestion partagée

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

// Charger les images des planètes du niveau 2
const venusImage = new Image();
venusImage.src = "venus.png";

const marsImage = new Image();
marsImage.src = "mars.png";

const mercuryImage = new Image();
mercuryImage.src = "mercury.png";

// Charger les sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

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

// Générer la planète
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

// Mettre à jour la position de la planète
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

// Dessiner la planète
function drawPlanet() {
    if (planet) {
        ctx.drawImage(planetImage, planet.x, planet.y, planet.width, planet.height);
    }
}

// Générer la lune
function generateMoon() {
    const width = 800 * scaleFactor;
    const height = 800 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    moon = {
        x: x,
        y: -1600 * scaleFactor,
        width: width,
        height: height,
        speed: 0.2 * scaleFactor
    };
}

// Mettre à jour la position de la lune
function updateMoon() {
    if (moon) {
        moon.y += moon.speed;
        if (moon.y > canvas.height) {
            moon = null;
        }
    } else {
        if (Math.random() < 0.001) {
            generateMoon();
        }
    }
}

// Dessiner la lune
function drawMoon() {
    if (moon) {
        ctx.drawImage(moonImage, moon.x, moon.y, moon.width, moon.height);
    }
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

// Détecter les collisions entre la fusée et les obstacles
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

// Dessiner la fusée
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
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

// (Vous pouvez ajouter d'autres fonctions spécifiques comme gérer les cœurs bonus, la transition des niveaux, etc.)
// shared.js

// Générer des étoiles rouges vifs et grises pour le niveau 2
function generateStarsLevel2() {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        const size = (Math.random() * 3 + 1) * scaleFactor;
        const speed = size / 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = Math.random() < 0.5 ? "red" : "gray"; // Étoiles rouges ou grises
        stars.push({ x, y, size, speed, color });
    }
}

// Mettre à jour les positions des étoiles du niveau 2
function updateStarsLevel2() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Dessiner les étoiles spécifiques au niveau 2
function drawStarsLevel2() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color; // Utiliser la couleur (rouge ou grise)
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}
