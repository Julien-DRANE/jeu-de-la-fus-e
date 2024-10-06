// level1.js
// Logique spécifique pour le niveau 1

// Fonction principale de la boucle de jeu pour le niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Mettre à jour les éléments du niveau 1
    moveRocket();      // Déplacer la fusée
    updateStars();     // Mettre à jour la position des étoiles
    updateObstacles(); // Mettre à jour la position des obstacles
    updatePlanet();    // Mettre à jour la position de la planète
    updateMoon();      // Mettre à jour la position de la lune

    // Dessiner les éléments du niveau 1
    drawStars();       // Dessiner les étoiles
    drawObstacles();   // Dessiner les obstacles
    drawPlanet();      // Dessiner la planète
    drawMoon();        // Dessiner la lune
    drawRocket();      // Dessiner la fusée

    // Incrémenter le temps écoulé dans le niveau 1
    elapsedTimeLevel1 += 0.016; // Approximation de l'incrémentation du temps en secondes

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2(); // Appeler la fonction pour passer au niveau 2
        return;
    }

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel1);
}

// Fonction pour démarrer le niveau 1
function startLevel1() {
    // Initialiser les variables du niveau 1
    rocket = { ...initialRocket }; // Réinitialiser la fusée à sa position initiale
    generateStars();               // Générer les étoiles du décor pour le niveau 1
    generatePlanet();              // Générer la première planète du décor
    generateMoon();                // Générer la première lune du décor
    gameLoopLevel1();              // Démarrer la boucle principale du niveau 1
}

// Démarrer le niveau 1 quand le script est chargé
startLevel1();
