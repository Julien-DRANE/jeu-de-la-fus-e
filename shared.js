
// shared.js
// Contient les fonctions partagées entre les niveaux

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Déclaration des variables communes
let rocket = {};
let obstacles = [];
let stars = [];
let lives = 3;

// Fonction pour dessiner la fusée
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

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
