
// level1.js
let elapsedTimeLevel1 = 0;

function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveRocket();
    updateStars();
    updateObstacles();

    drawStars();
    drawObstacles();
    drawRocket();

    elapsedTimeLevel1 += 0.016; 

    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2();
        return;
    }

    requestAnimationFrame(gameLoopLevel1);
}

function startLevel1() {
    rocket = { ...initialRocket };
    generateStars();
    gameLoopLevel1();
}

startLevel1();
