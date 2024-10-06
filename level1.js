// level1.js
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();       // Déplacer la fusée
    updateStars();      // Mettre à jour les étoiles
    updatePlanet();     // Mettre à jour la planète
    updateMoon();       // Mettre à jour la lune
    updateObstacles();  // Mettre à jour les obstacles

    drawStars();        // Dessiner les étoiles
    drawPlanet();       // Dessiner la planète
    drawMoon();         // Dessiner la lune
    drawObstacles();    // Dessiner les obstacles
    drawRocket();       // Dessiner la fusée

    elapsedTimeLevel1 += 0.016; 

    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();
        return;
    }

    requestAnimationFrame(gameLoopLevel1);
}

function startLevel1() {
    rocket = { ...initialRocket };  // Réinitialiser la fusée avec initialRocket de shared.js
    generateStars();
    generatePlanet();
    generateMoon();
    gameLoopLevel1();
}

startLevel1();
