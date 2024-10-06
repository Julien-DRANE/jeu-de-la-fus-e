// level2.js
// Logique spécifique pour le niveau 2

let currentPlanet = null; // Planète actuelle dans le niveau 2
const planets = [venusImage, marsImage, mercuryImage];

function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Mettre à jour les éléments du niveau 2
    moveRocket();
    updateStarsLevel2();    // Fonction spécifique pour le niveau 2
    updatePlanetLevel2();   // Mise à jour des planètes
    updateObstacles();      // Mettre à jour les obstacles

    // Dessiner les éléments du niveau 2
    drawStarsLevel2();      // Dessiner les étoiles rouges/grises
    drawPlanetLevel2();     // Dessiner la planète
    drawObstacles();        // Dessiner les obstacles
    drawRocket();           // Dessiner la fusée

    elapsedTimeLevel2 += 0.016; 

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel2);
}

// Fonction pour démarrer le niveau 2
function startLevel2() {
    rocket = { ...initialRocket };
    generateStarsLevel2();   // Générer des étoiles spécifiques au niveau 2
    gameLoopLevel2();        // Démarrer la boucle du niveau 2
}

startLevel2();
