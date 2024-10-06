// level2.js
function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStars();
    updatePlanetLevel2();  // Fonction spécifique au niveau 2
    updateObstacles();

    drawStars();
    drawPlanetLevel2();    // Fonction spécifique au niveau 2
    drawObstacles();
    drawRocket();

    elapsedTimeLevel2 += 0.016;

    requestAnimationFrame(gameLoopLevel2);
}

function startLevel2() {
    rocket = { ...initialRocket };  // Réinitialiser la fusée avec initialRocket de shared.js
    generateStarsLevel2();          // Générer les étoiles spécifiques au niveau 2
    gameLoopLevel2();
}

startLevel2();
