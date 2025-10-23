const contacts = [];

function ajouterContact(nom, telephone) {
    contacts.push({ nom, telephone});
}

function listerContacts() {
    return contacts;
}

export default { ajouterContact, listerContacts };