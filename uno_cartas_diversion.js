/**
 * Aplicació en ExpressJS que crea una API REST completa
 * @author
 * @version 0.1
 */


const express = require('express');
const { comprobar_jugador } = require('./funcions_comprovacions');
var comp = require('./funcions_comprovacions');
const path = require("path");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // per analitzar les peticions HTTP que portin JSON al body
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root


//Cartes originals
/*
const cartas = [
    { num: 2, color: 'vermell' },
    { num: 8, color: 'blau' },
    { num: 7, color: 'groc' },
    { num: 4, color: 'verd' }
];
*/
let cartas = [];
for (let index = 0; index <= 9; index++) {
    cartas.push({num : index , color : 'vermell'})
    cartas.push({num : index , color : 'blau'})
    cartas.push({num : index , color : 'groc'})
    cartas.push({num : index , color : 'verd'})
}


let jugadors = [];
let partidas = [];
//let pila = [];

app.post('/iniciarJoc/codiPartida', (req, res) => { //POST per començar la partida amb un ID



    if(req.body.idPartida == "")return res.send("Id de partida no pot ser null");;

    let partida_pre = comp.comprobar_partida(req.body.idPartida,partidas);
    if (partida_pre != undefined) {
        return res.send("La partida ja existeix. Uneix-t'hi");
    }

    let partida = { 'id': req.body.idPartida, 'cartas': Array.from(cartas) , "pila": pila=[], turno : 1 ,NumJugadores : 0 };
    partidas.push(partida);
    res.send(partida);
    console.log(partidas);
});

app.post('/unirse', (req, res) => { // POST per unir-se a la partida amb el codi i un nom d'usuari. Si el nom no existeix, crea un usuari amb aquest
    
    
    let partida = comp.comprobar_partida(req.body.idPartida,partidas);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    let jugador = comp.comprobar_jugador(req.body.idPartida,req.body.nombre,jugadors);
    if (jugador == undefined) {
        let jugador = { 'id': req.body.idPartida, 'nombre': req.body.nombre, 'numero' : partida.NumJugadores+1, 'cartasJugador': [] };
        jugadors.push(jugador);
        
        partida.NumJugadores+=1;
        console.log("Info de partidas "+JSON.stringify(partidas));
        return res.send("Jugador " + req.body.nombre);
        
    }
    else {
        return res.send("Jugador ja registrat");
    }
    
});
app.get('/obtenirCarta/:Usuari/:idPartida', (req, res) => { //GET per obtenir una carta aleatòria de l'array cartas, utilitzant Math.random
    
    
    let partida = comp.comprobar_partida(req.params.idPartida,partidas);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    
    
    let jugador = comp.comprobar_jugador(req.params.idPartida, req.params.Usuari,jugadors);
    if ( jugador == undefined) {
        return res.send("Usuario o codi de partida incorrecte");
    }

    let carta = partida.cartas[Math.floor(Math.random() * partida.cartas.length)];
    let indice = partida.cartas.indexOf(carta);
    partida.cartas.splice(indice, 1);   
    jugador.cartasJugador.push(carta);
    res.send(jugador.cartasJugador);

});


app.put('/tirarCarta', (req, res) => { //GET per obtenir una carta aleatòria de l'array cartas, utilitzant Math.random
    
    
    let partida = comp.comprobar_partida(req.body.idPartida,partidas);
    //console.log(partida);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }

    let jugador = comp.comprobar_jugador(req.body.idPartida, req.body.Usuari,jugadors);
    if ( jugador == undefined) {
        return res.send("Usuario o codi de partida incorrecte");
    }

    if( jugador.numero !== partida.turno){
        return res.send("No es el turno del usuario, tu turno es el: " +jugador.numero+" y el turno actual es el "+partida.turno);
    }

    //Verificar si color i numero de carta existeixen

    
    let indice = jugador.cartasJugador.indexOf({"num" : req.body.num, "color" : req.body.color });
    let carta = jugador.cartasJugador.find( fruta => fruta.num == req.body.num && fruta.color == req.body.color  );
    
    
    //console.log({num : req.body.num*1, color : req.body.color });
    //console.log(indice);
    if(carta != undefined ){

        let indice = jugador.cartasJugador.indexOf(carta);
        console.log("Carta a llençar "+indice+" "+JSON.stringify(jugador.cartasJugador[indice]));
        //jugador.cartasJugador[indice];

        partida.pila.push(carta);
        //res.send("Ta bien");
        jugador.cartasJugador.splice(indice, 1);
        console.log("Info de la pila "+JSON.stringify(partida.pila));


        //Cambiar turno

        if(partida.turno+1 > partida.NumJugadores){
            partida.turno=1;
        }
        else{
            partida.turno +=1;
        }
        console.log("Turno actual: "+partida.turno);
        return res.send(jugador.cartasJugador);
        
    }
    else{
        return res.send("No existeix la carta");
    }
    
    
    //console.log(partida);

    //console.log(jugador.cartasJugador);
    

});


app.get('/comprobarPila/:idPartida', (req, res) => { //
    console.log(req.params);
    let partida = comp.comprobar_partida(req.params.idPartida,partidas);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    let pila = partida.pila;
    res.send(pila);

});

app.get('/comprobarCartas/:Usuari/:idPartida', (req, res) => { //

    let partida = comp.comprobar_partida(req.params.idPartida,partidas);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    let jugador = comp.comprobar_jugador(req.params.idPartida, req.params.Usuari,jugadors);
    if ( jugador == undefined) {
        return res.send("Usuario o codi de partida incorrecte");
    }
    res.send(jugador.cartasJugador);


});

app.delete('/acabarJoc/:idPartida', (req, res) => { //
    let partida = comp.comprobar_partida(req.params.idPartida,partidas);
    if (partida == undefined) {
        return res.send("Partida no existeix");
    }
    let index = partidas.indexOf(partida)
    partidas.splice(index, 1);
    res.send("Partida eliminada");
    
});

app.listen(3000, () => console.log('inici servidor'));