// level2.js
// Logique spécifique pour le niveau 2

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

// Générer des étoiles pour le niveau 2
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

// Dessiner les étoiles dans le niveau 2
function drawStarsLevel2() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Mettre à jour les obstacles du niveau 2
function updateObstaclesLevel2() {
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

// Fonction principale de la boucle de jeu pour le niveau 2
function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStarsLevel2();
    updatePlanetLevel2();
    updateObstaclesLevel2();

    drawStarsLevel2();
    drawPlanetLevel2();
    drawObstacles();
    drawRocket();

    requestAnimationFrame(gameLoopLevel2);
}

// Fonction pour démarrer le niveau 2
function startLevel2() {
    rocket = { ...initialRocket };
    generateStarsLevel2();
    gameLoopLevel2();
    level2Music.play();
}

// Démarrer le niveau 2 quand le script est chargé
startLevel2();
