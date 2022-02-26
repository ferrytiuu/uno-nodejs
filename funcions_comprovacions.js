
module.exports = {
    comprobar_partida: function (idPartida,partidas) {
        if(idPartida == "")return undefined;
        let partida = partidas.find(a => a.id == idPartida);
        return partida;
    },
    comprobar_jugador: function (idPartida,nombre,jugadors) {
        let jugador = jugadors.find(a => a.id === idPartida && a.nombre === nombre);
        return jugador;
    }
    
  };
  
// var server = require("./ex06_mitjana.js");