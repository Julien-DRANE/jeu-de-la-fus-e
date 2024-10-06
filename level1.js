// level1.js
// Logique spécifique pour le niveau 1

let elapsedTimeLevel1 = 0; // Temps écoulé en secondes

// Fonction principale de la boucle de jeu pour le niveau 1
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

// Fonction pour démarrer le niveau 1
function startLevel1() {
    rocket = { ...initialRocket };
    generateStars();
    gameLoopLevel1();
}

// Démarrer le niveau 1 quand le script est chargé
startLevel1();
