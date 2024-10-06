// level2.js
// Assurez-vous que shared.js est chargé avant ce fichier pour accéder à initialRocket

// Fonction principale de la boucle de jeu pour le niveau 2
function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();        // Déplacer la fusée
    updateStarsLevel2(); // Mettre à jour les étoiles du niveau 2
    updatePlanetLevel2();// Mettre à jour la planète du niveau 2
    updateObstacles();   // Mettre à jour les obstacles du niveau 2

    drawStarsLevel2();   // Dessiner les étoiles rouges et grises du niveau 2
    drawPlanetLevel2();  // Dessiner la planète en arrière-plan
    drawObstacles();     // Dessiner les obstacles
    drawRocket();        // Dessiner la fusée

    elapsedTimeLevel2 += 0.016; // Incrémenter le temps

    requestAnimationFrame(gameLoopLevel2);
}

// Fonction pour démarrer le niveau 2
function startLevel2() {
    rocket = { ...initialRocket };    // Réinitialiser la fusée avec initialRocket défini dans shared.js
    generateStarsLevel2();            // Générer les étoiles du niveau 2
    gameLoopLevel2();                 // Démarrer la boucle principale du niveau 2
}

startLevel2(); // Appeler la fonction pour démarrer le niveau 2
