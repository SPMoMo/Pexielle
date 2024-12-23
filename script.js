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

// Désactiver le dessin lors du relâchement du clic
canvas.addEventListener("mouseup", function() {
    isMouseDown = false;
});

// Dessiner lors du déplacement de la souris
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
        footer: "&copy; 2024 Pexielle. Tous droits réservés.",
    },
    tr: {
        title: "Pexielle",
        reset: "Tuvali sıfırla",
        download: "Resmi İndir",
        sizeLabel: "Tuval boyutunu seçin:",
        footer: "&copy; 2024 Pexielle. Tüm hakları saklıdır.",
    },
    sv: {
        title: "Pexielle",
        reset: "Återställ duk",
        download: "Ladda ner bild",
        sizeLabel: "Välj dukstorlek:",
        footer: "&copy; 2024 Pexielle. Alla rättigheter förbehållna.",
    },
    en: {
        title: "Pexielle",
        reset: "Reset Canvas",
        download: "Download Image",
        sizeLabel: "Select Canvas Size:",
        footer: "&copy; 2024 Pexielle. All rights reserved.",
    },
    es: {
        title: "Pexielle",
        reset: "Restablecer lienzo",
        download: "Descargar imagen",
        sizeLabel: "Seleccionar tamaño del lienzo:",
        footer: "&copy; 2024 Pexielle. Todos los derechos reservados.",
    },
    de: {
        title: "Pexielle",
        reset: "Leinwand zurücksetzen",
        download: "Bild herunterladen",
        sizeLabel: "Leinwandgröße auswählen:",
        footer: "&copy; 2024 Pexielle. Alle Rechte vorbehalten.",
    },
    it: {
        title: "Pexielle",
        reset: "Ripristina la tela",
        download: "Scarica immagine",
        sizeLabel: "Seleziona la dimensione della tela:",
        footer: "&copy; 2024 Pexielle. Tutti i diritti riservati.",
    },
    pt: {
        title: "Pexielle",
        reset: "Redefinir Tela",
        download: "Baixar Imagem",
        sizeLabel: "Selecione o Tamanho da Tela:",
        footer: "&copy; 2024 Pexielle. Todos os direitos reservados.",
    },
    nl: {
        title: "Pexielle",
        reset: "Canvas resetten",
        download: "Afbeelding downloaden",
        sizeLabel: "Selecteer canvassize:",
        footer: "&copy; 2024 Pexielle. Alle rechten voorbehouden.",
    },
    ar: {
        title: "Pexielle",
        reset: "إعادة تعيين قماش",
        download: "تحميل الصورة",
        sizeLabel: "حدد حجم القماش:",
        footer: "&copy; 2024 Pexielle. كل الحقوق محفوظة.",
    },
    hi: {
        title: "Pexielle",
        reset: "कैनवास रीसेट करें",
        download: "छवि डाउनलोड करें",
        sizeLabel: "कैनवास का आकार चुनें:",
        footer: "&copy; 2024 Pexielle. सभी अधिकार सुरक्षित हैं।",
    },
    ja: {
        title: "Pexielle",
        reset: "キャンバスをリセット",
        download: "画像をダウンロード",
        sizeLabel: "キャンバスサイズを選択：",
        footer: "&copy; 2024 Pexielle. All rights reserved.",
    },
    ko: {
        title: "Pexielle",
        reset: "캔버스 재설정",
        download: "이미지 다운로드",
        sizeLabel: "캔버스 크기 선택:",
        footer: "&copy; 2024 Pexielle. 모든 권리 보유.",
    },
    zh: {
        title: "Pexielle",
        reset: "重置画布",
        download: "下载图片",
        sizeLabel: "选择画布大小：",
        footer: "&copy; 2024 Pexielle. 版權所有。",
    },
    ru: {
        title: "Pexielle",
        reset: "Сбросить холст",
        download: "Скачать изображение",
        sizeLabel: "Выберите размер холста:",
        footer: "&copy; 2024 Pexielle. Все права защищены.",
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

// Vérifie si le consentement a déjà été donné
if (!localStorage.getItem('cookies_accepted')) {
    document.getElementById('cookie-consent-banner').style.display = 'block';
}

document.getElementById('accept-cookies').addEventListener('click', function() {
    // Enregistre le consentement dans le stockage local
    localStorage.setItem('cookies_accepted', 'true');
    // Cache le bandeau
    document.getElementById('cookie-consent-banner').style.display = 'none';
    // Définir les cookies
    setCookies();
});

document.getElementById('reject-cookies').addEventListener('click', function() {
    // Cache le bandeau sans accepter
    document.getElementById('cookie-consent-banner').style.display = 'none';
    // Refuser les cookies (en ne les définissant pas)
    rejectCookies();
});


// Fonctions pour définir et refuser les cookies
function setCookies() {
    // Exemple de cookie à définir
    document.cookie = "user_accepted_cookies=true; path=/; max-age=" + 60 * 60 * 24 * 365;  // Durée 1 an
}

function rejectCookies() {
    // Vous pouvez également ajouter une logique pour empêcher l'utilisation de cookies
    // par exemple, en supprimant les cookies existants ou en ne définissant aucun cookie
    console.log('Les cookies sont refusés.');
}
