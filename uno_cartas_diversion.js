/**
 * Aplicació en ExpressJS que crea una API REST completa
 * @author 
 * @version 0.1
 */


const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // per analitzar les peticions HTTP que portin JSON al body

//Cartes originals
const cartas = [
    { num: 2, color: 'vermell' },
    { num: 8, color: 'blau' },
    { num: 7, color: 'groc' },
    { num: 4, color: 'verd' }
];


let jugadors = [];
let partidas = [];
let pila = [];

app.post('/iniciarJoc/codiPartida', (req, res) => { //POST per començar la partida amb un ID
    let partida = { 'id': req.body.idPartida, 'cartas': cartas, "pila": pila };
    partidas.push(partida);
    res.send(partida);
    console.log(partida);
});

app.post('/unirse', (req, res) => { // POST per unir-se a la partida amb el codi i un nom d'usuari. Si el nom no existeix, crea un usuari amb aquest
    let partida = partidas.find(a => a.id === req.body.idPartida);
    console.log(partida);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    let jugador = jugadors.find(a => a.id === req.body.idPartida && a.nombre === req.body.nombre);
    if (jugador == undefined) {
        let jugador = { 'id': req.body.idPartida, 'nombre': req.body.nombre, 'cartasJugador': [] };
        jugadors.push(jugador);
        return res.send("Jugador " + req.body.nombre);
    }
    else {
        return res.send("Jugador ja registrat");
    }
});
app.get('/obtenirCarta/:Usuari/:codiPartida', (req, res) => { //GET per obtenir una carta aleatòria de l'array cartas, utilitzant Math.random
    let jugador = verificarUsuario(req.params.codiPartida, req.params.Usuari)
    if ( jugador == undefined) {
        return res.send("Usuario o codi de partida incorrecte");
    }
    let partida = partidas.find(a => a.id === req.params.codiPartida);
    let carta = partida.cartas[Math.floor(Math.random() * partida.cartas.length)];
    
    let indice = partida.cartas.indexOf(carta);
    partida.cartas.splice(indice, 1);
    
    //console.log(partida);

    jugador.cartasJugador.push(carta);

    //console.log(jugador.cartasJugador);
    res.send(jugador.cartasJugador);

});


app.put('/tirarCarta/:Usuari/:codiPartida/:numero/:color', (req, res) => { //GET per obtenir una carta aleatòria de l'array cartas, utilitzant Math.random
    let partida = partidas.find(a => a.id === req.body.codiPartida);
    console.log(partida);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }

    let jugador = verificarUsuario(req.body.codiPartida, req.body.Usuari)
    if ( jugador == undefined) {
        return res.send("Usuario o codi de partida incorrecte");
    }

    //Verificar si color i numero de carta existeixen

    
    let indice = jugador.cartasJugador.indexOf({num :req.body.num, color : req.body.color });
    if(indice !=1){
        console.log("Carta a llençar "+jugador.cartasJugador[indice])
        jugador.cartasJugador[indice];

        partida.pila.push(jugador.cartasJugador[indice]);
        res.send("Ta bien");
    }
    else{
        return res.send("No existeix la carta");
    }
    partida.cartas.splice(indice, 1);
    
    //console.log(partida);

    jugador.cartasJugador.push(carta);

    //console.log(jugador.cartasJugador);
    res.send(jugador.cartasJugador);

});



app.get('/comprobarPila/:codiPartida', (req, res) => { //
    let partida = partidas.find(a => a.id === req.params.idPartida);
    let pila = partida.pila;
    res.send(pila);

});

function verificarUsuario(idPartida, nombre) {
    let jugador = jugadors.find(a => a.id === idPartida && a.nombre === nombre);
    return jugador;
}


app.listen(3000, () => console.log('inici servidor'));