/**
 * Aplicació en ExpressJS que crea una API REST completa
 * @author 
 * @version 0.1
 */


 const express = require('express');
 const app=express();
 
 app.use(express.urlencoded({extended: true}));
 app.use(express.json()) // per analitzar les peticions HTTP que portin JSON al body
 
 //Cartes originals
 const cartas = [
     {color:'vermell', num:2},
     {color:'blau', num:8},
     {color:'groc', num:7},
     {color:'verd', num:4},
 ];

 let partidas = [];

 const pila = []



app.post('/iniciarJoc/codiPartida', (req, res)=>{ //POST per començar la partida amb un ID
    let partida={'id': req.body.idPartida, 'cartas': cartas, "pila" : pila } ;
    partidas.push(partida);
    res.send(partida);
    console.log(partida);
});

app.get('/obtenirCarta/:codiPartida', (req, res)=>{ //GET per obtenir una carta aleatòria de l'array cartas, utilitzant Math.random
    let partida = partidas.find(a =>a.id===req.params.codiPartida); 
    let carta = partida.cartas[Math.floor(Math.random()*partida.cartas.length)];
    res.send(carta);

});

app.get('/comprobarPila/:codiPartida', (req, res)=>{ //
    let partida = partidas.find(a =>a.id===req.params.codiPartida);
    let pila = partida.pila;
    res.send(pila);

});
    
 
app.listen(3000, ()=>console.log('inici servidor'));