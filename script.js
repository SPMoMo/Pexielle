// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");

// Taille des pixels sur le canevas
const pixelSize = 15;  // Taille de chaque pixel
let rows, cols;
// Forme par défaut du pinceau
let brushShape = "square"; // Forme par défaut du pinceau
let brushSize = 1; // Taille par défaut du pinceau
let isAddingText = false; // Variable pour vérifier si l'utilisateur ajoute du texte

// FIX: Couleur courante initialisée pour éviter les erreurs et voir le tracé
let currentColor = "#000000";

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
let isDrawing = false;

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

canvas.addEventListener("pointerdown", (e) => {
  if (isAddingText) return;
  isDrawing = true;
  canvas.setPointerCapture(e.pointerId);
  drawPixel(e);
});

canvas.addEventListener("pointermove", (e) => {
  if (!isDrawing) return;
  drawPixel(e);
});

function endStroke(e) {
  if (!isDrawing) return;
  isDrawing = false;
  try { canvas.releasePointerCapture(e.pointerId); } catch {}
  saveState();
}

canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
canvas.addEventListener("pointerleave", endStroke);

// Dessiner un pixel avec la taille et la forme du pinceau
function drawPixel(event) {
    const x = Math.floor(event.offsetX / pixelSize);
    const y = Math.floor(event.offsetY / pixelSize);
    ctx.fillStyle = currentColor;

    switch (brushShape) {
        case "square":
            ctx.fillRect(x * pixelSize, y * pixelSize, brushSize * pixelSize, brushSize * pixelSize);
            break;
        case "circle":
            ctx.beginPath();
            ctx.arc(x * pixelSize + pixelSize / 2, y * pixelSize + pixelSize / 2, brushSize * pixelSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case "triangle":
            ctx.beginPath();
            ctx.moveTo(x * pixelSize, y * pixelSize + brushSize * pixelSize);
            ctx.lineTo(x * pixelSize + brushSize * pixelSize / 2, y * pixelSize);
            ctx.lineTo(x * pixelSize + brushSize * pixelSize, y * pixelSize + brushSize * pixelSize);
            ctx.closePath();
            ctx.fill();
            break;
        case "star":
            drawStar(ctx, x * pixelSize + brushSize * pixelSize / 2, y * pixelSize + brushSize * pixelSize / 2, 5, brushSize * pixelSize / 2, brushSize * pixelSize / 4);
            break;
        case "heart":
            drawHeart(ctx, x * pixelSize, y * pixelSize, brushSize * pixelSize, brushSize * pixelSize);
            break;
    }
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
    saveState(); // on garde l’état vidé dans l’historique
});

// Télécharger l'image au format pixel-art-DDMMYYYY-HHMMSS.png
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = `pixel-art-${new Date().toISOString().replace(/[:.-]/g, "").slice(0,15)}.png`;
    link.href = canvas.toDataURL();
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
        brushSizeLabel: "Sélectionnez la taille du pinceau:",
        brushShapeLabel: "Sélectionnez la forme du pinceau:",
        brushShapeOptions: {
            square: "Carré",
            circle: "Cercle",
            triangle: "Triangle",
            star: "Étoile",
            heart: "Cœur"
        },
        eraserButton: "Gomme",
        cookieConsent: {
            message: "Ce site utilise des cookies pour vous offrir la meilleure expérience utilisateur. En utilisant ce site, vous acceptez notre utilisation des cookies.",
            accept: "Accepter",
            reject: "Refuser"
        },
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
        brushSizeLabel: "Fırça Boyutunu Seçin:",
        brushShapeLabel: "Fırça Şeklini Seçin:",
        brushShapeOptions: {
            square: "Kare",
            circle: "Daire",
            triangle: "Üçgen",
            star: "Yıldız",
            heart: "Kalp"
        },
        eraserButton: "Silgi",
        cookieConsent: {
            message: "Bu site, size en iyi kullanıcı deneyimini sunmak için çerezler kullanır. Bu siteyi kullanarak, çerez kullanımımızı kabul etmiş olursunuz.",
            accept: "Kabul Et",
            reject: "Reddet"
        },
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
        brushSizeLabel: "Välj penselstorlek:",
        brushShapeLabel: "Välj penselform:",
        brushShapeOptions: {
            square: "Fyrkant",
            circle: "Cirkel",
            triangle: "Triangel",
            star: "Stjärna",
            heart: "Hjärta"
        },
        eraserButton: "Suddgummi",
        cookieConsent: {
            message: "Denna webbplats använder cookies för att ge dig den bästa användarupplevelsen. Genom att använda denna webbplats godkänner du vår användning av cookies.",
            accept: "Acceptera",
            reject: "Avvisa"
        },
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
        brushSizeLabel: "Select Brush Size:",
        brushShapeLabel: "Select Brush Shape:",
        brushShapeOptions: {
            square: "Square",
            circle: "Circle",
            triangle: "Triangle",
            star: "Star",
            heart: "Heart"
        },
        eraserButton: "Eraser",
        cookieConsent: {
            message: "This site uses cookies to ensure you get the best user experience. By using this site, you agree to our use of cookies.",
            accept: "Accept",
            reject: "Reject"
        },
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
        brushSizeLabel: "Seleccionar tamaño del pincel:",
        brushShapeLabel: "Seleccionar forma del pincel:",
        brushShapeOptions: {
            square: "Cuadrado",
            circle: "Círculo",
            triangle: "Triángulo",
            star: "Estrella",
            heart: "Corazón"
        },
        eraserButton: "Borrador",
        cookieConsent: {
            message: "Este sitio utiliza cookies para garantizar que obtenga la mejor experiencia de usuario. Al usar este sitio, usted acepta nuestro uso de cookies.",
            accept: "Aceptar",
            reject: "Rechazar"
        },
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
        brushSizeLabel: "Pinselgröße auswählen:",
        brushShapeLabel: "Pinselform auswählen:",
        brushShapeOptions: {
            square: "Quadrat",
            circle: "Kreis",
            triangle: "Dreieck",
            star: "Stern",
            heart: "Herz"
        },
        eraserButton: "Radiergummi",
        cookieConsent: {
            message: "Diese Seite verwendet Cookies, um Ihnen die beste Benutzererfahrung zu bieten. Durch die Nutzung dieser Seite stimmen Sie unserer Verwendung von Cookies zu.",
            accept: "Akzeptieren",
            reject: "Ablehnen"
        },
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
        brushSizeLabel: "Seleziona la dimensione del pennello:",
        brushShapeLabel: "Seleziona la forma del pennello:",
        brushShapeOptions: {
            square: "Quadrato",
            circle: "Cerchio",
            triangle: "Triangolo",
            star: "Stella",
            heart: "Cuore"
        },
        eraserButton: "Gomma",
        cookieConsent: {
            message: "Questo sito utilizza i cookie per garantirti la migliore esperienza utente. Utilizzando questo sito, accetti il nostro utilizzo dei cookie.",
            accept: "Accetta",
            reject: "Rifiuta"
        },
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
        brushSizeLabel: "Selecione o Tamanho do Pincel:",
        brushShapeLabel: "Selecione a Forma do Pincel:",
        brushShapeOptions: {
            square: "Quadrado",
            circle: "Círculo",
            triangle: "Triângulo",
            star: "Estrela",
            heart: "Coração"
        },
        eraserButton: "Borracha",
        cookieConsent: {
            message: "Este site usa cookies para garantir que você obtenha a melhor experiência do usuário. Ao usar este site, você concorda com o uso de cookies.",
            accept: "Aceitar",
            reject: "Rejeitar"
        },
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
        brushSizeLabel: "Selecteer penseelgrootte:",
        brushShapeLabel: "Selecteer penseelvorm:",
        brushShapeOptions: {
            square: "Vierkant",
            circle: "Cirkel",
            triangle: "Driehoek",
            star: "Ster",
            heart: "Hart"
        },
        eraserButton: "Gum",
        cookieConsent: {
            message: "Deze site gebruikt cookies om u de beste gebruikerservaring te bieden. Door deze site te gebruiken, gaat u akkoord met ons gebruik van cookies.",
            accept: "Accepteren",
            reject: "Weigeren"
        },
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
        brushSizeLabel: "حدد حجم الفرشاة:",
        brushShapeLabel: "حدد شكل الفرشاة:",
        brushShapeOptions: {
            square: "مربع",
            circle: "دائرة",
            triangle: "مثلث",
            star: "نجمة",
            heart: "قلب"
        },
        eraserButton: "ممحاة",
        cookieConsent: {
            message: "يستخدم هذا الموقع ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة مستخدم. باستخدام هذا الموقع، فإنك توافق على استخدامنا لملفات تعريف الارتباط.",
            accept: "أوافق",
            reject: "أرفض"
        },
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
        brushSizeLabel: "ब्रश का आकार चुनें:",
        brushShapeLabel: "ब्रश का आकार चुनें:",
        brushShapeOptions: {
            square: "वर्ग",
            circle: "वृत्त",
            triangle: "त्रिकोण",
            star: "तारा",
            heart: "दिल"
        },
        eraserButton: "रबर",
        cookieConsent: {
            message: "यह साइट आपको सर्वोत्तम उपयोगकर्ता अनुभव सुनिश्चित करने के लिए कुकीज़ का उपयोग करती है। इस साइट का उपयोग करके, आप हमारी कुकीज़ के उपयोग से सहमत हैं।",
            accept: "स्वीकार करें",
            reject: "अस्वीकार करें"
        },
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
        brushSizeLabel: "ブラシサイズを選択：",
        brushShapeLabel: "ブラシの形状を選択：",
        brushShapeOptions: {
            square: "四角",
            circle: "円",
            triangle: "三角",
            star: "星",
            heart: "ハート"
        },
        eraserButton: "消しゴム",
        cookieConsent: {
            message: "このサイトは、最高のユーザーエクスペリエンスを提供するためにクッキーを使用しています。このサイトを使用することで、クッキーの使用に同意したことになります。",
            accept: "同意する",
            reject: "拒否する"
        },
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
        brushSizeLabel: "브러시 크기 선택:",
        brushShapeLabel: "브러시 모양 선택:",
        brushShapeOptions: {
            square: "정사각형",
            circle: "원",
            triangle: "삼각형",
            star: "별",
            heart: "하트"
        },
        eraserButton: "지우개",
        cookieConsent: {
            message: "이 사이트는 최상의 사용자 경험을 제공하기 위해 쿠키를 사용합니다. 이 사이트를 사용함으로써 쿠키 사용에 동의하게 됩니다.",
            accept: "동의",
            reject: "거부"
        },
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
        brushSizeLabel: "选择画笔大小：",
        brushShapeLabel: "选择画笔形状：",
        brushShapeOptions: {
            square: "方形",
            circle: "圆形",
            triangle: "三角形",
            star: "星形",
            heart: "心形"
        },
        eraserButton: "橡皮擦",
        cookieConsent: {
            message: "本网站使用Cookie以确保您获得最佳用户体验。使用本网站即表示您同意我们使用Cookie。",
            accept: "接受",
            reject: "拒绝"
        },
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
        brushSizeLabel: "Выберите размер кисти:",
        brushShapeLabel: "Выберите форму кисти:",
        brushShapeOptions: {
            square: "Квадрат",
            circle: "Круг",
            triangle: "Треугольник",
            star: "Звезда",
            heart: "Сердце"
        },
        eraserButton: "Ластик",
        cookieConsent: {
            message: "Этот сайт использует файлы cookie, чтобы обеспечить вам лучший пользовательский опыт. Используя этот сайт, вы соглашаетесь с нашим использованием файлов cookie.",
            accept: "Принять",
            reject: "Отклонить"
        },
    },
};

// Gestion améliorée des changements de langue
languageSelect.addEventListener("change", function(event) {
  const lang = event.target.value;
  if (translations[lang]) {
    const t = translations[lang];
    // Utilitaire pour changer le texte ou placeholder
        function updateElement(selector, prop, value) {
            document.querySelectorAll(selector).forEach(el => {
                el[prop] = value;
            });
        }
        // Mise à jour des textes
        updateElement("#title", "textContent", t.title);
        updateElement("#resetButton", "textContent", t.reset);
        updateElement("#downloadButton", "textContent", t.download);
        updateElement(".canvas-size label", "textContent", t.sizeLabel);
        updateElement("#footer", "innerHTML", t.footer.replace("2024", new Date().getFullYear()));
        updateElement("#undoButton", "textContent", t.undoButton);
        updateElement("#redoButton", "textContent", t.redoButton);
        updateElement("label[for='imageInput']", "textContent", t.imageInput);
        updateElement("label[for='textInput']", "textContent", t.textInput);
        updateElement("#addTextButton", "textContent", t.addTextButton);
        updateElement("#textInput", "placeholder", t.textInputplaceholder);
        updateElement(".brush-size label", "textContent", t.brushSizeLabel);
        updateElement(".brush-shape label", "textContent", t.brushShapeLabel);
        updateElement("#brushShapeSelect", "innerHTML", Object.entries(t.brushShapeOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join(''));
        updateElement("#eraserButton", "textContent", t.eraserButton);
        updateElement("#cookie-consent-message", "textContent", t.cookieConsent.message);
        updateElement("#accept-cookies", "textContent", t.cookieConsent.accept);
        updateElement("#reject-cookies", "textContent", t.cookieConsent.reject);
    if (typeof tooltip !== "undefined") {
      tooltip.textContent = tooltipTranslations[lang];
    }
  }
});

// Le langage par défaut est le Français
languageSelect.value = "fr";
languageSelect.dispatchEvent(new Event("change"));

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

// Désactiver le lissage des images pour un effet pixelisé
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";

// Ajouter un texte sur le canevas
const addTextButton = document.getElementById("addTextButton");
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

// Gestion de la taille du pinceau
const brushSizeSelect = document.getElementById("brushSizeSelect");
brushSize = parseInt(brushSizeSelect.value);

brushSizeSelect.addEventListener("change", function(event) {
    brushSize = parseInt(event.target.value);
});

// Gestion de la forme du pinceau
const brushShapeSelect = document.getElementById("brushShapeSelect");
brushShape = brushShapeSelect.value;

brushShapeSelect.addEventListener("change", function(event) {
    brushShape = event.target.value;
});

// Dessiner une étoile beaucoup plus précise
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

// Dessiner un cœur beacoup plus précis
function drawHeart(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y + height / 4);
    ctx.quadraticCurveTo(x, y, x + width / 4, y);
    ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + height / 4);
    ctx.quadraticCurveTo(x + width / 2, y, x + width * 3 / 4, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + height / 4);
    ctx.quadraticCurveTo(x + width, y + height * 2 / 3, x + width / 2, y + height);
    ctx.quadraticCurveTo(x, y + height * 2 / 3, x, y + height / 4);
    ctx.fill();
}

// Récupère l'élément audio pour l'effet pop-it
const popItSound = document.getElementById('popItSound');

// Récupère tous les éléments avec la classe .color-box pour l'effet pop-it
const popItColorBoxes = document.querySelectorAll(".color-box");

// Ajoute un écouteur d'événement sur chaque boîte de couleur pour jouer le son
popItColorBoxes.forEach(box => {
    box.addEventListener("click", () => {
        // Joue le son de pop-it
        popItSound.currentTime = 0;  // Rewind pour jouer le son depuis le début
        popItSound.volume = 1;       // Assure que le volume est au maximum
        popItSound.play();
    });
});

// Écouter les changements du select
document.getElementById('fontSelect').addEventListener('change', function() {
    document.body.style.fontFamily = this.value;
});

// Fonction pour créer un élément dans le DOM
function createElement(tag, properties) {
    let element = document.createElement(tag);
    for (let prop in properties) {
        element[prop] = properties[prop];
    }
    return element;
}

// Fonction pour que le pied de page se mette à jour automatiquement
function updateFooter() {
    let currentYear = new Date().getFullYear();
    document.getElementById("footer").innerHTML = `&copy; ${currentYear} Pexielle. Tous droits réservés.`;
}

// Appeler la fonction pour mettre à jour le pied de page
updateFooter();

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments de sélection
    const canvasSizeSelect = document.getElementById("canvasSizeSelect");
    const brushSizeSelect = document.getElementById("brushSizeSelect");
    const brushShapeSelect = document.getElementById("brushShapeSelect");
  
    // Fonction qui vérifie les sélections
    function checkEasterEgg() {
      const canvasSize = canvasSizeSelect.value;
      const brushSize = brushSizeSelect.value;
      const brushShape = brushShapeSelect.value;
  
      // Vérifie si les conditions sont remplies pour l'easter egg
      if (canvasSize === "625" && brushSize === "6" && brushShape === "triangle") {
        document.body.classList.add("easter-egg-active");
      } else {
        document.body.classList.remove("easter-egg-active");
      }
    }
  
    // Ajouter un événement pour chaque sélecteur pour vérifier les conditions
    canvasSizeSelect.addEventListener("change", checkEasterEgg);
    brushSizeSelect.addEventListener("change", checkEasterEgg);
    brushShapeSelect.addEventListener("change", checkEasterEgg);
  
    // Vérifier dès le chargement de la page au cas où les valeurs seraient déjà sélectionnées
    checkEasterEgg();
});

// Mettre à jour l'année actuelle dans le pied de page pour chaque langue
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("resetButton").textContent = translations[lang].reset;
    document.getElementById("downloadButton").textContent = translations[lang].download;
    document.querySelector(".canvas-size label").textContent = translations[lang].sizeLabel;
    document.getElementById("footer").innerHTML = translations[lang].footer.replace("2024", new Date().getFullYear());
    document.getElementById("undoButton").textContent = translations[lang].undoButton;
    document.getElementById("redoButton").textContent = translations[lang].redoButton;
    document.querySelector("label[for='imageInput']").textContent = translations[lang].imageInput;
    document.querySelector("label[for='textInput']").textContent = translations[lang].textInput;
    document.getElementById("addTextButton").textContent = translations[lang].addTextButton;
    document.getElementById("textInput").placeholder = translations[lang].textInputplaceholder;
    document.querySelector(".brush-size label").textContent = translations[lang].brushSizeLabel;
    document.querySelector(".brush-shape label").textContent = translations[lang].brushShapeLabel;
    tooltip.textContent = tooltipTranslations[lang];
});

// Fonction de la gomme
const eraserButton = document.getElementById("eraserButton");

function setEraserActive(active) {
  isEraserActive = active;
  ctx.globalCompositeOperation = active ? "destination-out" : "source-over";
  eraserButton.style.backgroundColor = active ? "#ccc" : "";
  updateEraserCursor();
}

eraserButton.addEventListener("click", () => {
  setEraserActive(!isEraserActive);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "e" || event.key === "E") setEraserActive(true);
});
document.addEventListener("keyup", (event) => {
  if (event.key === "e" || event.key === "E") setEraserActive(false);
});

// Si on change de couleur/formes/taille, on sort du mode gomme
[colorPicker, brushSizeSelect, brushShapeSelect].forEach(el => {
  el.addEventListener("change", () => {
    if (isEraserActive) setEraserActive(false);
  });
  el.addEventListener("input", () => {
    if (isEraserActive) setEraserActive(false);
  });
});

// Mettre à jour le curseur en fonction de l'état de la gomme et de l'ajout de texte
function updateEraserCursor() {
  if (isEraserActive) {
    canvas.style.cursor = "crosshair";
  } else if (isAddingText) {
    canvas.style.cursor = "crosshair";
  } else {
    canvas.style.cursor = "cell";
  }
}

// Fonction pour activer le mode gomme
let isEraserActive = false;
document.getElementById("eraserButton").addEventListener("click", function() {
    isEraserActive = !isEraserActive;
    if (isEraserActive) {
        currentColor = "#FFFFFF"; // Couleur blanche pour effacer
        this.style.backgroundColor = "#ccc"; // Indiquer que la gomme est active
    } else {
        currentColor = colorPicker.value; // Revenir à la couleur sélectionnée
        this.style.backgroundColor = ""; // Réinitialiser le style du bouton
    }
});
// Désactiver le mode gomme lors du changement de couleur
colorPicker.addEventListener("input", function(event) {
    if (isEraserActive) {
        isEraserActive = false;
        document.getElementById("eraserButton").style.backgroundColor = ""; // Réinitialiser le style du bouton
    }
    currentColor = event.target.value;
});
// Désactiver le mode gomme lors du changement de forme ou taille du pinceau
brushSizeSelect.addEventListener("change", function() {
    if (isEraserActive) {
        isEraserActive = false;
        document.getElementById("eraserButton").style.backgroundColor = ""; // Réinitialiser le style du bouton
        currentColor = colorPicker.value; // Revenir à la couleur sélectionnée
    }
});
brushShapeSelect.addEventListener("change", function() {
    if (isEraserActive) {
        isEraserActive = false;
        document.getElementById("eraserButton").style.backgroundColor = ""; // Réinitialiser le style du bouton
        currentColor = colorPicker.value; // Revenir à la couleur sélectionnée
    }
});
// Fonction pour activer le mode gomme avec la touche "E"
document.addEventListener("keydown", function(event) {
    if (event.key === "e" || event.key === "E") {
        isEraserActive = true;
        currentColor = "#FFFFFF"; // Couleur blanche pour effacer
        document.getElementById("eraserButton").style.backgroundColor = "#ccc"; // Indiquer que la gomme est active
    }
});
document.addEventListener("keyup", function(event) {
    if (event.key === "e" || event.key === "E") {
        isEraserActive = false;
        currentColor = colorPicker.value; // Revenir à la couleur sélectionnée
        document.getElementById("eraserButton").style.backgroundColor = ""; // Réinitialiser le style du bouton
    }
});

// Afficher une indication visuelle pour l'activation de la gomme
const eraserTooltip = document.createElement("div");
eraserTooltip.style.position = "absolute";
eraserTooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
eraserTooltip.style.color = "#fff";
eraserTooltip.style.padding = "5px";
eraserTooltip.style.borderRadius = "3px";
eraserTooltip.style.pointerEvents = "none";
eraserTooltip.style.display = "none";
eraserTooltip.textContent = "Appuyez sur 'E' pour activer la gomme, relâchez pour désactiver";
document.body.appendChild(eraserTooltip);

eraserButton.addEventListener("mouseenter", function(event) {
    eraserTooltip.style.left = event.pageX + 10 + "px";
    eraserTooltip.style.top = event.pageY + 10 + "px";
    eraserTooltip.style.display = "block";
});
eraserButton.addEventListener("mousemove", function(event) {
    eraserTooltip.style.left = event.pageX + 10 + "px";
    eraserTooltip.style.top = event.pageY + 10 + "px";
});
eraserButton.addEventListener("mouseleave", function() {
    eraserTooltip.style.display = "none";
});

// Mettre à jour l'indication visuelle lors du changement de langue
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    if (lang === "fr") {
        eraserTooltip.textContent = "Appuyez sur 'E' pour activer la gomme, relâchez pour désactiver";
    } else if (lang === "en") {
        eraserTooltip.textContent = "Press 'E' to enable eraser, release to disable";
    } else if (lang === "es") {
        eraserTooltip.textContent = "Presiona 'E' para activar la goma, suelta para desactivar";
    } else if (lang === "de") {
        eraserTooltip.textContent = "Drücken Sie 'E', um den Radiergummi zu aktivieren, lassen Sie los, um ihn zu deaktivieren";
    } else if (lang === "it") {
        eraserTooltip.textContent = "Premi 'E' per attivare la gomma, rilascia per disattivare";
    } else if (lang === "pt") {
        eraserTooltip.textContent = "Pressione 'E' para ativar a borracha, solte para desativar";
    } else if (lang === "nl") {
        eraserTooltip.textContent = "Druk op 'E' om de gum in te schakelen, laat los om uit te schakelen";
    } else if (lang === "tr") {
        eraserTooltip.textContent = "'E' tuşuna basarak silgiyi etkinleştirin, devre dışı bırakmak için bırakın";
    } else if (lang === "sv") {
        eraserTooltip.textContent = "Tryck på 'E' för att aktivera suddgummit, släpp för att inaktivera";
    } else if (lang === "ar") {
        eraserTooltip.textContent = "اضغط على 'E' لتمكين الممحاة، اتركها لتعطيلها";
    } else if (lang === "hi") {
        eraserTooltip.textContent = "'E' दबाकर इरेज़र सक्षम करें, अक्षम करने के लिए छोड़ें";
    } else if (lang === "ja") {
        eraserTooltip.textContent = "'E'を押して消しゴムを有効にし、離して無効にします";
    } else if (lang === "ko") {
        eraserTooltip.textContent = "'E'를 눌러 지우개를 활성화하고 놓아서 비활성화합니다";
    } else if (lang === "zh") { 
        eraserTooltip.textContent = "按'E'启用橡皮擦，释放以禁用";
    } else if (lang === "ru") {
        eraserTooltip.textContent = "Нажмите 'E', чтобы включить ластик, отпустите, чтобы отключить";
    } else {
        eraserTooltip.textContent = "Press 'E' to enable eraser, release to disable";
    }
});

// Met à jour le curseur à chaque changement d'état de la gomme
document.getElementById("eraserButton").addEventListener("click", updateEraserCursor);
colorPicker.addEventListener("input", updateEraserCursor);
brushSizeSelect.addEventListener("change", updateEraserCursor);
brushShapeSelect.addEventListener("change", updateEraserCursor);
document.addEventListener("keydown", function(event) {
    if (event.key === "e" || event.key === "E") updateEraserCursor();
});
document.addEventListener("keyup", function(event) {
    if (event.key === "e" || event.key === "E") updateEraserCursor();
});

// Détecter automatiquement la langue du navigateur et l'appliquer
const userLang = navigator.language || navigator.userLanguage;
if (userLang) {
    const langCode = userLang.split('-')[0]; // Extraire le code de langue (ex: "fr" de "fr-FR")
    if (translations[langCode]) {
        languageSelect.value = langCode;
        languageSelect.dispatchEvent(new Event("change"));
    }
}

// Raccourcis clavier Undo/Redo (Windows, macOS, Linux)
document.removeEventListener("keydown", window.__undoRedoListener || (() => {})); // au cas où
window.__undoRedoListener = function(event) {
    // Ne pas intercepter si on est dans un champ de saisie
    const t = event.target;
    const isEditable = t && (t.isContentEditable || ["INPUT","TEXTAREA","SELECT"].includes(t.tagName));
    if (isEditable) return;

    const ctrlOrCmd = event.ctrlKey || event.metaKey;
    if (!ctrlOrCmd) return;

    const key = event.key.toLowerCase();

    // Undo: Ctrl/Cmd + Z (sans Shift)
    const isUndo = key === "z" && !event.shiftKey;

    // Redo: Ctrl/Cmd + Y OU Ctrl/Cmd + Shift + Z
    const isRedo = key === "y" || (key === "z" && event.shiftKey);

    if (isUndo) {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            restoreState();
        }
    } else if (isRedo) {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreState();
        }
    }
};
document.addEventListener("keydown", window.__undoRedoListener);

// Afficher une indication visuelle pour les raccourcis clavier Undo/Redo
const undoRedoTooltip = document.createElement("div");
undoRedoTooltip.style.position = "absolute";
undoRedoTooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
undoRedoTooltip.style.color = "#fff";
undoRedoTooltip.style.padding = "5px";
undoRedoTooltip.style.borderRadius = "3px";
undoRedoTooltip.style.pointerEvents = "none";
undoRedoTooltip.style.display = "none";
undoRedoTooltip.textContent = "Raccourcis: Ctrl/Cmd + Z pour Annuler, Ctrl/Cmd + Y ou Ctrl/Cmd + Shift + Z pour Refaire";
document.body.appendChild(undoRedoTooltip);
document.getElementById("undoButton").addEventListener("mouseenter", function(event) {
    undoRedoTooltip.style.left = event.pageX + 10 + "px";
    undoRedoTooltip.style.top = event.pageY + 10 + "px";
    undoRedoTooltip.style.display = "block";
});
document.getElementById("undoButton").addEventListener("mousemove", function(event) {
    undoRedoTooltip.style.left = event.pageX + 10 + "px";
    undoRedoTooltip.style.top = event.pageY + 10 + "px";
});
document.getElementById("undoButton").addEventListener("mouseleave", function() {
    undoRedoTooltip.style.display = "none";
});
document.getElementById("redoButton").addEventListener("mouseenter", function(event) {
    undoRedoTooltip.style.left = event.pageX + 10 + "px";
    undoRedoTooltip.style.top = event.pageY + 10 + "px";
    undoRedoTooltip.style.display = "block";
});
document.getElementById("redoButton").addEventListener("mousemove", function(event) {
    undoRedoTooltip.style.left = event.pageX + 10 + "px";
    undoRedoTooltip.style.top = event.pageY + 10 + "px";
});
document.getElementById("redoButton").addEventListener("mouseleave", function() {
    undoRedoTooltip.style.display = "none";
});

// Traductions pour l'indication visuelle des raccourcis clavier Undo/Redo
const undoRedoTooltipTranslations = {
    fr: "Raccourcis: Ctrl/Cmd + Z pour Annuler, Ctrl/Cmd + Y ou Ctrl/Cmd + Shift + Z pour Refaire",
    en: "Shortcuts: Ctrl/Cmd + Z to Undo, Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z to Redo",
    es: "Atajos: Ctrl/Cmd + Z para Deshacer, Ctrl/Cmd + Y o Ctrl/Cmd + Shift + Z para Rehacer",
    de: "Tastenkombinationen: Strg/Cmd + Z zum Rückgängig machen, Strg/Cmd + Y oder Strg/Cmd + Shift + Z zum Wiederholen",
    it: "Scorciatoie: Ctrl/Cmd + Z per Annulla, Ctrl/Cmd + Y o Ctrl/Cmd + Shift + Z per Ripeti",
    pt: "Atalhos: Ctrl/Cmd + Z para Desfazer, Ctrl/Cmd + Y ou Ctrl/Cmd + Shift + Z para Refazer",
    nl: "Sneltoetsen: Ctrl/Cmd + Z om ongedaan te maken, Ctrl/Cmd + Y of Ctrl/Cmd + Shift + Z om opnieuw te doen",
    tr: "Kısayollar: Geri Almak için Ctrl/Cmd + Z, Yeniden Yapmak için Ctrl/Cmd + Y veya Ctrl/Cmd + Shift + Z",
    sv: "Kortkommandon: Ctrl/Cmd + Z för att ångra, Ctrl/Cmd + Y eller Ctrl/Cmd + Shift + Z för att göra om",
    ar: "الاختصارات: Ctrl/Cmd + Z للتراجع، Ctrl/Cmd + Y أو Ctrl/Cmd + Shift + Z للإعادة",
    hi: "शॉर्टकट्स: पूर्ववत करने के लिए Ctrl/Cmd + Z, पुनः करने के लिए Ctrl/Cmd + Y या Ctrl/Cmd + Shift + Z",
    ja: "ショートカット：元に戻すにはCtrl/Cmd + Z、やり直すにはCtrl/Cmd + YまたはCtrl/Cmd + Shift + Z",
    ko: "단축키: 실행 취소하려면 Ctrl/Cmd + Z, 다시 실행하려면 Ctrl/Cmd + Y 또는 Ctrl/Cmd + Shift + Z",
    zh: "快捷键：按Ctrl/Cmd + Z撤销，按Ctrl/Cmd + Y或Ctrl/Cmd + Shift + Z重做",
    ru: "Сочетания клавиш: Ctrl/Cmd + Z для отмены, Ctrl/Cmd + Y или Ctrl/Cmd + Shift + Z для повтора"
};
languageSelect.addEventListener("change", function(event) {
    const lang = event.target.value;
    undoRedoTooltip.textContent = undoRedoTooltipTranslations[lang] || undoRedoTooltipTranslations["en"];
});
