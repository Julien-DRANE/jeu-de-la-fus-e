// Sélectionne le canvas et initialise le contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Facteur de réduction
const scaleFactor = 4 / 6; // Réduction de la taille par un facteur de 4/6 (≈0,6667)

// Dimensions du canvas (inchangées)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables globales initiales
const initialRocket = {
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
let planet = null;
let moon = null;
const numberOfStars = 100;

// Charger l'AudioContext pour les appareils Chrome
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const backgroundMusic = document.getElementById("backgroundMusic");
const source = audioContext.createMediaElementSource(backgroundMusic);
source.connect(audioContext.destination);

// Ajuster le volume de la musique à 70 % (réduction de 30 %)
backgroundMusic.volume = 0.7;

// Variables pour la difficulté et le score
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let elapsedTime = 0; // En dixièmes de seconde
let timerInterval;

// Variables de vies
let lives = 3; // Nombre initial de vies

let showScore = false;
let score = 0;

// Variables pour les messages de niveau
let levelMessage = "";
let showLevelMessage = false;
let levelMessageTimer = 0;

// Variables pour le cœur bonus
let bonusHeart = null;
let bonusHeartInterval;

// Variables pour les meilleurs scores
let highScores = [];

// Charger les images des obstacles pour Level 1 et Level 2
const obstacleImagesLevel1 = ["yaourt.png", "soupe.png", "bol.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images des décorations pour Level 1 et Level 2
const planetImagesLevel1 = ["mars.png", "mercury.png", "venus.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});
const moonImage = new Image();
moonImage.src = "lune.png"; // Vous pouvez ignorer cette image si elle n'est plus utilisée

// Charger l'image des cœurs pour les vies
const heartImage = new Image();
heartImage.src = "coeur.png";

// Charger les sons de collision et de bonus
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Vérifier le chargement des images et démarrer le jeu
let imagesLoaded = 0;
const totalImages = obstacleImagesLevel1.length + planetImagesLevel1.length + 1; // Inclure les cœurs

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        document.getElementById("startButton").style.display = "block";
    }
}

// Associer des événements de chargement et d'erreur aux images
planetImagesLevel1.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

moonImage.onload = imageLoaded;
moonImage.onerror = () => alert(`Erreur de chargement de l'image : ${moonImage.src}`);

heartImage.onload = imageLoaded;
heartImage.onerror = () => alert(`Erreur de chargement de l'image : ${heartImage.src}`);

obstacleImagesLevel1.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

// Vérifier le chargement de la musique
backgroundMusic.addEventListener('error', (e) => {
    console.error('Erreur lors de la lecture de la musique :', e);
});

// Générer des étoiles avec des couleurs variées pour une atmosphère sombre
function generateStars() {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        const size = (Math.random() * 3 + 1) * scaleFactor;
        const speed = size / 2;
        const color = Math.random() < 0.3 ? "rgba(255, 0, 0, 0.8)" : "rgba(128, 128, 128, 0.8)"; // 30% rouges, 70% grises
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size, speed, color });
    }
}

// Démarrer l'AudioContext pour activer le son
function activateAudioContext() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => console.log('AudioContext activé'));
    }
}

// Démarrer la musique de fond
function startBackgroundMusic(musicSrc) {
    activateAudioContext();
    backgroundMusic.src = musicSrc;
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().then(() => {
        console.log('Musique de fond lue avec succès');
    }).catch(error => {
        console.error('Erreur de lecture de la musique de fond :', error);
        alert("Appuyez à nouveau sur 'Jouer' pour activer la musique.");
    });
}

// Afficher un message de niveau
function showLevel(level) {
    levelMessage = `LEVEL ${level}`;
    showLevelMessage = true;
    levelMessageTimer = 180; // Afficher le message pendant 3 secondes (60 FPS)
}

// Lancer le jeu avec la musique de fond appropriée
function startGame() {
    loadHighScores();
    resetGameVariables();
    generateStars();
    hideUIElements();

    // Déterminer le niveau initial
    difficultyLevel = 1;
    showLevel(1);
    startBackgroundMusic('musique1.mp3'); // Musique pour Level 1

    gameLoop();
    difficultyInterval = setInterval(increaseDifficulty, 20000);
    startObstacleGeneration();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 1;
        if (difficultyLevel === 1 && elapsedTime >= 1400) { // 1400 dixièmes de seconde = 140 secondes
            switchToLevel2();
        }
    }, 100);

    clearInterval(bonusHeartInterval);
    bonusHeartInterval = setInterval(generateBonusHeart, 40000);
}

// Réinitialiser les variables du jeu pour une nouvelle partie
function resetGameVariables() {
    rocket = { ...initialRocket };
    obstacles = [];
    stars = [];
    planet = null;
    moon = null;
    obstacleSpeedMultiplier = 1;
    elapsedTime = 0;
    showScore = false;
    score = 0;
    lives = 3;
    bonusHeart = null;
}

// Cacher les éléments de l'interface utilisateur avant le démarrage du jeu
function hideUIElements() {
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("highScoreTable").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("startButton").style.display = "none";
}

// Ajouter les événements pour le bouton de démarrage
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
    startGame();
});

startButton.addEventListener("touchstart", function(e) {
    e.preventDefault();
    startGame();
}, { passive: false });

// Générer la planète (décor)
function generatePlanet() {
    const width = 400 * scaleFactor;
    const height = 400 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    planet = {
        x: x,
        y: -800 * scaleFactor,
        width: width,
        height: height,
        speed: 0.5 * scaleFactor
    };
}

// Générer la lune (décor) pour Level 1
function generateMoon() {
    const width = 800 * scaleFactor;
    const height = 800 * scaleFactor;
    const x = Math.random() * (canvas.width - width);
    moon = {
        x: x,
        y: -1600 * scaleFactor,
        width: width,
        height: height,
        speed: 0.2 * scaleFactor
    };
}

// Mettre à jour les positions des étoiles
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
            star.color = Math.random() < 0.3 ? "rgba(255, 0, 0, 0.8)" : "rgba(128, 128, 128, 0.8)";
        }
    });
}

// Mettre à jour la position de la planète
function updatePlanet() {
    if (planet) {
        planet.y += planet.speed;
        if (planet.y > canvas.height) {
            planet = null;
        }
    } else {
        if (Math.random() < 0.002) {
            generatePlanet();
        }
    }
}

// Mettre à jour la position de la lune pour Level 1
function updateMoon() {
    if (moon) {
        moon.y += moon.speed;
        if (moon.y > canvas.height) {
            moon = null;
        }
    } else {
        if (Math.random() < 0.001) {
            generateMoon();
        }
    }
}

// Dessiner les étoiles avec des couleurs variées
function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Dessiner la planète
function drawPlanet() {
    if (planet) {
        // Choisir une planète aléatoire parmi les images chargées
        const img = planetImagesLevel1[Math.floor(Math.random() * planetImagesLevel1.length)];
        ctx.drawImage(img, planet.x, planet.y, planet.width, planet.height);
    }
}

// Dessiner la lune pour Level 1
function drawMoon() {
    if (moon) {
        ctx.drawImage(moonImage, moon.x, moon.y, moon.width, moon.height);
    }
}

// Fonction pour générer des obstacles
let obstacleSpawnInterval = 1000;
let obstacleGenerationTimeout;

function startObstacleGeneration() {
    clearTimeout(obstacleGenerationTimeout);

    // Générer un obstacle
    generateObstacle();

    // Planifier la prochaine génération
    obstacleGenerationTimeout = setTimeout(startObstacleGeneration, obstacleSpawnInterval);
}

function generateObstacle() {
    if (difficultyLevel === 1) {
        const size = (Math.random() * 50 + 30) * scaleFactor;
        const x = Math.random() * (canvas.width - size);
        const speed = (Math.random() * 3 + 2) * obstacleSpeedMultiplier * scaleFactor;
        const imageIndex = Math.floor(Math.random() * obstacleImagesLevel1.length);
        obstacles.push({ x, y: -size, size, speed, image: obstacleImagesLevel1[imageIndex], level: 1 });
    } else if (difficultyLevel === 2) {
        // Level 2 obstacles
        const size = (Math.random() * 50 + 30) * scaleFactor;
        const x = Math.random() * (canvas.width - size);
        const speed = (Math.random() * 3 + 3) * obstacleSpeedMultiplier * scaleFactor; // Plus rapide
        const imageIndex = Math.floor(Math.random() * obstacleImagesLevel1.length);
        let waveAmplitude = 50 * scaleFactor; // Amplitude de l'ondulation
        let waveFrequency = 0.05; // Fréquence de l'ondulation
        obstacles.push({ 
            x, 
            y: -size, 
            size, 
            speed, 
            image: obstacleImagesLevel1[imageIndex], 
            level: 2,
            originalX: x,
            waveOffset: Math.random() * Math.PI * 2, // Phase aléatoire
            waveAmplitude,
            waveFrequency
        });
    }
}

// Déplacer la fusée avec inertie ou suivant le doigt
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

// Gérer les collisions avec tolérance
function detectCollision(obj1, obj2) {
    if (!obj2) return false;

    const obj1CenterX = obj1.x + obj1.width / 2;
    const obj1CenterY = obj1.y + obj1.height / 2;
    const obj2CenterX = obj2.x + obj2.size / 2;
    const obj2CenterY = obj2.y + obj2.size / 2;

    const deltaX = obj1CenterX - obj2CenterX;
    const deltaY = obj1CenterY - obj2CenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const collisionThreshold = (obj1.width / 2) + (obj2.size / 2) + (30 * scaleFactor);

    return distance < collisionThreshold;
}

// Dessiner la fusée
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Dessiner les obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

// Dessiner le compteur de temps
function drawTimer() {
    ctx.font = `${24 * scaleFactor}px Arial`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Time: ${(elapsedTime / 10).toFixed(1)}s`, 20 * scaleFactor, 20 * scaleFactor);
}

// Dessiner les cœurs (vies) en haut à droite
function drawLives() {
    const heartSize = 30 * scaleFactor;
    const padding = 10 * scaleFactor;
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - (heartSize + padding) * (i + 1), 20 * scaleFactor, heartSize, heartSize);
    }
}

// Générer le cœur bonus
function generateBonusHeart() {
    const size = 30 * scaleFactor;
    const x = Math.random() * (canvas.width - size);
    bonusHeart = {
        x: x,
        y: -size,
        size: size,
        speed: 2 * scaleFactor
    };
}

// Mettre à jour le cœur bonus
function updateBonusHeart() {
    if (bonusHeart) {
        bonusHeart.y += bonusHeart.speed;
        if (bonusHeart.y > canvas.height) {
            bonusHeart = null;
        }
        if (detectCollision(rocket, bonusHeart)) {
            lives = Math.min(lives + 1, 3);
            extraLifeSound.currentTime = 0;
            extraLifeSound.play();
            bonusHeart = null;
        }
    }
}

// Dessiner le cœur bonus
function drawBonusHeart() {
    if (bonusHeart) {
        ctx.drawImage(heartImage, bonusHeart.x, bonusHeart.y, bonusHeart.size, bonusHeart.size);
    }
}

// Gestion des touches pressées
const keysPressed = {};

// Contrôles de la fusée via clavier
document.addEventListener("keydown", e => {
    keysPressed[e.key] = true;
});

document.addEventListener("keyup", e => {
    keysPressed[e.key] = false;
});

// Appliquer les contrôles clavier à la fusée
function applyControls() {
    if (keysPressed["ArrowLeft"]) {
        rocket.dx -= rocket.acceleration;
    }
    if (keysPressed["ArrowRight"]) {
        rocket.dx += rocket.acceleration;
    }
    if (keysPressed["ArrowUp"]) {
        rocket.dy -= rocket.acceleration;
    }
    if (keysPressed["ArrowDown"]) {
        rocket.dy += rocket.acceleration;
    }
}

// Gestion des événements tactiles
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchActive = true;
    touchX = touch.clientX;
    touchY = touch.clientY;
    e.preventDefault();
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    e.preventDefault();
}

function handleTouchEnd(e) {
    touchActive = false;
}

// Fonction pour mettre à jour la position de la fusée vers le doigt
function updateRocketPosition() {
    const centerX = rocket.x + rocket.width / 2;
    const centerY = rocket.y + rocket.height / 2;

    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const deadZone = 10 * scaleFactor;

    if (distance > deadZone) {
        const angle = Math.atan2(deltaY, deltaX);

        const moveX = Math.cos(angle) * followSpeed;
        const moveY = Math.sin(angle) * followSpeed;

        if (Math.abs(moveX) > Math.abs(deltaX)) {
            rocket.x = touchX - rocket.width / 2;
        } else {
            rocket.x += moveX;
        }

        if (Math.abs(moveY) > Math.abs(deltaY)) {
            rocket.y = touchY - rocket.height / 2;
        } else {
            rocket.y += moveY;
        }
    }
}

// Fonction principale de la boucle de jeu
let animationFrameId;
let difficultyInterval;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    applyControls();
    moveRocket();

    if (touchActive) {
        updateRocketPosition();
    }

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

    // Afficher le message de niveau
    if (showLevelMessage) {
        ctx.font = `${48 * scaleFactor}px Arial`;
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(levelMessage, canvas.width / 2, canvas.height / 2);
        levelMessageTimer--;
        if (levelMessageTimer <= 0) {
            showLevelMessage = false;
        }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Augmenter la difficulté progressivement
function increaseDifficulty() {
    if (difficultyLevel === 1) {
        // Nouvelles difficultés pour Level 1 si nécessaire
    } else if (difficultyLevel === 2) {
        obstacleSpeedMultiplier += 0.2;
        obstacleSpawnInterval = Math.max(300, obstacleSpawnInterval - 100);
        startObstacleGeneration();
    }
}

// Fonction pour charger les meilleurs scores depuis le localStorage
function loadHighScores() {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
}

// Fonction pour sauvegarder les meilleurs scores dans le localStorage
function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Fonction pour afficher l'écran de fin de jeu
function displayGameOver() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(difficultyInterval);
    clearInterval(timerInterval);
    clearInterval(bonusHeartInterval);
    clearTimeout(obstacleGenerationTimeout);

    canvas.style.display = "none";
    document.getElementById("startButton").style.display = "none";

    const gameOverScreen = document.getElementById("gameOverScreen");
    const scoreDisplay = document.getElementById("scoreDisplay");
    gameOverScreen.style.display = "block";
    scoreDisplay.innerText = `Votre score : ${score.toFixed(1)}s`;

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    document.getElementById("restartButton").style.display = "none";

    document.getElementById("submitScoreButton").onclick = submitScore;

    document.getElementById("restartButton").onclick = function() {
        gameOverScreen.style.display = "none";
        startGame();
    };
}

// Fonction pour soumettre le score du joueur
function submitScore() {
    const playerNameInput = document.getElementById("playerNameInput");
    const playerName = playerNameInput.value.trim();
    if (playerName !== '') {
        highScores.push({ name: playerName, score: score });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 10);
        saveHighScores();
        displayHighScores();
        playerNameInput.value = '';

        document.getElementById("restartButton").style.display = "block";
    } else {
        alert('Veuillez entrer votre nom.');
    }
}

// Fonction pour afficher les meilleurs scores
function displayHighScores() {
    const highScoreTable = document.getElementById("highScoreTable");
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = '';
    highScores.forEach((entry) => {
        const li = document.createElement('li');
        li.innerText = `${entry.name} - ${entry.score.toFixed(1)}s`;
        highScoresList.appendChild(li);
    });
    highScoreTable.style.display = "block";
}

// Mettre à jour les obstacles et gérer les collisions
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        if (difficultyLevel === 2 && obstacle.level === 2 && obstacle.image.src.includes("glace.png")) {
            // Ajouter un mouvement ondulant pour glace.png en Level 2
            obstacle.x = obstacle.originalX + obstacle.waveAmplitude * Math.sin(obstacle.waveFrequency * obstacle.y + obstacle.waveOffset);
        }

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            continue;
        }
        if (detectCollision(rocket, obstacle)) {
            obstacles.splice(i, 1);
            lives -= 1;

            collisionSound.currentTime = 0;
            collisionSound.play();

            if (lives <= 0) {
                score = elapsedTime / 10;
                displayGameOver();
                break;
            }
        }
    }
}

// Fonction pour passer au Level 2
function switchToLevel2() {
    difficultyLevel = 2;
    obstacleSpeedMultiplier += 0.5; // Augmenter la vitesse des obstacles
    obstacleSpawnInterval = 800; // Augmenter la fréquence des obstacles
    showLevel(2);
    startBackgroundMusic('musique2.mp3'); // Changer la musique pour Level 2
    generateStars(); // Regénérer les étoiles avec les nouvelles couleurs
}

// Fonction pour démarrer ou réinitialiser le jeu
function startGame() {
    loadHighScores();

    rocket = { ...initialRocket };
    obstacles = [];
    stars = [];
    planet = null;
    moon = null;
    difficultyLevel = 1;
    obstacleSpeedMultiplier = 1;
    obstacleSpawnInterval = 1000;
    elapsedTime = 0;
    showScore = false;
    score = 0;
    lives = 3;
    bonusHeart = null;

    generateStars();

    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("highScoreTable").style.display = "none";

    canvas.style.display = "block";
    document.getElementById("startButton").style.display = "none";

    // Démarrer la musique de fond pour Level 1
    startBackgroundMusic('musique1.mp3');

    showLevel(1); // Afficher le message de Level 1

    gameLoop();

    difficultyInterval = setInterval(increaseDifficulty, 20000);

    startObstacleGeneration();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 1;
        if (difficultyLevel === 1 && elapsedTime >= 1400) { // 1400 dixièmes de seconde = 140 secondes
            switchToLevel2();
        }
    }, 100);

    clearInterval(bonusHeartInterval);
    bonusHeartInterval = setInterval(generateBonusHeart, 40000);
}

// Afficher un message de niveau
function showLevel(level) {
    levelMessage = `LEVEL ${level}`;
    showLevelMessage = true;
    levelMessageTimer = 180; // Afficher le message pendant 3 secondes (60 FPS)
}

// Appeler loadHighScores lorsque le script se charge
loadHighScores();
