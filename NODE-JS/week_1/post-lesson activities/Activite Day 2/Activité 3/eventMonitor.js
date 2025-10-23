const EventEmitter = require("events"); // 🔹 Katjib module "events" li kaykhlik tkhddem b système dyal évènements f Node.js.

const emitter = new EventEmitter(); // 🔹 Katcréyi wa7d l’objet "emitter" bach n9dru nsiftu w nsma3u les évènements.

emitter.on("utilisateurConnecté", (data) => { // 🔹 Katssma3 l'évènement smiytou "utilisateurConnecté".
                                             // 🔹 Mlli had évènement yti7, had fonction katdkhl tkhddem.

console.log(`Nouvelle connexion : ${data.nom} ${data.id}`);   // 🔹 Kat-affichi message f console b smiya w ID dyal utilisateur li tconnecta.
});

emitter.emit("utilisateurConnecté", { id: 1, nom: "Asma" });  // 🔹 Kat3ayet (tsift) l'évènement "utilisateurConnecté" m3a données (id w nom).
                                                             // 🔹 Hadchi kaykhlik tjreb event listener li f lfo9.