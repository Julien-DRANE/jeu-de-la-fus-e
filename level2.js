// level2.js
let elapsedTimeLevel2 = 0; // Déclaration de la variable au début du fichier

// Charger la musique spécifique au niveau 2
const level2Music = new Audio('musique2.mp3');
level2Music.volume = 1.0;

let currentPlanet = null;
const planets = [venusImage, marsImage, mercuryImage];

// Générer une planète au hasard parmi celles du niveau 2
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

// Mettre à jour la position de la planète dans le niveau 2
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

// Dessiner la planète dans le niveau 2
function drawPlanetLevel2() {
    if (currentPlanet) {
        ctx.drawImage(currentPlanet.image, currentPlanet.x, currentPlanet.y, currentPlanet.width, currentPlanet.height);
    }
}

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

// Dessiner les étoiles avec des couleurs variées dans le niveau 2
function drawStarsLevel2() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Mettre à jour les étoiles spécifiques du niveau 2
function updateStarsLevel2() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Fonction principale de la boucle de jeu pour le niveau 2
function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStarsLevel2();
    updatePlanetLevel2();
    updateObstacles();

    drawStarsLevel2();
    drawPlanetLevel2();
    drawObstacles();
    drawRocket();

    elapsedTimeLevel2 += 0.016; // Approximation de l'incrémentation du temps en secondes

    requestAnimationFrame(gameLoopLevel2);
}

// Fonction pour démarrer le niveau 2
function startLevel2() {
    // Initialiser les variables spécifiques au niveau 2
    rocket = { ...initialRocket };
    generateStarsLevel2();
    gameLoopLevel2();

    // Lancer la musique après une interaction avec l'utilisateur
    document.body.addEventListener("click", () => {
        level2Music.play().catch(error => {
            console.log("Erreur lors de la lecture de la musique :", error);
        });
    }, { once: true });
}

// Démarrer le niveau 2 quand le script est chargé
startLevel2();
