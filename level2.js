// level2.js
// Logique spécifique pour le niveau 2

// Charger la musique spécifique au niveau 2
const level2Music = new Audio('musique2.mp3');
level2Music.volume = 1.0;

let currentPlanet = null; // Variable pour la planète actuelle dans le niveau 2
const planets = [venusImage, marsImage, mercuryImage]; // Liste des planètes du niveau 2

function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStarsLevel2();    // Mise à jour des étoiles du niveau 2
    updatePlanetLevel2();   // Mise à jour des planètes
    updateObstacles();      // Mettre à jour les obstacles du niveau 2

    drawStarsLevel2();      // Dessiner les étoiles rouges et grises
    drawPlanetLevel2();     // Dessiner la planète en arrière-plan
    drawObstacles();        // Dessiner les obstacles spécifiques au niveau 2
    drawRocket();           // Dessiner la fusée

    elapsedTimeLevel2 += 0.016; // Incrémenter le temps

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel2);
}

// Démarrer le niveau 2
function startLevel2() {
    rocket = { ...initialRocket };    // Réinitialiser la fusée
    generateStarsLevel2();            // Appeler generateStarsLevel2 défini dans shared.js
    gameLoopLevel2();                 // Démarrer la boucle principale du niveau 2
}

startLevel2();
