// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");

// Taille des pixels sur le canevas
const pixelSize = 20;  // Chaque pixel sera un carré de 20x20 pixels
const rows = canvas.height / pixelSize;  // Nombre de lignes
const cols = canvas.width / pixelSize;   // Nombre de colonnes

// Couleur sélectionnée
let currentColor = "#000000";

// Créer la grille au chargement initial du canevas
function createGrid() {
    // Dessiner la grille (optionnel, ici on n'en a pas besoin)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.strokeStyle = "#d3d3d3";  // Gris clair pour la grille
            ctx.lineWidth = 0.5;  // Petite épaisseur de ligne
            ctx.strokeRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
    }
}

// Initialiser le canevas avec la taille et sans la grille visible
canvas.width = 800; // Largeur de 800px
canvas.height = 800; // Hauteur de 800px

// Créer le canevas de 800x800px, mais sans la grille visible
//createGrid(); // Supprimé car la grille n'est plus nécessaire

// Ajouter un événement pour dessiner sur le canevas
let isMouseDown = false;

// Activer le dessin lorsque la souris est enfoncée
canvas.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    drawPixel(event);
});

// Désactiver le dessin lorsque la souris est relâchée
canvas.addEventListener("mouseup", function () {
    isMouseDown = false;
});

// Dessiner un pixel à la position de la souris
canvas.addEventListener("mousemove", function (event) {
    if (isMouseDown) {
        drawPixel(event);
    }
});

// Fonction de dessin d'un pixel
function drawPixel(event) {
    const x = Math.floor(event.offsetX / pixelSize);
    const y = Math.floor(event.offsetY / pixelSize);

    // Dessiner un carré de couleur sans bordure noire
    ctx.fillStyle = currentColor;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Changer la couleur de peinture
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function (event) {
    currentColor = event.target.value;
});

// Palette de couleurs personnalisée
const colorBoxes = document.querySelectorAll(".color-box");
colorBoxes.forEach(function (box) {
    box.addEventListener("click", function () {
        currentColor = box.style.backgroundColor;
        colorPicker.value = rgbToHex(currentColor); // Mettre à jour le sélecteur de couleur
    });
});

// Fonction pour convertir RGB en Hex
function rgbToHex(rgb) {
    const rgbArr = rgb.match(/\d+/g);
    const r = parseInt(rgbArr[0]).toString(16).padStart(2, "0");
    const g = parseInt(rgbArr[1]).toString(16).padStart(2, "0");
    const b = parseInt(rgbArr[2]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

// Fonction de réinitialisation du canevas
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function() {
    // Effacer tout le canevas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Fonction de téléchargement de l'image
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function() {
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "pixel-art.png";
    link.click();
});

// Réinitialiser le canevas à l'état de départ au chargement
window.onload = function() {
    //createGrid(); // Pas besoin de la grille par défaut au démarrage
};
