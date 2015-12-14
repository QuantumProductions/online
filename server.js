var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logic = require('./logic');
var hostedGame = require('./host');

var game = new hostedGame.HostedGame({'sockets' : io.sockets});
//game.add('p1', {'foo' : 3});
console.log(game.things);

app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function() {
  console.log('listening');
});


io.on('connection', function(socket) {
  console.log('connected'); //extrac

  game.connectPlayer(socket);

  console.log("game.things['players']" + game.things['players']);;
  socket.emit("game.things", game.things);

  socket.on('input', function(data) {
    //update input for player
    logic.input(socket, data);
  });
});

var loopAsync = function() {
  setTimeout(loop, 10);
  //setImmediate(loop);
}

var now = Date.now();
var last = now;
var dt = 0.00;
var rate = 10;

function loop() {
  //process input
  //game.loop();
  
  now = Date.now();
  var delta = now - last;
  last = now;

  dt = dt + delta;

  if (dt < rate) {
    loopAsync();
    return;
  } else {
    dt -= rate;
    //if dt still > rate, repeat the following while true
    var updates = logic.loop();
    io.sockets.emit('player-positions', logic.players);
    //io.to specific player
    loopAsync();
  }

}

loopAsync();


