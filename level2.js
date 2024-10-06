const level2Music = new Audio('musique2.mp3');
level2Music.volume = 1.0;
let currentPlanet = null;
const planets = [venusImage, marsImage, mercuryImage];

function generatePlanetLevel2() { /*...*/ }// level2.js
const level2Music = new Audio('musique2.mp3');
level2Music.volume = 1.0;
let currentPlanet = null;
const planets = [venusImage, marsImage, mercuryImage];

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

function drawStarsLevel2() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function updateSoupObstacle(obstacle) {
    const amplitude = 20 * scaleFactor;
    const frequency = 0.05;
    obstacle.x += amplitude * Math.sin(obstacle.y * frequency);
}

function generateObstacleLevel2() {
    const size = (Math.random() * 50 + 30) * scaleFactor;
    const x = Math.random() * (canvas.width - size);
    const speed = (Math.random() * 3 + 2) * obstacleSpeedMultiplier * scaleFactor;
    const imageIndex = Math.floor(Math.random() * level2ObstacleImages.length);
    const image = level2ObstacleImages[imageIndex];
    const obstacle = { x, y: -size, size, speed, image };

    if (image.src.includes("soupe.png")) {
        obstacle.isSoup = true;
    }

    obstacles.push(obstacle);
}

function updateObstaclesLevel2() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        if (obstacle.isSoup) {
            updateSoupObstacle(obstacle);
        }

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

function startLevel2() {
    rocket = { ...initialRocket };
    generateStarsLevel2();
    gameLoopLevel2();
    level2Music.play();
}

startLevel2();

function updatePlanetLevel2() { /*...*/ }
function drawPlanetLevel2() { /*...*/ }
function generateStarsLevel2() { /*...*/ }
function drawStarsLevel2() { /*...*/ }
function updateObstaclesLevel2() { /*...*/ }

function gameLoopLevel2() { /*...*/ }
function startLevel2() { /*...*/ }

startLevel2();
