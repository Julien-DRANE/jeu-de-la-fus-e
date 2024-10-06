
// shared.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scaleFactor = 4 / 6; 
let numberOfStars = 100; 
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let initialRocket = {
    x: canvas.width / 2 - (25 * scaleFactor),
    y: canvas.height - (150 * scaleFactor),
    width: 50 * scaleFactor,
    height: 100 * scaleFactor,
    dx: 0,
    dy: 0,
    acceleration: 1.5 * scaleFactor,
    maxSpeed: 15 * scaleFactor,
    friction: 0.93
};

let rocket = { ...initialRocket };
let obstacles = [];
let stars = [];
let touchActive = false;
let touchX = 0;
let touchY = 0;

const rocketImage = new Image();
rocketImage.src = "rocket.png";

const obstacleImages = ["unicorn.png", "koala.png", "crocodile.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const venusImage = new Image();
venusImage.src = "venus.png";

const marsImage = new Image();
marsImage.src = "mars.png";

const mercuryImage = new Image();
mercuryImage.src = "mercury.png";

const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');
