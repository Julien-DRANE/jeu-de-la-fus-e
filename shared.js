const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scaleFactor = 4 / 6; 
let numberOfStars = 100; 
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let initialRocket = { x: canvas.width / 2 - (25 * scaleFactor), y: canvas.height - (150 * scaleFactor), width: 50 * scaleFactor, height: 100 * scaleFactor, dx: 0, dy: 0, acceleration: 1.5 * scaleFactor, maxSpeed: 15 * scaleFactor, friction: 0.93 };
let rocket = { ...initialRocket };
let obstacles = [];
let stars = [];
let venusImage = new Image();
let marsImage = new Image();
let mercuryImage = new Image();
venusImage.src = "venus.png";
marsImage.src = "mars.png";
mercuryImage.src = "mercury.png";

function generateStars() { /*...*/ }
function loadHighScores() { /*...*/ }
// Other functions...
function generateStars() {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        const size = (Math.random() * 3 + 1) * scaleFactor;
        const speed = size / 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        stars.push({ x, y, size, speed });
    }
}
function moveRocket() {
    if (!touchActive) {
        rocket.dx *= rocket.friction;
        rocket.dy *= rocket.friction;

        if (rocket.dx > rocket.maxSpeed) rocket.dx = rocket.maxSpeed;
        if (rocket.dx < -rocket.maxSpeed) rocket.dx = -rocket.maxSpeed;
        if (rocket.dy > rocket.maxSpeed) rocket.dy = rocket.maxSpeed;
        if (rocket.dy < -rocket.maxSpeed) rocket.dy = -rocket.maxSpeed;

        rocket.x += rocket.dx;
        rocket.y += rocket.dy;
    }

    if (rocket.x < 0) rocket.x = 0;
    if (rocket.x + rocket.width > canvas.width) rocket.x = canvas.width - rocket.width;
    if (rocket.y < 0) rocket.y = 0;
    if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
}
