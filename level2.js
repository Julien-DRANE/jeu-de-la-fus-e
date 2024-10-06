// level2.js

// Logique spécifique au niveau 2
let currentPlanet = null; // Planète actuelle dans le niveau 2
const planets = [venusImage, marsImage, mercuryImage];

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

    elapsedTimeLevel2 += 0.016; // Incrémenter le temps

    requestAnimationFrame(gameLoopLevel2);
}

function startLevel2() {
    rocket = { ...initialRocket };
    generateStarsLevel2();
    gameLoopLevel2();
}

startLevel2();
