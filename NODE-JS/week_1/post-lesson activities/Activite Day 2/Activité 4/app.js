const Logger = require("./logger");
// 🔹 Katjib fichier "logger.js" li fih class Logger (module personnalisé).

const logger = new Logger();
// 🔹 Katcréyi wa7d l’objet men class Logger bach tkhddem bih.

logger.on("messageLogged", (data) => {
// 🔹 Katssma3 l’évènement smiytou "messageLogged".
// 🔹 Mlli had évènement yti7, had fonction katkhddem.

    console.log("Evenement capture :", data);
    // 🔹 Kat-affichi f console les données li tsifto m3a l’évènement.
});

logger.log("Application demarree !");
// 🔹 Kat3ayet l-fonction log() li kayn f class Logger.
// 🔹 f dak "logger.js", hadi ghaliban katsift évènement "messageLogged" b `.emit()`
// 🔹 w had listener li lfo9 kaytsma3 lih w kay-affichi message.






// 🟢résumé
// Had code kayst3mel class Logger li katsift évènement "messageLogged" mlli kat3ayet 3la .log().
// Listener (.on()) kaytsma3 lih, w mlli l-event yti7, kay-affichi message b les données dyal log.