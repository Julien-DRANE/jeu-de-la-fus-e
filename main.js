// main.js
// Logique principale du jeu

// Variables pour le jeu
let animationFrameId;
let difficultyInterval;
let timerInterval;
let bonusHeartInterval;

// Fonction principale de la boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    applyControls(); // Appliquer les contrôles à la fusée
    moveRocket(); // Déplacer la fusée

    if (touchActive) {
        updateRocketPosition(); // Mettre à jour la position de la fusée avec le doigt
    }

    updateStars(); // Mettre à jour les étoiles
    updatePlanet(); // Mettre à jour la planète
    updateMoon(); // Mettre à jour la lune
    updateObstacles(); // Mettre à jour les obstacles
    updateBonusHeart(); // Mettre à jour le cœur bonus

    drawStars(); // Dessiner les étoiles
    drawPlanet(); // Dessiner la planète
    drawMoon(); // Dessiner la lune
    drawObstacles(); // Dessiner les obstacles
    drawBonusHeart(); // Dessiner le cœur bonus
    drawRocket(); // Dessiner la fusée
    drawTimer(); // Dessiner le chronomètre
    drawLives(); // Dessiner les vies

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Fonction pour démarrer ou réinitialiser le jeu
function startGame() {
    loadHighScores(); // Charger les meilleurs scores

    // Réinitialiser toutes les variables du jeu
    rocket = { ...initialRocket };
    obstacles = [];
    stars = [];
    planet = null;
    moon = null;
    difficultyLevel = 1;
    obstacleSpeedMultiplier = 1;
    elapsedTime = 0;
    score = 0;
    lives = 3;
    bonusHeart = null;

    generateStars(); // Générer les étoiles

    // Démarrer la boucle de jeu
    gameLoop();

    // Augmenter la difficulté et autres initialisations
    difficultyInterval = setInterval(increaseDifficulty, 20000);
    startObstacleGeneration();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 1;
    }, 100);
}

// Écouteur d'événement pour le bouton de démarrage
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
