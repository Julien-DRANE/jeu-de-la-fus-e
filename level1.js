// level1.js

// Logique spécifique au niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mettre à jour les éléments du décor et des obstacles
    moveRocket();
    updateStars();
    updatePlanet();
    updateMoon();
    updateObstacles();

    // Dessiner tous les éléments
    drawStars();
    drawPlanet();
    drawMoon();
    drawObstacles();
    drawRocket();

    elapsedTimeLevel1 += 0.016; // Incrémenter le temps

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();
        return;
    }

    requestAnimationFrame(gameLoopLevel1);
}

function startLevel1() {
    rocket = { ...initialRocket };
    generateStars();
    generatePlanet();
    generateMoon();
    gameLoopLevel1();
}

startLevel1();
