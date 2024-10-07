// Sélectionne le canvas et initialise le contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Facteur de réduction
const scaleFactor = 4 / 6; // Réduction de la taille par un facteur de 4/6 (≈0,6667)

// Dimensions du canvas
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
let decorItems = []; // Liste des éléments de décor
let currentDecorIndex = 0; // Index pour les décorations ordonnées
let currentLevel = 1; // Niveau actuel du jeu
const numberOfStars = 100;

// Charger les images des obstacles pour Level 1
let level1ObstacleImages = ["crocodile.png", "koala.png", "unicorn.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images du décor pour Level 1 (ordonnées)
const level1DecorSequence = [
    {
        src: "planet.png",
        width: 400 * scaleFactor,
        height: 400 * scaleFactor,
        speed: 0.5 * scaleFactor
    },
    {
        src: "lune.png",
        width: 800 * scaleFactor,
        height: 800 * scaleFactor,
        speed: 0.2 * scaleFactor
    }
];

// Charger les images des obstacles pour Level 2
let level2ObstacleImages = ["yaourt.png", "soupe.png", "bol.png", "glace.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Charger les images du décor pour Level 2 (ordonnées)
const level2DecorSequence = [
    {
        src: "mars.png",
        width: 400 * scaleFactor,
        height: 400 * scaleFactor,
        speed: 0.5 * scaleFactor
    },
    {
        src: "venus.png",
        width: 600 * scaleFactor,
        height: 600 * scaleFactor,
        speed: 0.3 * scaleFactor
    },
    {
        src: "mercury.png",
        width: 800 * scaleFactor,
        height: 800 * scaleFactor,
        speed: 0.2 * scaleFactor
    }
];

// Charger les images du décor pour chaque niveau
let level1DecorImages = level1DecorSequence.map(decor => {
    const img = new Image();
    img.src = decor.src;
    return img;
});

let level2DecorImages = level2DecorSequence.map(decor => {
    const img = new Image();
    img.src = decor.src;
    return img;
});

// Charger l'image de la fusée
const rocketImage = new Image();
rocketImage.src = "rocket.png";

// Charger l'image des cœurs pour les vies
const heartImage = new Image();
heartImage.src = "coeur.png";

// Charger les sons de collision et de bonus
const collisionSound = new Audio('collision.mp3');
const extraLifeSound = new Audio('extra.mp3');

// Variables pour le cœur bonus et le tableau des scores
let bonusHeart = null;
let bonusHeartInterval;
let highScores = [];

// Variables pour la musique de fond
const backgroundMusic = document.getElementById("backgroundMusic");

// Variables pour la difficulté et le score
let difficultyLevel = 1;
let obstacleSpeedMultiplier = 1;
let elapsedTime = 0; // En dixièmes de seconde
let timerInterval;

// Variables pour les vies
let lives = 3; // Nombre initial de vies

// Variables pour le contrôle tactile
let touchActive = false;
let touchX = 0;
let touchY = 0;
const followSpeed = 10 * scaleFactor; // Vitesse de suivi ajustée

// Charger les images et vérifier le chargement
let imagesLoaded = 0;
const totalImages = level1ObstacleImages.length + level1DecorImages.length +
                    level2ObstacleImages.length + level2DecorImages.length + 
                    2; // Inclure la fusée et les cœurs

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        document.getElementById("startButton").style.display = "block";
    }
}

// Associer des événements de chargement et d'erreur aux images
rocketImage.onload = imageLoaded;
heartImage.onload = imageLoaded;

// Charger les images des obstacles pour Level 1
level1ObstacleImages.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

// Charger les images du décor pour Level 1
level1DecorImages.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

// Charger les images des obstacles pour Level 2
level2ObstacleImages.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

// Charger les images du décor pour Level 2
level2DecorImages.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => alert(`Erreur de chargement de l'image : ${img.src}`);
});

// Vérifier le chargement de la musique
backgroundMusic.addEventListener('error', (e) => {
    console.error('Erreur lors de la lecture de la musique :', e);
});

// Générer des étoiles avec des couleurs personnalisées
function generateStars(colors = ["white"]) {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        const size = (Math.random() * 3 + 1) * scaleFactor;
        const speed = size / 2;
        const color = colors[Math.floor(Math.random() * colors.length)]; // Sélectionne une couleur aléatoire
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size, speed, color });
    }
}

// Initialiser AudioContext après interaction utilisateur
let audioContext = null;

function activateAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => console.log('AudioContext activé'));
    }
}

// Fonction pour démarrer la musique de fond
function startBackgroundMusic() {
    activateAudioContext();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().then(() => {
        console.log('Musique de fond lue avec succès');
    }).catch(error => {
        console.error('Erreur de lecture de la musique de fond :', error);
        alert("Appuyez à nouveau sur 'Jouer' pour activer la musique.");
    });
}

// Afficher un message de niveau
function showLevelMessage(message) {
    const levelMessage = document.getElementById('levelMessage');
    levelMessage.innerText = message;
    levelMessage.style.display = 'block';

    // Cacher le message après 3 secondes
    setTimeout(() => {
        levelMessage.style.display = 'none';
    }, 3000);
}

// Charger les meilleurs scores depuis le localStorage
function loadHighScores() {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
}

// Sauvegarder les meilleurs scores dans le localStorage
function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Afficher les meilleurs scores
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

// Réinitialiser les variables du jeu pour une nouvelle partie
function resetGameVariables() {
    rocket = { ...initialRocket };
    obstacles = [];
    stars = [];
    decorItems = []; // Réinitialiser les éléments de décor
    currentDecorIndex = 0; // Réinitialiser l'index des décorations
    currentLevel = 1; // Réinitialiser le niveau au début
    difficultyLevel = 1;
    obstacleSpeedMultiplier = 1;
    obstacleSpawnInterval = 1000; // Valeur initiale de 1000 ms
    elapsedTime = 0;
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

// Fonction pour afficher l'écran de fin de jeu
function displayGameOver() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(difficultyInterval);
    clearInterval(timerInterval);
    clearInterval(bonusHeartInterval);
    clearTimeout(obstacleGenerationTimeout);

    hideUIElements();

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
    const size = (Math.random() * 50 + 30) * scaleFactor;
    const x = Math.random() * (canvas.width - size);
    let speed = (Math.random() * 3 + 2) * obstacleSpeedMultiplier * scaleFactor;
    let imageIndex = 0;
    let image = null;

    if (currentLevel === 1) {
        imageIndex = Math.floor(Math.random() * level1ObstacleImages.length);
        image = level1ObstacleImages[imageIndex];
    } else if (currentLevel === 2) {
        imageIndex = Math.floor(Math.random() * level2ObstacleImages.length);
        image = level2ObstacleImages[imageIndex];
    }

    // Si l'obstacle est 'glace.png' et Level 2, ajouter une trajectoire ondulante
    if (currentLevel === 2 && image.src.includes('glace.png')) {
        obstacles.push({
            x: x,
            y: -size,
            size: size,
            speed: speed,
            image: image,
            oscillate: true,
            oscillateAmplitude: 50 * scaleFactor,
            oscillateFrequency: 0.05,
            oscillateOffset: Math.random() * Math.PI * 2
        });
    } else {
        obstacles.push({ x, y: -size, size, speed, image });
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

    // Limiter la fusée dans le canvas
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

// Dessiner les étoiles avec des vitesses et tailles différentes
function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Dessiner les éléments de décor
function drawDecorItems() {
    decorItems.forEach(decor => {
        ctx.drawImage(decor.image, decor.x, decor.y, decor.width, decor.height);
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
    updateDecorItems();
    updateObstacles();
    updateBonusHeart();

    drawStars();
    drawDecorItems();
    drawObstacles();
    drawBonusHeart();
    drawRocket();
    drawTimer();
    drawLives();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Augmenter la difficulté progressivement
function increaseDifficulty() {
    difficultyLevel += 1;
    obstacleSpeedMultiplier += 0.2;

    obstacleSpawnInterval = Math.max(300, obstacleSpawnInterval - 100);

    startObstacleGeneration();
}

// Mettre à jour les obstacles et gérer les collisions
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        if (obstacle.oscillate) {
            // Mouvement ondulant
            obstacle.x += Math.sin(obstacle.y * obstacle.oscillateFrequency + obstacle.oscillateOffset) * scaleFactor;
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

// Fonction pour mettre à jour les positions des étoiles
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Fonction pour générer les éléments de décor en ordre
function generateDecorItems() {
    let decorSequence = [];
    let decorImages = [];

    if (currentLevel === 1) {
        decorSequence = level1DecorSequence;
        decorImages = level1DecorImages;
    } else if (currentLevel === 2) {
        decorSequence = level2DecorSequence;
        decorImages = level2DecorImages;
    }

    if (currentDecorIndex < decorSequence.length) {
        const decor = decorSequence[currentDecorIndex];
        const image = decorImages[currentDecorIndex];
        decorItems.push({
            image: image,
            x: Math.random() * (canvas.width - decor.width),
            y: -decor.height,
            width: decor.width,
            height: decor.height,
            speed: decor.speed
        });
        currentDecorIndex++;
    }
}

// Mettre à jour les éléments de décor
function updateDecorItems() {
    for (let i = decorItems.length - 1; i >= 0; i--) {
        let decor = decorItems[i];
        decor.y += decor.speed;

        if (decor.y > canvas.height) {
            decorItems.splice(i, 1);
            continue;
        }
    }

    // Générer le prochain décor si aucun élément de décor n'est présent
    if (decorItems.length === 0 && currentDecorIndex < (currentLevel === 1 ? level1DecorSequence.length : level2DecorSequence.length)) {
        // Ajouter un délai variable entre 1 et 3 secondes pour espacer les décorations
        const delay = Math.random() * 2000 + 1000; // entre 1 et 3 secondes
        setTimeout(generateDecorItems, delay);
    }
}

// Fonction pour passer au Level 2 après 140 secondes
function checkLevelTransition() {
    if (elapsedTime / 10 >= 140 && currentLevel === 1) {
        currentLevel = 2;
        switchToLevel2();
    }
}

// Fonction pour changer les assets et la musique pour le Level 2
function switchToLevel2() {
    showLevelMessage('LEVEL 2');

    // Changer la musique de fond
    backgroundMusic.pause();
    backgroundMusic.src = 'musique2.mp3';
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().then(() => {
        console.log('Musique de fond Level 2 lue avec succès');
    }).catch(error => {
        console.error('Erreur de lecture de la musique de fond Level 2 :', error);
    });

    // Régénérer les étoiles avec des couleurs rouges et grises pour le LEVEL 2
    generateStars(["red", "gray"]);

    // Réinitialiser le multiplicateur de vitesse des obstacles
    obstacleSpeedMultiplier = 1;

    // Réinitialiser l'intervalle de génération des obstacles
    obstacleSpawnInterval = 1000; // Valeur initiale de 1000 ms

    // Arrêter la génération actuelle des obstacles
    clearTimeout(obstacleGenerationTimeout);

    // Redémarrer la génération des obstacles avec les nouvelles valeurs
    startObstacleGeneration();

    // Réinitialiser les décorations
    decorItems = [];
    currentDecorIndex = 0;

    // Générer le premier décor du Level 2 après un délai
    setTimeout(generateDecorItems, 1000); // 1 seconde de délai
}

// Fonction pour démarrer ou réinitialiser le jeu
function startGame() {
    loadHighScores();
    resetGameVariables();
    generateStars(); // Génère des étoiles blanches par défaut
    hideUIElements();

    showLevelMessage('LEVEL 1');

    // Démarrer la musique de fond après l'interaction utilisateur
    startBackgroundMusic();

    gameLoop();
    difficultyInterval = setInterval(increaseDifficulty, 20000);
    startObstacleGeneration();

    // Générer le premier décor du Level 1 après un délai
    setTimeout(generateDecorItems, 1000); // 1 seconde de délai

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 1;
        checkLevelTransition();
    }, 100);

    clearInterval(bonusHeartInterval);
    bonusHeartInterval = setInterval(generateBonusHeart, 40000);
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

// Charger les meilleurs scores lorsque le script se charge
loadHighScores();
