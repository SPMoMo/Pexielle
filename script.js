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
    if (isAddingText) return;
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

// Gestion du pied de page
const currentYear = new Date().getFullYear();
document.getElementById("footer").innerHTML = `&copy; ${currentYear} Pexielle. Tous droits réservés.`;

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
        undoButton: "Annuler",
        redoButton: "Refaire",
        imageInput: "Ajouter une Image:",
        textInput: "Ajouter un Texte:",
        addTextButton: "Ajouter le Texte",
        textInputplaceholder: "Entrez votre texte ici",
    },
    tr: {
        title: "Pexielle",
        reset: "Tuvali sıfırla",
        download: "Resmi İndir",
        sizeLabel: "Tuval boyutunu seçin:",
        footer: "&copy; 2024 Pexielle. Tüm hakları saklıdır.",
        undoButton: "Geri Al",
        redoButton: "Yeniden Yap",
        imageInput: "Resim Ekle:",
        textInput: "Metin Ekle:",
        addTextButton: "Metni Ekle",
        textInputplaceholder: "Metninizi buraya girin",
    },
    sv: {
        title: "Pexielle",
        reset: "Återställ duk",
        download: "Ladda ner bild",
        sizeLabel: "Välj dukstorlek:",
        footer: "&copy; 2024 Pexielle. Alla rättigheter förbehållna.",
        undoButton: "Ångra",
        redoButton: "Gör om",
        imageInput: "Lägg till bild:",
        textInput: "Lägg till text:",
        addTextButton: "Lägg till text",
        textInputplaceholder: "Ange din text här",
    },
    en: {
        title: "Pexielle",
        reset: "Reset Canvas",
        download: "Download Image",
        sizeLabel: "Select Canvas Size:",
        footer: "&copy; 2024 Pexielle. All rights reserved.",
        undoButton: "Undo",
        redoButton: "Redo",
        imageInput: "Add Image:",
        textInput: "Add Text:",
        addTextButton: "Add Text",
        textInputplaceholder: "Enter your text here",
    },
    es: {
        title: "Pexielle",
        reset: "Restablecer lienzo",
        download: "Descargar imagen",
        sizeLabel: "Seleccionar tamaño del lienzo:",
        footer: "&copy; 2024 Pexielle. Todos los derechos reservados.",
        undoButton: "Deshacer",
        redoButton: "Rehacer",
        imageInput: "Agregar imagen:",
        textInput: "Agregar texto:",
        addTextButton: "Agregar texto",
        textInputplaceholder: "Ingrese su texto aquí",
    },
    de: {
        title: "Pexielle",
        reset: "Leinwand zurücksetzen",
        download: "Bild herunterladen",
        sizeLabel: "Leinwandgröße auswählen:",
        footer: "&copy; 2024 Pexielle. Alle Rechte vorbehalten.",
        undoButton: "Rückgängig machen",
        redoButton: "Wiederholen",
        imageInput: "Bild hinzufügen:",
        textInput: "Text hinzufügen:",
        addTextButton: "Text hinzufügen",
        textInputplaceholder: "Geben Sie hier Ihren Text ein",
    },
    it: {
        title: "Pexielle",
        reset: "Ripristina la tela",
        download: "Scarica immagine",
        sizeLabel: "Seleziona la dimensione della tela:",
        footer: "&copy; 2024 Pexielle. Tutti i diritti riservati.",
        undoButton: "Annulla",
        redoButton: "Rifare",
        imageInput: "Aggiungi immagine:",
        textInput: "Aggiungi testo:",
        addTextButton: "Aggiungi testo",
        textInputplaceholder: "Inserisci il tuo testo qui",
    },
    pt: {
        title: "Pexielle",
        reset: "Redefinir Tela",
        download: "Baixar Imagem",
        sizeLabel: "Selecione o Tamanho da Tela:",
        footer: "&copy; 2024 Pexielle. Todos os direitos reservados.",
        undoButton: "Desfazer",
        redoButton: "Refazer",
        imageInput: "Adicionar Imagem:",
        textInput: "Adicionar Texto:",
        addTextButton: "Adicionar Texto",
        textInputplaceholder: "Insira seu texto aqui",
    },
    nl: {
        title: "Pexielle",
        reset: "Canvas resetten",
        download: "Afbeelding downloaden",
        sizeLabel: "Selecteer canvassize:",
        footer: "&copy; 2024 Pexielle. Alle rechten voorbehouden.",
        undoButton: "Ongedaan maken",
        redoButton: "Opnieuw doen",
        imageInput: "Afbeelding toevoegen:",
        textInput: "Tekst toevoegen:",
        addTextButton: "Tekst toevoegen",
        textInputplaceholder: "Voer hier uw tekst in",
    },
    ar: {
        title: "Pexielle",
        reset: "إعادة تعيين قماش",
        download: "تحميل الصورة",
        sizeLabel: "حدد حجم القماش:",
        footer: "&copy; 2024 Pexielle. كل الحقوق محفوظة.",
        undoButton: "تراجع",
        redoButton: "إعادة",
        imageInput: "إضافة صورة:",
        textInput: "إضافة نص:",
        addTextButton: "إضافة نص",
        textInputplaceholder: "أدخل نصك هنا",
    },
    hi: {
        title: "Pexielle",
        reset: "कैनवास रीसेट करें",
        download: "छवि डाउनलोड करें",
        sizeLabel: "कैनवास का आकार चुनें:",
        footer: "&copy; 2024 Pexielle. सभी अधिकार सुरक्षित हैं।",
        undoButton: "पूर्ववत करें",
        redoButton: "फिर से करें",
        imageInput: "छवि जोड़ें:",
        textInput: "पाठ जोड़ें:",
        addTextButton: "पाठ जोड़ें",
        textInputplaceholder: "यहाँ अपना पाठ दर्ज करें",
    },
    ja: {
        title: "Pexielle",
        reset: "キャンバスをリセット",
        download: "画像をダウンロード",
        sizeLabel: "キャンバスサイズを選択：",
        footer: "&copy; 2024 Pexielle. すべての権利を保有しています。",
        undoButton: "元に戻す",
        redoButton: "やり直す",
        imageInput: "画像を追加:",
        textInput: "テキストを追加:",
        addTextButton: "テキストを追加",
        textInputplaceholder: "ここにテキストを入力してください",
    },
    ko: {
        title: "Pexielle",
        reset: "캔버스 재설정",
        download: "이미지 다운로드",
        sizeLabel: "캔버스 크기 선택:",
        footer: "&copy; 2024 Pexielle. 모든 권리 보유.",
        undoButton: "실행 취소",
        redoButton: "다시 실행",
        imageInput: "이미지 추가:",
        textInput: "텍스트 추가:",
        addTextButton: "텍스트 추가",
        textInputplaceholder: "여기에 텍스트 입력",
    },
    zh: {
        title: "Pexielle",
        reset: "重置画布",
        download: "下载图片",
        sizeLabel: "选择画布大小：",
        footer: "&copy; 2024 Pexielle. 版權所有。",
        undoButton: "撤消",
        redoButton: "重做",
        imageInput: "添加图片:",
        textInput: "添加文本:",
        addTextButton: "添加文本",
        textInputplaceholder: "在此输入您的文本",
    },
    ru: {
        title: "Pexielle",
        reset: "Сбросить холст",
        download: "Скачать изображение",
        sizeLabel: "Выберите размер холста:",
        footer: "&copy; 2024 Pexielle. Все права защищены.",
        undoButton: "Отменить",
        redoButton: "Повторить",
        imageInput: "Добавить изображение:",
        textInput: "Добавить текст:",
        addTextButton: "Добавить текст",
        textInputplaceholder: "Введите ваш текст здесь",
    },
};

// Gestion des changements de langue
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("resetButton").textContent = translations[lang].reset;
    document.getElementById("downloadButton").textContent = translations[lang].download;
    document.querySelector(".canvas-size label").textContent = translations[lang].sizeLabel;
    document.getElementById("footer").innerHTML = translations[lang].footer;
    document.getElementById("undoButton").textContent = translations[lang].undoButton;
    document.getElementById("redoButton").textContent = translations[lang].redoButton;
    document.querySelector("label[for='imageInput']").textContent = translations[lang].imageInput;
    document.querySelector("label[for='textInput']").textContent = translations[lang].textInput;
    document.getElementById("addTextButton").textContent = translations[lang].addTextButton;
    document.getElementById("textInput").placeholder = translations[lang].textInputplaceholder;
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

// Historique des actions pour annuler/refaire
let history = [];
let historyIndex = -1;

// Fonction pour sauvegarder l'état actuel du canevas
function saveState() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(canvas.toDataURL());
    historyIndex++;
    updateUndoRedoButtons();
}

// Mettre à jour l'état des boutons Annuler/Refaire
function updateUndoRedoButtons() {
    document.getElementById("undoButton").disabled = historyIndex <= 0;
    document.getElementById("redoButton").disabled = historyIndex >= history.length - 1;
}

// Annuler la dernière action
document.getElementById("undoButton").addEventListener("click", function() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState();
    }
});

// Refaire l'action annulée
document.getElementById("redoButton").addEventListener("click", function() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState();
    }
});

// Restaurer l'état du canevas à partir de l'historique
function restoreState() {
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    updateUndoRedoButtons();
}

// Sauvegarder l'état initial
saveState();

// Sauvegarder l'état après chaque dessin
canvas.addEventListener("mouseup", saveState);
canvas.addEventListener("touchend", saveState);

// Ajouter une image sur le canevas
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                saveState(); // Sauvegarder l'état après l'ajout de l'image
            };
        };
        reader.readAsDataURL(file);
    }
});

// Ajouter un texte sur le canevas
const addTextButton = document.getElementById("addTextButton");
let isAddingText = false;

addTextButton.addEventListener("click", function() {
    const textInput = document.getElementById("textInput").value;
    if (textInput) {
        isAddingText = true;
        canvas.style.cursor = "crosshair";
    }
});

canvas.addEventListener("click", function(event) {
    if (isAddingText) {
        const x = event.offsetX;
        const y = event.offsetY;
        const textInput = document.getElementById("textInput").value;
        ctx.fillStyle = currentColor;
        ctx.font = `${pixelSize * 2}px Arial`;
        ctx.fillText(textInput, x, y);
        saveState(); // Sauvegarder l'état après l'ajout du texte
        isAddingText = false;
        canvas.style.cursor = "default";
    }
});

canvas.addEventListener("mousedown", function(event) {
    if (!isAddingText) {
        isMouseDown = true;
        drawPixel(event);
    }
});
// Ajouter une indication visuelle pour l'ajout de texte
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
tooltip.style.color = "#fff";
tooltip.style.padding = "5px";
tooltip.style.borderRadius = "3px";
tooltip.style.pointerEvents = "none";
tooltip.style.display = "none";
tooltip.textContent = "Cliquez pour ajouter le texte sur le canevas";
document.body.appendChild(tooltip);

canvas.addEventListener("mousemove", function(event) {
    if (isAddingText) {
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
        tooltip.style.display = "block";
    } else {
        tooltip.style.display = "none";
    }
});
document.addEventListener("mousemove", function(event) {
    if (isAddingText) {
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
        tooltip.style.display = "block";
    } else {
        tooltip.style.display = "none";
    }
});
// Traductions pour l'indication visuelle d'ajout de texte
const tooltipTranslations = {
    fr: "Cliquez pour ajouter le texte sur le canevas",
    tr: "Metni tuvale eklemek için tıklayın",
    sv: "Klicka för att lägga till text på duken",
    en: "Click to add text to the canvas",
    es: "Haga clic para agregar texto al lienzo",
    de: "Klicken Sie, um Text auf die Leinwand hinzuzufügen",
    it: "Clicca per aggiungere testo alla tela",
    pt: "Clique para adicionar texto à tela",
    nl: "Klik om tekst aan het canvas toe te voegen",
    ar: "انقر لإضافة نص إلى القماش",
    hi: "कैनवास पर टेक्स्ट जोड़ने के लिए क्लिक करें",
    ja: "キャンバスにテキストを追加するにはクリックしてください",
    ko: "캔버스에 텍스트를 추가하려면 클릭하세요",
    zh: "点击以将文本添加到画布",
    ru: "Нажмите, чтобы добавить текст на холст"
};

// Mettre à jour l'indication visuelle lors du changement de langue
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    tooltip.textContent = tooltipTranslations[lang];
});
