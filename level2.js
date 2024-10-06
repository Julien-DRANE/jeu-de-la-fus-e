// level2.js
// Logique spécifique pour le niveau 2

// Charger la musique spécifique au niveau 2
const level2Music = new Audio('musique2.mp3');
level2Music.volume = 1.0;

// Utilisation des variables `planets` et `currentPlanet` définies dans shared.js
// Assurez-vous que shared.js est chargé avant level2.js dans l'ordre de votre HTML

function gameLoopLevel2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStarsLevel2();    // Mise à jour des étoiles du niveau 2
    updatePlanetLevel2();   // Mise à jour des planètes du niveau 2
    updateObstacles();      // Mise à jour des obstacles

    drawStarsLevel2();      // Dessiner les étoiles rouges et grises
    drawPlanetLevel2();     // Dessiner la planète en arrière-plan
    drawObstacles();        // Dessiner les obstacles spécifiques au niveau 2
    drawRocket();           // Dessiner la fusée

    elapsedTimeLevel2 += 0.016; // Incrémenter le temps

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel2);
}

// Fonction pour démarrer le niveau 2
function startLevel2() {
    rocket = { ...initialRocket };    // Réinitialiser la fusée (définie dans shared.js)
    generateStarsLevel2();            // Générer les étoiles rouges et grises du niveau 2
    generatePlanetLevel2();           // Générer la première planète du niveau 2
    gameLoopLevel2();                 // Démarrer la boucle principale du niveau 2
}

startLevel2(); // Appeler la fonction pour démarrer le niveau 2
