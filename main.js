function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyControls();
    moveRocket();
    if (touchActive) updateRocketPosition();
    updateStars();
    updatePlanet();
    updateMoon();
    updateObstacles();
    updateBonusHeart();
    drawStars();
    drawPlanet();
    drawMoon();
    drawObstacles();
    drawBonusHeart();
    drawRocket();
    drawTimer();
    drawLives();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
    loadHighScores();
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
    generateStars();
    gameLoop();
    difficultyInterval = setInterval(increaseDifficulty, 20000);
    startObstacleGeneration();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => { elapsedTime += 1; }, 100);
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
