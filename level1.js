
// level1.js
// Logique spécifique pour le niveau 1

// Charger les images de la fusée et des obstacles
const rocketImage = new Image();
rocketImage.src = "rocket.png";

const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Fonction principale de la boucle de jeu pour le niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStars();
    updateObstacles();

    drawStars();
    drawObstacles();
    drawRocket();

    requestAnimationFrame(gameLoopLevel1);
}

// Fonction pour démarrer le niveau 1
function startLevel1() {
    // Initialiser les variables du niveau 1
    rocket = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 100, dx: 0, dy: 0 };
    generateStars();
    gameLoopLevel1();
}

// Démarrer le niveau 1 quand le script est chargé
startLevel1();
