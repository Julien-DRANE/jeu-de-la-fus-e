// level1.js
let elapsedTimeLevel1 = 0; // Déclaration de la variable au début du fichier

function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStars();
    updateObstacles();

    drawStars();
    drawObstacles();
    drawRocket();

    elapsedTimeLevel1 += 0.016; // Approximation de l'incrémentation du temps en secondes

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();
        return;
    }

    requestAnimationFrame(gameLoopLevel1);
}

function startLevel1() {
    // Initialiser les variables du niveau 1
    rocket = { ...initialRocket };
    generateStars();
    gameLoopLevel1();
}

// Démarrer le niveau 1 quand le script est chargé
startLevel1();
