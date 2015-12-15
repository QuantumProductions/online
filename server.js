var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logic = require('./logic');
var hostedGame = require('./host');

var game = new hostedGame.HostedGame({'sockets' : io.sockets});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function() {
  console.log('listening');
});

connect = function(socket) {
  game.connectPlayer(socket);
  console.log("game.things['players']" + game.things['players']);;
}

io.on('connection', function(socket) {
  console.log('connected'); //extrac

  connect(socket);
  //game.connectPlayer(socket);
  //console.log("game.things['players']" + game.things['players']);;
// socket.emit("game.things", game.things);

  // socket.on('input', function(data) {
  //   game.input(socket, data);
  // });
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
    var updates = game.loop();
    //emit things
    io.sockets.emit('player-positions', logic.players);
    //io.to specific player
    loopAsync();
  }

}

loopAsync();


