const fs = require("fs");
// 🔹 Katjib module "fs" bach tkhddem b les fichiers (tktb, tqra, tmsa7...).

const EventEmitter = require("events");
// 🔹 Katjib module "events" bach tsta3ml système dyal l-événements f Node.js.

class Logger extends EventEmitter {
// 🔹 Katcréyi class smitha "Logger" li katwarat men "EventEmitter".
// 🔹 Hadchi kaykhlik tsta3ml .emit() w .on() f dak class.

    log(message) {
        fs.appendFileSync("log.txt", message + "\n");
        // 🔹 Katktb l-message li jaha f fichier "log.txt" (katzido f akhir fichier).

        this.emit("messageLogged", { message, date: new Date() });
        // 🔹 Kat3ayet (tsift) événement smiyto "messageLogged" m3a data (message w date actuelle).
    } }

module.exports = Logger;
// 🔹 Kat-exporti class Logger bach n9dru nsta3mloha f fichier akhor (b7al app.js).

