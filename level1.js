// level1.js
// Logique spécifique pour le niveau 1

let elapsedTimeLevel1 = 0; // Variable locale pour suivre le temps dans le niveau 1
let planet = null; // Variable pour la planète
let moon = null;   // Variable pour la lune

// Générer la planète (décor) spécifique au niveau 1
function generatePlanet() {
    const width = 400 * scaleFactor;
    const height = 400 * scaleFactor;
    const x = Math.random() * (canvas.width - width); // Position horizontale aléatoire
    planet = {
        x: x,
        y: -800 * scaleFactor, // Position verticale initiale hors de l'écran
        width: width,
        height: height,
        speed: 0.5 * scaleFactor // Vitesse de descente de la planète
    };
}

// Mettre à jour la position de la planète
function updatePlanet() {
    if (planet) {
        planet.y += planet.speed;
        // Si la planète sort de l'écran, la supprimer
        if (planet.y > canvas.height) {
            planet = null;
        }
    } else {
        // Générer une nouvelle planète avec une faible probabilité
        if (Math.random() < 0.002) {
            generatePlanet();
        }
    }
}

// Dessiner la planète
function drawPlanet() {
    if (planet) {
        ctx.drawImage(planetImage, planet.x, planet.y, planet.width, planet.height);
    }
}

// Générer la lune (décor) spécifique au niveau 1
function generateMoon() {
    const width = 800 * scaleFactor;
    const height = 800 * scaleFactor;
    const x = Math.random() * (canvas.width - width); // Position horizontale aléatoire
    moon = {
        x: x,
        y: -1600 * scaleFactor, // Position verticale initiale hors de l'écran
        width: width,
        height: height,
        speed: 0.2 * scaleFactor // Vitesse de descente de la lune
    };
}

// Mettre à jour la position de la lune
function updateMoon() {
    if (moon) {
        moon.y += moon.speed;
        // Si la lune sort de l'écran, la supprimer
        if (moon.y > canvas.height) {
            moon = null;
        }
    } else {
        // Générer une nouvelle lune avec une faible probabilité
        if (Math.random() < 0.001) {
            generateMoon();
        }
    }
}

// Dessiner la lune
function drawMoon() {
    if (moon) {
        ctx.drawImage(moonImage, moon.x, moon.y, moon.width, moon.height);
    }
}

// Fonction principale de la boucle de jeu pour le niveau 1
function gameLoopLevel1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Mettre à jour les éléments du niveau 1
    moveRocket();      // Déplacer la fusée
    updateStars();     // Mettre à jour la position des étoiles
    updateObstacles(); // Mettre à jour la position des obstacles
    updatePlanet();    // Mettre à jour la position de la planète
    updateMoon();      // Mettre à jour la position de la lune

    // Dessiner les éléments du niveau 1
    drawStars();       // Dessiner les étoiles
    drawObstacles();   // Dessiner les obstacles
    drawPlanet();      // Dessiner la planète
    drawMoon();        // Dessiner la lune
    drawRocket();      // Dessiner la fusée

    // Incrémenter le temps écoulé dans le niveau 1
    elapsedTimeLevel1 += 0.016; // Approximation de l'incrémentation du temps en secondes

    // Passer au niveau 2 après 140 secondes
    if (elapsedTimeLevel1 >= 140) {
        switchToLevel2(); // Appeler la fonction pour passer au niveau 2
        return;
    }

    // Boucle d'animation continue
    requestAnimationFrame(gameLoopLevel1);
}

// Fonction pour démarrer le niveau 1
function startLevel1() {
    // Initialiser les variables du niveau 1
    rocket = { ...initialRocket }; // Réinitialiser la fusée à sa position initiale
    generateStars();               // Générer les étoiles du décor pour le niveau 1
    generatePlanet();              // Générer la première planète du décor
    generateMoon();                // Générer la première lune du décor
    gameLoopLevel1();              // Démarrer la boucle principale du niveau 1
}

// Démarrer le niveau 1 quand le script est chargé
startLevel1();
