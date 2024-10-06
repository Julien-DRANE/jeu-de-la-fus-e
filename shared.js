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

// Initialisation des variables globales partagées
let rocket, obstacles, stars, planet, moon, currentPlanet, bonusHeart, lives, highScores, score;
let elapsedTime = 0, elapsedTimeLevel1 = 0, elapsedTimeLevel2 = 0;
let touchActive = false, touchX = 0, touchY = 0;

// Définir initialRocket et initialiser rocket
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
rocket = { ...initialRocket };

// Chargement des images
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

const planets = [venusImage, marsImage, mercuryImage]; // Planètes pour le niveau 2

// Chargement des sons
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Initialisation des obstacles
const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png", "yaourt.png", "tarte.png", "soupe.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Générer des étoiles aléatoires pour le niveau 1
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

// Générer des étoiles spécifiques pour le niveau 2 (étoiles rouges et grises)
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

// Générer la lune pour le niveau 1
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

// Mettre à jour et dessiner les étoiles, planètes et obstacles (fonctions existantes)
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
        ctx.fillStyle = star.color || "rgba(255, 255, 255, 0.8)"; // Blanc pour le niveau 1, rouge ou gris pour le niveau 2
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

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

function drawPlanetLevel2() {
    if (currentPlanet) {
        ctx.drawImage(currentPlanet.image, currentPlanet.x, currentPlanet.y, currentPlanet.width, currentPlanet.height);
    }
}

function generatePlanetLevel2() {
    const width = 400 * scaleFactor;
    const height = 400 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    currentPlanet = {
        image: planets[Math.floor(Math.random() * planets.length)],
        x: x,
        y: -800 * scaleFactor,
        width: width,
        height: height,
        speed: 0.5 * scaleFactor
    };
}
