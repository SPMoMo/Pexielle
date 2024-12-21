// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");

// Taille des pixels sur le canevas
const pixelSize = 15;  // Taille de chaque pixel
let rows, cols;

// Fonction pour redimensionner le canevas
function resizeCanvas() {
    const selectedSize = document.getElementById("canvasSizeSelect").value;
    canvas.width = selectedSize;
    canvas.height = selectedSize;
    rows = Math.floor(canvas.height / pixelSize);
    cols = Math.floor(canvas.width / pixelSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Appeler resizeCanvas dès que l'utilisateur change la taille
const canvasSizeSelect = document.getElementById("canvasSizeSelect");
canvasSizeSelect.addEventListener("change", resizeCanvas);

// Initialisation du canevas
resizeCanvas();

// Dessiner sur le canevas
let currentColor = "#000000"; // Couleur par défaut
let isMouseDown = false;

// Activer le dessin lors du clic
canvas.addEventListener("mousedown", function(event) {
    isMouseDown = true;
    drawPixel(event);
});

canvas.addEventListener("mouseup", function() {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", function(event) {
    if (isMouseDown) {
        drawPixel(event);
    }
});

// Dessiner un pixel
function drawPixel(event) {
    const x = Math.floor(event.offsetX / pixelSize);
    const y = Math.floor(event.offsetY / pixelSize);
    ctx.fillStyle = currentColor;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Changer la couleur de peinture via le sélecteur de couleur
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function(event) {
    currentColor = event.target.value;
});

// Palette de couleurs personnalisée
const colorBoxes = document.querySelectorAll(".color-box");
colorBoxes.forEach(function(box) {
    box.addEventListener("click", function() {
        currentColor = box.style.backgroundColor;
        colorPicker.value = rgbToHex(currentColor);
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

// Réinitialiser le canevas
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Télécharger l'image
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function() {
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "pixel-art.png";
    link.click();
});

// Gestion du sélecteur de langue
const languageSelect = document.getElementById("languageSelect");

// Traductions disponibles
const translations = {
    fr: {
        title: "Pexielle",
        reset: "Réinitialiser le Canevas",
        download: "Télécharger l'Image",
        sizeLabel: "Sélectionnez la taille du canevas:",
    },
    tr: {
        title: "Pexielle",
        reset: "Tuvali sıfırla",
        download: "Resmi İndir",
        sizeLabel: "Tuval boyutunu seçin:",
    },
    en: {
        title: "Pexielle",
        reset: "Reset Canvas",
        download: "Download Image",
        sizeLabel: "Select Canvas Size:",
    },
    es: {
        title: "Pexielle",
        reset: "Restablecer lienzo",
        download: "Descargar imagen",
        sizeLabel: "Seleccionar tamaño del lienzo:",
    },
    de: {
        title: "Pexielle",
        reset: "Leinwand zurücksetzen",
        download: "Bild herunterladen",
        sizeLabel: "Leinwandgröße auswählen:",
    },
    it: {
        title: "Pexielle",
        reset: "Ripristina la tela",
        download: "Scarica immagine",
        sizeLabel: "Seleziona la dimensione della tela:",
    },
    pt: {
        title: "Pexielle",
        reset: "Redefinir Tela",
        download: "Baixar Imagem",
        sizeLabel: "Selecione o Tamanho da Tela:",
    },
    ar: {
        title: "Pexielle",
        reset: "إعادة تعيين قماش",
        download: "تحميل الصورة",
        sizeLabel: "حدد حجم القماش:",
    },
};

// Gestion des changements de langue
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("resetButton").textContent = translations[lang].reset;
    document.getElementById("downloadButton").textContent = translations[lang].download;
    document.querySelector(".canvas-size label").textContent = translations[lang].sizeLabel;
});

// Le JavaScript pour l'effet de survol reste simple pour appliquer la transition de couleur
const selectElements = document.querySelectorAll('select');
selectElements.forEach(select => {
  select.addEventListener('mouseenter', () => {
    // L'effet est directement appliqué par le CSS
  });
});
