const fs = require("fs");
const path = require("path");

const mediaFolder = path.join(__dirname, "media_view_once");

// Crée le dossier si nécessaire
if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder);
}

// Fonction pour enregistrer le média
function saveMedia(messageId, extension, buffer) {
    const filePath = path.join(mediaFolder, `${messageId}.${extension}`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Média stocké : ${filePath}`);
}

// Fonction pour récupérer le média
function getMedia(messageId, extension) {
    const filePath = path.join(mediaFolder, `${messageId}.${extension}`);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Média trouvé : ${filePath}`);
        return fs.readFileSync(filePath);
    }
    console.log(`❌ Média introuvable pour l'ID : ${messageId}`);
    return null;
}

module.exports = { saveMedia, getMedia };
