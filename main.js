// main.js
// Point d'entrée principal du jeu

// Fonction pour démarrer le jeu avec le niveau 1
function startGame() {
    // Masquer le menu principal
    document.getElementById("menuBackground").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    
    // Afficher le canvas
    canvas.style.display = "block";

    // Démarrer le niveau 1
    startLevel1();
}

// Fonction pour passer du niveau 1 au niveau 2
function switchToLevel2() {
    // Effacer le contenu du canvas et réinitialiser le contexte
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arrêter la musique du niveau 1 si nécessaire
    if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
        backgroundMusic.pause();
    }

    // Masquer le niveau 1 et démarrer le niveau 2
    startLevel2();
}

// Gestion des événements pour le menu principal
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("startButton").addEventListener("touchstart", function(e) {
    e.preventDefault();
    startGame();
}, { passive: false });

// Fonction pour réinitialiser le jeu en cas de fin de partie
function resetGame() {
    // Réinitialiser les variables globales et le score
    elapsedTime = 0;
    score = 0;
    lives = 3;
    rocket = { ...initialRocket };
    obstacles = [];
    stars = [];

    // Réafficher le menu principal
    document.getElementById("menuBackground").style.display = "block";
    document.getElementById("startButton").style.display = "block";
    canvas.style.display = "none";
}

// Fonction pour afficher les scores et l'écran de fin de jeu
function displayGameOver() {
    // Arrêter la boucle de jeu
    cancelAnimationFrame(animationFrameId);

    // Afficher l'écran de fin de jeu
    const gameOverScreen = document.getElementById("gameOverScreen");
    const scoreDisplay = document.getElementById("scoreDisplay");
    gameOverScreen.style.display = "block";
    scoreDisplay.innerText = `Votre score : ${score.toFixed(1)}s`;

    // Arrêter la musique de fond
    if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Fonction pour soumettre le score du joueur et afficher le tableau des scores
function submitScore() {
    const playerNameInput = document.getElementById("playerNameInput");
    const playerName = playerNameInput.value.trim();
    if (playerName !== '') {
        highScores.push({ name: playerName, score: score });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 10); // Limiter à 10 meilleurs scores
        saveHighScores(); // Sauvegarder dans le localStorage
        displayHighScores(); // Afficher le tableau des scores
        playerNameInput.value = ''; // Réinitialiser le champ de saisie

        // Afficher le bouton "Rejouer"
        document.getElementById("restartButton").style.display = "block";
    } else {
        alert('Veuillez entrer votre nom.');
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

// Fonction pour afficher les meilleurs scores à l'écran
function displayHighScores() {
    const highScoreTable = document.getElementById("highScoreTable");
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = '';
    highScores.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name} - ${entry.score.toFixed(1)}s`;
        highScoresList.appendChild(li);
    });
    highScoreTable.style.display = "block";
}

// Charger les meilleurs scores lorsque le script est chargé
loadHighScores();
