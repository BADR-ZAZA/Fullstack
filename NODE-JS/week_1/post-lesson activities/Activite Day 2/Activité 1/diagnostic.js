const os = require("os"); //➡️ Katjib module os bach tjib ma3lomat 3la système.

console.log("platforme :", os.platform()); //➡️ Kat-affichi naw3 dyal système (Windows, Linux, Mac...).
console.log("Architecture :", os.arch()); //➡️ Kat-affichi architecture dyal processeur (b7al x64, arm...).
console.log("CPU :", os.cpus().length, "Coeurs");//➡️ Kat-affichi ch7al men cœur 3and l-processeur.
console.log("Memoire totale :", os.totalmem());//➡️ Kat-affichi ch7al mn RAM total kayn f l-ordinateur.
console.log("Memoire libre :", os.freemem());//➡️ Kat-affichi RAM li mazal fargha (ma mst3mla ch).
console.log("Uptime (en heures) :", (os.uptime() / 3600).toFixed(2));//➡️ kat-affichi ch7al man sa3a l ordinateur khdam bla ma itfa.




// ✅ os.platform() → renvoie le type de système d’exploitation (ex: 'win32', 'linux', 'darwin').
// ✅ os.arch() → renvoie l’architecture du processeur (ex: 'x64', 'arm64', 'ia32').

// 💡 Utilité : Ces infos servent à afficher ou adapter le comportement 
// d’une appli (ex: tableau de bord système, installation selon l’OS ou l’architecture).