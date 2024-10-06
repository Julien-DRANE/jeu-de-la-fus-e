// level1.js
// Logique spécifique pour le niveau 1

// Fonction principale de la boucle de jeu pour le niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Mettre à jour les éléments du décor et des obstacles
    moveRocket();       // Déplacer la fusée
    updateStars();      // Mettre à jour les étoiles
    updatePlanet();     // Mettre à jour la planète
    updateMoon();       // Mettre à jour la lune
    updateObstacles();  // Mettre à jour les obstacles

    // Dessiner les éléments
    drawStars();        // Dessiner les étoiles
    drawPlanet();       // Dessiner la planète
    drawMoon();         // Dessiner la lune
    drawObstacles();    // Dessiner les obstacles
    drawRocket();       // Dessiner la fusée

    // Incrémenter le temps écoulé dans le niveau 1
    elapsedTimeLevel1 += 0.016; 

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();
        return;
    }

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel1);
}

// Démarrer le niveau 1
function startLevel1() {
    rocket = { ...initialRocket };
    generateStars();    // Appeler generateStars de shared.js
    generatePlanet();   // Générer une planète
    generateMoon();     // Générer la lune
    gameLoopLevel1();   // Démarrer la boucle du niveau 1
}

startLevel1();
