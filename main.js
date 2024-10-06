
// main.js
// Gestionnaire principal du jeu

let currentLevelScript = null;

// Fonction pour charger dynamiquement un niveau
function loadLevel(levelName) {
    if (currentLevelScript) {
        document.body.removeChild(currentLevelScript);
    }
    currentLevelScript = document.createElement("script");
    currentLevelScript.src = `${levelName}.js`;
    document.body.appendChild(currentLevelScript);
}

// Fonction pour démarrer le jeu avec un niveau
function startGameWithLevel(levelName) {
    loadLevel(levelName);
}

// Exemple d'appel pour le démarrage du niveau 1
document.getElementById("startButton").addEventListener("click", () => startGameWithLevel("level1"));
