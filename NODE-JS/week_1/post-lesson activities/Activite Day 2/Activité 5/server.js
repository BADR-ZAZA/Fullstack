//l'importation dyal le module http li kaymknna ncreatew server web
const http = require('http');

// creation dyal server web had la methode katakhod fonction callback li katkon fiha request w response
const server = http.createServer((req, res) => {

    //verification dyal l'url li talabha l'utilisateur
    if (req.url === '/') {

        //hed lpartie katrad 3la l'utilisateur message simple
        res.write("bienvenue sur notre serveur Node.js !");

        res.end(); //katsali lresponse
        
        //verification si l'utilisateur talab l'url /api/etudiants
    } else if (req.url === '/api/etudiants') {
        //hed lpartie katrad 3la l'utilisateur liste dyal etudiants f format json

        res.writeHead(200, { 'Content-Type': 'application/json' });
        //radina liste dyal etudiants f format json

        res.end(JSON.stringify(["Assane", "Mamadou", "Oussama"]));
        //si l'url ma katmatchach m3a chi wa7da mn li fo9
    } else {
        //hed lpartie katrad 3la l'utilisateur message dyal erreur 404 
        res.writeHead(404);
        res.end("Page non trouvée");
    }   
});

//lancer le server 3la port 3000 w afficher message f console
server.listen(3000, () => console.log("Serveur en ecoute sur le port 3000 ..."));