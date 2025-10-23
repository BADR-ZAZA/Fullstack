const http = require("http");
// 🔹 Katjib module "http" bach tcreate server web b Node.js.

const Logger = require("./logger");
// 🔹 Katjib class Logger men fichier "logger.js" li drna 9bl.

const logger = new Logger();
// 🔹 Katcréyi wa7d l-instance men class Logger bach nkhdmu biha.

logger.on("messageLogged", (data) => 
    console.log("Evenement capture :", data)
);
// 🔹 Katssma3 l-event "messageLogged" li katsifto class Logger.
// 🔹 Mlli l-event yti7, kay-affichi data (message + date).

const server = http.createServer((req, res) => {
// 🔹 Katcréyi serveur web li kaytsenna les requêtes dyal utilisateurs.

    logger.log(`Requete recue : ${req.url}`);
    // 🔹 Kol ma kayji chi requête, kattsajlha (katktbha f log.txt) b l’URL dyalha.
    // 🔹 W kattsift event "messageLogged".

    res.end("Requete enregistree !");
    // 🔹 Katrd 3la utilisateur b had message bach t9ollo bli requête tsajlat.
});

server.listen(4000, () => console.log("Serveur sur le port 4000..."));
// 🔹 Katkhlli serveur ybda ytsenna f les requêtes f port 4000.
// 🔹 W kat-affichi message f console bach t3rf bli serveur khddam.
