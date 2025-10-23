const fs = require("fs");  // 🔹 Katjib module "fs" (file system) bach tkhdem b les fichiers w dossiers.
const path = require("path");  // 🔹 Katjib module "path" bach t3mel b les chemins (path) dyal les fichiers b tariqa sahla.

fs.readdir(__dirname, (err, files) => {  // 🔹 Katqra contenu dyal dossier li fih had fichier (dir courant).
    if (err) return console.log("Erreur: ", err.message);     // 🔹 Ila kan chi khata’ f qra2a dyal dossier, kay affichi l’erreur.

    console.log("Contenu du dossier :", files);    // 🔹 Kat-affichi smiyat les fichiers li kaynin f dossier.
    files.forEach(f => { // 🔹 Katdor 3la kol fichier wahd b wahd.

        console.log(path.join(__dirname, f));        // 🔹 Kat-affichi chemin kamel (path complet) dyal fichier.
        const filePath = path.join(__dirname, f);        // 🔹 Katcréyi variable filePath li fih chemin kamel dyal fichier.
        const stats = fs.statSync(filePath);        // 🔹 Katjib ma3lomat 3la fichier (b7al date, taille, etc).
        const contenuLog = `Nombre des fichiers : ${files.length}, date: ${stats.birthtime} \n`; // 🔹 Katcréyi texte li fih nombre de fichiers w date de création dyal fichier.
        
        fs.writeFileSync("log.txt", contenuLog, { flag : "a" });         // 🔹 Katktb had ma3lomat f fichier "log.txt", w {flag: "a"} bach tzid lma3lomat bla ma tmsa7 l9dima.
    });
});
