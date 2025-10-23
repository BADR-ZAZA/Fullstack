const EventEmitter = require("events");
// 🔹 Katjib module "events" bach tkhddem b système dyal événements f Node.js.

class Logger extends EventEmitter {
// 🔹 Katcréyi class smitha "Logger" li katwarat (extends) men "EventEmitter".
// 🔹 Hada kaykhlik l-class tkoun 3andha qodra tsaft (emit) w tsma3 (on) les events.

    log(message) {
        console.log("LOG :", message);
        // 🔹 Kat-affichi message f console (b7al log normal).

        this.emit("messageLogged", { message , date: new Date() });
        // 🔹 Kat3ayet (tsift) événement smiyto "messageLogged" m3a données (message + date actuelle).
    }
}

module.exports = Logger;





// 🔹 Kat-exporti class Logger bach n9dru n3aytu liha men fichiers akhrin (b7al f app principale).
// 🟢 B résumé:
// Had code kaycréyi class Logger li katsift wa7d event smiyto "messageLogged" mlli kat3ayet l-function .log().
// Hiya kat-affichi message f console w kat3ti data (message + date).
// Tqdr t-sta3mlha f fichier akhor bach tsma3 had l-event w t3mel 3lih chi action.