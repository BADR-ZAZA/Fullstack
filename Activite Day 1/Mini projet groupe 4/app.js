import modules from "./contactService.js"; 
import formaterContact from "./utils/format.js";

modules.ajouterContact("Alice", "0600000000");
modules.ajouterContact ("Bob", "0611111111");

modules.listerContacts().forEach(c => console.log(formaterContact(c)));