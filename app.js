var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logic = require('./logic');

app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function() {
  console.log('listening');
});

// var players = {};

io.on('connection', function(socket) {
  console.log('connected');

  logic.connectPlayer(socket);
  console.log(players[socket.id]);

  socket.on('update', function(data) {
    console.log(data);
    socket.emit('update', state);
  });
});

var loopAsync = function() {
  setImmediate(loop);
}

function loop() {
  gameLoops++;
  var delta = Date.now() - last;
  last = Date.now();
  var currentState = {
    time: Date.now(),
    loopDelta: delta,
    loops: gameLoops
  };

  state = currentState;
  loopAsync();
}

var last = Date.now();
var gameLoops = 0;
var state = { time: Date.now(), loopDelta: 0, loops: gameLoops };
loopAsync();


