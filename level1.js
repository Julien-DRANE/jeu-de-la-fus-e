// level1.js
// Logique spécifique pour le niveau 1

// Fonction principale de la boucle de jeu pour le niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Mettre à jour les éléments du décor et des obstacles
    moveRocket();       // Déplacer la fusée
    updateStars();      // Mettre à jour les étoiles (défini dans shared.js)
    updatePlanet();     // Mettre à jour la planète (défini dans shared.js)
    updateMoon();       // Mettre à jour la lune (défini dans shared.js)
    updateObstacles();  // Mettre à jour les obstacles (défini dans shared.js)

    // Dessiner les éléments
    drawStars();        // Dessiner les étoiles (défini dans shared.js)
    drawPlanet();       // Dessiner la planète (défini dans shared.js)
    drawMoon();         // Dessiner la lune (défini dans shared.js)
    drawObstacles();    // Dessiner les obstacles (défini dans shared.js)
    drawRocket();       // Dessiner la fusée (défini dans shared.js)

    // Incrémenter le temps écoulé dans le niveau 1
    elapsedTimeLevel1 += 0.016; 

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();  // Assurez-vous que cette fonction est bien définie dans shared.js ou main.js
        return;
    }

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel1);
}

// Fonction pour démarrer le niveau 1
function startLevel1() {
    // Initialisation des variables
    rocket = { ...initialRocket };     // Réinitialiser la position de la fusée (initialRocket doit être défini dans shared.js)
    generateStars();                   // Générer les étoiles (défini dans shared.js)
    generatePlanet();                  // Générer une planète (défini dans shared.js)
    generateMoon();                    // Générer la lune (défini dans shared.js)
    gameLoopLevel1();                  // Démarrer la boucle du niveau 1
}

// Appeler la fonction pour démarrer le niveau 1
startLevel1();
